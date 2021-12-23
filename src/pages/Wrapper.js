import React, { Suspense } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { SubRoutes } from '@/router';
import { Spinner } from '@/components/commons';
import { service } from '@/configs';

export default function Wrapper({ currentRoute }) {
  const { isLoading } = useSelector(state => service.getValue(state, 'common'));
  return (
    <Suspense fallback={isLoading ? <Spinner tip="Loading" size="large" delay={100} /> : <span>&nbsp;</span>}>
      <Switch>
        {service.getValue(currentRoute, 'children', []).map(route => {
          return route.component && <SubRoutes key={route.menuId || route.path} {...route} />;
        })}
        {currentRoute.redirect ? <Redirect to={currentRoute.redirect} /> : null}
      </Switch>
    </Suspense>
  );
}
