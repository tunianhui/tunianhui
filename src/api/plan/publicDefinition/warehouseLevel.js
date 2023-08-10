/*
 * @Author: 大炸鹅
 * @Date: 2022-12-21 16:52:27
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-07 10:32:22
 * @FilePath: \数据智能构建\src\api\plan\publicDefinition\warehouseLevel.js
 */
import fetch from '@/libs/fetch'

export function getTableList(data = {}) {
  return fetch({
    url: '/plan/planPublicLevel/list',
    method: 'post',
    data
  })
}

// 修改
export function getEdit(data = {}) {
  return fetch({
    url: '/plan/planPublicLevel/edit',
    method: 'post',
    data
  })
}

export function getQueryById(data = {}) {
  return fetch({
    url: '/plan/planPublicLevel/queryById',
    method: 'post',
    data
  })
}

// 删除
export function getDel(data = {}) {
  return fetch({
    url: '/plan/planPublicLevel/del',
    method: 'post',
    data
  })
}

// 创建
export function getSave(data = {}) {
  return fetch({
    url: '/plan/planPublicLevel/save',
    method: 'post',
    data
  })
}
