import React, { useMemo, useCallback } from 'react';
import { Alert } from 'antd';
import moment from 'moment';

import { CommonForm } from '@/components/commons';

import { service, formats } from '@/configs';
import { values } from '../configs';

function Group(props) {
  const { message, item = {} } = props;

  const getFields = useCallback(
    fields => {
      return fields.map(field => {
        if (field.key === 'rscGrpId') {
          return {
            ...field,
            props: {
              disabled: !!Object.keys(item).length
            },
            initialValue: service.getValue(item, `${field.key}`, service.getValue(field, 'initialValue', null))
          };
        }
        if (field.key === 'date') {
          return {
            ...field,
            initialValue: Object.keys(item).length ? [moment(service.getValue(item, 'trdbStrtDt', null), formats.timeFormat.YEARMONTHDAY), moment(service.getValue(item, 'trdbEndDt', null), formats.timeFormat.YEARMONTHDAY)] : null
          };
        }
        return {
          ...field,
          initialValue: service.getValue(item, `${field.key}`, service.getValue(field, 'initialValue', null))
        };
      });
    },
    [item]
  );

  const mergedField = useMemo(() => getFields(values.fields), [getFields]);

  return (
    <div className="resource-modal-container">
      <Alert message={message} type="info" style={{ marginBottom: 20 }} />

      <CommonForm handler={props.handler} fields={mergedField} onSubmit={props.onEvents} formLayout={{ labelCol: { span: 6 }, wrapperCol: { span: 10 } }} labelAlign="left" />
    </div>
  );
}

export default Group;
