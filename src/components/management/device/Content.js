import React, { useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Modal } from 'antd';
import { useLocation } from 'react-router-dom';

import { WithContentLayout } from '@/layouts';
import { ButtonWrap } from '@/components/commons';
import { service, Fetcher, locale } from '@/configs';
import { common } from '@/store/actions';

import { values, columns, api } from '../configs';
import { DeviceTable, Formula } from '../commons';

const lang = service.getValue(locale, 'languages', {});

function Content(props) {
  const { data = [], onFetchEvents } = props;
  const dispatch = useDispatch();
  const location = useLocation();
  const [edit, setEdit] = useState(false);
  const [handler, setHandler] = useState(false);
  const commonConfig = useSelector(state => {
    return {
      unitCd: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00018')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner)
    };
  });

  const [visible, setVisible] = useState(false);
  const [selected, setSelect] = useState({});

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

  const onClickButton = useCallback(
    button => {
      switch (button.roll) {
        case 'cancel':
          return setEdit(false);
        case 'update':
          return setEdit(true);
        case 'save':
          return setHandler(true);
        default:
          break;
      }
      return null;
    },
    [setEdit, setHandler]
  );

  const onEvents = events => {
    const { method, payload } = events;

    if (!method) {
      return null;
    }

    if (Object.keys(payload).length) {
      setHandler(false);

      if (method === 'submit') {
        const obj = api.updateDeviceList(payload.result || []);
        dispatch(common.loadingStatus(true));
        return Fetcher.post(obj.url, obj.params).then(result => {
          dispatch(common.loadingStatus(false));
          if (service.getValue(result, 'success', false)) {
            setEdit(false);
            return onFetchEvents({ method: 'refetch' });
          }
        });
      }
    }
    return null;
  };

  const onChangeTable = useCallback(
    (value, column) => {
      const key = service.getValue(column, 'dataIndex', null);
      if (key) {
        return onFetchEvents({ method: 'refetch', payload: { [key]: value } });
      }
      return null;
    },
    [onFetchEvents]
  );

  const getTitle = useCallback(locationObj => {
    return service.getValue(locationObj, 'state.code.cdName', '');
  }, []);

  const getButtons = useCallback(() => {
    return service.getValue(values.pages.device.content.buttons, `${edit ? 'update' : 'read'}`, []).map(buttonKey => {
      const matched = values.actionButtons.filter(button => button.roll === buttonKey).find(item => item);
      return {
        ...matched,
        onClick: () => onClickButton(matched)
      };
    });
  }, [onClickButton, edit]);

  const getMergedColumns = useCallback(
    columnList => {
      return columnList.map(column => {
        if (column.dataIndex === 'pntAddrDesc' || column.dataIndex === 'dataTyp' || column.dataIndex === 'itemGubn' || column.dataIndex === 'scleFctr' || column.dataIndex === 'sysTag') {
          return {
            ...column,
            onCell: (record, index) => ({
              index: index + 1,
              record,
              inputType: 'text',
              dataIndex: column.dataIndex,
              title: column.title,
              editing: edit
            })
          };
        }

        if (column.dataIndex === 'pntAddrName') {
          return {
            ...column,
            onCell: () => ({
              align: 'left'
            })
          };
        }

        if (column.dataIndex === 'unitCd') {
          return {
            ...column,
            onCell: (record, index) => ({
              index: index + 1,
              record,
              inputType: 'select',
              options: service.getValue(commonConfig, 'unitCd', []).map(inner => {
                return {
                  key: inner.cd,
                  value: inner.cd,
                  label: inner.cdName
                };
              }),
              dataIndex: column.dataIndex,
              title: column.title,
              editing: edit
            })
          };
        }

        if (column.dataIndex === 'cnt') {
          column.render = (text, record) => {
            if (!text) {
              return null;
            }
            return (
              <span>
                {`${text} ${service.getValue(lang, 'LANG00270', 'no-text')}`}{' '}
                {
                  <Button type="defualt" className="grey" size="small" style={{ marginLeft: 10, fontSize: '0.8em' }} onClick={() => onOpenModal({ ...record, roll: 'formula' })}>
                    {service.getValue(lang, 'LANG00147', 'no-text')}
                  </Button>
                }
              </span>
            );
          };
        }

        return {
          ...column,
          onCell: (record, index) => ({
            index: index + 1,
            record,
            dataIndex: column.dataIndex,
            title: column.title
          })
        };
      });
    },
    [edit, onOpenModal, commonConfig]
  );

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
                    onClick: () => onCloseModal()
                  };
                });
            }
            return result;
          }, {})
        }
      };
    },
    [onCloseModal]
  );

  const getFormulaColumns = useCallback(columnList => {
    return columnList.map(column => {
      return column;
    });
  }, []);

  const title = useMemo(() => getTitle(location), [getTitle, location]);
  const buttons = useMemo(() => getButtons(), [getButtons]);
  const mergedColumns = useMemo(() => getMergedColumns(columns.deviceColumns), [getMergedColumns]);
  const modal = useMemo(() => getModal(selected), [getModal, selected]);
  const mergedFormulaColumns = useMemo(() => getFormulaColumns(service.getValue(columns, 'formulaColumns.device', [])), [getFormulaColumns]);

  return (
    <>
      <Card title={title}>
        <ButtonWrap right={buttons} style={{ marginBottom: 20 }} />

        <DeviceTable dataSource={data} columns={mergedColumns} onChangeTable={onChangeTable} bordered handler={handler} onEvents={onEvents} />
      </Card>

      <Modal
        forceRender
        centered
        destroyOnClose
        width="30%"
        maskClosable={false}
        visible={visible}
        title={service.getValue(modal, 'title', '')}
        footer={Object.keys(service.getValue(modal, 'footer', {})).length ? <ButtonWrap right={service.getValue(modal, 'footer.right', [])} left={service.getValue(modal, 'footer.left', [])} /> : null}
        onCancel={onCloseModal}
      >
        <Formula item={selected} root="device" columns={mergedFormulaColumns} rowKey="calcSeq" onEvents={onFetchEvents} />
      </Modal>
    </>
  );
}

export default WithContentLayout(Content);
