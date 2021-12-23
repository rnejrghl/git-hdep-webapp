import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useParams } from 'react-router-dom';
import echarts from 'echarts';

import { DatePicker, Row, Col, Typography } from 'antd';
import moment from 'moment';
import { CommonChart } from '@/components/commons';

import { fetch } from '@/store/actions';
import { service, api, Fetcher } from '@/configs';

import { api as localApi } from '../configs';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const makeChartOptions = (data, label) => {
  const xAxis = [];
  const yAxis = [];
  if (data.length > 0) {
    data.map(item => {
      xAxis.push(moment(item.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm'));
      yAxis.push(item.amount);

      return '';
    });
  }

  return {
    grid: {
      top: 30,
      right: 15,
      bottom: 60,
      left: 15
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      show: true,
      top: 0,
      left: 0,
      data: [label],
      backgroundColor: '#f3f3f6'
    },
    xAxis: {
      data: xAxis,
      type: 'category',
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      splitNumber: 6,
      axisTick: {
        show: false
      },
      axisLabel: {
        inside: false,
        formatter: '{value}'
      }
    },
    dataZoom: [
      {
        type: 'slider',
        filterMode: 'filter'
      },
      {
        type: 'inside',
        filterMode: 'filter'
      }
    ],

    series: [
      {
        name: label,
        data: yAxis,
        type: 'bar',
        showSymbol: false,
        lineStyle: {
          width: 1.5
        },
        areaStyle: {
          opacity: 0.7,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#d4ebfe'
            },
            {
              offset: 1,
              color: '#e8f3fc'
            }
          ])
        }
      }
    ]
  };
};

function Container() {
  const dispatch = useDispatch();

  // params
  const { siteId } = useParams();

  // state
  const [rangeDate, setRangeDate] = useState({
    startDate: moment()
      .subtract(7, 'd')
      .format('YYYYMMDD'),
    endDate: moment().format('YYYYMMDD')
  });
  const [siteDetail, setSiteDetail] = useState({ siteId });
  const [productions, setProductions] = useState({});

  const chartProductionData = makeChartOptions(productions, `${siteId}(kWH)`);

  const disabledDate = current => {
    return current && current.isAfter(moment(), 'day');
  };

  const getSiteDetail = api.getSiteDetail(siteId);
  const getProductions = localApi.getSiteProductions(siteId, { startDate: rangeDate.startDate, endDate: rangeDate.endDate });

  // effect Hook
  useEffect(() => {
    Fetcher.get(getSiteDetail.url, getSiteDetail.params).then(result => {
      setSiteDetail(service.getValue(result, `data`, {}));
    });
  }, []);

  useEffect(() => {
    Fetcher.get(getProductions.url, getProductions.params).then(result => {
      setProductions(service.getValue(result, `data.hourly`, {}));
    });
    return () => {};
  }, [rangeDate.startDate, rangeDate.endDate]);

  return (
    <div style={{ padding: '2rem' }}>
      <Row gutter={10} style={{ marginBottom: '1rem' }}>
        <Col span={10}>
          <Title level={3}>{siteDetail.userName}</Title>
        </Col>
        <Col span={6} offset={8}>
          <RangePicker
            allowClear={false}
            disabledDate={disabledDate}
            value={[moment(rangeDate.startDate), moment(rangeDate.endDate)]}
            onChange={p => {
              setRangeDate({
                startDate: p[0].format('YYYYMMDD'),
                endDate: p[1].format('YYYYMMDD')
              });
            }}
          />
        </Col>
      </Row>
      <CommonChart height={600} chartData={chartProductionData} />
    </div>
  );
}

export default Container;
