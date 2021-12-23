import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Icon, List, Skeleton } from 'antd';
import { Modal } from 'antd';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';

import { fetch } from '@/store/actions';
import { Fetcher, service } from '@/configs';
import { Detail } from '@/components/commons';
import { api, values } from '../configs';

function SiteList(props) {
  const { siteList, onEvents } = props;
  const [visible, setVisible] = useState(false);
  const [selected, setSelect] = useState({});

  const onCloseModal = useCallback(() => {
    // 창 닫을때, 선택값과 visible 값을 초기화 // memorized
    setSelect({});
    setVisible(false);
  }, [setSelect, setVisible]);

  const setMapState = item => {
    onEvents({
      method: 'setMapState',
      payload: {
        zoom: 8,
        center: { lat: Number(item.latd), lng: Number(item.lgtd) }
      }
    });
  };

  const onOpenModal = useCallback(
    // select 한 값으로 state 생성
    select => {
      setSelect(select);
      setMapState(select);
      setVisible(true);
    },
    [setVisible, setSelect]
  );

  const getTitle = useCallback(() => {
    return selected.title;
  }, [selected]);

  const title = useMemo(() => getTitle(), [getTitle]);

  return (
    <>
      <Skeleton loading={siteList && !siteList.length}>
        <List
          dataSource={siteList}
          itemLayout="vertical"
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                onClick={() => onOpenModal(item)}
                title={
                  <>
                    <Icon type="home" style={{ marginRight: '0.5rem' }} />
                    {item.userName}
                  </>
                }
                description={item.addr}
                style={{ cursor: 'pointer', width: '15rem' }}
              />
            </List.Item>
          )}
        />
      </Skeleton>
      <Modal
        forceRender
        destroyOnClose
        centered
        visible={visible}
        title={title}
        onCancel={onCloseModal}
        bodyStyle={{
          padding: 0
        }}
        width={1150}
        footer={null}
      >
        <Detail site={selected} tabs={values.tabs} />
      </Modal>
    </>
  );
}

export default SiteList;
