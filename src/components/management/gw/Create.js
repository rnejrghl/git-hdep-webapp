import React, { useMemo, useCallback } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { CommonForm } from '@/components/commons';

import { service } from '@/configs';
import { values } from '../configs';

function Create(props) {
  const { onEvents, handler } = props;
  const inverterList = useSelector(
    state =>
      service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00007')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner),
    shallowEqual
  );

  const batteryList = useSelector(
    state =>
      service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00008')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner),
    shallowEqual
  );

  const getFields = useCallback(
    fields => {
      return fields.map(field => {
        if (field.key === 'inverterList') {
          return {
            ...field,
            options: inverterList.map(inner => {
              return {
                key: inner.cd,
                value: inner.cd,
                label: inner.cdName
              };
            }),
            initialValue: service.getValue(inverterList, '0.cd', null)
          };
        }
        if (field.key === 'batteryList') {
          return {
            ...field,
            options: batteryList.map(inner => {
              return {
                key: inner.cd,
                value: inner.cd,
                label: inner.cdName
              };
            }),
            initialValue: service.getValue(batteryList, '0.cd', null)
          };
        }
        return field;
      });
    },
    [batteryList, inverterList]
  );

  const mergedFields = useMemo(() => getFields(values.pages.gw.sider.fields), [getFields]);

  return (
    <>
      <CommonForm
        fields={mergedFields}
        labelAlign="left"
        handler={handler}
        onSubmit={onEvents}
        formLayout={{
          labelCol: { span: 4 },
          wrapperCol: { span: 10 }
        }}
      />
    </>
  );
}

export default Create;
