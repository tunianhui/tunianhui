/*
 * @Author: 大炸鹅
 * @Date: 2023-06-07 15:48:10
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-21 14:42:00
 * @FilePath: \dataphin\src\api\notice\task-center\index.js
 */
import fetch from '@/libs/fetch'

// 待处理列表
export function getPendingList(data = {}) {
  return fetch({
    url: '/plan/taskCenter/listToDo',
    method: 'post',
    data
  })
}

// 审批明细信息
export function getToDoDetail(data = {}) {
  return fetch({
    url: '/plan/taskCenter/getToDoDetail',
    method: 'post',
    data
  })
}
// 工单审批明细信息
export function getToDoDetail1(data = {}) {
  return fetch({
    url: '/plan/taskCenter/getToDoDetail',
    method: 'post',
    data
  })
}
// 审批通过
export function getPassTask(data = {}) {
  return fetch({
    url: '/plan/taskCenter/passTask',
    method: 'post',
    data
  })
}

// 审批驳回
export function getRejectTask(data = {}) {
  return fetch({
    url: '/plan/taskCenter/rejectTask',
    method: 'post',
    data
  })
}

// 已处理列表
export function getListDid(data = {}) {
  return fetch({
    url: '/plan/taskCenter/listDid',
    method: 'post',
    data
  })
}

// 我发起列表
export function getMyList(data = {}) {
  return fetch({
    url: '/plan/taskCenter/listMy',
    method: 'post',
    data
  })
}
