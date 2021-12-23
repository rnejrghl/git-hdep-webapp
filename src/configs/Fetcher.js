import axios from 'axios';
import { service } from '@/configs';
import { apiConfigs } from '../../package.json';

// access token
const getCSRFToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { 'X-AUTH-TOKEN': token };
  }
  return { 'X-AUTH-TOKEN': 'none' };
};

const APIHost = (() => apiConfigs[process.env.REACT_APP_ENV || 'development'].endPoint)();

axios.defaults.xsrfHeaderName = 'X-AUTH-TOKEN';
axios.defaults.headers.common['Content-Type'] = 'application/json; charset=UTF-8';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.timeout = 6 * 4 * 1000;

const getMakeURL = url => {
  const prefix = url.indexOf('http') === 0 ? '' : APIHost;
  const postfix = url.substr(0, 1) === '/' ? '' : '/';
  return `${prefix}${url}${postfix}`;
};

const jsonToParams = (obj = {}) => {
  return Object.keys(obj).reduce((str, key) => {
    str += `${(str === '' ? '' : '&') + key}=${obj[key]}`;
    return str;
  }, '');
};

class Fetcher {
  static login(url, params = {}) {
    const fullUrl = getMakeURL(url);
    const str = jsonToParams(params);
    return axios.post(fullUrl + (str === '' ? '' : '?') + str, { headers: { ...axios.defaults.headers.common, ...getCSRFToken() } }).then(docs => service.getValue(docs, 'data', null));
  }

  static post(url, params = {}, options = {}) {
    const fullUrl = getMakeURL(url);
    return axios.post(fullUrl, params, { headers: { ...axios.defaults.headers.common, ...getCSRFToken() }, ...options }).then(docs => service.getValue(docs, 'data', null));
  }

  static postWithResponse(url, params = {}, options = {}) {
    const fullUrl = getMakeURL(url);
    return axios.post(fullUrl, params, { headers: { ...axios.defaults.headers.common, ...getCSRFToken() }, ...options });
  }

  static postQuery(url, params = {}, options = {}) {
    const fullUrl = getMakeURL(url);
    const str = jsonToParams(params);
    return axios.post(fullUrl + (str === '' ? '' : '?') + str, { headers: { ...axios.defaults.headers.common, ...getCSRFToken() }, ...options }).then(docs => service.getValue(docs, 'data', null));
  }

  static get(url, params = null) {
    const fullUrl = getMakeURL(url);
    const str = jsonToParams(params);
    return axios.get(fullUrl + (str === '' ? '' : '?') + str, { headers: { ...axios.defaults.headers.common, ...getCSRFToken() } }).then(docs => service.getValue(docs, 'data', null));
  }

  static all(list) {
    return axios.all(list).then(
      axios.spread((...response) => {
        return { ...response };
      })
    );
  }

  static excelUpload(url, params, file) {
    const formData = new FormData();
    formData.append('file', file);
    const str = jsonToParams(params);
    const fullUrl = getMakeURL(url);

    return axios({
      method: 'post',
      url: fullUrl + (str === '' ? '' : '?') + str,
      headers: {
        ...axios.defaults.headers.common,
        ...getCSRFToken(),
        'content-type': 'multipart/form-data'
      },
      data: formData
    }).then(docs => service.getValue(docs, 'data', null));
  }
}

// with antd upload
const upload = {
  getProps: fileList => ({
    name: 'file',
    action: `${APIHost}/common/upload`,
    headers: getCSRFToken(),
    defaultFileList: [...fileList],
    data: {
      file: fileList
    }
  }),
  postExcel: (file, data) => ({
    name: 'file',
    action: `${APIHost}/pp/goal`,
    headers: getCSRFToken(),
    defaultFileList: [...file],
    data
  })
};

// global error handler
axios.interceptors.response.use(
  res => res,
  err => {
    console.log('global error', err);
    if (err.response.status === 401) {
      return window.location.replace('/login');
    }
  }
);

export { Fetcher, APIHost, axios, upload };
