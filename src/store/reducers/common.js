import { common as type } from '@/store/types';

const initialState = {
  isLoading: false,
  isLogined: false
};

const common = (state = initialState, action) => {
  switch (action.type) {
    case type.LOADING_START:
    case type.LOADING_END:
      return {
        ...state,
        isLoading: action.payload.isLoading
      };
    case type.LOGIN_LOADING_START:
    case type.LOGIN_LOADING_END:
      return {
        ...state,
        isLogined: action.payload.isLogined
      };
    default:
      return state;
  }
};

export default common;
