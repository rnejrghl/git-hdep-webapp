import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

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
  const [listRefetch, setListRefetch] = useState(false);
  const [dataRefetch, setDataRefetch] = useState(false);
  const { gtwyGroupList = [] } = useSelector(state => service.getValue(state.fetch, 'page', {}));
  const { deviceList = [] } = useSelector(state => service.getValue(state.fetch, 'multipleList', {}));

  useEffect(() => {
    const fetching = () => {
      const obj = api.getGWGroupList();
      dispatch(fetch.getPage(obj.url, obj.params));
      setDataRefetch(state => state && false);
    };
    fetching();
    return () => {
      dispatch(fetch.resetPage());
    };
  }, [dataRefetch, dispatch]);

  useEffect(() => {
    const fetching = gtwyId => {
      if (gtwyId || listRefetch) {
        const newParams = Object.keys(params)
          .filter(key => params[key])
          .reduce((result, key) => {
            result[key] = params[key];
            return result;
          }, {});
        const obj = api.getGWDeviceList({ ...newParams, gtwyId });
        dispatch(fetch.getMultipleList([{ id: 'deviceList', url: obj.url, params: obj.params }]));
        setListRefetch(state => state && false);
      }
    };
    fetching(id);
  }, [dispatch, id, listRefetch, params]);

  const onEvents = useCallback(
    events => {
      const { method, payload = {} } = events;
      switch (method) {
        case 'refetch':
          return setParams(state => {
            return {
              ...state,
              ...payload
            };
          });
        case 'reFetchList':
          return setDataRefetch(true);
        default:
          break;
      }
      return null;
    },
    [setDataRefetch, setParams]
  );

  return (
    <ContainerLayout>
      <Sider list={gtwyGroupList} onFetchEvents={onEvents} />
      <Content data={deviceList} onFetchEvents={onEvents} />
    </ContainerLayout>
  );
}

export default UseFullLayout(Container);
