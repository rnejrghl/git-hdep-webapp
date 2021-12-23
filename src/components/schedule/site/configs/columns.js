import { locale, service } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

const mainColumns = [
  {
    key: 'siteId',
    dataIndex: 'siteId',
    title: service.getValue(lang, 'LANG00063', 'no-text'),
    searchAble: {
      onSearch: null
    }
  },
  {
    key: 'rscGrpId',
    dataIndex: 'rscGrpId',
    title: service.getValue(lang, 'LANG00243', 'no-text'),
    selectAble: {
      list: [],
      onSelect: null
    }
  },
  {
    key: 'userName',
    dataIndex: 'userName',
    title: service.getValue(lang, 'LANG00064', 'no-text'),
    searchAble: {
      onSearch: null
    }
  },
  {
    key: 'rescGubn',
    dataIndex: 'rescGubn',
    title: service.getValue(lang, 'LANG00087', 'no-text'),
    selectAble: {
      list: [],
      onSelect: null
    }
  },
  {
    key: 'regnGubn',
    dataIndex: 'regnGubn',
    title: service.getValue(lang, 'LANG00038', 'no-text'),
    selectAble: {
      list: [],
      onSelect: null
    }
  },
  {
    key: 'capacity',
    dataIndex: 'capacity',
    title: service.getValue(lang, 'LANG00035', 'no-text')
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: service.getValue(lang, 'LANG00289', 'no-text')
  }
];

const historyColumns = [
  {
    key: 'date',
    dataIndex: 'date',
    title: 'PPA',
    datepickAble: [
      {
        placeholder: 'Start',
        dataIndex: 'cnrtStrtDt',
        onChange: null
      },
      {
        dataIndex: 'cnrtEndDt',
        placeholder: 'End',
        onChange: null
      }
    ]
  },
  {
    key: 'rscGrpId',
    dataIndex: 'rscGrpId',
    title: service.getValue(lang, 'LANG00243', 'no-text'),
    searchAble: {
      onSearch: null
    }
  }
];

export { mainColumns, historyColumns };
