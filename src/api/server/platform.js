/** 平台管理 */
import fetch from '@/libs/fetch'

// 饼图数据
export function getInfo(data = {}) {
  return fetch({
    url: '/businessFlow/getInfo',
    method: 'post',
    data
  })
}

// 趋势图数据
export function getRunData(data = {}) {
  return fetch({
    url: '/businessFlow/getRunData',
    method: 'post',
    data
  })
}