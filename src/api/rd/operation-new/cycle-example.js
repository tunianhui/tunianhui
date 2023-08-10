/*
 * @Author: 大炸鹅
 * @Date: 2023-07-05 14:56:03
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-12 17:44:48
 * @FilePath: \智能数据构建\src\api\rd\operation-new\cycle-example.js
 */
import fetch from '@/libs/fetch'

// 周期实例列表
export function getCycleExampleList(data = {}) {
  return fetch({
    url: '/developTask/operations/listCycleTaskInstance',
    method: 'post',
    data
  })
}

// 负责人列表
export function getOwnerList(data = {}) {
  return fetch({
    url: '/plan/planProject/user/listPage',
    method: 'post',
    data
  })
}

// 重跑实例
export function rerunCycleExample(data = {}) {
  return fetch({
    url: '/developTask/operations/rerun',
    method: 'post',
    data
  })
}

// DAG图
export function getDag(data = {}) {
  return fetch({
    url: '/developTask/operations/dag',
    method: 'post',
    data
  })
}

// 实例终止
export function stopCycleExample(data = {}) {
  return fetch({
    url: '/developTask/operations/stop',
    method: 'post',
    data
  })
}

// 实例暂停
export function pauseCycleExample(data = {}) {
  return fetch({
    url: '/developTask/operations/instance/pause',
    method: 'post',
    data
  })
}

// 实例恢复
export function resumeCycleExample(data = {}) {
  return fetch({
    url: '/developTask/operations/instance/recovery',
    method: 'post',
    data
  })
}