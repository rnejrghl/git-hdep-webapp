import React from 'react';
import moment from 'moment';
import { locale, service } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

console.log('lang', lang);

const buttons = [
  {
    key: '1',
    label: service.getValue(lang, 'LANG00258', 'no-text'),
    roll: 'register'
  },
  {
    key: '2',
    label: service.getValue(lang, 'LANG00066', 'no-text'),
    roll: 'file'
  },
  {
    key: '3',
    label: service.getValue(lang, 'LANG00294', 'no-text'),
    roll: 'uTermList'
  },
  {
    key: '4',
    label: service.getValue(lang, 'LANG00295', 'no-text'),
    roll: 'dSiteDelList'
  }
];

const modals = [
  {
    key: 'register',
    title: service.getValue(lang, 'LANG00232', 'no-text'),
    footer: {
      left: ['remove'],
      right: ['cancel', 'save']
    }
  },
  {
    key: 'goal',
    title: service.getValue(lang, 'LANG00007', 'no-text'),
    fields: [
      {
        key: 'userName',
        label: service.getValue(lang, 'LANG00064', 'no-text'),
        type: 'input',
        initialValue: ''
      }
    ],
    footer: {
      right: ['cancel', 'update']
    },
    edit: {
      right: ['cancel', 'save']
    }
  },
  {
    key: 'file',
    title: `${service.getValue(lang, 'LANG00066', 'no-text')}(${service.getValue(lang, 'LANG00007', 'no-text')})`,
    message: service.getValue(lang, 'LANG00163', 'no-text'),
    footer: {
      right: ['cancel', 'save']
    },
    fields: [
      {
        key: 'multipartFile',
        label: service.getValue(lang, 'LANG00077', 'no-text'),
        type: 'upload',
        props: {
          only: true,
          beforeUpload: () => false
        },
        initialValue: null,
        formLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }
      }
    ],
    description: (
      <div className="description">
        <p>{`${service.getValue(lang, 'LANG00164', 'no-text')} ${service.getValue(lang, 'LANG00165', 'no-text')}`}</p>
        <p>{service.getValue(lang, 'LANG00166', 'no-text')}</p>
      </div>
    )
  },
  {
    key: 'uTermList',
    title: `${service.getValue(lang, 'LANG00294', 'no-text')}(${service.getValue(lang, 'LANG00014', 'no-text')})`,
    message: service.getValue(lang, 'LANG00163', 'no-text'),
    footer: {
      right: ['cancel', 'save']
    },
    fields: [
      {
        label: service.getValue(lang, 'LANG00120', 'no-text'),
        key: 'termDt',
        type: 'datepicker',
        initialValue: moment(),
        formLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 8 }
        }
      },
      {
        key: 'termRsn',
        label: service.getValue(lang, 'LANG00121', 'no-text'),
        type: 'textarea',
        props: {
          row: 4
        },
        formLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }
      }
    ]
  },
  {
    key: 'dSiteDelList',
    title: `${service.getValue(lang, 'LANG00295', 'no-text')}(${service.getValue(lang, 'LANG00068', 'no-text')})`,
    message: service.getValue(lang, 'LANG00163', 'no-text'),
    footer: {
      right: ['cancel', 'remove']
    }
  }
];

const summaryValue = [
  {
    title: service.getValue(lang, 'LANG00011', 'no-text'),
    span: 7,
    stepData: [
      {
        title: null,
        dataIndex: 'pscCnt',
        description: service.getValue(lang, 'LANG00185', 'no-text'),
        span: 8
      },
      {
        title: null,
        dataIndex: 'pspCnt',
        description: service.getValue(lang, 'LANG00215', 'no-text'),
        span: 8
      },
      {
        title: null,
        dataIndex: 'wkplCmplCnt',
        description: service.getValue(lang, 'LANG00176', 'no-text'),
        span: 8
      }
    ]
  },
  {
    title: service.getValue(lang, 'LANG00012', 'no-text'),
    span: 11,
    stepData: [
      {
        title: null,
        dataIndex: 'applCnt',
        description: `Grid ${service.getValue(lang, 'LANG00088', 'no-text')}`,
        span: 4
      },
      {
        title: null,
        dataIndex: 'apprCnt',
        description: service.getValue(lang, 'LANG00180', 'no-text'),
        span: 4
      },
      {
        title: null,
        dataIndex: 'mpCnt',
        description: service.getValue(lang, 'LANG00181', 'no-text'),
        span: 4
      },
      {
        title: null,
        dataIndex: 'insCnt',
        description: service.getValue(lang, 'LANG00012', 'no-text')
      },
      {
        title: null,
        dataIndex: 'inspCnt',
        description: service.getValue(lang, 'LANG00116', 'no-text')
      }
    ]
  },
  {
    title: service.getValue(lang, 'LANG00013', 'no-text'),
    value: 0,
    dataIndex: 'mngCnt',
    unit: '',
    span: 3
  },
  {
    title: service.getValue(lang, 'LANG00014', 'no-text'),
    dataIndex: 'endCnt',
    value: 0,
    unit: '',
    span: 3
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
    key: 5,
    roll: 'remove',
    type: 'danger',
    label: service.getValue(lang, 'LANG00068', 'no-text')
  },
  {
    key: 4,
    roll: 'update',
    type: 'primary',
    label: service.getValue(lang, 'LANG00208', 'no-text')
  }
];

export { buttons, modals, summaryValue, actionButtons };
