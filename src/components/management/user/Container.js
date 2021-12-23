import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { UseFullLayout, ContainerLayout } from '@/layouts';

import { fetch } from '@/store/actions';
import { service } from '@/configs';

import Content from './Content';
import { api } from '../configs';

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
      const obj = api.getUsers(newParams);
      const menuRoles = api.getMenuRoleList();
      const inqRoles = api.getInqRoleList();

      dispatch(fetch.getPage(obj.url, obj.params));
      dispatch(
        fetch.getMultipleList([
          { id: 'menuRoles', url: menuRoles.url, params: menuRoles.params },
          { id: 'inqRoles', url: inqRoles.url, params: inqRoles.params }
        ])
      );
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

  return (
    <ContainerLayout>
      <Content onFetchEvents={onEvents} data={data} />
    </ContainerLayout>
  );
}

export default UseFullLayout(Container);
