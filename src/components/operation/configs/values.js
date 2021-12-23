import moment from 'moment';
import { locale, service } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

const buttons = [
  {
    key: '1',
    label: `${service.getValue(lang, 'LANG00058', 'no-text')} W/O`,
    roll: 'breakdown',
    props: { eqmtStatus: 'AL0002', workOrdTyp: 'WT0001' },
    style: {
      fontSize: 14,
      letterSpacing: '-0.6px'
    }
  },
  {
    key: '2',
    label: `${service.getValue(lang, 'LANG00059', 'no-text')} W/O`,
    roll: 'error',
    props: { eqmtStatus: 'AL0003', workOrdTyp: 'WT0002' },
    style: {
      fontSize: 14,
      letterSpacing: '-0.6px'
    }
  },
  {
    key: '3',
    label: `${service.getValue(lang, 'LANG00060', 'no-text')} W/O`,
    roll: 'inspection',
    props: { workOrdTyp: 'WT0003' },
    style: {
      fontSize: 14,
      letterSpacing: '-0.6px'
    }
  },
  {
    key: '4',
    label: service.getValue(lang, 'LANG00250', 'no-text'),
    roll: 'link',
    style: {
      fontSize: 14,
      letterSpacing: '-0.6px'
    }
  }
];

const modals = [
  {
    key: 'breakdown',
    title: `${service.getValue(lang, 'LANG00058', 'no-text')} W/O ${service.getValue(lang, 'LANG00067', 'no-text')}`,
    footer: {
      right: ['cancel', 'confirm']
    }
  },
  {
    key: 'error',
    title: `${service.getValue(lang, 'LANG00059', 'no-text')} W/O ${service.getValue(lang, 'LANG00067', 'no-text')}`,
    footer: {
      right: ['cancel', 'confirm']
    }
  },
  {
    key: 'inspection',
    title: `${service.getValue(lang, 'LANG00060', 'no-text')} W/O ${service.getValue(lang, 'LANG00067', 'no-text')}`,
    footer: {
      right: ['cancel', 'confirm']
    }
  },
  {
    key: 'sms',
    title: 'SMS 메시지 내용 일괄변경',
    message: 'SMS 메세지를 아래와 같이 변경하시겠습니까?',
    fields: [
      {
        key: 'smsCntn',
        label: '',
        type: 'textarea',
        style: {
          resize: 'none'
        },
        props: {
          row: 4
        },
        formLayout: {
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        }
      }
    ],
    footer: {
      right: ['cancel', 'save']
    }
  },
  {
    key: 'email',
    title: 'Email 메세지 내용 일괄변경',
    message: 'Email 메세지를 아래와 같이 변경하시겠습니까?',
    fields: [
      {
        key: 'mailCntn',
        label: '',
        type: 'textarea',
        style: {
          resize: 'none'
        },
        props: {
          row: 4
        },
        formLayout: {
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        }
      }
    ],
    footer: {
      right: ['cancel', 'save']
    }
  },
  {
    key: 'request',
    title: `${service.getValue(lang, 'LANG00102', 'no-text')} ${service.getValue(lang, 'LANG00067', 'no-text')}`,
    fields: [
      {
        key: 'cmplReqDt',
        label: `${service.getValue(lang, 'LANG00102', 'no-text')} ${service.getValue(lang, 'LANG00067', 'no-text')}`,
        type: 'datepicker',
        initialValue: moment().add(3, 'd'),
        formLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }
      }
    ],
    footer: {
      right: ['cancel', 'save']
    }
  }
];

const workButtons = [
  {
    key: 'sms',
    label: `SMS ${service.getValue(lang, 'LANG00067', 'no-text')}`,
    roll: 'sms'
  },
  {
    key: 'email',
    label: `Email ${service.getValue(lang, 'LANG00067', 'no-text')}`,
    roll: 'email'
  },
  {
    key: 'request',
    label: `${service.getValue(lang, 'LANG00102', 'no-text')} ${service.getValue(lang, 'LANG00067', 'no-text')}`,
    roll: 'request'
  }
];

const actionButtons = [
  {
    key: 2,
    roll: 'confirm',
    type: 'primary',
    label: service.getValue(lang, 'LANG00206', 'no-text')
  },
  {
    key: 3,
    roll: 'save',
    type: 'primary',
    label: service.getValue(lang, 'LANG00089', 'no-text')
  },
  {
    key: 1,
    roll: 'cancel',
    type: 'default',
    label: service.getValue(lang, 'LANG00069', 'no-text')
  },
  {
    key: -1,
    roll: 'remove',
    type: 'danger',
    label: service.getValue(lang, 'LANG00068', 'no-text')
  },
  {
    key: 4,
    roll: 'publish',
    type: 'primary',
    label: service.getValue(lang, 'LANG00050', 'no-text')
  }
];

const tabs = [
  {
    sort: 1,
    key: 'operation'
  },
  {
    sort: 2,
    key: 'notification'
  },
  {
    sort: 3,
    key: 'kpi'
  },
  {
    sort: 4,
    key: 'rawdata'
  },
  {
    sort: 5,
    key: 'controls'
  },
  {
    sort: 6,
    key: 'controlHistory'
  }
];

const summaryValue = [
  {
    title: service.getValue(lang, 'LANG00301', 'no-text'),
    unit: 'kWh',
    dataIndex: 'todayGnrt',
    chartData: {
      dataIndex: 'todayGnrtVsGoal',
      unit: '%'
    }
  },
  {
    title: service.getValue(lang, 'LANG00343', 'no-text'),
    unit: 'kWh/kWp',
    dataIndex: 'todayEnergy',
    chartData: {
      dataIndex: 'todayEnergyVsGoal',
      unit: '%'
    }
  },
  {
    title: service.getValue(lang, 'LANG00303', 'no-text'),
    dataIndex: 'monthGnrt',
    unit: 'kWh',
    chartData: {
      dataIndex: 'monthGnrtVsGoal',
      unit: '%'
    }
  },
  {
    title: service.getValue(lang, 'LANG00344', 'no-text'),
    dataIndex: 'monthEnergy',
    unit: 'kWh/kWp',
    chartData: {
      dataIndex: 'monthEnergyVsGoal',
      unit: '%'
    }
  },
  {
    title: service.getValue(lang, 'LANG00169', 'no-text'),
    dataIndex: 'unrReleCnt',
    unit: service.getValue(lang, 'LANG00037', 'no-text')
  },
  {
    title: service.getValue(lang, 'LANG00170', 'no-text'),
    dataIndex: 'workOrderTotCnt',
    unit: service.getValue(lang, 'LANG00037', 'no-text')
  }
];

export { buttons, modals, workButtons, actionButtons, tabs, summaryValue };
