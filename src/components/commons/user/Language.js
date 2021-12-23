import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Dropdown, Menu, Icon } from 'antd';
import styled from 'styled-components';
import { auth } from '@/store/actions';
import { service, languageList, locale } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

const StyledLang = styled.span`
  display: inline-block;
  text-align: left;
  color: ${styleProps => styleProps.theme.white};
`;

function Language() {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState({});
  const { language = 'en-US' } = useSelector(state => service.getValue(state, 'auth', {}), shallowEqual);

  useEffect(() => {
    const getCurrent = () => {
      const matched = languageList.filter(item => item.key === language.split('-')[0]).find(item => item);
      setCurrent(matched);
    };
    getCurrent();
  }, [language]);

  const onClick = useCallback(
    item => {
      dispatch(auth.setLanguage(service.getValue(item, 'dataIndex', 'en-US')));
    },
    [dispatch]
  );

  const getMenus = useCallback(
    list => {
      return (
        <Menu style={{ width: 205 }} className="language-menu">
          {list
            .filter(item => item.dataIndex !== service.getValue(current, 'dataIndex', 'en-US'))
            .map(item => {
              return (
                <Menu.Item key={item.key} onClick={() => onClick(item)}>
                  <img style={{ width: 24, marginRight: 20 }} src={item.icon} alt="lang" />
                  {service.getValue(lang, `${item.code}`, 'no-text')}
                </Menu.Item>
              );
            })}
        </Menu>
      );
    },
    [onClick, current]
  );
  const getText = useCallback(
    list => {
      return list
        .filter(item => item.dataIndex === service.getValue(current, 'dataIndex', 'en-US'))
        .map(item => {
          return service.getValue(lang, `${item.code}`, 'no-text');
        });
    },
    [onClick, current]
  );

  const menus = useMemo(() => getMenus(languageList), [getMenus]);
  const text = useMemo(() => getText(languageList), [getText]);

  return (
    <Dropdown overlay={menus} placement="bottomRight" style={{ height: '100%' }}>
      <StyledLang>
        {service.getValue(current, 'icon', false) ? text : null}
        <Icon type="caret-down" style={{ paddingLeft: '5px', fontSize: '0.7rem' }} />
      </StyledLang>
    </Dropdown>
  );
}

export default Language;
