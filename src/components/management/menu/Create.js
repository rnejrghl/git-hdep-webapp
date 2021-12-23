import React from 'react';
import { Alert } from 'antd';

import { CommonForm } from '@/components/commons';

function Create(props) {
  return (
    <>
      <Alert message={props.message} type="info" style={{ marginBottom: 20 }} />

      <CommonForm
        handler={props.handler}
        fields={props.fields || []}
        onSubmit={props.onEvents}
        labelAlign="left"
        formLayout={{
          labelCol: { span: 8 },
          wrapperCol: { span: 16 }
        }}
      />
    </>
  );
}

export default Create;
