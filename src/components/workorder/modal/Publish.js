import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Alert, Tag } from 'antd';
import moment from 'moment';

import { CommonForm } from '@/components/commons';
import { service, formats } from '@/configs';

function Publish(props) {
  const { message, checkedList, fields = [], hasTags = false, selected } = props;
  const [tags, setTags] = useState(checkedList.sort());
  const workOrdTypes = useSelector(
    state =>
      service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00009')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner),
    shallowEqual
  );
  const [siteType, setSiteType] = useState('A');
  const { siteListData = [], noticeData = [] } = useSelector(state => service.getValue(state.fetch, 'page', {}), shallowEqual);
  const [noticeList, setNoticeList] = useState([]);
  const { user = {} } = useSelector(state => service.getValue(state, 'auth', {}));

  const onRemoveTag = value => {
    const newTags = tags.filter(tag => tag !== value);
    setTags(newTags);
  };

  const renderTagWrapper = tagList => {
    return (
      <div className="tag-wrapper">
        {tagList.map(tag => {
          return (
            <Tag key={tag} closable onClose={() => onRemoveTag(tag)}>
              {tag}
            </Tag>
          );
        })}
      </div>
    );
  };

  // useEffect(() => {
  //   const siteTypeSetting = () => {
  //     if (siteListData.length) {
  //       // todo siteType
  //       const matched = service.getValue(siteListData, '0', {});
  //       setSiteType(service.getValue(matched, 'rescGubn', 'A'));
  //     }
  //     setNoticeList(noticeData);
  //   };
  //   siteTypeSetting();
  // }, [noticeData, siteListData, siteType]);

  const onChangeSite = useCallback(
    value => {
      const matched = siteListData.filter(item => item.siteId === value).find(item => item);
      setSiteType(service.getValue(matched, 'rescGubn', 'A'));
    },
    [setSiteType, siteListData]
  );

  const onChangeWorkType = useCallback(
    value => {
      if (value === 'WT0001') {
        // todo 특별점검일때
        setNoticeList(noticeData);
      } else {
        setNoticeList(noticeData);
      }
    },
    [setNoticeList, noticeData]
  );

  const getFields = useCallback(
    fieldList => {
      return fieldList.map(field => {
        if (field.key === 'publDtti') {
          const date = service.getValue(selected, `${field.key}`, service.getValue(field, 'initialValue', null));
          return {
            ...field,
            initialValue: date ? moment(date, formats.timeFormat.YEARMONTHDAY).format(formats.timeFormat.FULLDATE) : moment()
          };
        }

        if (field.key === 'workOrdTyp') {
          return {
            ...field,
            options: workOrdTypes.map(inner => {
              return {
                key: inner.cd,
                value: inner.cd,
                label: inner.cdName
              };
            }),
            onChange: onChangeWorkType,
            onHandler: {
              ...field.onHandler,
              options: noticeList
            },
            initialValue: service.getValue(selected, `${field.key}`, service.getValue(workOrdTypes, '0.cd', null))
          };
        }
        if (field.key === 'cmplReqDt') {
          return {
            ...field,
            initialValue: service.getValue(selected, `${field.key}`, false) ? moment(service.getValue(selected, `${field.key}`), formats.timeFormat.YEARMONTHDAY) : moment().add(3, 'd')
          };
        }

        if (field.key === 'siteId') {
          return {
            ...field,
            options: siteListData.map(inner => {
              return {
                key: inner.siteId,
                value: inner.siteId,
                label: `${inner.siteId}(${inner.userName})`
              };
            }),
            onChange: onChangeSite,
            onHandler: {
              ...field.onHandler,
              options: siteListData.map(inner => {
                return {
                  ...inner,
                  workOrdUserName: inner.instPsnName,
                  workOrdUserTelNo: inner.instPsnTelNo,
                  userSeq: inner.userSeq
                };
              })
            },
            initialValue: service.getValue(selected, `${field.key}`, service.getValue(siteListData, '0.siteId', null))
          };
        }

        if (field.key === 'workOrdUserName') {
          return {
            ...field,
            initialValue: service.getValue(selected, `${field.key}`, service.getValue(siteListData, '0.instPsnName', null))
          };
        }

        if (field.key === 'workOrdUserTelNo') {
          return {
            ...field,
            initialValue: service.getValue(selected, `${field.key}`, service.getValue(siteListData, '0.instPsnTelNo', null))
          };
        }

        if (field.key === 'userSeq') {
          return {
            ...field,
            initialValue: service.getValue(selected, `${field.key}`, service.getValue(siteListData, '0.userSeq', null))
          };
        }

        if (field.key === 'smsCntn' || field.key === 'mailCntn') {
          return {
            ...field,
            initialValue: service.getValue(selected, `${field.key}`, service.getValue(noticeData, `0.${field.key}`, null))
          };
        }

        if (field.key === 'workOrdPublGubn') {
          const userLvlCd = service.getValue(user, 'userLvlCd', false);
          let publGubn = 'A';
          if (userLvlCd !== 'ACN001' && userLvlCd !== 'ACN002') {
            publGubn = 'B';
          }

          return {
            ...field,
            initialValue: publGubn
          };
        }

        return {
          ...field,
          initialValue: service.getValue(selected, `${field.key}`, service.getValue(field, 'initialValue', null))
        };
      });
    },
    [noticeList, noticeData, onChangeSite, onChangeWorkType, selected, siteListData, workOrdTypes]
  );

  const mergedFields = useMemo(() => getFields(fields), [fields, getFields]);

  return (
    <>
      {message ? <Alert message={message} type="info" style={{ marginBottom: 20 }} /> : null}
      {hasTags ? renderTagWrapper(checkedList) : null}
      {service.getValue(fields, 'length', false) ? (
        <CommonForm formLayout={{ labelCol: { span: 10 }, wrapperCol: { span: 14 } }} handler={props.handler} fields={mergedFields} labelAlign="left" onSubmit={events => props.onEvents({ ...events, type: props.type })} columns={props.type === 'publish' ? 2 : 1} />
      ) : null}
    </>
  );
}

export default Publish;
