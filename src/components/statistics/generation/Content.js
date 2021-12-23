import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Card, Row, Col, DatePicker, Checkbox, Tooltip, Modal, input, Select, Pagination } from 'antd';
import { useHistory } from 'react-router-dom';
import update from 'immutability-helper';
import { common } from '@/store/actions';
import { WithContentLayout } from '@/layouts';
import { CommonTable, CommonChart, ExcelButton, Detail, ButtonWrap, CommonForm } from '@/components/commons';
import { service, locale, Fetcher } from '@/configs';
import { columns, api, values } from '../configs';
import { options } from 'less';

const lang = service.getValue(locale, 'languages', {});

const { Option } = Select;

const Wrapper = styled.div`
  margin-right: 10px;
`;

const StyleWrapper = styled.div`
  padding: 10px;
`;

function Content(props) {
  const { current, data } = props;
  const [formValues, setFormValues] = useState({});
  const [statData, setStatData] = useState([]);
  const [totalCnt, setTotalCnt] = useState(0);
  const [nowPage, setNowPage] = useState(1);
  const [statParam, setStatParam] = useState([]);
  const [handler, setHandler] = useState(false);
  const [visible, setVisible] = useState(false);
  const [siteId, setSiteId] = useState('');
  const [userName, setUserName] = useState('');

  const mergedFields = fields => {
    return fields.map(field => {
      if (field.key === 'type') {
        return {
          ...field,
          options: [
            { key: 'hour', value: 'hour', label: 'HOUR' },
            { key: 'day', value: 'day', label: 'DAY' },
            { key: 'month', value: 'month', label: 'MONTH' }
          ],
          initialValue: service.getValue(statParam, 'type', 'hour')
        };
      }
      if (field.key === 'startDt' || field.key === 'endDt') {
        return {
          ...field,
          initialValue: service.getValue(statParam, `${field.key}`, null)
        };
      }
      if (field.key === 'siteId') {
        if (siteId === '') {
          return {
            ...field,
            props: { placeholder: service.getValue(lang, 'LANG00063', 'no-text'), onClick: onOpenModal },
            payload: service.getValue(siteId)
          };
        } else {
          return {
            ...field,
            props: { placeholder: siteId, onClick: onOpenModal },
            payload: service.getValue(siteId)
          };
        }
      }
      if (field.key === 'userName') {
        if (userName === '') {
          return {
            ...field,
            props: { placeholder: service.getValue(lang, 'LANG00064', 'no-text'), onClick: onOpenModal },
            payload: service.getValue(userName)
          };
        } else {
          return {
            ...field,
            props: { placeholder: userName, onClick: onOpenModal },
            payload: service.getValue(userName)
          };
        }
      }
      return {
        ...field
      };
    });
  };

  const replaceNull = obj => {
    Object.keys(obj).forEach(key => {
      if (obj[key] === null) {
        obj[key] = '0';
      }
    });
    return obj;
  };

  const stringToDate = str => {
    const y = str.substr(0, 4);
    const m = str.substr(4, 2);
    const d = str.substr(6, 2);
    return new Date(y, m - 1, d);
  };

  const onSubmitOk = params => {
    const newParams = { ...params };
    let requestObj = {};
    const startDt = service.getValue(newParams, 'startDt', '0');
    const endDt = service.getValue(newParams, 'endDt', '0');
    const dateDiff = (stringToDate(endDt) - stringToDate(startDt)) / (1000 * 60 * 60 * 24);
    if (service.getValue(newParams, 'startDt', false) === false || service.getValue(newParams, 'endDt', false) === false) {
      return Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: service.getValue(lang, 'LANG00348', 'no-text')
      });
    } else if (newParams['type'] === 'hour' && dateDiff >= 8) {
      return Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: service.getValue(lang, 'LANG00367', 'no-text')
      });
    } else if (siteId === '') {
      return Modal.error({
        title: service.getValue(lang, 'LANG00296', 'no-text'),
        content: service.getValue(lang, 'LANG00366', 'no-text')
      });
    } else {
      newParams['siteId'] = siteId;
      newParams['page'] = 1;
      delete newParams['userName'];
      requestObj = api.getGenStatList(newParams);
    } // dispatch(common.loadingStatus(true));
    Fetcher.get(requestObj.url, requestObj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        const newList = result.data.genList;
        newList.map(list => replaceNull(list));
        setStatData(newList);
        setStatParam(requestObj.params);
        setTotalCnt(result.data.genCnt.totalCnt);
        setNowPage(result.data.genCnt.page);
      }
    });
    return true;
  };

  const onChangePage = value => {
    let requestObj = {};
    statParam['page'] = value;
    requestObj = api.getGenStatList(statParam);
    Fetcher.get(requestObj.url, requestObj.params).then(result => {
      if (service.getValue(result, 'success', false)) {
        const newList = result.data.genList;
        newList.map(list => replaceNull(list));
        setStatData(newList);
        setStatParam(requestObj.params);
        setTotalCnt(result.data.genCnt.totalCnt);
        setNowPage(result.data.genCnt.page);
      }
    });
    return true;
  };

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

  const onOpenModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const onChange = useCallback(value => {
    const split = value.split(' , ');
    setSiteId(split[0]);
    setUserName(split[1]);
  }, []);

  const onClickButton = useCallback(
    button => {
      switch (button.roll) {
        case 'cancel':
          return setVisible(false), setSiteId(''), setUserName('');
        case 'confirm':
          return setVisible(false);
        default:
          break;
      }
      return null;
    },
    [setVisible]
  );

  const getModal = useCallback(() => {
    const matched = values.modal;
    const footer = service.getValue(matched, 'footer', {});
    return {
      ...matched,
      footer: {
        ...Object.keys(footer).reduce((result, key) => {
          if (Array.isArray(footer[key])) {
            result[key] = values.actionButtons
              .filter(button => footer[key].includes(button.roll))
              .sort((a, b) => a.key - b.key)
              .map(button => {
                return {
                  ...button,
                  onClick: () => onClickButton(button)
                };
              });
          }
          return result;
        }, {})
      }
    };
  }, [onClickButton]);

  const modal = useMemo(() => getModal(), [getModal]);

  const SearchView = useCallback(
    data => {
      if (data.length > 0) {
        return (
          <Select showSearch style={{ width: '100%' }} placeholder={service.getValue(lang, 'LANG00364', 'no-text')} onChange={onChange}>
            {data.map(element => (
              <Option key={`${element.siteId} , ${element.userName}`} value={`${element.siteId} , ${element.userName}`}>
                {`${element.siteId} , ${element.userName}`}
              </Option>
            ))}
          </Select>
        );
      }
    },
    [data]
  );

  return (
    <Wrapper>
      <Row className="stat-wrap">
        <Col>
          <Card // title={<p className="title">{service.getValue(lang, 'LANG00301', 'no-text')}</p>}
            extra={
              <Row type="flex" justify="end" align="middle" gutter={10}>
                <CommonForm
                  layout="inline"
                  fields={mergedFields(values.statSearch)}
                  labelAlign="right"
                  columns={5}
                  formLayout={{ labelCol: { span: 1 }, wrapperCol: { span: 23 } }}
                  buttons={{ position: 'right', right: [{ label: service.getValue(lang, 'LANG00057', false), type: 'primary', roll: 'submit', style: { marginRight: '18px', marginBottom: '5px' } }] }}
                  handler={handler}
                  onSubmit={events => onSubmit(events, current)}
                  stlye={{ width: '100%' }}
                />
              </Row>
            }
            bordered={false}
            headStyle={{ borderBottom: 0, padding: 0 }}
            bodyStyle={{ padding: 0 }}
          >
            <Row type="flex" align="top" gutter={10} style={{ marginTop: '10px', marginLeft: '5px' }}>
              <Col>
                <ButtonWrap
                  right={[
                    <span style={{ fontSize: 14, display: 'inline-block', marginTop: '5px' }}>
                      {`${service.getValue(lang, 'LANG00172', 'no-text')}`}: {totalCnt}  
                    </span>,
                    <ExcelButton href={`/st/genStatList/excel?startDt=${statParam.startDt}&endDt=${statParam.endDt}&type=${statParam.type}&siteId=${statParam.siteId}`} />
                  ]}
                />
              </Col>
              <StyleWrapper>
                <Row style={{ height: '400px' }}>
                  <Col>
                    <CommonTable columns={columns.statColumns} dataSource={statData} rowKey={(datas, idx) => idx} scroll={{ x: 0, y: 'calc(100vh - 396px)' }} />
                    <Pagination total={totalCnt} current={nowPage} pagePer={10} onChange={event => onChangePage(event)} style={{ margin: '20px' }} />
                  </Col>
                </Row>
              </StyleWrapper>
            </Row>
          </Card>
        </Col>
      </Row>

      <Modal
        centered
        forceRender
        destroyOnClose
        width="25%"
        height="45%"
        maskClosable={false}
        visible={visible}
        title={service.getValue(lang, 'LANG00363', 'no-text')}
        footer={Object.keys(service.getValue(modal, 'footer', {})).length ? <ButtonWrap right={service.getValue(modal, 'footer.right', [])} left={service.getValue(modal, 'footer.left', [])} /> : null}
        onCancel={() => (setVisible(false), setSiteId(''), setUserName(''))}
        wrapperCol={{ span: 10 }}
      >
        <Row type="flex" align="middle" justify="start" gutter={10}>
          <Col span={1.5} style={{ fontSize: 20 }}>
            {`${service.getValue(lang, 'LANG00364', 'no-text')}`}
          </Col>
        </Row>
        <StyleWrapper>{SearchView(data)}</StyleWrapper>
      </Modal>
    </Wrapper>
  );
}

export default WithContentLayout(Content);
