import React from 'react';
import { useDispatch } from 'react-redux';

import { common } from '@/store/actions';
import { WithContentLayout } from '@/layouts';
import { EditableTable, ButtonWrap, ExcelButton } from '@/components/commons';
import { service, Fetcher } from '@/configs';

import { columns, api } from '../configs';

function Content(props) {
  const { data = [], onFetchEvents } = props;
  const dispatch = useDispatch();

  const onEvents = events => {
    const { method, payload } = events;

    if (!method) {
      return null;
    }

    if (Object.keys(payload).length) {
      if (method === 'submit') {
        const obj = api.updateLang(payload);
        dispatch(common.loadingStatus(true));
        return Fetcher.post(obj.url, obj.params).then(result => {
          dispatch(common.loadingStatus(false));
          if (service.getValue(result, 'success', false)) {
            return onFetchEvents({ method: 'refetch' });
          }
        });
      }
    }
    return null;
  };

  return (
    <div style={{ padding: '20px 20px 0' }}>
      <ButtonWrap left={[]} right={[<ExcelButton href="/common/langList/excel" />]} style={{ padding: '0px 0 20px' }} />

      <EditableTable columns={columns.languageColumns} dataSource={data} scroll={{ x: '100%', y: 'calc(100vh - 252px)' }} onEvents={onEvents} inputType="input" />
    </div>
  );
}

export default WithContentLayout(Content);
