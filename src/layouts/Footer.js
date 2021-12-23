import React from 'react';
import styled from 'styled-components';

import { CustomIcon } from '@/components/commons';
import footer_Image from '@/assets/footer_Image.png';

const StyleFooter = styled.div`
  line-height: 35px;
  font-size: 10px;
  background-color: ${styleProps => (styleProps.props.page === 'login' ? 'transparent' : styleProps.theme.layoutHeaderBackground)};
  color: ${styleProps => (styleProps.props.page === 'login' ? styleProps.theme.black : styleProps.theme.white)};
  margin-bottom: ${styleProps => (styleProps.props.page === 'login' ? '47px' : '0')};
  float: right;
`;

const StyleImageDiv = styled.div`
  background-image: url(${footer_Image});
  background-repeat: no-repeat;
  float: right;
  width: 7vw;
  margin: 0px 2.4vw 3.5vw 1vw;
  height: 5vh;
  float: right;
  background-size: contain;
`;
const StyleTextVeiw = styled.div`
  color: #ffffff;
  float: left;
  font-size: 0.6vw;
  margin-top: -10px;
`;

function Footer(props) {
  const { page } = props;

  const getText = () => {
    if (page === 'login') {
      // return <span style={{ color: '#93939a'}}>asdf</span>;
      return (
        <>
          <StyleTextVeiw>INSPIRED BY</StyleTextVeiw>
          <a href="http://heis.hanwha.com/HOMS/login.do" target="_blank">
            <StyleImageDiv></StyleImageDiv>
          </a>
        </>
      );
    }
    return 'COPYRIGHTS(c) 2020 HANWHA ENERGY CORPORATION. ALL RIGHTS RESERVED.';
  };

  return (
    <StyleFooter props={props}>
      <p>{getText()}</p>
    </StyleFooter>
  );
}

export default Footer;
