import { locale, service } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

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
const modal = {
  title: service.getValue(lang, 'LANG00307', 'no-text'),
  footer: {
    right: ['cancel', 'confirm']
  }
};
const statSearch = [
  {
    key: 'startDt',
    type: 'datepicker',
    props: {
      placeholder: service.getValue(lang, 'LANG00099', 'no-text')
    } // rules: [{ required: true }]
  },
  {
    key: 'endDt',
    type: 'datepicker',
    props: {
      placeholder: service.getValue(lang, 'LANG00100', 'no-text')
    } // rules: [{ required: true }]
  },
  {
    label: '',
    key: 'type',
    type: 'select',
    options: [],
    rules: [{ required: true }]
  },
  {
    key: 'siteId',
    type: 'input',
    options: [],
    props: {}
    // rules: [{ required: true }]
  },
  {
    key: 'userName',
    type: 'input',
    options: [],
    props: {}
  }
];

// const alertSearch=[
//   {
//     key: 'type',
//     type: 'select',
//     options: [],
//     // rules: [{ required: true }]
//   },
//   {
//     key: 'startDt',
//     type: 'datepicker',
//     props: {
//       placeholder: service.getValue(lang, 'LANG00099', 'no-text')
//     } // rules: [{ required: true }]
//   },
//   {
//     key: 'endDt',
//     type: 'datepicker',
//     props: {
//       placeholder: service.getValue(lang, 'LANG00100', 'no-text')
//     } // rules: [{ required: true }]
//   },
//   {
//     key: 'siteId',
//     type: 'input',
//     options: [],
//     props: {}
//     // rules: [{ required: true }]
//   },
//   {
//     key: 'userName',
//     type: 'input',
//     options: [],
//     props: {}
//   },
//   {
//     key: 'manufact',
//     type: 'input',
//     options: [],
//     props: {}
//     // rules: [{ required: true }]
//   },
//   {
//     key: 'modelName',
//     type: 'input',
//     options: [],
//     props: {}
//   },
//   {
//     key: 'alertGubn',
//     type: 'input',
//     options: [],
//     props: {}
//   }
// ]
export { actionButtons, statSearch, modal };
