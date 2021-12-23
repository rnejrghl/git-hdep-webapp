import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { locale } from '@/configs';

// import global style
import '@/styles/root.scss';

import * as serviceWorker from '@/serviceWorker';

// default Route
import { AuthRoute } from '@/router';
import { Login } from '@/pages';
import { IdPwLookupContainer } from '@/pages/lookup';

// store
import store from '@/store/sagas';

import App from './App';
// theme 설정 : scss variable로 작성한 scss파일을 antd 초기화에 사용하고 styled-components의 theme로 사용
// 각 styled component에서는 prop.theme로 scss varialble을 접근할 수 있다.
// eslint-disable-next-line import/no-webpack-loader-syntax
const theme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!./styles/variables.scss');
// Provider 정의
// ConfigProvider = https://ant.design/components/config-provider/

// 1. web & mobile PWA
// 2. 권한별 route
// 3. workflow
// 4. 7개국어 지원 & 언어코드 관리 / 적용
// 5. map, cluster

const Root = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={locale.ant}>
        <ThemeProvider theme={theme}>
          <Router>
            {/* isLogin check */}
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/lookup" component={IdPwLookupContainer} />
              <AuthRoute path="*">
                <App />
              </AuthRoute>
            </Switch>
          </Router>
        </ThemeProvider>
      </ConfigProvider>
    </Provider>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
