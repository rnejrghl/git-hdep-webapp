import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Tabs } from 'antd';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';

import { fetch, common } from '@/store/actions';
import { ButtonWrap } from '@/components/commons';
import { api, values, service, Fetcher, locale } from '@/configs';
import { api as manageApi } from '@/components/management/configs';

import '@/styles/app/components/commons/site/Register.scss';

import TabComponent from './TabComponent';

const lang = service.getValue(locale, 'languages', {});
const { TabPane } = Tabs;

function Register(props) {
  const {
    item: { siteId = null },
    footer,
    onEvents
  } = props;
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState('contract');
  const [handler, setHandler] = useState(false);
  const data = useSelector(state => service.getValue(state.fetch, `multipleList.${activeKey}`, {}), shallowEqual);
  const contractData = useSelector(state => service.getValue(state.fetch, `multipleList.contract`, {}), shallowEqual);
  const gridData = useSelector(state => service.getValue(state.fetch, `multipleList.grid`, {}), shallowEqual);
  const approveData = useSelector(state => service.getValue(state.fetch, `multipleList.approve`, {}), shallowEqual);
  const inspectData = useSelector(state => service.getValue(state.fetch, `multipleList.inspection`, {}), shallowEqual);
  const { user = {} } = useSelector(state => service.getValue(state, 'auth', {}), shallowEqual);
  const isInitialKey = values.initialKeys.filter(inner => inner.dataIndex === activeKey).find(inner => inner);
  const isInitial = service.getValue(data, `${service.getValue(isInitialKey, 'key', null)}`, false);
  useEffect(() => {
    const fetching = () => {
      const obj = api.getRegister(activeKey, siteId ? { siteId } : null);

      const userObj = manageApi.getUsers();
      let fetchObj = [];
      if (siteId) {
        const gridObj = api.getRegister('grid', siteId ? { siteId } : null);
        const contractObj = api.getRegister('contract', siteId ? { siteId } : null);
        const approveObj = api.getRegister('approve', siteId ? { siteId } : null);
        const inspectObj = api.getRegister('inspection', siteId ? { siteId } : null);
        fetchObj = [
          { id: 'contract', ...contractObj },
          { id: 'grid', ...gridObj },
          { id: 'approve', ...approveObj },
          { id: 'inspection', ...inspectObj }
        ];
      }
      dispatch(fetch.getMultipleList([{ id: activeKey, ...obj }, { id: 'userList', ...userObj }, ...fetchObj]));
    };
    fetching();
    return () => {};
  }, [siteId, activeKey, dispatch]);

  const onChange = useCallback(
    key => {
      setActiveKey(key);
    },
    [setActiveKey]
  );

  const getData = useCallback((obj = {}) => {
    if (Array.isArray(obj)) {
      return service.getValue(obj, '0', {});
    }
    return obj;
  }, []);

  const getDisabled = key => {
    return !siteId && key !== 'contract';
  };

  const onSubmitOk = params => {
    const newParams = { ...params };
    let requestObj = {};

    switch (activeKey) {
      case 'contract':
        newParams['fileIdCd1'] = service.getValue(newParams, 'fileIdCd1.length', false) ? service.getValue(newParams, 'fileIdCd1', []).map(inner => inner.fileId) : null;
        newParams['fileIdCd2'] = service.getValue(newParams, 'fileIdCd2.length', false) ? service.getValue(newParams, 'fileIdCd2', []).map(inner => inner.fileId) : null;

        if (newParams.userSeq === 'new') {
          newParams['newUserYn'] = 'Y';
          delete newParams['userSeq'];
        }

        if (siteId) {
          requestObj = api.updateContract(newParams);
        } else {
          requestObj = api.createContract(newParams);
        }
        break;
      case 'approve':
        newParams['siteId'] = siteId;
        requestObj = api.updateApprove(newParams);
        break;
      case 'grid':
        newParams['siteId'] = siteId;
        newParams['fileIdCd3'] = service.getValue(newParams, 'fileIdCd3.length', false) ? service.getValue(newParams, 'fileIdCd3', []).map(inner => inner.fileId) : null;
        newParams['fileIdCd4'] = service.getValue(newParams, 'fileIdCd4.length', false) ? service.getValue(newParams, 'fileIdCd4', []).map(inner => inner.fileId) : null;
        newParams['fileIdCd5'] = service.getValue(newParams, 'fileIdCd5.length', false) ? service.getValue(newParams, 'fileIdCd5', []).map(inner => inner.fileId) : null;
        newParams['fileIdCd6'] = service.getValue(newParams, 'fileIdCd6.length', false) ? service.getValue(newParams, 'fileIdCd6', []).map(inner => inner.fileId) : null;

        // 파일 upload시 해당 userName을 이메일로 보내려고 contractData 에서 뺴옴
        newParams['userName'] = service.getValue(contractData, 'mainData.userName', {});

        requestObj = api.updateGrid(newParams);
        break;
      case 'inspection':
        newParams['siteId'] = siteId;
        newParams['fileIdCd7'] = service.getValue(newParams, 'fileIdCd7.length', false) ? service.getValue(newParams, 'fileIdCd7', []).map(inner => inner.fileId) : null;
        newParams['chkFailRsn'] = service.getValue(newParams, 'chkFailRsn', '');
        newParams['inspNote'] = service.getValue(newParams, 'inspNote', '');
        newParams['mngNote'] = service.getValue(newParams, 'mngNote', '');
        newParams['psId'] = service.getValue(newParams, 'psId', '');
        // 파일 upload시 해당 userName을 이메일로 보내려고 contractData 에서 뺴옴
        newParams['userName'] = service.getValue(contractData, 'mainData.userName', {});

        if (newParams['insFiles']) {
          delete newParams['insFiles'];
        }
        delete newParams['invoiceUserData'];

        requestObj = api.updateInspection(newParams);
        break;
      case 'finish':
        params['siteId'] = siteId;
        requestObj = api.updateTerm(params);
        break;
      default:
        break;
    }

    dispatch(common.loadingStatus(true));
    return Fetcher.post(requestObj.url, requestObj.params).then(result => {
      dispatch(common.loadingStatus(false));
      if (service.getValue(result, 'success', false)) {
        return onEvents({ method: 'refetch' });
      }
    });
  };

  const onSubmit = events => {
    const { payload } = events;
    const target = service.getValue(payload, `${activeKey}`, {});
    const params = Object.keys(target).reduce((result, key) => {
      if (typeof target[key] === 'object') {
        result = {
          ...result,
          ...Object.keys(target[key]).reduce((innerResult, innerKey) => {
            innerResult[innerKey] = service.getValue(target, `${key}.${innerKey}`, null);
            return innerResult;
          }, {})
        };
        return result;
      }
      result[key] = target[key];
      return result;
    }, {});

    const changedInitial = service.getValue(params, `${service.getValue(isInitialKey, 'mapper', null)}`, false);

    switch (activeKey) {
      case 'contract':
        return !isInitial && !!changedInitial
          ? Modal.confirm({
              title: service.getValue(lang, 'LANG00317', 'no-text'),
              content: service.getValue(lang, 'LANG00313', 'no-text'),
              icon: null,
              okText: service.getValue(lang, 'LANG00089', 'no-text'),
              onOk: () => onSubmitOk(params)
            })
          : onSubmitOk(params);
      case 'approve':
        if (service.getValue(contractData, 'mainData.wkplCmplDt', '') === '') {
          return Modal.error({
            title: service.getValue(lang, 'LANG00296', 'no-text'),
            content: service.getValue(lang, 'LANG00327', 'no-text')
          });
        } else {
          return !isInitial && !!changedInitial
            ? Modal.confirm({
                title: service.getValue(lang, 'LANG00318', 'no-text'),
                content: service.getValue(lang, 'LANG00319', 'no-text'),
                icon: null,
                okText: service.getValue(lang, 'LANG00089', 'no-text'),
                onOk: () => onSubmitOk(params)
              })
            : onSubmitOk(params);
        }
      case 'grid':
        const checkApprove = service.getValue(approveData, '0', {});
        if (service.getValue(checkApprove, 'expnDt', '') === '') {
          return Modal.error({
            title: service.getValue(lang, 'LANG00296', 'no-text'),
            content: service.getValue(lang, 'LANG00326', 'no-text')
          });
        } else {
          return !isInitial && !!changedInitial
            ? Modal.confirm({
                title: service.getValue(lang, 'LANG00320', 'no-text'),
                content: service.getValue(lang, 'LANG00321', 'no-text'),
                icon: null,
                okText: service.getValue(lang, 'LANG00089', 'no-text'),
                onOk: () => onSubmitOk(params)
              })
            : onSubmitOk(params);
        }
      case 'inspection':
        const checkGrid = service
          .getValue(gridData, 'mainData', {})
          .filter(data => data.siteId === siteId)
          .find(data => data);

        if (service.getValue(checkGrid, 'insWorkCmdt', '') === '') {
          return Modal.error({
            title: service.getValue(lang, 'LANG00296', 'no-text'),
            content: service.getValue(lang, 'LANG00328', 'no-text')
          });
        } else {
          const chkPass = service.getValue(params, 'chkPassYn', 'no-text') === 'Y';
          return !isInitial && !!changedInitial
            ? Modal.confirm({
                title: chkPass ? service.getValue(lang, 'LANG00322', 'no-text') : service.getValue(lang, 'LANG00323', 'no-text'),
                content: chkPass ? service.getValue(lang, 'LANG00324', 'no-text') : service.getValue(lang, 'LANG00325', 'no-text'),
                icon: null,
                okText: service.getValue(lang, 'LANG00089', 'no-text'),
                onOk: () => onSubmitOk(params)
              })
            : onSubmitOk(params);
        }
      case 'finish':
        const checkinsp = service
          .getValue(inspectData, 'mainData', {})
          .filter(data => data.siteId === siteId)
          .find(data => data);
        if (service.getValue(checkinsp, 'chkCmplDt', '') === '') {
          return Modal.error({
            title: service.getValue(lang, 'LANG00296', 'no-text'),
            content: service.getValue(lang, 'LANG00329', 'no-text')
          });
        } else {
          return onSubmitOk(params);
        }
      default:
        return null;
    }
  };

  const onEventsCurrent = events => {
    const { method, payload } = events;

    if (!method) {
      return null;
    }

    if (method === 'error') {
      setHandler(false);
      return null;
    }

    if (service.getValue(payload, `${activeKey}`, false)) {
      if (method === 'submit') {
        setHandler(false);
        return onSubmit(events);
      }
    }
    return null;
  };

  const onRemove = useCallback(() => {
    switch (activeKey) {
      case 'contract':
        if (siteId) {
          const obj = api.deleteContract(siteId);
          dispatch(common.loadingStatus(true));
          return Fetcher.post(obj.url, obj.params).then(({ success }) => {
            dispatch(common.loadingStatus(false));
            if (success) {
              onEvents({ method: 'refetch' });
            }
          });
        }
        return Modal.error({
          title: service.getValue(lang, 'LANG00296', 'no-text'),
          content: '계약정보가 없습니다.'
        });
      default:
        return null;
    }
  }, [onEvents, activeKey, siteId, dispatch]);

  const onClickFooter = useCallback(
    button => {
      switch (button.roll) {
        case 'cancel':
          return onEvents({ method: 'cancel' });
        case 'save':
          return setHandler(true);
        case 'remove':
          return Modal.confirm({
            title: service.getValue(lang, 'LANG00068', 'no-text'),
            content: service.getValue(lang, 'LANG00259', 'no-text'),
            onOk: () => onRemove()
          });
        default:
          return null;
      }
    },
    [setHandler, onRemove, onEvents]
  );

  const getButtons = useCallback(
    (obj = {}) => {
      return {
        footer: {
          ...Object.keys(obj).reduce((result, key) => {
            if (Array.isArray(obj[key])) {
              result[key] = values.actionButtons
                .filter(button => obj[key].includes(button.roll))
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

  const getTabs = useCallback(() => {
    const isInstaller = service.getValue(user, 'userLvlCd', null) === 'ACN003';
    return props.tabs.length
      ? props.tabs
          .sort((a, b) => a.sort - b.sort)
          .map(tab => {
            return values.siteRegister.tabs.filter(item => item.key === tab.key).find(item => item);
          })
      : isInstaller
      ? values.siteRegister.tabs.filter(item => item.key === 'contract' || item.key === 'grid')
      : values.siteRegister.tabs;
  }, [props.tabs, user]);

  const flatData = useMemo(() => getData(data), [getData, data]);
  const buttons = useMemo(() => getButtons(footer), [getButtons, footer]);
  const tabs = useMemo(() => getTabs(), [getTabs]);

  return (
    <>
      <Tabs animated={false} onChange={onChange} tabBarStyle={{ margin: '0', padding: '7px 20px 0 20px' }} className="register-tab">
        {tabs.map(tab => {
          return (
            <TabPane key={tab.key} tab={tab.label} disabled={getDisabled(tab.key)}>
              {tab.key === activeKey ? <TabComponent current={tab.key} handler={handler} onEvents={onEventsCurrent} data={flatData} isNew={!siteId} /> : null}
            </TabPane>
          );
        })}
      </Tabs>
      <ButtonWrap right={service.getValue(buttons, 'footer.right', [])} left={service.getValue(buttons, 'footer.left', [])} style={{ padding: 20, backgroundColor: '#F3F3F3', borderRadius: '0 0 4px 4px' }} />
    </>
  );
}

Register.propTypes = {
  tabs: PropTypes.arrayOf(() => {
    return {
      key: PropTypes.string,
      label: PropTypes.string,
      component: PropTypes.element
    };
  })
};

Register.defaultProps = {
  tabs: []
};

export default Register;
