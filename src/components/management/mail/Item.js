import React, { useMemo, useCallback, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Alert, Descriptions, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { CommonTable, ButtonWrap } from '@/components/commons';
import ModalItem from './ModalItem';
import { common } from '@/store/actions';
import { service, Fetcher, locale } from '@/configs';
import { columns, values, api } from '../configs';

const lang = service.getValue(locale, 'languages', {});

function Item(props) {
  const { data = [], message, onFetchEvents } = props;
  const history = useHistory();
  const { id, mode } = useParams();
  const [visible, setVisible] = useState(false);
  const [selected, setSelect] = useState({});
  const [handler, setHandler] = useState(false);
  const dispatch = useDispatch();

  const getMergedColumns = useCallback(() => {
    return columns.noticeColumns.map(column => {
      if (column.dataIndex === 'email') {
        column.render = (text, record) => {
          return (
            <Descriptions column={1} bordered size="small" colon={false}>
              {values.pages.mail.item.emailFields.map(item => {
                return (
                  <Descriptions.Item key={item.key} label={item.label}>
                    {service.getValue(record, `${item.dataIndex}`, '')}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          );
        };
      }
      return column;
    });
  }, []);

  const onOpenModal = useCallback(
    select => {
      setSelect(select);
      setVisible(true);
      const notiNum = data ? 'notice' + ('00' + (parseInt(data[data.length - 1].notiId.slice(-3)) + 1)).slice(-3) : 0;
      return history.push(`${history.location.pathname}/${service.getValue(select, 'notiId', notiNum)}/${service.getValue(select, 'mode', 'create')}`);
    },
    [setSelect, setVisible, history, data]
  );

  const onCloseModal = useCallback(() => {
    setSelect({});
    setVisible(false);
    if (id || mode) {
      return history.push(`/management/mail`);
    }
  }, [setSelect, setVisible, id, mode, history]);

  const onRemove = useCallback(() => {
    if (!id) {
      return Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: 'NotiID를 선택하세요.'
      });
    }
    const obj = api.deleteNoti(id);
    dispatch(common.loadingStatus(true));
    return Fetcher.post(obj.url, obj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        onCloseModal();
        return onFetchEvents({ method: 'refetch' });
      }
    });
  }, [onCloseModal, onFetchEvents, selected]);

  const onUpdate = useCallback(
    (payload = {}) => {
      const params = Object.keys(payload).reduce((result, key) => {
        result = {
          ...result,
          ...Object.keys(payload[key]).reduce((innerResult, innerKey) => {
            innerResult[innerKey] = service.getValue(payload, `${key}.${innerKey}`, null);
            return innerResult;
          }, {})
        };
        return result;
      }, {});

      const obj = api.updateNoti(params);
      dispatch(common.loadingStatus(true));
      return Fetcher.post(obj.url, obj.params).then(result => {
        if (service.getValue(result, 'success', false)) {
          onCloseModal();
          return onFetchEvents({ method: 'refetch' });
        }
      });
    },
    [onCloseModal, onFetchEvents, selected]
  );

  const onCreate = useCallback(
    (payload = {}) => {
      const params = Object.keys(payload).reduce((result, key) => {
        result = {
          ...result,
          ...Object.keys(payload[key]).reduce((innerResult, innerKey) => {
            innerResult[innerKey] = service.getValue(payload, `${key}.${innerKey}`, null);
            return innerResult;
          }, {})
        };
        return result;
      }, {});

      const obj = api.createNoti(params);
      dispatch(common.loadingStatus(true));
      return Fetcher.post(obj.url, obj.params).then(result => {
        if (service.getValue(result, 'success', false)) {
          onCloseModal();
          return onFetchEvents({ method: 'refetch' });
        }
      });
    },
    [onCloseModal, onFetchEvents]
  );

  const onEvents = useCallback(
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
        if (method === 'submit') {
          if (mode === 'create') {
            return onCreate(payload);
          }
          return onUpdate(payload);
        }
      }

      return null;
    },
    [setHandler, mode, onCreate, onUpdate]
  );

  const onClickFooter = useCallback(
    button => {
      switch (button.roll) {
        case 'update':
          history.push(`/management/maiil/${id}/update`);
          return null;
        case 'cancel':
          history.push(`/management/mail`);
          return onCloseModal();
        case 'save':
          return setHandler(true);
        case 'remove':
          return Modal.confirm({
            title: service.getValue(lang, 'LANG00068', 'no-text'),
            content: service.getValue(lang, 'LANG00259', 'no-text'),
            okText: service.getValue(lang, 'LANG00068', 'no-text'),
            okType: 'danger',
            cancelButtonProps: {
              type: 'default'
            },
            cancelText: service.getValue(lang, 'LANG00069', 'no-text'),
            onOk: () => onRemove()
          });
        default:
          break;
      }
      return null;
    },
    [onCloseModal, setHandler, history, id, onRemove]
  );

  const getButtons = useCallback(() => {
    return values.pages.mail.buttons.map(buttonKey => {
      const matched = values.actionButtons.filter(button => button.roll === buttonKey).find(item => item);
      return {
        ...matched,
        onClick: () => {
          onOpenModal({ ...matched, mode: 'create' });
        },
        className: 'deep-grey',
        type: 'primary',
        style: {
          fontSize: 14,
          width: '80px',
          height: 30,
          lineHeight: '28px'
        }
      };
    });
  }, [onOpenModal]);

  const getModal = useCallback(
    select => {
      const matched = values.pages.mail.modals.filter(modal => modal.key === select.mode).find(item => item);
      const footer = service.getValue(matched, `${mode === 'update' ? mode : 'footer'}`, {});
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
    [onClickFooter, mode]
  );

  const buttons = useMemo(() => getButtons(), [getButtons]);
  const mergedColumns = useMemo(() => getMergedColumns(), [getMergedColumns]);
  const modal = useMemo(() => getModal(selected), [getModal, selected]);

  return (
    <div className="notice-list-wrapper">
      <ButtonWrap left={buttons} right={[<span style={{ fontSize: 14, display: 'inline-block', marginTop: '5px' }}>{`${message}`}</span>]} style={{ padding: '0px 0 20px' }} />
      <CommonTable
        rowKey={(row, idx) => service.getValue(row, 'notiId', idx)}
        columns={mergedColumns}
        dataSource={data}
        onRow={row => {
          return {
            onClick: () => onOpenModal({ ...row, mode: 'update' }),
            style: { cursor: 'pointer' }
          };
        }}
        scroll={{ x: 'true', y: 0 }}
      />

      <Modal
        forceRender
        destroyOnClose
        width="40%"
        centered
        maskClosable={false}
        visible={visible}
        title={service.getValue(modal, 'title', '')}
        footer={Object.keys(service.getValue(modal, 'footer', {})).length ? <ButtonWrap right={service.getValue(modal, 'footer.right', [])} left={service.getValue(modal, 'footer.left', [])} /> : null}
        onCancel={onCloseModal}
      >
        <ModalItem handler={handler} onEvents={onEvents} data={selected} />
      </Modal>
    </div>
  );
}

export default Item;
