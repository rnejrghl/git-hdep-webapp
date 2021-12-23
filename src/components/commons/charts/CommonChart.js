import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { getTwoToneColor } from 'antd/lib/icon/twoTonePrimaryColor';

const defaultOptions = {
  grid: {
    containLabel: true,
    left: 5,
    right: 5,
    top: 25,
    bottom: 0
  },
  legend: {
    left: 35,
    top: 0
  },
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'value'
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
  },
  series: []
};

const makeOptions = data => {
  return Object.keys(data).reduce(
    (result, key) => {
      if (Array.isArray(result[key])) {
        result[key] = data[key].map((item, idx) => {
          return {
            ...result[key][idx],
            ...data[key][idx]
          };
        });
      } else {
        result[key] = {
          ...result[key],
          ...data[key]
        };
      }
      return result;
    },
    { ...defaultOptions }
  );
};

function CommonChart(props) {
  const { chartData = [], width = '100%', height = 200, styles = {} } = props;

  const chartStyle = {
    ...styles,
    width: width.indexOf('%') > 0 ? width : `${width}px`,
    height: `${height || '200'}px`
  };

  return <ReactEcharts theme="light" option={makeOptions(chartData)} style={chartStyle} />;
}

export default CommonChart;
