import { call, put, takeEvery } from 'redux-saga/effects';

import { fetch as type } from '@/store/types';
import { fetch as actions, common as commonActions } from '@/store/actions';
import { Fetcher } from '@/configs';

function* fetching(action) {
  const {
    payload: { url, params, list = [] },
    methods = 'get',
    cb = null
  } = action;
  let response;

  try {
    if (action.type === type.GET_MULTIPLE_LIST && list.length) {
      response = yield Fetcher.all(
        list.map(item => {
          return Fetcher.get(item.url, item.params).catch(error => {
            console.log('local error', error);
          });
        })
      ).then(docs => {
        return Object.keys(docs).reduce((result, key) => {
          result[list[key].id] = docs[key].data;
          return result;
        }, {});
      });
    } else {
      const { data } = yield call([Fetcher, methods], url, params);
      response = data;
    }
    yield put(actions[`${cb}`](response));
  } catch (error) {
    console.log('global error', error);
  }
}

export function* watcher() {
  yield takeEvery('*', function* status(action) {
    if (action.type.indexOf('GET') === 0) {
      yield put(commonActions.loadingStatus(true));
    }
    if (action.type.indexOf('SET') === 0) {
      yield put(commonActions.loadingStatus(false));
    }
  });
  yield takeEvery(type.GET_ITEM, obj => fetching({ ...obj, cb: 'setItem' }));
  yield takeEvery(type.GET_PAGE, obj => fetching({ ...obj, cb: 'setPage' }));
  yield takeEvery(type.GET_LIST, obj => fetching({ ...obj, cb: 'setList' }));
  yield takeEvery(type.GET_MULTIPLE_LIST, obj => fetching({ ...obj, cb: 'setMultipleList' }));
}
