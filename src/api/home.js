/*
 * @Author: 大炸鹅
 * @Date: 2023-06-07 15:48:10
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-17 17:54:39
 * @FilePath: \智能数据构建\src\api\home.js
 */
import fetch from '@/libs/fetch'

export function getData(data = {}) {
  return fetch({
    url: '/plan/planBusiness/listBusiness',
    method: 'post',
    data
  })
}

// 调度运维
export function listJobCount(data = {}) {
  return fetch({
    url: '/plan/home/listJobCount',
    method: 'post',
    data
  })
}

// 字典
export function getDictParams(data = {}) {
  return fetch({
    url: '/plan/commonDict/getDictParams',
    method: 'post',
    data
  })
}

// 查询数据域列表
export function getMetaDataField(data = {}) {
  return fetch({
    url: '/plan/commonDict/getMetaDataField',
    method: 'post',
    data
  })
}

export function getMenuAuths(data = {}) {
  return fetch({
    url: '/plan/commonDict/systemAuthority',
    method: 'post',
    data
  })
}

export function getBtnAuths(data = {}) {
  return fetch({
    url: '/plan/commonDict/buttonAuthority',
    method: 'post',
    data
  })
}

export function setBtnAuth(data = {}) {
  return fetch({
    url: '/plan/commonDict/setButtonAuthority',
    method: 'post',
    data
  })
}

export function getTitle(data = {}) {
  return fetch({
    url: '/plan/commonDict/getTitle',
    method: 'post',
    data
  })
}
