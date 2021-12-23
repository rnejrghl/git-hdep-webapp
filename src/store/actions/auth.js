import { auth as type } from '@/store/types';

export function login({ user, history }) {
  return {
    type: type.LOGIN,
    payload: {
      user,
      history
    }
  };
}

export function logout() {
  return {
    type: type.LOGOUT
  };
}

export function setUser(payload) {
  return {
    type: type.USER,
    payload
  };
}

export function setLanguage(payload) {
  return {
    type: type.LANGUAGE,
    payload
  };
}

export function setLanguages(payload) {
  return {
    type: type.LOCALE,
    payload
  };
}
