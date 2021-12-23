import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { UseFullLayout, ContainerLayout } from '@/layouts';

import { fetch } from '@/store/actions';
import { service } from '@/configs';
import { api } from '../configs';

import Content from './Content';
import Sider from './Sider';

function Container() {
  const dispatch = useDispatch();
  const [refetch, setRefetch] = useState(true);
  const { codeList = [] } = useSelector(state => service.getValue(state.fetch, 'multipleList', {}), shallowEqual);

  useEffect(() => {
    const fetching = () => {
      if (refetch) {
        const obj = api.getCodeList();
        dispatch(fetch.getMultipleList([{ id: 'codeList', url: obj.url, params: obj.params }]));
        setRefetch(state => state && false);
      }
      return null;
    };
    fetching();
    return () => {
      dispatch(fetch.resetMultipleList());
    };
  }, [dispatch, refetch]);

  const onEvents = useCallback(
    events => {
      const { method } = events;
      if (method === 'refetch') {
        return setRefetch(true);
      }
      return null;
    },
    [setRefetch]
  );

  return (
    <ContainerLayout>
      <Sider
        list={codeList.map(item => {
          return {
            grpCd: item.grpCd,
            grpCdName: item.grpCdName
          };
        })}
      />
      <Content data={codeList} onFetchEvents={onEvents} />
    </ContainerLayout>
  );
}

export default UseFullLayout(Container);
