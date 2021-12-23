import React from 'react';
import { Row, Col, Statistic, Steps, Badge } from 'antd';
import { Summary as CommonSummary } from '@/components/commons';
import { values } from './configs';

import { service } from '@/configs';

const { Step } = Steps;

const makeData = dataSource => {
  return values.summaryValue.reduce((result, item, idx) => {
    const newItem = {};
    if (item.stepData) {
      newItem.children = (
        <Row type="flex" justify="space-between" align="middle" key={idx}>
          <Col span={24}>
            <Statistic
              title={item.title}
              value={null}
              formatter={() => {
                return (
                  <Steps progressDot size="small" current={0}>
                    {item.stepData.map(step => {
                      const value = service.getValue(dataSource, `${step.dataIndex}`, '0');
                      return <Step key={step.dataIndex} title={value} description={<span>{step.description}</span>} />;
                    })}
                  </Steps>
                );
              }}
            />
          </Col>
        </Row>
      );
    }
    if (item.rowData) {
      newItem.children = (
        <Row type="flex" justify="space-between" align="middle" key={idx}>
          <Col span={24}>
            <Statistic
              title={item.title}
              value={null}
              formatter={() => {
                return (
                  <Row type="flex" justify="space-around" align="middle">
                    {item.rowData.map(row => {
                      const value = service.getValue(dataSource, `${row.dataIndex}`, '0');
                      return (
                        <Col key={row.dataIndex} span={parseInt(24 / item.rowData.length, 10)}>
                          <Badge status={row.status || null} color={row.color || null} />
                          <div>
                            <p className="title">{value}</p>
                            <p className="description">{row.description}</p>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                );
              }}
            />
          </Col>
        </Row>
      );
    }

    result.push(newItem);
    return result;
  }, []);
};

function Summary({ dataSource }) {
  return dataSource ? <CommonSummary data={makeData(dataSource)} /> : null;
}

export default Summary;
