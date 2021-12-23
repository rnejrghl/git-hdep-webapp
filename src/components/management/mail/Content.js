import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Modal, Button, Row, Col, Pagination } from 'antd';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { WithContentLayout } from '@/layouts';
import { CommonTable, ButtonWrap } from '@/components/commons';
import { service, Fetcher, locale, formats } from '@/configs';
import { common } from '@/store/actions';

import { columns, values, api } from '../configs';
import Item from './Item';

const lang = service.getValue(locale, 'languages', {});

const StyleWrapper = styled.div`
  padding: 20px 20px 0;
`;

function Content(props) {
  const {
    data: { mainData = [], mainDataPage={}, noticeData = [] },
    onFetchEvents
  } = props;

  const dispatch = useDispatch();

  const [mainColumns, setMainColumns] = useState([]);
  const [totalCnt, setTotalCnt] = useState(1);
  const [nowPage, setNowPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [selected, setSelect] = useState({});

  useEffect(() => {
    setTotalCnt(mainDataPage.totalCnt);
    setNowPage(mainDataPage.page);
  }, [mainDataPage]);

  const onOpenModal = useCallback(
    select => {
      setSelect(select);
      setVisible(true);
    },
    [setVisible, setSelect]
  );

  const onCloseModal = useCallback(() => {
    setSelect({});
    setVisible(false);
  }, [setSelect, setVisible]);

  const onChangePage= useCallback(
    (value) => {
    const payload = [];
    payload['page'] = value;
    return onFetchEvents({ method: 'refetch', payload: payload });
    },
    [onFetchEvents]
  );

  const onChangeTable = useCallback(
    (value, column) => {
      const key = service.getValue(column, 'dataIndex', null);
      if (key) {
        return onFetchEvents({ method: 'refetch', payload: { [key]: value === 'all' ? null : value } });
      }
      return null;
    },
    [onFetchEvents]
  );

  const onResend = useCallback(
    record => {
      return Modal.confirm({
        title: service.getValue(lang, 'LANG00125', 'no-text'),
        content: '선택한 메세지를 재발송하시겠습니까?',
        icon: null,
        cancelButtonProps: {
          style: {
            minWidth: 80
          }
        },
        onOk: () => {
          const params = {
            alrmName: service.getValue(record, 'alrmName', null),
            sendGubn: service.getValue(record, 'sendGubn', null),
            sendCntn: service.getValue(record, 'sendCntn', null),
            recvSeq: service.getValue(record, 'recvSeq', null),
            sendGubnCntn: service.getValue(record, 'sendGubnCntn', null),
            smsAlrmYn: service.getValue(record, 'smsAlrmYn', null),
            emailAlrmYn: service.getValue(record, 'emailAlrmYn', null)
          };
          if (Object.keys(params).some(key => !params[key])) {
            return Modal.error({
              title: service.getValue(lang, 'LANG00296', 'no-text'),
              icon: null
            });
          }

          const obj = api.resendMail(params);
          dispatch(common.loadingStatus(true));
          return Fetcher.post(obj.url, obj.params).then(result => {
            dispatch(common.loadingStatus(false));
            if (service.getValue(result, 'success', false)) {
              return Modal.success({
                title: service.getValue(lang, 'LANG00125', 'no-text'),
                icon: null
              });
            }
          });
        }
      });
    },
    [dispatch]
  );

  useEffect(() => {
    const newColumns = columns.mailColumns.map(column => {
      const { searchAble, selectAble, datepickAble } = column;

      if (searchAble) {
        searchAble.onSearch = value => onChangeTable(value, column);
      }
      if (selectAble) {
        selectAble.onSelect = value => onChangeTable(value, column);
        selectAble.defaultValue = 'all';
      }
      if (datepickAble) {
        datepickAble.forEach(el => {
          el.onChange = date => onChangeTable(date ? moment(date).format(formats.timeFormat.YEARMONTHDAY) : null, el);
        });
      }
      if (column.dataIndex === 'sendCntn') {
        column.render = text => {
          return (
            <Row>
              <Col span={22}>
                <span className="ellipsis one">{text}</span>
              </Col>
              <Col span={2}>
                <Button
                  className="deep-grey"
                  type="primary"
                  onClick={() => {
                    return Modal.confirm({
                      title: service.getValue(lang, 'LANG00277', 'no-text'),
                      content: text,
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
          align: 'left'
        };
      }
      if (column.dataIndex === 'sendRsltCd') {
        column.render = text => {
          return text === 'S' ? 'SUCCESS' : 'FAIL';
        };
      }
      if (column.dataIndex === 'action') {
        column.render = (text, record) => {
          return (
            <Button onClick={() => onResend(record)} type="primary" className="deep-grey">
              {service.getValue(lang, 'LANG00125', 'no-text')}
            </Button>
          );
        };
      }
      return {
        ...column
      };
    });
    setMainColumns(newColumns);
  }, [onOpenModal, onChangeTable, onResend]);

  const getButtons = useCallback(() => {
    return values.actionButtons
      .filter(button => button.roll === 'notice')
      .map(button => {
        return {
          ...button,
          onClick: () => onOpenModal(button)
        };
      });
  }, [onOpenModal]);

  const getModal = useCallback(select => {
    return values.modals.filter(modal => modal.key === select.roll).find(modal => modal);
  }, []);

  const buttons = useMemo(() => getButtons(), [getButtons]);
  const modal = useMemo(() => getModal(selected), [getModal, selected]);

  return (
    <StyleWrapper>
      <ButtonWrap left={buttons} style={{ marginBottom: 20 }} />

      <CommonTable rowKey={(record, idx) => service.getValue(record, 'sendNo', idx)} columns={mainColumns} dataSource={mainData} scroll={{ y: 'calc(100vh - 295px)' }} />
      <Pagination total={totalCnt} current={nowPage} pagePer={10} onChange={event => onChangePage(event)} style={{ margin: '20px' }} />

      <Modal
        centered
        forceRender
        destroyOnClose
        width="80%"
        visible={visible}
        title={service.getValue(modal, 'title', '')}
        footer={null}
        onCancel={onCloseModal}
        bodyStyle={{
          height: 'calc(100vh - 220px)',
          overflowY: 'auto'
        }}
      >
        <Item onFetchEvents={onFetchEvents} data={noticeData} {...modal} />
      </Modal>
    </StyleWrapper>
  );
}

export default WithContentLayout(Content);
