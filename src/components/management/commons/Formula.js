import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Modal } from 'antd';
import { CommonTable, ButtonWrap, CommonForm } from '@/components/commons';

import { common } from '@/store/actions';
import { Fetcher, service, locale } from '@/configs';
import { values, api } from '../configs';

const lang = service.getValue(locale, 'languages', {});

function Formula(props) {
  const { columns = [], root, item, onEvents } = props;
  const dispatch = useDispatch();
  const [datasource, setDatasource] = useState([]);
  const [visible, setVisible] = useState(false);
  const [handler, setHandler] = useState(false);
  const [fetched, setFetched] = useState(true);

  useEffect(() => {
    const fetching = refetch => {
      if (!refetch) {
        return null;
      }
      let obj = {};

      switch (root) {
        case 'deviceAlram':
          const alrtCd = service.getValue(item, 'alrtCd', null);
          if (!alrtCd) {
            return null;
          }
          obj = api.getDeviceAlarmFormula({ alrtCd });
          break;
        case 'device':
        case 'gw':
          const dvceId = service.getValue(item, 'dvceId', null);
          if (!dvceId) {
            return null;
          }
          obj = api.getDeviceFormula({ dvceId });
          break;
        default:
          break;
      }
      if (Object.keys(obj).length) {
        dispatch(common.loadingStatus(true));
        return Fetcher.get(obj.url, obj.params).then(result => {
          dispatch(common.loadingStatus(false));
          if (service.getValue(result, 'success', false)) {
            const list = service.getValue(result, 'data', []);
            setDatasource(list);
            setFetched(false);
          }
          return null;
        });
      }
      return null;
    };
    fetching(fetched);
  }, [item, dispatch, fetched, setFetched, root, setDatasource]);

  const onRemove = useCallback(
    record => {
      switch (root) {
        case 'deviceAlram':
          const alrtCd = service.getValue(record, 'alrtCd', null);
          const calcSeqAlram = service.getValue(record, 'calcSeq', null);
          if (alrtCd && calcSeqAlram) {
            const objAlram = api.deleteDeviceFormula(alrtCd, calcSeqAlram);
            dispatch(common.loadingStatus(true));
            return Fetcher.post(objAlram.url, objAlram.params).then(result => {
              dispatch(common.loadingStatus(false));
              if (service.getValue(result, 'success', false)) {
                setFetched(true);
                return onEvents({ method: 'refetch' });
              }
              return null;
            });
          }
          return null;
        case 'device':
        case 'gw':
          const dvceId = service.getValue(record, 'dvceId', null);
          const calcSeq = service.getValue(record, 'calcSeq', null);
          if (dvceId && calcSeq) {
            const obj = api.deleteDeviceFormula(dvceId, calcSeq);
            dispatch(common.loadingStatus(true));
            return Fetcher.post(obj.url, obj.params).then(result => {
              dispatch(common.loadingStatus(false));
              if (service.getValue(result, 'success', false)) {
                setFetched(true);
                return onEvents({ method: 'refetch' });
              }
              return null;
            });
          }
          return null;
        default:
          return null;
      }
    },
    [setFetched, dispatch, onEvents, root]
  );

  const onEventCurrent = useCallback(
    events => {
      const { method, payload } = events;

      if (!method) {
        return null;
      }

      if (Object.keys(payload).length) {
        setHandler(false);
        if (method === 'submit') {
          switch (root) {
            case 'deviceAlram':
              const alrtCd = service.getValue(item, 'alrtCd', null);
              if (!alrtCd) {
                return null;
              }
              const paramsAlram = [{ ...payload, alrtCd }];
              const objAlram = api.createDeviceAlarmFormula(paramsAlram);
              return Fetcher.post(objAlram.url, objAlram.params).then(result => {
                if (service.getValue(result, 'success', false)) {
                  setVisible(false);
                  setFetched(true);
                  return onEvents({ method: 'refetch' });
                }
              });
            case 'device':
            case 'gw':
              const dvceId = service.getValue(item, 'dvceId', null);
              if (!dvceId) {
                return null;
              }
              const params = [{ ...payload, dvceId }];
              const obj = api.createDeviceFormula(params);
              return Fetcher.post(obj.url, obj.params).then(result => {
                if (service.getValue(result, 'success', false)) {
                  setVisible(false);
                  setFetched(true);
                  return onEvents({ method: 'refetch' });
                }
              });
            default:
              return null;
          }
        }
      }
      return null;
    },
    [setHandler, item, setFetched, setVisible, onEvents, root]
  );

  const getButtons = useCallback(() => {
    return values.actionButtons
      .filter(button => button.roll === 'add')
      .map(button => {
        return {
          ...button,
          onClick: () => setVisible(true),
          style: {
            height: 30,
            width: 80
          }
        };
      });
  }, [setVisible]);

  const getMergedColumns = useCallback(
    columnList => {
      return columnList.map(column => {
        if (column.dataIndex === 'action') {
          column.render = (text, record) => {
            return (
              <Button type="danger" size="small" style={{ padding: '0 10px', fontSize: '0.875em' }} onClick={() => onRemove(record)}>
                삭제
              </Button>
            );
          };
        }
        return column;
      });
    },
    [onRemove]
  );

  const getFooterButtons = useCallback(() => {
    return values.actionButtons
      .filter(button => button.roll === 'save' || button.roll === 'cancel')
      .sort((a, b) => a.key - b.key)
      .map(button => {
        if (button.roll === 'save') {
          return {
            ...button,
            onClick: () => setHandler(true)
          };
        }
        if (button.roll === 'cancel') {
          return {
            ...button,
            onClick: () => setVisible(false)
          };
        }
        return button;
      });
  }, [setHandler, setVisible]);

  const getMergedFields = useCallback(fields => {
    // column을 fields로 변환
    return fields
      .filter(field => field.dataIndex !== 'action')
      .map(field => {
        return {
          label: field.title,
          key: field.dataIndex,
          type: 'input'
        };
      });
  }, []);

  const buttons = useMemo(() => getButtons(), [getButtons]);
  const mergedColumns = useMemo(() => getMergedColumns(columns), [columns, getMergedColumns]);
  const footerButtons = useMemo(() => getFooterButtons(), [getFooterButtons]);
  const mergedFields = useMemo(() => getMergedFields(columns), [columns, getMergedFields]);

  return (
    <>
      <ButtonWrap left={buttons} style={{ marginBottom: 20 }} />

      <CommonTable rowKey={(row, idx) => service.getValue(row, `${props.rowKey}`, idx)} columns={mergedColumns} dataSource={datasource} scroll={{ x: '100%' }} />

      <Modal centered forceRender destroyOnClose width="30%" maskClosable={false} visible={visible} title={`${service.getValue(lang, 'LANG00147', 'no-text')} ${service.getValue(lang, 'LANG00056', 'no-text')}`} footer={<ButtonWrap right={footerButtons} />} onCancel={() => setVisible(false)}>
        <CommonForm handler={handler} fields={mergedFields} onSubmit={onEventCurrent} labelAlign="left" />
      </Modal>
    </>
  );
}

export default Formula;
