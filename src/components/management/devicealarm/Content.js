import React, { useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Checkbox } from 'antd';
import styled from 'styled-components';

import { WithContentLayout } from '@/layouts';
import { ButtonWrap, EditableTable } from '@/components/commons';
import { service, Fetcher, locale } from '@/configs';
import { common } from '@/store/actions';

import { values, columns, api } from '../configs';
import { Formula } from '../commons';

const lang = service.getValue(locale, 'languages', {});

const StyleWrapper = styled.div`
  padding: 20px 20px 0;
`;

function Content(props) {
  const { data = [], onFetchEvents } = props;
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [handler, setHandler] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selected, setSelect] = useState({});
  const commonConfig = useSelector(state => {
    return {
      deviceStatus: service
        .getValue(state.auth, 'configs', [])
        .filter(inner => inner.grpCd === 'CDK-00001')
        .map(inner => service.getValue(inner, 'codes', []))
        .find(inner => inner)
    };
  });

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
        const params = service.getValue(payload, 'result', []).map(item => {
          return {
            alrtCd: service.getValue(item, 'alrtCd', null),
            alrtName: service.getValue(item, 'alrtName', null),
            alrtTypCd: service.getValue(item, 'alrtTypCd', null),
            alrtGrdCd: service.getValue(item, 'alrtGrdCd', null),
            alrtCntn: service.getValue(item, 'alrtCntn', null),
            contTime: service.getValue(item, 'contTime', null),
            sendCycl: service.getValue(item, 'sendCycl', null),
            note: service.getValue(item, 'note', null),
            ...values.pages.deviceAlarm.content.sendOptions.reduce((result, inner) => {
              result[`${inner.key}`] = service.getValue(item, 'send', []).includes(inner.key) ? 'Y' : 'N';
              return result;
            }, {})
          };
        });

        const obj = api.updateDeviceAlram(params);
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

  const getMergedColumns = useCallback(
    columnList => {
      return columnList.map(column => {
        if (column.dataIndex === 'alrtTypCd') {
          column.selectAble.list = [{ key: 'all', value: 'all', label: 'ALL' }].concat(
            service.getValue(commonConfig, 'deviceStatus', []).map(item => {
              return {
                key: item.cd,
                value: item.cd,
                label: item.cdName
              };
            })
          );
          column.selectAble.onSelect = value => onChangeTable(value, column);
          column.selectAble.defaultValue = 'all';
          column.render = text => {
            const matched = service
              .getValue(commonConfig, 'deviceStatus', [])
              .filter(inner => inner.cd === text)
              .find(inner => inner);
            return service.getValue(matched, 'cdName', null);
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
        if (column.dataIndex === 'send') {
          column.render = (text, record) => {
            const newValue = values.pages.deviceAlarm.content.sendOptions.filter(inner => service.getValue(record, `${inner.key}`, 'N') === 'Y');
            return <Checkbox.Group disabled={!edit} options={values.pages.deviceAlarm.content.sendOptions} defaultValue={newValue.map(item => item.value)} />;
          };

          return {
            ...column,
            onCell: (record, index) => ({
              index: index + 1,
              record,
              inputType: 'checkboxGroup',
              options: values.pages.deviceAlarm.content.sendOptions,
              dataIndex: column.dataIndex,
              title: column.title,
              editing: edit
            })
          };
        }

        if (column.dataIndex === 'alrtCntn' || column.dataIndex === 'contTime' || column.dataIndex === 'sendCycl' || column.dataIndex === 'note') {
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

  const getFormulaColumns = useCallback(columnList => {
    return columnList.map(column => {
      return {
        ...column
      };
    });
  }, []);

  const getButtons = useCallback(() => {
    return service.getValue(values.pages.deviceAlarm.content.buttons, `${edit ? 'update' : 'read'}`, []).map(buttonKey => {
      const matched = values.actionButtons.filter(button => button.roll === buttonKey).find(item => item);
      return {
        ...matched,
        onClick: () => onClickButton(matched)
      };
    });
  }, [onClickButton, edit]);

  const buttons = useMemo(() => getButtons(), [getButtons]);
  const modal = useMemo(() => getModal(selected), [getModal, selected]);
  const mergedColumns = useMemo(() => getMergedColumns(columns.deviceAlarmColumns), [getMergedColumns]);
  const mergedFormulaColumns = useMemo(() => getFormulaColumns(columns.formulaColumns.deviceAlarm), [getFormulaColumns]);

  return (
    <StyleWrapper>
      <ButtonWrap right={buttons} style={{ marginBottom: 20 }} />

      <EditableTable columns={mergedColumns} dataSource={data} scroll={{ y: 'calc(100vh - 295px)' }} editableAll handler={handler} onEvents={onEvents} />

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
        <Formula item={selected} root="deviceAlram" columns={mergedFormulaColumns} rowKey="calcSeq" onEvents={onFetchEvents} />
      </Modal>
    </StyleWrapper>
  );
}

export default WithContentLayout(Content);
