import React from 'react';
import { List, Card, Badge, Checkbox } from 'antd';
import styled from 'styled-components';

import { WithContentLayout } from '@/layouts';
import { CustomIcon } from '@/components/commons';
import { locale, service } from '@/configs';
import Summary from './Summary';

const lang = service.getValue(locale, 'languages', {});

const StyledDiv = styled.div`
  text-align: right;
  margin-bottom: 20px;
`;

function Content(props) {
  const {
    data: { mainData = [], mainCntData = {} }
  } = props;

  const onChange = e => {
    console.log('onChange', e.target.checked);
  };
  return (
    <div>
      <Summary dataSource={mainCntData} />
      <StyledDiv>
        <Checkbox onChange={onChange} style={{ color: '#ffffff', fontSize: 16 }}>
          {service.getValue(lang, 'LANG00031', 'no-text')}
        </Checkbox>
      </StyledDiv>
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 4, xxl: 4 }}
        dataSource={mainData}
        renderItem={item => (
          <List.Item>
            <Badge count={service.getValue(item, 'workOrderYn', 'N') === 'Y' ? <CustomIcon type={require('@/assets/wo_badge.svg')} /> : null} style={{ height: 30, width: 30 }} offset={[-25, 15]}>
              <Card bordered={false} bodyStyle={{ backgroundColor: '#9ca0a9', padding: '10px 15px 16px', borderRadius: '4px' }}>
                <Card.Meta
                  avatar={service.getValue(item, 'rescGubn', 'A') === 'B' ? <CustomIcon type={require('@/assets/battery.svg')} style={{ marginTop: 6, width: 16, height: 17 }} /> : <CustomIcon type={require('@/assets/pv.svg')} style={{ marginTop: 7, width: 16, height: 17 }} />}
                  title={service.getValue(item, 'userName', '')}
                  description={service.getValue(item, 'alertPublDtti', '')}
                />
              </Card>
            </Badge>
          </List.Item>
        )}
      />
    </div>
  );
}

export default WithContentLayout(Content);
