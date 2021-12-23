import React, { useMemo, useCallback } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import UAParser from 'ua-parser-js';

import { values, service, locale } from '@/configs';
import { CommonForm } from '@/components/commons';

const lang = service.getValue(locale, 'languages', {});

const parser = new UAParser();

function Info(props) {
  const { data = {} } = props;
  const commonConfig = useSelector(state => {
    return {
      modlMnftGubn: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00006')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner),
      invtMnftGubn: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00007')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner),
      btryMnftGubn: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00008')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner),
      regnGubn: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00005')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner)
    };
  }, shallowEqual);
  const getMergedFields = useCallback(
    fields => {
      const rescGubn = service.getValue(data, 'rescGubn', 'A');
      if (rescGubn === 'A') {
        fields = fields.filter(field => field.key !== 'essInstCapa' && field.key !== 'btryMnftGubn');
      }
      return fields.map(field => {
        if (field.key === 'modlMnftGubn' || field.key === 'invtMnftGubn' || field.key === 'btryMnftGubn' || field.key === 'regnGubn') {
          const matched = service
            .getValue(commonConfig, `${field.key}`, [])
            .filter(inner => inner.cd === service.getValue(data, `${field.key}`, null))
            .find(inner => inner);
          return {
            ...field,
            initialValue: service.getValue(matched, 'cdName', '')
          };
        }
        return {
          ...field,
          initialValue: service.getValue(data, `${field.key}`, '')
        };
      });
    },
    [data, commonConfig]
  );
  const mergedFields = useMemo(() => getMergedFields(values.siteDetail.pages.info), [getMergedFields]);
  const isMobile = parser.getDevice().type === 'mobile';

  return (
    <div className="info-wrap">
      <p className="title">{service.getValue(lang, 'LANG00251', 'no-text')}</p>
      <CommonForm formMode="read" labelAlign="left" fields={mergedFields} columns={isMobile ? 1 : 3} formLayout={{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }} />
    </div>
  );
}

export default React.memo(Info);
