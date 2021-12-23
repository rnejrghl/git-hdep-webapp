import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useParams } from 'react-router-dom';

import { UseFullLayout, ContainerLayout } from '@/layouts';
import { fetch } from '@/store/actions';
import { service } from '@/configs';

import { api } from '../configs';
import Content from './Content';
import Sider from './Sider';

function Container() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [listRefetch, setListRefetch] = useState(false);
  const [dataRefetch, setDataRefetch] = useState(false);
  const { menuRoles = [] } = useSelector(state => service.getValue(state.fetch, 'multipleList', {}), shallowEqual);
  const { mainDeph = [] } = useSelector(state => service.getValue(state.fetch, 'page', {}), shallowEqual);

  useEffect(() => {
    const fetching = menuRoleId => {
      if (!menuRoleId) {
        return null;
      }
      const obj = api.getMenuRole({ menuRoleId });
      dispatch(fetch.getPage(obj.url, obj.params));
      setDataRefetch(state => state && false);
      return null;
    };

    fetching(id);

    return () => {
      dispatch(fetch.resetPage());
    };
  }, [dispatch, id, dataRefetch]);

  useEffect(() => {
    const fetching = menuRoleId => {
      if (!menuRoleId || listRefetch) {
        const obj = api.getMenuRoleList();
        dispatch(fetch.getMultipleList([{ id: 'menuRoles', url: obj.url, params: obj.params }]));
        setListRefetch(state => state && false);
      }
    };
    fetching(id);
  }, [dispatch, id, listRefetch]);

  const onEvents = useCallback(
    events => {
      const { method } = events;
      switch (method) {
        case 'refetch':
          return setDataRefetch(true);
        case 'reFetchList':
          return setListRefetch(true);
        default:
          break;
      }
      return null;
    },
    [setListRefetch, setDataRefetch]
  );

  return (
    <ContainerLayout>
      <Sider list={menuRoles} onFetchEvents={onEvents} />
      <Content onFetchEvents={onEvents} data={mainDeph} />
    </ContainerLayout>
  );
}

export default UseFullLayout(Container);
