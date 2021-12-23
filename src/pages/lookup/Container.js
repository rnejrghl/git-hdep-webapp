import React, { useEffect, useState } from 'react';
import { Col, Layout, Row, Typography } from 'antd';
import styled from 'styled-components';
import { Route, useHistory } from 'react-router-dom';
import { Tabs } from 'antd';
import { IdLookup, IdCheck, IdLookupResult, PwLookup, PwUpdate } from './';
import { service } from '@/configs';

const { TabPane } = Tabs;

const { Text } = Typography;

const StyledCol = styled(Col)`
  max-width: '280px';
  // align-self: flex-end;
`;

function Container({ match, location }) {
  const history = useHistory();

  const [tabKey, setTabKey] = useState();

  useEffect(() => {
    if ([`${match.path}`, `${match.path}/idLookup`, `${match.path}/idLookupResult`].includes(location.pathname)) {
      setTabKey('1');
    } else {
      setTabKey('2');
    }
  }, [match]);

  const locationState = service.getValue(location, 'state', []);

  const handleTabClick = key => {
    setTabKey(key);

    if (key === '1') {
      history.push('/lookup/idLookup');
    } else {
      history.push('/lookup/idCheck');
    }
  };

  return (
    <Layout>
      <Row type="flex" justify="center" align="middle" style={{ height: '100vh' }}>
        <StyledCol span={6}>
          <Tabs defaultActiveKey="1" onTabClick={handleTabClick} activeKey={tabKey}>
            <TabPane tab={<span>ID 찾기</span>} key="1">
              <Route exact path={[`${match.path}`, `${match.path}/idLookup`]} render={() => <IdLookup />} />
              <Route exact path={`${match.path}/idLookupResult`} render={() => <IdLookupResult userIds={locationState.userIds} />} />
            </TabPane>
            <TabPane tab={<span>PW 변경</span>} key="2">
              <Route exact path={`${match.path}/idCheck`} render={() => <IdCheck />} />
              <Route exact path={`${match.path}/pwLookup`} render={() => <PwLookup userId={locationState.userId} />} />
              <Route exact path={`${match.path}/pwUpdate`} render={() => <PwUpdate userId={locationState.userId} resetToken={locationState.resetToken} />} />
            </TabPane>
          </Tabs>
        </StyledCol>
      </Row>
    </Layout>
  );
}

export default Container;
