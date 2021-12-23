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
  const { id } = useParams();
  const [params, setParams] = useState({});

  const data = useSelector(state => service.getValue(state.fetch, 'page', {}), shallowEqual);

  useEffect(() => {
    const fetching = siteId => {
      if (!siteId) {
        return null;
      }
      const newParams = Object.keys(params)
        .filter(key => params[key])
        .reduce((result, key) => {
          result[key] = params[key];
          return result;
        }, {});
      const obj = api.getSite({ ...newParams, siteId });
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

  const getData = useCallback(obj => {
    if (!Object.keys(obj).length) {
      return {};
    }
    return Object.keys(obj).reduce((result, key) => {
      if (key.indexOf('List') > -1) {
        result[key] = obj[key];
      } else {
        result[key] = service.getValue(obj, `${key}.0`, {});
      }
      return result;
    }, {});
  }, []);

  const mergedData = useMemo(() => getData(data), [data, getData]);

  return (
    <ContainerLayout>
      <Sider />
      <Content data={mergedData} onFetchEvents={onEvents} />
    </ContainerLayout>
  );
}

export default UseFullLayout(Container);
