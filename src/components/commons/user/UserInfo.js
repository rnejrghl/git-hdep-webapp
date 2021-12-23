import React, { useMemo, useCallback, useState } from 'react';
import UAParser from 'ua-parser-js';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Dropdown, Menu, Modal, Form, Input } from 'antd';
import { Button } from 'antd-mobile';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { common } from '@/store/actions';
import { ButtonWrap } from '@/components/commons';
import { service, locale, values, Fetcher, api } from '@/configs';

const parser = new UAParser();
const lang = service.getValue(locale, 'languages', {});

const StyledButton = styled(Button)`
  color: ${styleProps => styleProps.theme.layoutHeaderBackground} !important;
  background-color: ${styleProps => styleProps.theme.borderColorBase} !important;
  height: 20px;
  line-height: 20px;
  border-radius: 4px;
  padding: 0 10px;

  &::before {
    border-color: ${styleProps => styleProps.theme.borderColorBase} !important;
  }
`;

const StyledSpan = styled.span`
  display: inline-block;
  height: ${styleProps => styleProps.theme.layoutHeaderHeight};
  line-height: ${styleProps => styleProps.theme.layoutHeaderHeight};
  color: ${styleProps => styleProps.theme.white};
`;

const StyledUserName = styled.span`
  display: inline-block;
  min-width: 100px;
  text-align: left;
  padding: 0 10px 0 0;
  color: ${styleProps => styleProps.theme.white};
`;

function UserInfo(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { getFieldDecorator, validateFields } = props.form;

  const [visible, setVisible] = useState(false);
  const { user = {} } = useSelector(state => service.getValue(state, 'auth', {}), shallowEqual);

  const onLogout = useCallback(() => {
    history.push('/login');
  }, [history]);

  const getMenu = useCallback(() => {
    return (
      <Menu style={{ width: 205 }} className="user-info-menu">
        <Menu.Item onClick={() => setVisible(true)}>{service.getValue(lang, 'LANG00307', 'no-text')}</Menu.Item>
        <Menu.Item onClick={() => onLogout()}>Log Out</Menu.Item>
      </Menu>
    );
  }, [setVisible, onLogout]);

  const menus = useMemo(() => getMenu(), [getMenu]);

  const isMobile = (
    <StyledSpan>
      <div>
        <p style={{ lineHeight: '1.3' }}>{service.getValue(user, 'userNm', '')}</p>
        <StyledButton inline size="small" type="primary" onClick={() => onLogout()}>
          Log Out
        </StyledButton>
      </div>
    </StyledSpan>
  );

  const isWeb = (
    <Dropdown overlay={menus} placement="bottomRight">
      <StyledUserName>{service.getValue(user, 'userNm', '')}</StyledUserName>
    </Dropdown>
  );

  const onSave = useCallback(() => {
    validateFields((err, fieldValues) => {
      if (!err) {
        const params = {
          pswd: service.getValue(fieldValues, 'pswd', null),
          newPswd: service.getValue(fieldValues, 'newPswd', null),
          userId: service.getValue(user, 'userId', null)
        };
        if (Object.keys(params).some(key => !params[key])) {
          return Modal.error({
            title: service.getValue(lang, 'LANG00296', 'no-text'),
            icon: null
          });
        }
        const obj = api.changePassword(params);
        dispatch(common.loadingStatus(true));
        return Fetcher.post(obj.url, obj.params).then(result => {
          dispatch(common.loadingStatus(false));
          if (service.getValue(result, 'success', false)) {
            return Modal.success({
              title: service.getValue(lang, 'LANG00333', 'no-text'),
              content: service.getValue(lang, 'LANG00334', 'no-text'),
              icon: null,
              onOk: () => setVisible(false)
            });
          }
          return Modal.error({
            title: service.getValue(lang, 'LANG00296', 'no-text'),
            content: service.getValue(lang, 'LANG00335', 'no-text'),
            icon: null
          });
        });
      }
      return null;
    });
  }, [dispatch, setVisible, validateFields, user]);

  const onClickButton = useCallback(
    button => {
      switch (button.roll) {
        case 'cancel':
          return setVisible(false);
        case 'save':
          return onSave();
        default:
          break;
      }
      return null;
    },
    [setVisible, onSave]
  );

  const getModal = useCallback(() => {
    const matched = values.userInfo.modal;
    const footer = service.getValue(matched, 'footer', {});
    return {
      ...matched,
      footer: {
        ...Object.keys(footer).reduce((result, key) => {
          if (Array.isArray(footer[key])) {
            result[key] = values.actionButtons
              .filter(button => footer[key].includes(button.roll))
              .sort((a, b) => a.key - b.key)
              .map(button => {
                return {
                  ...button,
                  onClick: () => onClickButton(button)
                };
              });
          }
          return result;
        }, {})
      }
    };
  }, [onClickButton]);

  const compareToFirstPassword = (rule, value, callback) => {
    const { form } = props;
    if (value && value !== form.getFieldValue('newPswd')) {
      callback(service.getValue(lang, 'LANG00331', 'no-text'));
    } else {
      callback();
    }
  };

  const compareToPrevPassword = (rule, value, callback) => {
    const { form } = props;
    if (value && value === form.getFieldValue('pswd')) {
      callback(service.getValue(lang, 'LANG00332', 'no-text'));
    } else {
      callback();
    }
  };

  const modal = useMemo(() => getModal(), [getModal]);

  return (
    <>
      {parser.getDevice().type === 'mobile' ? (props.root === 'drawer' ? isMobile : null) : isWeb}
      <Modal
        centered
        forceRender
        destroyOnClose
        width="30%"
        maskClosable={false}
        visible={visible}
        title={service.getValue(modal, 'title', '')}
        footer={Object.keys(service.getValue(modal, 'footer', {})).length ? <ButtonWrap right={service.getValue(modal, 'footer.right', [])} left={service.getValue(modal, 'footer.left', [])} /> : null}
        onCancel={() => setVisible(false)}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 10 }} colon={false} labelAlign="left">
          <Form.Item label={service.getValue(lang, 'LANG00286', 'no-text')}>
            {getFieldDecorator('pswd', {
              rules: [{ required: true, message: service.getValue(lang, 'LANG00286', 'no-text') }]
            })(<Input type="password" />)}
          </Form.Item>
          <Form.Item label={service.getValue(lang, 'LANG00287', 'no-text')}>
            {getFieldDecorator('newPswd', {
              rules: [{ required: true, message: service.getValue(lang, 'LANG00287', 'no-text') }, { validator: compareToPrevPassword }]
            })(<Input type="password" />)}
          </Form.Item>
          <Form.Item label={service.getValue(lang, 'LANG00288', 'no-text')}>
            {getFieldDecorator('matched', {
              rules: [{ required: true, message: service.getValue(lang, 'LANG00288', 'no-text') }, { validator: compareToFirstPassword }]
            })(<Input type="password" />)}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Form.create()(UserInfo);
