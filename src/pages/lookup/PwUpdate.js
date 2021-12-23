import React, { useEffect } from 'react';
import { Col, Layout, Row, Form, Input, Button, Typography, Icon, Tooltip } from 'antd';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { api, Fetcher, service } from '@/configs';

const { Text } = Typography;

const StyledCol = styled(Col)`
  max-width: '280px';
  // align-self: flex-end;
`;

function PwUpdate(props) {
  const history = useHistory();
  const { getFieldDecorator, validateFields, getFieldValue } = props.form;

  const { userId, resetToken } = props;

  useEffect(() => {
    if (!userId) {
      history.replace('/login');
    }
  }, []);

  const handleSubmit = e => {
    e.preventDefault();

    validateFields((err, values) => {
      if (!err) {
        const requestObj = api.updatePassword(resetToken, { ...values });

        return Fetcher.post(requestObj.url, requestObj.params).then(result => {
          if (service.getValue(result, 'success', false)) {
            history.replace('/login');
          }
        });
      }
    });
  };

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== getFieldValue('newPassword')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    if (value) {
      validateFields(['confirm'], { force: true });
    }
    callback();
  };

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        <Text strong>HDEP Id: </Text> <Text mark>{userId}</Text>
      </Form.Item>
      <Form.Item hasFeedback>
        {getFieldDecorator('newPassword', {
          rules: [
            {
              required: true,
              message: 'Please input your password!'
            },
            {
              validator: validateToNextPassword
            }
          ]
        })(<Input.Password placeholder="New password" />)}
      </Form.Item>
      <Form.Item hasFeedback>
        {getFieldDecorator('confirm', {
          rules: [
            {
              required: true,
              message: 'Please confirm your password!'
            },
            {
              validator: compareToFirstPassword
            }
          ]
        })(<Input.Password placeholder="Confirm password" />)}
      </Form.Item>
      <Form.Item>
        <Text strong>영문, 숫자, 특수문자를 함께 사용하면(8자 이상 16자 이하)보다 안전합니다.</Text>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          {'Next'.toUpperCase()}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Form.create()(PwUpdate);
