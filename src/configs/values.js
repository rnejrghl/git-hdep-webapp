import React from 'react';
import locale from './locale';
import service from './service';

const lang = service.getValue(locale, 'languages', {});

const siteDetail = {
  tabs: [
    {
      key: 'operation',
      label: service.getValue(lang, 'LANG00024', 'no-text'),
      component: () => import('@/components/commons/site/detail/tabs/Operation.js')
    },
    {
      key: 'notification',
      label: service.getValue(lang, 'LANG00029', 'no-text'),
      component: () => import('@/components/commons/site/detail/tabs/Notification.js')
    },
    {
      key: 'kpi',
      label: 'KPI',
      component: () => import('@/components/commons/site/detail/tabs/KPI.js')
    },
    {
      key: 'rawdata',
      label: `RAW ${service.getValue(lang, 'LANG00040', 'no-text')}`,
      component: () => import('@/components/commons/site/detail/tabs/RawData.js')
    },
    {
      key: 'controls',
      label: `${service.getValue(lang, 'LANG00395', 'no-text')}`,
      component: () => import('@/components/commons/site/detail/tabs/Controls.js')
    },
    {
      key: 'controlHistory',
      label: `${service.getValue(lang, 'LANG00396', 'no-text')}`,
      component: () => import('@/components/commons/site/detail/tabs/ControlHistory.js')
    }
  ],
  pages: {
    info: [
      {
        key: 'pvInstCapa',
        label: `PV${service.getValue(lang, 'LANG00035', 'no-text')}`,
        type: 'input'
      },
      {
        key: 'modlMnftGubn',
        label: service.getValue(lang, 'LANG00032', 'no-text'),
        type: 'input'
      },
      {
        key: 'unrReleCnt',
        label: service.getValue(lang, 'LANG00169', 'no-text'),
        type: 'input'
      },
      {
        key: 'essInstCapa',
        label: `BAT${service.getValue(lang, 'LANG00035', 'no-text')}`,
        type: 'input',
        style: {
          display: 'inline-block'
        }
      },
      {
        key: 'invtMnftGubn',
        label: service.getValue(lang, 'LANG00033', 'no-text'),
        type: 'input'
      },
      {
        key: 'workOrderUcmplCnt',
        label: service.getValue(lang, 'LANG00170', 'no-text'),
        type: 'input'
      },
      {
        key: 'regnGubn',
        label: service.getValue(lang, 'LANG00038', 'no-text'),
        type: 'input'
      },
      {
        key: 'btryMnftGubn',
        label: service.getValue(lang, 'LANG00034', 'no-text'),
        type: 'input'
      }
    ],
    operation: {
      flow: [
        {
          key: 'pvPower',
          device: 'pv',
          imgSrc: require('@/assets/icon_assect_3.png'),
          alt: 'solar_pannel',
          title: 'PV Power(DC)'
        },
        {
          key: 'opPower',
          device: 'output',
          imgSrc: require('@/assets/icon_inverter_3.png'),
          alt: 'electricity pylon',
          title: 'Output Power(AC)'
        },
        {
          key: 'gridPower',
          device: 'grid',
          imgSrc: require('@/assets/electricity pylon_1.png'),
          alt: 'electricity pylon',
          title: 'Grid Power',
          comment: service.getValue(lang, 'LANG00338', 'no-text'),
          tagColor: '#2c79f4'
        },
        {
          key: 'batPower',
          device: 'battery',
          imgSrc: require('@/assets/ess_1.png'),
          alt: 'battery',
          title: 'Battery Power(DC)',
          comment: service.getValue(lang, 'LANG00253', 'no-text'),
          tagColor: '#009873'
        },
        {
          key: 'loadPower',
          device: 'load',
          imgSrc: require('@/assets/icon_load_power_3.png'),
          alt: 'house',
          title: 'Load Power'
        }
      ]
    },
    notification: [
      {
        title: service.getValue(lang, 'LANG00171', 'no-text'),
        key: 'notification',
        extra: service.getValue(lang, 'LANG00172', 'no-text'),
        type: 'table',
        position: 'left',
        colSpan: 24
      },
      {
        title: service.getValue(lang, 'LANG00254', 'no-text'),
        key: 'workOrder',
        extra: service.getValue(lang, 'LANG00172', 'no-text'),
        type: 'table',
        position: 'right',
        colSpan: 24
      },
      {
        title: service.getValue(lang, 'LANG00173', 'no-text'),
        key: 'workOrderPublish',
        position: 'right',
        colSpan: 24,
        fields: [
          {
            key: 'userSeq',
            label: '',
            type: 'input',
            style: {
              display: 'none'
            }
          },
          {
            key: 'workOrdPublGubn',
            label: '',
            type: 'input',
            initialValue: null,
            style: { display: 'none' }
          },
          {
            key: 'workOrdUserName',
            label: service.getValue(lang, 'LANG00200', 'no-text'),
            type: 'input',
            props: {
              disabled: true
            },
            formLayout: {
              labelCol: { span: 8 },
              wrapperCol: { span: 16 }
            }
          },
          {
            key: 'workOrdTyp',
            label: `W/O ${service.getValue(lang, 'LANG00045', 'no-text')}`,
            type: 'select',
            initialValue: null,
            options: [],
            formLayout: {
              labelCol: { span: 8 },
              wrapperCol: { span: 16 }
            },
            onChange: null
          },
          {
            key: 'cmplReqDt',
            label: service.getValue(lang, 'LANG00102', 'no-text'),
            type: 'datepicker',
            placeholder: service.getValue(lang, 'LANG00306', 'no-text'),
            formLayout: {
              labelCol: { span: 8 },
              wrapperCol: { span: 16 }
            },
            onChange: null
          }
        ]
      }
    ]
  }
};

const siteRegister = {
  tabs: [
    {
      key: 'contract',
      label: `${service.getValue(lang, 'LANG00011', 'no-text')}/${service.getValue(lang, 'LANG00071', 'no-text')}`
    },
    {
      key: 'approve',
      label: service.getValue(lang, 'LANG00176', 'no-text')
    },
    {
      key: 'grid',
      label: `Grid/${service.getValue(lang, 'LANG00095', 'no-text')}/${service.getValue(lang, 'LANG00012', 'no-text')}`
    },
    {
      key: 'inspection',
      label: `Inspection/${service.getValue(lang, 'LANG00013', 'no-text')}`
    },
    {
      key: 'finish',
      label: service.getValue(lang, 'LANG00014', 'no-text')
    }
  ],
  pages: {
    finish: [
      {
        key: 'finish',
        title: `${service.getValue(lang, 'LANG00011', 'no-text')} ${service.getValue(lang, 'LANG00014', 'no-text')}`,
        props: {
          columns: 1,
          formLayout: {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 }
          }
        },
        fields: [
          {
            key: 'termDt',
            label: service.getValue(lang, 'LANG00120', 'no-text'),
            type: 'datepicker'
          },
          {
            key: 'termRsn',
            label: service.getValue(lang, 'LANG00121', 'no-text'),
            type: 'textarea',
            props: {
              row: 4
            }
          }
        ]
      }
    ],
    inspection: [
      {
        key: 'inspection',
        title: 'Inspection',
        colSpan: 12,
        props: {
          columns: 1,
          formLayout: {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          }
        },
        fields: [
          {
            key: 'invoiceUserData',
            label: service.getValue(lang, 'LANG00091', 'no-text'),
            type: 'select',
            props: {
              mode: 'multiple',
              disabled: true
            },
            options: []
          },
          {
            key: 'inspUserName',
            label: service.getValue(lang, 'LANG00026', 'no-text'),
            type: 'input',
            props: {
              disabled: true
            }
          },
          {
            key: 'insFiles',
            label: service.getValue(lang, 'LANG00077', 'no-text'),
            type: 'upload',
            initialValue: [],
            props: {
              disabled: true
            }
          },
          {
            key: 'chkPassYn',
            label: service.getValue(lang, 'LANG00113', 'no-text'),
            type: 'radio',
            initialValue: 'Y',
            options: [
              {
                key: 1,
                label: 'Yes',
                value: 'Y'
              },
              {
                key: 0,
                label: 'No',
                value: 'N'
              }
            ]
          },
          {
            key: 'chkCmplDt',
            label: service.getValue(lang, 'LANG00108', 'no-text'),
            type: 'datepicker',
            style: {
              width: 140,
              marginLeft: -3
            },
            extra: <span className="warning">{`${service.getValue(lang, 'LANG00161', 'no-text')} ${service.getValue(lang, 'LANG00162', 'no-text')}`}</span>
          },
          {
            key: 'chkFailRsn',
            label: service.getValue(lang, 'LANG00177', 'no-text'),
            type: 'textarea',
            props: {
              row: 2
            }
          },
          {
            key: 'chkHist',
            label: service.getValue(lang, 'LANG00178', 'no-text'),
            type: 'textarea',
            props: {
              row: 2,
              disabled: true
            }
          },
          {
            key: 'inspNote',
            label: service.getValue(lang, 'LANG00078', 'no-text'),
            type: 'textarea',
            props: {
              row: 4
            }
          }
        ]
      },
      {
        key: 'opertaion',
        title: service.getValue(lang, 'LANG00013', 'no-text'),
        colSpan: 12,
        props: {
          columns: 2,
          formLayout: {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        },
        fields: [
          {
            key: 'mngUserSeq',
            label: service.getValue(lang, 'LANG00174', 'no-text'),
            type: 'select',
            options: []
          },
          {
            key: 'mngStrtDt',
            label: service.getValue(lang, 'LANG00115', 'no-text'),
            type: 'datepicker'
          },
          {
            key: 'fileIdCd7',
            label: service.getValue(lang, 'LANG00077', 'no-text'),
            type: 'upload',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            initialValue: []
          },
          {
            key: 'mngNote',
            label: service.getValue(lang, 'LANG00078', 'no-text'),
            type: 'textarea',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            props: {
              row: 4
            }
          },
          {
            key: 'psId',
            label: service.getValue(lang, 'dddd', 'PS_ID 찾기'),
            type: 'input',
            rules: [{ required: true, message: service.getValue(lang, 'dddd', 'ps_id') }],
            props: {
              disabled: true
            }
          },
          {
            key: 'psIdButton',
            type: 'button'
          }
        ]
      }
    ],
    grid: [
      {
        title: service.getValue(lang, 'LANG00312', 'no-text'),
        key: 'request',
        colSpan: 12,
        props: {
          columns: 2,
          formLayout: {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        },
        style: {
          marginBottom: 20
        },
        fields: [
          {
            key: 'applAprvCmp',
            label: `Grid ${service.getValue(lang, 'LANG00093', 'no-text')}`,
            type: 'select',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 7 }
            },
            options: [],
            onHandler: {
              target: ['apprAprvCmp']
            },
            style: {
              width: 140,
              marginLeft: -3
            },
            rules: [{ required: true, message: 'Grid ' + service.getValue(lang, 'LANG00093', 'no-text') }]
          },
          {
            key: 'applWorkDudt',
            label: service.getValue(lang, 'LANG00179', 'no-text'),
            type: 'input',
            props: {
              disabled: true
            }
          },
          {
            key: 'applWorkCmdt',
            label: service.getValue(lang, 'LANG00108', 'no-text'),
            type: 'datepicker',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            style: {
              width: 140,
              marginLeft: -3
            },
            extra: <span className="warning">{`${service.getValue(lang, 'LANG00161', 'no-text')} ${service.getValue(lang, 'LANG00162', 'no-text')}`}</span>
          },
          {
            key: 'fileIdCd3',
            label: service.getValue(lang, 'LANG00077', 'no-text'),
            type: 'upload',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            initialValue: []
          },
          {
            key: 'applNote',
            label: service.getValue(lang, 'LANG00078', 'no-text'),
            type: 'textarea',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            props: {
              row: 4
            }
          }
        ]
      },
      {
        title: service.getValue(lang, 'LANG00180', 'no-text'),
        key: 'confirm',
        colSpan: 12,
        props: {
          columns: 2,
          formLayout: {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        },
        style: {
          marginBottom: 20
        },
        fields: [
          {
            key: 'apprAprvCmp',
            label: `Grid ${service.getValue(lang, 'LANG00093', 'no-text')}`,
            // type: 'select',
            type: 'input',
            props: {
              disabled: true
            },
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 7 }
            },
            options: [],
            style: {
              width: 140,
              marginLeft: -3
            }
          },
          {
            key: 'apprWorkDudt',
            label: `Grid ${service.getValue(lang, 'LANG00106', 'no-text')}`,
            type: 'input',
            props: {
              disabled: true
            }
          },
          {
            key: 'apprWorkCmdt',
            label: service.getValue(lang, 'LANG00108', 'no-text'),
            type: 'datepicker'
          },
          {
            key: 'apprAprvYn',
            label: service.getValue(lang, 'LANG00094', 'no-text'),
            type: 'radio',
            options: [
              {
                key: 1,
                label: 'Yes',
                value: 'Y'
              },
              {
                key: 0,
                label: 'No',
                value: 'N'
              }
            ]
          },
          {
            key: 'apprFailRsn',
            label: service.getValue(lang, 'LANG00092', 'no-text'),
            type: 'textarea',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            props: {
              row: 2
            }
          },
          {
            key: 'fileIdCd4',
            label: service.getValue(lang, 'LANG00077', 'no-text'),
            type: 'upload',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            initialValue: []
          },
          {
            key: 'apprNote',
            label: service.getValue(lang, 'LANG00078', 'no-text'),
            type: 'textarea',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            props: {
              row: 4
            }
          }
        ]
      },
      {
        title: service.getValue(lang, 'LANG00181', 'no-text'),
        key: 'buy',
        colSpan: 12,
        props: {
          columns: 2,
          formLayout: {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        },
        fields: [
          {
            key: 'mpWorkDudt',
            label: service.getValue(lang, 'LANG00182', 'no-text'),
            type: 'input',
            props: {
              disabled: true
            }
          },
          {
            key: 'mpWorkCmdt',
            label: service.getValue(lang, 'LANG00108', 'no-text'),
            type: 'datepicker',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            style: {
              width: 140,
              marginLeft: -3
            },
            extra: <span className="warning">{`${service.getValue(lang, 'LANG00161', 'no-text')} ${service.getValue(lang, 'LANG00162', 'no-text')}`}</span>
          },
          {
            key: 'fileIdCd5',
            label: service.getValue(lang, 'LANG00077', 'no-text'),
            type: 'upload',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            initialValue: []
          },
          {
            key: 'mpNote',
            label: service.getValue(lang, 'LANG00078', 'no-text'),
            type: 'textarea',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            props: {
              row: 4
            }
          }
        ]
      },
      {
        title: service.getValue(lang, 'LANG00012', 'no-text'),
        key: 'install',
        colSpan: 12,
        props: {
          columns: 2,
          formLayout: {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        },
        fields: [
          {
            key: 'insWorkDudt',
            label: service.getValue(lang, 'LANG00111', 'no-text'),
            type: 'input',
            props: {
              disabled: true
            }
          },
          {
            key: 'insWorkCmdt',
            label: service.getValue(lang, 'LANG00108', 'no-text'),
            type: 'datepicker',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            style: {
              width: 140,
              marginLeft: -3
            },
            extra: <span className="warning">{`${service.getValue(lang, 'LANG00161', 'no-text')} ${service.getValue(lang, 'LANG00162', 'no-text')}`}</span>
          },
          {
            key: 'fileIdCd6',
            label: service.getValue(lang, 'LANG00077', 'no-text'),
            type: 'upload',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            initialValue: []
          },
          {
            key: 'insNote',
            label: service.getValue(lang, 'LANG00078', 'no-text'),
            type: 'textarea',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            props: {
              row: 4
            }
          }
        ]
      }
    ],
    approve: [
      {
        title: service.getValue(lang, 'LANG00176', 'no-text'),
        key: 'approve',
        props: {
          columns: 1,
          formLayout: {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 }
          }
        },
        fields: [
          {
            key: 'nctrMemYn',
            label: service.getValue(lang, 'LANG00183', 'no-text'),
            type: 'radio',
            initialValue: 'Y',
            options: [
              {
                key: 1,
                label: 'Yes',
                value: 'Y'
              },
              {
                key: 0,
                label: 'No',
                value: 'N'
              }
            ]
          },
          {
            key: 'expnDt',
            label: service.getValue(lang, 'LANG00184', 'no-text'),
            type: 'datepicker',
            style: {
              width: 180
            },
            rules: [{ required: true, message: service.getValue(lang, 'LANG00184', 'no-text') }],
            extra: <span className="warning">{`${service.getValue(lang, 'LANG00161', 'no-text')} ${service.getValue(lang, 'LANG00162', 'no-text')}`}</span>
          },
          {
            key: 'note',
            label: service.getValue(lang, 'LANG00078', 'no-text'),
            type: 'textarea',
            props: {
              row: 4
            }
          }
        ]
      }
    ],
    contract: [
      {
        title: service.getValue(lang, 'LANG00185', 'no-text'),
        key: 'info',
        colSpan: 12,
        props: {
          columns: 2,
          formLayout: {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        },
        fields: [
          {
            key: 'siteId',
            label: service.getValue(lang, 'LANG00063', 'no-text'),
            type: 'tooltip',
            props: {
              disabled: true
            }
          },
          {
            key: 'userSeq',
            label: service.getValue(lang, 'LANG00073', 'no-text'),
            type: 'select',
            initialValue: '',
            placeholder: 'Select',
            rules: [{ required: true, message: service.getValue(lang, 'LANG00073', 'no-text') }],
            onHandler: {
              value: 'new',
              target: ['userName', 'userId', 'telNo', 'email']
            },
            props: {
              showSearch: true,
              optionFilterProp: 'children',
              filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
              onSearch: null
            }
          },
          {
            key: 'userName',
            label: service.getValue(lang, 'LANG00064', 'no-text'),
            type: 'input',
            props: {
              disabled: true
            },
            rules: [{ required: true, message: service.getValue(lang, 'LANG00064', 'no-text') }]
          },
          {
            key: 'userId',
            label: `${service.getValue(lang, 'LANG00073', 'no-text')}ID`,
            type: 'input',
            props: {
              disabled: true
            }
          },
          {
            key: 'telNo',
            label: service.getValue(lang, 'LANG00074', 'no-text'),
            type: 'input',
            props: {
              disabled: true
            },
            rules: [{ required: true, message: service.getValue(lang, 'LANG00074', 'no-text') }]
          },
          {
            key: 'email',
            label: service.getValue(lang, 'LANG00075', 'no-text'),
            type: 'input',
            props: {
              disabled: true
            },
            rules: [{ required: true, message: service.getValue(lang, 'LANG00075', 'no-text') }]
          },
          {
            key: 'addr',
            label: service.getValue(lang, 'LANG00086', 'no-text'),
            type: 'input',
            geocode: true,
            props: {
              disabled: true
            },
            columns: 1,
            formLayout: {
              labelCol: { span: 6 },
              wrapperCol: { span: 18 }
            },
            rules: [{ required: true, message: service.getValue(lang, 'LANG00086', 'no-text') }]
          },
          {
            key: 'regnGubn',
            label: service.getValue(lang, 'LANG00038', 'no-text'),
            type: 'select',
            rules: [{ required: true, message: service.getValue(lang, 'LANG00038', 'no-text') }],
            options: []
          },
          {
            key: 'timeZone',
            label: 'Timezone',
            type: 'input',
            props: {
              disabled: true
            }
          },
          {
            key: 'spc',
            label: 'SPC',
            type: 'select',
            options: []
          },
          {
            key: 'currUnit',
            label: service.getValue(lang, 'LANG00076', 'no-text'),
            type: 'select',
            rules: [{ required: true, message: service.getValue(lang, 'LANG00076', 'no-text') }],
            options: []
          },
          {
            key: 'cnrtStrtDt',
            label: service.getValue(lang, 'LANG00186', 'no-text'),
            rules: [{ required: true, message: service.getValue(lang, 'LANG00186', 'no-text') }],
            type: 'datepicker'
          },
          {
            key: 'cnrtEndDt',
            label: service.getValue(lang, 'LANG00271', 'no-text'),
            rules: [{ required: true, message: service.getValue(lang, 'LANG00271', 'no-text') }],
            type: 'datepicker'
          },
          {
            key: 'ppaUnitPrce',
            label: service.getValue(lang, 'LANG00187', 'no-text'),
            type: 'input',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            style: {
              width: 140,
              marginLeft: -3
            }
          },
          {
            key: 'totlCost',
            label: 'Total Cost',
            type: 'input'
          },
          {
            key: 'stc',
            label: service.getValue(lang, 'LANG00118', 'no-text'),
            type: 'input'
          },
          {
            key: 'rescGubn',
            label: service.getValue(lang, 'LANG00087', 'no-text'),
            type: 'select',
            initialValue: 'A',
            options: [],
            rules: [{ required: true, message: service.getValue(lang, 'LANG00087', 'no-text') }]
          },
          {
            key: 'instPsnSeq',
            label: service.getValue(lang, 'LANG00026', 'no-text'),
            type: 'select',
            options: [],
            rules: [{ required: true, message: service.getValue(lang, 'LANG00026', 'no-text') }]
          },
          {
            key: 'pvInstCapa',
            label: `PV ${service.getValue(lang, 'LANG00035', 'no-text')}`,
            type: 'input'
          },
          {
            key: 'essInstCapa',
            label: `ESS ${service.getValue(lang, 'LANG00035', 'no-text')}`,
            type: 'input'
          },
          {
            key: 'fileIdCd1',
            label: service.getValue(lang, 'LANG00077', 'no-text'),
            type: 'upload',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            initialValue: []
          },
          {
            key: 'contractNote',
            label: service.getValue(lang, 'LANG00078', 'no-text'),
            type: 'textarea',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            props: {
              row: 4
            }
          },
          {
            key: 'latd',
            label: '',
            type: 'input',
            props: {
              style: {
                display: 'none'
              }
            }
          },
          {
            key: 'lgtd',
            label: '',
            type: 'input',
            props: {
              style: {
                display: 'none'
              }
            }
          }
        ]
      },
      {
        title: service.getValue(lang, 'LANG00188', 'no-text'),
        key: 'plan',
        colSpan: 12,
        props: {
          columns: 2,
          formLayout: {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        },
        fields: [
          {
            key: 'infoPv',
            label: '[PV INFO.]',
            type: 'label',
            columns: 1
          },
          {
            key: 'modlMnftGubn',
            label: service.getValue(lang, 'LANG00189', 'no-text'),
            type: 'select',
            options: []
          },
          {
            key: 'modlCapa',
            label: service.getValue(lang, 'LANG00080', 'no-text'),
            type: 'input'
          },
          {
            key: 'infoINV',
            label: '[INVERTER INFO.]',
            type: 'label',
            columns: 1
          },
          {
            key: 'invtMnftGubn',
            label: service.getValue(lang, 'LANG00190', 'no-text'),
            type: 'select',
            options: []
          },
          {
            key: 'invtCapa',
            label: service.getValue(lang, 'LANG00081', 'no-text'),
            type: 'input'
          },
          {
            key: 'infoBAT',
            label: '[BATTERY INFO.]',
            type: 'label',
            columns: 1
          },
          {
            key: 'btryMnftGubn',
            label: service.getValue(lang, 'LANG00191', 'no-text'),
            type: 'select',
            options: []
          },
          {
            key: 'btryCapa',
            label: service.getValue(lang, 'LANG00082', 'no-text'),
            type: 'input'
          },
          {
            key: 'comuEqmtGubn',
            label: `${service.getValue(lang, 'LANG00083', 'no-text')} ${service.getValue(lang, 'LANG00085', 'no-text')}`,
            type: 'select',
            options: [],
            initialValue: null
          },
          {
            key: 'comuMthdGubn',
            label: service.getValue(lang, 'LANG00084', 'no-text'),
            type: 'select',
            options: [],
            initialValue: null
          },
          {
            key: 'fileIdCd2',
            label: service.getValue(lang, 'LANG00077', 'no-text'),
            type: 'upload',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            initialValue: []
          },
          {
            key: 'applDudt',
            label: service.getValue(lang, 'LANG00179', 'no-text'),
            type: 'datepicker'
          },
          {
            key: 'apprDudt',
            label: `Grid ${service.getValue(lang, 'LANG00106', 'no-text')}`,
            type: 'datepicker'
          },
          {
            key: 'mpDudt',
            label: service.getValue(lang, 'LANG00182', 'no-text'),
            type: 'datepicker'
          },
          {
            key: 'insDudt',
            label: service.getValue(lang, 'LANG00111', 'no-text'),
            type: 'datepicker'
          },
          {
            key: 'wkplCmplDt',
            label: service.getValue(lang, 'LANG00108', 'no-text'),
            type: 'datepicker',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            style: {
              width: 140,
              marginLeft: -3
            },
            extra: <span className="warning">{`${service.getValue(lang, 'LANG00161', 'no-text')} ${service.getValue(lang, 'LANG00162', 'no-text')}`}</span>
          },
          {
            key: 'planTotlCost',
            label: 'Total Cost' + '\n' + '(After Survey)',
            type: 'input'
          },
          {
            key: 'planNote',
            label: service.getValue(lang, 'LANG00078', 'no-text'),
            type: 'textarea',
            columns: 1,
            formLayout: {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            },
            props: {
              row: 4
            }
          }
        ]
      }
    ]
  }
};

const fieldConfigs = {
  info: {
    key: 'data.mainData',
    regnGubn: 'CDK-00005',
    currUnit: 'CDK-00013',
    rescGubn: 'CDK-00011',
    spc: 'CDK-00021'
  },
  plan: {
    key: 'data.mainData',
    modlMnftGubn: 'CDK-00006',
    invtMnftGubn: 'CDK-00007',
    btryMnftGubn: 'CDK-00008',
    comuEqmtGubn: 'CDK-00014',
    comuMthdGubn: 'CDK-00015'
  },
  approve: {
    key: 'data'
  },
  request: {
    key: 'data.mainData',
    applAprvCmp: 'CDK-00016'
  },
  confirm: {
    key: 'data.mainData',
    apprAprvCmp: 'CDK-00016'
  },
  buy: {
    key: 'data.mainData'
  },
  install: {
    key: 'data.mainData'
  },
  inspection: {
    key: 'data.mainData'
  },
  opertaion: {
    key: 'data.mainData'
  },
  finish: {
    key: 'data'
  }
};

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
    key: 5,
    roll: 'remove',
    type: 'danger',
    label: service.getValue(lang, 'LANG00068', 'no-text')
  },
  {
    key: 4,
    roll: 'update',
    type: 'primary',
    label: service.getValue(lang, 'LANG00208', 'no-text')
  }
];

const userInfo = {
  modal: {
    title: service.getValue(lang, 'LANG00307', 'no-text'),
    footer: {
      right: ['cancel', 'save']
    }
  }
};

const initialKeys = [
  {
    dataIndex: 'contract',
    key: 'mainData.wkplCmplDt',
    mapper: 'wkplCmplDt'
  },
  {
    dataIndex: 'approve',
    key: '0.expnDt',
    mapper: 'expnDt'
  },
  {
    dataIndex: 'grid',
    key: 'mainData.0.apprWorkCmdt',
    mapper: 'apprWorkCmdt'
  },
  {
    dataIndex: 'inspection',
    key: 'mainData.0.chkCmplDt',
    mapper: 'chkCmplDt'
  },
  {}
];

const kpiSearch = [
  {
    label: '',
    key: 'type',
    type: 'select',
    options: []
  },
  {
    key: 'startDt',
    type: 'datepicker',
    props: {
      placeholder: service.getValue(lang, 'LANG00099', 'no-text')
    }
  },
  {
    key: 'endDt',
    type: 'datepicker',
    props: {
      placeholder: service.getValue(lang, 'LANG00100', 'no-text')
    }
  }
];

export { siteDetail, siteRegister, fieldConfigs, actionButtons, userInfo, initialKeys, kpiSearch };
