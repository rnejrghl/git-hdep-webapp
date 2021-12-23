import UAParser from 'ua-parser-js';
import { lazy } from 'react';
import web from './web';
import mobile from './mobile';
import AuthRoute from './AuthRoute';
import SubRoutes from './SubRoutes';
import store from '@/store/sagas';
import { NotFound, Wrapper } from '@/pages';
import { service } from '@/configs';

const state = store.getState();
const auth = state ? state.auth : {};

const { menus = [], user={} } = auth;

const parser = new UAParser();
const isMobile = parser.getDevice().type === 'mobile';
const userLv= service.getValue(user, 'userLvlCd','');

const originRoutes = isMobile ? mobile : web;
const sortedMenu = menus.sort((a, b) => service.getValue(a, 'inqOrd', 0) - service.getValue(b, 'inqOrd', 0));
const initialMenu = isMobile && sortedMenu.length ? service.getValue(originRoutes, '0', {}) : ((userLv=='ACN001'||userLv=='ACN002')?originRoutes.filter(route => route.dataIndex === service.getValue(sortedMenu, '0.menuId', null)).find(route => route):originRoutes.filter(route => route.dataIndex === service.getValue(sortedMenu, '1.menuId', null)).find(route => route));
const routes = [
  {
    path: '/',
    name: 'root',
    exact: true,
    component: Wrapper,
    redirect: service.getValue(initialMenu, 'path', '/login'),
    meta: {
      navigation: {
        show: false
      }
    }
  }
].concat(
  sortedMenu
    .map(menu => {
      const matched = originRoutes.filter(route => route.dataIndex === menu.menuId).find(route => route);
      if (matched) {
        if (menu.subDeph.length) {
          return {
            ...menu,
            ...matched,
            children: menu.subDeph
              .map(sub => {
                const child = matched.children.filter(childRoute => childRoute.dataIndex === sub.menuId).find(childRoute => childRoute);
                if (child) {
                  return {
                    ...sub,
                    ...child
                  };
                }
                return null;
              })
              .concat(
                isMobile
                  ? {
                      path: '/dashboard/site/:id',
                      name: 'detail',
                      component: lazy(() => import('@/components/dashboard/site/detail/Container')),
                      meta: {
                        navigation: {
                          show: false
                        }
                      }
                    }
                  : null
              )
              .filter(sub => !!sub)
          };
        }
        return {
          ...menu,
          ...matched
        };
      }
      return null;
    })
    .filter(menu => !!menu)
);

// HDEP: 나중에 MENUID를 적용하여 바꿀 필요가 있음. 임시 페이지.
routes.push({
  path: '/productionChart/sites/:siteId?',
  component: lazy(() => import('@/components/operation/chart/Container')),
  meta: {
    navigation: {
      show: false
    }
  }
});

routes.push({
  path: '/realChart/sites/:siteId?/:rescGubn?',
  component: lazy(() => import('@/components/operation/chart/Container2')),
  meta: {
    navigation: {
      show: false
    }
  }
});

routes.push({
  path: '*',
  component: NotFound,
  meta: {
    navigation: {
      show: false
    }
  }
});

export { routes, AuthRoute, SubRoutes };
