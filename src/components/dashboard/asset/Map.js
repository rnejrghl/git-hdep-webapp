import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Modal } from 'antd';
import GoogleMapReact from 'google-map-react';
import supercluster from 'points-cluster';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { fetch } from '@/store/actions';
import { locale, service } from '@/configs';
import { Detail } from '@/components/commons';
import { googleApi } from '../../../../package.json';
import { api, values } from '../configs';

import Cluster from './markers/Cluster';
import Marker from './markers/Marker';

// import SearchBox from './SearchBox';

// const lang = service.getValue(locale, 'languages', {});

const defaultProps = {
  clusterRadius: 10,
  hoverDistance: 30,
  options: {
    minZoom: 5,
    maxZoom: 20
  },
  style: {
    position: 'relative',
    margin: 0,
    height: '100%',
    width: '100%',
    padding: 0,
    flex: 1
  }
};

function Map(props) {
  const dispatch = useDispatch(); //액션생성함수 사용하기 위함
  const { regions = [], onEvents, mapState } = props;

  const [params, setParams] = useState({});
  const [visible, setVisible] = useState(false);
  const [selected, setSelect] = useState({});
  // const [mapProps, setMapProps] = useState({
  //   mapApiLoaded: false,
  //   mapInstance: null,
  //   mapApi: null
  // });

  const [searched, setSearched] = useState([]);
  const { sites = [] } = useSelector(state => service.getValue(state.fetch, 'multipleList', {}), shallowEqual); // 리덕스의 상태값을 조회하기 위한 Hook임.(connect보다 간결함)
  const onCloseModal = useCallback(() => {
    // 창 닫을때, 선택값과 visible 값을 초기화 // memorized
    setSelect({});
    setVisible(false);
  }, [setSelect, setVisible]);

  const onOpenModal = useCallback(
    // select 한 값으로 state 생성
    select => {
      setSelect(select);
      setVisible(true);
    },
    [setVisible, setSelect]
  );

  useEffect(() => {
    // 렌더링 될 때마다 특정 작업을 수행하도록 설정 할 수 있는 Hook 입니다. 클래스형 컴포넌트의 componentDidMount 와 componentDidUpdate 를 합친 형태
    const fetching = () => {
      if (Object.keys(params).length) {
        const obj = api.getRegionSites(params);
        dispatch(fetch.getMultipleList([{ id: 'sites', url: obj.url, params: obj.params }])); // siteList 를 가져옴
      } else {
        dispatch(fetch.resetMultipleList());
      }
      return null;
    };
    fetching();
    return () => {};
  }, [dispatch, params.regnGubn]); // 2번째 파라미터가 비어있으면 마운트 될때만 실행됨 ( []: 아에 빈값. ), 2번째 파라미터를 넘기지 않으면 모든 렌더링에 호출

  useEffect(() => {
    if (mapState.zoom >= 5) {
      const region =
        regions.length !== 0
          ? regions.reduce((prev, curr) => {
              return Math.hypot(Number(curr.latd) - mapState.center.lat, Number(curr.lgtd) - mapState.center.lng) < Math.hypot(Number(prev.latd) - mapState.center.lat, Number(prev.lgtd) - mapState.center.lng) ? curr : prev;
            })
          : null;
      if (region) {
        setParams({ regnGubn: region.regnGubn });
        onEvents({ method: 'hideSiteList', payload: false });
      }
    } else {
      onEvents({ method: 'hideSiteList', payload: true });
    }
  }, [mapState.center]);

  // const apiHasLoaded = (map, maps) => {
  //   // Map 최초 렌더링시 호출됨. MapProps 에 MapInstanse 로 초기화함
  //   setMapProps({
  //     mapApiLoaded: true,
  //     mapInstance: map,
  //     mapApi: maps
  //   });
  // };

  const createMapOptions = () => {
    // Map 세팅값 생성함수.
    return {
      panControl: false,
      mapTypeControl: false,
      scrollwheel: true,
      maxZoom: defaultProps.options.maxZoom,
      minZoom: defaultProps.options.minZoom,
      fullscreenControl: false,
      mapTypeId: 'hybrid',
      styles: []
    };
  };

  const getClusters = useCallback(
    // useMemo와 달리, 이벤트 핸들러에 대해 캐싱함. useMemo 는 이벤트에 대한 결과값을 캐싱한다고 보면 됨.
    regionList => {
      const convert = regionList.map(inner => {
        // NSW 같은 지역에 속한 리스트를 prop으로 받아서,
        return {
          ...inner, // inner를 spread 하고 lat, lng 를 추출해서 추가.
          lat: Number(service.getValue(inner, 'latd', '0')),
          lng: Number(service.getValue(inner, 'lgtd', '0'))
        };
      });
      // superCluster라는 모듈로 Clustering 을 함. (lat, lng)만 필요함. 2번째 옵션은 아무 역할을 안하는 걸로 보임
      const cl = supercluster(convert, {
        minZoom: defaultProps.options.minZoom,
        maxZoom: defaultProps.options.maxZoom,
        radius: defaultProps.clusterRadius
      });
      if (mapState.bounds) {
        // clustering 좌표를 가지고,
        return cl({ ...mapState }).map((inner, idx) => {
          const { wy, wx, points } = inner;
          return {
            lat: wy,
            lng: wx,
            ...service.getValue(points, '0', {}), //  0번 배열에서 들고 오라는 거임.
            id: service.getValue(points, '0.regnGubn', idx) //   "AU001" 요런식의 데이터임.
          };
        });
      }
      return [];
    },
    [mapState]
  );

  // 각 Site 별 정보(redux store에 있음) 를 가지고
  const getMarkers = useCallback(
    siteList => {
      const convert = siteList.map(inner => {
        return {
          ...inner,
          lat: Number(service.getValue(inner, 'latd', '0')),
          lng: Number(service.getValue(inner, 'lgtd', '0'))
        };
      });
      const cl = supercluster(convert, {
        minZoom: defaultProps.options.minZoom,
        maxZoom: defaultProps.options.maxZoom,
        radius: 0
      });
      if (mapState.bounds) {
        return cl({ ...mapState }).map((inner, idx) => {
          const { wy, wx, points, numPoints } = inner;

          return {
            lat: wy,
            lng: wx,
            numPoints,
            points,
            type: 'marker',
            id: service.getValue(points, '0.siteId', idx),
            siteId: service.getValue(points, '0.siteId', null),
            workOrdUserSeq: service.getValue(points, '0.workOrdUserSeq', null)
          };
        });
      }
      return [];
    },
    [mapState]
  );

  const onSearch = site => {
    setSearched([site]);
  };

  const onChildClick = (regnGubn = null, item) => {
    if (service.getValue(item, 'type', null) === 'marker') {
      return onOpenModal(item);
    }

    if (regnGubn) {
      setParams({ regnGubn });
      return onEvents({
        method: 'setMapState',
        payload: {
          zoom: 8,
          center: { lat: item.lat, lng: item.lng }
        }
      });
    }
    return null;
  };

  const getTitle = useCallback(() => {
    return selected.title;
  }, [selected]);

  const title = useMemo(() => getTitle(), [getTitle]);
  const clusters = useMemo(() => getClusters(regions), [getClusters, regions]);
  const markers = useMemo(() => getMarkers(sites), [getMarkers, sites]);
  const searchs = useMemo(() => getMarkers(searched), [getMarkers, searched]);

  return (
    <>
      {/* {mapProps.mapApiLoaded && <SearchBox map={mapProps.mapInstance} mapApi={mapProps.mapApi} onSearched={onSearch} />} */}
      <GoogleMapReact
        bootstrapURLKeys={{
          key: googleApi.map,
          language: service.getValue(locale, 'ant.locale', 'au'),
          region: service.getValue(locale, 'ant.locale', 'au'),
          libraries: ['places', 'geometry']
        }}
        center={mapState.center}
        zoom={mapState.zoom}
        hoverDistance={defaultProps.hoverDistance}
        yesIWantToUseGoogleMapApiInternals
        options={createMapOptions()}
        onChildClick={onChildClick}
        onChange={({ center, zoom, bounds }) => onEvents({ method: 'setMapState', payload: { center, zoom, bounds } })}
        // onGoogleApiLoaded={({ map, maps }) => apiHasLoaded(map, maps)}
      >
        {mapState.zoom < 8 && clusters.map(cluster => <Cluster key={cluster.id} {...cluster} />)}
        {mapState.zoom >= 8 &&
          markers.map(marker => {
            const { numPoints = 1 } = marker;
            if (numPoints === 1) {
              return <Marker key={marker.id} {...marker} />;
            }
            return null;
          })}
        {mapState.zoom >= 8 &&
          searchs.length &&
          searchs.map(marker => {
            const { numPoints = 1 } = marker;
            if (numPoints === 1) {
              return <Marker key={marker.id} {...marker} />;
            }
            return null;
          })}
      </GoogleMapReact>

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

export default Map;
