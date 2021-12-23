import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col, DatePicker, Select, Button, Tag, Form, Card, Modal } from 'antd';

import { CommonTable, ButtonWrap, CommonChart } from '@/components/commons';

import { fetch, common } from '@/store/actions';
import { columns, service, locale, api, Fetcher, formats } from '@/configs';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import echarts from 'echarts';

const lang = service.getValue(locale, 'languages', {});

const { Option } = Select;

const data = new Array(10).fill({}).map((_, idx) => ({
  key: idx,
  temp1: '2020.12.12 12:12',
  temp2: null,
  temp3: null
}));

function RawData({ form }) {
  const { getFieldDecorator } = form;
  const [tags, setTags] = useState([]);
  const [handler, setHandler] = useState(false);
  const [rowParam, setRowParam] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [rowView, setRowView] = useState('T');
  const tagList = useSelector(state => service.getValue(state.fetch, `multipleList.rowTagList`, []), shallowEqual);
  const site = useSelector(state => service.getValue(state.fetch, `multipleList.siteDetail`, {}), shallowEqual);

  const onSelect = () => {
    alert('click select');
  };

  const onHandleSubmit = useCallback(() => {
    return form.validateFields((err, values) => {
      if (!err) {
        const obj = values;
        const convertValue = Object.keys(obj).reduce((result, key) => {
          let newValue = obj[key];
          if (moment.isMoment(obj[key])) {
            newValue = moment(obj[key]).format(formats.timeFormat.YEARMONTHDAY);
          }
          result[key] = newValue;
          return result;
        }, {});

        return onSubmit({ method: 'submit', payload: convertValue }, 'row');
      }
      return onSubmit({ method: 'error', payload: err }, 'row');
    });
  }, [form, tags]);

  useEffect(() => {
    const submit = () => {
      onEvents({ method: 'submit', payload: rowParam, current: 'row' });
    };
    submit();
  }, [rowParam, handler]);

  const onSubmit = useCallback((events, key) => {
    const { method, payload } = events;
    if (method === 'error') {
      return onEvents({ method: 'error', payload });
    }

    if (method === 'submit') {
      setRowParam(state => {
        return {
          ...state,
          [key]: { ...payload }
        };
      });
      return null;
    }
    return null;
  }, []);

  const onEvents = events => {
    const { method, payload } = events;

    if (!method) {
      return null;
    }

    if (method === 'error') {
      setHandler(false);
      return null;
    }
    if (service.getValue(payload, 'row', false)) {
      if (method === 'submit') {
        setHandler(false);
        return onSubmitOk(service.getValue(payload, 'row', false));
      }
    }
    return null;
  };

  const onSubmitOk = params => {
    const newParams = { ...params };
    let requestObj = {};
    if (service.getValue(newParams, 'date', false) === false) {
      return Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: service.getValue(lang, 'LANG00349', 'no-text')
      });
    } else if (service.getValue(newParams, 'dvceId', 0) === 0) {
      return Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: service.getValue(lang, 'LANG00350', 'no-text')
      });
    }

    newParams['siteId'] = service.getValue(site, 'siteId', false);

    requestObj = api.getSiteDetailRawList(newParams);
    Fetcher.get(requestObj.url, requestObj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        setRowData(result.data);
      }
    });
    return true;
  };

  const onClick = type => {
    setRowView(type);
  };

  const margeFields = useCallback(() => {
    const rowList = service.getValue(rowData, 'rowList', null);
    if (rowList === null) {
      return [];
    }

    const summary = [
      { time: service.getValue(lang, 'LANG00352', 'no-text'), accAmount: service.getValue(rowData, 'minAmount', 0.0) },
      { time: service.getValue(lang, 'LANG00351', 'no-text'), accAmount: service.getValue(rowData, 'maxAmount', 0.0) },
      { time: service.getValue(lang, 'LANG00353', 'no-text'), accAmount: service.getValue(rowData, 'avgAmount', 0.0) }
    ];

    return summary.concat(
      rowList.map(row => {
        return { time: moment(service.getValue(row, 'time', '')).format(formats.timeFormat.HALFDATETIME), accAmount: service.getValue(row, 'accAmount', '0.00') };
      })
    );
  }, [rowData]);

  const margeColumns = useCallback(() => {
    const addrName = service.getValue(rowData, 'pntAddrName', null);
    if (addrName === null) {
      return columns.rawColumns;
    }

    return columns.rawColumns.map(field => {
      if (service.getValue(field, 'dataIndex', null) === 'accAmount') {
        return {
          ...field,
          title: addrName
        };
      }

      return { ...field };
    });
  }, [rowData]);

  const makeChartOptions = useCallback(
    data => {
      const label = service.getValue(rowData, 'pntAddrName', null);
      const xAxis = [];
      const yAxis = [];
      if (data.length > 0) {
        data.map(item => {
          xAxis.push(moment(service.getValue(item, 'time', '')).format(formats.timeFormat.TIME_MIN));
          yAxis.push(item.accAmount.replace(',', ''));

          return '';
        });
      }

      return {
        grid: {
          top: 30,
          right: 15,
          bottom: 40,
          left: 15
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          show: true,
          top: 0,
          left: 0,
          data: [label],
          backgroundColor: '#f3f3f6'
        },
        xAxis: {
          data: xAxis,
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          splitNumber: 6,
          axisTick: {
            show: false
          },
          axisLabel: {
            inside: false,
            formatter: '{value}'
          }
        },
        series: [
          {
            name: label,
            data: yAxis,
            type: 'line',
            lineStyle: {
              width: 1.5
            },
            areaStyle: {
              opacity: 0.7,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#d4ebfe'
                },
                {
                  offset: 1,
                  color: '#e8f3fc'
                }
              ])
            },
            symbolSize: 8
          }
        ]
      };
    },
    [rowData]
  );

  const onAddTag = () => {
    const value = form.getFieldValue('item');
    if (value === '') {
      return false;
    }
    // 동일한 필터링이 적용되어 있다면 등록하지 않음.
    if (tags.length > 0 && tags.filter(tag => tag.dvceId === value).length > 0) {
      return false;
    }

    const name = tagList
      .filter(tag => tag.dvceId === value)
      .map(tag => service.getValue(tag, 'pntAddrName', ''))
      .find(tag => tag);

    const newTags = [...tags];
    newTags.push({ dvceId: value, title: name });
    setTags(newTags);
  };

  const onRemoveTag = value => {
    const newTags = tags.filter(tag => tag.dvceId !== value);
    setTags(newTags);
  };

  const dataSource = useMemo(() => margeFields(), [rowData]);
  const column = useMemo(() => margeColumns(), [rowData]);
  return (
    <Card
      className="raw-wrap"
      title={
        <Form layout="inline">
          <Form.Item>{getFieldDecorator('date')(<DatePicker placeholder={service.getValue(lang, 'LANG00256', 'no-text')} style={{ width: 120 }} />)}</Form.Item>
          <Form.Item>
            {getFieldDecorator('dvceId', {
              initialValue: ''
            })(
              <Select placeholder={service.getValue(lang, 'LANG00257', 'no-text')} style={{ width: 300 }}>
                {tagList.map((tag, index) => {
                  return (
                    <Option key={index} value={service.getValue(tag, 'dvceId', 0)}>
                      {service.getValue(tag, 'sysTag', '-')}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
        </Form>
      }
      extra={
        <Button type="primary" onClick={onHandleSubmit}>
          {service.getValue(lang, 'LANG00057', 'no-text')}
        </Button>
      }
      headStyle={{ borderBottom: 0, padding: 0 }}
      bodyStyle={{ height: 'calc(100% - 73px)', padding: 0 }}
      style={{ height: '100%' }}
      bordered={false}
    >
      <Row type="flex" align="middle" gutter={10} style={{ marginBottom: '10px' }}>
        <Col>
          <ButtonWrap left={[{ label: 'Table', className: 'grey', type: 'primary', roll: 'submit' }]} onEvents={() => onClick('T')}></ButtonWrap>
        </Col>
        <Col>
          <ButtonWrap left={[{ label: 'Chart', className: 'grey', type: 'primary', roll: 'submit' }]} onEvents={() => onClick('C')}></ButtonWrap>
        </Col>
      </Row>

      <Row style={{ height: '400px' }}>
        {/*<Col className="tag-wrapper">*/}
        {/*  {tags.map((tag, index) => (*/}
        {/*    <Tag key={index} closable onClose={() => onRemoveTag(tag.dvceId)}>*/}
        {/*      {tag.title}*/}
        {/*    </Tag>*/}
        {/*  ))}*/}
        {/*</Col>*/}

        {rowView === 'T' ? (
          <Col>
            <CommonTable columns={column} height={400} dataSource={dataSource} rowKey={(data, idx) => idx} scroll={{ x: 0, y: 400 }} />
          </Col>
        ) : (
          <CommonChart height={400} chartData={makeChartOptions(service.getValue(rowData, 'rowList', []))} />
        )}
      </Row>
    </Card>
  );
}

export default Form.create()(RawData);
