import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { NavLink, useHistory, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Menu } from 'antd';

import { WithSiderLayout } from '@/layouts';
import { service } from '@/configs';

import { values } from '../configs';

const { SubMenu, Item } = Menu;

function Sider() {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);
  const deviceCodes = ['CDK-00007', 'CDK-00008'];
  const deviceList = useSelector(state => service.getValue(state.auth, 'configs', []).filter(inner => deviceCodes.includes(inner.grpCd)));

  useEffect(() => {
    const redirect = deviceId => {
      if (deviceId) {
        return null;
      }
      const defaultCode = service.getValue(deviceList, '0.codes.0', null);
      const defaultKey = defaultCode ? service.getValue(defaultCode, 'cd', null) : null;
      if (defaultKey) {
        history.push({
          pathname: `/management/device/${defaultKey}`,
          state: { code: defaultCode }
        });
      }
      return null;
    };
    redirect(id);
  }, [id, history, deviceList]);

  const getParentKey = useCallback(() => {
    const { state } = location;
    const openKey = service.getValue(state, 'code.grpCd', null);
    const parentKey = openKey ? [openKey] : [];
    setOpenKeys(parentKey);
    return parentKey;
  }, [location]);

  const onOpenChange = useCallback(
    keys => {
      const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
      setOpenKeys([latestOpenKey]);
    },
    [setOpenKeys, openKeys]
  );

  const parentKey = useMemo(() => getParentKey(), [getParentKey]);

  const getSubMenu = () => {
    return deviceList.map((device, idx) => {
      if (service.getValue(device, 'codes', false)) {
        return (
          <SubMenu key={service.getValue(device, 'grpCd', idx)} title={service.getValue(device, 'grpCdName', null)}>
            {service.getValue(device, 'codes', []).map((code, inx) => {
              return (
                <Item key={service.getValue(code, 'cd', inx)}>
                  <NavLink to={{ pathname: `/management/device/${code.cd}`, state: { code } }}>{service.getValue(code, 'cdName', '')}</NavLink>
                </Item>
              );
            })}
          </SubMenu>
        );
      }
      return null;
    });
  };

  return (
    <Card title={values.pages.device.sider.title}>
      <Menu theme="light" mode="inline" forceSubMenuRender defaultOpenKeys={parentKey} selectedKeys={[id]} onOpenChange={onOpenChange} openKeys={openKeys} subMenuCloseDelay={0.2} subMenuOpenDelay={0.1}>
        {getSubMenu()}
      </Menu>
    </Card>
  );
}

export default WithSiderLayout(Sider);
