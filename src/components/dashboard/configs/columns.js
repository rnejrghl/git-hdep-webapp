import { locale, service } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

const summaryColumns = [
  {
    key: 'goalCnt',
    dataIndex: 'goalCnt',
    title: service.getValue(lang, 'LANG00007', 'no-text'),
    children: [
      {
        key: 'sum',
        dataIndex: 'sum',
        title: service.getValue(lang, 'LANG00009', 'no-text')
      },
      {
        key: 'goalCnt.fildPv',
        dataIndex: 'goalCnt.fildPv',
        title: 'PV'
      },
      {
        key: 'goalCnt.fildPvEss',
        dataIndex: 'goalCnt.fildPvEss',
        title: 'PV + ESS'
      }
    ]
  },
  {
    key: 'assetOverviewCnt',
    dataIndex: 'assetOverviewCnt',
    title: service.getValue(lang, 'LANG00008', 'no-text'),
    children: [
      {
        key: 'assetOverviewCnt.totalCnt',
        dataIndex: 'assetOverviewCnt.totalCnt',
        title: service.getValue(lang, 'LANG00009', 'no-text')
      },
      {
        key: 'pv',
        dataIndex: 'pv',
        title: 'PV',
        children: [
          {
            key: 'assetOverviewCnt.atotalCnt',
            dataIndex: 'assetOverviewCnt.atotalCnt',
            title: service.getValue(lang, 'LANG00010', 'no-text')
          },
          {
            key: 'assetOverviewCnt.apscCnt',
            dataIndex: 'assetOverviewCnt.apscCnt',
            title: service.getValue(lang, 'LANG00011', 'no-text')
          },
          {
            key: 'assetOverviewCnt.ainsCnt',
            dataIndex: 'assetOverviewCnt.ainsCnt',
            title: service.getValue(lang, 'LANG00012', 'no-text')
          },
          {
            key: 'assetOverviewCnt.amngCnt',
            dataIndex: 'assetOverviewCnt.amngCnt',
            title: service.getValue(lang, 'LANG00013', 'no-text')
          },
          {
            key: 'assetOverviewCnt.aendCnt',
            dataIndex: 'assetOverviewCnt.aendCnt',
            title: service.getValue(lang, 'LANG00014', 'no-text')
          }
        ]
      },
      {
        key: 'pvess',
        dataIndex: 'pvess',
        title: 'PV + ESS',
        children: [
          {
            key: 'assetOverviewCnt.btotalCnt',
            dataIndex: 'assetOverviewCnt.btotalCnt',
            title: service.getValue(lang, 'LANG00010', 'no-text')
          },
          {
            key: 'assetOverviewCnt.bpscCnt',
            dataIndex: 'assetOverviewCnt.bpscCnt',
            title: service.getValue(lang, 'LANG00011', 'no-text')
          },
          {
            key: 'assetOverviewCnt.binsCnt',
            dataIndex: 'assetOverviewCnt.binsCnt',
            title: service.getValue(lang, 'LANG00012', 'no-text')
          },
          {
            key: 'assetOverviewCnt.bmngCnt',
            dataIndex: 'assetOverviewCnt.bmngCnt',
            title: service.getValue(lang, 'LANG00013', 'no-text')
          },
          {
            key: 'assetOverviewCnt.bendCnt',
            dataIndex: 'assetOverviewCnt.bendCnt',
            title: service.getValue(lang, 'LANG00014', 'no-text')
          }
        ]
      }
    ]
  }
];

export { summaryColumns };
