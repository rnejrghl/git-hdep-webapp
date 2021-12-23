import React from 'react';
import styled from 'styled-components';
import { Row, Col, Divider } from 'antd';

import { service } from '@/configs';
import { CustomIcon } from '@/components/commons';

const StyledCluster = styled.div`
  width: ${styleProps => (styleProps.count + 1) * 25}px;
  height: ${styleProps => (styleProps.count + 1) * 25}px;
  z-index: ${styleProps => styleProps.count};
  color: ${styleProps => styleProps.theme.white};
`;

const StyledRow = styled(Row)`
  box-sizing: border-box;
  height: 100%;
  padding: 12%;
  border-radius: 50%;
  overflow: hidden;
  align-content: center;
`;

const StyledTitle = styled.p`
  font-size: ${styleProps => (styleProps.count + 1) * 3}px;
  margin-bottom: 4px;
`;

const StyledCount = styled.p`
  font-size: ${styleProps => (styleProps.count + 1) * 4}px;
  color: #00b174;
`;
const StyledCapacity = styled(Row)`
  font-size: ${styleProps => (styleProps.count + 1) * 1}px;
  padding: 0 20%;

  & > .ant-col {
    margin-bottom: 8px;
  }
  &:last-child {
    .ant-col {
      margin-bottom: 0;
    }
  }
`;

const StyledBadge = styled.div`
  top: ${styleProps => (styleProps.type === 'Fault' ? 0 : 'auto')};
  bottom: ${styleProps => (styleProps.type === 'Fault' ? 'auto' : 0)};
  left: ${styleProps => (styleProps.type === 'Fault' ? 'auto' : 0)};
  right: ${styleProps => (styleProps.type === 'Fault' ? 0 : 'auto')};

  width: ${styleProps => (styleProps.total + 1) * 10}px;
  height: ${styleProps => (styleProps.total + 1) * 10}px;
  background-color: ${styleProps => (styleProps.type === 'Fault' ? styleProps.theme.red : styleProps.theme.grey)};
  z-index: ${styleProps => styleProps.length + styleProps.total};
`;

function Cluster(props) {
  const count = parseInt(service.getValue(props, 'siteCnt.total', 0), 10);
  const capacity = service.getCapacity(
    Object.keys(service.getValue(props, 'capacity', {})).reduce((result, key) => {
      result['pvInstCapa'] = parseInt(service.getValue(props, 'capacity.pv', '0'), 10);
      result['essInstCapa'] = parseInt(service.getValue(props, 'capacity.battery', '0'), 10);
      return result;
    }, {}),
    true
  );

  const getBadge = (length, type, total) => {
    return (
      <StyledBadge type={type} total={total} length={parseInt(length, 10)} className="map-cluster-badge">
        <StyledRow type="flex" justify="center" align="middle">
          {total >= 4 ? <Col span={24}>{type}</Col> : null}
          <Col span={24}>{service.amount(length)}</Col>
        </StyledRow>
      </StyledBadge>
    );
  };

  return (
    <StyledCluster className="map-cluster" count={count}>
      <StyledRow type="flex" justify="center" align="middle">
        <Col span={24}>
          <StyledTitle count={count > 6 ? 6 : count < 3 ? 3 : count}>{service.getValue(props, 'regnName', '')}</StyledTitle>
          <StyledCount count={count > 6 ? 6 : count < 3 ? 3 : count}>{service.amount(count)}</StyledCount>
        </Col>
        {count >= 4 ? (
          <Col span={24}>
            <Divider style={{ margin: '10% 0', color: '#d8d8d8' }} />
            {Object.keys(capacity).map(key => {
              return (
                <StyledCapacity key={key} count={count > 6 ? 6 : count < 3 ? 3 : count} type="flex" justify="space-between">
                  <Col span={16} style={{ textAlign: 'left' }}>
                    <CustomIcon type={key === 'PV' ? require('@/assets/pv.svg') : require('@/assets/battery.svg')} style={{ verticalAlign: 'middle', width: 10, height: 10, marginRight: 5 }} /> {key}
                  </Col>
                  <Col span={8}>{service.amount(service.getValue(capacity, `${key}`, 0))}</Col>
                </StyledCapacity>
              );
            })}
          </Col>
        ) : null}
        {parseInt(service.getValue(props, 'siteCnt.al0002', '0'), 10) ? getBadge(service.getValue(props, 'siteCnt.al0002', 0), 'Fault', count) : null}
        {parseInt(service.getValue(props, 'siteCnt.al0003', '0'), 10) ? getBadge(service.getValue(props, 'siteCnt.al0003', 0), 'Offline', count) : null}
      </StyledRow>
    </StyledCluster>
  );
}

export default Cluster;
