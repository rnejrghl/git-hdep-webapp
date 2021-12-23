import React from 'react';
import { Row, Col } from 'antd';

const defaultDecimal = 2;

const service = {
  getValue: (obj, key, defaultValue) => {
    if (!obj) {
      return defaultValue;
    }

    if (!key) {
      return defaultValue;
    }

    const keys = key.split('.');
    let value = obj;
    for (let i = 0, len = keys.length; i < len; i += 1) {
      const newValue = value[keys[i]];
      if (!newValue) {
        return defaultValue;
      }
      value = newValue;
    }
    return value;
  },
  amount: (value = 0) => {
    if (!value) {
      return 0;
    }
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  getFixed: (value, decimal = defaultDecimal, needDecimal = false) => {
    if (!value) {
      return 0;
    }
    const convertValue = typeof value === 'string' ? parseFloat(value) : value;
    if (needDecimal) {
      return convertValue.toFixed(decimal);
    }
    return Number(convertValue.toFixed(decimal));
  },
  getCapacity: (record = null, needValue = false) => {
    const keys = ['pvInstCapa', 'essInstCapa'];
    const list = Object.keys(record).filter(key => keys.includes(key));

    if (!record || !list.length) {
      return null;
    }
    if (needValue) {
      return list.reduce((result, key) => {
        const name = key === 'pvInstCapa' ? 'PV' : 'ESS';
        const value = service.getValue(record, `${key}`, 0);
        result[name] = value;
        return result;
      }, {});
    }

    const RsType = service.getValue(record, 'rescGubn', null);

    return (
      <Row key="capacity">
        {list.map(key => {
          if (RsType === 'A' && key !== 'pvInstCapa') {
            return null;
          }
          const name = key === 'pvInstCapa' ? 'PV' : 'ESS';
          const value = service.getValue(record, `${key}`, 0);
          return <Col key={key} span={24}>{`${name} : ${value}`}</Col>;
        })}
      </Row>
    );
  }
};

export default service;
