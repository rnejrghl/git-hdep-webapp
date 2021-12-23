import React, { useCallback, useEffect } from 'react';
import CommonPieChart from '../../commons/charts/CommonPieChart';
import { locale, service } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

function Status(props) {
  const { regions } = props;

  // 사이트 상태
  const sumStatus = useCallback(() => {
    const sitesCnt = regions
      .map(item => item.siteCnt)
      .reduce(
        (p, c) => ({
          al0001: Number(p['al0001']) + Number(c['al0001']),
          al0002: Number(p['al0002']) + Number(c['al0002']),
          al0003: Number(p['al0003']) + Number(c['al0003'])
        }),
        { al0001: 0, al0002: 0, al0003: 0 }
      );
    const siteData = {
      [`${service.getValue(lang, 'LANG00003', 'no-text')}`]: sitesCnt.al0001,
      [`${service.getValue(lang, 'LANG00004', 'no-text')}`]: sitesCnt.al0002,
      [`${service.getValue(lang, 'LANG00005', 'no-text')}`]: sitesCnt.al0003
    };

    return Object.entries(siteData).map(([key, value]) => ({ name: key, value }));
  }, [regions]);

  return <CommonPieChart chartData={sumStatus()} />;
}

export default Status;
