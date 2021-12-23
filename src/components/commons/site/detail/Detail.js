import React, { lazy, Suspense, useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Tabs, Card, Button, Modal } from 'antd';

import { fetch, common } from '@/store/actions';
import { values, service, api, locale, Fetcher } from '@/configs';
import { Spinner, CustomIcon } from '@/components/commons';

import Info from './Info';

import '@/styles/app/components/commons/site/Detail.scss';
import TabComponent from '../register/TabComponent';

const { TabPane } = Tabs;
const lang = service.getValue(locale, 'languages', {});

function Detail(props) {
  const dispatch = useDispatch();
  const { tabs = [], site, onEvents } = props;
  const siteDetail = useSelector(state => service.getValue(state.fetch, `multipleList.siteDetail`, {}), shallowEqual);
  const multipleList = useSelector(state => service.getValue(state.fetch, `multipleList`, {}), shallowEqual);

  useEffect(() => {
    const fetching = () => {
      //console.log('~~~~~~~~~ fetching :' + site);

      const siteId = service.getValue(site, 'siteId', null);
      const workOrdUserSeq = service.getValue(site, 'workOrdUserSeq', 0);
      if (siteId) {
        const obj = api.getSiteDetail(siteId);
        const operList = api.getSiteDetailOperation(siteId);
        const tagList = api.getSiteDetailRawTagList(siteId);
        const failObj = api.getSiteDetailFailAlarm({ siteId: siteId });
        const workObj = api.getSiteDetailWorkOrders({ siteId: siteId, userSeq: workOrdUserSeq });
        const ctrlHis = api.getSiteDetailControlHistory({ siteId: siteId, page: 1 });
        dispatch(
          fetch.getMultipleList([
            { id: 'siteDetail', url: obj.url, params: obj.params },
            { id: 'siteOperation', url: operList.url, params: operList.params },
            { id: 'rowTagList', url: tagList.url, params: tagList.params },
            { id: 'siteFailAlarm', url: failObj.url, params: failObj.params },
            { id: 'siteWorkOrder', url: workObj.url, params: workObj.params },
            { id: 'sitecontrolHistory', url: ctrlHis.url, params: ctrlHis.params }
          ])
        );
      }
      return null;
    };

    fetching();

    return () => {};
  }, [dispatch, site]);

  const getClassName = tab => {
    return tab.key === 'operation' || tab.key === 'notification' ? 'tabpane-padding tabpane-padding-bg' : 'tabpane-padding';
  };

  const mergedTabs = tabs.length
    ? tabs
        .sort((a, b) => a.sort - b.sort)
        .filter(service.getValue(siteDetail, 'rescGubn', 'B') === 'B' ? tab => tab.key != '' : tab => (tab.key != 'controls') & (tab.key != 'controlHistory'))
        .map(tab => {
          return {
            ...tab,
            ...values.siteDetail.tabs.filter(item => item.key === tab.key).find(item => item)
          };
        })
    : values.siteDetail.tabs;

  const getDeviceType = useCallback(detail => {
    return service.getValue(detail, 'rescGubn', null) === 'A';
  }, []);

  const title = (
    <Row type="flex" align="middle">
      <Col>
        <Button type="danger" style={{ width: 30, height: 30, padding: 0, verticalAlign: 'middle', minWidth: 30, backgroundColor: '#db0012' }}>
          {service.getValue(siteDetail, 'rescGubn', 'B') === 'B' ? <CustomIcon type={require('@/assets/battery.svg')} style={{ width: 16, height: 17, verticalAlign: 'middle' }} /> : <CustomIcon type={require('@/assets/pv.svg')} style={{ verticalAlign: 'middle', width: 16, height: 17 }} />}
        </Button>
      </Col>
      <Col style={{ marginLeft: 10 }} className="site-name">
        {service.getValue(siteDetail, 'userName', 'SiteName')}
      </Col>
      <Col style={{ marginLeft: 20, fontSize: 14, fontWeight: 'normal' }}>{service.getValue(siteDetail, 'siteId', '12345')}</Col>
    </Row>
  );

  const getDataSource = key => {
    switch (key) {
      case 'notification':
        return service.getValue(multipleList, 'siteWorkOrder', []);
      case 'operation':
        return service.getValue(multipleList, 'siteOperation', []);
      case 'controls':
        return service.getValue(multipleList, 'siteOperation', []);
      case 'controlHistory':
        return service.getValue(multipleList, 'sitecontrolHistory', []);
      default:
        break;
    }
    return null;
  };

  const isPv = useMemo(() => getDeviceType(siteDetail), [siteDetail, getDeviceType]);

  return (
    <Card bodyStyle={{ padding: 0 }} bordered={false} title={title} className="site-detail">
      <Row className="detail-wrapper">
        <Col>
          <Info data={siteDetail} />
        </Col>
        <Col>
          <Tabs tabBarStyle={{ margin: '0', padding: '7px 20px 0 20px' }}>
            {mergedTabs.map(tab => {
              const TabComponent = lazy(tab.component);
              return (
                <TabPane key={tab.key} tab={tab.label} forceRender className={getClassName(tab)}>
                  <Suspense
                    fallback={
                      <div style={{ height: '100px' }}>
                        <Spinner tip="loading" size="small" />
                      </div>
                    }
                  >
                    <TabComponent is={isPv} dataSource={getDataSource(tab.key)} current={tab.key} {...tab.props} {...siteDetail} {...site} />
                  </Suspense>
                </TabPane>
              );
            })}
          </Tabs>
        </Col>
      </Row>
    </Card>
  );
}

Detail.propTypes = {
  tabs: PropTypes.arrayOf(() => {
    return {
      key: PropTypes.string,
      label: PropTypes.string,
      component: PropTypes.element
    };
  })
};

Detail.defaultProps = {
  tabs: []
};

export default Detail;
