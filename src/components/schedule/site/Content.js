import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import styled from 'styled-components';
import { Modal, Button } from 'antd';

import { WithContentLayout } from '@/layouts';
import { CommonTable, ButtonWrap } from '@/components/commons';
import { service, locale } from '@/configs';

import { columns, values } from './configs';
import { History } from './modal';

const lang = service.getValue(locale, 'languages', {});

const StyleWrapper = styled.div`
  padding: 20px 20px 0;
`;

function Content(props) {
  const { onFetchEvents, data } = props;
  const { mainData = [], rscGrpList = [] } = data;

  const [visible, setVisible] = useState(false);
  const [selected, setSelect] = useState({});

  const commonConfigs = useSelector(state => {
    return {
      regions: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00005')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner),
      resources: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00011')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner)
    };
  }, shallowEqual);

  const onOpenModal = useCallback(
    select => {
      setSelect(select);
      setVisible(true);
    },
    [setSelect, setVisible]
  );

  const onCloseModal = useCallback(() => {
    setSelect({});
    setVisible(false);
  }, [setSelect, setVisible]);

  const onChangeTable = useCallback(
    (value, column) => {
      const key = service.getValue(column, 'dataIndex', null);
      if (key) {
        return onFetchEvents({ method: 'refetch', payload: { [key]: value === 'all' ? null : value } });
      }
      return null;
    },
    [onFetchEvents]
  );

  const getMergedColumns = useCallback(() => {
    return columns.mainColumns.map(column => {
      const { searchAble, selectAble } = column;

      if (searchAble) {
        searchAble.onSearch = value => onChangeTable(value, column);
      }

      if (selectAble) {
        selectAble.list = [];
        selectAble.onSelect = value => onChangeTable(value, column);
      }

      if (column.dataIndex === 'capacity') {
        column.render = (text, record) => service.getCapacity(record);
      }
      if (column.dataIndex === 'rscGrpId') {
        column.render = text => {
          const matched = rscGrpList.filter(inner => inner.rscGrpId === text).find(inner => inner);
          return service.getValue(matched, 'rscGrpName', `${service.getValue(lang, 'LANG00290', 'no-text')}`);
        };
        column.selectAble.list = [
          { key: 'all', value: 'all', label: 'ALL' },
          ...rscGrpList.map(inner => {
            return {
              key: inner.rscGrpId,
              value: inner.rscGrpId,
              label: inner.rscGrpName
            };
          })
        ];
        column.selectAble.defaultValue = 'all';
      }

      if (column.dataIndex === 'regnGubn') {
        column.render = text => {
          const matched = service
            .getValue(commonConfigs, 'regions', [])
            .filter(inner => inner.cd === text)
            .find(inner => inner);
          return service.getValue(matched, 'cdName', '');
        };
        column.selectAble.list = [
          { key: 'all', value: 'all', label: 'ALL' },
          ...service.getValue(commonConfigs, 'regions', []).map(inner => {
            return {
              key: inner.cd,
              value: inner.cd,
              label: inner.cdName
            };
          })
        ];
        column.selectAble.defaultValue = 'all';
      }

      if (column.dataIndex === 'rescGubn') {
        column.render = text => {
          const matched = service
            .getValue(commonConfigs, 'resources', [])
            .filter(inner => inner.cd === text)
            .find(inner => inner);
          return service.getValue(matched, 'cdName', '');
        };
        column.selectAble.list = [
          { key: 'all', value: 'all', label: 'ALL' },
          ...service.getValue(commonConfigs, 'resources', []).map(inner => {
            return {
              key: inner.cd,
              value: inner.cd,
              label: inner.cdName
            };
          })
        ];
        column.selectAble.defaultValue = 'all';
      }

      if (column.dataIndex === 'action') {
        column.render = (text, record) => {
          return values.actionButtons
            .filter(button => button.roll === 'read')
            .map(button => {
              return (
                <Button {...button} onClick={() => onOpenModal(record)}>
                  {button.label}
                </Button>
              );
            });
        };
      }

      return { ...column };
    });
  }, [onOpenModal, commonConfigs, onChangeTable, rscGrpList]);

  const mergedColumns = useMemo(() => getMergedColumns(), [getMergedColumns]);

  return (
    <StyleWrapper>
      <ButtonWrap
        left={[]}
        right={[
          <span style={{ fontSize: 14 }}>
            {`${service.getValue(lang, 'LANG00172', 'no-text')}`}: {mainData.length}
          </span>
        ]}
        style={{ paddingBottom: 20 }}
      />

      <CommonTable rowKey={(record, idx) => idx} columns={mergedColumns} dataSource={mainData} scroll={{ y: 'calc(100vh - 295px)' }} />

      <Modal forceRender centered destroyOnClose visible={visible} title={`${service.getValue(lang, 'LANG00289', 'no-text')}(${service.getValue(lang, 'LANG00057', 'no-text')})`} onCancel={onCloseModal} footer={null} width="50%" style={{ minWidth: 450 }}>
        <History site={selected} rscGrpList={rscGrpList} />
      </Modal>
    </StyleWrapper>
  );
}

export default WithContentLayout(React.memo(Content));
