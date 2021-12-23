import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, Form, Input, Button, Row, Col, Layout, Modal } from 'antd';
import styled from 'styled-components';
import UAParser from 'ua-parser-js';

import { api, Fetcher, service, locale } from '@/configs';
import { auth } from '@/store/actions';
import { CustomIcon, Spinner } from '@/components/commons';

import hanwhaEnergy from '@/assets/hanwhaEnergy.png';
import HDEP from '@/assets/HDEP.png';
import login_spr from '@/assets/login_spr.png';

import '@/styles/app/login.scss';

const parser = new UAParser();
const isMobile = parser.getDevice().type === 'mobile';

const StyleLeftDiv = styled.div`
  background-image: url(${login_spr});
  width: 60vw;
  height: 91vh;
  background-repeat: no-repeat;
  margin-left: 7%;
  float: left;
  margin-top: 2%;
  background-size: contain;
`;

const StyleRightDiv = styled.div`
  width: 32vw;
  height: 99vh;
  top: 15%;
  float: right;
  box-shadow: 0 0 5px RGBA(0, 0, 0, 0.29);
`;

const StyleLogoWrap = styled.div`
  width: 20vw;
  height: 7vw;
  margin-top: 24%;
  margin-left: 13%;
  background-size: contain;
`;

const StyleHanwhaImage = styled.div`
  background-image: url(${hanwhaEnergy});
  width: 17vw;
  height: 4vw;
  margin-left: 9%;
  background-size: contain;
  background-repeat: no-repeat;
`;
const StyleDEPImage = styled.div`
  background-image: url(${HDEP});
  width: 11vw;
  height: 4vw;
  margin-left: 25%;
  background-size: contain;
  background-repeat: no-repeat;
`;

const StyleInput = styled(Input)`
  color: ${styleProps => styleProps.theme.white};
  background-color: ${styleProps => styleProps.theme.black};
  border: 1px solid #707070;
  line-height: 24px;
  font-size: 14px;

  &::placeholder {
    color: ${styleProps => styleProps.theme.white};
  }
`;

const StyledCol = styled(Col)`
  align-self: flex-end;
  top: 15%;
  margin-left: 20%;
  width: 18vw;
`;

const StyledButton = styled(Button)`
  background-color: ${styleProps => styleProps.theme.layoutHeaderBackground};
  border-color: ${styleProps => styleProps.theme.layoutHeaderBackground};
  font-size: 14px;
`;

function Login(props) {
  const { getFieldDecorator, setFieldsValue } = props.form;
  const dispatch = useDispatch();
  const { isLogined } = useSelector(state => service.getValue(state, 'common'));

  useEffect(() => {
    setFieldsValue({
      userId: service.getValue(props.location, 'state.userId', [])
    });
  }, []);

  useEffect(() => {
    dispatch(auth.logout());
  }, [dispatch]);

  const onLogin = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const { url, params } = api.login(values.userId, values.password);

        let failTitle = 'Login Failed';
        let failMsg = 'That is the wrong userid or password.';

        const langType = service.getValue(locale, 'language', 'en-US');
        if (langType === 'ko-KR') {
          failTitle = '로그인실패';
          failMsg = '계정이 존재하지 않거나 ID 또는 비밀번호가 정확하지 않습니다.';
        }

        return Fetcher.login(url, params)
          .then(res => {
            if (service.getValue(res, 'success', false)) {
              dispatch(auth.login({ user: res.data }));
              return null;
            }
            return Modal.confirm({
              title: failTitle,
              cancelButtonProps: {
                style: { display: 'none' }
              },
              content: failMsg
            });
          })
          .catch(() => {
            return Modal.confirm({
              title: failTitle,
              cancelButtonProps: {
                style: { display: 'none' }
              }
            });
          });
      }
      return null;
    });
  };

  return (
    <>
      <div>
        <StyleLeftDiv></StyleLeftDiv>

        <StyleRightDiv>
          <StyleLogoWrap>
            <StyleHanwhaImage></StyleHanwhaImage>
            <StyleDEPImage></StyleDEPImage>
          </StyleLogoWrap>

          <StyledCol span={isMobile ? 22 : 6}>
            <Form onSubmit={onLogin} className="login-form">
              <Form.Item>
                {getFieldDecorator('userId', {
                  rules: [{ required: true, message: 'Please input your ID!' }]
                })(<StyleInput placeholder="UserID" />)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input your Password!' }]
                })(<StyleInput type="password" placeholder="Password" />)}
              </Form.Item>
              <Form.Item>
                <StyledButton type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
                  {'Login'.toUpperCase()}
                </StyledButton>
              </Form.Item>
              <Form.Item></Form.Item>
            </Form>
          </StyledCol>
        </StyleRightDiv>
      </div>

      {isLogined ? <Spinner tip="Loading" size="large" /> : null}
    </>
  );
}

export default Form.create()(Login);
