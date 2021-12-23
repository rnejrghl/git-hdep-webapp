import { fetch as type } from '@/store/types';

// getter : api요청을 위한 url과 param을 만들어 saga로 전달
export function getItem(url, params = {}) {
  return {
    type: type.GET_ITEM,
    payload: {
      url,
      params
    }
  };
}

export function getPage(url, params = {}) {
  return {
    type: type.GET_PAGE,
    payload: {
      url,
      params
    }
  };
}

export function getList(url, params = {}) {
  return {
    type: type.GET_LIST,
    payload: {
      url,
      params
    }
  };
}

export function getMultipleList(list = []) {
  return {
    type: type.GET_MULTIPLE_LIST,
    payload: {
      list
    }
  };
}

// setter saga에서 받은 response를 reducer로 전달
export function setItem(payload) {
  return {
    type: type.SET_ITEM,
    payload
  };
}

export function setPage(payload) {
  return {
    type: type.SET_PAGE,
    payload
  };
}

export function setList(payload) {
  return {
    type: type.SET_LIST,
    payload
  };
}

export function setMultipleList(payload) {
  return {
    type: type.SET_MULTIPLE_LIST,
    payload
  };
}

export function resetPage() {
  return {
    type: type.RESET_PAGE,
    payload: {}
  };
}

export function resetItem() {
  return {
    type: type.RESET_ITEM,
    payload: {}
  };
}

export function resetList() {
  return {
    type: type.RESET_LIST,
    payload: {}
  };
}

export function resetMultipleList() {
  return {
    type: type.RESET_MULTIPLE_LIST,
    payload: {}
  };
}

export function resetAll() {
  return {
    type: type.RESET_ALL,
    payload: {}
  };
}
