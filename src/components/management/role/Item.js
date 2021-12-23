import React from 'react';
import { Transfer } from 'antd';

import { service, locale } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

function Item(props) {
  return (
    <Transfer
      rowKey={(item, idx) => service.getValue(item, 'siteId', idx)}
      dataSource={props.dataSource}
      targetKeys={props.targetKeys}
      showSearch={props.showSearch}
      onChange={props.onChange || null}
      operations={['To Right', 'To Left']}
      operationStyle={{ display: props.disabled ? 'none' : 'inline-block' }}
      disabled={props.disabled}
      titles={[service.getValue(lang, 'LANG00265', 'no-text'), service.getValue(lang, 'LANG00264', 'no-text')]}
      lazy={{ height: 60 }}
      render={item => service.getValue(item, 'siteId', '')}
    />
  );
}

export default Item;
