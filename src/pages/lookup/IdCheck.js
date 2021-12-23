import { api, Fetcher, service } from '@/configs';
import { Button, Col, Form, Input, Modal, Typography } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const { Text } = Typography;

const StyledCol = styled(Col)`
  max-width: '280px';
  // align-self: flex-end;
`;

function IdCheck(props) {
  const history = useHistory();
  const { getFieldDecorator, validateFields } = props.form;

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const requestObj = api.checkUserId({ ...values });

        return Fetcher.get(requestObj.url, requestObj.params).then(result => {
          if (service.getValue(result, 'success', false)) {
            history.push({
              pathname: '/lookup/pwLookup',
              state: { userId: values.userId }
            });
          } else {
            return Modal.confirm({
              title: 'FAIL',
              cancelButtonProps: {
                style: { display: 'none' }
              },
              content: 'FAIL'
            });
          }
        });
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        <Text strong>Find your id</Text>
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('userId', {
          rules: [{ required: true, message: 'Please input your id!' }]
        })(<Input placeholder="UserID" autoComplete="off" />)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          {'Next'.toUpperCase()}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Form.create()(IdCheck);
