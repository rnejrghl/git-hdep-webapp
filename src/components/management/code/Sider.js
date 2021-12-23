import React, { useEffect } from 'react';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { Card, Menu } from 'antd';

import { WithSiderLayout } from '@/layouts';
import { service } from '@/configs';

import { values } from '../configs';

function Sider(props) {
  const { list = [] } = props;
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    if (!id && list.length) {
      const defaultId = service.getValue(list, '0.grpCd', null);
      if (defaultId) {
        history.push(`/management/code/${defaultId}/read`);
      }
    }
  }, [history, id, list]);

  return (
    <Card title={values.pages.code.sider.title}>
      <Menu theme="light" mode="inline" selectedKeys={[id]}>
        {list.map((code, idx) => {
          return (
            <Menu.Item key={service.getValue(code, 'grpCd', idx)}>
              <NavLink to={`/management/code/${code.grpCd}/read`}>{service.getValue(code, 'grpCdName', '')}</NavLink>
            </Menu.Item>
          );
        })}
      </Menu>
    </Card>
  );
}

export default WithSiderLayout(Sider);
