import moment from 'moment';

import { locale, service, formats } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

const mainColumns = [
  {
    title: service.getValue(lang, 'LANG00305', 'no-text'),
    children: [
      {
        title: service.getValue(lang, 'LANG00064', 'no-text'),
        dataIndex: 'userName',
        key: 'userName',
        width: '10%',
        searchAble: {
          onSearch: null
        }
      },
      {
        title: service.getValue(lang, 'LANG00087', 'no-text'),
        dataIndex: 'rescGubn',
        key: 'rescGubn',
        selectAble: {
          list: null,
          onSelect: null
        }
      },
      {
        title: service.getValue(lang, 'LANG00023', 'no-text'),
        dataIndex: 'eqmtStatus',
        key: 'eqmtStatus',
        selectAble: {
          list: null,
          onSelect: null
        }
      }
    ]
  },
  {
    title: 'PV',
    children: [
      {
        title: service.getValue(lang, 'LANG00024', 'no-text'),
        dataIndex: 'pvOperationStatus',
        key: 'pvOperationStatus',
        selectAble: {
          defaultValue: null,
          onSelect: null
        }
      },
      {
        title: `${service.getValue(lang, 'LANG00016', 'no-text')}`,
        dataIndex: 'generation',
        key: 'generation'
      }
    ]
  },
  {
    title: 'ESS',
    children: [
      {
        title: service.getValue(lang, 'LANG00024', 'no-text'),
        dataIndex: 'essOperationStatus',
        key: 'essOperationStatus',
        selectAble: {
          list: null,
          onSelect: null
        }
      },
      {
        title: `${service.getValue(lang, 'LANG00019', 'no-text')}(kWh)`,
        dataIndex: 'tradingVolume',
        key: 'tradingVolume',
        width: 90
      }
    ]
  },
  {
    title: `KPI (${service.getValue(lang, 'LANG00219', 'no-text')}:${moment()
      .subtract(1, 'days')
      .format(formats.timeFormat.FULLDATEDOT)})`,
    children: [
      // {
      //   title: service.getValue(lang, 'LANG00316', 'no-text'),
      //   dataIndex: 'pr',
      //   key: 'pr',
      //   colSpan: 2
      // },
      // {
      //   title: 'PR(%) data',
      //   dataIndex: 'prVsGoal',
      //   key: 'prVsGoal',
      //   colSpan: 0
      // },
      {
        title: service.getValue(lang, 'LANG00016', 'no-text'),
        dataIndex: 'goalGenrCapaVsGoal',
        key: 'goalGenrCapaVsGoal',
        colSpan: 2
      },
      {
        title: `${service.getValue(lang, 'LANG00016', 'no-text')}(kWh) data`,
        dataIndex: 'production',
        key: 'production',
        colSpan: 0,
        base: 'goalGenrCapaVsGoal'
      },
      {
        title: service.getValue(lang, 'LANG00336', 'no-text'),
        dataIndex: 'goalEnergyYield',
        key: 'goalEnergyYield',
        colSpan: 2
      },
      {
        title: `${service.getValue(lang, 'LANG00336', 'no-text')}(kWh) data`,
        dataIndex: 'energyYield',
        key: 'energyYield',
        colSpan: 0,
        base: 'goalEnergyYield'
      },
      {
        title: service.getValue(lang, 'LANG00337', 'no-text'),
        dataIndex: 'goalIvt',
        key: 'goalIvt',
        colSpan: 2
      },
      {
        title: `${service.getValue(lang, 'LANG00337', 'no-text')}(kWh) data`,
        dataIndex: 'ivtEfficiency',
        key: 'ivtEfficiency',
        colSpan: 0,
        base: 'goalIvt'
      },
      {
        title: service.getValue(lang, 'LANG00020', 'no-text'),
        dataIndex: 'ppaVsGoal',
        key: 'ppaVsGoal',
        colSpan: 2
      },
      {
        title: `${service.getValue(lang, 'LANG00020', 'no-text')}(kWh) data`,
        dataIndex: 'ppa',
        key: 'ppa',
        colSpan: 0
      }
    ]
  },
  {
    title: service.getValue(lang, 'LANG00065', 'no-text'),
    dataIndex: 'weatherIcon',
    key: 'weatherIcon',
    width: 90
  },
  {
    title: 'Work Order',
    children: [
      {
        title: service.getValue(lang, 'LANG00169', 'no-text'),
        dataIndex: 'unrReleCnt',
        key: 'unrReleCnt',
        width: 100
      },
      {
        title: service.getValue(lang, 'LANG00216', 'no-text'),
        dataIndex: 'workOrderCnt',
        key: 'workOrderCnt',
        width: 80
      },
      {
        title: `${service.getValue(lang, 'LANG00060', 'no-text')} W.O ${service.getValue(lang, 'LANG00050', 'no-text')}`,
        dataIndex: 'publishing',
        key: 'publishing',
        checkAble: {
          onChangeHeader: null
        }
      }
    ]
  },
  {
    title: service.getValue(lang, 'LANG00218', 'no-text'),
    dataIndex: 'dataLastDate',
    key: 'dataLastDate',
    width: 110,
    datepickAble: [
      {
        dataIndex: 'dataLastDate',
        onChange: null
      }
    ]
  }
];

const modalColumns = [
  {
    key: 'siteId',
    dataIndex: 'siteId',
    title: service.getValue(lang, 'LANG00063', 'no-text')
  },
  {
    key: 'userName',
    dataIndex: 'userName',
    title: service.getValue(lang, 'LANG00064', 'no-text')
  },
  {
    key: 'workOrdUserName',
    dataIndex: 'workOrdUserName',
    title: service.getValue(lang, 'LANG00174', 'no-text')
  },
  {
    title: `SMS ${service.getValue(lang, 'LANG00044', 'no-text')}`,
    dataIndex: 'smsCntn',
    key: 'smsCntn',
    width: '20%'
  },
  {
    title: `Email ${service.getValue(lang, 'LANG00044', 'no-text')}`,
    dataIndex: 'mailCntn',
    key: 'mailCntn',
    width: '20%'
  },
  {
    title: service.getValue(lang, 'LANG00102', 'no-text'),
    dataIndex: 'cmplReqDt',
    key: 'cmplReqDt',
    width: 90
  },
  {
    title: service.getValue(lang, 'LANG00068', 'no-text'),
    dataIndex: 'action',
    key: 'action',
    width: 60
  }
];

export { mainColumns, modalColumns };
