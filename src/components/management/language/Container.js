import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { UseFullLayout, ContainerLayout } from '@/layouts';

import { fetch } from '@/store/actions';
import { service } from '@/configs';

import Content from './Content';
import { api } from '../configs';

function Container() {
  const dispatch = useDispatch();
  const data = useSelector(state => service.getValue(state.fetch, 'page', []), shallowEqual);
  const [fetched, setFetched] = useState(true);

  useEffect(() => {
    const fetching = refetch => {
      if (!refetch) {
        return;
      }
      const obj = api.getLangList();
      dispatch(fetch.getPage(obj.url, obj.params));
      setFetched(false);
    };
    fetching(fetched);
    return () => {
      dispatch(fetch.resetPage());
    };
  }, [dispatch, fetched, setFetched]);

  const onEvents = useCallback(
    events => {
      const { method } = events;
      if (method === 'refetch') {
        return setFetched(true);
      }
      return null;
    },
    [setFetched]
  );

  const getData = useCallback((obj = {}) => {
    if (Array.isArray(obj)) {
      return obj;
    }
    return [];
  }, []);

  const dataSource = useMemo(() => getData(data), [getData, data]);

  return (
    <ContainerLayout>
      <Content onFetchEvents={onEvents} data={dataSource} />
    </ContainerLayout>
  );
}

export default UseFullLayout(Container);
