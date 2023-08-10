/*
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-08-26 09:03:30
 * @LastEditTime: 2021-08-27 15:11:17
 * @Description:
 */
import fetch from '@/libs/fetch'

// 任务监控列表
export function listPage(data = {}) {
  return fetch({
    url: '/alarm/listPage',
    method: 'post',
    data
  })
}
// 新建保存
export function save(data = {}) {
  return fetch({
    url: '/alarm/save',
    method: 'post',
    data
  })
}
// 修改
export function edit(data = {}) {
  return fetch({
    url: '/alarm/edit',
    method: 'post',
    data
  })
}
// 删除
export function del(data = {}) {
  return fetch({
    url: '/alarm/delete',
    method: 'post',
    data
  })
}
// 监控开关
export function monitorSwitch(data = {}) {
  return fetch({
    url: '/alarm/monitorSwitch',
    method: 'post',
    data
  })
}
// 批量删除
export function batchDelete(data = {}) {
  return fetch({
    url: '/alarm/batchDelete',
    method: 'post',
    data
  })
}
// 批量开关
export function batchSwitch(data = {}) {
  return fetch({
    url: '/alarm/batchSwitch',
    method: 'post',
    data
  })
}
// 新增-任务列表
export function listCubes(data = {}) {
  return fetch({
    url: '/alarm/listCubes',
    method: 'post',
    data
  })
}
// 创建人
export function listCreateUser(data = {}) {
  return fetch({
    url: '/alarm/listCreateUser',
    method: 'post',
    data
  })
}
// 接收人
export function listReceivePerson(data = {}) {
  return fetch({
    url: '/alarm/listReceivePerson',
    method: 'post',
    data
  })
}

// 任务报警列表
export function listHistoryPage(data = {}) {
  return fetch({
    url: '/alarm/listHistoryPage',
    method: 'post',
    data
  })
}
