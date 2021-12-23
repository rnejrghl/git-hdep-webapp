import { locale, service } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

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
  },
  {
    key: 6,
    roll: 'add',
    type: 'primary',
    className: 'deep-grey',
    label: service.getValue(lang, 'LANG00056', 'no-text')
  },
  {
    key: 7,
    roll: 'inq',
    type: 'primary',
    label: service.getValue(lang, 'LANG00157', 'no-text')
  },
  {
    key: 8,
    roll: 'notice',
    label: service.getValue(lang, 'LANG00269', 'no-text'),
    className: 'deep-grey',
    type: 'primary',
    style: {
      height: 30
    }
  }
];

const modals = [
  {
    key: 'formula',
    title: service.getValue(lang, 'LANG00147', 'no-text'),
    footer: {
      right: ['cancel', 'confirm']
    }
  },
  {
    key: 'formulaAdd',
    title: `${service.getValue(lang, 'LANG00147', 'no-text')} ${service.getValue(lang, 'LANG00056', 'no-text')}`,
    footer: {
      right: ['cancel', 'save']
    }
  },
  {
    key: 'notice',
    title: service.getValue(lang, 'LANG00267', 'no-text'),
    message: service.getValue(lang, 'LANG00268', 'no-text')
  }
];

const pages = {
  site: {
    sider: {
      title: service.getValue(lang, 'LANG00231', 'no-text')
    },
    content: {
      title: service.getValue(lang, 'LANG00232', 'no-text'),
      buttons: ['update'],
      fields: [
        {
          key: 'siteId',
          label: service.getValue(lang, 'LANG00063', 'no-text'),
          type: 'input',
          props: {
            disabled: true
          }
        },
        {
          key: 'userName',
          label: service.getValue(lang, 'LANG00064', 'no-text'),
          type: 'input',
          props: {
            disabled: true
          }
        },
        {
          key: 'rescGubn',
          label: service.getValue(lang, 'LANG00087', 'no-text'),
          type: 'input',
          props: {
            disabled: true
          }
        },
        {
          key: 'capacity',
          label: service.getValue(lang, 'LANG00035', 'no-text'),
          type: 'textarea',
          props: {
            disabled: true
          },
          style: {
            resize: 'none',
            height: 30
          }
        }
      ]
    }
  },
  device: {
    sider: {
      title: service.getValue(lang, 'LANG00235', 'no-text')
    },
    content: {
      buttons: {
        read: ['update'],
        update: ['cancel', 'save']
      }
    }
  },
  deviceAlarm: {
    content: {
      buttons: {
        read: ['update'],
        update: ['cancel', 'save']
      },
      sendOptions: [
        { key: 'sysAlrtYn', label: 'Sytem Alert', value: 'sysAlrtYn' },
        { key: 'smsYn', label: 'SMS', value: 'smsYn' },
        { key: 'emailYn', label: 'Email', value: 'emailYn' }
      ]
    }
  },
  gw: {
    sider: {
      title: service.getValue(lang, 'LANG00236', 'no-text'),
      buttons: ['add'],
      modals: [
        {
          key: 'add',
          title: 'G/W그룹 추가',
          footer: {
            right: ['cancel', 'save']
          }
        }
      ],
      fields: [
        {
          key: 'gtwyName',
          label: service.getValue(lang, 'LANG00237', 'no-text'),
          type: 'input',
          rules: [{ required: true, message: service.getValue(lang, 'LANG00237', 'no-text') }]
        },
        {
          key: 'inverterList',
          label: service.getValue(lang, 'LANG00033', 'no-text'),
          type: 'select',
          options: []
        },
        {
          key: 'batteryList',
          label: service.getValue(lang, 'LANG00034', 'no-text'),
          type: 'select',
          options: []
        }
      ]
    },
    content: {
      title: service.getValue(lang, 'LANG00232', 'no-text'),
      buttons: {
        read: ['update'],
        update: ['cancel', 'save']
      }
    }
  },
  user: {
    buttons: ['add'],
    modals: [
      {
        key: 'create',
        title: `${service.getValue(lang, 'LANG00073', 'no-text')} ${service.getValue(lang, 'LANG00048', 'no-text')}`,
        footer: {
          right: ['cancel', 'save']
        }
      },
      {
        key: 'read',
        title: `${service.getValue(lang, 'LANG00073', 'no-text')} ${service.getValue(lang, 'LANG00208', 'no-text')}`,
        footer: {
          left: ['remove'],
          right: ['cancel', 'update']
        },
        update: {
          left: ['remove'],
          right: ['cancel', 'save']
        }
      }
    ],
    fields: [
      {
        key: 'userId',
        label: `${service.getValue(lang, 'LANG00073', 'no-text')}ID`,
        type: 'input',
        columns: 1,
        props: {
          disabled: true
        },
        formLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 8 }
        }
      },
      {
        key: 'userLvlCd',
        label: `${service.getValue(lang, 'LANG00073', 'no-text')} ${service.getValue(lang, 'LANG00133', 'no-text')}`,
        type: 'select',
        options: [],
        rules: [{ required: true, message: `${service.getValue(lang, 'LANG00073', 'no-text')} ${service.getValue(lang, 'LANG00133', 'no-text')}` }],
        columns: 1,
        formLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 8 }
        }
      },
      {
        key: 'userName',
        label: service.getValue(lang, 'LANG00064', 'no-text'),
        type: 'input',
        columns: 1,
        formLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 8 }
        }
      },
      {
        key: 'telNo',
        label: service.getValue(lang, 'LANG00074', 'no-text'),
        type: 'input',
        rules: [{ required: true, message: service.getValue(lang, 'LANG00074', 'no-text') }],
        formLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 }
        }
      },
      {
        key: 'email',
        label: service.getValue(lang, 'LANG00075', 'no-text'),
        type: 'input',
        rules: [{ required: true, message: service.getValue(lang, 'LANG00075', 'no-text') }],
        formLayout: {
          labelCol: { span: 7 },
          wrapperCol: { span: 17 }
        }
      },
      {
        key: 'alarms',
        label: service.getValue(lang, 'LANG00299', 'no-text'),
        type: 'checkbox',
        initialValue: [],
        options: [
          {
            key: 'smsAlrmYn',
            label: 'SMS',
            value: 'smsAlrmYn'
          },
          {
            key: 'emailAlrmYn',
            label: 'Email',
            value: 'emailAlrmYn'
          }
        ],
        columns: 1,
        formLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 8 }
        }
      },
      {
        key: 'useYn',
        label: service.getValue(lang, 'LANG00134', 'no-text'),
        type: 'radio',
        options: [
          {
            key: 'use',
            label: service.getValue(lang, 'LANG00276', 'no-text'),
            value: 'Y'
          },
          {
            key: 'no',
            label: service.getValue(lang, 'LANG00275', 'no-text'),
            value: 'N'
          }
        ],
        rules: [{ required: true, message: service.getValue(lang, 'LANG00134', 'no-text') }],
        initialValue: 'Y',
        columns: 1,
        formLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 8 }
        }
      },
      {
        key: 'menuRoleId',
        label: service.getValue(lang, 'LANG00135', 'no-text'),
        type: 'select',
        options: [],
        rules: [{ required: true, message: service.getValue(lang, 'LANG00135', 'no-text') }],
        columns: 1,
        formLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 8 }
        }
      },
      {
        key: 'inqGrpId',
        label: service.getValue(lang, 'LANG00136', 'no-text'),
        type: 'select',
        options: [],
        rules: [{ required: true, message: service.getValue(lang, 'LANG00136', 'no-text') }],
        columns: 1,
        formLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 8 }
        }
      }
    ]
  },

  menu: {
    sider: {
      title: `${service.getValue(lang, 'LANG00135', 'no-text')} ${service.getValue(lang, 'LANG00282', 'no-text')}`,
      buttons: ['add'],
      modals: [
        {
          key: 'add',
          title: service.getValue(lang, 'LANG00278', 'no-text'),
          fields: [
            {
              key: 'menuRoleName',
              label: service.getValue(lang, 'LANG00279', 'no-text'),
              type: 'input'
            }
          ],
          footer: {
            right: ['cancel', 'save']
          }
        }
      ]
    },
    content: {
      modals: [
        {
          key: 'remove',
          title: service.getValue(lang, 'LANG00068', 'no-text'),
          message: service.getValue(lang, 'LANG00259', 'no-text'),
          footer: {
            right: ['cancel', 'remove']
          }
        }
      ],
      buttons: {
        read: ['remove', 'update'],
        update: ['cancel', 'save']
      },
      fields: [
        {
          key: 'menuId',
          label: service.getValue(lang, 'LANG00283', 'no-text'),
          type: 'input',
          props: {
            disabled: true
          }
        },
        {
          key: 'menuKoName',
          label: `${service.getValue(lang, 'LANG00284', 'no-text')}(${service.getValue(lang, 'LANG00222', 'no-text')})`,
          type: 'input'
        },
        {
          key: 'menuEnName',
          label: `${service.getValue(lang, 'LANG00284', 'no-text')}(${service.getValue(lang, 'LANG00223', 'no-text')})`,
          type: 'input'
        },
        {
          key: 'menuJpName',
          label: `${service.getValue(lang, 'LANG00284', 'no-text')}(${service.getValue(lang, 'LANG00224', 'no-text')})`,
          type: 'input'
        },
        {
          key: 'active',
          label: service.getValue(lang, 'LANG00285', 'no-text'),
          type: 'checkbox',
          options: [
            {
              key: 'inqYn',
              label: service.getValue(lang, 'LANG00057', 'no-text'),
              value: 'inqYn'
            },
            {
              key: 'regYn',
              label: service.getValue(lang, 'LANG00048', 'no-text'),
              value: 'regYn'
            },
            {
              key: 'modYn',
              label: service.getValue(lang, 'LANG00208', 'no-text'),
              value: 'modYn'
            },
            {
              key: 'delYn',
              label: service.getValue(lang, 'LANG00068', 'no-text'),
              value: 'delYn'
            }
          ],
          formLayout: {
            labelCol: { span: 4 },
            wrapperCol: { span: 12 }
          }
        }
      ]
    }
  },
  code: {
    sider: {
      title: service.getValue(lang, 'LANG00266', 'no-text')
    },
    content: {
      buttons: {
        create: ['add'],
        read: ['inq'],
        update: ['cancel', 'save']
      }
    },
    modals: [
      {
        key: 'create',
        title: `Code ${service.getValue(lang, 'LANG00048', 'no-text')}`,
        footer: {
          right: ['cancel', 'save']
        }
      }
    ],
    fields: [
      {
        key: 'cd',
        label: 'Code',
        type: 'input',
        columns: 1
      },
      {
        key: 'cdName',
        label: service.getValue(lang, 'LANG00155', 'no-text'),
        type: 'input',
        columns: 1
      },
      {
        key: 'cdDesc',
        label: service.getValue(lang, 'LANG00156', 'no-text'),
        type: 'input',
        columns: 1
      }
    ]
  },
  role: {
    sider: {
      title: `${service.getValue(lang, 'LANG00136', 'no-text')} ${service.getValue(lang, 'LANG00282', 'no-text')}`,
      message: '조회 권한 구분을 추가합니다.',
      buttons: ['add'],
      modals: [
        {
          key: 'add',
          title: service.getValue(lang, 'LANG00280', 'no-text'),
          fields: [
            {
              key: 'inqGrpName',
              label: service.getValue(lang, 'LANG00281', 'no-text'),
              type: 'input'
            }
          ],
          footer: {
            right: ['cancel', 'save']
          }
        }
      ]
    },
    content: {
      modals: [
        {
          key: 'remove',
          title: service.getValue(lang, 'LANG00068', 'no-text'),
          message: service.getValue(lang, 'LANG00259', 'no-text'),
          footer: {
            right: ['cancel', 'remove']
          }
        }
      ],
      buttons: {
        read: ['remove', 'update'],
        update: ['cancel', 'save']
      }
    }
  },
  mail: {
    item: {
      emailFields: [
        {
          key: 0,
          dataIndex: 'mailTitl',
          label: 'Title'
        },
        {
          key: 1,
          dataIndex: 'mailHead',
          label: 'Header'
        },
        {
          key: 2,
          dataIndex: 'mailCntn',
          label: 'Content'
        },
        {
          key: 3,
          dataIndex: 'mailFter',
          label: 'Footer'
        }
      ]
    },
    buttons: ['add'],
    modals: [
      {
        key: 'create',
        title: `Notice ${service.getValue(lang, 'LANG00048', 'no-text')}`,
        footer: {
          right: ['cancel', 'save']
        }
      },
      {
        key: 'update',
        title: `Notice ${service.getValue(lang, 'LANG00208', 'no-text')}`,
        update: {
          left: ['remove'],
          right: ['cancel', 'save']
        }
      }
    ],
    fields: [
      {
        key: 'notiId',
        label: service.getValue(lang, 'LANG00368', 'no-text'),
        type: 'input',
        props: {
          disabled: true
        },
        columns: 1
      },
      {
        key: 'notiName',
        label: service.getValue(lang, 'LANG00159', 'no-text'),
        type: 'input',
        columns: 1
      },
      {
        key: 'smsCntn',
        label: `SMS ${service.getValue(lang, 'LANG00044', 'no-text')}`,
        type: 'input',
        columns: 1
      },
      {
        key: 'mailTitl',
        label: service.getValue(lang, 'LANG00369', 'no-text'),
        type: 'input',
        columns: 1
      },
      {
        key: 'mailHead',
        label: service.getValue(lang, 'LANG00370', 'no-text'),
        type: 'input',
        columns: 1
      },
      {
        key: 'mailCntn',
        label: service.getValue(lang, 'LANG00371', 'no-text'),
        type: 'textarea',
        props: {
          rows: 6
        },
        style: {
          resize: 'none'
        },
        columns: 1
      },
      {
        key: 'mailFter',
        label: service.getValue(lang, 'LANG00372', 'no-text'),
        type: 'textarea',
        props: {
          rows: 4
        },
        style: {
          resize: 'none'
        },
        columns: 1
      }
    ]
  },
  language: {
    content: {
      buttons: {
        read: ['update'],
        update: ['cancel', 'save']
      }
    }
  }
};

export { actionButtons, pages, modals };
