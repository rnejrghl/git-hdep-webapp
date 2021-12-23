import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import styled from 'styled-components';
import { Button, Modal, Checkbox, Row, Col, Pagination } from 'antd';

import moment from 'moment';

import { common } from '@/store/actions';
import { WithContentLayout } from '@/layouts';
import { ExcelButton, CommonTable, ButtonWrap } from '@/components/commons';
import { service, formats, Fetcher, locale } from '@/configs';

import { columns, values, api } from './configs';
import { Item, Publish, Reject } from './modal';
import Summary from './Summary';

const lang = service.getValue(locale, 'languages', {});

const StyleWrapper = styled.div`
  padding: 20px 20px 0;
`;

function Content(props) {
  const { onFetchEvents, data } = props;
  const { workOrderList = [], workOrderCnt = [], workOrderPage = {} } = data;
  const dispatch = useDispatch();

  // table data state
  const [itemMode, setItemMode] = useState('read');

  // table checkbox
  const [checkedList, setCheckedList] = useState([]);

  // modal state
  const [visible, setVisible] = useState(false);
  const [selected, setSelect] = useState({});

  // handler
  const [handler, setHandler] = useState(false);
  const { user = {} } = useSelector(state => service.getValue(state, 'auth', {}));
  const commonConfig = useSelector(state => {
    return state
      ? {
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
        }
      : null;
  }, shallowEqual);

  // modal
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

  const onCheckAllChange = useCallback(
    e => {
      if (e.target.checked) {
        setCheckedList(workOrderList.map(item => item.workOrdId));
      } else {
        setCheckedList([]);
      }
    },
    [workOrderList, setCheckedList]
  );

  const onCheckChange = useCallback(
    selectedRowKeys => {
      setCheckedList([...selectedRowKeys]);
    },
    [setCheckedList]
  );

  const onChangeTable = useCallback(
    (value, column) => {
      const key = column ? service.getValue(column, 'dataIndex', null) : 'page';
      if (key) {
        const payload = { [key]: value === 'all' ? null : value };
        if (column) {
          payload['page'] = 1;
        }
        return onFetchEvents({ method: 'refetch', payload: payload });
      }
      return null;
    },
    [onFetchEvents]
  );

  const onNoticeSend = useCallback(() => {
    const obj = api.postNoticeSend();
    return Fetcher.get(obj.url, obj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        onCloseModal();
      }
      return null;
    });
  }, [onCloseModal]);

  const onRemove = useCallback(() => {
    const siteId = service.getValue(selected, 'siteId', null);
    if (!siteId) {
      return null;
    }
    const params = {
      siteId,
      workOrdId: service.getValue(selected, 'workOrdId', null),
      userSeq: service.getValue(selected, 'workOrdUserSeq', null)
    };
    if (Object.keys(params).some(key => !params[key])) {
      return null;
    }
    const obj = api.deleteWorkOrder(params);
    dispatch(common.loadingStatus(true));

    return Fetcher.post(obj.url, obj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        dispatch(common.loadingStatus(false));
        onCloseModal();
        return onFetchEvents({ method: 'refetch' });
      }
      return null;
    });
  }, [selected, dispatch, onFetchEvents, onCloseModal]);

  const onComplete = useCallback(() => {
    const siteId = service.getValue(selected, 'siteId', null);
    if (!siteId) {
      return null;
    }
    const params = {
      siteId,
      workOrdId: service.getValue(selected, 'workOrdId', null),
      userSeq: service.getValue(selected, 'workOrdUserSeq', null)
    };
    if (Object.keys(params).some(key => !params[key])) {
      return null;
    }
    const obj = api.completeWorkOrder(params);
    return Fetcher.post(obj.url, obj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        onCloseModal();
        setItemMode('read');
        return onFetchEvents({ method: 'refetch' });
      }
      return null;
    });
  }, [setItemMode, selected, onFetchEvents, onCloseModal]);

  const onCheckDate = useCallback(
    payload => {
      const siteId = service.getValue(selected, 'siteId', null);
      if (!siteId) {
        return null;
      }
      const params = {
        siteId,
        workOrdId: service.getValue(selected, 'workOrdId', null),
        userSeq: service.getValue(selected, 'workOrdUserSeq', null),
        cnfmDt: moment(payload.cnfmDt).format(formats.timeFormat.YEARMONTHDAY)
      };

      if (Object.keys(params).some(key => !params[key])) {
        return null;
      }
      const obj = api.checkWorkOrder(params);
      return Fetcher.post(obj.url, obj.params).then(result => {
        if (service.getValue(result, 'success', false)) {
          onCloseModal();
          setItemMode('read');
          return onFetchEvents({ method: 'refetch' });
        }
        return null;
      });
    },
    [setItemMode, selected, onFetchEvents, onCloseModal]
  );

  const onRejectApproval = useCallback(
    payload => {
      const siteId = service.getValue(selected, 'siteId', null);
      if (!siteId) {
        return null;
      }

      const params = {
        siteId,
        workOrdId: service.getValue(selected, 'workOrdId', null),
        userSeq: service.getValue(selected, 'workOrdUserSeq', null),
        qaCmplDt: service.getValue(payload, 'qaCmplDt', null),
        qaNote: service.getValue(payload, 'qaNote', null)
      };

      const obj = api.rejectWorkOrder(params);
      return Fetcher.post(obj.url, obj.params).then(result => {
        if (service.getValue(result, 'success', false)) {
          onCloseModal();
          setItemMode('read');
          return onFetchEvents({ method: 'refetch' });
        }
        return null;
      });
    },
    [setItemMode, selected, onFetchEvents, onCloseModal]
  );

  const onClickFooter = useCallback(
    button => {
      switch (button.roll) {
        case 'confirm':
          return onNoticeSend();
        case 'cancel':
          if (itemMode !== 'read') {
            setItemMode('read');
          }
          return onCloseModal();
        case 'save':
          return setHandler(true);
        case 'check':
          return setHandler(true);
        case 'approval':
          return setHandler(true);
        case 'update':
          return setItemMode('create');
        case 'remove':
          return onRemove();
        case 'complete':
          return onComplete();
        case 'reject':
          return onOpenModal({ ...selected, roll: 'reject' });
        default:
          break;
      }
      return null;
    },
    [onCloseModal, setHandler, setItemMode, itemMode, onRemove, onComplete, onNoticeSend]
  );

  const onUpdateEndDate = useCallback(
    payload => {
      const params = {
        cmplReqDt: moment(payload.cmplReqDt).format(formats.timeFormat.YEARMONTHDAY),
        mthWkodListUpdate: workOrderList
          .filter(inner => service.getValue(inner, 'workOrdStat', null) === 'WS0001')
          .filter(inner => checkedList.includes(inner.workOrdId))
          .map(inner => {
            return {
              siteId: inner.siteId,
              workOrdId: inner.workOrdId,
              userSeq: inner.siteUserSeq
            };
          })
      };

      const obj = api.updateEndDateList(params);
      return Fetcher.post(obj.url, obj.params).then(result => {
        if (service.getValue(result, 'success', false)) {
          onCloseModal();
          onFetchEvents({ method: 'refetch' });
        }
        return null;
      });
    },
    [workOrderList, checkedList, onCloseModal, onFetchEvents]
  );

  const onCreateWorkOrder = payload => {
    const params = {
      ...Object.keys(payload)
        .filter(key => !!payload[key])
        .reduce((result, key) => {
          result[key] = payload[key];
          return result;
        }, {})
    };

    const obj = api.createWorkOrder(params);
    return Fetcher.post(obj.url, obj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        onCloseModal();
        onFetchEvents({ method: 'refetch' });
      }
    });
  };

  const onClickButton = useCallback(
    button => {
      if (button.roll) {
        if (button.roll === 'modify' && !checkedList.length) {
          return Modal.error({
            title: service.getValue(lang, 'LANG00296', 'no-text'),
            content: service.getValue(lang, 'LANG00298', 'no-text')
          });
        }
        return onOpenModal(button);
      }
      return null;
    },
    [onOpenModal, checkedList]
  );

  const onCreateResult = (payload, workOrder) => {
    const params = {
      siteId: service.getValue(workOrder, 'siteId', null),
      workOrdId: service.getValue(workOrder, 'workOrdId', null),
      userSeq: service.getValue(workOrder, 'workOrdUserSeq', null),
      cmplPredDt: service.getValue(payload, 'cmplPredDt', false) ? moment(payload.cmplPredDt, formats.timeFormat.YEARMONTHDAY).format(formats.timeFormat.YEARMONTHDAY) : null,
      cnfmDt: service.getValue(payload, 'cnfmDt', false) ? moment(payload.cnfmDt, formats.timeFormat.YEARMONTHDAY).format(formats.timeFormat.YEARMONTHDAY) : null,
      fileId: service.getValue(payload, 'fileId', []).map(inner => inner.fileId),
      note: service.getValue(payload, 'note', '')
    };
    const obj = api.createWorkOrderResult(params);
    return Fetcher.post(obj.url, obj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        onCloseModal();
        onFetchEvents({ method: 'refetch' });
      }
    });
  };

  const onUpdateResult = (payload, workOrder) => {
    const workOrdId = service.getValue(workOrder, 'workOrdId', null);
    const cmplPredDt = service.getValue(payload, `${workOrdId}.cmplPredDt`, false);
    const cnfmDt = service.getValue(payload, `${workOrdId}.cnfmDt`, false);
    const params = {
      siteId: service.getValue(workOrder, 'siteId', null),
      workOrdId: workOrdId,
      userSeq: service.getValue(workOrder, 'workOrdUserSeq', null),
      cmplPredDt: cmplPredDt ? moment(cmplPredDt, formats.timeFormat.YEARMONTHDAY).format(formats.timeFormat.YEARMONTHDAY) : null,
      cnfmDt: cnfmDt ? moment(cnfmDt, formats.timeFormat.YEARMONTHDAY).format(formats.timeFormat.YEARMONTHDAY) : null,
      fileId: service.getValue(payload, `${workOrdId}.fileId`, []).map(inner => inner.fileId),
      note: service.getValue(payload, `${workOrdId}.note`, '')
    };
    const obj = api.updateWorkOrderResult(params);
    return Fetcher.post(obj.url, obj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        onCloseModal();
        setItemMode('read');
        onFetchEvents({ method: 'refetch' });
      }
    });
  };

  const onEvents = events => {
    const { method, type = null, payload, register = false, workOrder = {} } = events;
    if (!method) {
      return null;
    }
    if (Object.keys(payload).length) {
      setHandler(false);

      if (type === 'modify') {
        return onUpdateEndDate(payload);
      }
      if (type === 'publish') {
        return onCreateWorkOrder(payload);
      }
      if (type === 'result') {
        if (register) {
          return onCreateResult(payload, workOrder);
        }
      }
      if (type === 'view') {
        if (!register) {
          return onUpdateResult(payload, workOrder);
        }
      }

      if (type === 'cnfmDt') {
        return onCheckDate(payload);
      }

      if (type === 'reject') {
        return onRejectApproval(payload);
      }
    }
    return null;
  };

  const getModal = useCallback(
    select => {
      const matched = values.modals.filter(modal => modal.key === select.roll).find(item => item);

      let message = service.getValue(matched, 'message', '');
      if (select.roll === 'modify') {
        const unChange = workOrderList
          .filter(inner => checkedList.includes(inner.workOrdId))
          .filter(inner => service.getValue(inner, 'workOrdStat', null) !== 'WS0001')
          .map(inner => {
            return inner.workOrdId;
          });

        if (unChange.length > 0) {
          message = (
            <Row>
              <Col>{message}</Col>
              <Col style={{ color: 'red' }}>{service.getValue(lang, 'LANG00358', '')}</Col>
              <Col style={{ color: 'red' }}>{unChange.join(' , ')}</Col>
            </Row>
          );
        }
      }

      let footer =
        service.getValue(select, 'workOrdStat', null) === 'WS0004'
          ? {}
          : select.roll === 'view'
          ? itemMode === 'create' // && service.getValue(select, 'workOrdStat', null) === 'WS0003'
            ? service.getValue(matched, 'create', {})
            : service.getValue(matched, 'footer', {})
          : service.getValue(matched, 'footer', {});

      const userLvlCd = service.getValue(user, 'userLvlCd', null);
      if (select.roll === 'view') {
        const rightBtn = userLvlCd !== 'ACN001' && userLvlCd !== 'ACN002' ? service.getValue(footer, 'right', []).filter(item => item !== 'complete') : service.getValue(footer, 'right', []);

        footer = {
          left: service.getValue(footer, 'left', []),
          right: service.getValue(select, 'workOrdStat', null) !== 'WS0003' ? rightBtn.filter(item => item !== 'reject') : rightBtn
        };
      }

      const orderTypeMatched = service
        .getValue(commonConfig, 'workOrdTypes', [])
        .filter(inner => inner.cd === service.getValue(select, 'workOrdTyp', null))
        .find(inner => inner);

      const title =
        select.roll === 'view'
          ? `${service.getValue(orderTypeMatched, 'cdName', '')} W/O ${itemMode === 'read' ? service.getValue(lang, 'LANG00057', 'no-text') : service.getValue(lang, 'LANG00208', 'no-text')}`
          : select.roll === 'result'
          ? `${service.getValue(matched, 'title', '')}(${service.getValue(orderTypeMatched, 'cdName', '')})`
          : service.getValue(matched, 'title', '');

      return {
        ...matched,
        title,
        message: message,
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
    [onClickFooter, itemMode, commonConfig, workOrderList, checkedList]
  );

  const getButtons = useCallback(() => {
    return values.buttons.map(button => {
      return {
        ...button,
        onClick: () => onClickButton(button),
        className: 'grey',
        type: 'primary'
      };
    });
  }, [onClickButton]);

  const getSummaries = useCallback(dataSource => {
    return service.getValue(dataSource, '0', {});
  }, []);

  const getMergedColumns = useCallback(() => {
    return columns.mainColumns.map(column => {
      const { searchAble, selectAble, datepickAble } = column;
      if (searchAble) {
        searchAble.onSearch = value => onChangeTable(value, column);
      }
      if (selectAble) {
        selectAble.onSelect = value => onChangeTable(value, column);
      }
      if (datepickAble) {
        datepickAble.forEach(el => {
          el.onChange = date => onChangeTable(date ? moment(date).format(formats.timeFormat.YEARMONTHDAY) : null, el);
        });
      }

      if (column.dataIndex === 'publDtti') {
        column.render = text => {
          const date = new Date(text);
          //const offset = date.getTimezoneOffset() * 60000;
          //const output = date.getTime() + offset;
          return <span>{moment(date).format(formats.timeFormat.FULLDATETIME)}</span>;
        };
      }

      if (column.dataIndex === 'workOrdTyp') {
        column.render = text => {
          const matched = service
            .getValue(commonConfig, 'workOrdTypes', [])
            .filter(code => code.cd === text)
            .find(item => item);
          return <span>{service.getValue(matched, 'cdName', null)}</span>;
        };
        column.selectAble.list = [
          { key: 'all', value: 'all', label: 'ALL' },
          ...service.getValue(commonConfig, 'workOrdTypes', []).map(inner => {
            return {
              key: inner.cd,
              value: inner.cd,
              label: inner.cdName
            };
          })
        ];
        column.selectAble.defaultValue = 'all';
      }

      if (column.dataIndex === 'workOrdStat') {
        column.render = text => {
          const matched = service
            .getValue(commonConfig, 'workOrdStatus', [])
            .filter(code => code.cd === text)
            .find(item => item);
          return <span>{service.getValue(matched, 'cdName', null)}</span>;
        };
        column.selectAble.list = [
          { key: 'all', value: 'all', label: 'ALL' },
          ...service.getValue(commonConfig, 'workOrdStatus', []).map(inner => {
            return {
              key: inner.cd,
              value: inner.cd,
              label: inner.cdName
            };
          })
        ];
        column.selectAble.defaultValue = 'all';
      }

      if (column.dataIndex === 'cmplPredDt' || column.dataIndex === 'prcsCmplDt' || column.dataIndex === 'cmplReqDt') {
        column.render = text => (text ? moment(text, formats.timeFormat.YEARMONTHDAY).format(formats.timeFormat.FULLDATE) : null);
      }

      if (column.dataIndex === 'cnfmDt') {
        column.render = (text, record) =>
          text
            ? moment(text, formats.timeFormat.YEARMONTHDAY).format(formats.timeFormat.FULLDATE)
            : values.actionButtons
                .filter(button => button.roll === 'result')
                .map(button => {
                  return (
                    <Button
                      onClick={e => {
                        e.stopPropagation();
                        console.log({ ...record, roll: 'cnfmDt' });
                        return onOpenModal({ ...record, roll: 'cnfmDt' });
                      }}
                      {...button}
                    >
                      {button.label}
                    </Button>
                  );
                });
      }

      if (column.dataIndex === 'rsltRegYn') {
        column.render = (text, record) => {
          return text === 'N'
            ? values.actionButtons
                .filter(button => button.roll === 'result')
                .map(button => {
                  return (
                    <Button
                      onClick={e => {
                        e.stopPropagation();
                        return onOpenModal({ ...record, roll: 'result' });
                      }}
                      {...button}
                    >
                      {button.label}
                    </Button>
                  );
                })
            : null;
        };
      }
      return { ...column };
    });
  }, [onChangeTable, onOpenModal, commonConfig]);

  const buttons = useMemo(() => getButtons(), [getButtons]);
  const modal = useMemo(() => getModal(selected), [selected, getModal]);
  const summaries = useMemo(() => getSummaries(workOrderCnt), [workOrderCnt, getSummaries]);
  const mergedColumns = useMemo(() => getMergedColumns(), [getMergedColumns]);
  const hasItemModal = selected.roll === 'view' || selected.roll === 'result';

  return (
    <StyleWrapper>
      <Summary dataSource={summaries} />

      <ButtonWrap
        left={buttons}
        right={[
          <span style={{ fontSize: 14 }}>
            {`${service.getValue(lang, 'LANG00172', 'no-text')}`}: {service.getValue(workOrderPage, 'totalCnt', 0)}
          </span>,
          <ExcelButton href={`/wo/workOrders/excel?user=${service.getValue(user, 'userId')}`} />
        ]}
        style={{ padding: '20px 0' }}
      />

      <CommonTable
        rowKey={(record, idx) => service.getValue(record, 'workOrdId', idx)}
        columns={mergedColumns}
        dataSource={workOrderList}
        rowSelection={{
          columnTitle: (
            <span>
              <div>
                <Checkbox onChange={onCheckAllChange} />
              </div>
            </span>
          ),
          selectedRowKeys: checkedList,
          onChange: onCheckChange
        }}
        onRow={record => {
          return {
            onClick: e => {
              if (e.target.type !== 'checkbox') {
                onOpenModal({ ...record, roll: 'view' });
              }
            },
            style: {
              cursor: 'pointer'
            }
          };
        }}
        scroll={{ y: 'calc(100vh - 444px)' }}
      />

      <Pagination total={service.getValue(workOrderPage, 'totalCnt', 0)} current={service.getValue(workOrderPage, 'page', 1)} pagePer={10} onChange={event => onChangeTable(event)} style={{ margin: '20px 0px' }} />

      <Modal
        forceRender
        destroyOnClose
        centered
        visible={visible}
        maskClosable={false}
        className={hasItemModal ? 'work-order-modal-padding' : null}
        title={service.getValue(modal, 'title', '')}
        width={hasItemModal ? '50%' : '40%'}
        onCancel={onCloseModal}
        wrapClassName={hasItemModal ? 'ant-modal-bg' : ''}
        bodyStyle={{
          padding: hasItemModal ? 0 : 20
        }}
        footer={Object.keys(service.getValue(modal, 'footer', {})).length ? <ButtonWrap right={service.getValue(modal, 'footer.right', [])} left={service.getValue(modal, 'footer.left', [])} /> : <ButtonWrap />}
      >
        {hasItemModal ? <Item {...modal} itemMode={itemMode} type={modal.key} selected={selected} handler={handler} onEvents={onEvents} /> : <Publish {...modal} selected={selected} type={modal.key} handler={handler} onEvents={onEvents} checkedList={checkedList} />}
      </Modal>
    </StyleWrapper>
  );
}

export default WithContentLayout(Content);
