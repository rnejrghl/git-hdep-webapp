import { put, takeEvery } from 'redux-saga/effects';

import { auth as type } from '@/store/types';
import { auth as actions, common as commonActions } from '@/store/actions';
import { axios, api, service, APIHost } from '@/configs';

function* login(action) {
  const {
    payload: { user }
  } = action;
  yield put(commonActions.loginLoadingStatus(true));

  try {
    const token = service.getValue(user, 'X-AUTH-TOKEN', null);
    const obj = api.getLanguages();
    yield put(actions.setUser(user));

    const { data } = yield axios({
      url: `${APIHost}${obj.url}`,
      headers: { 'X-AUTH-TOKEN': token }
    });

    yield put(actions.setLanguages(service.getValue(data, 'data', [])));
    yield window.location.replace('/');
  } catch (error) {
    yield put(actions.setUser({}));
  }
}

export function* watcher() {
  yield takeEvery(type.LOCALE, function* status() {
    yield put(commonActions.loginLoadingStatus(false));
  });

  yield takeEvery(type.LOGOUT, function* status() {
    yield put(commonActions.loginLoadingStatus(false));
  });

  yield takeEvery(type.LOGIN, login);
}
