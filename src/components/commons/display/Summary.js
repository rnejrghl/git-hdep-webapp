import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col, Card, Statistic } from 'antd';

import { service } from '@/configs';

const StyledCard = styled(Card)`
  height: 100%;

  & .ant-card-body {
    padding: 16px 22px;
    height: 100%;
  }
`;

const StyledInnerCard = styled(StyledCard)`
  & .ant-card-body {
    padding: 10px 10px 0 10px;
  }
`;

const renderStatistic = item => {
  return <Statistic title={item.title} value={item.value} suffix={item.unit} />;
};

const renderChildren = children => {
  if (children.length) {
    return renderRow(children, 0, true);
  }
  return children;
};

const renderRow = (data = [], gutter = 0, inner = false) => {
  if (!data.length) {
    return null;
  }
  const spaned = data.reduce(
    (result, item) => {
      result['value'] += service.getValue(item, 'span', 0);
      result['length'] += service.getValue(item, 'span', false) ? 1 : 0;

      return result;
    },
    {
      value: 0,
      length: 0
    }
  );
  const CardNode = inner ? StyledInnerCard : StyledCard;
  return (
    <Row type="flex" justify="space-between" align="stretch" gutter={gutter ? gutter : data.length * 2} className="summary">
      {data.map((item, idx) => {
        return (
          <Col key={idx} span={item.span ? item.span : parseInt((24 - spaned.value) / (data.length - spaned.length), 10)}>
            <CardNode style={item.boxOrange ? { backgroundColor: '#fff3e1', border: '4px solid #f58800' } : {}} bordered={!inner}>
              {item.children ? renderChildren(item.children) : renderStatistic(item)}
            </CardNode>
          </Col>
        );
      })}
    </Row>
  );
};

function Summary({ data, gutter = 24 }) {
  return renderRow(data, gutter);
}

Summary.propTypes = {
  data: PropTypes.arrayOf(() => {
    return {
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      unit: PropTypes.string,
      span: PropTypes.number,
      styles: PropTypes.object,
      children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
    };
  }),
  gutter: PropTypes.number
};

export default Summary;
