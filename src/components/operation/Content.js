import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Modal, Checkbox, Tooltip, Row, Col, Pagination, Icon, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import update from 'immutability-helper';
import moment from 'moment';

import { fetch, common } from '@/store/actions';
import { WithContentLayout } from '@/layouts';
import { CommonTable, ExcelButton, Detail, ButtonWrap } from '@/components/commons';
import { service, locale, formats, Fetcher } from '@/configs';

import { values, columns, api } from './configs';
import Summary from './Summary';

import { Work } from './modal';

const lang = service.getValue(locale, 'languages', {});

const StyledDiv = styled.div`
  color: ${styleProps => {
    if (styleProps.default) {
      return styleProps.theme.black;
    }
    return styleProps.increase ? styleProps.theme.primaryColor : styleProps.theme.red;
  }};
`;

const StyleWrapper = styled.div`
  padding: 20px 20px 0;
`;

function Content(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { onFetchEvents, data } = props;
  const { operationsList = [], operationsPage = {} } = data;
  const { user = {} } = useSelector(state => service.getValue(state, 'auth', {}), shallowEqual);
  const operationsCnt = useSelector(state => service.getValue(state.fetch, 'multipleList.operationsCnt', {}), shallowEqual);
  const [handler, setHandler] = useState(false);
  // table checkbox
  const [checkedList, setCheckedList] = useState([]);

  // post, update modal state
  const [visible, setVisible] = useState(false);
  const [selected, setSelect] = useState({});

  useEffect(() => {
    const fetching = () => {
      const requestObj = api.getSummary();
      dispatch(fetch.getMultipleList([{ id: 'operationsCnt', url: requestObj.url, params: requestObj.params }]));
      return null;
    };
    fetching();
    return () => {};
  }, [dispatch]);

  const commonConfigs = useSelector(state => {
    return {
      resources: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00011')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner),
      status: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00001')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner),
      operationPvStatus: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00002')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner),
      operationEssStatus: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00027')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner)
    };
  }, shallowEqual);

  // modal
  const onOpenModal = useCallback(
    select => {
      setSelect(select);
      setVisible(true);
    },
    [setSelect, setVisible]
  );

  const onCloseModal = useCallback(() => {
    setSelect({});
    setVisible(false);
  }, [setSelect, setVisible]);

  // checkbox event
  const onCheckAllChange = useCallback(
    e => {
      if (e.target.checked) {
        setCheckedList(operationsList.map(item => item.siteId));
      } else {
        setCheckedList([]);
      }
    },
    [operationsList]
  );

  const onCheckChange = useCallback((event, record) => {
    const isChecked = event.target.checked;
    const checkedSiteId = service.getValue(record, 'siteId', null);

    if (!checkedSiteId) {
      return null;
    }
    if (isChecked) {
      return setCheckedList(state => update(state, { $push: [checkedSiteId] }));
    }
    return setCheckedList(state => {
      const newList = state.slice(0, state.length);

      return newList.filter(inner => inner !== checkedSiteId);
    });
  }, []);

  const onChangeTable = useCallback(
    (value, column) => {
      const key = column ? service.getValue(column, 'dataIndex', null) : 'page';
      if (key) {
        const payload = { [key]: value === 'all' ? null : value };
        if (column) {
          payload['page'] = 1;
        }
        return onFetchEvents({ method: 'refetch', payload: payload });
      }
      return null;
    },
    [onFetchEvents]
  );

  const onClickFooter = useCallback(
    button => {
      switch (button.roll) {
        case 'cancel':
          return onCloseModal();
        case 'confirm':
          return setHandler(true);
        case 'remove':
          return Modal.confirm({
            title: service.getValue(lang, 'LANG00068', 'no-text'),
            content: service.getValue(lang, 'LANG00259', 'no-text'),
            onOk: () => {}
          });
        default:
          return null;
      }
    },
    [onCloseModal, setHandler]
  );

  const onEvents = events => {
    const { method, payload } = events;

    if (!method) {
      return null;
    }
    if (Object.keys(payload).length) {
      setHandler(false);
      if (method === 'publish') {
        const obj = api.createWorKOrders(payload || []);
        dispatch(common.loadingStatus(true));
        return Fetcher.post(obj.url, obj.params).then(result => {
          if (service.getValue(result, 'success', false)) {
            dispatch(common.loadingStatus(false));
            return onCloseModal();
          }
        });
      }
    }
    return null;
  };

  const onClickButton = useCallback(
    button => {
      if (button.roll === 'link') {
        return history.push('/workorder');
      }
      if (button.roll) {
        return onOpenModal(button);
      }
      return null;
    },
    [onOpenModal, history]
  );

  const onClickRefresh = useCallback(
    () => {
      const payload={};

      return onFetchEvents({ method: 'refetch', payload: payload });;
    },
    [onFetchEvents]
  );

  const onPopup = path => {
    return window.open(`${window.location.origin}${path}`, '_blank', `toolbar=yes,scrollbars=yes,location=no,resizable=yes,menubar=no,top=${(window.screen.height / 2) - 345},left=${(window.screen.width / 2) - 435},width=870,height=690`);
  };

  const getButtons = useCallback(() => {
    return values.buttons.map(button => {
      return {
        ...button,
        onClick: () => onClickButton(button),
        type: 'primary',
        className: 'grey'
      };
    });
  }, [onClickButton]);

  const getModal = useCallback(
    select => {
      const matched = values.modals.filter(modal => modal.key === select.roll).find(item => item);
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
                    onClick: () => onClickFooter(button)
                  };
                });
            }
            return result;
          }, {})
        }
      };
    },
    [onClickFooter]
  );
  const getMergedColumns = useCallback(() => {
    return columns.mainColumns.map(column => {
      if (column.dataIndex === 'weatherIcon') {
        column.render = (text, record) => {
          // todo 날씨 아이콘
          const weatherIcon = service.getValue(record, 'weatherIcon', '');
          if (weatherIcon === '') {
            return <span>-</span>;
          }
          return (
            <span>
              <img src={`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`} style={{ width: '50%' }} />
            </span>
          );
        };
        return {
          ...column
        };
      }
      if (column.datepickAble) {
        column.datepickAble.forEach(el => {
          el.onChange = date => onChangeTable(date ? moment(date).format(formats.timeFormat.YEARMONTHDAY) : null, el);
        });
      }
      if (column.children) {
        return {
          ...column,
          children: column.children
            ? service.getValue(column, 'children', []).reduce((result, child) => {
                const { searchAble, selectAble } = child;
                const newChild = {};

                if (searchAble) {
                  newChild.searchAble = {
                    ...searchAble,
                    onSearch: value => onChangeTable(value, child)
                  };
                }
                if (selectAble) {
                  newChild.selectAble = {
                    ...selectAble,
                    onSelect: value => onChangeTable(value, child),
                    list: []
                  };
                }

                if (child.dataIndex === 'userName') {
                  newChild.render = (text, record) => {
                    const title = (
                      <Row>
                        <Col>{text}</Col>
                        <Col>{service.getValue(record, 'addr', '')}</Col>
                      </Row>
                    );
                    return (
                      <Tooltip title={title} placement="topLeft">
                        <span className="ellipsis">{text}</span>
                      </Tooltip>
                    );
                  };
                }

                if (child.dataIndex === 'rescGubn') {
                  newChild.render = text => {
                    const matched = service
                      .getValue(commonConfigs, 'resources', [])
                      .filter(inner => inner.cd === text)
                      .find(inner => inner);
                    return service.getValue(matched, 'cdName', '');
                  };
                  newChild.selectAble.list = [
                    { key: 'all', value: 'all', label: 'ALL' },
                    ...service.getValue(commonConfigs, 'resources', []).map(inner => {
                      return {
                        key: inner.cd,
                        value: inner.cd,
                        label: inner.cdName
                      };
                    })
                  ];
                  newChild.selectAble.defaultValue = 'all';
                }
                if (child.dataIndex === 'tradingVolume') {
                  newChild.render = (text, record) => {
                    // return service.getValue(record, 'rescGubn', 'A') === 'A' ? '-' : text;
                    return '-';
                  };
                }

                if (child.dataIndex === 'eqmtStatus') {
                  newChild.render = text => {
                    const matched = service
                      .getValue(commonConfigs, 'status', [])
                      .filter(inner => inner.cd === text)
                      .find(inner => inner);
                    return service.getValue(matched, 'cdName', '');
                  };
                  newChild.selectAble.list = [
                    { key: 'all', value: 'all', label: 'ALL' },
                    ...service.getValue(commonConfigs, 'status', []).map(inner => {
                      return {
                        key: inner.cd,
                        value: inner.cd,
                        label: inner.cdName
                      };
                    })
                  ];
                  newChild.selectAble.defaultValue = 'all';
                }

                if (child.dataIndex === 'pvOperationStatus' || child.dataIndex === 'essOperationStatus') {
                  const dataKey = child.dataIndex === 'pvOperationStatus' ? 'operationPvStatus' : 'operationEssStatus';
                  newChild.render = (text, record) => {
                    if (child.dataIndex === 'essOperationStatus' && service.getValue(record, 'rescGubn') === 'A') {
                      return '-';
                    }
                    const matched = service
                      .getValue(commonConfigs, `${dataKey}`, [])
                      .filter(inner => inner.cd === text)
                      .find(inner => inner);
                    return service.getValue(matched, 'cdName', '');
                  };
                  newChild.selectAble.list = [
                    { key: 'all', value: 'all', label: 'ALL' },
                    ...service.getValue(commonConfigs, `${dataKey}`, []).map(inner => {
                      return {
                        key: inner.cd,
                        value: inner.cd,
                        label: inner.cdName
                      };
                    })
                  ];
                  newChild.selectAble.defaultValue = 'all';
                }

                if (child.dataIndex === 'publishing') {
                  newChild.render = (text, record) => {
                    return <Checkbox checked={checkedList.includes(service.getValue(record, 'siteId', null))} value={text} onChange={event => onCheckChange(event, record)} />;
                  };
                  newChild.checkAble = {
                    onChangeHeader: e => onCheckAllChange(e)
                  };
                }
                // if (child.dataIndex === 'prVsGoal' || child.dataIndex === 'goalGenrCapaVsGoal' || child.dataIndex === 'ppaVsGoal') {
                //   newChild.render = text => {
                //     const isIncrease = parseInt(text, 10) > 0;
                //     return <StyledDiv increase={isIncrease}>{`${isIncrease ? '▲' : '▼'} ${text}`}</StyledDiv>;
                //   };
                // }

                if (child.dataIndex === 'ppa') {
                  newChild.render = (text, record) => {
                    // return service.getValue(record, 'rescGubn') === 'A' ? '-' : text;
                    return '-';
                  };
                }

                if (child.dataIndex === 'goalIvt') {
                  newChild.render = (text, record) => {
                    return Number(service.getValue(record, 'goalIvt', 0)).toFixed(0) + '%';
                  };
                }

                if (child.dataIndex === 'production' || child.dataIndex === 'energyYield' || child.dataIndex === 'ivtEfficiency' || child.dataIndex === 'ppaVsGoal') {
                  newChild.render = (text, record) => {
                    if (service.getValue(record, 'rescGubn') === 'A' && child.dataIndex === 'ppaVsGoal') {
                      return '-';
                    }
                    const base = Number(service.getValue(record, `${child.base}`, 0));
                    const modlCapa = Number(service.getValue(record, `modlCapa`, 0));
                    const amount = text === null ? 0 : child.dataIndex === 'energyYield' ? Number(text) / Number(modlCapa) : Number(text);
                    if (amount === 0) {
                      return '-';
                    }

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
  }, [onChangeTable, onCheckAllChange, commonConfigs, checkedList, onCheckChange]);

  const getDataSource = useCallback(
    select => {
      const dataKey = service.getValue(select, 'props.eqmtStatus', false);
      if (dataKey) {
        return operationsList.filter(inner => inner.eqmtStatus === dataKey);
      }
      if (select.roll === 'inspection') {
        return operationsList.filter(inner => checkedList.includes(inner.siteId));
      }
      return [];
    },
    [operationsList, checkedList]
  );

  const buttons = useMemo(() => getButtons(), [getButtons]);
  const modal = useMemo(() => getModal(selected), [selected, getModal]);
  const isRow = service.getValue(selected, 'roll', null) === 'row';
  const mergedColumns = useMemo(() => getMergedColumns(), [getMergedColumns]);
  const dataSource = useMemo(() => getDataSource(selected), [getDataSource, selected]);

  return (
    <StyleWrapper>
      <Summary dataSource={service.getValue(operationsCnt, 'operationsCnt', {})} />

      <ButtonWrap
        left={[
        <Button type="danger" onClick={() => onPopup(`/dashboard/spotPrice`)}>
          Price & Demand
        </Button>
        ]}
        right={[
        <Button onClick={onClickRefresh} type="primary">
          Refresh
        <Icon type="reload" />
        </Button>
        ]}
        style={{ padding: '20px 0' }}
      />

      <CommonTable
        rowKey={(record, idx) => service.getValue(record, 'siteId', idx)}
        columns={mergedColumns}
        dataSource={operationsList}
        onRow={rowItem => {
          return {
            onClick: e => {
              if (e.target.type !== 'checkbox') {
                onOpenModal({ ...rowItem, roll: 'row' });
              }
            },
            style: {
              cursor: 'pointer'
            }
          };
        }}
        scroll={{ y: 'calc(100vh - 440px)' }}
      />

      <Pagination total={service.getValue(operationsPage, 'totalCnt', 0)} current={service.getValue(operationsPage, 'page', 1)} pagePer={10} onChange={event => onChangeTable(event)} style={{ margin: '10px 0 0 0' }} />

      <Modal
        forceRender
        destroyOnClose
        visible={visible}
        title={service.getValue(modal, 'title', '')}
        centered
        maskClosable={false}
        onCancel={onCloseModal}
        bodyStyle={{
          padding: isRow ? 0 : 20
        }}
        width={isRow ? 1150 : 1200}
        footer={Object.keys(service.getValue(modal, 'footer', {})).length ? <ButtonWrap right={service.getValue(modal, 'footer.right', [])} left={service.getValue(modal, 'footer.left', [])} /> : null}
      >
        {isRow ? <Detail tabs={values.tabs} site={selected} /> : <Work dataSource={dataSource} selectedButton={selected} parentHandler={handler} onEvents={onEvents} />}
      </Modal>
    </StyleWrapper>
  );
}

export default WithContentLayout(Content);
