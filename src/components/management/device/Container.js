import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useParams } from 'react-router-dom';

import { UseFullLayout, ContainerLayout } from '@/layouts';
import { fetch } from '@/store/actions';
import { service } from '@/configs';

import { api } from '../configs';
import Sider from './Sider';
import Content from './Content';

function Container() {
  const dispatch = useDispatch();
  const [params, setParams] = useState({});
  const { id } = useParams();
  const data = useSelector(state => service.getValue(state.fetch, 'page', {}), shallowEqual);

  useEffect(() => {
    const fetching = eqmtGubnCd => {
      if (!eqmtGubnCd) {
        return null;
      }
      const newParams = Object.keys(params)
        .filter(key => params[key])
        .reduce((result, key) => {
          result[key] = params[key];
          return result;
        }, {});
      const obj = api.getDeviceList({ ...newParams, eqmtGubnCd });
      dispatch(fetch.getPage(obj.url, obj.params));
    };
    fetching(id);
    return () => {
      dispatch(fetch.resetPage());
    };
  }, [dispatch, id, params]);

  const onEvents = useCallback(
    events => {
      const { method, payload } = events;
      if (method === 'refetch') {
        return setParams(state => {
          return {
            ...state,
            ...payload
          };
        });
      }
      return null;
    },
    [setParams]
  );

  const getDataSource = useCallback(datasource => {
    if (Array.isArray(datasource)) {
      return datasource;
    }
    if (Object.keys(datasource).length) {
      return [datasource];
    }
    return [];
  }, []);

  const dataSource = useMemo(() => getDataSource(data), [getDataSource, data]);

  return (
    <ContainerLayout>
      <Sider />
      <Content data={dataSource} onFetchEvents={onEvents} />
    </ContainerLayout>
  );
}

export default UseFullLayout(Container);
