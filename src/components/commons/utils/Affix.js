import React from 'react';
import { Row, Col, Button, Affix as AntdAffix } from 'antd';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  min-width: 150px;
`;

const StyledCol = styled(Col)`
  text-align: ${styleProps => styleProps.position};
`;

const StyledRow = styled(Row)`
  padding: 21px 43px 19px 40px;
`;

const StyledAffix = styled(AntdAffix)`
  position: absolute;
  left: 0px;
  right: 0px;
  height: 76px;
  background-color: ${styleProps => styleProps.theme.white};
  z-index: 3;
  width: 100%;
  bottom: 0;

  &.bordered {
    border-top: 1px solid rgba(0, 0, 0, 0.6);
  }
`;

function genCol(btns, position) {
  return (
    <StyledCol position={position} span={12}>
      {btns.map((btn, idx) => {
        return (
          <StyledButton key={btn.key || idx} style={{ ...btn.style, marginLeft: idx === 0 ? '0' : '20px' }} {...btn}>
            {btn.label}
          </StyledButton>
        );
      })}
    </StyledCol>
  );
}

export default function Affix(props) {
  const { bordered = true } = props;
  return (
    <StyledAffix offsetBottom={0} target={() => props.target.current} className={bordered ? 'bordered' : null}>
      <StyledRow type="flex" justify={props.left ? 'space-around' : 'end'} align="middle">
        {props.left && genCol(props.left, 'left')}
        {props.right && genCol(props.right, 'right')}
      </StyledRow>
    </StyledAffix>
  );
}
