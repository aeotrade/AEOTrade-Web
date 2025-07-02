import vsharp from 'vite-plugin-vsharp';
const CompressionWebpackPlugin = require('compression-webpack-plugin')
import { loadEnv } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path , { resolve } from 'path'
const envScript = process.env.npm_lifecycle_script.split(' ')
const envName = envScript[envScript.length - 1] // 通过启动命令区分环境
const envData = loadEnv(envName, 'env')
import os from 'os';

import theme from './assets/themeconfig'




//部署的时候注入一个本地域名映射，backend


console.log('backend')

/*
*  nxut3 配置文件 项目说明 样式等功能配置文件在 './assets/themeconfig'
*  环境变量文件在 env 目录下
*  需要在package.json 配置相关系统的不同环境 打包命令
*  在page目录下 建立一个与portal 平级的的文件夹和 文件 名称由配置文件的portalEnter字段决定
* */
export default defineNuxtConfig({
  title: '慧贸OS',
  cookies: {
      // 设置 domain
      domain: '.'+theme.cookieDomain
  },

  runtimeConfig: {
      // The private keys which are only available server-side
      apiSecret: '123',
      // Keys within public are also exposed client-side
      public: {
          apiBase: '/api',
          baseUrl: envData.VITE_BASE_URL,
          baseUrl2: envData.VITE_BASE_URL2,
          ...envData
      }
  },

  router: {
      fallback: true,
      // middleware: ['default.global', 'workbench']
  },

  vite: {
      envDir: '~/env', // 指定env文件夹
      plugins: [
          createSvgIconsPlugin({
              iconDirs: [path.resolve(process.cwd(), 'assets/icons/svg')]
          }),
          vsharp()
      ],
      css: {
          preprocessorOptions: {
              scss: {
                  additionalData: theme.themeColor,
                  api: 'modern-compiler'
              },
          },
      }
  },

  nitro: {
      prerender: {
          concurrency: 1
      },
  },
  routeRules:{
      '/connect/processEngine/*': { ssr: false },
      '/connect/shop/connectContract': { ssr: false },
      '/connect/shop/contractTemplate': { ssr: false },
      '/connect/contractTemplate': { ssr: false },
      '/connect/recordDetail': { ssr: false },
      '/portal/collaborationCenter/contractTemplateDetails': { ssr: false },
      '/workbench/connect/recordDetail': { ssr: false },
      '/workbench/connect/shop/connectContract': { ssr: false },
      '/client': { ssr: false },
      '/aeoapi/**': { proxy: (process.env.NODE_ENV === 'development'?import.meta.env.VITE_DEV_PROXY:'http://backend')+'/aeoapi/**' },
      '/biapi/**': { proxy:  (process.env.NODE_ENV === 'development'?import.meta.env.VITE_DEV_PROXY:'http://backend')+'/biapi/**' },

  },

  app: {
      head: {
          title: theme.webTitle,
          charset: "utf-8",
          htmlAttrs: {
              lang: "zh-CN",
          },
          meta: [
              { charset: "utf-8" },
              {
                  name: "viewport",
                  content: "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
              },
              { name: "keywords", content: theme.webKeywords},
              { hid: 'description', name: 'description', content:  theme.webDesc },
              { name: "referrer", content: "no-referrer-when-downgrade"}
          ],
          link: [
              {
                  rel: "icon",
                  type: "image/x-icon",
                  href: theme.link
              }
          ],
          script: [
              { src: '/js/wxLogin.js' },
              { src: '/js/qrcode.min.js' },
          ],
      }

  },

  css: [
      "element-plus/dist/index.css",
      "~/assets/style/main.scss",
  ],

  modules: [
      '@element-plus/nuxt',
      'dayjs-nuxt',
      '@nuxtjs/color-mode',
      "nuxt-proxy-request"
  ],

  resolve: {
      alias: {
          '@': resolve(__dirname, '.'),
      },
  },

  plugins:[
      {src:'~/plugins/formCreate',mode: 'client'}
  ],

  colorMode: {
      preference: theme.themeModel, // default value of $colorMode.preference
      fallback: theme.themeModel, // fallback value if not system preference found
      hid: 'nuxt-color-mode-script',
      globalName: '__NUXT_COLOR_MODE__',
      componentName: 'ColorScheme',
      classPrefix: '',
      classSuffix: '-mode',
      storageKey: 'nuxt-color-mode'

  },

  elementPlus: {
      importStyle: 'scss',
  },

  components: true,

  build: {
      rollupOptions: {
          external: ['crypto-js'],
          output:{
              manualChunks:(id)=>{
                  if(id.includes('node_modules')) {
                      return 'vendor';
                  }
              }
          }
      },
      optimization: {
          minimize: true,

          splitChunks: { // 生成 chunk 的最小体积（以 bytes 为单位）
              chunks: "all",
              automaticNameDelimiter: "-",
              maxSize: 102400,
              cacheGroups: {
                  vendors: {
                      test: /[\\/]node_modules[\\/]/,
                      priority: -10, //优先级
                      reuseExistingChunk: true,
                  },
                  common: {
                      minChunks: 2,
                      priority: -20, //优先级
                      reuseExistingChunk: true,
                  },
              },
          },
      },
      terser:{
          terserOptions:{
              compress:{
                  drop_console:true
              }
          }
      },
      extend(config, { isDev, isClient }) {
          if (!isDev && isClient) {
              config.plugins.push(
                  new CompressionWebpackPlugin({
                      filename: '[path].gz',
                      algorithm: 'gzip',
                      test: /\.(js|css|html|svg)$/,  // 匹配文件名
                      threshold: 10240, // 对超过10kb的数据进行压缩
                      minRatio: 0.8,
                      deleteOriginalAssets: false, // 是否删除原文件
                  })
              )
          }
      },

  },

  spaLoadingTemplate: theme.spaLoadingPage,
  compatibilityDate: '2024-10-16'
})
