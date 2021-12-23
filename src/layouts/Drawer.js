import React from 'react';
import { Drawer as WebDrawer, Menu, Icon, Row, Col, Button, Modal } from 'antd';
import { Drawer as MobileDrawer } from 'antd-mobile';
import { useRouteMatch, NavLink } from 'react-router-dom';

import styled from 'styled-components';
import UAParser from 'ua-parser-js';

import store from '@/store/sagas';
import { routes } from '@/router';
import { service } from '@/configs';
import { UserInfo } from '@/components/commons';

const { SubMenu } = Menu;
const parser = new UAParser();
const isMobile = parser.getDevice().type === 'mobile';

// styled component
const StyleButton = styled(Button)`
  color: rgba(255, 255, 255, 0.65);
  text-align: left;
  padding: 0;

  &:hover,
  &:active {
    color: ${styleProps => styleProps.theme.white};
  }
  &:focus {
    color: rgba(255, 255, 255, 0.65);
  }
`;

const StyledMobileDrawer = styled(MobileDrawer)`
  & .am-drawer-sidebar {
    background-color: ${styleProp => styleProp.theme.layoutHeaderBackground};
  }
`;

const StyledRow = styled(Row)`
  height: 100%;
`;

const StyledCol = styled(Col)`
  flex: 0 0 100%;
  align-self: flex-end;
  padding: 50px 19px 20px 20px;
`;

function genMenuItem(route = null) {
  const state = store.getState();
  const { language = 'en-US' } = service.getValue(state, 'auth', {});
  const splited = language.split('-');
  const key = splited[0].replace(/\b[a-z]/, letter => letter.toUpperCase());

  const optionPathPattern = new RegExp('(/:)(?<=:)[\\w\\W]*', 'g');
  if (!route) {
    return null;
  }

  const onMove = path => {
    const href = path.replace(optionPathPattern, '');
    return window.open(`${window.location.origin}${href}`, '_blank', `toolbar=yes,scrollbars=yes,location=no,resizable=yes,menubar=no,top=${window.screen.height / 2 - 850 / 2},left=${window.screen.width / 2 - 1440 / 2},width=1440,height=850`);
  };

  const onModal = () => {
    return Modal.error({
      title: 'Coming soon'
    });
  };
  if (route.target) {
    if (!isMobile) {
      return (
        <Menu.Item key={route.path || route.menuId} className={route.target === 'temp' ? 'temp' : ''}>
          <StyleButton block type="link" onClick={() => (route.target === 'temp' ? onModal() : onMove(route.path))}>
            {service.getValue(route, `menu${key}Name`, service.getValue(route, 'menuEnName', null))}
          </StyleButton>
        </Menu.Item>
      );
    }
    return <Menu.Item>{service.getValue(route, `menu${key}Name`, service.getValue(route, 'menuEnName', null))}</Menu.Item>;
  }

  return (
    <Menu.Item key={route.path || route.menuId}>
      <NavLink to={route.path.replace(optionPathPattern, '')} activeClassName="isActive">
        {service.getValue(route, `menu${key}Name`, service.getValue(route, 'menuEnName', null))}
      </NavLink>
    </Menu.Item>
  );
}

function genSubMenu(route, subMenus) {
  const state = store.getState();
  const { language = 'en-US' } = service.getValue(state, 'auth', {});
  const splited = language.split('-');
  const key = splited[0].replace(/\b[a-z]/, letter => letter.toUpperCase());

  if (!route.children.length) {
    return null;
  }

  return (
    <SubMenu
      key={route.path || route.menuId}
      title={
        <span className={route.target === 'temp' ? 'temp' : ''}>
          {route.icon ? <Icon type={route.icon} /> : null}
          {service.getValue(route, `menu${key}Name`, service.getValue(route, 'menuEnName', null))}
        </span>
      }
    >
      {route.children
        .filter(child => service.getValue(child, 'meta.navigation.show', false))
        .filter(child => service.getValue(child, 'menuId', false) !== 'MENU070402')
        .map(child => {
          const menuId = service.getValue(child, 'menuId', false);
          const subMenu = getMenuAuth(subMenus, menuId);
          if (service.getValue(subMenu, 'useYn', 'N') === 'Y') {
            return genMenuItem(child);
          }

          return null;
        })}
    </SubMenu>
  );
}

function genMenu(matched) {
  const routeList = routes.filter(route => service.getValue(route, 'meta.navigation.show', false));
  const defaultKey = `/${service.getValue(matched, 'path', '/').split('/')[1]}`;

  const state = store.getState();
  const { menus } = service.getValue(state, 'auth', {});

  return (
    <Menu mode="inline" theme="dark" defaultSelectedKeys={[matched.path]} defaultOpenKeys={[defaultKey]}>
      {routeList.map(route => {
        const menuId = service.getValue(route, 'menuId', false);
        const menu = getMenuAuth(menus, menuId);

        if (service.getValue(menu, 'useYn', 'N') === 'Y') {
          if (service.getValue(route, 'children', false)) {
            const subMenus = service.getValue(menu, 'subDeph', []);
            return genSubMenu(route, subMenus);
          }
          return genMenuItem(route);
        }
        return null;
      })}
    </Menu>
  );
}

function getMenuAuth(menus, menuId = false) {
  if (!menuId) {
    return null;
  }

  if (menus.length <= 0) {
    return null;
  }

  const matched = menus.filter(menu => service.getValue(menu, 'menuId', false) === menuId).find(item => item);

  return matched;
}

export default function DrawerComponent(props) {
  const matched = useRouteMatch();

  if (props.isMobile) {
    return (
      <StyledMobileDrawer
        contentStyle={{ display: 'none' }}
        overlayStyle={{ display: 'none' }}
        sidebarStyle={{ width: '74%', maxWidth: '400px', minWidth: '240px' }}
        sidebar={
          <StyledRow type="flex" justify="space-around" align="top">
            <Col span={24}>{genMenu(matched)}</Col>
            <StyledCol span={24}>
              <UserInfo root="drawer" />
            </StyledCol>
          </StyledRow>
        }
        docked={props.visible}
        enableDragHandle
        className="global-drawer"
      >
        &nbsp;
      </StyledMobileDrawer>
    );
  }
  return (
    <WebDrawer title={null} className="global-drawer" placement="left" closable={false} visible={props.visible} onClose={props.onClose} getContainer={false} maskClosable width="20%" bodyStyle={{ padding: '0' }}>
      {genMenu(matched)}
    </WebDrawer>
  );
}
