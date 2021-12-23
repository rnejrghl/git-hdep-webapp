import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Select, Row, Col, Table, Input, Button, Modal } from 'antd';
import { service, locale } from '@/configs';
import axios from 'axios';
import moment from 'moment';
import { api, Fetcher } from '@/configs';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import TabTimer from './TabTimer';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import 'react-circular-progressbar/dist/styles.css';
import '@/styles/app/components/commons/site/Detail.scss';

const lang = service.getValue(locale, 'languages', {});

const Controls = props => {
  const { dataSource = {}, siteId = null, site, current, userName = null } = props;
  const { Option } = Select;
  const [formValues, setFormValues] = useState({});

  const [disable, setDisable] = useState(true);
  const [percentage, setPercentage] = useState('0');
  const [loading, setLoading] = useState(false);

  const [controlList, setControlList] = useState(['-', '-', '-', '-']); //['Charging', '600', '90', '20']
  const [statusList, setStatusList] = useState(['-', '-', '-', '-']); //['Charging', '600', '90', '20']

  const [goalText, setGoalText] = useState(66.0);

  const [inputStatus, setInputStatus] = useState('self-consumption');
  const [inputPower, setInputPower] = useState(2.0);
  const [inputSocU, setInputSocU] = useState(85.0);
  const [inputSocL, setInputSocL] = useState(15.0);
  const [inputGoalUnit, setInputGoalUnit] = useState('percent');
  const [inputGoal, setInputGoal] = useState(60.0);
  const [now, setNow] = useState('');
  const [lastControlTime, setLastControlTime] = useState(' - ');

  const [batPower, setBatPower] = useState(0);

  // 추가부분
  const [uuid, setUuid] = useState('');
  const [facId, setFacId] = useState('');
  const [psId, setPsId] = useState('');

  var _token = '';
  var initControlState = '';
  var batChar = 0;
  var batDisc = 0;

  var btStatus = '-';
  var btValue = 0;

  var goalValue = 0;
  var calTime = 0;
  var isStop = 0;
  var orderTime = '';

  var batteryCapacity = 9.8;
  var powerData = {};

  const [token, setToken] = useState('');
  const [taskId, setTaskId] = useState('');
  const [taskIdCheck, setTaskIdCheck] = useState('');

  const mergeCells = (v, r, i) => {
    const obj = { children: v, props: {} };
    if (i % 4 == 0) obj.props.rowSpan = 4;
    else obj.props.rowSpan = 0;
    return obj;
  };

  const handleChange = e => {
    setInputStatus(e);
    if (e == 'self-consumption' || e == 'stop') {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };

  const handleChangeUnit = e => {
    setInputGoalUnit(e);
    setInputGoal('');
  };

  const chargingOpt = () => {
    return (
      <Select onChange={e => handleChange(e)} value={inputStatus} style={{ width: '100%', display: 'inline-grid' }}>
        <Option value="discharging">Discharging</Option>
        <Option value="charging">Charging</Option>
        <Option value="stop">Stop</Option>
        <Option value="self-consumption">Self-Consumption</Option>
      </Select>
    );
  };

  const chargingPower = () => {
    return <Input value={inputPower} onInput={e => setInputPower(e.target.value)} placeholder="Power" disabled={disable} />;
  };

  const socUpperLimit = () => {
    return <Input value={inputSocU} onInput={e => setInputSocU(e.target.value)} placeholder="Upper Limit" disabled={disable} />;
  };

  const socLowerLimit = () => {
    return <Input value={inputSocL} onInput={e => setInputSocL(e.target.value)} placeholder="Lower Limit" disabled={disable} />;
  };

  //var powerData = service.getValue(dataSource, 'powerData', {});

  var prjSiteSpec = service.getValue(dataSource, 'prjSiteSpec', {});

  const dataSourceTable = [
    {
      siteId: siteId,
      key: 'column1',
      userName: userName,
      controlSpec: `PV : ${Number(prjSiteSpec.modlCapa)}kW
      ESS : ${Number(prjSiteSpec.btryCapa)}kWh
      
      [Inverter] 
      Max out(ESS) : 3kW
      Max out : ${Number(prjSiteSpec.invtCapa)}kW
      `,
      controlHistory: 'controlHistory 1',
      controlStatus: 'controlStatus 1',
      settingValue: chargingOpt()
    },
    {
      siteId: 'siteId 1',
      key: 'column2',
      userName: 'userName 1',
      controlSpec: 'controlSpec 2',
      controlHistory: 'controlHistory 2',
      controlStatus: 'controlStatus 2',
      settingValue: chargingPower()
    },
    {
      siteId: 'dddsiteId 1',
      key: 'column3',
      userName: 'userName 1',
      controlSpec: 'controlSpec 3',
      controlHistory: 'controlHistory 3',
      controlStatus: 'controlStatus 3',
      settingValue: socUpperLimit()
    },
    {
      siteId: 'sssiteId 12',
      key: 'column4',
      userName: 'userName 1',
      controlSpec: 'controlSpec 4',
      controlHistory: 'controlHistory s4',
      controlStatus: 'controlStatus 4',
      settingValue: socLowerLimit()
    }
  ];

  //Todo 다국어화
  const columns = [
    {
      title: 'SITE ID',
      dataIndex: 'siteId',
      key: 'siteId',
      className: 'td-center',
      render: (value, row, index) => mergeCells(value, row, index)
    },
    {
      title: service.getValue(lang, 'LANG00064', 'no-text'),
      dataIndex: 'userName',
      key: 'userName',
      className: 'td-center',
      render: (value, row, index) => mergeCells(value, row, index)
    },
    {
      title: 'Spec',
      dataIndex: 'controlSpec',
      key: 'controlSpec',
      className: 'td-center',
      render: (value, row, index) => {
        var obj = mergeCells(value, row, index);
        {
          obj.children = obj.children.split('\n').map((line, i) => {
            return (
              <div key={i}>
                {line}
                <br />
              </div>
            );
          });
        }
        return obj;
      }
    },
    {
      title: service.getValue(lang, 'LANG00402', 'no-text'),
      key: 'controlItems',
      className: 'td-center',
      render: (value, row, index) => {
        if (index == 0)
          return (
            <div style={{ height: 'auto' }}>
              <div>Charging</div>
              <div>Discharging Order</div>
            </div>
          );
        else if (index == 1)
          return (
            <div style={{ height: 'auto' }}>
              <div>Charging</div>
              <div>Discharging Power</div>
            </div>
          );
        else if (index == 2)
          return (
            <div style={{ height: 'auto' }}>
              <div>SOC Upper Limit</div>
            </div>
          );
        else if (index == 3)
          return (
            <div style={{ height: 'auto' }}>
              <div>SOC Lower Limit</div>
            </div>
          );
      }
    },

    {
      title: () => {
        var obj = service.getValue(lang, 'LANG00403', 'no-text') + '\n( ' + lastControlTime + ' )';
        {
          obj = obj.split('\n').map((line, i) => {
            return (
              <div key={i}>
                {line}
                <br />
              </div>
            );
          });
        }
        return obj;
      },
      dataIndex: 'controlHistory',
      key: 'controlHistory',
      className: 'td-center-max-limit',
      render: (value, row, index) => {
        if (index == 0) return <ul>{controlList[index]}</ul>;
        else if (index == 1) return <ul>{controlList[index] == '-' ? '-' : Number(controlList[index]).toFixed(2) + 'kW'}</ul>;
        else if (index == 2) return <ul>{controlList[index] == '-' ? '-' : Number(controlList[index]).toFixed(2) + 'kW'}</ul>;
        else if (index == 3) return <ul>{controlList[index] == '-' ? '-' : Number(controlList[index]).toFixed(2) + 'kW'}</ul>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'controlStatus',
      key: 'controlStatus',
      className: 'td-center',
      render: (value, row, index) => {
        if (index == 0) return <ul>{statusList[index]}</ul>;
        else if (index == 1) return <ul>{statusList[index] == '-' ? '-' : Number(statusList[index]).toFixed(2) + 'kW'}</ul>;
        else if (index == 2) return <ul>{controlList[index] == '-' ? '-' : Number(controlList[index]).toFixed(2) + '%'}</ul>;
        else if (index == 3) return <ul>{controlList[index] == '-' ? '-' : Number(controlList[index]).toFixed(2) + '%'}</ul>;
      }
    },
    {
      title: service.getValue(lang, 'LANG00404', 'no-text'),
      dataIndex: 'settingValue',
      key: 'settingValue',
      className: 'td-center'
    }
  ];

  function clickSave() {
    if (inputPower == '' || inputSocU == '' || inputSocL == '' || inputGoal == '') {
      Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: service.getValue(lang, 'LANG00411', 'no-text')
      });

      return;
    }

    if (Number(inputPower) > 3 || Number(inputPower) < 0) {
      Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: service.getValue(lang, 'LANG00420', 'no-text') //inputPower의 범위는 0 ~ 3.0kW 입니다.
      });
      return;
    }

    if (Number(inputSocU) > 95) {
      Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: service.getValue(lang, 'LANG00412', 'no-text')
      });
      return;
    }

    if (Number(inputSocL) < 5) {
      Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: service.getValue(lang, 'LANG00413', 'no-text')
      });
      return;
    }

    if (Number(inputSocU) <= Number(inputSocL)) {
      Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: service.getValue(lang, 'LANG00414', 'no-text')
      });
      return;
    }

    //현재 SOC < 목표 SOC 시, 방전 불가능하도록 Validation 적용
    if (Number(batPower) == 0) {
      Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: service.getValue(lang, 'LANG00415', 'no-text')
      });
      return;
    }

    //현재 SOC < 목표 SOC 시, 방전 불가능하도록 Validation 적용
    if (Number(batPower * 100) < Number(inputGoal) && inputStatus == 'discharging') {
      Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: service.getValue(lang, 'LANG00416', 'no-text')
      });
      return;
    }

    //현재 SOC > 목표 SOC시, 충전 불가능하도록 Validation 적용
    if (Number(batPower * 100) > Number(inputGoal) && inputStatus == 'charging') {
      Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: service.getValue(lang, 'LANG00417', 'no-text') //목표 SOC는 현재 SOC보다 커야 합니다. 충전 불가능합니다
      });
      return;
    }

    if ((Number(inputGoal) < Number(inputSocL) || Number(inputGoal) > Number(inputSocU)) && inputGoalUnit == 'percent') {
      Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: service
          .getValue(lang, 'LANG00421', 'no-text')
          .replace('{{inputSocL}}', inputSocL)
          .replace('{{inputSocU}}', inputSocU)
      });
      return;
    }

    var URange = ((batteryCapacity * Number(inputSocU)) / 100).toFixed(2);
    var LRange = ((batteryCapacity * Number(inputSocL)) / 100).toFixed(2);
    if ((Number(inputGoal) < LRange || Number(inputGoal) > URange) && inputGoalUnit == 'kwh') {
      Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: service
          .getValue(lang, 'LANG00422', 'no-text')
          .replace('{{LRange}}', LRange)
          .replace('{{URange}}', URange)
      });
      return;
    }

    if (inputStatus == 'charging' || inputStatus == 'discharging') {
      Modal.confirm({
        title: service.getValue(lang, 'LANG00395', 'no-text'),
        content: service.getValue(lang, 'LANG00418', 'no-text'), //'화면을 닫으면 제어가 계산된 시간에 완료되지 않습니다. 계속 진행하시겠습니까?',
        icon: null,
        cancelButtonProps: {
          style: {
            minWidth: 80
          }
        },
        onOk: () => {
          saveControl();
        }
      });
    } else if (inputStatus == 'self-consumption') {
      Modal.confirm({
        title: service.getValue(lang, 'LANG00395', 'no-text'),
        content: service.getValue(lang, 'LANG00423', 'no-text'),
        icon: null,
        cancelButtonProps: {
          style: {
            minWidth: 80
          }
        },
        onOk: () => {
          saveControl();
        }
      });
    } else if (inputStatus == 'stop') {
      Modal.confirm({
        title: service.getValue(lang, 'LANG00395', 'no-text'),
        content: service.getValue(lang, 'LANG00424', 'no-text'), //'Stop을 진행하시겠습니까? ',
        icon: null,
        cancelButtonProps: {
          style: {
            minWidth: 80
          }
        },
        onOk: () => {
          saveControl();
        }
      });
    }
  }

  function cancelControl() {
    Modal.confirm({
      title: service.getValue(lang, 'LANG00395', 'no-text'),
      content: service.getValue(lang, 'LANG00419', 'no-text'), //'제어도 취소 됩니다. 취소 하시겠습니까?',
      icon: null,
      cancelButtonProps: {
        style: {
          minWidth: 80
        }
      },
      onOk: () => {
        clearInterval(TabTimer.timer);
        clearInterval(TabTimer.timerControl);

        setDeviceStatusStop('cancel', uuid);
      }
    });
  }

  //===============================================================
  useEffect(() => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    setNow(
      dayjs()
        .tz('Australia/Sydney')
        .format('YYYY-MM-DD HH:mm:ss')
    );
    clearInterval(TabTimer.timer);
    clearInterval(TabTimer.timerControl);

    powerData = service.getValue(dataSource, 'powerData', {});
    setBatPower(service.getValue(powerData, 'batPower', 0)); //13141
    batChar = service.getValue(powerData, 'batChar', 0); //CharBat
    batDisc = service.getValue(powerData, 'batDisc', 0); //DiscBat
    setPsId(service.getValue(dataSource, 'psId', {}));
    setFacId(service.getValue(dataSource, 'facId', {}));
    getInitData();
  }, [psId, facId]);

  //===============================================================

  //get Token
  function getInitData() {
    const params = {};

    params['appkey'] = '8E3C8D5EA073CAA8B0C18B6C92AF7AF4';
    params['lang'] = '_en_US';
    params['service'] = 'login';
    params['user_account'] = 'swpark1223@hanwha.com';
    params['user_password'] = 'hdep2020';
    params['sys_code'] = '901';

    if (Object.keys(psId).length != 0 && psId != 0) {
      axios.post('https://augateway.isolarcloud.com/v1/userService/login', params, {}).then(function(result) {
        _token = result.data.result_data.token;
        if (_token !== '') {
          // 해당 기기에 대해 uuid 조회
          const params_ = {};
          params_['ps_id'] = psId;
          params_['token'] = _token;
          params_['appkey'] = '8E3C8D5EA073CAA8B0C18B6C92AF7AF4';
          params_['lang'] = '_en_US';
          params_['sys_code'] = '901';

          axios.post('https://augateway.isolarcloud.com/v1/devService/getDeviceList', params_, {}).then(function(result) {
            let _uuid = result.data.result_data.pageList
              .filter(data => data.device_type == 14)
              .map(data => data.uuid)
              .join();

            setUuid(_uuid);
            // uuid = _uuid;
            setToken(_token);
            getDBStatues(_uuid);
          });
          //state
        }
      });
    }
  }

  function getDBStatues(_uuid) {
    const newParams = { siteId: siteId };
    let requestObj = {};
    //newParams['siteId'] = siteId;
    requestObj = api.getEssControlList(siteId);
    // dispatch(common.loadingStatus(true));
    Fetcher.get(requestObj.url, requestObj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        //console.log('db data =============');
        //console.log(result.data);

        if (result.data.length == 0) {
          var tmpControlList = ['-', '-', '-', '-'];
          setControlList(tmpControlList);
          setGoalText('-');
        } else {
          var tmpControlList = [result.data[0].status, result.data[0].power, result.data[0].lmtUSoc, result.data[0].lmtLSoc];

          setLastControlTime(result.data[0].timeStamp);
          //update list
          setControlList(tmpControlList);

          //update goal
          setGoalText(result.data[0].goal);

          //설정값 설정
          calTime = result.data[0].calTime;
          isStop = result.data[0].isStop;
          orderTime = result.data[0].timeStamp;
          initControlState = result.data[0].status;

          //setInputStatus(result.data[0].status)
          setInputPower(result.data[0].power);
          setInputSocU(result.data[0].lmtUSoc);
          setInputSocL(result.data[0].lmtLSoc);
          setInputGoalUnit('percent');
          setInputGoal(result.data[0].goal);

          //기기 정보 (setType = 2의 taskId 값 조회)
          var _taskId = result.data[0].taskId;
          var _taskIdCheck = parseInt(result.data[0].taskId) + 1;

          /*
          if (result.data[0].status == 'stop' || result.data[0].status == 'self-consumption') {
            var _taskIdCheck = parseInt(result.data[0].taskId);
          } else {
            var _taskIdCheck = parseInt(result.data[0].taskId) + 1;
          }
          */

          setTaskId(_taskId); //state
          setTaskIdCheck(_taskIdCheck); //state

          getDeviceStatus(_taskIdCheck, _uuid);
        }
      }
    });
  }

  //1초마다 실행해서 command_status 값 이 8 이면 set_type = 2 호출
  function getDeviceStatus(_taskIdCheck, _uuid) {
    //console.log('_token:' + _token);
    //console.log('_taskIdCheck:' + _taskIdCheck);
    if (_taskIdCheck == '') {
      return;
    }

    //set_type 2번인 디비 내용 가져옴
    //TASK
    const paramsCheck = {};
    paramsCheck['appkey'] = '8E3C8D5EA073CAA8B0C18B6C92AF7AF4';
    paramsCheck['token'] = _token;
    paramsCheck['lang'] = '_en_US';
    paramsCheck['uuid'] = _uuid;
    paramsCheck['task_id'] = _taskIdCheck;

    axios
      .post('https://augateway.isolarcloud.com/v1/devService/queryParamSettingTask', paramsCheck, {
        headers: {
          sys_code: '901'
        }
      })
      .then(function(response) {
        //console.log('처음 페이지 로딩시 ... queryParamSettingTask');
        //console.log('======================');
        //console.log(response);

        var lmtUSoc = '';
        var lmtLSoc = '';

        var commandStatus = response.data.result_data.command_status;

        if (commandStatus == 2 || commandStatus == 8) {
          //in progress || over
          timeLimit = 0;
          // var curTime = moment()
          //   .add(2, 'hours')
          //   .format('YYYY-MM-DD HH:mm:ss');

          var curTime = dayjs()
            .tz('Australia/Sydney')
            .format('YYYY-MM-DD HH:mm:ss'); //moment-timezone import시 lazy 에러..해결방안을 못찾아 dayjs 사용
          var curTime_timestamp = moment(curTime, 'YYYY-MM-DD HH:mm:ss');

          var orderTime_timestamp = moment(orderTime, 'YYYY-MM-DD HH:mm:ss');
          var diff = curTime_timestamp.diff(orderTime_timestamp) / 1000;

          //기기에서 .. 기존 이력 불러오기
          for (var item of response.data.result_data.param_list) {
            if (item.point_name === 'SOC Upper Limit') {
              lmtUSoc = parseFloat(item.return_value).toFixed(2);
            }
            if (item.point_name === 'SOC Lower Limit') {
              lmtLSoc = parseFloat(item.return_value).toFixed(2);
            }
          }

          if (batChar > 0) {
            //충전
            btValue = batChar;
            btStatus = 'charging';
          } else if (batDisc > 0) {
            //방전
            btValue = batDisc;
            btStatus = 'discharging';
          } else {
            //정지
            btValue = 0;
            btStatus = 'stop';
          }

          //console.log(batChar);
          //console.log(batDisc);
          //console.log(btStatus);
          //console.log(btValue);
          //console.log('status==================');

          //console.log('status:' + btStatus);
          //console.log('diff:' + diff);
          //console.log('calTime:' + calTime);
          //console.log('isStop:' + isStop);

          //if (status == 'charging' || status == 'discharging') {
          if (diff < calTime && isStop == '0') {
            setLoading(true);

            var fireFlag = false;
            clearInterval(TabTimer.timer);
            TabTimer.timer = setInterval(() => {
              var pValue = parseInt((1.0 / calTime) * timeLimit * 100) + parseInt((diff / calTime) * 100); //1574.37

              setPercentage(pValue);

              timeLimit++;

              console.log('Init : ' + initControlState);

              if (pValue >= 100) {
                setLoading(false);
                clearInterval(TabTimer.timer);

                //스탑제어 날리기
                //스탑제어 날리기
                //스탑제어 날리기
                //스탑제어 날리기

                if (initControlState == 'charging' || initControlState == 'discharging') {
                  if (fireFlag == false) {
                    fireFlag = true;

                    setDeviceStatusStop('complete', _uuid);

                    console.log('success 1111');
                    Modal.error({
                      title: service.getValue(lang, 'LANG00029', 'no-text'),
                      content: service.getValue(lang, 'LANG00425', 'no-text')
                    });
                    return;
                  }
                }
              }
            }, 1 * 1000);
          }
          //}
        } else {
          //error

          setPercentage(0);
          setLoading(false);

          return;
        }

        var tmpStatusList = [btStatus, btValue, lmtUSoc, lmtLSoc];

        //update list STATE
        setStatusList(tmpStatusList);
      });
  }

  function setDeviceStatusStop(tag, _uuid) {
    if (_token == '') {
      _token = token;
    }
    if (_token == '') {
      return;
    }

    //SETTING
    const paramsCheck = {};

    paramsCheck['task_name'] = 'progress [' + tag + ']';
    paramsCheck['appkey'] = '8E3C8D5EA073CAA8B0C18B6C92AF7AF4';
    paramsCheck['token'] = _token;
    paramsCheck['expire_second'] = 1800;
    paramsCheck['lang'] = '_en_US';
    paramsCheck['uuid'] = _uuid;
    paramsCheck['set_type'] = '0';

    var deviceStatus = '';
    var deviceSocU = '';
    var deviceSocL = '';
    var devicePower = '';
    var deviceMode = '';

    const param_list = [];

    deviceMode = '4';
    deviceStatus = '204';

    param_list.push({ param_code: 10003, set_value: deviceMode }); //4:vpp , 0:self-use mode (default)
    param_list.push({ param_code: 10004, set_value: deviceStatus }); //170:charge ,187:discharge ,204:stop (default)
    paramsCheck['param_list'] = param_list;

    axios
      .post('https://augateway.isolarcloud.com/v1/devService/paramSettingNova', paramsCheck, {
        headers: {
          sys_code: '901'
        }
      })
      .then(function(response) {
        //console.log('SEND setDeviceStatusStop complete!');
        //console.log(response);

        //error Unhandled Rejection (TypeError): Cannot read property 'code' of undefined
        //명렁어 성공 플래그 확인
        //코드를 받아옴
        let code_f = response.data.result_data.dev_result_list[0].code;

        if (code_f != 1) {
          setPercentage(0);
          setLoading(false);

          let langType = '';

          switch (code_f) {
            case 0:
              langType = 'LANG00426'; //The verification fails, and the parameter setting cannot be performed
              break;
            case 2:
              langType = 'LANG00428'; //The measuring points of parameter setting are repeated
              break;
            case 3:
              langType = 'LANG00429'; //he number of set parameters exceeds the upper limit
              break;
            case 4:
              langType = 'LANG00430'; //The measuring point id or set value of parameter setting is empty
              break;
            case 5:
              langType = 'LANG00431'; // The equipment does not exist
              break;
            case 6:
              langType = 'LANG00432'; // The parameter setting template is not configured
              break;
            default:
              langType = 'LANG00433'; //Device is offline
              break;
          }

          //HERE
          Modal.error({
            title: service.getValue(lang, 'LANG00296', 'no-text'),
            content: service.getValue(lang, langType, 'no-text') + '...' //'장비에 오더가 완료되지 않았습니다.'
            //content: service.getValue(lang, 'LANG00410', 'no-text') + '...' //'장비에 오더가 완료되지 않았습니다.'
          });

          //clearInterval(timerId2);
          return;
        }

        //목표치 설정 단위에 따른 변환
        if (inputGoalUnit == 'percent') {
          goalValue = inputGoal;
        } else {
          goalValue = ((inputGoal / batteryCapacity) * 100).toFixed(2);
        }

        var _taskId = response.data.result_data.dev_result_list[0].task_id;
        var _taskIdCheck = parseInt(_taskId) + 1;
        setTaskId(_taskId);
        setTaskIdCheck(_taskIdCheck);

        const params = {};

        params['uuid'] = _uuid;
        params['taskFrom'] = 'app_bg';
        params['taskId'] = _taskId;
        params['status'] = 'stop';
        params['power'] = inputPower;
        params['lmtUSoc'] = inputSocU;
        params['lmtLSoc'] = inputSocL;
        params['goal'] = goalValue;
        params['calTime'] = 0;
        params['siteId'] = siteId;
        params['facId'] = facId;

        setPercentage(0);
        setLoading(false);

        const obj = api.createEssControl(params);
        Fetcher.post(obj.url, obj.params).then(result => {
          //getDBStatues();
          /*
          var tmpControlList = [params['status'], params['power'], params['lmtUSoc'], params['lmtLSoc']];
          //update list
          setControlList(tmpControlList);
          //update goal
          setGoalText(params['goal']);
          //console.log(params['goal']);
          setLoading(false);
          */
        });

        const paramsUpdate = {};
        paramsUpdate['isStop'] = 1;
        paramsUpdate['siteId'] = siteId;
        const objUpdate = api.updateEssControl(paramsUpdate);
        Fetcher.post(objUpdate.url, objUpdate.params).then(result => {});
      });
  }

  //===================================================================
  //SET
  //SEND 버튼 눌렀을때

  function setDeviceStatus() {
    if (token == '') {
      return;
    }

    //SETTING
    const paramsCheck = {};

    paramsCheck['task_name'] = 'control [' + inputStatus + ']';
    paramsCheck['appkey'] = '8E3C8D5EA073CAA8B0C18B6C92AF7AF4';
    paramsCheck['token'] = token;
    paramsCheck['expire_second'] = 1800;
    paramsCheck['lang'] = '_en_US';
    paramsCheck['uuid'] = uuid;
    paramsCheck['set_type'] = '0';

    var deviceStatus = '';
    var deviceSocU = '';
    var deviceSocL = '';
    var devicePower = '';
    var deviceMode = '';

    const param_list = [];

    if (inputStatus == 'charging') {
      deviceMode = '4';
      deviceStatus = '170';
    } else if (inputStatus == 'discharging') {
      deviceMode = '4';
      deviceStatus = '187';
    } else if (inputStatus == 'stop') {
      deviceMode = '4';
      deviceStatus = '204';
    } else {
      deviceMode = '0';
      deviceStatus = '204';
    }

    deviceSocU = inputSocU * 10;
    deviceSocL = inputSocL * 10;
    devicePower = inputPower * 1000;

    if (inputStatus == 'charging' || inputStatus == 'discharging') {
      param_list.push({ param_code: 10001, set_value: deviceSocU }); //socU (700-1000)
      param_list.push({ param_code: 10002, set_value: deviceSocL }); //socL (0 - 500)
      param_list.push({ param_code: 10005, set_value: devicePower }); //power (0-5000w) (default)
      param_list.push({ param_code: 10017, set_value: '1000' }); //heartbeat
    }

    param_list.push({ param_code: 10003, set_value: deviceMode }); //4:vpp , 0:self-use mode (default)

    if (inputStatus == 'charging' || inputStatus == 'discharging' || inputStatus == 'stop') {
      param_list.push({ param_code: 10004, set_value: deviceStatus }); //170:charge ,187:discharge ,204:stop (default)
    }

    paramsCheck['param_list'] = param_list;

    axios
      .post('https://augateway.isolarcloud.com/v1/devService/paramSettingNova', paramsCheck, {
        headers: {
          sys_code: '901'
        }
      })
      .then(function(response) {
        //console.log('>__ paramSettingNova set_type 0');
        //console.log(response);
        //코드를 받아옴
        let code_f = response.data.result_data.dev_result_list[0].code;

        if (code_f != 1) {
          setPercentage(0);
          setLoading(false);

          let langType = '';

          switch (code_f) {
            case 0:
              langType = 'LANG00426'; //The verification fails, and the parameter setting cannot be performed
              break;
            case 2:
              langType = 'LANG00428'; //The measuring points of parameter setting are repeated
              break;
            case 3:
              langType = 'LANG00429'; //he number of set parameters exceeds the upper limit
              break;
            case 4:
              langType = 'LANG00430'; //The measuring point id or set value of parameter setting is empty
              break;
            case 5:
              langType = 'LANG00431'; // The equipment does not exist
              break;
            case 6:
              langType = 'LANG00432'; // The parameter setting template is not configured
              break;
            default:
              langType = 'LANG00433'; //Device is offline
              break;
          }

          //HERE
          Modal.error({
            title: service.getValue(lang, 'LANG00296', 'no-text'),
            content: service.getValue(lang, langType, 'no-text') + '...' //'장비에 오더가 완료되지 않았습니다.'
            //content: service.getValue(lang, 'LANG00410', 'no-text') + '...' //'장비에 오더가 완료되지 않았습니다.'
          });

          //clearInterval(timerId2);
          return;
        }

        var _taskId = response.data.result_data.dev_result_list[0].task_id;
        var _taskIdCheck = parseInt(_taskId) + 1;
        setTaskId(_taskId);
        setTaskIdCheck(_taskIdCheck);

        //console.log('예상=====');
        //console.log('_taskId:' + _taskId);
        //console.log('_taskIdCheck:' + _taskIdCheck);

        setDBStatues(_taskId);

        //결과가 8 이 나왔을때 호출 한다 .
        //setType==2 로 기기에 호출
        //10초 정도 후에 실행 테스트
        //console.log('=== Type2 대기');

        /*
        if (inputStatus == 'self-consumption' || inputStatus == 'stop') {
          return;
        }
        */

        //반복 반복 ===========================================
        //===========================================
        //var timerId2 = setInterval(() => {
        //console.log('=== Type2 실행');
        //checkDeviceStatus()

        //console.log('진짜=====');
        //console.log('성공일때 까지 돈다 ... ');

        //SETTING
        const paramsCheck = {};

        paramsCheck['task_name'] = 'readback [' + inputStatus + ']';
        paramsCheck['appkey'] = '8E3C8D5EA073CAA8B0C18B6C92AF7AF4';
        paramsCheck['token'] = token;
        paramsCheck['expire_second'] = 1800;
        paramsCheck['lang'] = '_en_US';
        paramsCheck['uuid'] = uuid;
        paramsCheck['set_type'] = '2';

        const param_list = [];

        if (inputStatus == 'charging' || inputStatus == 'discharging') {
          param_list.push({ param_code: 10001, set_value: '' }); //socU (700-1000)
          param_list.push({ param_code: 10002, set_value: '' }); //socL (0 - 500)
          param_list.push({ param_code: 10005, set_value: '' }); //power (0-5000w) (default)
          param_list.push({ param_code: 10017, set_value: '' }); //heartbeat
        }

        param_list.push({ param_code: 10003, set_value: '' }); //4:vpp , 0:self-use mode (default)

        if (inputStatus == 'charging' || inputStatus == 'discharging' || inputStatus == 'stop') {
          param_list.push({ param_code: 10004, set_value: '' }); //170:charge ,187:discharge ,204:stop (default)
        }

        paramsCheck['param_list'] = param_list;

        axios
          .post('https://augateway.isolarcloud.com/v1/devService/paramSettingNova', paramsCheck, {
            headers: {
              sys_code: '901'
            }
          })
          .then(function(response) {
            //console.log('update')
            //console.log('paramSettingNova set_type 2 ============');
            //console.log(response);
            //console.log('code:' + response.data.result_data.dev_result_list[0].code);

            //명렁어 성공 플래그 확인

            //코드를 받아옴
            let code_f = response.data.result_data.dev_result_list[0].code;

            if (code_f != 1) {
              setPercentage(0);
              setLoading(false);

              let langType = '';

              switch (code_f) {
                case 0:
                  langType = 'LANG00426'; //The verification fails, and the parameter setting cannot be performed
                  break;
                case 2:
                  langType = 'LANG00428'; //The measuring points of parameter setting are repeated
                  break;
                case 3:
                  langType = 'LANG00429'; //he number of set parameters exceeds the upper limit
                  break;
                case 4:
                  langType = 'LANG00430'; //The measuring point id or set value of parameter setting is empty
                  break;
                case 5:
                  langType = 'LANG00431'; // The equipment does not exist
                  break;
                case 6:
                  langType = 'LANG00432'; // The parameter setting template is not configured
                  break;
                default:
                  langType = 'LANG00433'; //Device is offline
                  break;
              }

              //HERE
              Modal.error({
                title: service.getValue(lang, 'LANG00296', 'no-text'),
                content: service.getValue(lang, langType, 'no-text') + '...' //'장비에 오더가 완료되지 않았습니다.'
                //content: service.getValue(lang, 'LANG00410', 'no-text') + '...' //'장비에 오더가 완료되지 않았습니다.'
              });

              //clearInterval(timerId2);
              return;
            }

            //if (response.data.result_data.dev_result_list[0].code == 1) {
            //clearInterval(timerId2);

            //TASK
            var _taskIdCheck = response.data.result_data.dev_result_list[0].task_id;
            setTaskIdCheck(_taskIdCheck);

            //console.log('_taskIdCheck:' + _taskIdCheck);
            //console.log('!!!!멈춰 paramSettingNova !!');

            //queryParamSettingTask 조회
            clearInterval(TabTimer.timer);
            TabTimer.timer = setInterval(() => {
              const paramsCheck = {};
              paramsCheck['appkey'] = '8E3C8D5EA073CAA8B0C18B6C92AF7AF4';
              paramsCheck['token'] = token;
              paramsCheck['lang'] = '_en_US';
              paramsCheck['uuid'] = uuid;
              paramsCheck['task_id'] = _taskIdCheck;

              axios
                .post('https://augateway.isolarcloud.com/v1/devService/queryParamSettingTask', paramsCheck, {
                  headers: {
                    sys_code: '901'
                  }
                })
                .then(function(response) {
                  //console.log('명령실행시 queryParamSettingTask 상세 조회 타입 =======');
                  //console.log(response);

                  //실행한 리드백이 완료가 되었을때
                  if (response.data.result_data.command_status == 8) {
                    //console.log('!!!!멈춰 queryParamSettingTask!!');
                    //clearInterval(TabTimer.timer);
                    //clearInterval(TabTimer.timerControl);
                    /*
                      var status = '';
                      var power = '';
                      var lmtUSoc = '';
                      var lmtLSoc = '';

                      for (var item of response.data.result_data.param_list) {
                        //console.log('item : ' + item);

                        if (item.point_name === 'SOC Upper Limit') {
                          lmtUSoc = parseFloat(item.return_value).toFixed(2);
                        }
                        if (item.point_name === 'SOC Lower Limit') {
                          lmtLSoc = parseFloat(item.return_value).toFixed(2);
                        }
                      }
                      //here
                      var tmpStatusList = [btStatus, btValue, lmtUSoc, lmtLSoc];
                      //update list STATE
                      //setStatusList(tmpStatusList);
                      */
                  } else if (response.data.result_data.command_status == 2) {
                    //console.log('2이면 아직 ... 계속 진행중 ');
                    //2라면 아직 ... 계속 진행중
                  } else {
                    //중간에 에러발생시 프로그래스 바끔!

                    setPercentage(0);
                    setLoading(false);
                    //clearInterval(timerId2);
                    clearInterval(TabTimer.timer);
                    clearInterval(TabTimer.timerControl);

                    Modal.error({
                      title: service.getValue(lang, 'LANG00296', 'no-text'),
                      content: service.getValue(lang, 'LANG00410', 'no-text') + '....'
                    });
                    return;
                  }
                });
            }, 5000);
            //}
          });
        //}, 5000);
      });
  }

  function setDBStatues(_taskId) {
    const params = {};

    params['uuid'] = uuid;
    params['taskId'] = _taskId;
    params['taskFrom'] = 'app_control';
    params['status'] = inputStatus;
    params['power'] = inputPower;
    params['lmtUSoc'] = inputSocU;
    params['lmtLSoc'] = inputSocL;
    params['goal'] = goalValue;
    params['calTime'] = calTime;
    params['siteId'] = siteId;
    params['facId'] = facId;

    const obj = api.createEssControl(params);
    Fetcher.post(obj.url, obj.params).then(result => {
      var tmpControlList = [params['status'], params['power'], params['lmtUSoc'], params['lmtLSoc']];
      //update list
      setControlList(tmpControlList);

      //update goal
      setGoalText(params['goal']);
    });
  }

  var timeLimit = 0;

  function saveControl() {
    timeLimit = 0;

    //Self-consumption은 로딩바를 넣지 않아도됨
    if (inputStatus == 'charging' || inputStatus == 'discharging') {
      setPercentage(0);
      setLoading(true);
    } else {
    }

    //목표치 설정 단위에 따른 변환
    if (inputGoalUnit == 'percent') {
      goalValue = inputGoal;
    } else {
      goalValue = ((inputGoal / batteryCapacity) * 100).toFixed(2);
    }

    if (inputStatus == 'charging' || inputStatus == 'discharging') {
      calTime = (batteryCapacity * Math.abs(goalValue - batPower * 100)) / 100 / inputPower;
      // calTime = calTime * 3600 * 0.85; //초단위 * 조정값
      calTime = calTime * 3600 * 0.75; // 구과장님요청으로 0.85 -> 0.75로 조정
    } else if (inputStatus == 'stop') {
      calTime = 15;
    } else if (inputStatus == 'self-consumption') {
      calTime = 0;
    }

    //console.log(batteryCapacity);
    //console.log(goalValue);
    //console.log(batPower * 100);
    //console.log(inputPower);
    //console.log('===============');
    //console.log('timeLimit: '+timeLimit);
    //console.log('calTime: '+calTime);
    var fireFlag = false;
    clearInterval(TabTimer.timerControl);
    TabTimer.timerControl = setInterval(() => {
      var pValue = parseInt((1.0 / calTime) * timeLimit * 100); //1574.37
      setPercentage(pValue);

      timeLimit++;

      console.log('SAVE CONTROL :' + inputStatus);

      if (pValue >= 100) {
        setLoading(false);
        clearInterval(TabTimer.timerControl);

        if (inputStatus == 'charging' || inputStatus == 'discharging') {
          //console.log('SAVE CONTROL FIRE2 ====================');
          if (fireFlag == false) {
            fireFlag = true;

            setDeviceStatusStop('complete', uuid);
            //console.log('success 2222')

            Modal.error({
              title: service.getValue(lang, 'LANG00029', 'no-text'),
              content: service.getValue(lang, 'LANG00425', 'no-text')
            });
            return;
          }
        }
      }
    }, 1 * 1000);

    setDeviceStatus();
  }

  return (
    <>
      {loading ? ( //loading
        <div style={{ width: '100%', height: '93%', position: 'absolute', zIndex: 10000, backgroundColor: '#33333333', transform: 'translate(-20px, -10px)' }}>
          <div style={{ float: 'right', padding: '20px', fontSize: 24, cursor: 'pointer' }} onClick={cancelControl}>
            x
          </div>
          <div style={{ width: '200px', height: '200px', position: 'fixed', left: '50%', transform: 'translate(-50%, 0)', marginTop: '200px' }}>
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              styles={buildStyles({
                pathColor: '#2c79f4',
                textColor: '#2c79f4',
                trailColor: '#999999'
              })}
            />
          </div>
        </div>
      ) : (
        ''
      )}

      <Row className="kpi-wrap">
        <Col className="control-col2">
          <Card bordered={false}>
            <p>* {service.getValue(lang, 'LANG00401', 'no-text').replace('{now}', now)}</p>
          </Card>
          <Table dataSource={dataSourceTable} columns={columns} pagination={false} />
        </Col>
      </Row>
      <Row type="flex" justify="end">
        <div className="controlSubBox">
          <div className="tit">{service.getValue(lang, 'LANG00405', 'no-text')}</div>
          <div className="conts" style={{ width: '280px' }}>
            {goalText}% / <span className="sandybrown">Success</span>
          </div>
        </div>
      </Row>

      <Row type="flex" justify="end">
        <div className="controlSubBoxCur">
          <div className="tit">{service.getValue(lang, 'LANG00408', 'no-text')}</div>
          <div className="conts" style={{ marginLeft: '10px' }}>
            {batPower <= 0 ? ' - ' : (batPower * 100).toFixed(2)}%
          </div>
        </div>

        <div className="controlSubBox">
          <div className="tit">{service.getValue(lang, 'LANG00406', 'no-text')}</div>

          <div className="conts" style={{ marginLeft: '40px', paddingTop: '5px' }}>
            <Input disabled={disable} value={inputGoal} onInput={e => setInputGoal(e.target.value)} />
          </div>
          <div className="conts" style={{ marginLeft: '5px', paddingTop: '5px' }}>
            <Select value={inputGoalUnit} onChange={e => handleChangeUnit(e)} disabled={disable} style={{ width: '100px' }}>
              <Option value="percent">SOC(%)</Option>
              <Option value="kwh">{service.getValue(lang, 'LANG00409', 'no-text')}</Option>
            </Select>
          </div>
        </div>
      </Row>

      <Row type="flex" justify="end" className="btnWrap">
        <Button onClick={clickSave} type="primary">
          {service.getValue(lang, 'LANG00089', 'no-text')}
        </Button>
      </Row>
    </>
  );
};

export default Controls;
