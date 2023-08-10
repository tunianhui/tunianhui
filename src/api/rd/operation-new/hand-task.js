/*
 * @Author: 大炸鹅
 * @Date: 2023-07-10 14:23:54
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-11 10:39:49
 * @FilePath: \智能数据构建\src\api\rd\operation-new\hand-task.js
 */
import fetch from '@/libs/fetch'

// 手动任务列表
export function getHandTaskList(data = {}) {
  return fetch({
    url: '/developTask/operations/listManualTask',
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

// 手动任务DAG图
export function getHandTaskDag(data = {}) {
  return fetch({
    url: '/developTask/operations/dag',
    method: 'post',
    data
  })
}

// 运行手动任务
export function runHandTask(data = {}) {
  return fetch({
    url: '/developTask/operations/manual/run',
    method: 'post',
    data
  })
}