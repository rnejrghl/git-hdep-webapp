export const fetch = Object.freeze({
  // gettter : make request by url, params
  // get methods
  GET_ITEM: 'GET/ITEM',
  GET_PAGE: 'GET/PAGE',
  GET_LIST: 'GET/LIST',
  GET_MULTIPLE_LIST: 'GET/MULTIPLE_LIST',
  // post methods
  POST_ITEM: 'POST/ITEM',
  POST_LIST: 'POST/LIST',
  // update methods
  UPDATE: 'FETCH/UPDATE',
  // remove methods
  DELETE: 'FETCH/DELETE',

  // setter
  SET_ITEM: 'SET/ITEM',
  SET_PAGE: 'SET/PAGE',
  SET_LIST: 'SET/LIST',
  SET_MULTIPLE_LIST: 'SET/MULTIPLE_LIST',

  // reset
  RESET_ALL: 'RESET/ALL',
  RESET_ITEM: 'RESET/ITEM',
  RESET_PAGE: 'RESET/PAGE',
  RESET_LIST: 'RESET/LIST',
  RESET_MULTIPLE_LIST: 'RESET/MULTIPLE_LIST'
});

export default fetch;
