// AuthRoute를 거친 라우터를 정의하고 component를 지정합니다.
// 지정된 route는 @/App.js에서 사용됩니다.
// refs = https://reacttraining.com/react-router/web/guides/static-routes

// 하위 route는 children의 배열로 작성합니다.
import { lazy } from 'react';
import { NotFound, Wrapper } from '@/pages';

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Wrapper,
    dataIndex: 'MENU010001',
    redirect: '/dashboard/site',
    meta: {
      navigation: {
        show: true
      }
    },
    children: [
      {
        path: '/dashboard/site',
        name: '사이트별 운전현황',
        dataIndex: 'MENU010302',
        exact: true,
        component: lazy(() => import('@/components/dashboard/site/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      }
    ]
  },
  {
    path: '*',
    component: NotFound,
    meta: {
      navigation: {
        show: false
      }
    }
  }
];

export default routes;
