import { service, locale } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

const mainColumns = [
  {
    key: 'rscGrpId',
    dataIndex: 'rscGrpId',
    title: service.getValue(lang, 'LANG00242', 'no-text'),
    searchAble: {
      onSearch: null
    }
  },
  {
    key: 'rscGrpName',
    dataIndex: 'rscGrpName',
    title: service.getValue(lang, 'LANG00243', 'no-text'),
    searchAble: {
      onSearch: null
    }
  },
  {
    key: 'trdbDt',
    dataIndex: 'trdbDt',
    title: service.getValue(lang, 'LANG00244', 'no-text'),
    datepickAble: [
      {
        placeholder: 'Start',
        dataIndex: 'trdbStrtDt',
        onChange: null
      },
      {
        placeholder: 'End',
        dataIndex: 'trdbEndDt',
        onChange: null
      }
    ]
  },
  {
    key: 'rscStatCd',
    dataIndex: 'rscStatCd',
    title: service.getValue(lang, 'LANG00245', 'no-text'),
    selectAble: {
      list: [],
      onSelect: null
    }
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: service.getValue(lang, 'LANG00208', 'no-text')
  }
];

export { mainColumns };
