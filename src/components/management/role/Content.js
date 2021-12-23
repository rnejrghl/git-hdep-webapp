import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Modal } from 'antd';

import { common } from '@/store/actions';
import { WithContentLayout } from '@/layouts';
import { ButtonWrap } from '@/components/commons';
import { service, Fetcher, locale } from '@/configs';

import { values, api } from '../configs';
import Item from './Item';

const lang = service.getValue(locale, 'languages', {});

function Content(props) {
  const { data = {}, onFetchEvents } = props;
  const { id, mode = 'read' } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const { prjSiteList = [], inrlSiteList = [] } = data;
  const [state, setState] = useState({
    dataSource: [],
    targetKeys: []
  });

  const { roleList = [] } = useSelector(store => service.getValue(store.fetch, 'multipleList', {}));

  useEffect(() => {
    const settings = () => {
      setState(() => {
        const targetKeys = inrlSiteList.map(inner => service.getValue(inner, 'siteId', null)).filter(inner => !!inner);
        return {
          dataSource: [...prjSiteList, ...inrlSiteList],
          targetKeys
        };
      });
    };
    settings();
    return () => {};
  }, [setState, prjSiteList, inrlSiteList]);

  const onSave = useCallback(() => {
    const params = service.getValue(state, 'targetKeys', []).map(key => {
      return {
        inqGrpId: id,
        siteId: key
      };
    });
    const obj = api.updateRoleSiteList(params);
    dispatch(common.loadingStatus(true));
    return Fetcher.post(obj.url, obj.params).then(result => {
      dispatch(common.loadingStatus(false));
      if (service.getValue(result, 'success', false)) {
        onFetchEvents({ method: 'refetch' });
        return history.push(`/management/role/${id}/read`);
      }
    });
  }, [history, dispatch, id, onFetchEvents, state]);

  const onClickButton = useCallback(
    button => {
      switch (button.roll) {
        case 'remove':
          return Modal.confirm({
            title: service.getValue(lang, 'LANG00068', 'no-text'),
            content: service.getValue(lang, 'LANG00259', 'no-text'),
            okText: service.getValue(lang, 'LANG00068', 'no-text'),
            okButtonProps: {
              type: 'danger'
            },
            cancelButtonProps: {
              style: { width: 80 }
            },
            onOk: () => {
              const obj = api.deleteInqRole(id);
              dispatch(common.loadingStatus(true));
              return Fetcher.post(obj.url, obj.params).then(result => {
                dispatch(common.loadingStatus(false));
                if (service.getValue(result, 'success', false)) {
                  onFetchEvents({ method: 'reFetchList' });
                  return history.push(`/management/role`);
                }
                return Modal.error({
                  title: service.getValue(lang, 'LANG00296', 'no-text'),
                  content: service.getValue(result, 'msg', '')
                });
              });
            }
          });
        case 'update':
          return history.push(`/management/role/${id}/update`);
        case 'cancel':
          return history.push(`/management/role/${id}/read`);
        case 'save':
          return onSave();
        default:
          break;
      }
      return null;
    },
    [history, id, onSave, dispatch, onFetchEvents]
  );

  const getTitle = useCallback(() => {
    const matched = roleList.length && roleList.filter(inner => inner.inqGrpId === id).find(inner => inner);
    return service.getValue(matched, 'inqGrpName', '');
  }, [id, roleList]);

  const getExtraButtons = useCallback(
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

  const handleChange = nextTargetKeys => {
    setState(localState => {
      return {
        ...localState,
        targetKeys: nextTargetKeys
      };
    });
  };

  const title = useMemo(() => getTitle(), [getTitle]);
  const extraButtons = useMemo(() => getExtraButtons(values.pages.role.content.buttons), [getExtraButtons]);

  return (
    <Card title={title} extra={<ButtonWrap right={extraButtons} />} bodyStyle={{ padding: 0 }}>
      <Item dataSource={state.dataSource} targetKeys={state.targetKeys} showSearch onChange={handleChange} disabled={mode === 'read'} />
    </Card>
  );
}

export default WithContentLayout(Content);
