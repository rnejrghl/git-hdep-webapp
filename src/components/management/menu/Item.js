import React, { useMemo, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { Empty } from 'antd';
import { CommonForm } from '@/components/commons';
import { service, locale } from '@/configs';

import { values } from '../configs';

const lang = service.getValue(locale, 'languages', {});

function Item(props) {
  const { mode = 'read' } = useParams();
  const location = useLocation();
  const { state } = location;
  const selected = service.getValue(state, 'selected', {});

  const getMergedFields = useCallback(() => {
    return values.pages.menu.content.fields.map(field => {
      if (field.key === 'active') {
        return {
          ...field,
          initialValue: field.options.filter(option => service.getValue(selected, `${option.key}`, 'N') === 'Y').map(option => option.value)
        };
      }
      return {
        ...field,
        initialValue: service.getValue(selected, `${field.key}`, null)
      };
    });
  }, [selected]);

  const mergedFields = useMemo(() => getMergedFields(), [getMergedFields]);

  if (!Object.keys(selected).length) {
    return <Empty description={<span>{service.getValue(lang, 'LANG00263', 'no-text')}</span>} style={{ marginTop: 20 }} />;
  }

  return (
    <CommonForm
      fields={mergedFields}
      handler={props.handler}
      onSubmit={props.onEvents}
      formMode={mode}
      labelAlign="left"
      formLayout={{
        labelCol: { span: 4 },
        wrapperCol: { span: 8 }
      }}
    />
  );
}

export default Item;
