import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Icon, Button, Modal } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { CommonForm } from '@/components/commons';
import { WithContentLayout } from '@/layouts';
import { common, fetch } from '@/store/actions';
import { service, Fetcher, locale } from '@/configs';
import { api, values } from '../configs';

const lang = service.getValue(locale, 'languages', {});

function ModalItem(props) {
  const { handler, onEvents, data } = props;
  const { id, mode } = useParams();
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    if (handler) {
      onEvents({ method: 'submit', payload: formValues });
    }
  }, [formValues, handler, onEvents]);

  const onSubmit = useCallback(
    (events, key) => {
      const { method, payload } = events;
      if (method === 'error') {
        return onEvents({ method: 'error' });
      }

      if (!Object.keys(payload).length)
        return Modal.error({
          title: service.getValue(lang, 'LANG00296', 'no-text'),
          content: service.getValue(lang, 'LANG00366', 'no-text')
        });

      setFormValues(state => ({
        ...state,
        [key]: { ...payload }
      }));
      return null;
    },
    [onEvents, setFormValues]
  );

  const getFields = useCallback(
    (fields = [], fielddata = {}) => {
      if (!Object.keys(fielddata).length) {
        return fields;
      }
      return fields.map(field => {
        if (field.key === 'notiId') {
          return {
            ...field,
            initialValue: `${id}`
          };
        }
        return {
          ...field,
          initialValue: service.getValue(fielddata, `${field.key}`, service.getValue(field, 'initialValue', null))
        };
      });
    },
    [mode]
  );

  const mergedFields = useMemo(() => getFields(values.pages.mail.fields, data), [data, getFields]);

  return (
    <>
      <CommonForm fields={mergedFields} labelAlign="left" columns={1} handler={handler} onSubmit={events => onSubmit(events, 'noticeinfo')} formMode={mode} />
    </>
  );
}

export default WithContentLayout(ModalItem);
