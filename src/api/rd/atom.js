/*
 * @Author: 大炸鹅
 * @Date: 2022-12-21 16:52:27
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-07 10:16:43
 * @FilePath: \数据智能构建\src\api\rd\atom.js
 */
import fetch from '@/libs/fetch'

// 新建保存
export function save(data = {}) {
  return fetch({
    url: '/developTask/developModelAtomicIndex/save',
    method: 'post',
    data
  })
}

// 查询
export function queryById(data = {}) {
  return fetch({
    url: '/developTask/developModelAtomicIndex/queryById',
    method: 'post',
    data
  })
}

// 编辑
export function edit(data = {}) {
  return fetch({
    url: '/developTask/developModelAtomicIndex/edit',
    method: 'post',
    data
  })
}

// 删除
export function del(data = {}) {
  return fetch({
    url: '/developTask/developModelAtomicIndex/del',
    method: 'post',
    data
  })
}

// 指标列表
export function queryAtomicIndexInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelAtomicIndex/queryAtomicIndexInfo',
    method: 'post',
    data
  })
}

// 提交
export function atomicPublish(data = {}) {
  return fetch({
    url: '/developTask/developModelAtomicIndex/atomicPublish',
    method: 'post',
    data
  })
}

// 提交
export function offLine(data = {}) {
  return fetch({
    url: '/developTask/developModelAtomicIndex/offLine',
    method: 'post',
    data
  })
}

// 提交
export function getSourceTableModelInfoDim(data = {}) {
  return fetch({
    url: '/developTask/developModelAtomicIndex/getSourceTableModelInfoDim',
    method: 'post',
    data
  })
}

// 提交
export function getSourceTableModelInfoFact(data = {}) {
  return fetch({
    url: '/developTask/developModelAtomicIndex/getSourceTableModelInfoFact',
    method: 'post',
    data
  })
}

// 计算逻辑校验
export function funcVerification(data = {}) {
  return fetch({
    url: '/developTask/developModelAtomicIndex/funcVerification',
    method: 'post',
    data
  })
}
