import { Col, Row, Skeleton, Statistic } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Fetcher, locale, service } from '@/configs';
import { api } from '../configs';

const lang = service.getValue(locale, 'languages', {});

const StyledStatistic = styled(Statistic)`
  .ant-statistic-title {
    font-size: 0.8rem;
  }
`;

function SiteStatistics() {
  const [statistics, setStatistics] = useState();
  const getSiteList = useCallback(() => {
    const obj = api.getSearchSite();
    return Fetcher.get(obj.url, obj.params).then(result => {
      setStatistics({
        monthEnergy: service.getValue(result, 'data.operationsCnt.monthEnergy', 0),
        todayGnrt: service.getValue(result, 'data.operationsCnt.todayGnrt', 0),
        todayEnergy: service.getValue(result, 'data.operationsCnt.todayEnergy', 0),
        monthGnrt: service.getValue(result, 'data.operationsCnt.monthGnrt', 0)
      });
    });
  }, []);

  useEffect(() => {
    getSiteList();
  }, []);

  return (
    <Skeleton loading={!statistics}>
      <Row gutter={[16, 32]} type="flex" justify="space-around">
        <Col span={10}>
          <StyledStatistic title={`${service.getValue(lang, 'LANG00301', 'no-text')}`} value={statistics && statistics.todayGnrt} precision={2} suffix="kWh" />
        </Col>
        <Col span={10}>
          <StyledStatistic title={`${service.getValue(lang, 'LANG00343', 'no-text')}`} value={statistics && statistics.todayEnergy} precision={2} suffix="kWh/kWp" />
        </Col>
      </Row>
      <Row gutter={[16, 32]} type="flex" justify="space-around">
        <Col span={10}>
          <StyledStatistic title={`${service.getValue(lang, 'LANG00303', 'no-text')}`} value={statistics && statistics.monthGnrt} precision={2} suffix="kWh" />
        </Col>
        <Col span={10}>
          <StyledStatistic title={`${service.getValue(lang, 'LANG00344', 'no-text')}`} value={statistics && statistics.monthEnergy} precision={2} suffix="kWh/kWp" />
        </Col>
      </Row>
    </Skeleton>
  );
}

export default SiteStatistics;
