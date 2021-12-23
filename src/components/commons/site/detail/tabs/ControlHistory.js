import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Row, Col, Pagination } from 'antd';
import { CommonTable } from '@/components/commons';

import { columns, api, service, locale, Fetcher } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

function ControlHistory(props) {
  const { dataSource = {}, siteId = null } = props;
  const [historyData, setHistoryData] = useState([]);
  const [totalCnt, setTotalCnt] = useState(1);
  const [nowPage, setNowPage] = useState(1);

  const essCtrlHistList = service.getValue(dataSource, 'essControlHistoryList', []);
  const essCnt = service.getValue(dataSource, 'essCnt', { totalCnt: 1, page: 1 });

  useEffect(() => {
    setHistoryData(essCtrlHistList);
    setTotalCnt(essCnt.totalCnt);
    setNowPage(essCnt.page);
  }, [dataSource]);

  const onChangePage = value => {
    let requestObj = {};
    const pageParam = [];
    pageParam['siteId'] = siteId;
    pageParam['page'] = value;
    requestObj = api.getSiteDetailControlHistory(pageParam);
    Fetcher.get(requestObj.url, requestObj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        setHistoryData(result.data.essControlHistoryList);
        setNowPage(result.data.essCnt.page);
      }
    });
    return true;
  };

  return (
    <Row className="controlHistory-wrap">
      <Col className="controlHistory">
        <Card bordered={false}>
          <p>{service.getValue(lang, 'LANG00397', 'no-text')}</p>
        </Card>
        <CommonTable columns={columns.controlHistoryColumns} dataSource={historyData} rowKey={(datas, idx) => idx} scroll={{ x: 0, y: 300 }} />
        <Pagination total={totalCnt} current={nowPage} pagePer={10} onChange={event => onChangePage(event)} style={{ margin: '20px' }} />
      </Col>
    </Row>
  );
}

export default ControlHistory;
