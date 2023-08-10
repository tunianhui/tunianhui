/*
 * @Author: 大炸鹅
 * @Date: 2023-07-03 09:38:58
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-04 15:06:32
 * @FilePath: \dataphin\src\api\rd\operation-new\cycle-task.js
 */
import fetch from '@/libs/fetch'

// 周期任务列表
export function getCycleTaskList(data = {}) {
  return fetch({
    url: '/developTask/operations/listCycleTask',
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

// 暂停任务
export function pauseCycleTask(data = {}) {
  return fetch({
    url: '/developTask/operations/pause',
    method: 'post',
    data
  })
}

// 恢复任务
export function resumeCycleTask(data = {}) {
  return fetch({
    url: '/developTask/operations/recovery',
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

// 运行
export function runCycleTask(data = {}) {
  return fetch({
    url: '/developTask/operations/manual/run',
    method: 'post',
    data
  })
}