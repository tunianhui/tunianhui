/*
 * @Author: 大炸鹅
 * @Date: 2022-12-21 16:52:27
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-07 10:33:07
 * @FilePath: \数据智能构建\src\api\plan\project-manage.js
 */
import fetch from '@/libs/fetch'

// 项目列表
export function getTableList(data = {}) {
  return fetch({
    url: '/plan/planProject/listPage',
    method: 'post',
    data
  })
}
// 新建项目
export function newBuildProject(data = {}) {
  return fetch({
    url: '/plan/planProject/save',
    method: 'post',
    data
  })
}
// 编辑项目
export function editProject(data = {}) {
  return fetch({
    url: '/plan/planProject/edit',
    method: 'post',
    data
  })
}
// 删除项目
export function deleteProject(data = {}) {
  return fetch({
    url: '/plan/planProject/del',
    method: 'post',
    data
  })
}
// 引擎源列表
export function getSourceListType(data = {}) {
  return fetch({
    url: '/plan/planComputeEngine/listSourceType',
    method: 'post',
    data
  })
}
// 获取数据源列表
export function getDataSource(data = {}) {
  return fetch({
    url: '/plan/planDatasource/list',
    method: 'post',
    data
  })
}
// 业务板块
export function getListBusiness(data = {}) {
  return fetch({
    url: '/plan/planBusiness/listBusiness',
    method: 'post',
    data
  })
}
// 成员管理列表
export function getMemberList(data = {}) {
  return fetch({
    url: '/plan/planProject/user/listPage',
    method: 'post',
    data
  })
}
// 成员管理删除
export function delMember(data = {}) {
  return fetch({
    url: '/plan/planProject/user/del',
    method: 'post',
    data
  })
}
// 批量删除
export function batchDelMember(data = {}) {
  return fetch({
    url: '/plan/planProject/user/batchDel',
    method: 'post',
    data
  })
}
// 获取空间类型
export function getSpaceTypeList(data = {}) {
  return fetch({
    url: '/plan/commonDict/getDictParams',
    method: 'post',
    data
  })
}
// 获取所有成员
export function getAllUsers(data = {}) {
  return fetch({
    url: '/plan/planProject/user/getAllUsers',
    method: 'post',
    data
  })
}
// 添加成员
export function addUsers(data = {}) {
  return fetch({
    url: '/plan/planProject/user/save',
    method: 'post',
    data
  })
}
