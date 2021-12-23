import { locale, service } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

const actionButtons = [
  {
    key: 1,
    label: service.getValue(lang, 'LANG00291', 'no-text'),
    roll: 'read',
    type: 'primary',
    className: 'deep-grey',
    style: { padding: '0 60px', height: '20px', fontSize: '10px', lineHeight: '17px' }
  },
  {
    key: 2,
    label: service.getValue(lang, 'LANG00057', 'no-text'),
    roll: 'search',
    type: 'default',
    className: 'grey'
  },
  {
    key: 4,
    roll: 'save',
    type: 'primary',
    label: service.getValue(lang, 'LANG00089', 'no-text')
  },
  {
    key: 3,
    roll: 'cancel',
    type: 'default',
    label: service.getValue(lang, 'LANG00069', 'no-text')
  }
];

const modals = [
  {
    key: 'update',
    title: `${service.getValue(lang, 'LANG00289', 'no-text')}(${service.getValue(lang, 'LANG00208', 'no-text')})`,
    message: service.getValue(lang, 'LANG00292', 'no-text'),
    footer: {
      right: ['cancel', 'save']
    },
    fields: [
      {
        key: 'siteId',
        label: service.getValue(lang, 'LANG00063', 'no-text'),
        type: 'input',
        props: {
          disabled: true
        },
        formLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 8 }
        }
      },
      {
        key: 'userName',
        label: service.getValue(lang, 'LANG00064', 'no-text'),
        type: 'input',
        props: {
          disabled: true
        },
        formLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 8 }
        }
      },
      {
        key: 'cnrt',
        label: 'PPA',
        type: 'rangepicker',
        initialValue: [],
        props: {
          disabled: true
        },
        format: 'YYYY-MM-DD',
        placeholder: ['Start Date', 'End Date'],
        formLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }
      }
    ]
  }
];

const buttons = [
  {
    key: 1,
    label: service.getValue(lang, 'LANG00208', 'no-text'),
    roll: 'update',
    type: 'primary',
    style: {
      minWidth: '80px'
    }
  }
];

const historyFields = [
  {
    key: 'siteId',
    label: service.getValue(lang, 'LANG00063', 'no-text'),
    type: 'input',
    initialValue: ''
  },
  {
    key: 'userName',
    label: service.getValue(lang, 'LANG00064', 'no-text'),
    type: 'input',
    initialValue: ''
  }
];

export { buttons, actionButtons, modals, historyFields };
