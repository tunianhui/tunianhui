/*
 * @Author: 大炸鹅
 * @Date: 2023-07-11 10:51:32
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-12 17:53:39
 * @FilePath: \智能数据构建\src\api\rd\operation-new\hand-example.js
 */
import fetch from '@/libs/fetch'

// 手动任务实例列表
export function getHandExampleList(data = {}) {
  return fetch({
    url: '/developTask/operations/listManualTaskInstance',
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

// 手动实例重跑
export function runHandExample(data = {}) {
  return fetch({
    url: '/developTask/operations/rerun',
    method: 'post',
    data
  })
}

// 日志
export function getLog(data = {}) {
  return fetch({
    url: '/developTask/operations/logs',
    method: 'post',
    data
  })
}

// 手动实例DAG图数据
export function getDagData(data = {}) {
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