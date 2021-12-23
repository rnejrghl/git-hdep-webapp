import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Icon, Button, Modal } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { CommonForm } from '@/components/commons';

import { common, fetch } from '@/store/actions';
import { service, Fetcher, locale } from '@/configs';
import { api, values } from '../configs';

import InqItem from '../role/Item';
import TreeItem from '../menu/TreeItem';

const lang = service.getValue(locale, 'languages', {});

function Item(props) {
  const { id, mode } = useParams();
  const [item, setItem] = useState({});
  const [visible, setVisible] = useState(false);
  const [selected, setSelect] = useState({});
  const { handler, onEvents } = props;
  const { userData = {} } = item;
  const [formValues, setFormValues] = useState({});
  const [inqGrpId, setInqGrpId] = useState(null);
  const [menuRoleId, setMenuRoleId] = useState(null);

  const dispatch = useDispatch();
  const permissions = useSelector(state =>
    service
      .getValue(state.auth, 'configs', [])
      .filter(inner => inner.grpCd === 'CDK-00017')
      .reduce((result, inner) => {
        result = service.getValue(inner, 'codes', []);
        return result;
      }, [])
  );

  const { menuRoles = [], inqRoles = [], roleList = {}, menuList = {} } = useSelector(state => service.getValue(state.fetch, 'multipleList', {}));

  useEffect(() => {
    if (handler) {
      onEvents({ method: 'submit', payload: formValues });
    }
  }, [formValues, handler, onEvents]);

  useEffect(() => {
    const fetching = grpId => {
      const obj = api.getRoleData({ inqGrpId: grpId || service.getValue(inqRoles, '0.inqGrpId', null) });
      dispatch(fetch.getMultipleList([{ id: 'roleList', url: obj.url, params: obj.params }]));
    };
    fetching(inqGrpId);
  }, [inqGrpId, dispatch, inqRoles]);

  useEffect(() => {
    const fetching = menuId => {
      const obj = api.getMenuRole({ menuRoleId: menuId || service.getValue(menuRoles, '0.menuRoleId', null) });
      dispatch(fetch.getMultipleList([{ id: 'menuList', url: obj.url, params: obj.params }]));
    };
    fetching(menuRoleId);
  }, [menuRoleId, dispatch, menuRoles]);

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

  const onSubmit = useCallback(
    (events, key) => {
      const { method, payload } = events;

      if (method === 'error') {
        return onEvents({ method: 'error' });
      }

      setFormValues(state => ({
        ...state,
        [key]: { ...payload }
      }));
      return null;
    },
    [onEvents, setFormValues]
  );

  const onChangeInq = value => {
    setInqGrpId(value);
  };

  const onChangeMenu = value => {
    setMenuRoleId(value);
  };

  useEffect(() => {
    const fetching = (userId = null) => {
      if (!userId || userId === '0') {
        return;
      }
      const obj = api.getUser(userId);
      dispatch(common.loadingStatus(true));
      Fetcher.get(obj.url, obj.params)
        .then(({ data }) => {
          setItem(data);
          return null;
        })
        .then(() => {
          dispatch(common.loadingStatus(false));
        });
    };
    fetching(id);
    return () => {
      setItem({});
    };
  }, [id, setItem, dispatch]);

  const getFields = useCallback(
    (fields = [], data = {}) => {
      const mappingFields = fields.map(field => {
        if (field.key === 'userLvlCd') {
          const defaultLevel = permissions.filter(inner => inner.cd === 'ACN005').find(inner => inner);
          return {
            ...field,
            options: permissions.map(inner => {
              return {
                key: inner.cd,
                value: inner.cd,
                label: inner.cdName
              };
            }),
            initialValue: service.getValue(data, `${field.key}`, service.getValue(defaultLevel, 'cd', null))
          };
        }

        if (field.key === 'menuRoleId') {
          return {
            ...field,
            options: menuRoles.map(inner => {
              return {
                key: inner.menuRoleId,
                value: inner.menuRoleId,
                label: inner.menuRoleName
              };
            }),
            onChange: onChangeMenu,
            initialValue: service.getValue(data, `${field.key}`, service.getValue(menuRoles, '0.menuRoleId', null)),
            extra:
              mode !== 'read' ? (
                <Button type="link" className="text" onClick={() => onOpenModal({ roll: 'menuRoleId', title: service.getValue(lang, 'LANG00135', 'no-text') })}>
                  <Icon type="zoom-in" />
                  {service.getValue(lang, 'LANG00135', 'no-text')}
                </Button>
              ) : null
          };
        }

        if (field.key === 'inqGrpId') {
          return {
            ...field,
            options: inqRoles.map(inner => {
              return {
                key: inner.inqGrpId,
                value: inner.inqGrpId,
                label: inner.inqGrpName
              };
            }),
            onChange: onChangeInq,
            initialValue: service.getValue(data, `${field.key}`, service.getValue(inqRoles, '0.inqGrpId', null)),
            extra:
              mode !== 'read' ? (
                <Button type="link" className="text" onClick={() => onOpenModal({ roll: 'inqGrpId', title: service.getValue(lang, 'LANG00136', 'no-text') })}>
                  <Icon type="zoom-in" />
                  {service.getValue(lang, 'LANG00136', 'no-text')}
                </Button>
              ) : null
          };
        }
        return field;
      });

      if (!Object.keys(data).length) {
        return mappingFields;
      }

      return mappingFields.map(field => {
        if (field.key === 'alarms') {
          return {
            ...field,
            initialValue: field.options.filter(inner => service.getValue(data, `${inner.key}`, 'N') === 'Y').map(inner => inner.value)
          };
        }
        return {
          ...field,
          initialValue: service.getValue(data, `${field.key}`, service.getValue(field, 'initialValue', null))
        };
      });
    },
    [mode, permissions, inqRoles, menuRoles, onOpenModal]
  );

  const getCheckedList = useCallback(obj => {
    if (!service.getValue(obj, 'mainDeph', []).length) {
      return [];
    }
    return service.getValue(obj, 'mainDeph', []).reduce((result, inner) => {
      const subKeys = service.getValue(inner, 'subDeph', []);
      if (subKeys.length) {
        result = [
          ...result,
          ...subKeys
            .filter(child => service.getValue(child, 'menuChk', 'N') === 'Y')
            .map(child => service.getValue(child, 'menuId', null))
            .filter(childId => !!childId)
        ];
        return result;
      }

      if (service.getValue(inner, 'menuChk', 'N') === 'Y') {
        result = [...result, inner.menuId];
      } else {
        result = [...result];
      }
      return result;
    }, []);
  }, []);

  const getExpandedKeys = useCallback(obj => {
    if (!service.getValue(obj, 'mainDeph', []).length) {
      return [];
    }
    return service
      .getValue(obj, 'mainDeph', [])
      .filter(inner => service.getValue(inner, 'subDeph.length', false))
      .map(inner => service.getValue(inner, 'menuId', null))
      .filter(mId => !!mId);
  }, []);

  const mergedFields = useMemo(() => getFields(values.pages.user.fields, userData), [userData, getFields]);
  const checkedList = useMemo(() => getCheckedList(menuList), [getCheckedList, menuList]);
  const expandedKeys = useMemo(() => getExpandedKeys(menuList), [getExpandedKeys, menuList]);

  return (
    <>
      <CommonForm fields={mergedFields} labelAlign="left" columns={2} handler={handler} onSubmit={events => onSubmit(events, 'userinfo')} formMode={mode} />
      <Modal
        forceRender
        centered
        destroyOnClose
        width={selected.roll === 'inqGrpId' ? '80%' : '30%'}
        visible={visible}
        onOk={onCloseModal}
        onCancel={onCloseModal}
        title={service.getValue(selected, 'title', '')}
        cancelButtonProps={{ style: { display: 'none' } }}
        className={selected.roll === 'inqGrpId' ? 'management-role-container' : ''}
        bodyStyle={{
          height: selected.roll === 'inqGrpId' ? 'auto' : '600px',
          overflowY: 'auto'
        }}
      >
        {selected.roll === 'inqGrpId' ? (
          <InqItem
            dataSource={[...service.getValue(roleList, 'prjSiteList', []), ...service.getValue(roleList, 'inrlSiteList', [])]}
            targetKeys={service
              .getValue(roleList, 'inrlSiteList', [])
              .map(inner => service.getValue(inner, 'siteId', null))
              .filter(inner => !!inner)}
            disabled
          />
        ) : (
          <TreeItem expandedKeys={expandedKeys} checkedKeys={checkedList} disabled dataSource={service.getValue(menuList, 'mainDeph', [])} />
        )}
      </Modal>
    </>
  );
}

export default Item;
