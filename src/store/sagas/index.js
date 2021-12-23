import { all, call } from 'redux-saga/effects';
import { watcher as fetchWatcher } from './fetch';
import { watcher as authWatcher } from './auth';

// store
import createAppStore from '@/store';

function* rootSaga() {
  yield all({
    fetchWatcher: call(fetchWatcher),
    authWatcher: call(authWatcher)
  });
}

const store = createAppStore();
store.runSaga(rootSaga);

export default store;
