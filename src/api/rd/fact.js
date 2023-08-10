/*
 * @Author: 大炸鹅
 * @Date: 2022-12-21 16:52:27
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-07 10:17:45
 * @FilePath: \数据智能构建\src\api\rd\fact.js
 */
import fetch from '@/libs/fetch'

// 业务过程--新增接口
export function addBusProcess(data = {}) {
  return fetch({
    url: '/developTask/developModelBusProcess/save',
    method: 'post',
    data
  })
}

// 业务过程--删除接口
export function delBusProcess(data = {}) {
  return fetch({
    url: '/developTask/developModelBusProcess/del',
    method: 'post',
    data
  })
}

// 业务过程--下线接口
export function offLineBusProcess(data = {}) {
  return fetch({
    url: '/developTask/developModelBusProcess/offLine',
    method: 'post',
    data
  })
}

// 业务过程--查询接口
export function queryBusProcess(data = {}) {
  return fetch({
    url: '/developTask/developModelBusProcess/queryById',
    method: 'post',
    data
  })
}

// 业务过程--修改接口
export function editBusProcess(data = {}) {
  return fetch({
    url: '/developTask/developModelBusProcess/edit',
    method: 'post',
    data
  })
}
