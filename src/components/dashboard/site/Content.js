import React, { useRef, useState, useMemo, useCallback } from 'react';
import { List, Card, Badge, Modal } from 'antd';
import UAParser from 'ua-parser-js';
import { useHistory } from 'react-router-dom';

import { WithContentLayout } from '@/layouts';
import { CustomIcon, Detail } from '@/components/commons';

import { values } from '../configs';
import MobileDetail from './detail/Container';

const parser = new UAParser();

function Content(props) {
  const wrapperEl = useRef(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState({});
  const isMobile = parser.getDevice().type === 'mobile';
  const history = useHistory();

  const onCancel = useCallback(() => {
    setVisible(false);
    setSelected({});
  }, [setVisible, setSelected]);

  const onClick = useCallback(
    (item = null) => {
      if (item) {
        if (isMobile) {
          return history.push({
            pathname: `${history.location.pathname}/${item.siteId}`,
            state: { item }
          });
        }
        setVisible(true);
        setSelected(item);
      } else {
        onCancel();
      }
    },
    [setVisible, setSelected, onCancel, isMobile, history]
  );

  const getTitle = useCallback(() => {
    return selected.title;
  }, [selected]);

  const title = useMemo(() => getTitle(), [getTitle]);

  return (
    <div ref={wrapperEl}>
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 4, xxl: 4 }}
        dataSource={props.datas}
        renderItem={item => (
          <List.Item onClick={() => onClick(item)} style={{ cursor: 'pointer' }}>
            <Badge count={<CustomIcon type={require('@/assets/wo_badge.svg')} />} style={{ height: 30, width: 30 }} offset={[-25, 15]}>
              <Card bordered={false} bodyStyle={{ backgroundColor: '#9ca0a9', padding: '10px 15px 16px', borderRadius: '4px' }}>
                <Card.Meta
                  avatar={item.rescGubn === 'B' ? <CustomIcon type={require('@/assets/battery.svg')} style={{ marginTop: 6, width: 16, height: 17 }} /> : <CustomIcon type={require('@/assets/pv.svg')} style={{ marginTop: 7, width: 16, height: 17 }} />}
                  title={`${item.userName}`}
                  description={item.addr}
                />
              </Card>
            </Badge>
          </List.Item>
        )}
      />

      <Modal
        forceRender
        destroyOnClose
        centered
        visible={visible}
        title={title}
        onCancel={onCancel}
        bodyStyle={{
          padding: 0
        }}
        width={1150}
        footer={null}
      >
        <Detail site={selected} tabs={values.tabs} />
      </Modal>
    </div>
  );
}

export default WithContentLayout(Content);
