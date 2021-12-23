import React from 'react';
import { Row, Col, Statistic, Steps } from 'antd';
import styled from 'styled-components';
import { Summary as CommonSummary } from '@/components/commons';
import { values } from './configs';

import { service } from '@/configs';

const { Step } = Steps;

const StyledSteps = styled(Step)`
  & .ant-steps-item-tail {
    display: none !important;
  }
  & .ant-steps-item-icon {
    display: none !important;
  }
  & .ant-steps-item-content {
    margin-top: 0 !important;

    .ant-steps-item-description {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-around;
      align-content: center;

      & span {
        flex: 0 0 auto;
      }

      &::after {
        content: '';
        display: inline-block;
        width: auto;
        flex: 1 1 auto;
        border-bottom: 1px dashed ${styleProps => styleProps.theme.borderColor};
        height: 12px;
        margin: 0 8px;
      }
    }
  }

  &:last-child {
    .ant-steps-item-content {
      .ant-steps-item-description {
        & span {
          flex: 1 1 auto;
        }
        &::after {
          display: none;
        }
      }
    }
  }
`;

const makeData = (dataSource = {}) => {
  return values.summaryValue.reduce((result, item) => {
    let newItem = {};

    if (item.stepData) {
      newItem = {
        title: item.title,
        value: service.getValue(dataSource, `${item.dataIndex}`, 0),
        unit: item.unit,
        span: item.span,
        children: (
          <Row type="flex" justify="space-between" align="middle" key={item.title}>
            <Col span={24}>
              <Statistic
                title={item.title}
                value={null}
                formatter={value => {
                  return (
                    <Steps progressDot size="small" status="wait">
                      {item.stepData.map(step => {
                        return <StyledSteps key={step.dataIndex} title={service.getValue(dataSource, `${step.dataIndex}`, 0)} description={<span>{step.description}</span>} />;
                      })}
                    </Steps>
                  );
                }}
              />
            </Col>
          </Row>
        ),
        boxOrange: true
      };
    } else {
      newItem = {
        title: item.title,
        value: service.getValue(dataSource, `${item.dataIndex}`, 0),
        unit: item.unit,
        span: item.span,
        boxOrange: true
      };
    }
    result.push(newItem);
    return result;
  }, []);
};

function Summary(props) {
  return <CommonSummary data={makeData(props.dataSource)} />;
}

export default Summary;
