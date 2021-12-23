import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { EditableTable } from '@/components/commons';
import { service } from '@/configs';

function DeviceTable(props) {
  const deviceCodes = ['CDK-00006', 'CDK-00007', 'CDK-00008'];
  const { onChangeTable, dataSource = [], columns = [] } = props;

  const [checkedList, setCheckedList] = useState([]);
  const commonConfig = useSelector(state => {
    return {
      deviceList: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => deviceCodes.includes(inner.grpCd))
        .reduce((result, inner) => {
          result = [...result, ...service.getValue(inner, 'codes', [])];
          return result;
        }, []),
      unitCd: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00018')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner)
    };
  });

  useEffect(() => {
    const newCheckedList = dataSource.map(item => !!item.temp11);
    setCheckedList(newCheckedList);
  }, [dataSource]);

  const onCheckAllChange = useCallback(
    e => {
      if (e.target.checked) {
        setCheckedList([...checkedList.fill(true)]);
      } else {
        setCheckedList([...checkedList.fill(false)]);
      }
    },
    [checkedList]
  );

  const getMergedColumns = useCallback(() => {
    return columns.map(column => {
      const { searchAble } = column;

      if (searchAble) {
        searchAble.onSearch = value => onChangeTable(value, column);
      }

      if (column.checkAble) {
        column.checkAble.onChangeHeader = e => onCheckAllChange(e);
      }

      if (column.dataIndex === 'eqmtGubnCd') {
        column.render = text => {
          const matcehd = service
            .getValue(commonConfig, 'deviceList', [])
            .filter(inner => inner.cd === text)
            .find(inner => inner);
          return service.getValue(matcehd, 'grpCdName', '');
        };
      }
      if (column.dataIndex === 'unitCd') {
        column.render = text => {
          const matcehd = service
            .getValue(commonConfig, 'unitCd', [])
            .filter(inner => inner.cd === text)
            .find(inner => inner);
          return service.getValue(matcehd, 'cdName', '');
        };
      }
      return { ...column };
    });
  }, [onChangeTable, onCheckAllChange, commonConfig, columns]);

  const mergedColumns = useMemo(() => getMergedColumns(), [getMergedColumns]);

  return <EditableTable columns={mergedColumns} dataSource={dataSource} bordered={props.bordered || true} scroll={{ y: 'calc(100vh - 295px)' }} editableAll handler={props.handler} onEvents={props.onEvents} />;
}

export default DeviceTable;
