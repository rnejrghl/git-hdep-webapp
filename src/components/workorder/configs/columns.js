import { locale, service } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

const mainColumns = [
  {
    // todo
    key: 'publDtti',
    dataIndex: 'publDtti',
    title: service.getValue(lang, 'LANG00098', 'no-text'),
    datepickAble: [
      {
        dataIndex: 'publDtti',
        placeholder: 'Select',
        onChange: null
      }
    ]
  },
  {
    key: 'workOrdId',
    dataIndex: 'workOrdId',
    title: service.getValue(lang, 'LANG00311', 'no-text'),
    searchAble: {
      placeholder: 'Search',
      onSearch: null
    }
  },
  {
    key: 'workOrdTyp',
    dataIndex: 'workOrdTyp',
    title: service.getValue(lang, 'LANG00260', 'no-text'),
    selectAble: {
      placeholder: 'Select',
      list: null,
      onSelect: null
    }
  },
  {
    key: 'workOrdStat',
    dataIndex: 'workOrdStat',
    title: service.getValue(lang, 'LANG00261', 'no-text'),
    selectAble: {
      placeholder: 'Select',
      list: null,
      onSelect: null
    }
  },
  {
    key: 'siteId',
    dataIndex: 'siteId',
    title: service.getValue(lang, 'LANG00063', 'no-text'),
    searchAble: {
      placeholder: 'Search',
      onSearch: null
    }
  },
  {
    key: 'siteUserName',
    dataIndex: 'siteUserName',
    title: service.getValue(lang, 'LANG00064', 'no-text'),
    searchAble: {
      placeholder: 'Search',
      onSearch: null
    }
  },
  {
    key: 'workOrdUserName',
    dataIndex: 'workOrdUserName',
    title: service.getValue(lang, 'LANG00200', 'no-text'),
    searchAble: {
      placeholder: 'Search',
      onSearch: null
    }
  },
  {
    key: 'workOrdUserTelNo',
    dataIndex: 'workOrdUserTelNo',
    title: service.getValue(lang, 'LANG00201', 'no-text'),
    searchAble: {
      placeholder: 'Search',
      onSearch: null
    }
  },
  {
    key: 'cmplReqDt',
    dataIndex: 'cmplReqDt',
    title: service.getValue(lang, 'LANG00102', 'no-text'),
    datepickAble: [
      {
        dataIndex: 'cmplReqDt',
        placeholder: 'Select',
        onChange: null
      }
    ]
  },
  {
    key: 'cnfmDt',
    dataIndex: 'cnfmDt',
    title: service.getValue(lang, 'LANG00127', 'no-text'),
    datepickAble: [
      {
        dataIndex: 'cnfmDt',
        placeholder: 'Select',
        onChange: null
      }
    ]
  },
  {
    key: 'cmplPredDt',
    dataIndex: 'cmplPredDt',
    title: service.getValue(lang, 'LANG00108', 'no-text'),
    datepickAble: [
      {
        dataIndex: 'cmplPredDt',
        placeholder: 'Select',
        onChange: null
      }
    ]
  },
  {
    key: 'rsltRegYn',
    dataIndex: 'rsltRegYn',
    width: 90,
    title: service.getValue(lang, 'LANG00207', 'no-text')
  }
];

const resultColumns = [
  {
    key: 'temp1',
    dataIndex: 'temp1',
    title: service.getValue(lang, 'LANG00128', 'no-text')
  },
  {
    key: 'temp2',
    dataIndex: 'temp2',
    title: service.getValue(lang, 'LANG00130', 'no-text')
  },
  {
    key: 'temp3',
    dataIndex: 'temp3',
    title: service.getValue(lang, 'LANG00131', 'no-text')
  },
  {
    key: 'temp4',
    dataIndex: 'temp4',
    title: service.getValue(lang, 'LANG00132', 'no-text')
  },
  {
    key: 'temp5',
    dataIndex: 'temp5',
    title: service.getValue(lang, 'LANG00078', 'no-text')
  }
];

export { mainColumns, resultColumns };
