/*
 * @Author: 大炸鹅
 * @Date: 2023-02-08 15:48:50
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-28 16:27:03
 * @FilePath: \智能数据构建\src\api\rd\exreact\entity-id.js
 */
import fetch from '@/libs/fetch'

// id中心tree
export function getIdCnterListAll(data = {}) {
  return fetch({
    url: '/label/TLabelIdInfo/listAll',
    method: 'post',
    data
  })
}

// 新增
export function addIdEntity(data = {}) {
  return fetch({
    url: '/label/TLabelIdInfo/insert',
    method: 'post',
    data
  })
}

// 新增
export function saveIdEntity(data = {}) {
  return fetch({
    url: '/label/TLabelIdInfo/update',
    method: 'post',
    data
  })
}

// 删除
export function deleteIdEntity(data = {}) {
  return fetch({
    url: '/label/TLabelIdInfo/delete',
    method: 'post',
    data
  })
}

// 根据主键ID查询属性
export function queryByIdInfo(data = {}) {
  return fetch({
    url: '/label/TLabelIdInfo/queryById',
    method: 'post',
    data
  })
}

// 列表
export function getListPage(data = {}) {
  return fetch({
    url: '/label/TLabelIdInfo/listPage',
    method: 'post',
    data
  })
}
