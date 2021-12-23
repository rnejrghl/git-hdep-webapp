import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Card, Row, Col, Button } from 'antd';
import moment from 'moment';

import { CommonForm } from '@/components/commons';

import { values, service, locale, formats } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

function TabComponent(props) {
  const { handler, onEvents, current, isNew } = props;
  const [isNewUser, setNewUser] = useState(true);
  const [formValues, setFormValues] = useState({});
  const [chkPassYn, setChkPassYn] = useState('Y');
  const [apprAprvCmp, setApprAprvCmp] = useState('');
  const { user = {} } = useSelector(state => service.getValue(state, 'auth', {}), shallowEqual);
  const configs = useSelector(state => service.getValue(state.auth, 'configs', []), shallowEqual);
  const userList = useSelector(state => service.getValue(state.fetch, `multipleList.userList.userData`, []), shallowEqual);

  useEffect(() => {
    setNewUser(isNew);
  }, [isNew]);

  useEffect(() => {
    const submit = () => {
      const keys = service.getValue(values.siteRegister.pages, `${current}`, []).map(inner => inner.key);
      const isComplete = keys.every(key => Object.keys(service.getValue(formValues, `${current}`, {})).includes(key));

      // console.log("useEffect_formValues_apprAprvCmp : " + apprAprvCmp)
      // console.log("keys : " + keys);

      if (handler && isComplete) {
        onEvents({ method: 'submit', payload: formValues });
      }

      //console.log("formValues : " + JSON.stringify(formValues));
    };
    submit();
  }, [formValues, handler, onEvents, current]);

  const onSubmit = useCallback(
    (events, key) => {
      const { method, payload } = events;
      payload.apprAprvCmp = apprAprvCmp;
      // console.log("onSubmit_apprAprvCmp: " + apprAprvCmp);
      // console.log("onSubmit_current: " + current);
      // console.log("onSubmit_events: " + JSON.stringify(events));
      // console.log("onSubmit_payload : " + JSON.stringify(payload));

      if (method === 'error') {
        return onEvents({ method: 'error', payload });
      }

      if (method === 'submit') {
        setFormValues(state => {
          return {
            ...state,
            [current]: {
              ...state[current],
              [key]: { ...payload }
            }
          };
        });
        return null;
      }
      return null;
    },
    [current, onEvents]
  );

  const onChangeCheckPass = e => {
    setChkPassYn(e.target.value);
  };

  const onChangeUser = value => {
    if (value === 'new') {
      setNewUser(true);
    } else {
      setNewUser(false);
    }
  };

  const onChangeGrid = value => {
    const codes = configs.filter(inner => inner.grpCd === 'CDK-00016').map(inner => service.getValue(inner, 'codes', []));

    // console.log("codes_2 : " + codes[0][0]["cdName"]);
    // console.log("codes_filter : " + JSON.stringify(codes[0].filter(inner => inner.cd == value).map((item2)=> item2.cd)));
    //console.log("codes_test : " + JSON.stringify(codes_test));
    const valueFilter = codes[0].filter(inner => inner.cd == value).map(item2 => item2.cd);

    setApprAprvCmp(valueFilter[0]);

    //this.useEffect({value: valueFilter[0]});
  };

  const openLink= (value)=>{
    service.getValue(props.data, value, []).forEach(element => {
    window.open(element.filePath,'_blank','');
    })
  };

  const mergedFields = (activeKey, fields) => {
    const dataKey = service.getValue(values.fieldConfigs, `${activeKey}.key`, null);
    const matchedData = service.getValue(props, `${dataKey}`, {});
    const flatData = Array.isArray(matchedData) ? service.getValue(matchedData, '0', {}) : matchedData;

    return fields.map(field => {
      const matched = service.getValue(values.fieldConfigs, `${activeKey}.${field.key}`, null);

      if (field.key === 'siteId') {
        const value = service.getValue(flatData, `${field.key}`, null);
        return {
          ...field,
          initialValue: value
        };
      }

      if (field.key === 'applAprvCmp') {
        const codes = configs.filter(inner => inner.grpCd === matched).map(inner => service.getValue(inner, 'codes', []));
        //console.log(codes);
        return {
          ...field,
          options: service.getValue(codes, '0', []).map(item => {
            return {
              key: item.cd,
              value: item.cd,
              label: item.cdName
            };
          }),
          onChange: onChangeGrid,

          initialValue: service.getValue(flatData, `${field.key}`, null)
        };
      }

      if (field.key === 'apprAprvCmp') {
        const codes = configs.filter(inner => inner.grpCd === 'CDK-00016').map(inner => service.getValue(inner, 'codes', []));
        const apprAprvCmpInput = service.getValue(flatData, `${field.key}`, null);

        // console.log("codes : " + codes[0].filter(inner => inner.cd == service.getValue(flatData, `${field.key}`, null)).map(item2=> item2.cdName));
        // console.log("test : " + test);
        // console.log("apprAprvCmp.JSON.stringify.toString.getValue : " + JSON.stringify(apprAprvCmp).toString.getValue);
        // console.log("apprAprvCmp) : " + apprAprvCmp);
        // console.log(".apprAprvCmpgetFixed : " + apprAprvCmp.getFixed);

        return {
          ...field,

          initialValue:
            apprAprvCmpInput == null
              ? apprAprvCmp == '[object Object]'
                ? codes[0].filter(inner => inner.cd == apprAprvCmpInput).map(item2 => item2.cdName)
                : codes[0].filter(inner => inner.cd == apprAprvCmp).map(item2 => item2.cdName)
              : apprAprvCmp == '[object Object]'
              ? codes[0].filter(inner => inner.cd == apprAprvCmpInput).map(item2 => item2.cdName)
              : codes[0].filter(inner => inner.cd == apprAprvCmp).map(item2 => item2.cdName)
        };
      }

      if (field.key === 'userSeq') {
        return {
          ...field,
          options: [{ key: 'new', value: 'new', label: service.getValue(lang, 'LANG00258', 'no-text') }].concat(
            userList
              .filter(item => service.getValue(item, 'useYn', null) === 'Y')
              .filter(item => service.getValue(item, 'userLvlCd', null) === 'ACN005')
              .map(item => {
                return {
                  key: item.userSeq,
                  value: item.userSeq,
                  label: item.userName
                };
              })
          ),
          onChange: onChangeUser,
          onHandler: {
            ...field.onHandler,
            options: userList
          },
          initialValue: service.getValue(flatData, `${field.key}`, 'new')
        };
      }

      if (field.key === 'userName' || field.key === 'telNo' || field.key === 'email') {
        return {
          ...field,
          props: {
            disabled: !isNewUser
          },
          initialValue: service.getValue(flatData, `${field.key}`, null)
        };
      }

      if (field.key === 'instPsnSeq') {
        // 로그인한 사용자가 installer 이면 initialValue를 본인으로 설정
        // refs = https://docs.google.com/presentation/d/1n9jPYG_1cKhBW9azfORdVsUex4EUigUxpmHav2lLBZk/edit#slide=id.g8348578b61_2_2
        const myLvlCd = service.getValue(user, 'userLvlCd', null);
        const initialValue = isNew && myLvlCd === 'ACN003' ? service.getValue(user, 'userSeq', null) : service.getValue(flatData, `${field.key}`, null);
        let installerUser = service.getValue(props.data, 'InstallerUserList', []).filter(item => service.getValue(item, 'userLvlCd', null) === 'ACN003');
        if (myLvlCd === 'ACN003' || myLvlCd === 'ACN004' || myLvlCd === 'ACN007') {
          installerUser = service.getValue(props.data, 'InstallerUserList', []).filter(item => service.getValue(item, 'userId', null) === service.getValue(user, 'userId', null));
        }

        return {
          ...field,
          options: installerUser.map(item => {
            return {
              key: item.userSeq,
              value: item.userSeq,
              label: item.userName
            };
          }),
          initialValue
        };
      }

      if (field.key === 'chkPassYn') {
        return {
          ...field,
          onChange: onChangeCheckPass
        };
      }

      if (field.key === 'invoiceUserData') {
        return {
          ...field,
          options: service.getValue(props.data, 'invoiceUserData', []).map(item => {
            return {
              key: item.userSeq,
              value: item.userSeq,
              label: item.userName
            };
          }),
          initialValue: service.getValue(props.data, 'invoiceUserData', []).map(item => item.userSeq)
        };
      }
      if (field.key === 'mngUserSeq') {
        return {
          ...field,
          options: service.getValue(props.data, 'omUserList', []).map(item => {
            return {
              key: item.userSeq,
              value: item.userSeq,
              label: item.userName
            };
          }),
          rules: [{ required: chkPassYn === 'Y', message: service.getValue(lang, 'LANG00174', 'no-text') }],
          initialValue: service.getValue(flatData, `${field.key}`, null)
        };
      }

      if (field.key === 'wkplCmplDt' || field.key === 'expnDt' || field.key === 'mpWorkCmdt' || field.key === 'insWorkCmdt') {
        const value = service.getValue(flatData, `${field.key}`, null);
        const isAdmin = service.getValue(user, 'userLvlCd', null) === 'ACN001';
        return {
          ...field,
          props: {
            disabled: !!value && !isAdmin
          },
          initialValue: value ? moment(value, formats.timeFormat.YEARMONTHDAY) : null
        };
      }
      if (field.key === 'applWorkCmdt') {
        const value = service.getValue(flatData, `${field.key}`, null);
        const isAdmin = service.getValue(user, 'userLvlCd', null) === 'ACN001';
        return {
          ...field,
          props: {
            disabled: !!value && !isAdmin
          },
          initialValue: value ? moment(value, formats.timeFormat.YEARMONTHDAY) : null
        };
      }

      if (field.key === 'fileIdCd1') {
        return {
          ...field,
          initialValue: service.getValue(props.data, 'contractFileListData', []).map(inner => {
            return {
              ...inner,
              uid: inner.fileSeq,
              name: inner.realFileName,
              status: 'done',
              url: inner.filePath
            };
          }),
          extra: service.getValue(props.data, 'contractFileListData', []).length>0?<Button target="_self" onClick={()=>openLink('contractFileListData')}> {service.getValue(lang, 'LANG00443', 'no-text')}</Button>:null
        };
      }

      if (field.key === 'fileIdCd2') {
        return {
          ...field,
          initialValue: service.getValue(props.data, 'planFileListData', []).map(inner => {
            return {
              ...inner,
              uid: inner.fileSeq,
              name: inner.realFileName,
              status: 'done',
              url: inner.filePath
            };
          }),
          extra: service.getValue(props.data, 'planFileListData', []).length>0?<Button target="_self" onClick={()=>openLink('planFileListData')}> {service.getValue(lang, 'LANG00443', 'no-text')}</Button>:null
        };
      }

      if (field.key === 'fileIdCd3') {
        return {
          ...field,
          initialValue: service.getValue(props.data, 'applFileListData', []).map(inner => {
            return {
              ...inner,
              uid: inner.fileSeq,
              name: inner.realFileName,
              status: 'done',
              url: inner.filePath
            };
          }),
          extra: service.getValue(props.data, 'applFileListData', []).length>0?<Button target="_self" onClick={()=>openLink('applFileListData')}> {service.getValue(lang, 'LANG00443', 'no-text')}</Button>:null
        };
      }

      if (field.key === 'fileIdCd4') {
        return {
          ...field,
          initialValue: service.getValue(props.data, 'apprFileListData', []).map(inner => {
            return {
              ...inner,
              uid: inner.fileSeq,
              name: inner.realFileName,
              status: 'done',
              url: inner.filePath
            };
          }),
          extra: service.getValue(props.data, 'apprFileListData', []).length>0?<Button target="_self" onClick={()=>openLink('apprFileListData')}> {service.getValue(lang, 'LANG00443', 'no-text')}</Button>:null
        };
      }

      if (field.key === 'fileIdCd5') {
        return {
          ...field,
          initialValue: service.getValue(props.data, 'mpFileListData', []).map(inner => {
            return {
              ...inner,
              uid: inner.fileSeq,
              name: inner.realFileName,
              status: 'done',
              url: inner.filePath
            };
          }),
          extra: service.getValue(props.data, 'mpFileListData', []).length>0?<Button target="_self" onClick={()=>openLink('mpFileListData')}> {service.getValue(lang, 'LANG00443', 'no-text')}</Button>:null
        };
      }

      if (field.key === 'fileIdCd6') {
        return {
          ...field,
          initialValue: service.getValue(props.data, 'insFileListData', []).map(inner => {
            return {
              ...inner,
              uid: inner.fileSeq,
              name: inner.realFileName,
              status: 'done',
              url: inner.filePath
            };
          }),
          extra: service.getValue(props.data, 'insFileListData', []).length>0?<Button target="_self" onClick={()=>openLink('insFileListData')}> {service.getValue(lang, 'LANG00443', 'no-text')}</Button>:null
        };
      }

      if (field.key === 'insFiles') {
        return {
          ...field,
          initialValue: service.getValue(props.data, 'siteFileList', []).map(inner => {
            return {
              ...inner,
              uid: inner.fileSeq,
              name: inner.realFileName,
              status: 'done',
              url: inner.filePath
            };
          }),
          extra: service.getValue(props.data, 'siteFileList', []).length>0?<Button target="_self" onClick={()=>openLink('siteFileList')}> {service.getValue(lang, 'LANG00443', 'no-text')}</Button>:null
        };
      }
      if (field.key === 'currUnit') {
        const codes = configs.filter(inner => inner.grpCd === 'CDK-00013').map(inner => service.getValue(inner, 'codes', []));
        return {
          ...field,
          options: service
            .getValue(codes, '0', [])
            .filter(item => item.cd === 'AU')
            .map(item => {
              return {
                key: item.cd,
                value: item.cd,
                label: item.cdName
              };
            }),
          initialValue: service.getValue(flatData, `${field.key}`, 'AU')
        };
      }

      if (field.key === 'fileIdCd7') {
        return {
          ...field,
          initialValue: service.getValue(props.data, 'mngFileList', []).map(inner => {
            return {
              ...inner,
              uid: inner.fileSeq,
              name: inner.realFileName,
              status: 'done',
              url: inner.filePath
            };
          }),
          extra: service.getValue(props.data, 'mngFileList', []).length>0?<Button target="_self" onClick={()=>openLink('mngFileList')}> {service.getValue(lang, 'LANG00443', 'no-text')}</Button>:null
        };
      }

      if (field.key === 'totlCost' || field.key === 'stc' || field.key === 'pvInstCapa' || field.key === 'essInstCapa' || field.key === 'modlCapa' || field.key === 'invtCapa' || field.key === 'btryCapa') {
        const value = service.getValue(flatData, `${field.key}`, '');
        return {
          ...field,
          initialValue: value ? service.getFixed(value, 3, true) : null
        };
      }

      if (field.type === 'datepicker') {
        const value = service.getValue(flatData, `${field.key}`, null);
        return {
          ...field,
          initialValue: value ? moment(value, formats.timeFormat.YEARMONTHDAY) : null
        };
      }

      if (matched && field.type === 'select') {
        const codes = configs.filter(inner => inner.grpCd === matched).map(inner => service.getValue(inner, 'codes', []));
        return {
          ...field,
          options: service.getValue(codes, '0', []).map(item => {
            return {
              key: item.cd,
              value: item.cd,
              label: item.cdName
            };
          }),
          initialValue: service.getValue(flatData, `${field.key}`, null)
        };
      }

      return {
        ...field,
        initialValue: service.getValue(flatData, `${field.key}`, null)
      };
    });
  };

  const cards = service.getValue(values.siteRegister.pages, `${props.current}`, [isNewUser]);

  return (
    <Row type="flex" justify="space-between" align="stretch" gutter={20}>
      {cards.map(card => {
        return (
          <Col span={card.colSpan || 24} key={card.key} style={{ ...card.style }}>
            <Card
              title={
                <p className="title" style={{ marginBottom: 0 }}>
                  {card.title}
                </p>
              }
              headStyle={{ borderBottom: 0 }}
              bodyStyle={{ height: 'calc(100% - 50px)' }}
              style={{ height: '100%' }}
            >
              <CommonForm hideRequiredMark={false} handler={handler} fields={mergedFields(card.key, card.fields)} labelAlign="left" onSubmit={events => onSubmit(events, card.key)} {...card.props} />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}

export default TabComponent;
