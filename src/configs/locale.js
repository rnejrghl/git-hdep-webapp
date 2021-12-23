import moment from 'moment';
import koKR from 'antd/es/locale/ko_KR';
import enUS from 'antd/es/locale/en_US';
import jaJP from 'antd/es/locale/ja_JP';
import esES from 'antd/es/locale/es_ES';
import viVN from 'antd/es/locale/vi_VN';
import deDE from 'antd/es/locale/de_DE';

import store from '@/store/sagas';
import service from './service';

import ImgKo from '@/assets/languages/ko.png';
import ImgEn from '@/assets/languages/en.png';
import ImgJa from '@/assets/languages/ja.png';
import ImgEs from '@/assets/languages/es.png';
import ImgVi from '@/assets/languages/vi.png';
import ImgDe from '@/assets/languages/de.png';

const state = store.getState();
const auth = service.getValue(state, 'auth', {});
const { language = 'en-US', languages = [] } = auth;

const languageList = [
  {
    key: 'ko',
    ant: koKR,
    code: 'LANG00222',
    dataIndex: 'ko-KR',
    app: 'nameKo',
    icon: ImgKo
  },
  {
    key: 'en',
    ant: enUS,
    code: 'LANG00223',
    dataIndex: 'en-US',
    app: 'nameEn',
    icon: ImgEn
  },
  {
    key: 'ja',
    ant: jaJP,
    code: 'LANG00224',
    dataIndex: 'ja-JP',
    app: 'nameJa',
    icon: ImgJa
  },
  {
    key: 'es',
    ant: esES,
    code: 'LANG00225',
    dataIndex: 'es-ES',
    app: 'nameEs',
    icon: ImgEs
  },
  {
    key: 'vi',
    ant: viVN,
    code: 'LANG00226',
    dataIndex: 'vi-VN',
    app: 'nameVi',
    icon: ImgVi
  },
  {
    key: 'de',
    ant: deDE,
    app: 'nameDe',
    dataIndex: 'de-DE',
    icon: ImgDe,
    code: 'LANG00227'
  }
];

const matched = languageList.filter(item => item.key === language.split('-')[0]).find(item => item);

// moment locale
// refs = https://momentjs.com/docs/#/i18n/changing-locale/
const momentConfig = require(`moment/locale/${matched ? matched.key : 'en'}.js`);
moment.locale(language, momentConfig);

const locale = {
  // ant locale
  // refs = https://3x.ant.design/components/config-provider/
  language,
  ant: service.getValue(matched, 'ant', enUS),
  languages: languages.reduce((result, lang) => {
    const key = service.getValue(matched, 'app', 'nameEn');
    result[lang.menuId] = service.getValue(lang, `${key}`, null);
    return result;
  }, {})
};

export { languageList };

export default locale;
