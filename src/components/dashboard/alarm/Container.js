import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import styled from 'styled-components';
import { Radio, Input } from 'antd';

import { ContainerLayout } from '@/layouts';
import { fetch } from '@/store/actions';
import { service, locale } from '@/configs';

import Content from './Content';
import { api } from '../configs';

const { Search } = Input;
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

const Container = () => {
  const dispatch = useDispatch();
  const [params, setParams] = useState({
    rescGubn: null
  });
  const data = useSelector(state => service.getValue(state.fetch, 'page', {}), shallowEqual);
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
      // if (!params.userName) {
      //   delete newParams['userName'];
      // }
      const obj = api.getAlarmList(newParams);
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

  const onSearch = (...args) => {
    console.log('onSearch', args);
  };

  const UtilBox = () => {
    return (
      <div>
        <Radio.Group onChange={onChangeRadio} value={params.rescGubn || 'all'}>
          {[{ cd: 'all', cdName: 'all' }, ...codes].map(code => {
            return (
              <StyledRadio key={code.cd} value={code.cd}>
                {code.cdName}
              </StyledRadio>
            );
          })}
        </Radio.Group>
        <StyleSearch placeholder="Search" onSearch={onSearch} style={{ width: 220 }} />
      </div>
    );
  };

  return (
    <ContainerLayout
      className="dashboard-alarm"
      description={
        <span>
          {service.getValue(lang, 'LANG00053', 'no-text')} : {service.getValue(data, 'mainData.length', 0)}
        </span>
      }
      theme="dark"
      util={<UtilBox />}
    >
      <Content data={data} />
    </ContainerLayout>
  );
};

export default Container;
