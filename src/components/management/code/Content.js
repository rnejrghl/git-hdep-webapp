import React, { useMemo, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, Modal } from 'antd';

import { common } from '@/store/actions';
import { WithContentLayout } from '@/layouts';
import { DndTable, ButtonWrap } from '@/components/commons';
import { service, locale, Fetcher } from '@/configs';

import { api, columns, values } from '../configs';
import Item from './Item';

function Content(props) {
  const { data = [], onFetchEvents } = props;
  const { id, mode } = useParams();
  const history = useHistory();
  const [handler, setHandler] = useState(false);
  const dispatch = useDispatch();

  // modal state
  const [visible, setVisible] = useState(false);

  // modal
  const onOpenModal = useCallback(() => {
    setVisible(true);
    return history.push(`/management/code/${id}/create`);
  }, [setVisible, history, id]);

  const onCloseModal = useCallback(() => {
    setVisible(false);
    if (id || mode) {
      return history.push(`/management/code/${id}/read`);
    }
    return null;
  }, [setVisible, id, mode, history]);

  const getMergedColumns = useCallback(() => {
    return columns.codeColumns.map(column => {
      if (column.dataIndex === 'inqOrd') {
        column.render = (text, record, idx) => {
          return <span>{text || idx + 1}</span>;
        };
      }
      return {
        ...column
      };
    });
  }, []);

  const onClickButton = useCallback(
    button => {
      switch (button.roll) {
        case 'cancel':
          return history.push(`/management/code/${id}/read`);
        case 'inq':
          return history.push(`/management/code/${id}/update`);
        case 'save':
          return setHandler(true);
        default:
          break;
      }
      return null;
    },
    [id, history]
  );

  const onClickFooter = useCallback(
    button => {
      switch (button.roll) {
        case 'cancel':
          history.push(`/management/code/${id}/read`);
          return onCloseModal();
        case 'save':
          return setHandler(true);
        default:
          break;
      }
      return null;
    },
    [onCloseModal, setHandler, history, id]
  );

  const onCreate = useCallback(
    (payload = {}) => {
      const params = payload;
      const codeData = data.find(el => el.grpCd === id);
      params['grpCdName'] = codeData.grpCdName;
      params['grpCd'] = id;
      params['inqOrd'] = codeData.codes.length + 1;
      params['upprGrpCd'] = 0;
      const obj = api.createCode(params);
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

      if (Object.keys(payload).length) {
        setHandler(false);
        if (method === 'submit') {
          if (mode === 'create') {
            return onCreate(payload);
          }
          // 정렬순서만 변경할때
          else if (mode === 'update') {
            return service.getValue(payload, 'result', []).map((item, idx) => {
              dispatch(common.loadingStatus(true));
              const innerObj = api.updateCode(item);
              return Fetcher.post(innerObj.url, innerObj.params).then(result => {
                if (service.getValue(payload, 'result.length', 0) - 1 === idx) {
                  dispatch(common.loadingStatus(false));
                  if (service.getValue(result, 'success', false)) {
                    history.push(`/management/code/${id}/read`);
                    return onFetchEvents({ method: 'refetch' });
                  }
                }
              });
            });
          } else {
            // 내용을 변경할때
            const obj = api.updateCode(payload);
            setHandler(false);
            dispatch(common.loadingStatus(true));
            return Fetcher.post(obj.url, obj.params).then(result => {
              dispatch(common.loadingStatus(false));
              if (service.getValue(result, 'success', false)) {
                return onFetchEvents({ method: 'refetch' });
              }
              return null;
            });
          }
        }
      }
      return null;
    },
    [setHandler, mode, onCreate]
  );

  const getSelected = useCallback(() => {
    return data.filter(item => item.grpCd === id).find(item => item);
  }, [data, id]);

  const getTitle = useCallback(selected => {
    return service.getValue(selected, 'grpCdName', '');
  }, []);

  const getButtons = useCallback(() => {
    return service.getValue(values.pages.code.content.buttons, `${mode}`, []).map(buttonKey => {
      const matched = values.actionButtons.filter(button => button.roll === buttonKey).find(item => item);
      return {
        ...matched,
        onClick: () => onClickButton(matched)
      };
    });
  }, [onClickButton, mode]);

  const getAddButtons = useCallback(() => {
    return service.getValue(values.pages.code.content.buttons, 'create', []).map(buttonKey => {
      const matched = values.actionButtons.filter(button => button.roll === buttonKey).find(item => item);
      return {
        ...matched,
        onClick: () => onOpenModal({ ...matched, mode: 'create' }),
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
      const matched = values.pages.code.modals.filter(modal => modal.key === 'create').find(item => item);
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
    [onClickFooter, mode]
  );

  const mergedColumns = useMemo(() => getMergedColumns(), [getMergedColumns]);
  const selected = useMemo(() => getSelected(), [getSelected]);
  const title = useMemo(() => getTitle(selected), [selected, getTitle]);
  const buttons = useMemo(() => getButtons(), [getButtons]);
  const addButtons = useMemo(() => getAddButtons(), [getAddButtons]);
  const modal = useMemo(() => getModal(selected), [getModal, selected]);

  return (
    <Card title={title}>
      <ButtonWrap left={addButtons} right={buttons} style={{ marginBottom: 20 }} />
      <DndTable columns={mergedColumns} dataSource={service.getValue(selected, 'codes', []).sort((a, b) => service.getValue(a, 'inqOrd', 0) - service.getValue(b, 'inqOrd', 0))} scroll={{ x: '100%', y: 'calc(100vh - 355px)' }} handler={handler} onEvents={onEvents} />
      <Modal
        forceRender
        destroyOnClose
        width="40%"
        centered
        maskClosable={false}
        visible={visible}
        title={service.getValue(modal, 'title', '')}
        footer={Object.keys(service.getValue(modal, 'footer', {})).length ? <ButtonWrap right={service.getValue(modal, 'footer.right', [])} /> : null}
        onCancel={onCloseModal}
      >
        <Item {...modal} handler={handler} onEvents={onEvents} />
      </Modal>
    </Card>
  );
}

export default WithContentLayout(Content);
