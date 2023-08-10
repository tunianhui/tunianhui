/*
 * @Author: 大炸鹅
 * @Date: 2022-12-21 16:52:27
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-07 10:25:15
 * @FilePath: \数据智能构建\src\api\rd\polymer-table.js
 */
import fetch from '@/libs/fetch'

// 新建保存
export function save(data = {}) {
  return fetch({
    url: '/developTask/developModelSummaryLogic/save',
    method: 'post',
    data
  })
}

// 删除
export function del(data = {}) {
  return fetch({
    url: '/developTask/developModelSummaryLogic/del',
    method: 'post',
    data
  })
}

// 批量删除接口
export function delBatchDeriveIndex(data = {}) {
  return fetch({
    url: '/developTask/developModelSummaryLogic/delBatchDeriveIndex',
    method: 'post',
    data
  })
}

// 汇总表信息查询接口
export function queryById(data = {}) {
  return fetch({
    url: '/developTask/developModelSummaryLogic/queryById',
    method: 'post',
    data
  })
}

// 汇总表信息查询接口
export function offLine(data = {}) {
  return fetch({
    url: '/developTask/developModelSummaryLogic/offLine',
    method: 'post',
    data
  })
}
