import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { Card, Row, Col, Modal, Button, Menu } from 'antd';

import { common } from '@/store/actions';
import { WithSiderLayout } from '@/layouts';
import { ButtonWrap } from '@/components/commons';

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
        const defaultId = service.getValue(list, '0.gtwyId', null);
        return history.push(`/management/gw/${defaultId}`);
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
        const cdList = ['inverterList', 'batteryList'];
        const params = {
          gtwyName: service.getValue(payload, 'gtwyName', null),
          eqmtGubnCds: Object.keys(payload)
            .filter(key => cdList.includes(key))
            .map(key => payload[key])
        };
        const obj = api.createGWItem(params);
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
      switch (button.roll) {
        case 'cancel':
          return setVisible(false);
        case 'save':
          return setHandler(true);
        default:
          break;
      }
      return null;
    },
    [setHandler, setVisible]
  );

  const getModal = useCallback(() => {
    const matched = values.pages.gw.sider.modals.filter(modal => modal.key === 'add').find(modal => modal);
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
    <Card title={values.pages.gw.sider.title}>
      <Row type="flex" justify="start" align="stretch" style={{ height: '100%' }}>
        <Col span={24}>
          <Menu theme="light" mode="inline" selectedKeys={[id]}>
            {service.getValue(props, 'list', []).map((item, idx) => {
              return (
                <Menu.Item key={service.getValue(item, 'gtwyId', idx)}>
                  <NavLink to={`/management/gw/${service.getValue(item, 'gtwyId', null)}`}>{service.getValue(item, 'gtwyName', '')}</NavLink>
                </Menu.Item>
              );
            })}
          </Menu>
        </Col>
        <Col span={24} style={{ flex: '1 1 auto', alignSelf: 'flex-end', padding: 20 }}>
          {values.pages.gw.sider.buttons.map(buttonKey => {
            const matched = values.actionButtons.filter(button => button.roll === buttonKey).find(item => item);
            return (
              <Button key={buttonKey} {...matched} onClick={() => setVisible(true)} style={{ height: 30 }} block>
                {matched.label}
              </Button>
            );
          })}
        </Col>
      </Row>
      <Modal
        forceRender
        destroyOnClose
        width="30%"
        centered
        maskClosable={false}
        visible={visible}
        title={service.getValue(modal, 'title', '')}
        footer={Object.keys(service.getValue(modal, 'footer', {})).length ? <ButtonWrap right={service.getValue(modal, 'footer.right', [])} left={service.getValue(modal, 'footer.left', [])} /> : null}
        onCancel={() => setVisible(false)}
      >
        <Create {...modal} handler={handler} onEvents={onEvents} />
      </Modal>
    </Card>
  );
}

export default WithSiderLayout(Sider);
