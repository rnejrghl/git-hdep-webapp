import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Card, Row, Col, Modal, Affix } from 'antd';

import { common } from '@/store/actions';
import { WithContentLayout } from '@/layouts';
import { ButtonWrap } from '@/components/commons';
import { service, Fetcher, locale } from '@/configs';

import { values, api } from '../configs';
import Item from './Item';
import TreeItem from './TreeItem';

const lang = service.getValue(locale, 'languages', {});

function Content(props) {
  const { data = [], onFetchEvents } = props;
  const { id, menuId, mode = 'read' } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [handler, setHandler] = useState(false);
  const { menuRoles = [] } = useSelector(state => service.getValue(state.fetch, 'multipleList', {}), shallowEqual);
  const flatList = list.reduce((result, item) => {
    result = [...result, item, ...service.getValue(item, 'subDeph', [])];
    return result;
  }, []);

  useEffect(() => {
    const merging = dataList => {
      setList(dataList);
    };

    if (data.length) {
      merging(data);
    }
    return () => {
      setList([]);
    };
  }, [data]);

  useEffect(() => {
    const filtering = dataList => {
      const checkList = dataList.reduce((result, item) => {
        const subKeys = service.getValue(item, 'subDeph', []);
        if (subKeys.length) {
          result = [
            ...result,
            ...subKeys
              .filter(child => service.getValue(child, 'useYn', 'N') === 'Y')
              .map(child => service.getValue(child, 'menuId', null))
              .filter(childId => !!childId)
          ];
          return result;
        }

        if (service.getValue(item, 'useYn', 'N') === 'Y') {
          result = [...result, item.menuId];
        } else {
          result = [...result];
        }
        return result;
      }, []);
      setCheckedList(checkList);
    };
    if (data.length) {
      filtering(data);
    }
    return () => {
      setCheckedList([]);
    };
  }, [data]);

  const onSelect = (selectedKeys, e) => {
    const selectedMenuId = selectedKeys.length ? service.getValue(selectedKeys, '0') : service.getValue(e, 'node.props.eventKey', null);
    const selectedMenu = flatList.filter(inner => inner.menuId === selectedMenuId).find(inner => inner);
    if (selectedMenuId && menuId !== selectedMenuId) {
      return history.push({
        pathname: `/management/menu/${id}/${selectedMenuId}/read`,
        state: { selected: selectedMenu }
      });
    }
    return null;
  };

  const onCheck = checkedKeys => {
    setCheckedList(checkedKeys);
  };

  const onClickButton = useCallback(
    button => {
      const selected = flatList.filter(inner => inner.menuId === menuId).find(inner => inner);
      switch (button.roll) {
        case 'remove':
          return Modal.confirm({
            title: service.getValue(lang, 'LANG00068', 'no-text'),
            content: service.getValue(lang, 'LANG00259', 'no-text'),
            okText: service.getValue(lang, 'LANG00068', 'no-text'),
            okButtonProps: {
              type: 'danger'
            },
            onOk: () => {
              const obj = api.deleteMenuRole(id);
              dispatch(common.loadingStatus(true));
              return Fetcher.post(obj.url, obj.params).then(result => {
                dispatch(common.loadingStatus(false));
                if (service.getValue(result, 'success', false)) {
                  return onFetchEvents({ method: 'reFetchList' });
                }
                return null;
              });
            }
          });
        case 'update':
          return history.push({
            pathname: `/management/menu/${id}/${menuId}/update`,
            state: { selected }
          });
        case 'cancel':
          return history.push({
            pathname: `/management/menu/${id}/${menuId}/read`,
            state: { selected }
          });
        case 'save':
          return setHandler(true);
        default:
          break;
      }
      return null;
    },
    [id, dispatch, history, menuId, onFetchEvents, flatList]
  );

  const onEvents = events => {
    const { method, payload } = events;

    if (!method) {
      return null;
    }

    if (Object.keys(payload).length) {
      setHandler(false);
      if (method === 'submit') {
        const matched = values.pages.menu.content.fields.filter(field => field.key === 'active').find(field => field);

        const params = {
          ...payload,
          menuRoleId: id,
          useYn: checkedList.includes(service.getValue(payload, 'menuId', null)) ? 'Y' : 'N',
          menuChk: checkedList.includes(service.getValue(payload, 'menuId', null)) ? 'Y' : 'N',
          ...service.getValue(matched, 'options', []).reduce((result, option) => {
            if (service.getValue(payload, 'active', []).includes(option.value)) {
              result[option.key] = 'Y';
            } else {
              result[option.key] = 'N';
            }
            return result;
          }, {})
        };

        const prevData = data
          .reduce((result, item) => {
            if (service.getValue(item, 'subDeph.length', false)) {
              let subDepth = item.subDeph;
              const menuId = service.getValue(params, 'menuId', null);
              const subUseYn = subDepth.filter(subItem => service.getValue(subItem, 'useYn', 'N') === 'Y');
              const checkSubMenu = subDepth.filter(subItem => service.getValue(subItem, 'menuId', null) === menuId);
              if (checkSubMenu.length > 0) {
                item['useYn'] = subUseYn.length > 1 || params['useYn'] === 'Y' ? 'Y' : 'N';
              } else {
                if (subUseYn.length > 0) {
                  if (menuId === service.getValue(item, 'menuId', null)) {
                    subDepth = subDepth.map(subItem => {
                      return {
                        ...subItem,
                        useYn: service.getValue(item, 'useYn', 'N')
                      };
                    });
                  } else {
                    item['useYn'] = 'Y';
                  }
                } else {
                  item['useYn'] = 'N';
                }
              }

              result = result.concat(item).concat(subDepth);
            } else {
              result = result.concat(item);
            }
            return result;
          }, [])
          .map(item => {
            return {
              ...item,
              useYn: service.getValue(item, 'useYn', 'N') === 'Y' || checkedList.includes(service.getValue(item, 'menuId', null)) ? 'Y' : 'N',
              menuChk: service.getValue(item, 'useYn', 'N') === 'Y' || checkedList.includes(service.getValue(item, 'menuId', null)) ? 'Y' : 'N'
            };
          });

        //
        const idx = prevData.findIndex(item => item.menuId === params.menuId);
        prevData[idx] = {
          ...params,
          useYn: prevData[idx].useYn
        };

        delete params['active'];

        const obj = api.updateMenuRole(id, prevData);
        dispatch(common.loadingStatus(true));
        return Fetcher.post(obj.url, obj.params).then(result => {
          dispatch(common.loadingStatus(false));
          if (service.getValue(result, 'success', false)) {
            onFetchEvents({ method: 'refetch' });
            return onClickButton({ roll: 'cancel' });
          }
        });
      }
    }
    return null;
  };

  const getTitle = useCallback(() => {
    const matched = menuRoles.filter(inner => inner.menuRoleId === id).find(inner => inner);
    return service.getValue(matched, 'menuRoleName', '');
  }, [id, menuRoles]);

  const getExpandedKeys = useCallback(allKeys => {
    return allKeys
      .filter(item => service.getValue(item, 'subDeph.length', false))
      .map(item => service.getValue(item, 'menuId', null))
      .filter(mId => !!mId);
  }, []);

  const getFooterButtons = useCallback(
    buttonObj => {
      return service.getValue(buttonObj, `${mode}`, []).map(buttonKey => {
        const matched = values.actionButtons.filter(button => button.roll === buttonKey).find(item => item);
        return {
          ...matched,
          onClick: () => onClickButton(matched),
          style: { minWidth: 80 }
        };
      });
    },
    [onClickButton, mode]
  );

  const title = useMemo(() => getTitle(), [getTitle]);
  const expandedKeys = useMemo(() => getExpandedKeys(list), [getExpandedKeys, list]);
  const footerButtons = useMemo(() => getFooterButtons(values.pages.menu.content.buttons), [getFooterButtons]);

  return (
    <Card title={title} bodyStyle={{ padding: 0 }}>
      <Row type="flex" justify="space-between" style={{ height: '100%' }}>
        <Col style={{ overflowY: 'auto', borderRight: '1px solid #dcdcdc', padding: '20px 0 20px 20px', height: 'inherit' }} span={6}>
          <TreeItem expandedKeys={expandedKeys} checkedKeys={checkedList} onSelect={onSelect} onCheck={onCheck} selectedKeys={[menuId]} dataSource={list} />
        </Col>
        <Col span={18} style={{ padding: '20px 20px 0 20px', height: '100%' }}>
          <div style={{ height: 'calc(100% - 70px)' }}>
            <Item handler={handler} onEvents={onEvents} />
          </div>

          {menuId ? (
            <Affix offsetBottom={0} style={{ position: 'absolute', bottom: 20, left: 20, right: 20, width: 'calc(100% - 40px)' }}>
              <ButtonWrap right={footerButtons} />
            </Affix>
          ) : null}
        </Col>
      </Row>
    </Card>
  );
}

export default WithContentLayout(Content);
