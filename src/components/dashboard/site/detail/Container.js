import React, { useEffect, useMemo, useCallback } from 'react';
import { Icon, Row, Col, Button } from 'antd';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { ContainerLayout, UseFullLayout } from '@/layouts';
import { CustomIcon } from '@/components/commons';
import { fetch } from '@/store/actions';
import { service, api } from '@/configs';

import Content from './Content';

function Container() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { item } = history.location.state;
  const { siteDetail = {}, siteWorkOrder = [] } = useSelector(state => service.getValue(state.fetch, `multipleList`, {}), shallowEqual);

  useEffect(() => {
    const fetching = () => {
      const siteId = service.getValue(item, 'siteId', null);
      if (siteId) {
        const obj = api.getSiteDetail(siteId);
        const workOrderObj = api.getSiteDetailWorkOrders(siteId);
        dispatch(
          fetch.getMultipleList([
            { id: 'siteDetail', url: obj.url, params: obj.params },
            { id: 'siteWorkOrder', url: workOrderObj.url, params: workOrderObj.params }
          ])
        );
      }
      return null;
    };
    fetching();
    return () => {};
  }, [dispatch, item]);

  const onGoBack = () => {
    return history.go(-1);
  };

  const getTitle = useCallback(obj => {
    return (
      <Row type="flex" align="middle">
        <Col>
          <Button type="danger" style={{ width: 30, height: 30, padding: 0, verticalAlign: 'middle', minWidth: 30, backgroundColor: '#db0012' }}>
            {service.getValue(obj, 'rescGubn', 'B') === 'B' ? <CustomIcon type={require('@/assets/battery.svg')} style={{ width: 16, height: 17, verticalAlign: 'middle' }} /> : <CustomIcon type={require('@/assets/pv.svg')} style={{ verticalAlign: 'middle', width: 16, height: 17 }} />}
          </Button>
        </Col>
        <Col style={{ marginLeft: 10 }} className="site-name">
          {service.getValue(obj, 'userName', 'SiteName')}
        </Col>
      </Row>
    );
  }, []);

  const title = useMemo(() => getTitle(item), [getTitle]);

  return (
    <ContainerLayout className="dashboard-site-detail" theme="dark" util={<Icon type="close" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} onClick={() => onGoBack()} />} title={title}>
      <Content siteDetail={siteDetail} workOrders={siteWorkOrder} />
    </ContainerLayout>
  );
}

export default UseFullLayout(Container);
