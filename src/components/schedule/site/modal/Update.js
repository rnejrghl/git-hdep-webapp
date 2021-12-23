import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Alert, Form, Select, DatePicker } from 'antd';
import moment from 'moment';

import { service, locale, formats } from '@/configs';
import { CommonForm } from '@/components/commons';

const lang = service.getValue(locale, 'languages', {});

const { RangePicker } = DatePicker;

function Update(props) {
  const { site, fields = [] } = props;
  const { getFieldDecorator, getFieldValue, validateFields } = props.form;
  const [newCnrt, setNewCnrt] = useState({
    startDate: moment().subtract(7, 'd'),
    endDate: moment().add(7, 'd')
  });
  const rscGrpList = useSelector(state => service.getValue(state, 'fetch.page.rscGrpList', []), shallowEqual);
  const filteredGroups = rscGrpList.filter(inner => service.getValue(inner, 'rscStatCd', null) === 'I');
  const newRscGrpId = getFieldValue('newRscGrpId') || service.getValue(filteredGroups, '0.rscGrpId', null);

  useEffect(() => {
    const getNewCnrt = rscGrpId => {
      const matched = filteredGroups.filter(item => item.rscGrpId === rscGrpId).find(item => item);
      const cnrtStrtDt = service.getValue(site, 'cnrtStrtDt', null);
      const trdbStrtDt = service.getValue(matched, 'trdbStrtDt', null);
      const startDate = cnrtStrtDt && trdbStrtDt ? (moment(cnrtStrtDt).isSameOrAfter(trdbStrtDt, 'day') ? cnrtStrtDt : trdbStrtDt) : trdbStrtDt || cnrtStrtDt;

      const cnrtEndDt = service.getValue(site, 'cnrtEndDt', null);
      const trdbEndDt = service.getValue(matched, 'trdbEndDt', null);
      const endDate = cnrtEndDt && trdbEndDt ? (moment(cnrtEndDt).isSameOrBefore(trdbEndDt, 'day') ? cnrtEndDt : trdbEndDt) : trdbEndDt || cnrtEndDt;

      setNewCnrt({
        startDate,
        endDate
      });
    };
    getNewCnrt(newRscGrpId);
  }, [newRscGrpId, site, filteredGroups]);

  const getMergedFields = useCallback(
    fieldList => {
      return fieldList.map(field => {
        if (field.key === 'cnrt') {
          const startDate = service.getValue(site, 'cnrtStrtDt', null);
          const endDate = service.getValue(site, 'cnrtEndDt', null);
          return {
            ...field,
            initialValue: startDate && endDate ? [moment(startDate), moment(endDate)] : []
          };
        }
        return {
          ...field,
          initialValue: service.getValue(site, `${field.key}`, service.getValue(field, 'initialValue', null))
        };
      });
    },
    [site]
  );

  const onEventsInterceptor = () => {
    validateFields((err, values) => {
      if (!err) {
        const params = {
          rscGrpId: newRscGrpId,
          cnrtStrtDt: service.getValue(values, 'newCnrt.0', null) ? moment(values.newCnrt[0]).format(formats.timeFormat.YEARMONTHDAY) : null,
          cnrtEndDt: service.getValue(values, 'newCnrt.1', null) ? moment(values.newCnrt[1]).format(formats.timeFormat.YEARMONTHDAY) : null
        };

        if (Object.keys(params).some(key => params[key])) {
          return props.onEvents({ method: 'submit', payload: params });
        }
      }
      return null;
    });
  };

  const getDisabledDate = current => {
    return (current && current.isAfter(moment(newCnrt.endDate, formats.timeFormat.YEARMONTHDAY), 'day')) || current.isBefore(moment(newCnrt.startDate, formats.timeFormat.YEARMONTHDAY), 'day');
  };

  const mergedFields = useMemo(() => getMergedFields(fields), [getMergedFields, fields]);

  return (
    <>
      <Alert message={props.message} type="info" style={{ marginBottom: 20 }} />

      <CommonForm
        handler={props.handler}
        fields={mergedFields}
        onSubmit={onEventsInterceptor}
        labelAlign="left"
        formLayout={{
          labelCol: { span: 10 },
          wrapperCol: { span: 14 }
        }}
      />

      <Form colon={false} hideRequiredMark labelAlign="left">
        <Form.Item label={service.getValue(lang, 'LANG00308', 'no-text')} labelCol={{ span: 6 }} wrapperCol={{ span: 8 }}>
          {getFieldDecorator('newRscGrpId', {
            initialValue: service.getValue(filteredGroups, '0.rscGrpId', null)
          })(
            <Select placeholder="Select">
              {filteredGroups.map(inner => {
                return (
                  <Select.Option key={inner.rscGrpId} value={inner.rscGrpId}>
                    {inner.rscGrpName}
                  </Select.Option>
                );
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label={service.getValue(lang, 'LANG00309', 'no-text')} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} extra={<span className="warning">{service.getValue(lang, 'LANG00293', 'no-text')}</span>}>
          {getFieldDecorator('newCnrt', {
            rules: [{ required: true, message: service.getValue(lang, 'LANG00309', 'no-text') }],
            initialValue: []
          })(<RangePicker style={{ width: '100%' }} disabledDate={getDisabledDate} />)}
        </Form.Item>
      </Form>
    </>
  );
}

export default Form.create()(Update);
