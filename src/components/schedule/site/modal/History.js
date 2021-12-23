import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { Modal } from 'antd';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import moment from 'moment';

import { ButtonWrap, CommonForm, CommonTable } from '@/components/commons';
import { fetch, common } from '@/store/actions';
import { service, formats, Fetcher } from '@/configs';

import { api, values, columns } from '../configs';
import Update from './Update';

function History(props) {
  const {
    site,
    site: { siteId = null, userSeq },
    rscGrpList = []
  } = props;
  const dispatch = useDispatch();

  // modal
  const [visible, setVisible] = useState(false);
  const [selected, setSelect] = useState({});
  const [handler, setHandler] = useState(false);
  const [fetched, setFetched] = useState(true);

  const [params, setParams] = useState({});

  const { histories = [] } = useSelector(state => service.getValue(state.fetch, 'multipleList', {}), shallowEqual);

  useEffect(() => {
    const fetching = () => {
      if (!fetched) {
        return null;
      }
      // todo merge params
      const newParams = Object.keys(params)
        .filter(key => params[key])
        .reduce((result, key) => {
          result[key] = params[key];
          return result;
        }, {});
      const obj = api.getHistroies({ ...newParams, userSeq, siteId });
      dispatch(fetch.getMultipleList([{ id: 'histories', url: obj.url, params: obj.params }]));
      setFetched(false);
    };
    fetching();
    return () => {
      fetch.resetMultipleList();
    };
  }, [dispatch, siteId, userSeq, fetched, params]);

  const onOpenModal = useCallback(
    select => {
      setSelect(select);
      setVisible(true);
    },
    [setSelect, setVisible]
  );

  const onCloseModal = useCallback(() => {
    setSelect({});
    setVisible(false);
  }, [setSelect, setVisible]);

  const onClickFooter = useCallback(
    button => {
      switch (button.roll) {
        case 'cancel':
          return onCloseModal();
        case 'save':
          return setHandler(true);
        default:
          break;
      }

      return null;
    },
    [onCloseModal]
  );

  const onChangeTable = useCallback(
    (value, column) => {
      setParams(state => {
        return {
          ...state,
          [column.dataIndex]: value
        };
      });
      setFetched(true);
    },
    [setParams]
  );

  const onEvents = events => {
    const { method, payload } = events;

    if (!method) {
      return null;
    }

    if (Object.keys(payload).length) {
      setHandler(false);

      if (method === 'submit') {
        const obj = api.updateHistory({
          ...payload,
          siteId
        });
        dispatch(common.loadingStatus(true));
        return Fetcher.post(obj.url, obj.params).then(result => {
          dispatch(common.loadingStatus(false));
          if (service.getValue(result, 'success', false)) {
            setFetched(true);
            onCloseModal();
          }
        });
      }
    }
    return null;
  };

  const getButtons = useCallback(() => {
    return values.buttons.map(button => {
      return {
        ...button,
        onClick: () => onOpenModal(button)
      };
    });
  }, [onOpenModal]);

  const getFields = useCallback(
    fields => {
      return fields.map(field => {
        return {
          ...field,
          initialValue: service.getValue(site, `${field.key}`, '')
        };
      });
    },
    [site]
  );

  const getModal = useCallback(
    select => {
      const matched = values.modals.filter(modal => modal.key === select.roll).find(item => item);
      const footer = service.getValue(matched, 'footer', {});

      return {
        ...matched,
        footer: {
          ...Object.keys(footer).reduce((result, key) => {
            if (Array.isArray(footer[key])) {
              result[key] = values.actionButtons
                .filter(button => footer[key].includes(button.roll))
                .sort((a, b) => a.key - b.key)
                .map(button => {
                  return {
                    ...button,
                    onClick: () => onClickFooter(button)
                  };
                });
            }
            return result;
          }, {})
        }
      };
    },
    [onClickFooter]
  );

  const gerMergedColumns = useCallback(() => {
    return columns.historyColumns.map(column => {
      const { datepickAble, searchAble } = column;

      if (searchAble) {
        searchAble.onSearch = value => onChangeTable(value, column);
      }

      if (datepickAble) {
        datepickAble.forEach(el => {
          el.onChange = date => onChangeTable(date ? moment(date).format(formats.timeFormat.YEARMONTHDAY) : null, el);
        });
      }

      if (column.dataIndex === 'date') {
        column.render = (text, record) => {
          return (
            <span>
              {`${service.getValue(record, 'cnrtStrtDt', false) ? moment(record.cnrtStrtDt, formats.timeFormat.YEARMONTHDAY).format(formats.timeFormat.FULLDATE) : null} ~ ${
                service.getValue(record, 'cnrtEndDt', false) ? moment(record.cnrtEndDt, formats.timeFormat.YEARMONTHDAY).format(formats.timeFormat.FULLDATE) : null
              }`}
            </span>
          );
        };
      }
      if (column.dataIndex === 'rscGrpId') {
        column.render = text => {
          const matched = rscGrpList.filter(inner => inner.rscGrpId === text).find(inner => inner);
          return `${service.getValue(matched, 'rscGrpName', '')}`;
        };
      }
      return { ...column };
    });
  }, [onChangeTable, rscGrpList]);

  const buttons = useMemo(() => getButtons(), [getButtons]);
  const modal = useMemo(() => getModal(selected), [selected, getModal]);
  const mergedFields = useMemo(() => getFields(values.historyFields), [getFields]);
  const mergeColumns = useMemo(() => gerMergedColumns(), [gerMergedColumns]);

  return (
    <>
      <ButtonWrap right={buttons} style={{ marginBottom: 20, position: 'absolute', right: 20 }} />

      <CommonForm fields={mergedFields} labelAlign="left" formMode="read" style={{ width: '50%', marginBottom: 20 }} />

      <CommonTable rowKey={(record, idx) => idx} columns={mergeColumns} dataSource={histories} scroll={{ y: '500px' }} pagination={false} />

      <Modal
        forceRender
        destroyOnClose
        centered
        visible={visible}
        maskClosable={false}
        title={service.getValue(modal, 'title', '')}
        width="50%"
        onCancel={onCloseModal}
        footer={Object.keys(service.getValue(modal, 'footer', {})).length ? <ButtonWrap right={service.getValue(modal, 'footer.right', [])} /> : null}
      >
        <Update {...modal} handler={handler} onEvents={onEvents} site={site} />
      </Modal>
    </>
  );
}

export default History;
