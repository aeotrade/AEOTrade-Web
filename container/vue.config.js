const name = '慧贸贸';
const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}
const PORT=7000;
const externalsConfig = {
}
module.exports = {

  publicPath: process.env.NODE_ENV === 'production' ? '/microapp' : '/',
  outputDir: 'dist',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  configureWebpack: {
    name: name,
    title:name,
    resolve: {
      alias: {
        '@': resolve('src'),
        '$':resolve('static')
      }
    },
    externals: process.env.NODE_ENV === 'production' ? externalsConfig : {},


  },
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: PORT,
    https: false,
    open: true,
      disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy:{
      '/aeoapi': {
        target: `xxx`,
        changeOrigin: true,
        pathRewrite: { '^/aeoapi': '/aeoapi' }
      },
      '/bi_report':{
        target:'http://192.168.0.146:8000',
        changeOrigin: true
      },
      '/glb':{
        changeOrigin: true,
        target:'http://192.168.1.133:33264',
        pathRewrite: {
          '/glb' : ''
        }
      },
      '/bi-api':{
        target:'xxx',
        changeOrigin: true,
        pathRewrite: {
          '/bi-api' : ''
        }
      }
    }
  },
  configureWebpack: config => {


  }
}

