import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { Skeleton } from 'antd';

const defaultOptions = {
  color: ['#009873', 'red', '#93939a'],
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    bottom: 0,
    left: 'center',
    selectedMode: false
    // data: [`${service.getValue(lang, 'LANG00003', 'no-text')}`, `${service.getValue(lang, 'LANG00004', 'no-text')}`, `${service.getValue(lang, 'LANG00005', 'no-text')}`]
  },
  series: [
    {
      name: 'Status',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        formatter: '{c}',
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '30',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
};

function CommonPieChart(props) {
  const { chartData = [] } = props;

  const options = {
    ...defaultOptions,
    legend: {
      ...defaultOptions.legend,
      formatter: p => {
        const matchedData = chartData
          ? chartData.find(item => {
              return item.name === p;
            })
          : {};

        return `${matchedData.name}: ${matchedData.value}`;
      }
    },
    series: [
      {
        ...defaultOptions.series[0],
        data: chartData
      }
    ]
  };

  return (
    <Skeleton loading={chartData && !chartData.length}>
      <ReactEcharts theme="light" option={options} style={{ width: '100%', height: 190, top: '-10px' }} />
    </Skeleton>
  );
}

export default CommonPieChart;
