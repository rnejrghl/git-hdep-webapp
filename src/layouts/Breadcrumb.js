import React from 'react';
import { Row, Col, Typography } from 'antd';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import UAParser from 'ua-parser-js';

import { service } from '@/configs';

const { Title, Text } = Typography;
const parser = new UAParser();

// styled component
const StyledRow = styled(Row)`
  height: 56px;
  padding: 0 20px;
  line-height: 56px;
  background-color: ${styleProps => (styleProps.color === 'dark' ? styleProps.theme.cardHeadBackground : styleProps.theme.white)};
  border-bottom: ${styleProps => (styleProps.color === 'dark' ? 'none' : '1px solid #dcdcdc')};
  & .ant-typography {
    margin-bottom: 0;
  }
`;

const StyledCol = styled(Col)`
  margin-left: 25px;
  font-weight: 600;
  flex: 0 0 auto;

  & .ant-typography {
    font-size: 1rem;
    font-family: 'FontLight';
    color: ${styleProps => (styleProps.color === 'dark' ? styleProps.theme.white : styleProps.theme.black)};
    opacity: 0.7;
  }
`;

const StyledTitle = styled(Title)`
  color: ${styleProps => (styleProps.color === 'dark' ? styleProps.theme.white : styleProps.theme.black)} !important;
  strong {
    font-family: 'FontBold';
  }
`;

const StyledUtil = styled(Col)`
  flex: 1 1 auto;
  align-self: flex-end;
  text-align: right;

  & > * {
    color: ${styleProps => (styleProps.color === 'dark' ? styleProps.theme.white : styleProps.theme.black)} !important;
  }
`;

export default function Breadcrumb(props) {
  const language = useSelector(state => service.getValue(state, 'auth.language', 'en-US'));
  const splited = language.split('-');
  const key = splited[0].replace(/\b[a-z]/, letter => letter.toUpperCase());
  const isMobile = parser.getDevice().type === 'mobile';

  return (
    <StyledRow type="flex" align="middle" justify={isMobile ? 'space-between' : 'start'} color={props.theme || null}>
      <Col style={{ flex: '0 0 auto' }}>
        <StyledTitle level={4} strong color={props.theme || null}>
          {service.getValue(props, 'title', false) ? props.title : service.getValue(props.currentRoute, `menu${key}Name`, service.getValue(props.currentRoute, 'menuEnName', null))}
        </StyledTitle>
      </Col>
      {props.description ? (
        <StyledCol color={props.theme}>
          <Text>{props.description}</Text>
        </StyledCol>
      ) : null}
      {props.util ? (
        <StyledUtil style={{ flex: '1 1 auto', alignSelf: 'flex-end' }} color={props.theme}>
          {props.util}
        </StyledUtil>
      ) : null}
    </StyledRow>
  );
}
