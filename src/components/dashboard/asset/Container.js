import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'antd';
import styled from 'styled-components';
import { fetch } from '@/store/actions';
import { Fetcher, locale, service } from '@/configs';
import { UseFullLayout, ContainerLayout } from '@/layouts';
import { api } from '../configs';
import Map from './Map';
import SiteList from './SiteList';
import SiteStatistics from './SiteStatistics';
// import Status from './Status';
import SpotPriceGraph from './SpotPriceGraph';
import SpotPriceInfo from './SpotPriceInfo';

import { CustomIcon } from '@/components/commons';

const lang = service.getValue(locale, 'languages', {});

const StyledCard = styled(Card)`
  & .ant-card-head {
    // background: #f17f42;
  }
  & .ant-card-body {
    overflow: auto;
    height: 90%;
  }
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  height: 16rem;
`;

function Container() {
  const dispatch = useDispatch();
  const [params, setParams] = useState({
    siteHidden: true
  });
  const [siteList, setSiteList] = useState({});

  const [mapState, setMapState] = useState({
    zoom: 5,
    center: { lat: -25.274398, lng: 133.775136 }
  });

  const { regions = [] } = useSelector(state => service.getValue(state.fetch, 'multipleList', {}));

  const rezions = regions.filter(item => item.siteCnt.total !== '0');

  const [chartData, setChartData] = useState({});

  // fetching: 지역 및 사이트 상태정보, 사이트 통계, 지역별 사이트 리스트
  useEffect(() => {
    const fetching = () => {
      const obj = api.getRegion();
      dispatch(fetch.getMultipleList([{ id: 'regions', url: obj.url, params: obj.params }]));
    };
    fetching();
    return () => {};
  }, [dispatch]);

  const getSiteList = useCallback(() => {
    const params = { regnGubn: '' };
    const obj = api.getRegionSites(params);
    return Fetcher.get(obj.url, obj.params).then(result => {
      setSiteList(service.getValue(result, 'data', {}));
    });
  }, []);

  const getSpotPriceGraph = useCallback(() => {
    const obj = api.getSpotPriceGraph();
    Fetcher.get(obj.url, obj.params).then(result => {
      setChartData(service.getValue(result, `data`, {}));
    });
  }, []);

  useEffect(() => {
    getSiteList();
    getSpotPriceGraph();
  }, []);

  const onEvents = useCallback(events => {
    const { method, payload } = events;
    switch (method) {
      case 'hideSiteList':
        setParams({
          ...params,
          siteHidden: payload
        });
        break;
      case 'setMapState':
        setMapState(state => {
          return {
            ...state,
            ...payload
          };
        });
        break;
      default:
        break;
    }
    return null;
  }, []);

  return (
    <div style={{ position: 'relative', height: '90vh', width: '100%' }} className="dashboard-assets">
      <Map regions={rezions} onEvents={onEvents} mapState={mapState} />

      {/* <CustomIcon type={require('@/assets/logo.svg')} style={{ position: 'absolute', width: 90, top: 10, left: 30 }} /> */}

      {/* 아래 card는 일단 삭제 */}
      {/* <StyledCard size="small" title={`${service.getValue(lang, 'LANG00023', 'no-text')}`} style={{ minWidth: '24.5rem', left: '30px', top: '50px' }}>
        <Status regions={rezions} />
      </StyledCard> */}

      <StyledCard size="nomal" title="PRICE & DEMAND (NSW) GRAPH" style={{ minWidth: '38.5rem', left: '30px', top: '10px', minHeight: '40%' }}>
        <SpotPriceGraph chartData={chartData}></SpotPriceGraph>
      </StyledCard>

      <StyledCard size="small" title="PRICE & DEMAND (NSW) INFO" style={{ minWidth: '24.5rem', left: '30px', top: '360px', height: '15rem' }}>
        <SpotPriceInfo chartData={chartData}></SpotPriceInfo>
      </StyledCard>

      <StyledCard size="small" title="Statistics" style={{ minWidth: '24.5rem', left: '30px', bottom: '5px', width: 'auto', height: '14rem' }}>
        <SiteStatistics />
      </StyledCard>

      <StyledCard size="small" title={`${service.getValue(lang, 'LANG00038', 'no-text')}`} style={{ minWidth: '15rem', left: 'auto', right: '30px', top: '30px', height: '70vh' }}>
        <SiteList regions={rezions} siteList={siteList} onEvents={onEvents} />
      </StyledCard>
    </div>
  );
}

export default UseFullLayout(Container);
