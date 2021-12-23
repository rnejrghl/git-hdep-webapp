import { locale, service } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

const userColumns = [
  {
    key: 'userId',
    dataIndex: 'userId',
    title: `${service.getValue(lang, 'LANG00073', 'no-text')}ID`,
    searchAble: {
      onSearch: null
    }
  },
  {
    key: 'userLvlCd',
    dataIndex: 'userLvlCd',
    title: `${service.getValue(lang, 'LANG00073', 'no-text')} ${service.getValue(lang, 'LANG00133', 'no-text')}`,
    selectAble: {
      list: [],
      placeholder: `${service.getValue(lang, 'LANG00073', 'no-text')} ${service.getValue(lang, 'LANG00133', 'no-text')}`,
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
    key: 'telNo',
    dataIndex: 'telNo',
    title: service.getValue(lang, 'LANG00074', 'no-text'),
    searchAble: {
      onSearch: null
    }
  },
  {
    key: 'email',
    dataIndex: 'email',
    title: service.getValue(lang, 'LANG00075', 'no-text'),
    width: 220,
    searchAble: {
      onSearch: null
    }
  },
  {
    key: 'useYn',
    dataIndex: 'useYn',
    title: service.getValue(lang, 'LANG00134', 'no-text'),
    width: 80,
    selectAble: {
      list: [
        { key: 'all', value: 'all', label: 'ALL' },
        { key: 1, value: 'Y', label: 'Y' },
        { key: 2, value: 'N', label: 'N' }
      ],
      defaultValue: 'all',
      onSelect: null
    }
  },
  {
    key: 'menuRoleId',
    dataIndex: 'menuRoleId',
    title: service.getValue(lang, 'LANG00135', 'no-text'),
    width: 250,
    selectAble: {
      list: [],
      placeholder: service.getValue(lang, 'LANG00135', 'no-text'),
      onSelect: null
    }
  },
  {
    key: 'inqGrpId',
    dataIndex: 'inqGrpId',
    title: service.getValue(lang, 'LANG00136', 'no-text'),
    width: 250,
    selectAble: {
      list: [],
      placeholder: service.getValue(lang, 'LANG00136', 'no-text'),
      onSelect: null
    }
  }
];

const defaultDeviceColumns = [
  {
    key: 'eqmtGubnCd',
    dataIndex: 'eqmtGubnCd',
    title: service.getValue(lang, 'LANG00160', 'no-text')
  },
  {
    key: 'pntAddr',
    dataIndex: 'pntAddr',
    width: 80,
    title: service.getValue(lang, 'LANG00141', 'no-text'),
    searchAble: {
      onSearch: null
    }
  },
  {
    key: 'pntAddrName',
    dataIndex: 'pntAddrName',
    title: service.getValue(lang, 'LANG00142', 'no-text'),
    width: '20%',
    searchAble: {
      onSearch: null
    }
  },
  {
    key: 'pntAddrDesc',
    dataIndex: 'pntAddrDesc',
    title: service.getValue(lang, 'LANG00143', 'no-text')
  },
  {
    key: 'dataTyp',
    dataIndex: 'dataTyp',
    title: service.getValue(lang, 'LANG00262', 'no-text')
  },
  {
    key: 'itemGubn',
    dataIndex: 'itemGubn',
    title: service.getValue(lang, 'LANG00144', 'no-text')
  },
  {
    key: 'scleFctr',
    dataIndex: 'scleFctr',
    title: service.getValue(lang, 'LANG00145', 'no-text')
  },
  {
    key: 'unitCd',
    dataIndex: 'unitCd',
    title: service.getValue(lang, 'LANG00146', 'no-text')
  },
  {
    key: 'sysTag',
    dataIndex: 'sysTag',
    title: 'System Tag',
    width: 110,
    searchAble: {
      onSearch: null
    }
  },
  {
    key: 'cnt',
    dataIndex: 'cnt',
    width: 100,
    title: service.getValue(lang, 'LANG00147', 'no-text')
  },
  {
    key: 'dataRcrdYn',
    dataIndex: 'dataRcrdYn',
    title: service.getValue(lang, 'LANG00152', 'no-text'),
    width: 75,
    valuePropName: 'checked'
  },
  {
    key: 'addr1',
    dataIndex: 'addr1',
    title: `${service.getValue(lang, 'LANG00086', 'no-text')}1`,
    width: 50
  },
  {
    key: 'addr2',
    dataIndex: 'addr2',
    title: `${service.getValue(lang, 'LANG00086', 'no-text')}2`,
    width: 50
  }
];

const withoutDeviceColumnKey = ['eqmtGubnCd', 'dataRcrdYn', 'addr1', 'addr2'];

const deviceColumns = defaultDeviceColumns.filter(column => !withoutDeviceColumnKey.includes(column.key));

const deviceAlarmColumns = [
  {
    key: 'alrtCd',
    dataIndex: 'alrtCd',
    title: 'Alert Code',
    width: 100
  },
  {
    key: 'alrtTypCd',
    dataIndex: 'alrtTypCd',
    title: service.getValue(lang, 'LANG00238', 'no-text'),
    width: 100,
    selectAble: {
      list: [],
      onSelect: null
    }
  },
  {
    key: 'alrtGrdCd',
    dataIndex: 'alrtGrdCd',
    title: `${service.getValue(lang, 'LANG00029', 'no-text')} ${service.getValue(lang, 'LANG00133', 'no-text')}`,
    width: 100
  },
  {
    key: 'alrtName',
    dataIndex: 'alrtName',
    title: service.getValue(lang, 'LANG00159', 'no-text'),
    width: 100
  },
  {
    key: 'cnt',
    dataIndex: 'cnt',
    title: service.getValue(lang, 'LANG00147', 'no-text'),
    width: 100
  },
  {
    key: 'alrtCntn',
    dataIndex: 'alrtCntn',
    title: `${service.getValue(lang, 'LANG00029', 'no-text')} ${service.getValue(lang, 'LANG00044', 'no-text')}`
  },
  {
    key: 'send',
    dataIndex: 'send',
    title: `${service.getValue(lang, 'LANG00149', 'no-text')} ${service.getValue(lang, 'LANG00158', 'no-text')}`,
    width: 260
  },
  {
    key: 'contTIme',
    dataIndex: 'contTime',
    title: service.getValue(lang, 'LANG00148', 'no-text'),
    width: 80
  },
  {
    key: 'sendCycl',
    dataIndex: 'sendCycl',
    title: `${service.getValue(lang, 'LANG00149', 'no-text')} ${service.getValue(lang, 'LANG00150', 'no-text')}`,
    width: 80
  },
  {
    key: 'note',
    dataIndex: 'note',
    title: service.getValue(lang, 'LANG00151', 'no-text')
  }
];

const deviceAlarmFormulaColumns = [
  {
    key: 'cndtGubnCd',
    dataIndex: 'cndtGubnCd',
    title: service.getValue(lang, 'LANG00228', 'no-text')
  },
  {
    key: 'sysTag',
    dataIndex: 'sysTag',
    title: 'System tag'
  },
  {
    key: 'calcGubnCd',
    dataIndex: 'calcGubnCd',
    title: service.getValue(lang, 'LANG00229', 'no-text')
  },
  {
    key: 'cmprVal',
    dataIndex: 'cmprVal',
    title: service.getValue(lang, 'LANG00230', 'no-text')
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: service.getValue(lang, 'LANG00068', 'no-text')
  }
];

const formulaColumns = {
  device: [
    {
      key: 'blowCalc',
      dataIndex: 'blowCalc',
      title: '수식(<=)'
    },
    {
      key: 'excsCalc',
      dataIndex: 'excsCalc',
      title: '수식(>)'
    },
    {
      key: 'calcRslt',
      dataIndex: 'calcRslt',
      title: service.getValue(lang, 'LANG00241', 'no-text')
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: service.getValue(lang, 'LANG00068', 'no-text')
    }
  ],
  deviceAlarm: [
    {
      key: 'cndtGubnCd',
      dataIndex: 'cndtGubnCd',
      title: service.getValue(lang, 'LANG00228', 'no-text')
    },
    {
      key: 'sysTag',
      dataIndex: 'sysTag',
      title: 'System tag'
    },
    {
      key: 'calcGubnCd',
      dataIndex: 'calcGubnCd',
      title: service.getValue(lang, 'LANG00229', 'no-text')
    },
    {
      key: 'cmprVal',
      dataIndex: 'cmprVal',
      title: service.getValue(lang, 'LANG00230', 'no-text')
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: service.getValue(lang, 'LANG00068', 'no-text')
    }
  ]
};

const siteColumns = defaultDeviceColumns.concat([
  {
    key: 'recvVal',
    dataIndex: 'recvVal',
    title: service.getValue(lang, 'LANG00153', 'no-text'),
    width: 50
  },
  {
    key: 'recvDtti',
    dataIndex: 'recvDtti',
    title: service.getValue(lang, 'LANG00154', 'no-text')
  }
]);

const menuAuthColumns = [
  {
    key: 'inqYn',
    dataIndex: 'inqYn',
    title: service.getValue(lang, 'LANG00057', 'no-text')
  },
  {
    key: 'regYn',
    dataIndex: 'regYn',
    title: service.getValue(lang, 'LANG00258', 'no-text')
  },
  {
    key: 'modYn',
    dataIndex: 'modYn',
    title: service.getValue(lang, 'LANG00208', 'no-text')
  },
  {
    key: 'delYn',
    dataIndex: 'delYn',
    title: service.getValue(lang, 'LANG00068', 'no-text')
  }
];

const codeColumns = [
  {
    key: 'inqOrd',
    dataIndex: 'inqOrd',
    title: service.getValue(lang, 'LANG00157', 'no-text'),
    width: 100
  },
  {
    key: 'cd',
    dataIndex: 'cd',
    title: 'Code',
    editable: true,
    width: '10%'
  },
  {
    key: 'cdName',
    dataIndex: 'cdName',
    title: service.getValue(lang, 'LANG00155', 'no-text'),
    editable: true,
    width: '20%'
  },
  {
    key: 'cdDesc',
    dataIndex: 'cdDesc',
    title: service.getValue(lang, 'LANG00156', 'no-text'),
    editable: true
  },
  {
    key: 'action',
    dataIndex: 'action',
    width: 100
  }
];

const mailColumns = [
  {
    key: 'sendDt',
    dataIndex: 'sendDt',
    title: service.getValue(lang, 'LANG00239', 'no-text'),
    datepickAble: [
      {
        dataIndex: 'sendDt',
        placeholder: 'Select',
        onChange: null
      }
    ]
  },
  {
    key: 'sendGubn',
    dataIndex: 'sendGubn',
    title: `${service.getValue(lang, 'LANG00149', 'no-text')} ${service.getValue(lang, 'LANG00160', 'no-text')}`,
    selectAble: {
      list: [
        {
          key: 'all',
          value: 'all',
          label: 'ALL'
        },
        {
          key: 'sms',
          value: 'SMS',
          label: 'SMS'
        },
        {
          key: 'email',
          value: 'MAIL',
          label: 'MAIL'
        }
      ],
      onSelect: null
    }
  },
  {
    key: 'alrmName',
    dataIndex: 'alrmName',
    title: service.getValue(lang, 'LANG00159', 'no-text'),
    searchAble: {
      onSearch: null
    }
  },
  {
    key: 'userName',
    dataIndex: 'userName',
    title: service.getValue(lang, 'LANG00240', 'no-text'),
    searchAble: {
      onSearch: null
    }
  },
  {
    key: 'sendRsltCd',
    dataIndex: 'sendRsltCd',
    title: service.getValue(lang, 'LANG00241', 'no-text'),
    selectAble: {
      list: [
        {
          key: 'all',
          value: 'all',
          label: 'ALL'
        },
        {
          key: 'S',
          value: 'S',
          label: 'SUCCESS'
        },
        {
          key: 'F',
          value: 'F',
          label: 'FAIL'
        }
      ],
      onSelect: null
    }
  },
  {
    key: 'sendCntn',
    dataIndex: 'sendCntn',
    title: service.getValue(lang, 'LANG00044', 'no-text'),
    width: '40%'
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: service.getValue(lang, 'LANG00125', 'no-text'),
    width: 100
  }
];

const noticeColumns = [
  {
    key: 'notiId',
    dataIndex: 'notiId',
    title: service.getValue(lang, 'LANG00368', 'no-text'),
    width: '10%'
  },
  {
    key: 'notiName',
    dataIndex: 'notiName',
    title: service.getValue(lang, 'LANG00159', 'no-text'),
    width: '15%'
  },
  {
    key: 'smsCntn',
    dataIndex: 'smsCntn',
    title: `SMS ${service.getValue(lang, 'LANG00044', 'no-text')}`,
    width: '20%'
  },
  {
    key: 'email',
    dataIndex: 'email',
    className: 'email',
    title: `Email ${service.getValue(lang, 'LANG00044', 'no-text')}`,
    width: '40%'
  },
  {
    key: 'note',
    dataIndex: 'note',
    title: service.getValue(lang, 'LANG00151', 'no-text'),
    width: '15%'
  }
];

const languageColumns = [
  {
    key: 'menuId',
    dataIndex: 'menuId',
    title: 'Code',
    align: 'center'
  },
  {
    key: 'nameKo',
    dataIndex: 'nameKo',
    title: service.getValue(lang, 'LANG00222', 'no-text'),
    editable: true,
    align: 'center'
  },
  {
    key: 'nameEn',
    dataIndex: 'nameEn',
    title: service.getValue(lang, 'LANG00223', 'no-text'),
    editable: true,
    align: 'center'
  },
  {
    key: 'nameJa',
    dataIndex: 'nameJa',
    title: service.getValue(lang, 'LANG00224', 'no-text'),
    editable: true,
    align: 'center'
  },
  {
    key: 'nameEs',
    dataIndex: 'nameEs',
    title: service.getValue(lang, 'LANG00225', 'no-text'),
    editable: true,
    align: 'center'
  },
  {
    key: 'nameVi',
    dataIndex: 'nameVi',
    title: service.getValue(lang, 'LANG00226', 'no-text'),
    editable: true,
    align: 'center'
  },
  {
    key: 'nameDe',
    dataIndex: 'nameDe',
    title: service.getValue(lang, 'LANG00227', 'no-text'),
    editable: true,
    align: 'center'
  },
  {
    key: 'action',
    dataIndex: 'action',
    width: 100
  }
];

export { userColumns, defaultDeviceColumns, deviceAlarmFormulaColumns, deviceColumns, formulaColumns, siteColumns, menuAuthColumns, codeColumns, mailColumns, noticeColumns, languageColumns, deviceAlarmColumns };
