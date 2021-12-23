import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import moment from 'moment';
import { service } from '@/configs';

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

function SpotPriceGraph(props) {
  const { chartData = {} } = props;
  const spotChartData = makeChartOptionsSpotChart(service.getValue(chartData, 'spotChartData', {}));

  return (
    <>
      <div>
        <ReactEcharts theme="light" option={spotChartData} style={{ width: '620px', height: '262px' }} />
      </div>
    </>
  );
}

export default SpotPriceGraph;
