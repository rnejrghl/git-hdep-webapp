import React from 'react';
import { Layout } from 'antd';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { Breadcrumb } from '@/layouts';
import { routes } from '@/router';
import { service } from '@/configs';

// styled component
const StyledLayout = styled(Layout)`
  min-height: calc(100vh - 144px);
  padding: ${styleProps => (styleProps.children.length > 1 ? '20px' : '0')};
  background: ${styleProps => {
    return styleProps.children.length > 1 ? 'transparent' : styleProps.theme.white;
  }};
`;

const ContainerLayout = props => {
  const match = useRouteMatch();
  const splitMatch = service.getValue(match, 'url', '').split('/');
  const matchedRoute = props.name
    ? { name: props.name }
    : service.getValue(splitMatch, 'length', 0) > 2
    ? routes
        .map(route => {
          if (route.path === `/${splitMatch[1]}`) {
            return route.children.filter(child => child.path === match.path).find(child => child);
          }
          return null;
        })
        .find(route => route)
    : routes.filter(route => route.path === match.path).find(route => route);
  return (
    <div className="container">
      <Breadcrumb currentRoute={matchedRoute} description={props.description} theme={props.theme} util={props.util} title={props.title || null} />
      <StyledLayout {...props}>{props.children}</StyledLayout>
    </div>
  );
};

export default ContainerLayout;
