import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Badge } from 'antd';

import { service, locale } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

function Legend() {
  const { codes = [] } = useSelector(state =>
    service
      .getValue(state.auth, 'configs', [])
      .filter(inner => inner.grpCd === 'CDK-00001')
      .find(inner => inner)
  );

  const getMergedCodes = useCallback(list => {
    return list.map(item => {
      let status;
      let label;

      if (item.cd === 'AL0001') {
        status = 'success';
        label = service.getValue(lang, 'LANG00003', 'no-text');
      }
      if (item.cd === 'AL0002') {
        status = 'error';
        label = service.getValue(lang, 'LANG00004', 'no-text');
      }
      if (item.cd === 'AL0003') {
        status = 'default';
        label = service.getValue(lang, 'LANG00005', 'no-text');
      }
      return {
        ...item,
        status,
        label
      };
    });
  }, []);
  const mergedCodes = useMemo(() => getMergedCodes(codes), [getMergedCodes, codes]);

  return (
    <div className="dashboard-assets-legend">
      {mergedCodes.map(code => {
        return <Badge key={code.cd} status={code.status} text={code.label} />;
      })}
    </div>
  );
}

export default Legend;
