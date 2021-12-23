import { locale, service } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

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
    title: 'ALL',
    value: 0,
    dataIndex: 'totalCnt',
    span: 6,
    color: '#ffffff'
  },
  {
    title: 'Normal',
    value: 0,
    dataIndex: 'normalCnt',
    span: 6,
    color: '#00b174'
  },
  {
    title: 'Fault',
    value: 0,
    dataIndex: 'falultCnt',
    span: 6,
    color: '#db0012'
  },
  {
    title: 'Offline',
    value: 0,
    dataIndex: 'offlineCnt',
    span: 6,
    color: '#93939a'
  }
];

export { summaryValue, tabs };
