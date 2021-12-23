import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import { service } from '@/configs';

function AuthRoute(props) {
  const logged = useSelector(state => service.getValue(state, 'auth', {}));
  const { children, ...rest } = props;

  return (
    <Route
      {...rest}
      render={({ location }) =>
        logged ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default AuthRoute;
