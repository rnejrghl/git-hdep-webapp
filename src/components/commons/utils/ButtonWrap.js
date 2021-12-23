import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Button } from 'antd';
import { service } from '@/configs';

function renderCol(props, align) {
  const btns = service.getValue(props, `${align}`, []);

  if (!btns.length) {
    return null;
  }

  const onClick = (e, btn) => {
    if (e) {
      e.preventDefault();
    }

    switch (btn.roll) {
      case 'submit':
        return props.onEvents && props.onEvents();
      default:
        return btn.onClick();
    }
  };
  return (
    <Row type="flex" justify={align === 'left' ? 'start' : 'end'} align="middle" gutter={10}>
      {btns.map((btn, idx) => {
        if (service.getValue(btn, '$$typeof', false)) {
          return <Col key={btn.roll || idx}>{btn}</Col>;
        }
        return (
          <Col key={btn.roll || idx}>
            <Button {...btn} onClick={e => onClick(e, btn)} style={service.getValue(btn, 'style', {})} type={service.getValue(btn, 'type', 'default')}>
              {btn.label}
            </Button>
          </Col>
        );
      })}
    </Row>
  );
}

function ButtonWrap(props) {
  return (
    <Row type="flex" justify="space-between" align="middle" style={service.getValue(props, 'style', {})}>
      <Col>{renderCol(props, 'left')}</Col>
      <Col style={{ textAlign: 'right' }}>{renderCol(props, 'right')}</Col>
    </Row>
  );
}

ButtonWrap.propTypes = {
  left: PropTypes.arrayOf(() => {
    return {
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['primary', 'ghost', 'dashed', 'danger', 'link', 'default']),
      style: PropTypes.object,
      onClick: PropTypes.func
    };
  }),
  right: PropTypes.arrayOf(() => {
    return {
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['primary', 'ghost', 'dashed', 'danger', 'link', 'default']),
      style: PropTypes.object,
      onClick: PropTypes.func
    };
  }),
  onEvents: PropTypes.func,
  style: PropTypes.object
};

ButtonWrap.defaultProps = {
  left: [],
  right: [],
  style: {},
  onEvents: () => {}
};

export default ButtonWrap;
