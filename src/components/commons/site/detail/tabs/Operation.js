import React, { useCallback, useMemo } from 'react';
import { Card, Row, Col, Tag, Icon, Button } from 'antd';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import UAParser from 'ua-parser-js';
import axios from 'axios';

import moment from 'moment';

import { CommonChart, CustomIcon } from '@/components/commons';
import { locale, service, values, formats } from '@/configs';

import '@/styles/app/components/commons/site/Detail.scss';

import Info from '../Info';

import TabTimer from './TabTimer';

const parser = new UAParser();

const lang = service.getValue(locale, 'languages', {});

function plantAmount2(column, data, rescGubn) {
  return (
    <Col align="center" key={column.key} style={{ paddingLeft: 0, paddingRight: 0 }}>
      <Col align="center" className="amount2">
        {service.getValue(data, `${column.key}`, 0)} kW
      </Col>
      {service.getValue(column, 'comment', '') && rescGubn == 'B' ? (
        <Tag color={service.getValue(column, 'tagColor', '#000')} className="tag">
          {service.getValue(column, 'comment', '')}
        </Tag>
      ) : (
        ''
      )}
    </Col>
  );
}

function plantAmount(column, data, rescGubn) {
  let boxStyle = { width: '60px', height: '60px', display: 'inline-block', align: 'center' };
  let imgStyle = { width: '80%', height: '80%' };
  return (
    <Col span={8} align="top" key={column.key}>
      <Row align="top">
        <Col align="center">
          <Col align="center" style={boxStyle}>
            <img src={service.getValue(column, 'imgSrc', '')} alt={service.getValue(column, 'alt', '')} style={imgStyle} />
          </Col>
        </Col>
        <Col align="center">
          <Col className="label" align="center">
            {' '}
            {service.getValue(column, 'title', '')}
          </Col>
          <Col align="center" className="amount">
            {service.getValue(data, `${column.key}`, 0)} kW
          </Col>
          {service.getValue(column, 'comment', null) && rescGubn == 'B' ? (
            <Tag color={service.getValue(column, 'tagColor', '#000')} className="tag">
              {service.getValue(column, 'comment', '')}
            </Tag>
          ) : (
            ''
          )}
        </Col>
      </Row>
    </Col>
  );
}

const makeChartOptions = (data, label) => {
  const xAxis = [];
  const yAxis = [];
  if (data.length > 0) {
    data.map(item => {
      xAxis.push(moment(item.date, formats.timeFormat.FULLDATETIME).format(formats.timeFormat.TIME_MIN));
      yAxis.push(item.amount);

      return '';
    });
  }

  return {
    grid: {
      top: 30,
      right: 15,
      bottom: 40,
      left: 15
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      show: true,
      top: 0,
      left: 'center',
      data: label,
      backgroundColor: '#f3f3f6'
    },
    xAxis: {
      data: xAxis,
      type: 'category',
      boundaryGap: false
    },
    dataZoom: [
      {
        type: 'inside',
        filterMode: 'filter'
      }
    ],
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
        type: 'line',
        color: '#ffc000',
        showSymbol: false,
        lineStyle: {
          color : '#ffc000',
          width: 1.5
        },
        areaStyle: {
          opacity: 0.7,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#ffc000'
            },
            {
              offset: 1,
              color: '#ffc000'
            }
          ])
        }
      }
    ]
  };
};

const makeChartOptionsEss = (data, label) => {
  const xAxis = [];
  const batPower = [];
  const loadPower = [];
  const gridPower = [];
  const ivtDc = [];

  if (data.length > 0) {
    data.map(item => {
      xAxis.push(moment(item.date, formats.timeFormat.FULLDATETIME).format(formats.timeFormat.TIME_MIN));
      batPower.push(item.batPower);
      loadPower.push(item.loadPower);
      gridPower.push(item.gridPower);
      ivtDc.push(item.ivtDc);
      return '';
    });
  }

  return {
    grid: {
      top: 30,
      right: 15,
      bottom: 40,
      left: 15
    },
    tooltip: {
      trigger: 'axis'
    },
    dataZoom: [
      {
        type: 'inside',
        filterMode: 'filter'
      }
    ],
    toolbox:{
      show:false
    },
    legend: {
      show: true,
      top: 0,
      left: 'center',
      data: ['PV','Battery','Load','Grid'],
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
        name: 'PV', 
        data: ivtDc,
        type: 'line',
        showSymbol: false,
        color:'#ffc000',
        lineStyle: {
          width: 1.5,
          color : '#ffc000'
        },
        areaStyle: {
          opacity: 0.7,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#ffc000'
            },
            {
              offset: 1,
              color: '#ffc000'
            }
          ])
        }
      },
      {
        name: 'Battery',
        data: batPower,
        type: 'line',
        showSymbol: false,
        color: '#ed7d31',
        lineStyle: {
          width: 1.5,
          color :'#ed7d31'
        },
        areaStyle: {
          opacity: 0.7,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#ed7d31'
            },
            {
              offset: 1,
              color: '#ed7d31'
            }
          ])
        }
      },
      {
        name: 'Load',
        data: loadPower,
        type: 'line',
        showSymbol: false,
        color: '#70ad47',
        lineStyle: {
          width: 1.5,
          color :'#70ad47'
        },
        areaStyle: {
          opacity: 0.7,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#70ad47'
            },
            {
              offset: 1,
              color: '#70ad47'
            }
          ])
        }
      },
      {
        name: 'Grid',
        data: gridPower,
        type: 'line',
        showSymbol: false,
        color: '#5b9bd5',
        lineStyle: {
          width: 1.5,
          color :'#5b9bd5'
        },
        areaStyle: {
          opacity: 0.7,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#5b9bd5'
            },
            {
              offset: 1,
              color: '#5b9bd5'
            }
          ])
        }
      }
    ]
  };
};

const makePieChartEss = (data) => {

  const totalPV=service.getValue(data, 'totalPV', '0');
  const selfConsumpt=service.getValue(data, 'selfConsumpt', '0');
  const batCharge=service.getValue(data, 'batCharge', '0');
  const totalLoad=service.getValue(data, 'totalLoad', '0');
  const purEnergy=service.getValue(data, 'purEnergy', '0');
  const pvToHome=service.getValue(data, 'pvToHome', '0');

  const val_pv = parseFloat(totalPV);
  const val_pvHome = parseFloat(selfConsumpt);
  const val_pvBat = parseFloat(batCharge);
  let val_pvGrid=0
  if(val_pv>0&&(val_pv-val_pvHome-val_pvBat)>0){
  val_pvGrid = (val_pv-val_pvHome-val_pvBat).toFixed(2);
  } 

  const val_load = parseFloat(totalLoad);
  const val_gridHome = parseFloat(purEnergy);
  let val_other = 0;
  if(val_load>0&&(val_load-val_gridHome-val_pvHome)>0){
  val_other = (val_load-val_gridHome-val_pvHome).toFixed(2);
  } 

  const val_solarHome = parseFloat(pvToHome);

  return {
      title: [{
        text: `PV ${totalPV} kWh`,
        left: 90
      },
      {
        text: `LOAD ${totalLoad} kWh`,
        right: 70
      }],
      tooltip: {
        trigger: 'item',
        formatter: '{b} <br/>{c} kWh : ({d}%)'
      },
      color:['#70ad47','#ed7d31','#5b9bd5','#ffc000','#ed7d31','#5b9bd5'],
      series: [
        {
          name: 'PV',
          type: 'pie',
          radius: ['30%', '60%'],
          center: ['25%', '50%'],
          itemStyle: {
            borderRadius: 5
          },
          // emphasis: {
          //   label: {
          //     show: true
          //     // fontSize :'15',
          //     // fontWeight: 'bold'
          //   }
          // },
          data: [
            { value: val_pvHome, name: service.getValue(lang, 'LANG00444', '0') },
            { value: val_pvBat, name: service.getValue(lang, 'LANG00445', '1') },
            { value: val_pvGrid, name: service.getValue(lang, 'LANG00446', '2') }
          ]
        },
        {
          name: 'Load',
          type: 'pie',
          radius: ['30%', '60%'],
          center: ['75%', '50%'],
          itemStyle: {
            borderRadius: 5
          },
          data: [
            { value: val_pvHome, name: service.getValue(lang, 'LANG00447', '3') },
            { value: val_other, name: service.getValue(lang, 'LANG00448', '4') },
            { value: val_gridHome, name: service.getValue(lang, 'LANG00449', '5') }
          ]
        }
      ]
    };
  }

  const makePieChartPV = (data) => {

    const pvToHome=service.getValue(data, 'pvToHome', '0');
    const val_solarHome = parseFloat(pvToHome);
  
    return {
        title: {
          text: `PV ${pvToHome} kWh`,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/>{c} kWh : ({d}%)'
        },
        color:['#70ad47'],
        series: [
          {
            name: 'PV',
            type: 'pie',
            radius: ['40%', '70%'],
            // center: ['25%', '50%'],
            itemStyle: {
              borderRadius: 5
            },
            emphasis: {
              label: {
                show: true
                // fontSize :'15',
                // fontWeight: 'bold'
              }
            },
            data: [
              { value: val_solarHome, name: service.getValue(lang, 'LANG00444', '6') }
            ]
          }
        ]
      };
    }

// HDEP: 팝업 오픈
const onPopup = path => {
  return window.open(`${window.location.origin}${path}`, '_blank', `toolbar=yes,scrollbars=yes,location=no,resizable=yes,menubar=no,top=${window.screen.height / 2 - 700 / 2},left=${window.screen.width / 2 - 1440 / 2},width=1440,height=700,bottom=500`);
};

function CustomIcon2({ type, className = '', size = 'md', ...restProps }) {
  return (
    <svg className={`${className}`} {...restProps}>
      <use style={{ height: '100%', width: '100%' }} xlinkHref={`#${type.default.id}`} />
    </svg>
  );
}

const Operation = props => {
  const { rescGubn = 'A', dataSource = {}, siteId } = props;

  const styleProps_orange = {
    headStyle: { borderBottom: 0 },
    bodyStyle: { height: 'calc(100% - 73px)' },
    style: { height: '100%', border: '4px solid rgb(245, 136, 0)' }
  };

  const styleProps = {
    headStyle: { borderBottom: 0 },
    bodyStyle: { height: 'calc(100% - 73px)' },
    style: { height: '100%' }
  };

  const rowStyle = {
    marginBottom: '30px'
  };

  // const operMode=queryParamSettingTask_CONTROL();

  const getLabels = (rescGubn, chartType) => {
    const labels = [];
    if (rescGubn == 'A' && chartType == 'realPower') {
      labels.push('PV');
    } else if (rescGubn == 'B' && chartType == 'realPower') {
      labels.push('PV');
      labels.push(service.getValue(lang, 'LANG00034', 'no-text') + ' ' + service.getValue(lang, 'LANG00253', 'no-text'));
      labels.push(service.getValue(lang, 'LANG00034', 'no-text') + ' ' + service.getValue(lang, 'LANG00340', 'no-text'));
    } else if (chartType == 'realOutput') {
      labels.push(service.getValue(lang, 'LANG00016', 'no-text'));
    }
    return labels;
  };

  const isMobile = parser.getDevice().type === 'mobile';
  const fields = values.siteDetail.pages.operation.flow;

  const chartRealPower = makeChartOptions(service.getValue(dataSource, 'realPower', {}), getLabels(rescGubn, 'realPower'));
  const chartRealPowerEss = makeChartOptionsEss(service.getValue(dataSource, 'realPower', {}), getLabels(rescGubn, 'realPower'));
  const chartRealOutput = makeChartOptions(service.getValue(dataSource, 'realOutput', {}), getLabels(rescGubn, 'realOutput'));
  const pieChart = (rescGubn === 'A') ? makePieChartPV(service.getValue(dataSource, 'pieChartData', {})) :makePieChartEss(service.getValue(dataSource, 'pieChartData', {}));


  var disable = require('@/assets/empty.svg');

  var pv_home_to_solar = require('@/assets/operation/pv/home_solar.svg');
  var pv_solar_to_home = require('@/assets/operation/pv/solar_home.svg');

  var ess_home_to_solar = require('@/assets/operation/ess/home_solar2.svg');
  var ess_solar_to_home = require('@/assets/operation/ess/solar_home2.svg');

  var ess_solar_to_grid = require('@/assets/operation/ess/solar_grid.svg');
  var ess_grid_to_solar = require('@/assets/operation/ess/grid_solar.svg');

  var ess_battery_to_home = require('@/assets/operation/ess/battery_home.svg');
  var ess_home_to_battery = require('@/assets/operation/ess/home_battery.svg');

  var ess_grid_to_battery = require('@/assets/operation/ess/grid_battery.svg');
  var ess_battery_to_grid = require('@/assets/operation/ess/battery_grid.svg');

  //horizontal
  var ess_grid_to_home = require('@/assets/operation/ess/grid_home.svg');
  var ess_home_to_grid = require('@/assets/operation/ess/home_grid.svg');

  //vertical
  var ess_solar_to_battery = require('@/assets/operation/ess/solar_battery.svg');
  var ess_battery_to_solar = require('@/assets/operation/ess/battery_solar.svg');

  var powerData = service.getValue(dataSource, 'powerData', {});

  var pvPower = service.getValue(powerData, 'pvPower', 0);
  var batPower = service.getValue(powerData, 'batPower', 0); //13141 (SOC)
  var batHealth = service.getValue(powerData, 'batHealth', 0); //13142 (SOH)

  var opPower = service.getValue(powerData, 'opPower', 0); //PV
  var loadPower = service.getValue(powerData, 'loadPower', 0); //LOAD
  var gridPower = service.getValue(powerData, 'gridPower', 0); //ToGRID
  var batChar = service.getValue(powerData, 'batChar', 0); //CharBat
  var batDisc = service.getValue(powerData, 'batDisc', 0); //DiscBat
  var othEnergy = service.getValue(powerData, 'othEnergy', 0); //FromGRID

  console.log('FROM SERVER ====================');
  //console.log(powerData);

  //console.log(queryParamSettingTask_CONTROL())
  //test

  //pv,ess
  var PV = opPower; //24,13011
  var LOAD = loadPower; //13119
  var CharBat = batChar; //13126
  var DiscBat = batDisc; //13150
  var FromGRID = othEnergy; //13149
  var ToGRID = gridPower; //13121
  var BatPower = batPower; //13141 //SOC
  var BatHealth = batHealth; //13142 //SOH
  //console.log('CALCU ====================');

  //GRID
  var gridStatus = '';
  var gridValue = 0;
  if (othEnergy > 0) {
    //수전
    gridValue = othEnergy;
    gridStatus = 'Transmission';
  } else if (gridPower > 0) {
    //송전
    gridValue = gridPower;
    gridStatus = 'Receiving';
  } else {
    //정지
    gridValue = 0;
    gridStatus = 'OFF';
  }
  //console.log(gridValue); //gridValue

  //BATTERY
  var btStatus = '';
  var btValue = 0;
  if (batChar > 0) {
    //충전
    btValue = batChar;
    btStatus = 'Charging';
  } else if (batDisc > 0) {
    //방전
    btValue = batDisc;
    btStatus = 'Discharging';
  } else {
    //정지
    btValue = 0;
    btStatus = 'OFF';
  }

  //LINE VALUE
  var val_pvlineHomeSolarPV = pvPower;
  var val_pvlineHomeSolar = opPower;
  var val_lineHomeSolar = 0;
  var val_lineSolarGrid = 0;
  var val_lineBatteryHome = 0;
  var val_lineGridBattery = 0;
  var val_lineGridHome = 0;
  var val_lineSolarBattery = 0;

  var ess_lineHomeSolar = disable;
  var ess_lineSolarGrid = disable;
  var ess_lineBatteryHome = disable;
  var ess_lineGridBattery = disable;
  var ess_lineGridHome = disable;
  var ess_lineSolarBattery = disable;

  //console.log('!!' + rescGubn);
  if (rescGubn === 'A') {
    if (pvPower > 0) {
      //1번 그림
      var val_pvlineHomeSolarPV = pv_solar_to_home;
    } else {
      //2번 그림
      var val_pvlineHomeSolarPV = disable;
    }
  } else if (rescGubn === 'B') {
    if (gridStatus === 'Transmission') {
      if (LOAD > 0) {
        if (PV > 0) {
          if (btStatus === 'Charging') {
            if (PV < CharBat) {
              val_lineHomeSolar = 0;
              val_lineSolarGrid = 0;
              val_lineBatteryHome = 0;
              val_lineGridBattery = Math.abs(FromGRID - LOAD).toFixed(3);
              val_lineGridHome = Math.abs(LOAD).toFixed(3);
              val_lineSolarBattery = Math.abs(PV).toFixed(3);

              ess_lineHomeSolar = disable;
              ess_lineSolarGrid = disable;
              ess_lineBatteryHome = disable;
              ess_lineGridBattery = ess_grid_to_battery;
              ess_lineGridHome = ess_grid_to_home;
              ess_lineSolarBattery = ess_solar_to_battery;
            } else {
              val_lineHomeSolar = Math.abs(PV - CharBat).toFixed(3);
              val_lineSolarGrid = 0;
              val_lineBatteryHome = 0;
              val_lineGridBattery = 0;
              val_lineGridHome = Math.abs(FromGRID).toFixed(3);
              val_lineSolarBattery = Math.abs(CharBat).toFixed(3);

              ess_lineHomeSolar = ess_solar_to_home;
              ess_lineSolarGrid = disable;
              ess_lineBatteryHome = disable;
              ess_lineGridBattery = disable;
              ess_lineGridHome = ess_grid_to_home;
              ess_lineSolarBattery = ess_solar_to_battery;
            }
          } else if (btStatus === 'Discharging') {
            val_lineHomeSolar = Math.abs(PV).toFixed(3);
            val_lineSolarGrid = 0;
            val_lineSolarBattery = 0;
            val_lineGridHome = Math.abs(FromGRID).toFixed(3);
            val_lineBatteryHome = Math.abs(DiscBat).toFixed(3);
            val_lineGridBattery = 0;

            ess_lineHomeSolar = ess_solar_to_home;
            ess_lineSolarGrid = disable;
            ess_lineSolarBattery = disable;
            ess_lineGridHome = ess_grid_to_home;
            ess_lineBatteryHome = ess_battery_to_home;
            ess_lineGridBattery = disable;
          } else {
            val_lineHomeSolar = Math.abs(PV).toFixed(3);
            val_lineSolarGrid = 0;
            val_lineSolarBattery = 0;
            val_lineGridHome = Math.abs(FromGRID).toFixed(3);
            val_lineBatteryHome = 0;
            val_lineGridBattery = 0;

            ess_lineHomeSolar = ess_solar_to_home;
            ess_lineSolarGrid = disable;
            ess_lineSolarBattery = disable;
            ess_lineGridHome = ess_grid_to_home;
            ess_lineBatteryHome = disable;
            ess_lineGridBattery = disable;
          }
        } else {
          if (btStatus === 'Charging') {
            val_lineHomeSolar = 0;
            val_lineSolarGrid = 0;
            val_lineSolarBattery = 0;
            val_lineGridHome = Math.abs(LOAD).toFixed(3);
            val_lineBatteryHome = 0;
            val_lineGridBattery = Math.abs(CharBat).toFixed(3);

            ess_lineHomeSolar = disable;
            ess_lineSolarGrid = disable;
            ess_lineSolarBattery = disable;
            ess_lineGridHome = ess_grid_to_home;
            ess_lineBatteryHome = disable;
            ess_lineGridBattery = ess_grid_to_battery;
          } else if (btStatus === 'Discharging') {
            val_lineHomeSolar = 0;
            val_lineSolarGrid = 0;
            val_lineSolarBattery = 0;
            val_lineGridHome = Math.abs(FromGRID).toFixed(3);
            val_lineBatteryHome = Math.abs(DiscBat).toFixed(3);
            val_lineGridBattery = 0;

            ess_lineHomeSolar = disable;
            ess_lineSolarGrid = disable;
            ess_lineSolarBattery = disable;
            ess_lineGridHome = ess_grid_to_home;
            ess_lineBatteryHome = ess_battery_to_home;
            ess_lineGridBattery = disable;
          } else {
            val_lineHomeSolar = 0;
            val_lineSolarGrid = 0;
            val_lineSolarBattery = 0;
            val_lineGridHome = Math.abs(FromGRID).toFixed(3);
            val_lineBatteryHome = 0;
            val_lineGridBattery = 0;

            ess_lineHomeSolar = disable;
            ess_lineSolarGrid = disable;
            ess_lineSolarBattery = disable;
            ess_lineGridHome = ess_grid_to_home;
            ess_lineBatteryHome = disable;
            ess_lineGridBattery = disable;
          }
        }
      } else {
        if (PV > 0) {
          if (btStatus === 'Charging') {
            val_lineHomeSolar = 0;
            val_lineSolarGrid = 0;
            val_lineSolarBattery = Math.abs(PV).toFixed(3);
            val_lineGridHome = 0;
            val_lineBatteryHome = 0;
            val_lineGridBattery = Math.abs(FromGRID).toFixed(3);

            ess_lineHomeSolar = disable;
            ess_lineSolarGrid = disable;
            ess_lineSolarBattery = ess_solar_to_battery;
            ess_lineGridHome = disable;
            ess_lineBatteryHome = disable;
            ess_lineGridBattery = ess_grid_to_battery;
          }
        } else {
          if (btStatus === 'Charging') {
            val_lineHomeSolar = 0;
            val_lineSolarGrid = 0;
            val_lineSolarBattery = 0;
            val_lineGridHome = 0;
            val_lineBatteryHome = 0;
            val_lineGridBattery = Math.abs(FromGRID).toFixed(3);

            ess_lineHomeSolar = disable;
            ess_lineSolarGrid = disable;
            ess_lineSolarBattery = disable;
            ess_lineGridHome = disable;
            ess_lineBatteryHome = disable;
            ess_lineGridBattery = ess_grid_to_battery;
          }
        }
      }
    } else if (gridStatus === 'Receiving') {
      if (LOAD > 0) {
        if (PV > 0) {
          if (btStatus === 'Charging') {
            val_lineHomeSolar = Math.abs(LOAD).toFixed(3);
            val_lineSolarGrid = Math.abs(ToGRID).toFixed(3);
            val_lineSolarBattery = Math.abs(CharBat).toFixed(3);
            val_lineGridHome = 0;
            val_lineBatteryHome = 0;
            val_lineGridBattery = 0;

            ess_lineHomeSolar = ess_solar_to_home;
            ess_lineSolarGrid = ess_solar_to_grid;
            ess_lineSolarBattery = ess_solar_to_battery;
            ess_lineGridHome = disable;
            ess_lineBatteryHome = disable;
            ess_lineGridBattery = disable;
          } else if (btStatus === 'Discharging') {
            // if(selfconsumption mode){}
            if (DiscBat <= LOAD) {
              val_lineHomeSolar = Math.abs(PV - ToGRID).toFixed(3);
              val_lineSolarGrid = Math.abs(ToGRID).toFixed(3);
              val_lineSolarBattery = 0;
              val_lineGridHome = 0;
              val_lineBatteryHome = Math.abs(DiscBat).toFixed(3);
              val_lineGridBattery = 0;

              ess_lineHomeSolar = ess_solar_to_home;
              ess_lineSolarGrid = ess_solar_to_grid;
              ess_lineSolarBattery = disable;
              ess_lineGridHome = disable;
              ess_lineBatteryHome = ess_battery_to_home;
              ess_lineGridBattery = disable;
            } else {
              val_lineHomeSolar = 0;
              val_lineSolarGrid = Math.abs(PV).toFixed(3);
              val_lineSolarBattery = 0;
              val_lineGridHome = 0;
              val_lineBatteryHome = Math.abs(LOAD).toFixed(3);
              val_lineGridBattery = Math.abs(DiscBat - LOAD).toFixed(3);

              ess_lineHomeSolar = disable;
              ess_lineSolarGrid = ess_solar_to_grid;
              ess_lineSolarBattery = disable;
              ess_lineGridHome = disable;
              ess_lineBatteryHome = ess_battery_to_home;
              ess_lineGridBattery = ess_battery_to_grid;
            }
          } else {
            val_lineHomeSolar = Math.abs(LOAD).toFixed(3);
            val_lineSolarGrid = Math.abs(ToGRID).toFixed(3);
            val_lineSolarBattery = 0;
            val_lineGridHome = 0;
            val_lineBatteryHome = 0;
            val_lineGridBattery = 0;

            ess_lineHomeSolar = ess_solar_to_home;
            ess_lineSolarGrid = ess_solar_to_grid;
            ess_lineSolarBattery = disable;
            ess_lineGridHome = disable;
            ess_lineBatteryHome = disable;
            ess_lineGridBattery = disable;
          }
        } else {
          if (btStatus === 'Discharging') {
            val_lineHomeSolar = 0;
            val_lineSolarGrid = 0;
            val_lineSolarBattery = 0;
            val_lineGridHome = 0;
            val_lineBatteryHome = Math.abs(LOAD).toFixed(3);
            val_lineGridBattery = Math.abs(ToGRID).toFixed(3);

            ess_lineHomeSolar = disable;
            ess_lineSolarGrid = disable;
            ess_lineSolarBattery = disable;
            ess_lineGridHome = disable;
            ess_lineBatteryHome = ess_battery_to_home;
            ess_lineGridBattery = ess_battery_to_grid;
          }
        }
      } else {
        if (PV > 0) {
          if (btStatus === 'Charging') {
            val_lineHomeSolar = 0;
            val_lineSolarGrid = Math.abs(ToGRID).toFixed(3);
            val_lineSolarBattery = Math.abs(CharBat).toFixed(3);
            val_lineGridHome = 0;
            val_lineBatteryHome = 0;
            val_lineGridBattery = 0;

            ess_lineHomeSolar = disable;
            ess_lineSolarGrid = ess_solar_to_grid;
            ess_lineSolarBattery = ess_solar_to_battery;
            ess_lineGridHome = disable;
            ess_lineBatteryHome = disable;
            ess_lineGridBattery = disable;
          } else if (btStatus === 'Discharging') {
            val_lineHomeSolar = 0;
            val_lineSolarGrid = Math.abs(PV).toFixed(3);
            val_lineSolarBattery = 0;
            val_lineGridHome = 0;
            val_lineBatteryHome = 0;
            val_lineGridBattery = Math.abs(DiscBat).toFixed(3);

            ess_lineHomeSolar = disable;
            ess_lineSolarGrid = ess_solar_to_grid;
            ess_lineSolarBattery = disable;
            ess_lineGridHome = disable;
            ess_lineBatteryHome = disable;
            ess_lineGridBattery = ess_battery_to_grid;
          } else {
            val_lineHomeSolar = 0;
            val_lineSolarGrid = Math.abs(ToGRID).toFixed(3);
            val_lineSolarBattery = 0;
            val_lineGridHome = 0;
            val_lineBatteryHome = 0;
            val_lineGridBattery = 0;

            ess_lineHomeSolar = disable;
            ess_lineSolarGrid = ess_solar_to_grid;
            ess_lineSolarBattery = disable;
            ess_lineGridHome = disable;
            ess_lineBatteryHome = disable;
            ess_lineGridBattery = disable;
          }
        } else {
          if (btStatus === 'Discharging') {
            val_lineHomeSolar = 0;
            val_lineSolarGrid = 0;
            val_lineSolarBattery = 0;
            val_lineGridHome = 0;
            val_lineBatteryHome = 0;
            val_lineGridBattery = Math.abs(ToGRID).toFixed(3);

            ess_lineHomeSolar = disable;
            ess_lineSolarGrid = disable;
            ess_lineSolarBattery = disable;
            ess_lineGridHome = disable;
            ess_lineBatteryHome = disable;
            ess_lineGridBattery = ess_battery_to_grid;
          }
        }
      }
    } else {
      if (LOAD > 0) {
        if (PV > 0) {
          if (btStatus === 'Charging') {
            val_lineHomeSolar = Math.abs(LOAD).toFixed(3);
            val_lineSolarGrid = 0;
            val_lineSolarBattery = Math.abs(CharBat).toFixed(3);
            val_lineGridHome = 0;
            val_lineBatteryHome = 0;
            val_lineGridBattery = 0;

            ess_lineHomeSolar = ess_solar_to_home;
            ess_lineSolarGrid = disable;
            ess_lineSolarBattery = ess_solar_to_battery;
            ess_lineGridHome = disable;
            ess_lineBatteryHome = disable;
            ess_lineGridBattery = disable;
          } else if (btStatus === 'Discharging') {
            val_lineHomeSolar = Math.abs(PV).toFixed(3);
            val_lineSolarGrid = 0;
            val_lineSolarBattery = 0;
            val_lineGridHome = 0;
            val_lineBatteryHome = Math.abs(DiscBat).toFixed(3);
            val_lineGridBattery = 0;

            ess_lineHomeSolar = ess_solar_to_home;
            ess_lineSolarGrid = disable;
            ess_lineSolarBattery = disable;
            ess_lineGridHome = disable;
            ess_lineBatteryHome = ess_battery_to_home;
            ess_lineGridBattery = disable;
          } else {
            val_lineHomeSolar = Math.abs(LOAD).toFixed(3);
            val_lineSolarGrid = 0;
            val_lineSolarBattery = 0;
            val_lineGridHome = 0;
            val_lineBatteryHome = 0;
            val_lineGridBattery = 0;

            ess_lineHomeSolar = ess_solar_to_home;
            ess_lineSolarGrid = disable;
            ess_lineSolarBattery = disable;
            ess_lineGridHome = disable;
            ess_lineBatteryHome = disable;
            ess_lineGridBattery = disable;
          }
        } else {
          if (btStatus === 'Discharging') {
            val_lineHomeSolar = 0;
            val_lineSolarGrid = 0;
            val_lineSolarBattery = 0;
            val_lineGridHome = 0;
            val_lineBatteryHome = Math.abs(LOAD).toFixed(3);
            val_lineGridBattery = 0;

            ess_lineHomeSolar = disable;
            ess_lineSolarGrid = disable;
            ess_lineSolarBattery = disable;
            ess_lineGridHome = disable;
            ess_lineBatteryHome = ess_battery_to_home;
            ess_lineGridBattery = disable;
          }
        }
      } else {
        if (PV > 0) {
          if (btStatus === 'Charging') {
            val_lineHomeSolar = 0;
            val_lineSolarGrid = 0;
            val_lineSolarBattery = Math.abs(CharBat).toFixed(3);
            val_lineGridHome = 0;
            val_lineBatteryHome = 0;
            val_lineGridBattery = 0;

            ess_lineHomeSolar = disable;
            ess_lineSolarGrid = disable;
            ess_lineSolarBattery = ess_solar_to_battery;
            ess_lineGridHome = disable;
            ess_lineBatteryHome = disable;
            ess_lineGridBattery = disable;
          }
        } else {
          val_lineHomeSolar = 0;
          val_lineSolarGrid = 0;
          val_lineSolarBattery = 0;
          val_lineGridHome = 0;
          val_lineBatteryHome = 0;
          val_lineGridBattery = 0;

          ess_lineHomeSolar = disable;
          ess_lineSolarGrid = disable;
          ess_lineSolarBattery = disable;
          ess_lineGridHome = disable;
          ess_lineBatteryHome = disable;
          ess_lineGridBattery = disable;
        }
      }
    }
  }

  //=============================================================

  return (
    <Row type="flex" justify="space-between" align="stretch" gutter={10}>
      <Col xs={{ span: 24 }} md={{ span: 10 }}>
      <Card title={<>
        <p className="title" style={{color:"black", marginRight:'15px'}}>
        {service.getValue(lang, 'LANG00043', 'no-text')}
        </p>
          <Button type="danger" style={{ marginRight:'2px'}} onClick={() => onPopup(`/realChart/sites/${siteId}/${rescGubn}`)}>
          {service.getValue(lang, 'LANG00450', 'no-text')}
          </Button>
          <Button type="danger" onClick={() => onPopup(`/productionChart/sites/${siteId}`)}>
          {service.getValue(lang, 'LANG00451', 'no-text')}
          </Button>
      </>} {...styleProps_orange}>

          {rescGubn === 'A' ? ( //PV//PV//PV//PV//PV//PV//PV
            <div className="pv_flow_wrapper">
              <div className="pv_flow_inner">
                <div className="pv_flow_row">
                  <div className="status">
                    <span className="solar_to_home_watt">{val_pvlineHomeSolarPV == 0 ? '' : pvPower + 'kW'}</span>
                    {val_pvlineHomeSolarPV != 0 ? <CustomIcon className="status_img" type={val_pvlineHomeSolarPV} /> : <div className="no-flow"></div>}
                  </div>
                  <div className="solar_box">
                    <span className="pv_part_title">Solar</span>
                    <CustomIcon className="pv_part_icon" type={require('@/assets/operation/icon/solar_icon.svg')} />
                    <span className="pv_part_watt">
                      {fields
                        .filter(field => service.getValue(field, 'key', '') === 'pvPower')
                        .map(field => {
                          return plantAmount2(field, service.getValue(dataSource, 'powerData', {}), rescGubn);
                        })}
                    </span>
                  </div>
                  <div className="solar_grid_line"></div>
                </div>
                <div className="pv_flow_row">
                  <div className="home_box">
                    <span className="pv_part_title">Home</span>
                    <CustomIcon className="pv_part_icon" type={require('@/assets/operation/icon/home_icon.svg')} />
                    <span className="pv_part_watt">
                      0.00kw
                      {/*fields
                        .filter(field => service.getValue(field, 'key', null) === 'loadPower')
                        .map(field => {
                          return plantAmount2(field, service.getValue(dataSource, 'powerData', {}), rescGubn);
                        })*/}
                    </span>
                  </div>
                  <div className="home_grid_line"></div>
                  <div className="grid_box">
                    <span className="pv_part_title">Grid</span>
                    <CustomIcon className="pv_part_icon" type={require('@/assets/operation/icon/grid_icon.svg')} />
                    <span className="pv_part_watt">
                      0.00kw
                      {/*fields
                        .filter(field => service.getValue(field, 'key', '') === 'opPower')
                        .map(field => {
                          return plantAmount2(field, service.getValue(dataSource, 'powerData', {}), rescGubn);
                        })*/}
                      {/*fields
                        .filter(field => service.getValue(field, 'key', '') === 'gridPower')
                        .map(field => {
                          return plantAmount2(field, service.getValue(dataSource, 'powerData', {}), rescGubn);
                        })*/}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            //B  //ESS//ESS//ESS//ESS//ESS//ESS//ESS//ESS//ESS//ESS//ESS//ESS//ESS//ESS//ESS//ESS
            <div className="ess_flow_wrapper">
              <div className="ess_flow_inner">
                <div className="ess_flow_row">
                  <div className="sola_home_status">
                    <span className="solar_home_watt" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                      {val_lineHomeSolar == 0 ? '' : val_lineHomeSolar + 'kW'}
                    </span>
                    {val_lineHomeSolar != 0 ? <CustomIcon className="status_img" type={ess_lineHomeSolar} /> : <div className="no-flow"></div>}
                  </div>
                  <div className="solar_box">
                    <span className="pv_part_title">Solar</span>

                    <CustomIcon className="pv_part_icon" type={require('@/assets/operation/icon/solar_icon.svg')} />
                    <span className="pv_part_watt">
                      {fields
                        .filter(field => service.getValue(field, 'key', '') === 'opPower')
                        .map(field => {
                          return plantAmount2(field, service.getValue(dataSource, 'powerData', {}), rescGubn);
                        })}
                    </span>
                  </div>
                  <div className="solar_grid_status">
                    <span className="solar_grid_watt" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                      {val_lineSolarGrid == 0 ? '' : val_lineSolarGrid + 'kW'}
                    </span>
                    {val_lineSolarGrid != 0 ? <CustomIcon className="status_img" type={ess_lineSolarGrid} /> : <div className="no-flow"></div>}

                    <div></div>
                  </div>
                </div>
                <div className="ess_flow_row">
                  <div className="home_box">
                    <span className="pv_part_title">Home</span>
                    <CustomIcon className="pv_part_icon" type={require('@/assets/operation/icon/home_icon.svg')} />

                    <span className="pv_part_watt">
                      {fields
                        .filter(field => service.getValue(field, 'key', null) === 'loadPower')
                        .map(field => {
                          return plantAmount2(field, service.getValue(dataSource, 'powerData', {}), rescGubn);
                        })}
                    </span>
                  </div>

                  <div className="home_grid_status solar_battery_status">
                    <span className="home_grid_watt">{val_lineGridHome == 0 ? '' : val_lineGridHome + 'kW'}</span>

                    {val_lineGridHome != 0 ? <CustomIcon className="status_img horizontal" type={ess_lineGridHome} /> : <div className="no-flow-horizontal"></div>}

                    <span className="solar_battery_watt">{val_lineSolarBattery == 0 ? '' : val_lineSolarBattery + 'kW'} </span>

                    {val_lineSolarBattery != 0 ? <CustomIcon className="status_img vertical" type={ess_lineSolarBattery} /> : <div className="no-flow-vertical"></div>}
                  </div>

                  <div className="grid_box">
                    <span className="pv_part_title">Grid</span>
                    <CustomIcon className="pv_part_icon" type={require('@/assets/operation/icon/grid_icon.svg')} />

                    <span className="pv_part_watt">
                      <Col align="center" style={{ paddingLeft: 0, paddingRight: 0 }} key={1}>
                        <Col align="center" className="amount2">
                          {gridValue} kW
                        </Col>
                        {gridStatus == 'Transmission' || gridStatus == 'Receiving' ? (
                          <Tag color={gridStatus == 'Receiving' ? '#008b00' : '#8b0000'} className="tag">
                            {gridStatus}
                          </Tag>
                        ) : (
                          //off
                          <Tag color={'#000'} className="tag">
                            {gridStatus}
                          </Tag>
                        )}
                      </Col>
                    </span>
                  </div>
                </div>
                <div className="ess_flow_row">
                  <div className="home_baterry_status">
                    <span className="home_baterry_watt" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                      {val_lineBatteryHome == 0 ? '' : val_lineBatteryHome + 'kW'}{' '}
                    </span>
                    {val_lineBatteryHome != 0 ? <CustomIcon className="status_img" type={ess_lineBatteryHome} /> : <div className="no-flow"></div>}
                  </div>
                  <div className="battery_box">
                    <span className="pv_part_title">Battery</span>

                    <CustomIcon className="pv_part_icon" type={require('@/assets/operation/icon/battery_icon.svg')} />
                    <span className="pv_part_watt">
                      <Col align="center" style={{ paddingLeft: 0, paddingRight: 0 }} key={1}>
                        <Col align="center" className="amount2">
                          {btValue} kW
                        </Col>

                        <Col align="center" style={{ fontSize: '10px', width: '80px', border: '1px solid rgb(245, 136, 0)', margin: '10px 0 0 -4px' }} >
                          SOC - {(Number(batPower) * 100).toFixed(0)}% SOH - {(Number(batHealth) * 100).toFixed(0)}%
                        </Col>

                        {btStatus == 'Charging' || btStatus == 'Discharging' ? (
                          <Tag color={btStatus == 'Charging' ? '#008b00' : '#8b0000'} className="tag">
                            {btStatus}
                          </Tag>
                        ) : (
                          //OFF
                          <Tag color={'#000'} className="tag">
                            {btStatus}
                          </Tag>
                        )}
                      </Col>
                    </span>
                  </div>
                  <div className="grid_battery_status">
                    <span className="grid_battery_watt" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                      {val_lineGridBattery == 0 ? '' : val_lineGridBattery + 'kW'}
                    </span>

                    {val_lineGridBattery != 0 ? <CustomIcon className="status_img" type={ess_lineGridBattery} /> : <div className="no-flow"></div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*

          <Row type="flex" justify="center" align="top">

            <Col span={24}>
              <Row type="flex" justify="space-between" align="top" className="imageRow" style={rowStyle}>
                {fields
                  .filter(field => service.getValue(field, 'key', '') === 'pvPower' || service.getValue(field, 'key', '') === 'opPower' || service.getValue(field, 'key', '') === 'gridPower')
                  .map(field => {
                    return plantAmount(field, service.getValue(dataSource, 'powerData', {}), rescGubn);
                  })}
              </Row>
            </Col>

            <Col span={24}>
              <Row type="flex" justify="space-between" align="middle" className="imageRow">
                <Col span={8} />

                {fields
                  .filter(field => (rescGubn === 'B' && service.getValue(field, 'key', null) === 'batPower') || service.getValue(field, 'key', null) === 'loadPower')
                  .map(field => {
                    return plantAmount(field, service.getValue(dataSource, 'powerData', {}), rescGubn);
                  })}
              </Row>
            </Col>
          </Row>

*/}
        </Card>
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 14 }}>
        <Card {...styleProps} >
          <p className="title" style={{ fontSize:'20px'}}>
          Powers
          </p>
          {rescGubn === 'A' ? <CommonChart chartData={chartRealPower} height={200} /> : <CommonChart chartData={chartRealPowerEss} height={200} />}
          {isMobile ? (
          <Col xs={{ span: 24 }} md={{ span: 0 }}>
            <Info data={props} />
          </Col>
          ) : (
            <>
            <p className="title" style={{ fontSize:'20px'}}>
            Energy
            </p>
            <ReactEcharts theme="light" option={pieChart} height={80} />
            </>
          )}
          </Card>
      </Col>
    </Row>
  );
};

export default Operation;
