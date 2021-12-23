import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { UseFullLayout, ContainerLayout } from '@/layouts';

import { fetch } from '@/store/actions';
import { service } from '@/configs';

import Content from './Content';
import { api } from './configs';

function Container() {
  const dispatch = useDispatch();
  const [params, setParams] = useState({});
  const data = useSelector(state => service.getValue(state.fetch, 'page', {}), shallowEqual);

  useEffect(() => {
    const fetching = () => {
      const newParams = Object.keys(params)
        .filter(key => params[key])
        .reduce((result, key) => {
          result[key] = params[key];
          return result;
        }, {});
      const obj = api.getList(newParams);
      dispatch(fetch.getPage(obj.url, obj.params));
    };
    fetching();
    return () => {
      dispatch(fetch.resetPage());
    };
  }, [params, dispatch]);

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
      <Content onFetchEvents={onEvents} data={dataSource} />
    </ContainerLayout>
  );
}

export default UseFullLayout(Container);
