/*
 * @Autor: Gang
 * @LastEditors: YONG
 * @Date: 2020-05-28 10:00:03
 * @LastEditTime: 2023-08-03 10:11:39
 * @Description:
 */
const isDev = process.env.NODE_ENV === 'development'

const service = {
  'api-yapi': 'http://39.98.200.240:9090/mock/48',
  'api-zhangjun': 'http://172.30.132.198:19080',
  'api-zhangjun2': 'http://172.30.129.6:8076',
  'api-test': 'http://172.30.132.154:18890',
  'api-lmz': 'http://172.30.129.17:18890',
  'api-lyh': 'http://172.30.129.31:8686/',
  'api-yanfa': 'http://172.30.132.198:8076',
  'tutu': 'https://mock.apifox.cn/m1/3131470-0-default'
}

const prefix = isDev ? service['tutu'] : ''
const productPrefix = process.env.VUE_APP_CURRENTMODE === 'demo' ? prefix : ''

export default {
  name: '数据中台',
  homePath: '/home',
  baseurl: isDev ? prefix : productPrefix,
  proxy: {
    '/api': {
      target: prefix,
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/': ''
      }
      // '/': {
      //   target: prefix,
      //   secure: false,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/': ''
      //   }
      // }
    }
  },
  // 前后端交互时标记请求状态是否成功的字段
  markStatus: {
    key: 'flag',
    success: true,
    error: false
  }
}
