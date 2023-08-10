/*
 * @Author: cxm
 * @LastEditors: 大炸鹅
 * @Date: 2021-08-10 17:21:37
 * @LastEditTime: 2023-06-07 10:26:24
 * @Description:
 */
import {Random} from 'mockjs'
import {getRangeDates} from '@/libs/util'
import fetch from '@/libs/fetch'

const setData = data =>
  new Promise((resolve, reject) => {
    resolve(data)
  })

const dates = getRangeDates('2020-12-18', '2020-12-18')
const getList = data =>
  setData({
    flag: true,
    data: Array.from(
      {
        length: 25
      },
      d => ({
        releaseName: Random.name(),
        English: Random.word(10, 20),
        tableType: Random.pick(['16', '17', '18', '100']),
        tablerName: Random.name(),
        Chinese: Random.word(10, 20),
        code: Random.pick(['432000', '100211', '234324']),
        version: Random.pick(['V1.0', 'V2.0', 'V2.1']),
        submitter: Random.name(),
        publisher: Random.name(),
        status: Random.pick(['失败', '成功', '发布中']),
        date: dates[0],
        id: Random.id()
      })
    )
  })
// 待发布列表
export function getTableList(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getList(data)
}

// 标准发布-待发布列表
export function getWaitingList(data = {}) {
  return fetch({
    url: '/standardRelease/listPage',
    method: 'post',
    data
  })
}
// 标准发布-待发布列表-发布
export function release(data = {}) {
  return fetch({
    url: '/standardManagement/release',
    method: 'post',
    data
  })
}
// 标准发布-发布记录
export function getPublishList(data = {}) {
  return fetch({
    url: '/standardRelease/listHisPage',
    method: 'post',
    data
  })
}
// 版本管理-当前版本列表
export function getCurrentList(data = {}) {
  return fetch({
    url: '/standardVersion/listPage',
    method: 'post',
    data
  })
}
// 版本管理-历史版本列表
export function getHistoryList(data = {}) {
  return fetch({
    url: '/standardVersion/listHisPage',
    method: 'post',
    data
  })
}
// 版本管理-当前版本-废止
export function abandoned(data = {}) {
  return fetch({
    url: '/standardVersion/abandoned',
    method: 'post',
    data
  })
}
// 版本管理-历史版本-启用
export function restart(data = {}) {
  return fetch({
    url: '/standardVersion/restart',
    method: 'post',
    data
  })
}
// 最近提交人下拉框
export function getSubmitterList(data = {}) {
  return fetch({
    url: '/standardManagement/listOperUsers',
    method: 'post',
    data
  })
}
// 业务板块
export function getBusinessList(data = {}) {
  return fetch({
    url: '/plan/planBusiness/listBusiness',
    method: 'post',
    data
  })
}
// 一级分类 二级分类 三级分类
export function getCatalogList(data = {}) {
  return fetch({
    url: '/standardCatalogManagement/listAll',
    method: 'post',
    data
  })
}
