import React, { useState, useCallback } from 'react';
import { Row, Col, Tabs, Card, Button, Modal, Table } from 'antd';
import { columns, values, service, locale, formats } from '@/configs';
import { CommonTable } from '@/components/commons';
import { useSelector, shallowEqual } from 'react-redux';

import { Radio } from 'antd';

import '@/styles/app/components/commons/PsidTable.scss';

const lang = service.getValue(locale, 'languages', {});

function PsidTable(props) {
  //부모창으로 받은 함수와 , 모델창 닫기 함수
  const { onSubmitPsId, onCancel } = props;

  // redux에 있는  psidList 를 가져온다. (서버에서 넣어줌)
  const psidList = useSelector(state => service.getValue(state.fetch, `multipleList.inspection.psidList`, {}), shallowEqual);

  // radio 버튼 value값 셋팅
  const [psidRadioValue, setPsidRadioValue] = useState({});

  // radio 버튼 클릭시 set
  const onRadioChange = ({ psId }) => {
    setPsidRadioValue(psId);
  };

  // radio 버튼 선택시 부모창으로 받은 함수(onSubmitPsId) 에 psId를 넘겨주고 , 화면을 닫음
  const onSelectPsId = () => {
    onSubmitPsId(psidRadioValue);
    onCancel();
  };

  const psIdPopColumns = [
    {
      title: service.getValue(lang, 'ddd', '선택'),
      key: 'radio.ps_id',
      dataIndex: 'ps_id',
      className: 'th-psid',
      render: psId => (
        <Radio
          checked={psidRadioValue === psId}
          onChange={e =>
            onRadioChange({
              psId: psId
            })
          }
        ></Radio>
      )
    },
    {
      title: service.getValue(lang, 'ddd', 'PS_NM'),
      key: 'ps_name',
      dataIndex: 'ps_name'
    },
    {
      title: service.getValue(lang, 'ddd', 'PS_ID'),
      key: 'ps_id',
      dataIndex: 'ps_id'
    },
    {
      title: service.getValue(lang, 'ddd', 'Location'),
      key: 'location',
      dataIndex: 'location'
    }
  ];

  return (
    <Row>
      <Col>
        <Table className="psidmodal-table" rowKey={(row, idx) => service.getValue(row, 'psname', idx)} columns={psIdPopColumns} dataSource={psidList} pagination={false} />
      </Col>
      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <Button onClick={onSelectPsId}>{service.getValue(lang, 'ddd', '선택')}</Button>
      </div>
    </Row>
  );
}

export default PsidTable;
