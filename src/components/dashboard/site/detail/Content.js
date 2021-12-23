import React, { useMemo, useCallback, Suspense, lazy } from 'react';
import { Tabs } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';

import { values as CommonValues, service } from '@/configs';
import { WithContentLayout } from '@/layouts';
import { Spinner } from '@/components/commons';

import { values } from '../../configs';

import '@/styles/app/components/dashboard/SiteDetail.scss';

function renderTabBar(props) {
  return (
    <Sticky>
      {({ style }) => (
        <div style={{ ...style, zIndex: 1 }}>
          <Tabs.DefaultTabBar {...props} />
        </div>
      )}
    </Sticky>
  );
}

function Content(props) {
  const { siteDetail = {} } = props;

  const getDeviceType = useCallback(detail => {
    return service.getValue(detail, 'rescGubn', null) === 'A';
  }, []);

  const tabs = values.tabs
    .sort((a, b) => a.sort - b.sort)
    .map(tab => {
      return {
        key: tab.key,
        title: tab.label,
        component: tab.component
      };
    });

  const isPv = useMemo(() => getDeviceType(siteDetail), [siteDetail, getDeviceType]);

  const getDataSource = key => {
    switch (key) {
      case 'notification':
        return service.getValue(props, 'workOrders', []);
      default:
        break;
    }
    return null;
  };

  return (
    <StickyContainer className="mobile-site-detail-wrapper">
      <Tabs
        tabs={tabs}
        initialPage={service.getValue(tabs, '0.key', '')}
        renderTabBar={renderTabBar}
        onTabClick={(tab, index) => {
          console.log('onTabClick', index, tab);
        }}
        distanceToChangeTab={10}
      >
        {tabs.map(tab => {
          const TabComponent = lazy(tab.component);
          return (
            <div key={tab.key} style={{ padding: 10 }}>
              <Suspense
                fallback={
                  <div style={{ height: '100px' }}>
                    <Spinner tip="loading" size="small" />
                  </div>
                }
              >
                <TabComponent is={isPv} dataSource={getDataSource(tab.key)} {...tab.props} {...siteDetail} />
              </Suspense>
            </div>
          );
        })}
      </Tabs>
    </StickyContainer>
  );
}

export default WithContentLayout(Content);
