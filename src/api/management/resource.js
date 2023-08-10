/*
 * @Author: 大炸鹅
 * @Date: 2023-07-17 11:22:39
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-24 11:19:27
 * @FilePath: \智能数据构建\src\api\management\resource.js
 */
import fetch from '@/libs/fetch'

// 默认资源组信息
export function getDefaultResourceGroup(data = {}) {
  return fetch({
    url: '/daasmgr/resource/default',
    method: 'post',
    data,
    need: true
  })
}

// 获取自定义资源组列表
export function getResourceGroupList(data = {}) {
  return fetch({
    url: '/daasmgr/group/query',
    method: 'post',
    data,
    need: true
  })
}

// 新增资源组
export function addResourceGroup(data = {}) {
  return fetch({
    url: '/daasmgr/group',
    method: 'post',
    data,
    need: true
  })
}

// 负责人列表
export function getPrincipalList(data = {}) {
  return fetch({
    url: '/users/user/query',
    method: 'post',
    data,
    need: true
  })
}

// 状态列表
export function getStatusList(data = {}) {
  return fetch({
    url: '/daasmgr/group/status/list',
    method: 'post',
    data,
    need: true
  })
}

// 删除资源组
export function deleteResourceGroup(data = {}) {
  return fetch({
    url: '/daasmgr/group/delete',
    method: 'delete',
    data,
    need: true
  })
}

// 停用资源组
export function stopResourceGroup(data = {}) {
  return fetch({
    url: '/daasmgr/group/deactive',
    method: 'post',
    data,
    need: true
  })
}

// 启用资源组
export function startResourceGroup(data = {}) {
  return fetch({
    url: '/daasmgr/group/active',
    method: 'post',
    data,
    need: true
  })
}

// 保存CPU最小百分比
export function saveCpuMinPercent(data = {}) {
  return fetch({
    url: '/daasmgr/resource/cpupercent',
    method: 'put',
    data,
    need: true
  })
}

// 保存内存最小百分比
export function saveMemoryMinPercent(data = {}) {
  return fetch({
    url: '/daasmgr/resource/memorypercent',
    method: 'put',
    data,
    need: true
  })
}

// 租户默认资源组可分配资源查询接口
export function getTenantDefaultResource(data = {}) {
  return fetch({
    url: '/daasmgr/resource/assignable',
    method: 'post',
    data,
    need: true
  })
}

// 项目列表
export function getProjectList(data = {}) {
  return fetch({
    url: '/plan/commonDict/getBusinessProject',
    method: 'post',
    data,
    need: true
  })
}

// 获取编辑资源组信息
export function getEditResourceGroup(data = {}) {
  return fetch({
    url: '/daasmgr/group',
    method: 'get',
    params: data
  })
}

// 保存编辑资源组
export function saveEditResourceGroup(data = {}) {
  return fetch({
    url: '/daasmgr/group',
    method: 'put',
    data,
    need: true
  })
}