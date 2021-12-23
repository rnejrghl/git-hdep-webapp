import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { Card, Menu, Row, Col, Button, Modal } from 'antd';

import { common } from '@/store/actions';
import { ButtonWrap } from '@/components/commons';
import { WithSiderLayout } from '@/layouts';
import { service, Fetcher } from '@/configs';

import { values, api } from '../configs';
import Create from './Create';

function Sider(props) {
  const { list = [], onFetchEvents } = props;
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [handler, setHandler] = useState(false);

  useEffect(() => {
    const redirect = () => {
      if (!id && list.length) {
        const defaultId = service.getValue(list, '0.menuRoleId', null);
        return history.push(`/management/menu/${defaultId}`);
      }
      return null;
    };

    redirect();
  }, [list, id, history]);

  const onEvents = events => {
    const { method, payload } = events;
    if (!method) {
      return null;
    }

    if (Object.keys(payload).length) {
      setHandler(false);
      if (method === 'submit') {
        const obj = api.createMenuRole(payload);
        dispatch(common.loadingStatus(true));
        return Fetcher.post(obj.url, obj.params).then(result => {
          dispatch(common.loadingStatus(false));
          if (service.getValue(result, 'success', false)) {
            onFetchEvents({ method: 'reFetchList' });
            return setVisible(false);
          }
          return null;
        });
      }
    }
    return null;
  };

  const onClickFooter = useCallback(
    button => {
      if (button.roll === 'cancel') {
        return setVisible(false);
      }
      if (button.roll === 'save') {
        return setHandler(true);
      }
    },
    [setVisible, setHandler]
  );

  const getModal = useCallback(() => {
    const matched = values.pages.menu.sider.modals.filter(modal => modal.key === 'add').find(modal => modal);
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
  }, [onClickFooter]);

  const modal = useMemo(() => getModal(), [getModal]);

  return (
    <Card title={values.pages.menu.sider.title}>
      <Row type="flex" justify="start" align="stretch" style={{ height: '100%' }}>
        <Col span={24}>
          <Menu theme="light" mode="inline" selectedKeys={[id]}>
            {list.length &&
              list.map((item, idx) => {
                return (
                  <Menu.Item key={service.getValue(item, 'menuRoleId', idx)}>
                    <NavLink to={`/management/menu/${service.getValue(item, 'menuRoleId', null)}`}>{service.getValue(item, 'menuRoleName', '')}</NavLink>
                  </Menu.Item>
                );
              })}
          </Menu>
        </Col>

        <Col span={24} style={{ flex: '1 1 auto', alignSelf: 'flex-end', padding: 20 }}>
          {values.pages.menu.sider.buttons.map(buttonKey => {
            const matched = values.actionButtons.filter(button => button.roll === buttonKey).find(item => item);
            return (
              <Button key={buttonKey} {...matched} onClick={() => setVisible(true)} block style={{ height: 30 }}>
                {matched.label}
              </Button>
            );
          })}
        </Col>
      </Row>

      <Modal
        forceRender
        destroyOnClose
        centered
        visible={visible}
        maskClosable={false}
        title={service.getValue(modal, 'title', '')}
        onCancel={() => setVisible(false)}
        footer={Object.keys(service.getValue(modal, 'footer', {})).length ? <ButtonWrap right={service.getValue(modal, 'footer.right', [])} left={service.getValue(modal, 'footer.left', [])} /> : null}
      >
        <Create {...modal} handler={handler} onEvents={onEvents} />
      </Modal>
    </Card>
  );
}

export default WithSiderLayout(Sider);
