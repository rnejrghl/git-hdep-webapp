import React from 'react';
import { Button } from 'antd';
import CustomIcon from './CustomIcon';

import { APIHost, service } from '@/configs';

function ExcelButton(props) {
  const link = service.getValue(props, 'href', false) ? `${APIHost}${service.getValue(props, 'href')}` : undefined;

  return (
    <Button type="primary" key="excel" className="excel" href={link}>
      <CustomIcon type={require('@/assets/excel.svg')} />
    </Button>
  );
}

export default ExcelButton;
