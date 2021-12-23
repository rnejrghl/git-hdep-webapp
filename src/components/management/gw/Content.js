import React, { useMemo, useCallback, useState } from 'react';
import { Card, Button, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import { WithContentLayout } from '@/layouts';
import { ButtonWrap } from '@/components/commons';
import { service, Fetcher, locale } from '@/configs';
import { common } from '@/store/actions';

import { values, columns, api } from '../configs';
import { DeviceTable, Formula } from '../commons';

const lang = service.getValue(locale, 'languages', {});

function Content(props) {
  const { data = [], onFetchEvents = null } = props;
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();
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
        const paramsList = service
          .getValue(payload, 'result', [])
          .map(item => {
            return {
              gtwyId: service.getValue(item, 'gtwyId', null),
              dvceId: service.getValue(item, 'dvceId', ''),
              dataRcrdYn: service.getValue(item, 'dataRcrdYn', false) ? 'Y' : 'N',
              addr1: service.getValue(item, 'addr1', ''),
              addr2: service.getValue(item, 'addr2', '')
            };
          })
          .filter(item => service.getValue(item, 'gtwyId', false));

        return paramsList.map((params, idx) => {
          dispatch(common.loadingStatus(true));
          const obj = api.updateGWDevice(params);

          return Fetcher.post(obj.url, obj.params).then(result => {
            if (paramsList.length - 1 === idx) {
              dispatch(common.loadingStatus(false));
              if (service.getValue(result, 'success', false)) {
                setEdit(false);
                onFetchEvents({ method: 'refetch' });
              }
            }
          });
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

  const getButtons = useCallback(() => {
    return service.getValue(values.pages.gw.content.buttons, `${edit ? 'update' : 'read'}`, []).map(buttonKey => {
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
        const { searchAble } = column;
        if (column.dataIndex === 'dataRcrdYn') {
          return {
            ...column,
            onCell: (record, index) => ({
              index: index + 1,
              record,
              inputType: 'checkbox',
              dataIndex: column.dataIndex,
              title: column.title,
              editing: edit
            })
          };
        }

        if (column.dataIndex === 'pntAddrName') {
          searchAble.onSearch = value => onChangeTable(value, column);
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
              title: column.title
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
    [edit, onOpenModal, commonConfig, onChangeTable]
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

  const modal = useMemo(() => getModal(selected), [getModal, selected]);
  const buttons = useMemo(() => getButtons(), [getButtons]);
  const mergedColumns = useMemo(() => getMergedColumns(columns.defaultDeviceColumns), [getMergedColumns]);
  const mergedFormulaColumns = useMemo(() => getFormulaColumns(service.getValue(columns, 'formulaColumns.device', [])), [getFormulaColumns]);

  return (
    <>
      <Card
        title={values.pages.gw.content.title}
        bodyStyle={{
          overflow: 'auto'
        }}
      >
        <ButtonWrap right={buttons} style={{ marginBottom: 20 }} />

        <DeviceTable dataSource={data} onChangeTable={onChangeTable} columns={mergedColumns} handler={handler} onEvents={onEvents} />
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
        <Formula item={selected} root="gw" columns={mergedFormulaColumns} rowKey="calcSeq" onEvents={onFetchEvents} />
      </Modal>
    </>
  );
}

export default WithContentLayout(Content);
