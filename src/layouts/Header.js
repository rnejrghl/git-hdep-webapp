import React from 'react';
import { useHistory } from 'react-router-dom';
import { Layout, Row, Col } from 'antd';
import styled from 'styled-components';
import { CustomIcon, UserInfo, Language } from '@/components/commons';

import hanwha_header_logo from '@/assets/hanwha_header_logo.png';

const { Header } = Layout;

const StyleHedaerLogo = styled.div`
  background-image: url(${hanwha_header_logo});
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
`;

// styled component
const StyledCol = styled(Col)`
  vertical-align: middle;
  cursor: pointer;
`;

const RightAlignCol = styled(Col)`
  text-align: right;
  flex: 1 1 auto;
  cursor: pointer;
`;

const StyledCustomIcon = styled(CustomIcon)`
  vertical-align: middle;
`;

const StyledCustomIconSm = styled(StyledCustomIcon)`
  padding: 3px;
  width: 16px;
  height: 16px;
`;

const StyledSpan = styled.span`
  display: inline-block;
  height: ${styleProps => styleProps.theme.layoutHeaderHeight};
  line-height: ${styleProps => styleProps.theme.layoutHeaderHeight};
`;

const StyledHeader = styled(Header)`
  padding-right: 20px;
`;

function HeaderComponent(props) {
  const history = useHistory();

  const handleDrawer = e => {
    if (e) {
      e.stopPropagation();
    }
    props.onHandleDrawer();
  };

  const onMove = path => {
    return history.push(path);
  };

  return (
    <StyledHeader>
      <Row type="flex" justify="start" align="middle" className="header">
        <StyledCol style={{ padding: '0 20px' }} onClick={handleDrawer}>
          {props.visible ? <StyledCustomIconSm type={require('@/assets/close.svg')} /> : <StyledCustomIconSm type={require('@/assets/menu.svg')} />}
        </StyledCol>
        <StyledCol onClick={() => onMove('/')} style={{ width: '135.3px', height: '47px' }}>
          <StyleHedaerLogo></StyleHedaerLogo>
        </StyledCol>
        <RightAlignCol>
          <StyledSpan style={{ padding: '0 20px' }}>
            <StyledCustomIconSm type={require('@/assets/bell.svg')} style={{ padding: '2px 3px' }} />
          </StyledSpan>
          <UserInfo root="header" />
          <StyledSpan>
            <Language />
          </StyledSpan>
        </RightAlignCol>
      </Row>
    </StyledHeader>
  );
}

export default HeaderComponent;
