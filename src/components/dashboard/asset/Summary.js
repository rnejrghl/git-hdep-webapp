import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Button, Card } from 'antd';

import { fetch } from '@/store/actions';
import { CommonTable, CustomIcon } from '@/components/commons';
import { service, locale } from '@/configs';

import { api, columns } from '../configs';

const lang = service.getValue(locale, 'languages', {});

function Summary() {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const data = useSelector(state => service.getValue(state.fetch, 'page', {}), shallowEqual);

  useEffect(() => {
    const fetching = () => {
      const obj = api.getAssetList();
      dispatch(fetch.getPage(obj.url, obj.params));
    };
    fetching();
    return () => {
      dispatch(fetch.resetPage());
    };
  }, [dispatch]);

  const getMergedColumns = useCallback(() => {
    return columns.summaryColumns.map(column => {
      if (column.dataIndex === 'goalCnt') {
        return {
          ...column,
          children: column.children.map(child => {
            if (child.dataIndex === 'sum') {
              child.render = (text, record) => parseInt(service.getValue(record, 'goalCnt.fildPv', 0), 10) + parseInt(service.getValue(record, 'goalCnt.fildPvEss', 0), 10);
            }
            return child;
          })
        };
      }
      return column;
    });
  }, []);

  const getDataSource = useCallback(obj => {
    if (Object.keys(obj).length) {
      return [{ ...obj, key: '1' }];
    }
    return [];
  }, []);

  const mergedColumns = useMemo(() => getMergedColumns(), [getMergedColumns]);
  const dataSource = useMemo(() => getDataSource(data), [getDataSource, data]);

  const renderCard = (
    <Card title={service.getValue(data, 'goalCnt.yyyyVal', '')} bordered={false}>
      <CommonTable columns={mergedColumns} dataSource={dataSource} scroll={{ x: '100%' }} />
    </Card>
  );

  return (
    <div className="dashboard-assets-summary">
      <Button type="primary" onClick={() => setVisible(state => !state)}>
        <CustomIcon type={require('@/assets/icon_assets.svg')} style={{ width: 12, height: 12, marginRight: 12 }} />
        {service.getValue(lang, 'LANG00001', 'no-text')}
      </Button>

      {visible ? renderCard : null}
    </div>
  );
}

export default Summary;
