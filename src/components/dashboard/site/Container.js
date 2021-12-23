import React, { useState, useEffect, useCallback, useMemo } from 'react';
import UAParser from 'ua-parser-js';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Radio, Input } from 'antd';
import styled from 'styled-components';

import { fetch } from '@/store/actions';
import { ContainerLayout, UseFullLayout } from '@/layouts';
import { service, locale } from '@/configs';

import Content from './Content';
import { api } from '../configs';

const { Search } = Input;
const parser = new UAParser();
const isMobile = parser.getDevice().type === 'mobile';

const lang = service.getValue(locale, 'languages', {});

const StyledRadio = styled(Radio)`
  color: ${styleProps => styleProps.theme.white};
`;

const StyleSearch = styled(Search)`
  width: 220px;
  & .ant-input {
    background-color: ${styleProps => styleProps.theme.white};
    border-radius: 0;
    border: none !important;
  }
`;

const StyleContainerLayout = styled(ContainerLayout)`
  height: ${styleProps => `calc(100vh - ${styleProps['data-roll'] ? '112' : '56'}px)`};
`;

function Container() {
  const dispatch = useDispatch();
  const [params, setParams] = useState({
    rescGubn: null,
    userName: null
  });
  const { siteOpeStas = [] } = useSelector(state => service.getValue(state.fetch, 'page', {}), shallowEqual);
  const { codes = [] } = useSelector(state =>
    service
      .getValue(state.auth, 'configs', [])
      .filter(config => config.grpCd === 'CDK-00011')
      .find(config => config)
  );

  useEffect(() => {
    const fetching = () => {
      const newParams = JSON.parse(JSON.stringify(params));
      if (!params.rescGubn) {
        delete newParams['rescGubn'];
      }
      if (!params.userName) {
        delete newParams['userName'];
      }
      const obj = api.getSiteList(newParams);
      dispatch(fetch.getPage(obj.url, obj.params));
    };
    fetching();
    return () => {
      dispatch(fetch.resetPage());
    };
  }, [params, dispatch]);

  const onChangeRadio = e => {
    setParams(state => {
      return {
        ...state,
        rescGubn: e.target.value === 'all' ? null : e.target.value
      };
    });
  };

  const onSearch = (value = null) => {
    setParams(state => {
      return {
        ...state,
        userName: value
      };
    });
  };

  const UtilBox = () => {
    if (isMobile) {
      return null;
    }
    return (
      <div>
        <Radio.Group onChange={onChangeRadio} defaultValue={params.rescGubn || 'all'}>
          {[{ cd: 'all', cdName: 'all' }, ...codes].map(code => {
            return (
              <StyledRadio key={code.cd} value={code.cd}>
                {code.cdName}
              </StyledRadio>
            );
          })}
        </Radio.Group>
        <StyleSearch placeholder="Search" onSearch={onSearch} defaultValue={params.userName} style={{ width: 220 }} />
      </div>
    );
  };

  const getDatas = useCallback(() => {
    return siteOpeStas;
  }, [siteOpeStas]);

  const data = useMemo(() => getDatas(), [getDatas]);

  return (
    <StyleContainerLayout
      className="dashboard-site"
      description={
        <span>
          {service.getValue(lang, 'LANG00053', 'no-text')} : {service.getValue(data, 'length', 0)}
        </span>
      }
      theme="dark"
      util={isMobile ? null : <UtilBox />}
      data-roll={isMobile}
    >
      <Content datas={data} />
    </StyleContainerLayout>
  );
}

export default isMobile ? UseFullLayout(Container) : Container;
