import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Row, Col, Modal, Checkbox, Badge, Icon, Tooltip, Pagination, Button } from 'antd';
import moment from 'moment';

import { common } from '@/store/actions';
import { WithContentLayout } from '@/layouts';
import { ExcelButton, CommonTable, ButtonWrap, Register } from '@/components/commons';
import { service, Fetcher, locale, formats } from '@/configs';

import { columns, values, api } from './configs';
import Summary from './Summary';

import { Modify, Goal } from './modal';

const lang = service.getValue(locale, 'languages', {});

const StyleWrapper = styled.div`
  padding: 20px 20px 0;
`;

const StyleDay = styled.span`
  color: ${styleProps => (styleProps['diff'] === 0 ? styleProps.theme.textColor : styleProps['diff'] > 0 ? styleProps.theme.red : styleProps.theme.primaryColor)};
`;

function Content(props) {
  const { onFetchEvents, data } = props;
  const dispatch = useDispatch();
  const { prjSiteList = [], prjSiteCnt = [], prjSitePage = {} } = data;
  const { user = {} } = useSelector(state => service.getValue(state, 'auth', {}));

  // table checkbox
  const [checkedList, setCheckedList] = useState([]);

  // modal state
  const [visible, setVisible] = useState(false);
  const [selected, setSelect] = useState({});

  // handler
  const [handler, setHandler] = useState(false);
  const [edit, setEdit] = useState(false);

  //상단 박스 부분 영역 보임/숨김 처리 하기위해
  const [shText, setShText] = useState('SHOW');

  const commonConfigs = useSelector(state => {
    return {
      regions: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00005')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner)
    };
  });

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
    setEdit(false);
  }, [setSelect, setVisible, setEdit]);

  // checkbox event
  const onCheckAllChange = useCallback(
    e => {
      if (e.target.checked) {
        setCheckedList(prjSiteList.map(item => item.siteId));
      } else {
        setCheckedList([]);
      }
    },
    [prjSiteList]
  );

  const onCheckChange = useCallback(selectedRowKeys => {
    setCheckedList([...selectedRowKeys]);
  }, []);

  const onClickSearch = useCallback(
    record => {
      return onOpenModal({ ...record, roll: 'goal' });
    },
    [onOpenModal]
  );

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

  const onDeleteSiteList = useCallback(() => {
    const obj = api.deleteSiteList(checkedList.map(id => ({ siteId: id })));
    dispatch(common.loadingStatus(true));
    return Fetcher.post(obj.url, obj.params).then(result => {
      dispatch(common.loadingStatus(false));
      if (service.getValue(result, 'success', false)) {
        onCloseModal();
        onFetchEvents({ method: 'refetch' });
        setCheckedList([]);
      }
      return null;
    });
  }, [checkedList, onCloseModal, onFetchEvents, dispatch]);

  const onClickFooter = useCallback(
    button => {
      switch (button.roll) {
        case 'update':
          return setEdit(true);
        case 'cancel':
          return onCloseModal();
        case 'save':
          return setHandler(true);
        case 'remove':
          return Modal.confirm({
            title: service.getValue(lang, 'LANG00068', 'no-text'),
            content: service.getValue(lang, 'LANG00259', 'no-text'),
            onOk: () => onDeleteSiteList()
          });
        default:
          return null;
      }
    },
    [onCloseModal, setHandler, setEdit, onDeleteSiteList]
  );

  const onClick = useCallback(
    button => {
      if (button.roll) {
        if (button.roll !== 'register' && !checkedList.length) {
          return Modal.error({
            title: service.getValue(lang, 'LANG00296', 'no-text'),
            content: service.getValue(lang, 'LANG00297', 'no-text')
          });
        }
        return onOpenModal(button);
      }
      return null;
    },
    [onOpenModal, checkedList]
  );

  const BoxViewYn = useCallback(button => {
    let shText = button.target.innerText;

    if (shText == 'SHOW') {
      //shText show일떄는 버튼이 show인 상태에서 보여달라는 뜻
      // 그러므로 보여주고 hide로 변경 ㅇㅇ
      setShText('HIDE');
    } else {
      setShText('SHOW');
    }
  });

  const onUpdateTermList = payload => {
    const params = checkedList.map(id => {
      return {
        siteId: id,
        termDt: payload.termDt,
        termRsn: payload.termRsn
      };
    });
    const obj = api.endSiteList(params);
    dispatch(common.loadingStatus(true));
    return Fetcher.post(obj.url, obj.params).then(result => {
      dispatch(common.loadingStatus(false));
      if (service.getValue(result, 'success', false)) {
        onCloseModal();
        onFetchEvents({ method: 'refetch' });
      }
      return null;
    });
  };

  const onUpdateGoalAll = payload => {
    const file = service.getValue(payload, 'multipartFile.file', null);
    const obj = api.postGoalList({ siteIds: checkedList });
    dispatch(common.loadingStatus(true));
    return Fetcher.excelUpload(obj.url, obj.params, file).then(result => {
      dispatch(common.loadingStatus(false));
      if (service.getValue(result, 'success', false)) {
        onCloseModal();
        onFetchEvents({ method: 'refetch' });
      }
      return null;
    });
  };

  const onUpdateGoalList = result => {
    if (!result.length) {
      return setEdit(false);
    }
    const obj = api.updateGoal(result);
    dispatch(common.loadingStatus(true));
    return Fetcher.post(obj.url, obj.params).then(innerResult => {
      dispatch(common.loadingStatus(false));
      if (service.getValue(innerResult, 'success', false)) {
        setEdit(false);
      }
    });
  };

  const onEvents = events => {
    const { method, payload } = events;
    if (!method) {
      return null;
    }

    if (method === 'cancel') {
      return onCloseModal();
    }

    if (method === 'refetch') {
      Modal.destroyAll();
      onCloseModal();
      return onFetchEvents({ method: 'refetch' });
    }

    if (Object.keys(payload).length) {
      setHandler(false);

      if (method === 'submit') {
        return onUpdateGoalList(service.getValue(payload, 'result', []));
      }

      if (method === 'uTermList') {
        return onUpdateTermList(payload);
      }
      if (method === 'file') {
        return onUpdateGoalAll(payload);
      }
    }
    return null;
  };

  const getButtons = useCallback(() => {
    const myLvlCd = service.getValue(user, 'userLvlCd', null);
    if (myLvlCd !== 'ACN001' && myLvlCd !== 'ACN002' && myLvlCd !== 'ACN003') {
      return [];
    }
    let buttonList = values.buttons;
    if (myLvlCd === 'ACN004' || myLvlCd === 'ACN007') {
      buttonList = buttonList.filter(button => service.getValue(button, 'roll', null) !== 'register');
    }
    return buttonList.map(button => {
      return {
        ...button,
        onClick: () => onClick(button),
        className: 'grey',
        type: 'primary'
      };
    });
  }, [onClick]);

  const getModal = useCallback(
    select => {
      const matched = values.modals.filter(modal => modal.key === select.roll).find(item => item);
      const footer = edit ? service.getValue(matched, 'edit', {}) : service.getValue(matched, 'footer', {});
      return {
        ...matched,
        footer:
          select.roll === 'register'
            ? footer
            : {
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
    [onClickFooter, edit]
  );

  const getSummaries = useCallback(dataSource => {
    return service.getValue(dataSource, '0', {});
  }, []);

  const getMergedColumns = useCallback(() => {
    const makeColumns = list => {
      return list.map(column => {
        const { searchAble, datepickAble, selectAble, checkAble } = column;
        let children;
        if (column.children) {
          children = makeColumns(column.children);
        }

        if (searchAble) {
          searchAble.onSearch = value => onChangeTable(value, column);
        }

        if (selectAble) {
          selectAble.onSelect = value => onChangeTable(value, column);
        }

        if (datepickAble) {
          datepickAble.forEach(el => {
            el.onChange = date => onChangeTable(date ? moment(date).format(formats.timeFormat.YEARMONTHDAY) : null, el);
          });
        }

        if (checkAble) {
          checkAble.onChangeHeader = e => onChangeTable(e.target.checked ? 'Y' : 'N', column);
        }

        if (column.dataIndex === 'cnrtStrtDt' || column.dataIndex === 'wkplCmplDt' || column.dataIndex === 'expnDt') {
          column.render = text => {
            return text ? (
              <Row>
                <Col>
                  <Badge status="success" title={null} />
                </Col>
                <Col>{moment(text).format(formats.timeFormat.FULLDATEDOT)}</Col>
              </Row>
            ) : null;
          };
        }

        if (column.dataIndex === 'applCmdt' || column.dataIndex === 'apprCmdt' || column.dataIndex === 'mpCmdt' || column.dataIndex === 'insCmdt') {
          column.render = (text, record) => {
            const base = service.getValue(record, `${column.base}`, false);
            if (text) {
              return (
                <Row>
                  <Col>
                    <Badge status="success" title={null} />
                  </Col>
                  <Col>{moment(text).format(formats.timeFormat.FULLDATEDOT)}</Col>
                </Row>
              );
            }

            if (base) {
              const nowDate = moment(moment().format(formats.timeFormat.FULLDATEDOT), formats.timeFormat.YEARMONTHDAY);
              const targetDate = moment(base, formats.timeFormat.YEARMONTHDAY);
              const diff = targetDate ? nowDate.diff(targetDate, 'days') : 0;

              return <StyleDay diff={diff}>{`D${diff === 0 ? '-day' : diff > 0 ? `+${diff}` : `${diff}`}`}</StyleDay>;
            }

            return null;
          };
        }
        if (column.dataIndex === 'mngStrtDt' || column.dataIndex === 'termDt' || column.dataIndex === 'chkCmplDt') {
          column.render = text => {
            return text ? (
              <Row>
                <Col>
                  <Badge status="success" title={null} />
                </Col>
                <Col>{moment(text).format(formats.timeFormat.FULLDATEDOT)}</Col>
              </Row>
            ) : null;
          };
        }

        if (column.dataIndex === 'userName') {
          column.render = (text, record) => {
            const matched = service
              .getValue(commonConfigs, 'regions', [])
              .filter(inner => inner.cd === service.getValue(record, 'regnGubn', null))
              .find(inner => inner);
            const title = (
              <Row>
                <Col>{text}</Col>
                <Col>{service.getValue(matched, 'cdName', '')}</Col>
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

        if (column.dataIndex === 'capacity') {
          column.render = (text, record) => service.getCapacity(record);
        }

        if (column.dataIndex === 'goalYnNm') {
          column.render = (text, record) => {
            return text === 'N' ? (
              text
            ) : (
              <Icon
                type="zoom-in"
                style={{ fontSize: '16px' }}
                onClick={e => {
                  e.stopPropagation();
                  return onClickSearch(record);
                }}
              />
            );
          };
        }

        return {
          ...column,
          ...children
        };
      });
    };
    return makeColumns(columns.planColumns);
  }, [onClickSearch, onChangeTable, commonConfigs]);

  const buttons = useMemo(() => getButtons(), [getButtons]);

  const modal = useMemo(() => getModal(selected), [getModal, selected]);
  const roll = service.getValue(selected, 'roll', '');
  const summaries = useMemo(() => getSummaries(prjSiteCnt), [prjSiteCnt, getSummaries]);
  const mergedColumns = useMemo(() => getMergedColumns(), [getMergedColumns]);

  const totalCnt = service.getValue(prjSitePage, 'totalCnt', 0);
  const nowPage = service.getValue(prjSitePage, 'page', 1);

  return (
    <StyleWrapper>
      <Button className="grey" type="primary" onClick={BoxViewYn} style={{ marginBottom: '6px' }}>
        {shText}
      </Button>

      {shText == 'HIDE' ? <Summary dataSource={summaries} /> : ''}

      <ButtonWrap
        left={buttons}
        right={[
          <span style={{ fontSize: 14 }}>
            {`${service.getValue(lang, 'LANG00172', 'no-text')}`} : {totalCnt}
          </span>,
          <ExcelButton href={`/pp/prjSites/excel?user=${service.getValue(user, 'userId')}`} />
        ]}
        style={{ padding: '20px 0' }}
      />
      <CommonTable
        rowKey={(record, idx) => service.getValue(record, 'siteId', idx)}
        columns={mergedColumns}
        dataSource={prjSiteList}
        scroll={{ x: 1400, y: 'calc(100vh - 400px)' }}
        rowSelection={{
          columnTitle: (
            <span>
              <div>
                <Checkbox onChange={onCheckAllChange} />
              </div>
            </span>
          ),
          selectedRowKeys: checkedList,
          onChange: onCheckChange
        }}
        onRow={record => {
          return {
            onClick: e => {
              if (e.target.type !== 'checkbox') {
                onOpenModal({ ...record, roll: 'register' });
              }
            },
            style: {
              cursor: 'pointer',
              lineHeight: '0.9'
            }
          };
        }}
      />
      <Pagination total={totalCnt} current={nowPage} pagePer={10} onChange={event => onChangeTable(event)} style={{ margin: '10px 0 0 0' }} />
      <Modal
        forceRender
        destroyOnClose
        centered
        visible={visible}
        title={roll === 'register' ? service.getValue(modal, 'title', '') : service.getValue(modal, 'title', '')}
        footer={roll === 'register' ? null : <ButtonWrap right={service.getValue(modal, 'footer.right', [])} left={service.getValue(modal, 'footer.left', [])} />}
        wrapClassName={roll === 'register' ? 'ant-modal-bg' : ''}
        onCancel={onCloseModal}
        width={roll === 'register' ? 1100 : roll === 'goal' ? 700 : 500}
        bodyStyle={{
          padding: roll === 'register' ? 0 : 20
        }}
      >
        {roll === 'register' ? (
          <Register {...modal} onEvents={onEvents} item={selected} />
        ) : roll === 'goal' ? (
          <Goal {...modal} selected={selected} edit={edit} handler={handler} onEvents={onEvents} />
        ) : (
          <Modify {...modal} type={modal.key} checkedList={checkedList} handler={handler} onEvents={onEvents} />
        )}
      </Modal>
    </StyleWrapper>
  );
}

export default WithContentLayout(Content);
