import { locale, service } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

const buttons = [
  {
    key: '1',
    label: service.getValue(lang, 'LANG00056', 'no-text'),
    roll: 'add',
    className: 'grey'
  }
];
const modals = [
  {
    key: 'add',
    title: `${service.getValue(lang, 'LANG00246', 'no-text')} ${service.getValue(lang, 'LANG00048', 'no-text')}`,
    message: service.getValue(lang, 'LANG00247', 'no-text'),
    footer: {
      right: ['cancel', 'save']
    }
  },
  {
    key: 'update',
    title: `${service.getValue(lang, 'LANG00246', 'no-text')} ${service.getValue(lang, 'LANG00208', 'no-text')}`,
    message: service.getValue(lang, 'LANG00248', 'no-text'),
    footer: {
      left: ['remove'],
      right: ['cancel', 'save']
    }
  }
];

const actionButtons = [
  {
    key: 1,
    label: service.getValue(lang, 'LANG00208', 'no-text'),
    roll: 'update',
    type: 'primary',
    className: 'deep-grey',
    style: { padding: '0 60px', height: '20px', fontSize: '10px', lineHeight: '17px' }
  },
  {
    key: 2,
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
    key: 2,
    roll: 'remove',
    type: 'danger',
    label: service.getValue(lang, 'LANG00068', 'no-text')
  },
  {
    key: 2,
    roll: 'ok',
    type: 'primary',
    label: service.getValue(lang, 'LANG00206', 'no-text')
  }
];

const fields = [
  {
    key: 'rscGrpId',
    label: service.getValue(lang, 'LANG00242', 'no-text'),
    type: 'input',
    placeholder: service.getValue(lang, 'LANG00242', 'no-text')
  },
  {
    key: 'rscGrpName',
    label: service.getValue(lang, 'LANG00243', 'no-text'),
    type: 'input',
    placeholder: service.getValue(lang, 'LANG00243', 'no-text')
  },
  {
    key: 'date',
    label: service.getValue(lang, 'LANG00244', 'no-text'),
    type: 'rangepicker',
    initialValue: [],
    showTime: { format: 'HH:mm' },
    format: 'YYYY-MM-DD HH:mm',
    placeholder: [service.getValue(lang, 'LANG00273', 'no-text'), service.getValue(lang, 'LANG00274', 'no-text')],
    formLayout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
  },
  {
    key: 'rscStatCd',
    label: service.getValue(lang, 'LANG00245', 'no-text'),
    type: 'select',
    initialValue: 'I',
    options: [
      {
        key: 'I',
        label: 'Y',
        value: 'I'
      },
      {
        key: 'C',
        label: 'N',
        value: 'C'
      }
    ]
  }
];

export { modals, buttons, actionButtons, fields };
