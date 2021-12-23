import moment from 'moment';
import { locale, service, formats } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

const statColumns = [
  {
    title: service.getValue(lang, 'LANG00063', 'no-text'),
    dataIndex: 'siteId',
    key: 'siteId',
    width: '15%'
  },
  {
    title: service.getValue(lang, 'LANG00064', 'no-text'),
    dataIndex: 'userName',
    key: 'userName',
    width: '10%'
  },
  {
    title: service.getValue(lang, 'LANG00087', 'no-text'),
    dataIndex: 'rescGubn',
    key: 'rescGubn',
    width: '5%'
  },
  {
    title: service.getValue(lang, 'LANG00055', 'no-text'),
    key: 'nowDate',
    dataIndex: 'nowDate',
    align: 'center',
    width: '10%'
  },
  {
    title: service.getValue(lang, 'LANG00016', 'no-text'),
    key: 'power',
    children: [
      {
        title: service.getValue(lang, 'LANG00035', 'no-text'),
        dataIndex: 'instCapa',
        key: 'instCapa',
        align: 'center'
      },
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
      }
    ]
  },
  {
    title: service.getValue(lang, 'LANG00337', 'no-text'),
    dataIndex: 'ivtEfficiency',
    key: 'ivtEfficiency',
    align: 'center'
  },
  {
    title: service.getValue(lang, 'LANG00336', 'no-text'),
    dataIndex: 'energyYield',
    key: 'energyYield',
    align: 'center'
  },
  {
    title: service.getValue(lang, 'LANG00065', 'no-text'),
    dataIndex: 'weather',
    key: 'weather',
    align: 'center'
  },
  {
    title: service.getValue(lang, 'LANG00373', 'no-text'),
    dataIndex: 'temperature',
    key: 'temperature',
    align: 'center'
  }
];

// const batteryColumns = [
//   {
//     title: service.getValue(lang, 'LANG00063', 'no-text'),
//     dataIndex: 'siteId',
//     key: 'siteId',
//     width: '15%'
//   },
//   {
//     title: service.getValue(lang, 'LANG00064', 'no-text'),
//     dataIndex: 'userName',
//     key: 'userName',
//     width: '10%'
//   },
//   {
//     title: service.getValue(lang, 'LANG00055', 'no-text'),
//     key: 'nowDate',
//     dataIndex: 'nowDate',
//     align: 'center',
//     width: '15%'
//   },
//   {
//     title: service.getValue(lang, 'LANG00018', 'no-text'),
//     key: 'charge/discharge',
//     children: [
//       {
//         title: service.getValue(lang, 'LANG00253', 'no-text'),
//         dataIndex: 'charge',
//         key: 'charge',
//         align: 'center'
//       },
//       {
//         title: service.getValue(lang, 'LANG00340', 'no-text'),
//         dataIndex: 'discharge',
//         key: 'discharge',
//         align: 'center'
//       }
//     ]
//   },
//   {
//     title: 'SOC / SOH',
//     key: 'SOC / SOH',
//     children: [
//       {
//         title: 'SOC',
//         dataIndex: 'SOC',
//         key: 'SOC',
//         align: 'center'
//       },
//       {
//         title: 'SOH',
//         dataIndex: 'SOH',
//         key: 'SOH',
//         align: 'center'
//       }
//     ]
//   },
//   {
//     title: 'Battery Efficiency (%)',
//     dataIndex: 'battEfficiency',
//     key: 'batEfficiency',
//     align: 'center'
//   }
// ];

// const alertColumns = [
//   {
//     title: service.getValue(lang, 'LANG00063', 'no-text'),
//     dataIndex: 'siteId',
//     key: 'siteId',
//     width: '20%'
//   },
//   {
//     title: service.getValue(lang, 'LANG00064', 'no-text'),
//     dataIndex: 'userName',
//     key: 'userName',
//     width: '20%'
//   },
//   {
//     title: 'manufact',
//     dataIndex: 'manufact',
//     key: 'manufact',
//     width: '20%'
//   },
//   {
//     title: 'modelName',
//     dataIndex: 'modelName',
//     key: 'modelName',
//     width: '20%'
//   },
//   {
//     title: service.getValue(lang, 'LANG00055', 'no-text'),
//     key: 'nowDate',
//     dataIndex: 'nowDate',
//     align: 'center',
//     width: '20%'
//   },
//   {
//     title: 'Alarm',
//     key: 'Alarm',
//     children: [
//       {
//         title: 'Fault',
//         dataIndex: 'fault',
//         key: 'fault',
//         align: 'center'
//       },
//       {
//         title: 'offline',
//         dataIndex: 'offline',
//         key: 'offline',
//         align: 'center'
//       }
//     ]
//   },
// ];

export { statColumns };
