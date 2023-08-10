/*
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-05-28 10:00:03
 * @LastEditTime: 2023-07-24 09:27:55
 * @Description:
 */
import axios from 'axios'
import qs from 'qs'
import config from '@/config'
import router from '@/router'

sessionStorage.setItem('baseurl', config.baseurl)
// 创建axios实例
const service = axios.create({
  baseURL: config.baseurl, // api的base_url
  // timeout: 30000, // 请求超时时间
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  }
})

// request拦截器
service.interceptors.request.use(config => {
  if (config.type === 'upload') {
    config.headers = {
      'Content-Type': 'multipart/form-data'
    }
  } else {
    if (config.method === 'post' || config.method === 'put') {
      if (config.need) {
        config.headers = {
          'Content-Type': 'application/json; charset=utf-8'
        }
        if (!config.data) {
          config.data = {}
        }
        config.data = config.data
      } else {
        config.data = qs.stringify(config.data)
      }
    } else if (config.method === 'delete') {
      if (config.need) {
        config.headers = {
          'Content-Type': 'application/json; charset=utf-8'
        }
        if (!config.data) {
          config.data = {}
        }
        console.log(config.data)
        config.data = config.data
      } else {
        config.data = qs.stringify(config.data)
      }
    }
  }
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 500:
          /** 服务端报错 **/
          // router.replace({
          //   path: '/error/500'
          // })
          break
      }
    }
    console.error('Error', error)

    return Promise.reject(error)
  }
)

export default service
