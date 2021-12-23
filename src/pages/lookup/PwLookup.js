import { api, Fetcher, service } from '@/configs';
import { Button, Col, Form, Icon, Input, Modal, Result, Row, Tooltip, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const { Text } = Typography;

const StyledNumberInput = styled(Input)`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

function PwLookup(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const { getFieldDecorator, validateFields } = props.form;

  const { userId } = props;

  useEffect(() => {
    if (!userId) {
      history.replace('/login');
    }
  }, []);

  const handleSubmit = e => {
    e.preventDefault();

    validateFields((err, values) => {
      if (!err) {
        const requestObj = api.checkOtp({ ...values, userId: userId });

        return Fetcher.postWithResponse(requestObj.url, requestObj.params).then(response => {
          if (service.getValue(response, 'data.success', false)) {
            history.push({
              pathname: '/lookup/pwUpdate',
              state: { resetToken: service.getValue(response, 'headers.pw-reset-token', ''), userId: userId }
            });
          } else {
            return Modal.confirm({
              title: 'TODO: 에러 문구',
              cancelButtonProps: {
                style: { display: 'none' }
              },
              content: 'TODO: 에러 문구'
            });
          }
        });
      }
    });
  };

  const handleButton = e => {
    e.preventDefault();

    setLoading(true);

    validateFields(['userName', 'receiver'], (err, values) => {
      if (!err) {
        const requestObj = api.requestOtp({ userName: values.userName, receiver: values.receiver, userId: userId });

        return Fetcher.get(requestObj.url, requestObj.params)
          .then(result => {
            if (service.getValue(result, 'success', false)) {
              return Modal.confirm({
                title: 'TODO: 발송 문구',
                cancelButtonProps: {
                  style: { display: 'none' }
                },
                content: 'TODO: 발송 문구'
              });
            } else {
              return Modal.confirm({
                title: 'TODO: 에러 문구',
                cancelButtonProps: {
                  style: { display: 'none' }
                },
                content: 'TODO: 에러 문구'
              });
            }
          })
          .catch(() => {
            return Modal.confirm({
              title: 'TODO: 에러 문구',
              cancelButtonProps: {
                style: { display: 'none' }
              },
              content: 'TODO: 에러 문구'
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
      setLoading(false);
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        {getFieldDecorator('userName', {
          rules: [{ required: true, message: 'Please input your name!' }]
        })(<Input placeholder="User Name" autoComplete="off" />)}
      </Form.Item>
      <Form.Item>
        <Row gutter={8}>
          <Col span={18}>
            {getFieldDecorator('receiver', {
              rules: [{ required: true, message: 'Please input your email or phone!' }]
            })(<Input placeholder="Email or phone" autoComplete="off" />)}
          </Col>
          <Col span={6}>
            <Button style={{ width: '100%' }} onClick={handleButton} type="primary" loading={loading}>
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('otpNumber', {
          rules: [{ required: true, message: 'Please input your OTP number!' }]
        })(<StyledNumberInput type="number" placeholder="Verification code" autoComplete="off" prefix="H-" />)}
      </Form.Item>
      <Form.Item>
        <Text strong>
          Didn't get your verification number?{' '}
          <Tooltip title="Please check your spam mailbox.">
            <Icon type="question-circle" style={{ color: 'red', fontSize: '1rem' }} />
          </Tooltip>
        </Text>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          {'Next'.toUpperCase()}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Form.create()(PwLookup);
