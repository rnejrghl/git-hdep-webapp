import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Modal, Button, Alert } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { CommonTable, ButtonWrap, CommonForm } from '@/components/commons';
import { fetch } from '@/store/actions';
import { service, formats } from '@/configs';

import { values, columns, api } from '../configs';

function Work(props) {
  const { dataSource = [], selectedButton = {}, parentHandler = false, onEvents } = props;
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [handler, setHandler] = useState(false);
  const [selected, setSelect] = useState({});
  const [list, setList] = useState([]);
  const { noticeList = [] } = useSelector(state => service.getValue(state.fetch, 'multipleList', {}));

  useEffect(() => {
    const duplicate = sources => {
      const matched = noticeList.filter(inner => inner.workOrdTyp === service.getValue(selectedButton, 'props.workOrdTyp'));
      const newList = sources.map(inner => {
        const matchedItem = matched.length > 1 ? matched.filter(match => service.getValue(match, 'rescGubn', null) === service.getValue(inner, 'rescGubn'))?.[0] : service.getValue(matched, '0', {});
        return {
          ...inner,
          smsCntn: service.getValue(matchedItem, 'smsCntn', ''),
          mailCntn: service.getValue(matchedItem, 'mailCntn', ''),
          cmplReqDt: moment().add(3, 'd')
        };
      });
      setList(newList);
    };
    duplicate(dataSource);
  }, [dataSource, noticeList, selectedButton]);

  useEffect(() => {
    if (parentHandler) {
      onEvents({
        method: 'publish',
        payload: list.map(inner => {
          const cmplReqDt = service.getValue(inner, 'cmplReqDt', false) ? moment(service.getValue(inner, 'cmplReqDt')).format(formats.timeFormat.YEARMONTHDAY) : null;
          return {
            siteId: service.getValue(inner, 'siteId', null),
            publDtti: moment().format(formats.timeFormat.YEARMONTHDAY),
            workOrdTyp: service.getValue(selectedButton, 'props.workOrdTyp', null),
            workOrdUserName: service.getValue(inner, 'workOrdUserName', null),
            userSeq: service.getValue(inner, 'userSeq', null),
            cmplReqDt,
            smsCntn: service.getValue(inner, 'smsCntn', null),
            mailCntn: service.getValue(inner, 'mailCntn', null)
          };
        })
      });
    }
  }, [parentHandler, list, onEvents, selectedButton]);

  useEffect(() => {
    const fetching = () => {
      const obj = api.getNoticeList();
      dispatch(fetch.getMultipleList([{ id: 'noticeList', url: obj.url, params: obj.params }]));
    };
    fetching();
    return () => {};
  }, [dispatch]);

  const onRemove = useCallback(record => {
    setList(state => {
      return state.filter(inner => service.getValue(inner, 'siteId', null) !== service.getValue(record, 'siteId', null));
    });
  }, []);

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

  const onEventsCurrent = useCallback(
    events => {
      const { method, payload } = events;

      if (!method) {
        return null;
      }

      if (method === 'error') {
        setHandler(false);
        return null;
      }

      if (Object.keys(payload).length) {
        setHandler(false);
        setList(state => {
          return state.map(inner => {
            return {
              ...inner,
              ...Object.keys(payload).reduce((result, key) => {
                result[key] = payload[key];
                return result;
              }, {})
            };
          });
        });
        return onCloseModal();
      }
      return null;
    },
    [onCloseModal]
  );

  const onClickEvent = useCallback(
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
    [onCloseModal, setHandler]
  );

  const getButtons = useCallback(() => {
    return values.workButtons.map(button => {
      return {
        ...button,
        onClick: () => onOpenModal(button),
        className: 'grey',
        type: 'primary'
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
                    onClick: () => onClickEvent(button)
                  };
                });
            }
            return result;
          }, {})
        }
      };
    },
    [onClickEvent]
  );

  const getMergedColumns = useCallback(() => {
    return columns.modalColumns.map(column => {
      if (column.dataIndex === 'cmplReqDt') {
        column.render = text => {
          return moment(text).format(formats.timeFormat.FULLDATE);
        };
      }
      if (column.dataIndex === 'action') {
        column.render = (text, record) => {
          return values.actionButtons
            .filter(button => button.roll === 'remove')
            .map(button => {
              return (
                <Button key={button.type} size="small" type={button.type} onClick={() => onRemove(record)}>
                  {button.label}
                </Button>
              );
            });
        };
      }
      return { ...column };
    });
  }, [onRemove]);

  const buttons = useMemo(() => getButtons(), [getButtons]);
  const modal = useMemo(() => getModal(selected), [getModal, selected]);
  const mergedColumns = useMemo(() => getMergedColumns(), [getMergedColumns]);

  return (
    <div>
      <ButtonWrap left={buttons} style={{ paddingBottom: 20 }} />
      <CommonTable rowKey={(record, idx) => service.getValue(record, 'siteId', idx)} columns={mergedColumns} dataSource={list} scroll={{ x: '100%', y: 500 }} />

      <Modal visible={visible} centered title={service.getValue(modal, 'title', '')} destroyOnClose onCancel={onCloseModal} width={450} footer={<ButtonWrap right={service.getValue(modal, 'footer.right', [])} />}>
        <>
          <Alert message={service.getValue(modal, 'message', '')} type="info" style={{ marginBottom: 20 }} />
          <CommonForm fields={service.getValue(modal, 'fields', [])} labelAlign="left" columns={1} handler={handler} onSubmit={onEventsCurrent} />
        </>
      </Modal>
    </div>
  );
}

export default Work;
