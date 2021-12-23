// AuthRoute를 거친 라우터를 정의하고 component를 지정합니다.
// 지정된 route는 @/App.js에서 사용됩니다.
// refs = https://reacttraining.com/react-router/web/guides/static-routes

// 하위 route는 children의 배열로 작성합니다.
import { lazy } from 'react';
import { Wrapper } from '@/pages';

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    dataIndex: 'MENU010001',
    component: Wrapper,
    redirect: '/dashboard/asset',
    meta: {
      navigation: {
        show: true
      }
    },
    children: [
      {
        path: '/dashboard/asset/:id?',
        dataIndex: 'MENU010102',
        name: '자산현황',
        // target: '_blank',
        component: lazy(() => import('@/components/dashboard/asset/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      },
      {
        path: '/dashboard/alarm',
        name: '알림현황',
        target: '_blank',
        dataIndex: 'MENU010202',
        component: lazy(() => import('@/components/dashboard/alarm/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      }
      ,{
        path: '/dashboard/spotPrice',
        name: 'AEMO SPOT PRICE & DEMAND',
        target: '_blank',
        dataIndex: 'MENU010302',
        component: lazy(() => import('@/components/operation/chart/spotPrice')),
        meta: {
          navigation: {
            show: false
          }
        }
      }
    ]
  },
  {
    path: '/operation/:type?/:id?/',
    name: '유지보수',
    dataIndex: 'MENU020001',
    component: lazy(() => import('@/components/operation/Container')),
    meta: {
      navigation: {
        show: true
      }
    }
  },
  {
    path: '/schedule',
    name: '거래',
    component: Wrapper,
    dataIndex: 'MENU030001',
    redirect: '/schedule/resource',
    meta: {
      navigation: {
        show: true
      }
    },
    children: [
      {
        path: '/schedule/resource',
        name: '자원그룹설정',
        dataIndex: 'MENU030112',
        component: lazy(() => import('@/components/schedule/resource/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      },
      {
        path: '/schedule/site',
        name: '사이트별 자원그룹 관리',
        dataIndex: 'MENU030312',
        component: lazy(() => import('@/components/schedule/site/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      }
    ]
  },
  {
    path: '/planning/:type?/:id?',
    name: '사업관리',
    dataIndex: 'MENU040001',
    component: lazy(() => import('@/components/planning/Container')),
    meta: {
      navigation: {
        show: true
      }
    }
  },
  {
    path: '/workorder/:type?/:id?',
    name: 'Work Order 현황',
    dataIndex: 'MENU050001',
    component: lazy(() => import('@/components/workorder/Container')),
    meta: {
      navigation: {
        show: true
      }
    }
  },
  {
    path: '/management',
    name: '기준정보 관리',
    dataIndex: 'MENU070001',
    component: Wrapper,
    redirect: '/management/device',
    meta: {
      navigation: {
        show: true
      }
    },
    children: [
      {
        path: '/management/user/:id?/:mode?',
        name: '사용자정보관리',
        dataIndex: 'MENU070102',
        component: lazy(() => import('@/components/management/user/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      },
      {
        path: '/management/device/:id?',
        name: '디바이스관리',
        dataIndex: 'MENU070202',
        component: lazy(() => import('@/components/management/device/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      },
      {
        path: '/management/devicealarm',
        name: '디바이스알람관리',
        dataIndex: 'MENU070302',
        component: lazy(() => import('@/components/management/devicealarm/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      },
      {
        path: '/management/gw/:id?',
        name: 'G/W관리',
        dataIndex: 'MENU070402',
        component: lazy(() => import('@/components/management/gw/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      },
      {
        path: '/management/site/:id?',
        name: '사이트별G/W관리',
        dataIndex: 'MENU070502',
        component: lazy(() => import('@/components/management/site/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      },
      {
        path: '/management/menu/:id?/:menuId?/:mode?',
        name: '메뉴권한관리',
        dataIndex: 'MENU070602',
        component: lazy(() => import('@/components/management/menu/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      },
      {
        path: '/management/role/:id?/:mode?',
        name: '조회권한관리',
        dataIndex: 'MENU070702',
        component: lazy(() => import('@/components/management/role/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      },
      {
        path: '/management/code/:id?/:mode?',
        name: '코드관리',
        dataIndex: 'MENU070802',
        component: lazy(() => import('@/components/management/code/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      },
      {
        path: '/management/language',
        name: '다국어',
        dataIndex: 'MENU070902',
        component: lazy(() => import('@/components/management/language/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      },
      {
        path: '/management/mail/:id?/:mode?',
        name: 'SMS/Email발송이력',
        dataIndex: 'MENU071002',
        component: lazy(() => import('@/components/management/mail/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      }
    ]
  },
  {
    path: '/statistics',
    name: '통계',
    dataIndex: 'MENU080001',
    component: Wrapper,
    redirect: '/statistics/generation',
    meta: {
      navigation: {
        show: true
      }
    },
    children: [
      {
        path: '/statistics/generation/:type?/:id?',
        name: '발전량 분석',
        dataIndex: 'MENU080102',
        component: lazy(() => import('@/components/statistics/generation/Container')),
        meta: {
          navigation: {
            show: true
          }
        }
      }
    ]
  }
];

export default routes;
