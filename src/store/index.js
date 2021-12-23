import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import persistState from 'redux-localstorage';

import * as reducers from './reducers';

export default function createAppStore() {
  // connecting redux & redux-middleware
  const middlewares = [];
  const sagaMiddleware = createSagaMiddleware();
  const exeptions = ['GET'];

  if (process.env.NODE_ENV === `development`) {
    const { createLogger } = require(`redux-logger`);
    const logger = createLogger({
      predicate: (getState, action) => {
        const split = action.type.split('/');
        return !split.some(item => exeptions.includes(item));
      }
    });
    middlewares.push(logger);
  }
  middlewares.push(sagaMiddleware);

  const enhancer = compose(applyMiddleware(...middlewares), persistState());

  return {
    ...createStore(combineReducers({ ...reducers, dddisLoading: false }), enhancer),
    runSaga: sagaMiddleware.run
  };
}
