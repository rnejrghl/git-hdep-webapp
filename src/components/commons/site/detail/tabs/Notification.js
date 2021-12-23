import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Card, Row, Col, Modal, Badge, Button } from 'antd';
import UAParser from 'ua-parser-js';

import { CommonTable, CommonForm } from '@/components/commons';
import { columns, values, service, locale, api, Fetcher, formats } from '@/configs';
import { api as woApi } from '../../../../workorder/configs';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

const lang = service.getValue(locale, 'languages', {});
const parser = new UAParser();

const Notification = props => {
  const { dataSource, publish = true, siteId = '', workOrdUserSeq = 0, workOrdUserName = '' } = props;
  const isMobile = parser.getDevice().type === 'mobile';

  const [notiParams, setNotiParams] = useState([]);
  const [notiData, setNotiData] = useState(useSelector(state => service.getValue(state.fetch, `multipleList.siteFailAlarm`, []), shallowEqual));
  const [workParams, setWorkParams] = useState([]);
  const [workData, setWorkData] = useState(useSelector(state => service.getValue(state.fetch, `multipleList.siteWorkOrder`, []), shallowEqual));
  const { user = {} } = useSelector(state => service.getValue(state, 'auth', {}));

  const commonConfigs = useSelector(state => {
    return {
      failStatus: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00028')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner),
      workOrdTypes: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00009')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner),
      workOrdStatus: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00010')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner)
    };
  }, shallowEqual);

  const onChangeTable = useCallback((value, column, current) => {
    const key = service.getValue(column, 'dataIndex', null);
    if (key) {
      return onSearchEvent(key, value, current);
    }
    return null;
  }, []);

  const onSearchEvent = (key, value, current) => {
    const newParams = current === 'notification' ? notiParams : workParams;
    newParams[key] = value === 'all' || value === null ? '' : value;

    if (service.getValue(newParams, 'siteId', null) === null) {
      newParams['siteId'] = siteId;
    }

    let requestObj = {};
    switch (current) {
      case 'notification':
        requestObj = api.getSiteDetailFailAlarm(newParams);
        setNotiParams(newParams);
        break;
      case 'workOrder':
        if (service.getValue(newParams, 'userSeq', null) === null) {
          newParams['userSeq'] = workOrdUserSeq;
        }
        requestObj = api.getSiteDetailWorkOrders(newParams);
        setWorkParams(newParams);
        break;
    }
    Fetcher.get(requestObj.url, requestObj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        switch (current) {
          case 'notification':
            setNotiData(result.data);
            break;
          case 'workOrder':
            setWorkData(result.data);
            break;
        }
      }
    });
    return true;
  };

  const onSubmit = events => {
    const { method, payload } = events;
    if (method === 'submit') {
      if (service.getValue(payload, 'workOrdTyp', null) === null) {
        return Modal.error({
          title: service.getValue(lang, 'LANG00296', 'no-text'),
          content: service.getValue(lang, 'LANG00298', 'no-text')
        });
      }

      if (service.getValue(payload, 'cmplReqDt', null) === null) {
        return Modal.error({
          title: service.getValue(lang, 'LANG00296', 'no-text'),
          content: service.getValue(lang, 'LANG00354', 'no-text')
        });
      }

      Modal.confirm({
        title: service.getValue(lang, 'LANG00173', 'no-text'),
        content: service.getValue(lang, 'LANG00355', 'no-text'),
        icon: null,
        okText: service.getValue(lang, 'LANG00089', 'no-text'),
        onOk: () => onSubmitOk(payload)
      });
    }
    return null;
  };

  const onSubmitOk = payload => {
    const newParam = payload;
    newParam['siteId'] = siteId;
    const obj = woApi.createWorkOrder(payload);
    return Fetcher.post(obj.url, obj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        onSearchEvent('siteId', siteId, 'workOrder');
        return Modal.success({
          title: service.getValue(lang, 'LANG00173', 'no-text'),
          content: service.getValue(lang, 'LANG00356', 'no-text'),
          icon: null
        });
      }
    });
  };

  const makeColumns = (columnList, key) => {
    return columnList.map(column => {
      const { searchAble, datepickAble, selectAble } = column;
      if (searchAble) {
        searchAble.onSearch = value => onChangeTable(value, column, key);
      }

      if (selectAble) {
        selectAble.onSelect = value => onChangeTable(value, column, key);
      }

      if (column.datepickAble) {
        datepickAble.forEach(el => {
          el.onChange = date => {
            return onChangeTable(date ? moment(date).format(formats.timeFormat.YEARMONTHDAY) : null, el, key);
          };
        });
      }

      if (column.dataIndex === 'notiDt' || column.dataIndex === 'unlockDt' || column.dataIndex === 'publDtti') {
        column.render = text => {
          return text ? moment(text).format(formats.timeFormat.FULLDATETIME) : '';
        };
      }

      if (column.dataIndex === 'status' || column.dataIndex === 'workOrdTyp' || column.dataIndex === 'workOrdStat') {
        const config = service.getValue(commonConfigs, `${column.configKey}`, []);
        selectAble.list = [
          { key: 'all', value: 'all', label: 'ALL' },
          ...config.map(inner => {
            return {
              key: inner.cd,
              value: inner.cd,
              label: inner.cdName
            };
          })
        ];

        selectAble.defaultValue = 'all';

        column.render = text => {
          const viewText = config
            .filter(inner => service.getValue(inner, 'cd', null) === text)
            .map(inner => inner.cdName)
            .find(inner => inner);
          return viewText;
        };
      }
      if (column.dataIndex === 'contents') {
        column.render = text => {
          const contents = JSON.parse(text);
          const list = column.visibleAble.map(field => {
            return (
              <Row type="flex" justify="start">
                <Col span={8} style={{ 'font-weight': 'bold' }}>
                  {field}
                </Col>
                <Col span={16}>{service.getValue(contents, field, '-')}</Col>
              </Row>
            );
          });
          return (
            <Row type="flex" justify="center">
              <Col>
                <Button
                  className="deep-grey"
                  type="primary"
                  onClick={() => {
                    return Modal.success({
                      title: service.getValue(lang, 'LANG00277', 'no-text'),
                      content: list,
                      icon: null,
                      cancelButtonProps: { style: { minWidth: 80 } }
                    });
                  }}
                >
                  {service.getValue(lang, 'LANG00277', 'no-text')}
                </Button>
              </Col>
            </Row>
          );
        };

        return {
          ...column,
          align: 'center'
        };
      }

      if (column.dataIndex === 'rsltRegYn') {
        selectAble.list = [
          { key: 'all', value: 'all', label: 'ALL' },
          { key: 'Y', value: 'Y', label: service.getValue(lang, 'LANG00048', null) },
          { key: 'N', value: 'N', label: service.getValue(lang, 'LANG00049', null) }
        ];
        selectAble.defaultValue = 'all';

        column.render = text => {
          return text === 'Y' ? service.getValue(lang, 'LANG00048', null) : service.getValue(lang, 'LANG00049', null);
        };
      }
      return { ...column };
    });
  };

  const mergedFields = fields => {
    return fields.map(field => {
      if (field.key === 'userSeq') {
        return {
          ...field,
          initialValue: workOrdUserSeq
        };
      }

      if (field.key === 'workOrdUserName') {
        return {
          ...field,
          initialValue: workOrdUserName
        };
      }

      if (field.key === 'workOrdTyp') {
        const config = service.getValue(commonConfigs, `workOrdTypes`, []);
        return {
          ...field,
          options: config.map(item => {
            return {
              key: item.cd,
              value: item.cd,
              label: item.cdName
            };
          }),
          initialValue: null
        };
      }

      if (field.key === 'cmplReqDt') {
        return {
          ...field,
          initialValue: null
        };
      }

      if (field.key === 'workOrdPublGubn') {
        const userLvlCd = service.getValue(user, 'userLvlCd', false);
        let publGubn = 'A';
        if (userLvlCd !== 'ACN001' && userLvlCd !== 'ACN002') {
          publGubn = 'B';
        }

        return {
          ...field,
          initialValue: publGubn
        };
      }

      return { ...field };
    });
  };

  const getCardList = useCallback(() => {
    const list = publish ? values.siteDetail.pages.notification : values.siteDetail.pages.notification.filter(inner => inner.key !== 'workOrderPublish');
    return isMobile
      ? list
          .filter(item => item.key === 'notification')
          .map(item => {
            return {
              ...item,
              colSpan: 24
            };
          })
      : list;
  }, [publish]);

  const cardList = useMemo(() => getCardList(), [getCardList]);
  const positionList = [{ key: 'left' }, { key: 'right' }];

  return (
    <Row type="flex" justify="space-between" align="stretch" gutter={10} className="notification-wrap">
      {positionList.map(position => {
        return (
          <Col span={12} key={position.key}>
            {cardList
              .filter(card => card.position === position.key)
              .map(card => {
                const datasource = card.key === 'notification' ? notiData : workData;
                const maxHeight = card.key === 'notification' ? 380 : 300;
                return (
                  <Col span={publish ? card.colSpan : 24} key={card.key}>
                    <Card
                      title={
                        <p className="title" style={{ marginBottom: 0 }}>
                          {card.title}
                        </p>
                      }
                      extra={card.extra ? <span>{`${card.extra}: ${service.getValue(datasource, 'length', 0)}`}</span> : null}
                      headStyle={{ padding: '0px 20px 0', borderBottom: 0 }}
                      bodyStyle={{ height: 'calc(100% - 68px)', padding: '0 20px 20px' }}
                      style={{ height: '100%' }}
                    >
                      {card.type && card.type === 'table' ? (
                        <CommonTable
                          rowKey={(record, idx) => service.getValue(record, 'workOrdId', idx)}
                          columns={makeColumns(service.getValue(columns, `${card.key}Columns`, []), card.key)}
                          dataSource={datasource}
                          scroll={{ x: 0, y: isMobile ? 'calc(100vh - 192px)' : maxHeight }}
                          pagination={false}
                        />
                      ) : (
                        <CommonForm fields={mergedFields(card.fields)} onSubmit={events => onSubmit(events)} labelAlign="left" buttons={{ position: 'bottom', right: [{ label: service.getValue(lang, 'LANG00050', 'no-text'), type: 'primary', roll: 'submit' }] }} isReset={true} />
                      )}
                    </Card>
                  </Col>
                );
              })}
          </Col>
        );
      })}
    </Row>
  );
};

export default Notification;
