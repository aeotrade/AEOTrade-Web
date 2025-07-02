'use strict';
const path = require('path');
const packageName = require('./package.json').name;

function resolve(dir) {
  return path.join(__dirname, dir);
}
const autoprefixer = require('autoprefixer');
const name = '慧贸贸'; // page title
const port = 7015; // dev port

module.exports = {
  publicPath:process.env.NODE_ENV === 'development'?'':'/microapp/openPlatform',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    proxy:{
      '/open-platform':{
        target:'https://cnn-sys-test.aeotrade.com',
        changeOrigin: true
      },
      '/master-data-models':{
        target:'https://cnn-sys-test.aeotrade.com',
        changeOrigin: true
      },
      '/org-connectors-account-config-item':{
        target:'https://cnn-sys-test.aeotrade.com',
        changeOrigin: true
      },
      '/aeoapi': {
        target: `https://apitrain.aeotrade.com/`,
        changeOrigin: true,
        pathRewrite: { '^/aeoapi': '/aeoapi' }
      }

    },
    overlay: {
      warnings: false,
      errors: true
    },
    historyApiFallback:{
      index:'/index.html'
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },

  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        '$':resolve('static')
      }
    },
    externals: {

    },
    output: {
      //把子应用打包成 umd 库格式
      library: `${packageName}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${packageName}`
    }

  },
  chainWebpack(config) {
    config.plugins.delete('preload'); // TODO: neeprocess.env.WEBPACK_ENVd test
    config.plugins.delete('prefetch'); // TODO: need test
    /*解决打包后第三方字体无法找到资源*/
    config.module
      .rule('fonts')
      .test(/\.(ttf|otf|eot|woff|woff2)$/)
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options = {
          // limit: 10000,
          name: '/static/fonts/[name].[ext]'
        };
        return options;
      })
      .end();
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      );

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end();
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial'
                },
                elementUI: {
                  name: 'chunk-elementUI',
                  priority: 20,
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'),
                  minChunks: 3,
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            });
          config.optimization.runtimeChunk('single');
        }
      );
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('autoprefixer')({
            overrideBrowserslist: ['last 20 versions']
          })
        ]
      }
    }
  }
};
