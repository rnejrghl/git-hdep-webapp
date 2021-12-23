import React, { useState, useCallback, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Modal } from 'antd';
import moment from 'moment';

import { WithContentLayout } from '@/layouts';
import { CommonTable, ButtonWrap, ExcelButton } from '@/components/commons';
import { service, Fetcher, locale, formats } from '@/configs';

import { columns, values, api } from '../configs';
import Item from './Item';

const lang = service.getValue(locale, 'languages', {});

const StyleWrapper = styled.div`
  padding: 20px 20px 0;
`;

function Content(props) {
  const { onFetchEvents, data } = props;
  const history = useHistory();
  const { id, mode } = useParams();
  const { userData = [] } = data;
  const permissions = useSelector(state =>
    service
      .getValue(state.auth, 'configs', [])
      .filter(inner => inner.grpCd === 'CDK-00017')
      .reduce((result, inner) => {
        result = service.getValue(inner, 'codes', []);
        return result;
      }, [])
  );
  const { menuRoles = [], inqRoles = [] } = useSelector(state => service.getValue(state.fetch, 'multipleList', {}));

  // modal state
  const [visible, setVisible] = useState(false);
  const [selected, setSelect] = useState({});

  // handler
  const [handler, setHandler] = useState(false);

  // modal
  const onOpenModal = useCallback(
    select => {
      setSelect(select);
      setVisible(true);
      return history.push(`${history.location.pathname}/${service.getValue(select, 'userId', '0')}/${service.getValue(select, 'mode', 'create')}`);
    },
    [setSelect, setVisible, history]
  );

  const onCloseModal = useCallback(() => {
    setSelect({});
    setVisible(false);
    if (id || mode) {
      return history.push(`/management/user`);
    }
    return null;
  }, [setSelect, setVisible, id, mode, history]);

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
    const userSeq = service.getValue(selected, 'userSeq', null);
    if (!userSeq) {
      return Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: '사용자를 선택하세요.'
      });
    }
    const obj = api.deleteUser(userSeq);
    return Fetcher.post(obj.url, obj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        onCloseModal();
        return onFetchEvents({ method: 'refetch' });
      }
    });
  }, [onCloseModal, onFetchEvents, selected]);

  const onUpdate = useCallback(
    (payload = {}) => {
      const userSeq = service.getValue(selected, 'userSeq', null);
      if (!userSeq) {
        return Modal.error({
          title: service.getValue(lang, 'LANG00296', 'no-text'),
          content: '사용자를 선택하세요.'
        });
      }

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

      if (service.getValue(params, 'alarms.length', false)) {
        params['smsAlrmYn'] = service.getValue(params, 'alarms', []).includes('smsAlrmYn') ? 'Y' : 'N';
        params['emailAlrmYn'] = service.getValue(params, 'alarms', []).includes('emailAlrmYn') ? 'Y' : 'N';
        delete params['alarms'];
      }
      params['userSeq'] = userSeq;
      const obj = api.updateUser(params);
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
      if (service.getValue(params, 'alarms.length', false)) {
        params['smsAlrmYn'] = service.getValue(params, 'alarms', []).includes('smsAlrmYn') ? 'Y' : 'N';
        params['emailAlrmYn'] = service.getValue(params, 'alarms', []).includes('emailAlrmYn') ? 'Y' : 'N';
        delete params['alarms'];
      }

      const obj = api.createUser(params);
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
          history.push(`/management/user/${id}/update`);
          return null;
        case 'cancel':
          history.push(`/management/user`);
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
    return values.pages.user.buttons.map(buttonKey => {
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
      const matched = values.pages.user.modals.filter(modal => modal.key === select.mode).find(item => item);
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

  const getMergedColumns = useCallback(() => {
    return columns.userColumns.map(column => {
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

      if (column.dataIndex === 'userLvlCd') {
        column.selectAble.list = [{ key: 'all', value: 'all', label: 'ALL' }].concat(
          permissions.map(item => {
            return {
              key: item.cd,
              value: item.cd,
              label: item.cdName
            };
          })
        );
        column.selectAble.defaultValue = 'all';
        column.render = text => {
          const matched = permissions.filter(inner => inner.cd === text).find(inner => inner);

          return service.getValue(matched, 'cdName', null);
        };
      }

      if (column.dataIndex === 'menuRoleId') {
        column.selectAble.list = [{ key: 'all', value: 'all', label: 'ALL' }].concat(
          menuRoles.map(item => {
            return {
              key: item.menuRoleId,
              value: item.menuRoleId,
              label: item.menuRoleName
            };
          })
        );
        column.selectAble.defaultValue = 'all';
        column.render = text => {
          const matched = menuRoles.filter(inner => inner.menuRoleId === text).find(inner => inner);
          return <span>{service.getValue(matched, 'menuRoleName', '')}</span>;
        };
      }

      if (column.dataIndex === 'inqGrpId') {
        column.selectAble.list = [{ key: 'all', value: 'all', label: 'ALL' }].concat(
          inqRoles.map(item => {
            return {
              key: item.inqGrpId,
              value: item.inqGrpId,
              label: item.inqGrpName
            };
          })
        );
        column.selectAble.defaultValue = 'all';
        column.render = text => {
          const matched = inqRoles.filter(inner => inner.inqGrpId === text).find(inner => inner);

          return <span>{service.getValue(matched, 'inqGrpName', '')}</span>;
        };
      }

      return { ...column };
    });
  }, [onChangeTable, inqRoles, menuRoles, permissions]);

  const buttons = useMemo(() => getButtons(), [getButtons]);
  const modal = useMemo(() => getModal(selected), [getModal, selected]);
  const mergedColumns = useMemo(() => getMergedColumns(), [getMergedColumns]);

  return (
    <StyleWrapper>
      <ButtonWrap
        left={buttons}
        right={[
          <span style={{ fontSize: 14 }}>
            {`${service.getValue(lang, 'LANG00172', 'no-text')}`} : {service.getValue(userData, 'length', 0)}
          </span>,
          <ExcelButton href="/mm/users/excel" />
        ]}
        style={{ padding: '0px 0 20px' }}
      />

      <CommonTable
        rowKey={(record, idx) => service.getValue(record, 'userId', idx)}
        columns={mergedColumns}
        dataSource={userData}
        scroll={{ y: 'calc(100vh - 270px)' }}
        onRow={row => {
          return {
            onClick: () => onOpenModal({ ...row, mode: 'read' }),
            style: { cursor: 'pointer' }
          };
        }}
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
        <Item handler={handler} onEvents={onEvents} />
      </Modal>
    </StyleWrapper>
  );
}

export default WithContentLayout(Content);
