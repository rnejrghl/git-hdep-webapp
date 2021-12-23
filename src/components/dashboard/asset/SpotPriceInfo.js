import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { locale, service } from '@/configs';
import styled from 'styled-components';

const StyledDivTitle = styled.div`
  margin-bottom: 10px;
  font-weight: bold;
`;

const StyledDivWapper = styled.div`
  margin-top: '12px';
`;

const StyledDivBar = styled.div`
  display: inline-block;
  height: 30px;
  width: 8px;
  border-radius: 6px;
  background-color: ${styleProps => styleProps.color};
  vertical-align: middle;
  margin-right: 5px;
`;

const StyledDotWrapper = styled.div`
  display: inline-block;
  height: 30px;
  width: 8px;
  vertical-align: middle;
  margin-right: 5px;
`;

const StyledDotDiv = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-bottom: 3px;
  background-color: ${styleProps => styleProps.color};
`;

const StyledDivVal = styled.div`
  font-weight: 700;
  font-size: 20px;
  vertical-align: middle;
  display: inline-block;
`;

const StyledDivUnit = styled.div`
  display: inline-block;
  font-size: 9px;
  vertical-align: bottom;
  margin-left: 5px;
`;

function SpotPriceInfo(props) {
  const { chartData = {} } = props;

  const [crPrice, setCrPrice] = useState(0);
  const [crDemand, setCrDemand] = useState(0);
  const [frPrice, setFrPrice] = useState(0);
  const [frDemand, setFrDemand] = useState(0);

  useEffect(() => {
    if (Object.keys(chartData).length > 0) {
      //finalIndex_Y 마지막 Y 번쨰 index 추출 (중간에 N 있어도 마지막 Y INDEX찾음)
      const index = chartData.spotChartData
        .slice()
        .reverse()
        .findIndex(item => item['currentYn'] === 'Y');
      const count = chartData.spotChartData.length - 1;
      const finalIndex_Y = index >= 0 ? count - index : index;

      const crData = chartData.spotChartData.filter((item, index) => index === finalIndex_Y);
      const frData = chartData.spotChartData.filter((item, index) => index === finalIndex_Y + 1);
      setCrPrice(crData.map(data => data.rrp));
      setCrDemand(Math.round(crData.map(data => data.demand)).toLocaleString());
      setFrPrice(frData.map(data => data.rrp));
      setFrDemand(Math.round(frData.map(data => data.demand)).toLocaleString());
    }
  }, [chartData]);

  return (
    <>
      <Row type="flex" justify="space-around" style={{ marginTop: '10px' }}>
        <Col span={11}>
          <StyledDivTitle>CURRENT SPOT PRICE</StyledDivTitle>
          <StyledDivWapper>
            <StyledDivBar color="rgb(255 135 0)"></StyledDivBar>
            <StyledDivVal>${crPrice}</StyledDivVal>
            <StyledDivUnit>(/MWH)</StyledDivUnit>
          </StyledDivWapper>
        </Col>
        <Col span={11}>
          <StyledDivTitle>CURRENT DEMAND</StyledDivTitle>
          <StyledDivWapper>
            <StyledDivBar color="rgb(0 101 108)"></StyledDivBar>
            <StyledDivVal>{crDemand}</StyledDivVal>
            <StyledDivUnit>(MW)</StyledDivUnit>
          </StyledDivWapper>
        </Col>
      </Row>
      <Row type="flex" justify="space-around" style={{ marginTop: '20px' }}>
        <Col span={11}>
          <StyledDivTitle>
            FORECAST PRICE <br /> (NEXT 30MIN)
          </StyledDivTitle>
          <StyledDivWapper>
            <StyledDotWrapper>
              <StyledDotDiv color="rgb(201, 126, 108)"></StyledDotDiv>
              <StyledDotDiv color="rgb(201, 126, 108)"></StyledDotDiv>
              <StyledDotDiv color="rgb(201, 126, 108)"></StyledDotDiv>
            </StyledDotWrapper>
            <StyledDivVal>${frPrice}</StyledDivVal>
            <StyledDivUnit>(/MWH)</StyledDivUnit>
          </StyledDivWapper>
        </Col>
        <Col span={11}>
          <StyledDivTitle>
            FORECAST DEMAND <br /> (NEXT 30MIN)
          </StyledDivTitle>
          <StyledDivWapper>
            <StyledDotWrapper>
              <StyledDotDiv color="rgb(2, 95, 179)"></StyledDotDiv>
              <StyledDotDiv color="rgb(2, 95, 179)"></StyledDotDiv>
              <StyledDotDiv color="rgb(2, 95, 179)"></StyledDotDiv>
            </StyledDotWrapper>
            <StyledDivVal>{frDemand}</StyledDivVal>
            <StyledDivUnit>(MW)</StyledDivUnit>
          </StyledDivWapper>
        </Col>
      </Row>
    </>
  );
}

export default SpotPriceInfo;
