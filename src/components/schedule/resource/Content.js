import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Modal, Button } from 'antd';
import moment from 'moment';

import { WithContentLayout } from '@/layouts';
import { CommonTable, ButtonWrap, ExcelButton } from '@/components/commons';
import { service, formats, Fetcher, locale } from '@/configs';
import { common } from '@/store/actions';

import { columns, values, api } from './configs';
import { Group } from './modal';

const lang = service.getValue(locale, 'languages', {});

const StyleWrapper = styled.div`
  padding: 20px 20px 0;
`;

function Content(props) {
  const { onFetchEvents, data } = props;
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [selected, setSelect] = useState({});

  // handler
  const [handler, setHandler] = useState(false);

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

  const onChangeTable = useCallback(
    (value, column) => {
      const key = service.getValue(column, 'dataIndex', null);
      if (key) {
        return onFetchEvents({ method: 'refetch', payload: { [key]: value === 'all' ? null : value } });
      }
      return null;
    },
    [onFetchEvents]
  );

  const onRemove = useCallback(() => {
    const rscGrpId = service.getValue(selected, 'rscGrpId', null);
    if (rscGrpId) {
      const obj = api.deleteGroup(rscGrpId);
      return Fetcher.post(obj.url, obj.params).then(result => {
        if (service.getValue(result, 'success', false)) {
          onCloseModal();
          onFetchEvents({ method: 'refetch' });
        }
      });
    }
    return null;
  }, [selected, onCloseModal, onFetchEvents]);

  const onClickFooter = useCallback(
    button => {
      switch (button.roll) {
        case 'cancel':
          return onCloseModal();
        case 'save':
          return setHandler(true);
        case 'remove':
          return Modal.confirm({
            title: service.getValue(lang, 'LANG00068', 'no-text'),
            content: service.getValue(lang, 'LANG00259', 'no-text'),
            onOk: () => onRemove()
          });
        default:
          return null;
      }
    },
    [onCloseModal, setHandler, onRemove]
  );

  const onModify = useCallback(
    payload => {
      const startDate = service.getValue(payload, 'date.0', null);
      const endDate = service.getValue(payload, 'date.1', null);

      if (startDate && endDate) {
        const params = {
          ...payload,
          trdbStrtDt: moment(startDate).format(formats.timeFormat.YEARMONTHDAY),
          trdbEndDt: moment(endDate).format(formats.timeFormat.YEARMONTHDAY)
        };
        delete params.date;
        const obj = api.modifyGroup(params);
        dispatch(common.loadingStatus(true));
        return Fetcher.post(obj.url, obj.params).then(({ success }) => {
          dispatch(common.loadingStatus(false));
          if (success) {
            onCloseModal();
            onFetchEvents({ method: 'refetch' });
          }
        });
      }
      return null;
    },
    [onCloseModal, onFetchEvents, dispatch]
  );

  const onCreate = useCallback(
    payload => {
      const startDate = service.getValue(payload, 'date.0', null);
      const endDate = service.getValue(payload, 'date.1', null);

      if (startDate && endDate) {
        const params = {
          ...payload,
          trdbStrtDt: moment(startDate).format(formats.timeFormat.YEARMONTHDAY),
          trdbEndDt: moment(endDate).format(formats.timeFormat.YEARMONTHDAY)
        };
        delete params.date;
        const obj = api.createGroup(params);
        dispatch(common.loadingStatus(true));
        return Fetcher.post(obj.url, obj.params).then(({ success }) => {
          dispatch(common.loadingStatus(false));
          if (success) {
            onCloseModal();
            onFetchEvents({ method: 'refetch' });
          }
        });
      }
      return null;
    },
    [onCloseModal, onFetchEvents, dispatch]
  );

  const onEvents = useCallback(
    events => {
      const { method, payload } = events;

      if (!method) {
        return null;
      }

      if (Object.keys(payload).length) {
        setHandler(false);

        if (method === 'submit') {
          if (service.getValue(selected, 'rscGrpId', false)) {
            return onModify(payload);
          }
          return onCreate(payload);
        }
      }

      return null;
    },
    [selected, setHandler, onCreate, onModify]
  );

  const getButtons = useCallback(() => {
    return values.buttons.map(button => {
      return {
        ...button,
        onClick: () => onOpenModal(button),
        type: 'primary',
        className: 'deep-grey',
        style: {
          height: 30,
          lineHeight: '28px',
          width: 80,
          fontSize: 14
        }
      };
    });
  }, [onOpenModal]);

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

  const getMergedColumns = useCallback(() => {
    return columns.mainColumns.map(column => {
      const { searchAble, selectAble, datepickAble } = column;

      if (searchAble) {
        searchAble.onSearch = value => onChangeTable(value, column);
      }

      if (selectAble) {
        selectAble.list = [];
        selectAble.onSelect = value => onChangeTable(value, column);
      }

      if (datepickAble) {
        datepickAble.forEach(el => {
          el.onChange = date => onChangeTable(date ? moment(date).format(formats.timeFormat.YEARMONTHDAY) : null, el);
        });
      }

      if (column.dataIndex === 'trdbDt') {
        column.render = (text, record) => {
          return (
            <span>
              {`${service.getValue(record, 'trdbStrtDt', false) ? moment(record.trdbStrtDt, formats.timeFormat.YEARMONTHDAY).format(formats.timeFormat.FULLDATEDOT) : null} ~ ${
                service.getValue(record, 'trdbEndDt', false) ? moment(record.trdbEndDt, formats.timeFormat.YEARMONTHDAY).format(formats.timeFormat.FULLDATEDOT) : null
              }`}
            </span>
          );
        };
      }
      if (column.dataIndex === 'rscStatCd') {
        column.render = text => {
          if (!text) {
            return null;
          }
          return text === 'I' ? 'Y' : 'N';
        };
        column.selectAble.list = [
          { key: 'all', value: 'all', label: 'ALL' },
          { key: 'I', value: 'I', label: 'Y' },
          { key: 'C', value: 'C', label: 'N' }
        ];
        column.selectAble.defaultValue = 'all';
      }

      if (column.dataIndex === 'action') {
        column.render = (text, record) => {
          return values.actionButtons
            .filter(button => button.roll === 'update')
            .map(button => {
              return (
                <Button {...button} onClick={() => onOpenModal({ ...record, ...button })}>
                  {button.label}
                </Button>
              );
            });
        };
      }

      return { ...column };
    });
  }, [onChangeTable, onOpenModal]);

  const buttons = useMemo(() => getButtons(), [getButtons]);
  const modal = useMemo(() => getModal(selected), [getModal, selected]);
  const mergedColumns = useMemo(() => getMergedColumns(), [getMergedColumns]);

  return (
    <StyleWrapper>
      <ButtonWrap
        left={buttons}
        right={[
          <span style={{ fontSize: 14 }}>
            {`${service.getValue(lang, 'LANG00172', 'no-text')}`}: {data.length}
          </span>,
          <ExcelButton href="/so/rscGrps/excel" />
        ]}
        style={{ paddingBottom: 20 }}
      />

      <CommonTable rowKey={(record, idx) => service.getValue(record, 'rscGrpId', idx)} columns={mergedColumns} dataSource={data} scroll={{ y: 'calc(100vh - 295px)' }} />

      <Modal
        forceRender
        destroyOnClose
        width="30%"
        centered
        visible={visible}
        maskClosable={false}
        title={service.getValue(modal, 'title', '')}
        onCancel={onCloseModal}
        footer={Object.keys(service.getValue(modal, 'footer', {})).length ? <ButtonWrap right={service.getValue(modal, 'footer.right', [])} left={service.getValue(modal, 'footer.left', [])} /> : null}
        style={{ maxWidth: 450 }}
      >
        <Group {...modal} handler={handler} onEvents={onEvents} item={service.getValue(selected, 'rscGrpId', false) ? selected : {}} />
      </Modal>
    </StyleWrapper>
  );
}

export default WithContentLayout(Content);
