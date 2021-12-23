import { locale, service } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

const buttons = [
  {
    key: '1',
    label: `Work Order ${service.getValue(lang, 'LANG00050', 'no-text')}`,
    roll: 'publish'
  },
  {
    key: '2',
    label: service.getValue(lang, 'LANG00197', 'no-text'),
    roll: 'resend'
  },
  {
    key: '3',
    label: service.getValue(lang, 'LANG00198', 'no-text'),
    roll: 'modify'
  }
];

const defaultFields = [
  {
    key: 'publDtti',
    label: service.getValue(lang, 'LANG00098', 'no-text'),
    type: 'input'
  },
  {
    key: 'publUserName',
    label: service.getValue(lang, 'LANG00199', 'no-text'),
    type: 'input'
  },
  {
    key: 'workOrdId',
    label: `W/O ${service.getValue(lang, 'LANG00126', 'no-text')}`,
    type: 'input'
  },
  {
    key: 'workOrdTyp',
    label: `W/O ${service.getValue(lang, 'LANG00045', 'no-text')}`,
    type: 'input'
  },
  {
    key: 'workOrdStat',
    label: `W/O ${service.getValue(lang, 'LANG00046', 'no-text')}`,
    type: 'input'
  },
  {
    key: 'cmplReqDt',
    label: service.getValue(lang, 'LANG00102', 'no-text'),
    type: 'input'
  },
  {
    key: 'siteId',
    label: service.getValue(lang, 'LANG00063', 'no-text'),
    type: 'input',
    columns: 1,
    formLayout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 }
    }
  },
  {
    key: 'siteUserName',
    label: service.getValue(lang, 'LANG00064', 'no-text'),
    type: 'input'
  },
  {
    key: 'siteUserTelNo',
    label: `${service.getValue(lang, 'LANG00073', 'no-text')} ${service.getValue(lang, 'LANG00074', 'no-text')}`,
    type: 'input'
  },
  {
    key: 'workOrdUserName',
    label: service.getValue(lang, 'LANG00200', 'no-text'),
    type: 'input'
  },
  {
    key: 'workOrdUserTelNo',
    label: service.getValue(lang, 'LANG00201', 'no-text'),
    type: 'input'
  }
];

const modals = [
  {
    key: 'publish',
    title: `W/O ${service.getValue(lang, 'LANG00050', 'no-text')}`,
    footer: {
      right: ['cancel', 'save']
    },
    fields: [
      {
        key: 'publDtti',
        label: service.getValue(lang, 'LANG00098', 'no-text'),
        type: 'datepicker',
        initialValue: null,
        columns: 1,
        style: {
          marginLeft: -1
        },
        props: {
          disabled: true
        },
        formLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 7 }
        }
      },
      {
        key: 'workOrdId',
        label: `W/O ${service.getValue(lang, 'LANG00126', 'no-text')}`,
        props: {
          disabled: true
        },
        type: 'input'
      },
      {
        key: 'workOrdTyp',
        label: `W/O ${service.getValue(lang, 'LANG00045', 'no-text')}`,
        type: 'select',
        initialValue: null,
        onHandler: {
          target: ['smsCntn', 'mailCntn']
        },
        options: []
      },
      {
        key: 'siteId',
        label: `${service.getValue(lang, 'LANG00063', 'no-text')}/${service.getValue(lang, 'LANG00064', 'no-text')}`,
        type: 'select',
        initialValue: null,
        options: [],
        placeholder: 'Select',
        columns: 1,
        style: {
          marginLeft: -1
        },
        formLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 19 }
        },
        onHandler: {
          target: ['workOrdUserName', 'workOrdUserTelNo', 'userSeq']
        }
      },
      {
        key: 'workOrdUserName',
        label: service.getValue(lang, 'LANG00200', 'no-text'),
        type: 'input',
        props: {
          disabled: true
        }
      },
      {
        key: 'workOrdUserTelNo',
        label: service.getValue(lang, 'LANG00201', 'no-text'),
        type: 'input',
        props: {
          disabled: true
        }
      },
      {
        key: 'cmplReqDt',
        label: service.getValue(lang, 'LANG00102', 'no-text'),
        type: 'datepicker',
        initialValue: null,
        columns: 1,
        style: {
          marginLeft: -1
        },
        formLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 7 }
        }
      },
      {
        key: 'smsCntn',
        label: `SMS ${service.getValue(lang, 'LANG00044', 'no-text')}`,
        type: 'textarea',
        props: {
          rows: 4
        },
        style: {
          resize: 'none'
        },
        columns: 1,
        formLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 19 }
        }
      },
      {
        key: 'mailCntn',
        label: `Mail ${service.getValue(lang, 'LANG00044', 'no-text')}`,
        type: 'textarea',
        props: {
          rows: 4
        },
        style: {
          resize: 'none'
        },
        columns: 1,
        formLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 19 }
        }
      },
      {
        key: 'userSeq',
        label: '',
        type: 'input',
        style: {
          display: 'none'
        }
      },
      {
        key: 'workOrdPublGubn',
        label: '',
        type: 'input',
        initialValue: null,
        style: { display: 'none' }
      }
    ]
  },
  {
    key: 'view',
    title: `W/O ${service.getValue(lang, 'LANG00050', 'no-text')}`,
    footer: {
      left: ['remove'],
      right: ['cancel', 'update', 'complete', 'reject']
    },
    create: {
      left: ['remove'],
      right: ['cancel', 'save']
    },
    read: {
      left: ['remove'],
      right: ['cancel']
    }
  },
  {
    key: 'resend',
    title: service.getValue(lang, 'LANG00202', 'no-text'),
    message: service.getValue(lang, 'LANG00167', 'no-text'),
    footer: {
      right: ['cancel', 'confirm']
    }
  },
  {
    key: 'cnfmDt',
    title: service.getValue(lang, 'LANG00346', 'no-text'),
    message: service.getValue(lang, 'LANG00347', 'no-text'),
    fields: [
      {
        key: 'cnfmDt',
        label: service.getValue(lang, 'LANG00127', 'no-text'),
        type: 'datepicker',
        initialValue: null,
        formLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }
      }
    ],
    footer: {
      right: ['cancel', 'check']
    }
  },
  {
    key: 'modify',
    title: service.getValue(lang, 'LANG00203', 'no-text'),
    message: `${service.getValue(lang, 'LANG00249', 'no-text')}`,
    fields: [
      {
        key: 'cmplReqDt',
        label: service.getValue(lang, 'LANG00102', 'no-text'),
        type: 'datepicker',
        initialValue: null,
        formLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }
      }
    ],
    footer: {
      right: ['cancel', 'save']
    }
  },
  {
    key: 'register',
    title: service.getValue(lang, 'LANG00204', 'no-text'),
    width: 580
  },
  {
    key: 'result',
    title: service.getValue(lang, 'LANG00205', 'no-text'),
    footer: {
      left: ['remove'],
      right: ['cancel', 'save']
    }
  },
  {
    key: 'reject',
    title: 'W.O 반려처리',
    fields: [
      {
        key: 'qaCmplDt',
        label: `QA ${service.getValue(lang, 'LANG00108', 'no-text')}`,
        type: 'datepicker',
        initialValue: null,
        formLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 19 }
        }
      },
      {
        key: 'qaNote',
        label: 'QA반려사유',
        type: 'textarea',
        props: {
          rows: 4
        },
        columns: 1,
        formLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 19 }
        }
      }
    ],
    footer: {
      right: ['cancel', 'approval']
    }
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
    key: 100,
    label: service.getValue(lang, 'LANG00272', 'no-text'),
    roll: 'result',
    type: 'primary',
    className: 'deep-grey',
    style: { fontSize: '10px', lineHeight: '18px' }
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
    key: 0,
    roll: 'remove',
    type: 'danger',
    label: service.getValue(lang, 'LANG00068', 'no-text')
  },
  {
    key: 4,
    roll: 'update',
    type: 'primary',
    label: service.getValue(lang, 'LANG00208', 'no-text')
  },
  {
    key: 5,
    roll: 'complete',
    type: 'primary',
    label: service.getValue(lang, 'LANG00209', 'no-text')
  },
  {
    key: 6,
    roll: 'check',
    type: 'primary',
    label: service.getValue(lang, 'LANG00089', 'no-text')
  },
  {
    key: 7,
    roll: 'reject',
    type: 'primary',
    label: 'W.O반려처리'
  },
  {
    key: 8,
    roll: 'approval',
    type: 'primary',
    label: service.getValue(lang, 'LANG00089', 'no-text')
  }
];

const summaryValue = [
  {
    title: service.getValue(lang, 'LANG00210', 'no-text'),
    span: 12,
    rowData: [
      {
        title: null,
        dataIndex: 'wt0002Cnt',
        description: service.getValue(lang, 'LANG00059', 'no-text'),
        span: 6,
        status: 'default'
      },
      {
        title: null,
        dataIndex: 'wt0001Cnt',
        description: service.getValue(lang, 'LANG00058', 'no-text'),
        span: 6,
        status: 'error'
      },
      {
        title: null,
        dataIndex: 'wt0003Cnt',
        description: service.getValue(lang, 'LANG00060', 'no-text'),
        span: 6,
        color: 'blue'
      },
      {
        title: null,
        dataIndex: 'wt0004Cnt',
        description: service.getValue(lang, 'LANG00124', 'no-text'),
        span: 6,
        color: 'black'
      }
    ]
  },
  {
    title: service.getValue(lang, 'LANG00046', 'no-text'),
    span: 12,
    stepData: [
      {
        title: null,
        dataIndex: 'ws0001Cnt',
        description: service.getValue(lang, 'LANG00050', 'no-text'),
        span: 6
      },
      {
        title: null,
        dataIndex: 'ws0002Cnt',
        description: service.getValue(lang, 'LANG00051', 'no-text'),
        span: 6
      },
      {
        title: null,
        dataIndex: 'ws0003Cnt',
        description: 'QA',
        span: 6
      },
      {
        title: null,
        dataIndex: 'ws0004Cnt',
        description: service.getValue(lang, 'LANG00052', 'no-text'),
        span: 6
      }
    ]
  }
];

const resultFields = [
  {
    key: 'cmplPredDt',
    label: service.getValue(lang, 'LANG00108', 'no-text'),
    type: 'datepicker',
    initialValue: null,
    rules: [{ required: true, message: service.getValue(lang, 'LANG00108', 'no-text') }]
  },
  {
    key: 'note',
    label: `${service.getValue(lang, 'LANG00128', 'no-text')} ${service.getValue(lang, 'LANG00044', 'no-text')}`,
    type: 'textarea',
    props: {
      rows: 4
    },
    columns: 1,
    formLayout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    }
  },
  {
    key: 'fileId',
    label: service.getValue(lang, 'LANG00077', 'no-text'),
    type: 'upload',
    columns: 1,
    formLayout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    },
    initialValue: []
  },
  {
    key: 'qaCmplDt',
    label: `QA ${service.getValue(lang, 'LANG00108', 'no-text')}`,
    type: 'datepicker',
    initialValue: null
  },
  {
    key: 'qaNote',
    label: 'QA반려사유',
    type: 'textarea',
    props: {
      rows: 4
    },
    columns: 1,
    formLayout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    }
  }
];

export { summaryValue, buttons, modals, actionButtons, defaultFields, resultFields };
