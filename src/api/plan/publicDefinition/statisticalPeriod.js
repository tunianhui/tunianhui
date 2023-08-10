/*
 * @Author: 大炸鹅
 * @Date: 2022-12-21 16:52:27
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-07 10:32:02
 * @FilePath: \数据智能构建\src\api\plan\publicDefinition\statisticalPeriod.js
 */
import fetch from '@/libs/fetch'

export function getTableList(data = {}) {
  return fetch({
    url: '/plan/planPublicCycle/list',
    method: 'post',
    data
  })
}

export function getSave(data = {}) {
  return fetch({
    url: '/plan/planPublicCycle/save',
    method: 'post',
    data
  })
}

export function getQueryById(data = {}) {
  return fetch({
    url: '/plan/planPublicCycle/queryById',
    method: 'post',
    data
  })
}

export function getEdit(data = {}) {
  return fetch({
    url: '/plan/planPublicCycle/edit',
    method: 'post',
    data
  })
}

export function getDel(data = {}) {
  return fetch({
    url: '/plan/planPublicCycle/del',
    method: 'post',
    data
  })
}
