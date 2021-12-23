import React, { useMemo, useCallback } from 'react';
import { Card, Row, Col } from 'antd';

import { WithContentLayout } from '@/layouts';
import { CommonForm } from '@/components/commons';
import { service } from '@/configs';

import { values, columns } from '../configs';
import { DeviceTable } from '../commons';

function Content(props) {
  const { data = {}, onFetchEvents } = props;
  const { siteInfo = {}, siteGtwyDvceList = [] } = data;

  const onChangeTable = useCallback(
    (value, column) => {
      const key = service.getValue(column, 'dataIndex', null);
      if (key) {
        return onFetchEvents({ method: 'refetch', payload: { [key]: value } });
      }
      return null;
    },
    [onFetchEvents]
  );

  const getFields = useCallback(
    fields => {
      return fields.map(field => {
        if (field.key === 'capacity') {
          const matched = service.getCapacity(siteInfo || {}, true);
          return {
            ...field,
            initialValue: matched ? Object.keys(matched).map(key => ` ${key} : ${matched[key]}`) : null
          };
        }
        return {
          ...field,
          initialValue: service.getValue(siteInfo, `${field.key}`, null)
        };
      });
    },
    [siteInfo]
  );

  const mergedFields = useMemo(() => getFields(values.pages.site.content.fields), [getFields]);

  return (
    <Card title={values.pages.site.content.title}>
      <Row>
        <Col>
          <CommonForm
            fields={mergedFields}
            labelAlign="left"
            columns={2}
            formLayout={{
              labelCol: { span: 8 },
              wrapperCol: { span: 14 }
            }}
            style={{ width: '60%', marginBottom: 10 }}
          />
        </Col>
        <Col>
          <DeviceTable dataSource={siteGtwyDvceList} columns={columns.siteColumns} onChangeTable={onChangeTable} />
        </Col>
      </Row>
    </Card>
  );
}

export default WithContentLayout(Content);
