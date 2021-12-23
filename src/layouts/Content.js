import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import UAParser from 'ua-parser-js';

const { Content } = Layout;
const parser = new UAParser();

function WithContentLayout(WrappedComponent) {
  const StyledContent = styled(Content)`
    & > * {
      min-height: 100%;
    }
    height: ${styleProps => (styleProps.mobile === 'true' ? 'calc(100vh - 112px)' : 'auto')};
  `;

  return ({ ...props }) => {
    const isMobile = parser.getDevice().type === 'mobile';
    return (
      <StyledContent className="content-wrap" mobile={isMobile.toString()}>
        <WrappedComponent {...props} />
      </StyledContent>
    );
  };
}

export default WithContentLayout;
