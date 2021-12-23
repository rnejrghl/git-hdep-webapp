import { common as type } from '@/store/types';

// global loading status
export function loadingStatus(status) {
  if (status) {
    return {
      type: type.LOADING_START,
      payload: {
        isLoading: true
      }
    };
  }
  return {
    type: type.LOADING_END,
    payload: {
      isLoading: false
    }
  };
}

export function loginLoadingStatus(status) {
  if (status) {
    return {
      type: type.LOGIN_LOADING_START,
      payload: {
        isLogined: true
      }
    };
  }
  return {
    type: type.LOGIN_LOADING_END,
    payload: {
      isLogined: false
    }
  };
}
