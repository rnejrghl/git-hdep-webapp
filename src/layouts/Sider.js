import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';

const { Sider } = Layout;

const StyledSider = styled(Sider)`
  margin-right: 15px;
  background: transparent;
  & > .ant-layout-sider-children {
    & > * {
      height: inherit;
    }
  }
`;

function WithSiderLayout(WrappedComponent) {
  return ({ ...props }) => {
    return (
      <StyledSider className="sider" theme={props.theme || 'light'} width={props.width || '244'}>
        <WrappedComponent {...props} />
      </StyledSider>
    );
  };
}

export default WithSiderLayout;
