import React from 'react';
import { Col, Row, Form, Input, Button, Typography, Radio } from 'antd';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const { Text } = Typography;

const StyledCol = styled(Col)`
  max-width: '280px';
  // align-self: flex-end;
`;

function IdLookupResult(props) {
  const history = useHistory();

  const { userIds = [] } = props;

  const { getFieldDecorator, getFieldValue, validateFields } = props.form;

  const handleLoginButton = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        history.push({
          pathname: '/login',
          state: { userId: getFieldValue('userIdGroup') }
        });
      }
    });
  };

  const handlePwLookupButton = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        history.push({
          pathname: '/lookup/pwLookup',
          state: { userId: getFieldValue('userIdGroup') }
        });
      }
    });
  };

  return (
    <Form className="login-form">
      <Form.Item>
        {getFieldDecorator('userIdGroup', {
          rules: [{ required: true, message: 'Please select' }]
        })(
          <Radio.Group>
            {userIds.map((value, index) => {
              return (
                <Radio style={{ display: 'block' }} value={value.userId} key={index}>
                  <Text strong>{value.userId}</Text> <Text type="secondary">가입 : ----.--.--</Text>
                </Radio>
              );
            })}
          </Radio.Group>
        )}
        {!userIds.length ? <Text strong>wrong</Text> : null}
      </Form.Item>
      <Form.Item>
        <Row gutter={8}>
          <Col span={12}>
            <Button type="primary" htmlType="button" style={{ width: '100%' }} value="login" onClick={handleLoginButton}>
              {'로그인'}
            </Button>
          </Col>

          <Col span={12}>
            <Button type="primary" htmlType="button" style={{ width: '100%' }} value="pwLookup" onClick={handlePwLookupButton}>
              {'비밀번호 찾기'}
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
}

export default Form.create()(IdLookupResult);
