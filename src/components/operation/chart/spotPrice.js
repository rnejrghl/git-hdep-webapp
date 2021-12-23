import React, { useCallback, useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Col, Row } from 'antd';
import echarts from 'echarts';
import moment from 'moment';
import styled from 'styled-components';
import { Fetcher, locale, service } from '@/configs';
import { api } from '../configs';

const StyledDivTitle = styled.div`
  margin-bottom: 10px;
  font-weight: bold;
`;

const StyledDivWapper = styled.div`
  margin-top: '12px';
`;

const StyledDivBar = styled.div`
  display: inline-block;
  height: 30px;
  width: 8px;
  border-radius: 6px;
  background-color: ${styleProps => styleProps.color};
  vertical-align: middle;
  margin-right: 5px;
`;

const StyledDotWrapper = styled.div`
  display: inline-block;
  height: 30px;
  width: 8px;
  vertical-align: middle;
  margin-right: 5px;
`;

const StyledDotDiv = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-bottom: 3px;
  background-color: ${styleProps => styleProps.color};
`;

const StyledDivVal = styled.div`
  font-weight: 700;
  font-size: 20px;
  vertical-align: middle;
  display: inline-block;
`;

const StyledDivUnit = styled.div`
  display: inline-block;
  font-size: 9px;
  vertical-align: bottom;
  margin-left: 5px;
`;
const lang = service.getValue(locale, 'languages', {});

const makeChartOptionsSpotChart = data => {
  const xAxis = [];
  const rrp = [];
  const demand = [];
  const crRrp = [];
  const frRrp = [];
  const crDemand = [];
  const frDemand = [];
  let forcastPoint = '';

  if (data.length > 0) {
    //finalIndex_Y 마지막 Y 번쨰 index 추출 (중간에 N 있어도 마지막 Y INDEX찾음)
    const index = data
      .slice()
      .reverse()
      .findIndex(item => item['currentYn'] === 'Y');
    const count = data.length - 1;
    const finalIndex_Y = index >= 0 ? count - index : index;

    // 현재시점이 마지막인 날짜 추출
    forcastPoint = data
      .filter((item, index) => index === finalIndex_Y)
      .map(item => item.lastChngDtti)
      .join();

    data.map((item, index) => {
      xAxis.push(moment(item.lastChngDtti, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm'));
      rrp.push(item.rrp);
      demand.push(item.demand);

      // 마지막 Y 번째 전까지는 현재 시점이므로 현재시점으로 PUSH
      if (index < finalIndex_Y) {
        crRrp.push(item.rrp);
        frRrp.push(0);
        crDemand.push(item.demand);
        frDemand.push(0);
      } else if (index == finalIndex_Y) {
        crRrp.push(item.rrp);
        frRrp.push(item.rrp);
        crDemand.push(item.demand);
        frDemand.push(item.demand);
      } else {
        // 마지막 Y 번째 이후는 미래DATA 이므로 미래시점으로 PUSH
        frRrp.push(item.rrp);
        frDemand.push(item.demand);
      }
      return '';
    });
  }

  const rrpRange = rrp.map(i => Math.ceil(i));
  const demandRange = demand.map(i => Math.ceil(i));

  return {
    grid: {
      containLabel: true,
      top: 50,
      right: 15,
      bottom: 40,
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
      trigger: 'axis',
      formatter: function(name) {
        return name
          .filter(item => item.value !== 0)
          .map((item, index) => {
            let view = '';
            if (index == 0) {
              view = item.axisValue + '<br>';
            }
            return (view += item.marker + item.seriesName + ':' + item.value + '<br>');
          })
          .join(' ');
      }
    },
    legend: {
      show: true,
      top: 0,
      left: 0,
      data: ['PRICE', 'DEMAND', 'PRICE FORECAST', 'DEMAND FORECAST'],
      backgroundColor: '#f3f3f6'
    },
    color: ['rgb(255 135 0)', 'rgb(201, 126, 108)', 'rgb(0 101 108)', 'rgb(2, 95, 179)'],
    xAxis: [
      {
        data: xAxis,
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          inside: false,
          margin: 10,
          fontSize: 8
        }
      }
    ],
    yAxis: [
      {
        title: 'PRICE',
        type: 'value',
        name: 'PRICE ($/MWh)',
        nameLocation: 'middle',
        nameGap: 31,
        max: Math.max(...rrpRange) + 30,
        min: Math.min(...rrpRange),
        axisTick: {
          show: false
        },
        axisLabel: {
          inside: false,
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        max: Math.max(...demandRange),
        min: Math.min(...demandRange),
        name: 'DEMAND (MW)',
        nameLocation: 'middle',
        nameGap: 45,
        axisLabel: {
          inside: false,
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: 'PRICE',
        data: crRrp,
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: 'rgb(255 135 0)'
        },
        markLine: {
          symbol: 'none',
          data: [{ xAxis: moment(forcastPoint).format('YYYY-MM-DD HH:mm') }],
          label: {
            normal: {
              show: true,
              formatter: 'Forecast',
              textStyle: {
                color: 'grey',
                fontSize: 12,
                fontWeight: 500,
                padding: [0, 0, 1, 0]
              }
            }
          },
          lineStyle: {
            normal: {
              type: 'dotted',
              color: 'grey',
              width: 4
            }
          }
        }
      },
      {
        name: 'PRICE FORECAST',
        data: frRrp,
        type: 'line',
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 2,
          color: 'rgb(201, 126, 108)',
          type: 'dotted'
        }
      },
      {
        name: 'DEMAND',
        data: crDemand,
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        showSymbol: false,
        lineStyle: {
          width: 1.5,
          color: 'rgb(0 101 108)'
        },
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(112 195 201)'
            },
            {
              offset: 1,
              color: 'rgb(0 101 108)'
            }
          ])
        }
      },
      {
        name: 'DEMAND FORECAST',
        data: frDemand,
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1.5,
          color: 'rgb(2, 95, 179)',
          type: 'dotted'
        },
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(112 195 201)'
            },
            {
              offset: 1,
              color: 'rgb(0 101 108)'
            }
          ])
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
        magicType: { type: ['bar', 'line'], title: { line: 'Line', bar: 'Bar' } }
      }
    }
  };
};

function SpotPrice(props) {
  const [chartData, setChartData] = useState({});

  const [crPrice, setCrPrice] = useState(0);
  const [crDemand, setCrDemand] = useState(0);
  const [frPrice, setFrPrice] = useState(0);
  const [frDemand, setFrDemand] = useState(0);

  const getSpotPriceGraph = useCallback(() => {
    const obj = api.getSpotPriceGraph();
    Fetcher.get(obj.url, obj.params).then(result => {
      setChartData(service.getValue(result, `data`, {}));
    });
  }, []);

  useEffect(() => {
    getSpotPriceGraph();
  }, []);

  const spotChartData = makeChartOptionsSpotChart(service.getValue(chartData, 'spotChartData', {}));

  useEffect(() => {
    if (Object.keys(chartData).length > 0) {
      //finalIndex_Y 마지막 Y 번쨰 index 추출 (중간에 N 있어도 마지막 Y INDEX찾음)
      const index = chartData.spotChartData
        .slice()
        .reverse()
        .findIndex(item => item['currentYn'] === 'Y');
      const count = chartData.spotChartData.length - 1;
      const finalIndex_Y = index >= 0 ? count - index : index;

      const crData = chartData.spotChartData.filter((item, index) => index === finalIndex_Y);
      const frData = chartData.spotChartData.filter((item, index) => index === finalIndex_Y + 1);
      setCrPrice(crData.map(data => data.rrp));
      setCrDemand(Math.round(crData.map(data => data.demand)).toLocaleString());
      setFrPrice(frData.map(data => data.rrp));
      setFrDemand(Math.round(frData.map(data => data.demand)).toLocaleString());
    }
  }, [chartData]);

  return (
    <>
      <div style={{ fontSize: '30px', padding: '10px' }}>(NSW) Spot Price & Demand</div>
      <Row type="flex" justify="space-around" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col span={5}>
          <StyledDivTitle>CURRENT SPOT PRICE</StyledDivTitle>
          <StyledDivWapper>
            <StyledDivBar color="rgb(255 135 0)"></StyledDivBar>
            <StyledDivVal>${crPrice}</StyledDivVal>
            <StyledDivUnit>(/MWH)</StyledDivUnit>
          </StyledDivWapper>
        </Col>
        <Col span={5}>
          <StyledDivTitle>CURRENT DEMAND</StyledDivTitle>
          <StyledDivWapper>
            <StyledDivBar color="rgb(0 101 108)"></StyledDivBar>
            <StyledDivVal>{crDemand}</StyledDivVal>
            <StyledDivUnit>(MW)</StyledDivUnit>
          </StyledDivWapper>
        </Col>
        <Col span={5}>
          <StyledDivTitle>
            FORECAST PRICE <br /> (NEXT 30MIN)
          </StyledDivTitle>
          <StyledDivWapper>
            <StyledDotWrapper>
              <StyledDotDiv color="rgb(201, 126, 108)"></StyledDotDiv>
              <StyledDotDiv color="rgb(201, 126, 108)"></StyledDotDiv>
              <StyledDotDiv color="rgb(201, 126, 108)"></StyledDotDiv>
            </StyledDotWrapper>
            <StyledDivVal>${frPrice}</StyledDivVal>
            <StyledDivUnit>(/MWH)</StyledDivUnit>
          </StyledDivWapper>
        </Col>
        <Col span={5}>
          <StyledDivTitle>
            FORECAST DEMAND <br /> (NEXT 30MIN)
          </StyledDivTitle>
          <StyledDivWapper>
            <StyledDotWrapper>
              <StyledDotDiv color="rgb(2, 95, 179)"></StyledDotDiv>
              <StyledDotDiv color="rgb(2, 95, 179)"></StyledDotDiv>
              <StyledDotDiv color="rgb(2, 95, 179)"></StyledDotDiv>
            </StyledDotWrapper>
            <StyledDivVal>{frDemand}</StyledDivVal>
            <StyledDivUnit>(MW)</StyledDivUnit>
          </StyledDivWapper>
        </Col>
      </Row>
      <div>
        <ReactEcharts theme="light" option={spotChartData} style={{ width: '800px', height: '480px', marginLeft: '10px', marginRight: '10px' }} />
      </div>
    </>
  );
}

export default SpotPrice;
