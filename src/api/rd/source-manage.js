/*
 * @Author: 大炸鹅
 * @Date: 2022-12-21 16:52:27
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-14 14:24:49
 * @FilePath: \dataphin\src\api\rd\source-manage.js
 */
import fetch from '@/libs/fetch'

// 树列表
export function getTreeData(data = {}) {
  return fetch({
    url: '/developTask/developModelResManage/list',
    method: 'post',
    data
  })
}

// 类型
export function getFileType(data = {}) {
  return fetch({
    url: '/developTask/developModelResManage/getFileType',
    method: 'post',
    data
  })
}

// 计算类型
export function getEngineType(data = {}) {
  return fetch({
    url: '/developTask/developModelResManage/getEngineType',
    method: 'post',
    data
  })
}

// 查询资源
export function queryMetaFileSourceInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelResManage/queryMetaFileSourceById',
    method: 'post',
    data
  })
}

// 新建文件夹
export function addFolderSource(data = {}) {
  return fetch({
    url: '/developTask/developModelResManage/saveFolder',
    method: 'post',
    data
  })
}

// 删除
export function deleteFileOrFolder(data = {}) {
  return fetch({
    url: '/developTask/developModelResManage/deleteFileOrFolder',
    method: 'post',
    data
  })
}

// 编辑
export function editFile(data = {}) {
  return fetch({
    url: '/developTask/developModelResManage/editFile',
    method: 'post',
    data
  })
}

// 编辑内容
export function queryMetaFileContent(data = {}) {
  return fetch({
    url: '/developTask/developModelResManage/queryMetaFileContent',
    method: 'post',
    data
  })
}

// 保存编辑内容
export function updateMetaFileContent(data = {}) {
  return fetch({
    url: '/developTask/developModelResManage/updateMetaFileContent',
    method: 'post',
    data
  })
}
