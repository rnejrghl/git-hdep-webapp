import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Select, Row, Col, DatePicker, Badge, Tooltip, Icon, Modal } from 'antd';
import echarts from 'echarts';
import styled from 'styled-components';
import { CommonChart, CommonTable, ExcelButton, CommonForm, ButtonWrap } from '@/components/commons';
import { columns, values, mockData, service, locale } from '@/configs';

import { api, Fetcher } from '@/configs';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

const lang = service.getValue(locale, 'languages', {});

const StyledDiv = styled.div`
  color: ${styleProps => {
    if (styleProps.default) {
      return styleProps.theme.black;
    }
    return styleProps.increase ? styleProps.theme.primaryColor : styleProps.theme.red;
  }};
`;

function KPI(props) {
  const { siteId = null, site, current } = props;
  const [formValues, setFormValues] = useState({});
  const [kpiData, setKpiData] = useState([]);
  const [kpiParam, setKpiParam] = useState([]);
  const [kpiView, setKpiView] = useState('T');
  const [handler, setHandler] = useState(false);
  const makeChartOptions = useCallback(
    data => {
      const xAxis = [];
      const chartData = service.getValue(columns, 'kpiChartData', null);
      let dataSet = [];
      if (kpiData.length > 0 && chartData != null) {
        dataSet = chartData.map(chart => {
          const values = [];
          kpiData.map(field => {
            values.push(service.getValue(field, chart.dataIndex, 0).replace(',', ''));
          });
          return { ...chart, data: values };
        });

        kpiData.map(field => {
          xAxis.push(service.getValue(field, 'nowDate', ''));
        });
      }

      return {
        grid: {
          right: 50,
          bottom: 15,
          left: 20,
          top: '10%',
          height: '70%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          show: true,
          data: [service.getValue(lang, 'LANG00016', 'no-text'), service.getValue(lang, 'LANG00336', 'no-text'), service.getValue(lang, 'LANG00337', 'no-text'), service.getValue(lang, 'LANG00020', 'no-text')],
          top: 0,
          left: 0,
          backgroundColor: '#f3f3f6'
        },
        xAxis: {
          data: xAxis,
          type: 'category',
          axisTick: { show: true },
          boundaryGap: false,
          axisLabel: {
            formatter: '\n{value}'
          }
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
        series: dataSet
      };
    },
    [kpiData]
  );

  const mergedFields = fields => {
    return fields.map(field => {
      if (field.key === 'type') {
        return {
          ...field,
          options: [
            { key: 'day', value: 'day', label: 'DAY' },
            { key: 'month', value: 'month', label: 'MONTH' },
            { key: 'year', value: 'year', label: 'YEAR' }
          ],
          initialValue: service.getValue(kpiParam, 'type', 'day')
        };
      }

      if (field.key === 'startDt' || field.key === 'endDt') {
        return {
          ...field,
          initialValue: service.getValue(kpiParam, `${field.key}`, null)
        };
      }
      return {
        ...field
      };
    });
  };

  const getMergedColumns = useCallback(() => {
    return columns.kpiColumns.map(column => {
      if (column.children) {
        return {
          ...column,
          children: column.children
            ? service.getValue(column, 'children', []).reduce((result, child) => {
                const newChild = {};

                if (child.dataIndex === 'genrKpi' || child.dataIndex === 'energyKpi') {
                  newChild.render = (text, record) => {
                    const base = Number(service.getValue(record, `${child.base}`, 0));
                    const amount = Number(service.getValue(record, `${child.amount}`, 0));

                    const diff = base === 0 ? amount : amount - base;
                    const printDiff = diff.toFixed(2);
                    const isDefault = diff === 0;
                    const isIncrease = diff > 0;
                    if (isDefault) {
                      return '-';
                    }
                    return <StyledDiv increase={isIncrease}>{`${isIncrease ? '▲' : '▼'} ${Math.abs(printDiff)}`}</StyledDiv>;
                  };
                }
                result.push({
                  ...child,
                  ...newChild
                });
                return result;
              }, [])
            : null
        };
      }
      return { ...column };
    });
  }, []);

  useEffect(() => {
    const submit = () => {
      onEvents({ method: 'submit', payload: formValues, current: current });
    };
    submit();
  }, [formValues, handler, current]);

  const onSubmit = useCallback(
    (events, key) => {
      const { method, payload } = events;

      if (method === 'error') {
        return onEvents({ method: 'error', payload });
      }

      if (method === 'submit') {
        setFormValues(state => {
          return {
            ...state,
            [key]: { ...payload }
          };
        });
        return null;
      }
      return null;
    },
    [current]
  );

  const onEvents = events => {
    const { method, payload, current } = events;

    if (!method) {
      return null;
    }

    if (method === 'error') {
      setHandler(false);
      return null;
    }

    if (service.getValue(payload, `${current}`, false)) {
      if (method === 'submit') {
        setHandler(false);
        return onSubmitOk(service.getValue(payload, `${current}`, false), current);
      }
    }
    return null;
  };

  const onSubmitOk = (params, current) => {
    const newParams = { ...params };
    let requestObj = {};
    switch (current) {
      case 'kpi':
        if (service.getValue(newParams, 'startDt', false) === false || service.getValue(newParams, 'endDt', false) === false) {
          return Modal.error({
            title: service.getValue(lang, 'LANG00296', 'no-text'),
            content: service.getValue(lang, 'LANG00348', 'no-text')
          });
        } else {
          newParams['siteId'] = siteId;
          requestObj = api.getSiteDetailKpiList(newParams);
        }
        break;
    }
    // dispatch(common.loadingStatus(true));
    Fetcher.get(requestObj.url, requestObj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        setKpiData(result.data);
        setKpiParam(requestObj.params);
      }
    });
    return true;
  };

  const onClick = type => {
    setKpiView(type);
  };

  const mergedColumns = useMemo(() => getMergedColumns(), [getMergedColumns]);

  const kpiList = datas => {
    return (
      <Row style={{ height: '400px' }}>
        {kpiView === 'C' ? (
          <CommonChart height={400} chartData={makeChartOptions(datas)} />
        ) : (
          <Col>
            <CommonTable columns={mergedColumns} dataSource={datas} rowKey={(datas, idx) => idx} scroll={{ x: 0, y: 350 }} />
          </Col>
        )}
      </Row>
    );
  };

  return (
    <Row className="kpi-wrap">
      <Col>
        <Card
          title={<p className="title">{service.getValue(lang, 'LANG00255', 'no-text')}</p>}
          extra={
            <Row type="flex" justify="end" align="middle" gutter={10}>
              <CommonForm
                fields={mergedFields(values.kpiSearch)}
                labelAlign="left"
                columns={4}
                formLayout={{ labelCol: { span: 1 }, wrapperCol: { span: 24 } }}
                buttons={{ position: 'right', right: [{ label: service.getValue(lang, 'LANG00057', false), type: 'primary', roll: 'submit' }] }}
                handler={handler}
                onSubmit={events => onSubmit(events, current)}
              />
            </Row>
          }
          bordered={false}
          headStyle={{ borderBottom: 0, padding: 0 }}
          bodyStyle={{ padding: 0 }}
        >
          <Row type="flex" align="middle" gutter={10} style={{ marginBottom: '10px' }}>
            <Col>
              <ButtonWrap left={[{ label: 'Table', className: 'grey', type: 'primary', roll: 'submit' }]} onEvents={() => onClick('T')}></ButtonWrap>
            </Col>
            <Col>
              <ButtonWrap left={[{ label: 'Chart', className: 'grey', type: 'primary', roll: 'submit' }]} onEvents={() => onClick('C')}></ButtonWrap>
            </Col>
          </Row>
          {kpiList(kpiData)}
        </Card>
      </Col>
    </Row>
  );
}

export default KPI;
