import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Modal } from 'antd';
import { useParams } from 'react-router-dom';
import { service, locale } from '@/configs';
import { CommonForm } from '@/components/commons';
import { values } from '../configs';

const lang = service.getValue(locale, 'languages', {});

function Item(props) {
  const { mode } = useParams();
  const { handler } = props;

  const getFields = useCallback(() => {
    return values.pages.code.fields;
  }, []);

  const mergedFields = useMemo(() => getFields(), [mode]);

  return (
    <>
      <CommonForm fields={mergedFields} labelAlign="left" columns={1} handler={handler} onSubmit={props.onEvents} formMode={mode} />
    </>
  );
}

export default Item;
