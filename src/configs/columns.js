import locale from './locale';
import service from './service';

const lang = service.getValue(locale, 'languages', {});

const rawColumns = [
  {
    key: 'time',
    dataIndex: 'time',
    title: service.getValue(lang, 'LANG00055', 'no-text')
  },
  {
    key: 'accAmount',
    dataIndex: 'accAmount',
    title: service.getValue(lang, 'LANG00257', 'no-text')
  }
];

const kpiColumns = [
  {
    title: 'DAY',
    key: 'nowDate',
    dataIndex: 'nowDate',
    align: 'center',
    width: '85px'
  },
  {
    title: `${service.getValue(lang, 'LANG00016', 'no-text')}`,
    key: 'power',
    children: [
      {
        title: service.getValue(lang, 'LANG00192', 'no-text'),
        dataIndex: 'lastTotPwAmt',
        key: 'lastTotPwAmt',
        align: 'center'
      },
      {
        title: service.getValue(lang, 'LANG00007', 'no-text'),
        dataIndex: 'goalGenrCapa',
        key: 'goalGenrCapa',
        align: 'center'
      },
      {
        title: service.getValue(lang, 'LANG00008', 'no-text'),
        dataIndex: 'nowTotPwAmt',
        key: 'nowTotPwAmt',
        align: 'center'
      },
      {
        // title: service.getValue(lang, 'LANG00008', 'no-text'),
        dataIndex: 'genrKpi',
        key: 'genrKpi',
        base: 'goalGenrCapa',
        amount: 'nowTotPwAmt',
        align: 'center'
      }
    ]
  },
  {
    title: `${service.getValue(lang, 'LANG00336', 'no-text')}`,
    key: 'energyYield',
    children: [
      {
        title: service.getValue(lang, 'LANG00192', 'no-text'),
        dataIndex: 'lastTotEnergy',
        key: 'lastTotEnergy',
        align: 'center'
      },
      {
        title: service.getValue(lang, 'LANG00007', 'no-text'),
        dataIndex: 'goalEnergy',
        key: 'goalEnergy',
        align: 'center'
      },
      {
        title: service.getValue(lang, 'LANG00008', 'no-text'),
        dataIndex: 'nowTotEnergy',
        key: 'nowTotEnergy',
        align: 'center'
      },
      {
        // title: service.getValue(lang, 'LANG00008', 'no-text'),
        dataIndex: 'energyKpi',
        key: 'energyKpi',
        base: 'goalEnergy',
        amount: 'nowTotEnergy',
        align: 'center'
      }
    ]
  },
  {
    title: service.getValue(lang, 'LANG00337', 'no-text'),
    key: 'ivtEfficiency',
    children: [
      {
        title: service.getValue(lang, 'LANG00192', 'no-text'),
        dataIndex: 'lastTotIvt',
        key: 'nowIvt',
        align: 'center'
      },
      {
        title: service.getValue(lang, 'LANG00007', 'no-text'),
        dataIndex: 'goalIvt',
        key: 'goalIvt',
        align: 'center'
      },
      {
        title: service.getValue(lang, 'LANG00008', 'no-text'),
        dataIndex: 'nowTotIvt',
        key: 'nowTotIvt',
        align: 'center'
      }
    ]
  },
  {
    title: `${service.getValue(lang, 'LANG00020', 'no-text')}`,
    dataIndex: 'ppa',
    key: 'ppa',
    children: [
      {
        title: service.getValue(lang, 'LANG00192', 'no-text'),
        dataIndex: 'lastTotPpa',
        key: 'lastTotPpa',
        align: 'center'
      },
      {
        title: service.getValue(lang, 'LANG00007', 'no-text'),
        dataIndex: 'goalPpa',
        key: 'goalPpa',
        align: 'center'
      },
      {
        title: service.getValue(lang, 'LANG00008', 'no-text'),
        dataIndex: 'nowTotPpa',
        key: 'nowTotPpa',
        align: 'center'
      }
    ]
  }
];

const kpiChartData = [
  {
    name: service.getValue(lang, 'LANG00016', 'no-text'),
    dataIndex: 'nowTotPwAmt',
    type: 'line',
    data: []
  },
  {
    name: service.getValue(lang, 'LANG00336', 'no-text'),
    dataIndex: 'nowTotEnergy',
    type: 'line',
    data: []
  },
  {
    name: service.getValue(lang, 'LANG00337', 'no-text'),
    dataIndex: 'nowTotIvt',
    type: 'line',
    data: []
  },
  {
    name: service.getValue(lang, 'LANG00020', 'no-text'),
    dataIndex: 'nowTotPpa',
    type: 'line',
    data: []
  }
];

const notificationColumns = [
  {
    title: service.getValue(lang, 'LANG00193', 'no-text'),
    dataIndex: 'notiDt',
    key: 'notiDt',
    width: '90px',
    datepickBlock: true,
    datepickAble: [
      {
        placeholder: 'start',
        dataIndex: 'notiStartDt',
        onChange: null
      },
      {
        placeholder: 'end',
        dataIndex: 'notiEndDt',
        onChange: null
      }
    ]
  },
  {
    title: service.getValue(lang, 'LANG00023', 'no-text'),
    dataIndex: 'status',
    key: 'status',
    width: '80px',
    configKey: 'failStatus',
    selectAble: {
      list: null,
      onSelect: null,
      defaultValue: null
    }
  },
  {
    title: service.getValue(lang, 'LANG00194', 'no-text'),
    dataIndex: 'contents',
    key: 'contents',
    width: '80px',
    visibleAble: ['fault_name', 'type_name', 'fault_reason', 'fault_type_code', 'create_time', 'over_time']
  },
  {
    title: service.getValue(lang, 'LANG00195', 'no-text'),
    dataIndex: 'unlockDt',
    key: 'unlockDt',
    width: '90px',
    datepickBlock: true,
    datepickAble: [
      {
        placeholder: 'start',
        dataIndex: 'unlockStartDt',
        onChange: null
      },
      {
        placeholder: 'end',
        dataIndex: 'unlockEndDt',
        onChange: null
      }
    ]
  }
];

const workOrderColumns = [
  {
    title: service.getValue(lang, 'LANG00098', 'no-text'),
    dataIndex: 'publDtti',
    key: 'publDtti',
    datepickBlock: true,
    datepickAble: [
      {
        placeholder: service.getValue(lang, 'LANG00099', 'no-text'),
        dataIndex: 'publStartDt',
        onChange: null
      },
      {
        placeholder: service.getValue(lang, 'LANG00100', 'no-text'),
        dataIndex: 'publEndDt',
        onChange: null
      }
    ]
  },
  {
    title: `W/O${service.getValue(lang, 'LANG00045', 'no-text')}`,
    dataIndex: 'workOrdTyp',
    key: 'workOrdTyp',
    configKey: 'workOrdTypes',
    selectAble: {
      list: null,
      onSelect: null,
      defaultValue: null
    }
  },
  {
    title: `W/O${service.getValue(lang, 'LANG00046', 'no-text')}`,
    dataIndex: 'workOrdStat',
    key: 'workOrdStat',
    configKey: 'workOrdStatus',
    selectAble: {
      list: null,
      onSelect: null,
      defaultValue: null
    }
  },
  {
    title: service.getValue(lang, 'LANG00196', 'no-text'),
    dataIndex: 'rsltRegYn',
    key: 'rsltRegYn',
    selectAble: {
      list: null,
      onSelect: null,
      defaultValue: null
    }
  }
];

const controlHistoryColumns = [
  {
    title: service.getValue(lang, 'LANG00055', 'no-text'),
    key: 'timeStamp',
    dataIndex: 'timeStamp',
    width: '20%',
    align: 'center'
  },
  {
    title: service.getValue(lang, 'LANG00434', 'no-text'),
    key: 'taskId',
    dataIndex: 'taskId',
    width: '10%',
    align: 'center'
  },
  {
    title: service.getValue(lang, 'LANG00435', 'no-text'),
    key: 'status',
    dataIndex: 'status',
    width: '15%',
    align: 'center'
  },
  {
    title: service.getValue(lang, 'LANG00406', 'no-text'),
    key: 'goal',
    dataIndex: 'goal',
    width: '10%',
    align: 'center'
  },
  {
    title: service.getValue(lang, 'LANG00436', 'no-text'),
    key: 'power',
    dataIndex: 'power',
    width: '10%',
    align: 'center'
  },
  {
    title: service.getValue(lang, 'LANG00437', 'no-text'),
    key: 'lmtUSoc',
    dataIndex: 'lmtUSoc',
    width: '10%',
    align: 'center'
  },
  {
    title: service.getValue(lang, 'LANG00438', 'no-text'),
    key: 'lmtLSoc',
    dataIndex: 'lmtLSoc',
    width: '10%',
    align: 'center'
  },
  {
    title: service.getValue(lang, 'LANG00439', 'no-text'),
    key: 'userName',
    dataIndex: 'userName',
    width: '15%',
    align: 'center'
  }
];

export { rawColumns, kpiColumns, notificationColumns, workOrderColumns, kpiChartData, controlHistoryColumns };
