import React, { Suspense } from 'react';
import { createGlobalStyle } from 'styled-components';
import { Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Spinner } from '@/components/commons';
import { routes, SubRoutes } from '@/router';
import { service, locale } from '@/configs';

import lightFont from '@/assets/fonts/NotoSansKR-Light.otf';
import lightFontJp from '@/assets/fonts/NotoSansJP-Light.otf';

import regularFont from '@/assets/fonts/Lato/Lato-Regular.ttf';
import regularFontJp from '@/assets/fonts/NotoSansJP-Regular.otf';

import boldFont from '@/assets/fonts/Lato/Lato-Bold.ttf';
import boldFontJp from '@/assets/fonts/NotoSansJP-Bold.otf';

import Hanwha_R_TTF from '@/assets/fonts/Hanwha_R.ttf';

const lightSrc = service.getValue(locale, 'language', 'en-US') === 'ja-JP' ? lightFontJp : lightFont;
const regularSrc = service.getValue(locale, 'language', 'en-US') === 'ja-JP' ? regularFontJp : regularFont;
const boldSrc = service.getValue(locale, 'language', 'en-US') === 'ja-JP' ? boldFontJp : boldFont;

// global styled component for font setting
const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: FontLight;
    src: url(${Hanwha_R_TTF}) format('truetype');
    font-weight: normal;
    font-style: normal;    
  }
  @font-face {
    font-family: FontRegular;
    src: url(${Hanwha_R_TTF}) format('truetype');
    font-weight: normal;
    font-style: normal;    
  }
  @font-face {
    font-family: FontBold;
    src: url(${Hanwha_R_TTF}) format('truetype');
    font-weight: normal;
    font-style: normal;      
  }
`;

// AuthRoute를 통과한 route를 정의한다. 1차
function App() {
  // 각 페이지별 route를 정의한다. 1차
  // 하위 route는 각 Container에서 구현
  const { isLoading } = useSelector(state => service.getValue(state, 'common'));

  return (
    <Suspense fallback={isLoading ? <span>&nbsp;</span> : <Spinner tip="Loading" size="large" delay={100} />}>
      <GlobalStyles />
      <Switch>
        {routes
          .filter(route => route.component)
          .map(route => {
            return <SubRoutes key={route.menuId || route.path} {...route} />;
          })}
      </Switch>
    </Suspense>
  );
}

export default App;
