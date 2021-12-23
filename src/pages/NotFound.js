import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { useHistory } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const NotFound = () => {
  const history = useHistory();

  const onClick = () => {
    console.log('onClick', history);
    if (history.length) {
      return history.goBack();
    }
    return history.push('/');
  };
  return (
    <Row type="flex" justify="center" align="middle" className="not-found">
      <Col span={12}>
        <Title>404</Title>
        <Title level={3}>요청하신 페이지를 찾을 수 없습니다.</Title>
        <Paragraph>삭제되었거나 일시적으로 사용할 수 없는 주소입니다.</Paragraph>

        <div>
          <Button type="primary" onClick={onClick}>
            돌아가기
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default NotFound;
