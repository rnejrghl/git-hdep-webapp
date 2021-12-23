import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';

import { CommonForm, EditableTable } from '@/components/commons';
import { Fetcher, service, formats } from '@/configs';

import { api, columns } from '../configs';

function Goal(props) {
  const { fields = [], selected, edit = false } = props;
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetching = () => {
      const siteId = service.getValue(selected, 'siteId', false);
      if (siteId) {
        const obj = api.getGoal({ siteId });
        return Fetcher.get(obj.url, obj.params).then(result => {
          setList(() => service.getValue(result, 'data', []));
        });
      }
      return null;
    };
    if (!edit) {
      fetching();
    }
  }, [edit, selected, setList]);

  const getColumns = useCallback(
    columnList => {
      return columnList.map(column => {
        if (column.key === 'year') {
          column.render = text => {
            return <span key={text}>{text ? moment(text, formats.timeFormat.YEARMONTH).format(formats.timeFormat.YEAR) : null}</span>;
          };
        }
        if (column.key === 'month') {
          column.render = text => {
            return <span key={text}>{text ? moment(text, formats.timeFormat.YEARMONTH).format(formats.timeFormat.MONTH) : null}</span>;
          };
        }
        if (column.dataIndex === 'goalGenrCapa' || column.dataIndex === 'pr' || column.dataIndex === 'ppa' || column.dataIndex === 'sale') {
          return {
            ...column,
            onCell: (record, index) => ({
              index: index + 1,
              record,
              inputType: 'text',
              dataIndex: column.dataIndex,
              title: column.title,
              editing: edit
            })
          };
        }
        return {
          ...column,
          onCell: (record, index) => ({
            index: index + 1,
            record,
            dataIndex: column.dataIndex,
            title: column.title
          })
        };
      });
    },
    [edit]
  );

  const getFields = useCallback(
    fieldList => {
      return fieldList.map(field => {
        if (field.key === 'userName') {
          return {
            ...field,
            initialValue: service.getValue(selected, `${field.key}`, null)
          };
        }
        return field;
      });
    },
    [selected]
  );

  const mergedColumns = useMemo(() => getColumns(columns.goalColumns), [getColumns]);
  const mergedFields = useMemo(() => getFields(fields), [fields, getFields]);

  return (
    <Row className="planning-goal">
      <Col style={{ marginBottom: 20 }}>
        <CommonForm fields={mergedFields} labelAlign="left" formMode="read" formLayout={{ labelCol: { span: 6 }, wrapperCol: { span: 10 } }} />
      </Col>
      <Col>
        <EditableTable editableAll columns={mergedColumns} dataSource={list} scroll={{ x: '100%', y: 300 }} handler={props.handler} onEvents={props.onEvents} bordered={false} size="small" />
      </Col>
    </Row>
  );
}

export default Goal;
