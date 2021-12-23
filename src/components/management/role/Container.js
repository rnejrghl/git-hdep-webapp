import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
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
  const { roleList = [] } = useSelector(state => service.getValue(state.fetch, 'multipleList', []), shallowEqual);
  const contentData = useSelector(state => service.getValue(state.fetch, 'page', {}), shallowEqual);

  useEffect(() => {
    const fetching = inqGrpId => {
      if (!inqGrpId) {
        return null;
      }
      const obj = api.getRoleData({ inqGrpId });
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
    const fetching = inqGrpId => {
      if (!inqGrpId || listRefetch) {
        const obj = api.getInqRoleList();
        dispatch(fetch.getMultipleList([{ id: 'roleList', ...obj }]));
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
    <ContainerLayout className="management-role-container">
      <Sider list={roleList} onFetchEvents={onEvents} />
      <Content data={contentData} onFetchEvents={onEvents} />
    </ContainerLayout>
  );
}

export default UseFullLayout(Container);
