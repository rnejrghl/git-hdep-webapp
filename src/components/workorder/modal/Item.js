import React, { useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import moment from 'moment';

import { fetch } from '@/store/actions';
import { CommonForm } from '@/components/commons';
import { service, formats } from '@/configs';

import { api, values } from '../configs';

function Item(props) {
  const dispatch = useDispatch();
  const { selected, type } = props;
  const { wkodHdtlData = [], wkodFileData = [], workOrderData = {} } = useSelector(state => service.getValue(state.fetch, 'item', {}), shallowEqual);
  const commonConfig = useSelector(state => {
    return {
      workOrdTypes: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00009')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner),
      workOrdStatus: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00010')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner)
    };
  }, shallowEqual);

  useEffect(() => {
    const fetching = () => {
      const { siteId, workOrdId, workOrdUserSeq } = selected;
      if (siteId && workOrdId && workOrdUserSeq) {
        const obj = api.getWorkOrderDetail({ siteId, workOrdId, workOrdUserSeq });
        dispatch(fetch.getItem(obj.url, obj.params));
      }
      return null;
    };
    fetching();
    return () => {
      dispatch(fetch.resetItem());
    };
  }, [selected, dispatch]);

  const getFields = useCallback(
    fields => {
      return fields.map(field => {
        if (field.key === 'publDtti') {
          const date = new Date(service.getValue(workOrderData, `${field.key}`, null));
          //const offset = date.getTimezoneOffset() * 60000;
          //const output = date.getTime() + offset;
          return {
            ...field,
            initialValue: service.getValue(workOrderData, `${field.key}`, false) ? moment(date).format(formats.timeFormat.FULLDATE) : null
          };
        }
        if (field.key === 'workOrdTyp') {
          const matched = service
            .getValue(commonConfig, 'workOrdTypes', [])
            .filter(inner => inner.cd === service.getValue(workOrderData, `${field.key}`, null))
            .find(inner => inner);
          return {
            ...field,
            initialValue: service.getValue(matched, 'cdName', null)
          };
        }
        if (field.key === 'workOrdStat') {
          const matched = service
            .getValue(commonConfig, 'workOrdStatus', [])
            .filter(inner => inner.cd === service.getValue(workOrderData, `${field.key}`, null))
            .find(inner => inner);
          return {
            ...field,
            initialValue: service.getValue(matched, 'cdName', null)
          };
        }
        if (field.key === 'cmplReqDt') {
          return {
            ...field,
            initialValue: service.getValue(workOrderData, `${field.key}`, false) ? moment(service.getValue(workOrderData, `${field.key}`), formats.timeFormat.YEARMONTHDAY).format(formats.timeFormat.FULLDATE) : null
          };
        }
        return {
          ...field,
          initialValue: service.getValue(workOrderData, `${field.key}`, null)
        };
      });
    },
    [workOrderData, commonConfig]
  );

  const getResultFields = useCallback(
    (fields, idx) => {
      if (type !== 'result' && !wkodHdtlData.length) {
        return [];
      }

      if (service.getValue(workOrderData, 'workOrdStat', null) !== 'WS0003' && service.getValue(workOrderData, 'workOrdStat', null) !== 'WS0002') {
        fields = fields.filter(field => field.key !== 'qaNote' && field.key !== 'qaCmplDt');
      }
      return fields.map(field => {
        const key = wkodHdtlData.length ? `${idx}.${field.key}` : `${field.key}`;

        if (field.key === 'cnfmDt' || field.key === 'cmplPredDt') {
          const date = service.getValue(wkodHdtlData, `${key}`, service.getValue(workOrderData, `${field.key}`, null));
          return {
            ...field,
            initialValue: date ? moment(date, formats.timeFormat.YEARMONTHDAY) : null
          };
        }

        if (field.key === 'qaCmplDt') {
          const date = service.getValue(workOrderData, `${key}`, service.getValue(workOrderData, `${field.key}`, null));
          return {
            ...field,
            initialValue: date ? moment(date, formats.timeFormat.YEARMONTHDAY) : null
          };
        }

        if (field.key === 'qaNote') {
          return {
            ...field,
            initialValue: service.getValue(workOrderData, `${key}`, service.getValue(workOrderData, `${field.key}`, null))
          };
        }

        if (field.key === 'fileId') {
          const notNullable = wkodFileData.filter(inner => service.getValue(inner, 'fileSeq', false));

          return {
            ...field,
            initialValue: notNullable.length
              ? notNullable.map(item => {
                  return {
                    ...item,
                    uid: service.getValue(item, 'fileSeq', null),
                    url: service.getValue(item, 'filePath', null),
                    name: service.getValue(item, 'realFileName', null),
                    status: 'done'
                  };
                })
              : []
          };
        }

        return {
          ...field,
          initialValue: service.getValue(wkodHdtlData, `${key}`, null)
        };
      });
    },
    [workOrderData, wkodHdtlData, type, wkodFileData]
  );

  const mergedFields = useMemo(() => getFields(values.defaultFields), [getFields]);
  const resultMergedFields = useMemo(() => getResultFields(values.resultFields), [getResultFields]);

  return (
    <div className="workorder-item">
      <CommonForm formLayout={{ labelCol: { span: 9 }, wrapperCol: { span: 14, push: 1 } }} fields={mergedFields} labelAlign="left" formMode="read" columns={2} />

      {type === 'result' && !wkodHdtlData.length ? (
        <CommonForm formLayout={{ labelCol: { span: 9 }, wrapperCol: { span: 14, push: 1 } }} handler={props.handler} fields={resultMergedFields} labelAlign="left" onSubmit={events => props.onEvents({ ...events, workOrder: workOrderData, type: props.type, register: true })} columns={2} />
      ) : null}

      {type === 'view' && wkodHdtlData.length
        ? wkodHdtlData.map((result, idx) => {
            return (
              <CommonForm
                key={result.workOrdId}
                formLayout={{ labelCol: { span: 9 }, wrapperCol: { span: 14, push: 1 } }}
                handler={props.handler}
                fields={getResultFields(values.resultFields, idx)}
                labelAlign="left"
                formMode={props.itemMode}
                formName={`${result.workOrdId}`}
                onSubmit={events => props.onEvents({ ...events, workOrder: workOrderData, type: props.type, register: false })}
                columns={2}
              />
            );
          })
        : null}
    </div>
  );
}

export default Item;
