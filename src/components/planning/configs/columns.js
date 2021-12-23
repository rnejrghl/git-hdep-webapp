import { locale, service } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

const planColumns = [
  {
    key: 'userName',
    dataIndex: 'userName',
    title: service.getValue(lang, 'LANG00064', 'no-text'),
    width: '10%',
    searchAble: {
      onSearch: null
    }
  },
  {
    key: 'capacity',
    dataIndex: 'capacity',
    title: service.getValue(lang, 'LANG00035', 'no-text')
  },
  {
    key: 'goalYnNm',
    dataIndex: 'goalYnNm',
    title: service.getValue(lang, 'LANG00007', 'no-text')
  },
  {
    key: 'instPsnName',
    dataIndex: 'instPsnName',
    title: service.getValue(lang, 'LANG00026', 'no-text'),
    searchAble: {
      onSearch: null
    }
  },
  {
    key: 'contract',
    title: service.getValue(lang, 'LANG00011', 'no-text'),
    children: [
      {
        key: 'cnrtStrtDt',
        dataIndex: 'cnrtStrtDt',
        title: service.getValue(lang, 'LANG00185', 'no-text'),
        badge: true,
        datepickBlock: true,
        datepickAble: [
          {
            placeholder: 'start',
            dataIndex: 'cnrtStrtSrcStrtDt',
            onChange: null
          },
          {
            dataIndex: 'cnrtStrtSrcEndDt',
            placeholder: 'end',
            onChange: null
          }
        ]
      },
      {
        key: 'wkplCmplDt',
        dataIndex: 'wkplCmplDt',
        badge: true,
        title: service.getValue(lang, 'LANG00215', 'no-text'),
        checkAble: {
          onChangeHeader: null
        }
      },
      {
        key: 'expnDt',
        dataIndex: 'expnDt',
        badge: true,
        title: service.getValue(lang, 'LANG00176', 'no-text'),
        checkAble: {
          onChangeHeader: null
        }
      }
    ]
  },
  {
    key: 'install',
    title: service.getValue(lang, 'LANG00012', 'no-text'),
    children: [
      {
        key: 'applCmdt',
        dataIndex: 'applCmdt',
        base: 'applDudt',
        badge: true,
        title: `Grid ${service.getValue(lang, 'LANG00088', 'no-text')}`,
        checkAble: {
          onChangeHeader: null
        }
      },
      {
        key: 'apprCmdt',
        dataIndex: 'apprCmdt',
        base: 'apprDudt',
        badge: true,
        title: service.getValue(lang, 'LANG00180', 'no-text'),
        checkAble: {
          onChangeHeader: null
        }
      },
      {
        key: 'mpCmdt',
        dataIndex: 'mpCmdt',
        base: 'mpDudt',
        badge: true,
        title: service.getValue(lang, 'LANG00181', 'no-text'),
        checkAble: {
          onChangeHeader: null
        }
      },
      {
        key: 'insCmdt',
        dataIndex: 'insCmdt',
        base: 'insDudt',
        badge: true,
        title: service.getValue(lang, 'LANG00012', 'no-text'),
        checkAble: {
          onChangeHeader: null
        }
      },
      {
        key: 'chkCmplDt',
        dataIndex: 'chkCmplDt',
        badge: true,
        title: 'Inspection',
        checkAble: {
          onChangeHeader: null
        }
      }
    ]
  },
  {
    key: 'mngStrtDt',
    dataIndex: 'mngStrtDt',
    title: service.getValue(lang, 'LANG00013', 'no-text'),
    checkAble: {
      onChangeHeader: null
    }
  },
  {
    key: 'termDt',
    dataIndex: 'termDt',
    title: service.getValue(lang, 'LANG00014', 'no-text'),
    checkAble: {
      onChangeHeader: null
    }
  }
];

const goalColumns = [
  {
    key: 'year',
    dataIndex: 'goalDt',
    title: service.getValue(lang, 'LANG00214', 'no-text')
  },
  {
    key: 'month',
    dataIndex: 'goalDt',
    title: service.getValue(lang, 'LANG00213', 'no-text')
  },
  {
    key: 'goalGenrCapa',
    dataIndex: 'goalGenrCapa',
    title: service.getValue(lang, 'LANG00212', 'no-text'),
    editable: true
  },
  {
    key: 'energy',
    dataIndex: 'energy',
    title: service.getValue(lang, 'LANG00336', 'no-text'),
    editable: true
  },
  {
    key: 'ivt',
    dataIndex: 'ivt',
    title: service.getValue(lang, 'LANG00337', 'no-text'),
    editable: true
  },
  {
    key: 'ppa',
    dataIndex: 'ppa',
    title: service.getValue(lang, 'LANG00020', 'no-text'),
    editable: true
  },
  {
    key: 'sale',
    dataIndex: 'sale',
    title: service.getValue(lang, 'LANG00022', 'no-text'),
    editable: true
  }
];

export { planColumns, goalColumns };
