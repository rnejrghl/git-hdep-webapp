import React, { useEffect } from 'react';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Card, Menu } from 'antd';

import { WithSiderLayout } from '@/layouts';
import { fetch } from '@/store/actions';
import { service } from '@/configs';

import { values, api } from '../configs';

function Sider() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const { mainData = [] } = useSelector(state => service.getValue(state.fetch, 'list', {}), shallowEqual);

  useEffect(() => {
    const fetching = () => {
      const obj = api.getSiteList();
      dispatch(fetch.getList(obj.url, obj.params));
    };
    fetching();
    return () => {
      dispatch(fetch.resetList());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!id && mainData.length) {
      const defaultSiteId = service.getValue(mainData, '0.siteId', null);
      if (defaultSiteId) {
        history.push(`/management/site/${defaultSiteId}`);
      }
    }
  }, [history, id, mainData]);

  return (
    <Card title={values.pages.site.sider.title}>
      <Menu theme="light" mode="inline" selectedKeys={[id]}>
        {mainData.map((site, idx) => {
          return (
            <Menu.Item key={service.getValue(site, 'siteId', idx)}>
              <NavLink to={`/management/site/${site.siteId}`}>{service.getValue(site, 'siteId', '')}</NavLink>
            </Menu.Item>
          );
        })}
      </Menu>
    </Card>
  );
}

export default WithSiderLayout(Sider);
