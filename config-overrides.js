const { override, addWebpackPlugin, disableChunk, addLessLoader, addBabelPlugins, removeModuleScopePlugin, addWebpackAlias, addWebpackModuleRule } = require('customize-cra');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const { resolve } = require('path');
const sassToJS = require('sass-vars-to-js');

const themeVariables = sassToJS(resolve(__dirname, 'src/styles/variables.scss'));

// refs = https://github.com/arackaf/customize-cra
module.exports = override(
  ...addBabelPlugins(['import', { libraryName: 'antd', libraryDirectory: 'lib', style: true }, 'antd'], ['import', { libraryName: 'antd-mobile', libraryDirectory: 'lib', style: false }, 'antd-mobile']),
  addLessLoader({
    javascriptEnabled: true,
    importLoaders: true,
    modifyVars: themeVariables
  }),
  addWebpackModuleRule(
    {
      test: /\.svg$/,
      use: [
        {
          loader: 'svg-sprite-loader',
          options: {
            plainSprite: true,
            publicPath: '/src/assets/',
            spriteFilename: svgPath => `sprite${svgPath.substr(-4)}`
          }
        }
      ]
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000,
            fallback: 'file-loader',
            name: 'assets/fonts/[name].[ext]'
          }
        }
      ]
    }
  ),
  disableChunk(),
  removeModuleScopePlugin(),
  addWebpackPlugin(
    new AntdDayjsWebpackPlugin({
      preset: 'antdv3',
      plugins: ['isSameOrBefore', 'isSameOrAfter', 'advancedFormat', 'customParseFormat', 'weekday', 'weekYear', 'weekOfYear', 'isMoment', 'localeData', 'localizedFormat', 'badMutable', 'utc'],
      replaceMoment: true
    })
  ),
  addWebpackAlias({
    '@': resolve(__dirname, 'src')
  })
);
