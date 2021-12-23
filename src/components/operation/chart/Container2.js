import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import ReactEcharts from 'echarts-for-react';
import { useParams } from 'react-router-dom';
import echarts from 'echarts';

import { DatePicker, Row, Col, Typography } from 'antd';
import moment from 'moment';
import { CommonChart } from '@/components/commons';

import { fetch } from '@/store/actions';
import { locale, service, api, Fetcher } from '@/configs';

import { api as localApi } from '../configs';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const lang = service.getValue(locale, 'languages', {});

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
      data: label,
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

const makeChartOptionsEss = data => {
  const xAxis = [];
  const batChar = [];
  const batDisc = [];
  const ivtDc = [];
  const loadPower = [];
  const batSoc = [];

  if (data.length > 0) {
    data.map(item => {
      xAxis.push(moment(item.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm'));
      batChar.push(item.batChar);
      ivtDc.push(item.ivtDc);
      batDisc.push(item.batDisc);
      loadPower.push(item.loadPower);
      batSoc.push(item.batPower * 100);

      return '';
    });
  }

  return {
    grid: {
      containLabel: true,
      top: 30,
      right: 15,
      bottom: 60,
      left: 15
    },
    dataZoom: [
      {
        type: 'inside',
        filterMode: 'filter'
      },
      {
        type: 'slider',
        filterMode: 'filter'
      }
    ],
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      // orient: 'vertical',
      show: true,
      top: 0,
      left: 0,
      data: ['DC(kW)', 'Battery SOC(%)', service.getValue(lang, 'LANG00034', 'no-text') + ' ' + service.getValue(lang, 'LANG00253', 'no-text') + ' power', service.getValue(lang, 'LANG00034', 'no-text') + ' ' + service.getValue(lang, 'LANG00340', 'no-text') + ' power'],
      backgroundColor: '#f3f3f6'
    },
    xAxis: {
      data: xAxis,
      type: 'category',
      boundaryGap: false
    },
    yAxis: [
      {
        type: 'value',
        min: -4,
        max: 8,
        interval: 2,
        splitNumber: 7,
        axisTick: {
          show: false
        },
        axisLabel: {
          inside: false,
          formatter: '{value} kW'
        }
      },
      {
        type: 'value',
        min: -50,
        max: 100,
        interval: 25,
        splitNumber: 7,
        axisTick: {
          show: false
        },
        axisLabel: {
          inside: false,
          formatter: '{value} %'
        }
      }
    ],
    series: [
      {
        name: 'DC(kW)', //+ service.getValue(lang, 'LANG00407', 'no-text')
        data: ivtDc,
        type: 'line',
        showSymbol: false,
        lineStyle: {
          width: 2.3
        }
        // areaStyle: {
        //   opacity: 0.7,
        //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     {
        //       offset: 0,
        //       color: '#ff4f5d'
        //     },
        //     {
        //       offset: 1,
        //       color: '#ff4f5d'
        //     }
        //   ])
        // }
      },
      {
        name: service.getValue(lang, 'LANG00034', 'no-text') + ' ' + service.getValue(lang, 'LANG00253', 'no-text') + ' power', //13126 배터리 충전 power
        data: batChar,
        type: 'line',
        showSymbol: false,
        lineStyle: {
          width: 1.5
        },
        areaStyle: {
          opacity: 0.7,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#6de0f5'
            },
            {
              offset: 1,
              color: '#6de0f5'
            }
          ])
        }
      },
      {
        name: service.getValue(lang, 'LANG00034', 'no-text') + ' ' + service.getValue(lang, 'LANG00340', 'no-text') + ' power', //13150 배터리 방전 power
        data: batDisc,
        type: 'line',
        showSymbol: false,
        lineStyle: {
          width: 1.5
        },
        areaStyle: {
          opacity: 0.7,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#fff384'
            },
            {
              offset: 1,
              color: '#fff384'
            }
          ])
        }
      },
      // {
      //   name: 'Load Power(kW)',
      //   data: loadPower,
      //   type: 'line',
      //   showSymbol: false,
      //   lineStyle: {
      //     width: 2.3
      //   },
      // },
      {
        name: 'Battery SOC(%)',
        data: batSoc,
        type: 'line',
        yAxisIndex: 1,
        showSymbol: false,
        lineStyle: {
          width: 2.3
        }
      }
    ],
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
          title: { zoom: 'Zoom', back: 'Zoom-Out' }
        },
        magicType: { type: ['bar', 'line'], title: { line: 'Line', bar: 'Bar' } },
        restore: { title: 'Reset' }
      }
    }
  };
};

const getLabels = label => {
  const labels = [];
  if (label == 'A') {
    labels.push(service.getValue(lang, 'LANG00342', 'no-text'));
  } else {
    labels.push('DC(kW)');
    labels.push(service.getValue(lang, 'LANG00034', 'no-text') + ' ' + service.getValue(lang, 'LANG00253', 'no-text') + ' power');
    labels.push(service.getValue(lang, 'LANG00034', 'no-text') + ' ' + service.getValue(lang, 'LANG00340', 'no-text') + ' power');
    labels.push('Load Power(kW)');
    labels.push('Battery SOC(%)');
  }
  return labels;
};

function Container2() {
  const dispatch = useDispatch();
  // params
  const { siteId, rescGubn } = useParams();

  // state
  const [rangeDate, setRangeDate] = useState({
    startDate: moment()
      .subtract(3, 'd')
      .format('YYYYMMDD'),
    endDate: moment().format('YYYYMMDD')
  });
  const [siteDetail, setSiteDetail] = useState({ siteId });
  const [productions, setProductions] = useState({});

  const chartRealPower = makeChartOptions(service.getValue(productions, 'realPower', {}), getLabels(rescGubn));
  const chartRealPowerEss = makeChartOptionsEss(service.getValue(productions, 'realPower', {}));

  const disabledDate = current => {
    return current && current.isAfter(moment(), 'day');
  };

  const getSiteDetail = api.getSiteDetail(siteId);
  const getProductions = localApi.getSitePowerList(siteId, rescGubn, { startDate: rangeDate.startDate, endDate: rangeDate.endDate });

  // effect Hook
  useEffect(() => {
    Fetcher.get(getSiteDetail.url, getSiteDetail.params).then(result => {
      setSiteDetail(service.getValue(result, `data`, {}));
    });
  }, []);

  useEffect(() => {
    Fetcher.get(getProductions.url, getProductions.params).then(result => {
      setProductions(service.getValue(result, `data`, {}));
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
      {rescGubn === 'A' ? <CommonChart chartData={chartRealPower} height={600} /> : <ReactEcharts theme="light" option={chartRealPowerEss} style={{ height: 600 }} />}
    </div>
  );
}

export default Container2;
