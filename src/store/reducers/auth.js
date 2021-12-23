import { auth as type } from '@/store/types';
import { service } from '@/configs';

const initialState = {
  user: {},
  configs: [],
  language: window.navigator.language,
  languages: [],
  menus: []
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case type.USER:
      localStorage.setItem('token', service.getValue(action.payload, 'X-AUTH-TOKEN', null));
      return {
        ...state,
        configs: service.getValue(action.payload, 'CMN-CODES', []),
        user: service.getValue(action.payload, 'USER', {}),
        menus: service.getValue(action.payload, 'AUTH-MENU.mainDeph', [])
      };
    case type.LOCALE:
      return {
        ...state,
        languages: service.getValue(action, 'payload', [])
      };
    case type.LOGOUT:
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
      localStorage.setItem('token', null);
      return initialState;
    case type.LANGUAGE:
      if (state.language === action.payload) {
        return state;
      }
      window.location.reload();
      return {
        ...state,
        language: action.payload
      };
    default:
      return state;
  }
};

export default auth;
