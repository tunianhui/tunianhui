/*
 * @Author: 大炸鹅
 * @Date: 2023-06-07 15:48:10
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-06 15:36:03
 * @FilePath: \dataphin\src\api\plan\compute-engine.js
 */
/*
 * @Author: 大炸鹅
 * @Date: 2022-12-21 16:52:27
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-07 10:28:07
 * @FilePath: \数据智能构建\src\api\plan\compute-engine.js
 */
import fetch from '@/libs/fetch'

// 计算引擎源列表
export function getTableList(data = {}) {
  return fetch({
    url: '/plan/planComputeEngine/listPage',
    method: 'post',
    data
  })
}
// 计算引擎源-数据源类型下拉框
export function getSourceTypeList(data = {}) {
  return fetch({
    url: '/plan/planComputeEngine/listSourceType',
    method: 'post',
    data
  })
}
// 计算引擎源-新增
export function addComputeEngine(data = {}, type) {
  return fetch({
    url: '/plan/planComputeEngine/save',
    method: 'post',
    data,
    type
  })
}
// 计算引擎源-修改
export function editComputeEngine(data = {}, type) {
  return fetch({
    url: '/plan/planComputeEngine/edit',
    method: 'post',
    data,
    type
  })
}
// 计算引擎源-删除
export function delComputeEngine(data = {}) {
  return fetch({
    url: '/plan/planComputeEngine/del',
    method: 'post',
    data
  })
}
// 计算引擎源-批量删除
export function batchDelComputeEngine(data = {}) {
  return fetch({
    url: '/plan/planComputeEngine/batchDel',
    method: 'post',
    data
  })
}
// 获取项目列表
export function getProjectList(data = {}) {
  return fetch({
    url: '/plan/planProject/list',
    method: 'post',
    data
  })
}
// 计算引擎测试连接
export function getTestConnection(data = {}) {
  return fetch({
    url: '/plan/planComputeEngine/engineTest',
    method: 'post',
    data
  })
}

// 读取配置信息
export function getInfos(data = {}) {
  return fetch({
    url: '/plan/engineSetting/getInfos',
    method: 'post',
    data
  })
}

// 计算引擎明细
export function getEngineById(data = {}) {
  return fetch({
    url: '/plan/planComputeEngine/getEngineById',
    method: 'post',
    data
  })
}
