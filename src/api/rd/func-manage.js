/*
 * @Author: 大炸鹅
 * @Date: 2022-12-21 16:52:27
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-14 11:04:22
 * @FilePath: \dataphin\src\api\rd\func-manage.js
 */
import fetch from '@/libs/fetch'

// 树列表
export function getTreeData(data = {}) {
  return fetch({
    url: '/developTask/developModelFuncManage/list',
    method: 'post',
    data
  })
}

// 新增函数
export function addFuncManage(data = {}) {
  return fetch({
    url: '/developTask/developModelFuncManage/saveFunc',
    method: 'post',
    data
  })
}

// 编辑函数
export function editFuncManage(data = {}) {
  return fetch({
    url: '/developTask/developModelFuncManage/editFunc',
    method: 'post',
    data
  })
}

// 资源列表
export function getSourceData(data = {}) {
  return fetch({
    url: '/developTask/developModelResManage/list',
    method: 'post',
    data
  })
}

// 函数信息
export function queryMetaFuncInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelFuncManage/queryMetaFuncById',
    method: 'post',
    data
  })
}

// 函数类型
export function getFuncType(data = {}) {
  return fetch({
    url: '/developTask/developModelFuncManage/getFuncClassify',
    method: 'post',
    data
  })
}

// 函数，文件夹删除
export function deleteFileAndDir(data = {}) {
  return fetch({
    url: '/developTask/developModelFuncManage/deleteFuncOrFolder',
    method: 'post',
    data
  })
}

// 函数，文件夹重命名
export function renameFileAndDir(data = {}) {
  return fetch({
    url: '/developTask/developModelFuncManage/renameFileOrFolder',
    method: 'post',
    data
  })
}

// 移动函数，文件夹
export function moveFileAndDir(data = {}) {
  return fetch({
    url: '/developTask/developModelFuncManage/moveFuncOrFolder',
    method: 'post',
    data
  })
}

// 新建文件夹
export function addFolder(data = {}) {
  return fetch({
    url: '/developTask/developModelFuncManage/saveFolder',
    method: 'post',
    data
  })
}

// 重命名
export function renameFileOrFolder(data = {}) {
  return fetch({
    url: '/developTask/developModelResManage/renameFileOrFolder',
    method: 'post',
    data
  })
}
