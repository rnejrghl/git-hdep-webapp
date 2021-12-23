import React from 'react';

import { Row, Col, Statistic } from 'antd';
import { Summary as CommonSummary } from '@/components/commons';
import { service, locale } from '@/configs';
import { values } from './configs';

const lang = service.getValue(locale, 'languages', {});

const getColor = status => {
  return status === 'normal' ? '#333' : status === 'up' ? '#2c79f4' : '#ff513f';
};

const makeData = (dataSource = {}) => {
  return values.summaryValue.reduce((result, item) => {
    let newItem = {};

    if (item.chartData) {
      newItem['children'] = (
        <Row type="flex" justify="space-between" align="middle" style={{ maxHeight: '86px' }}>
          <Col span={24}>
            <Statistic
              title={item.title}
              value={service.getValue(dataSource, `${item.dataIndex}`, 0)}
              formatter={value => {
                const totalAmt = service.getValue(dataSource, `${item.dataIndex}`, 0);
                const innerValue = service.getValue(dataSource, `${item.chartData.dataIndex}`, 0);
                const perAmount = service.getFixed((totalAmt / innerValue) * 100, 2);
                const status = parseInt(perAmount, 10) === 0 ? 'normal' : innerValue > 0 ? 'up' : 'down';
                const color = getColor(status);
                return status ? (
                  <>
                    <p className="title" key="title">
                      {value} <span>{item.unit}</span>
                    </p>
                    {/*<p className="sub-title" key="sub-title" style={{ color }}>*/}
                    {/*  {`${service.getValue(lang, 'LANG00062', 'no-text')} ${perAmount} ${item.chartData.unit} ${status === 'up' ? '상승' : status === 'down' ? '하락' : ''}`}*/}
                    {/*</p>*/}
                  </>
                ) : (
                  <p className="sub-title" style={{ color }}>
                    {`${service.getValue(lang, 'LANG00062', 'no-text')} ${perAmount} ${item.chartData.unit} ${status === 'up' ? '상승' : status === 'down' ? '하락' : ''}`}
                  </p>
                );
              }}
            />
          </Col>
        </Row>
      );
      newItem['boxOrange'] = true;
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
