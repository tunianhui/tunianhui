/*
 * @Author: 大炸鹅
 * @Date: 2023-03-03 10:36:08
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-08-01 09:50:38
 * @FilePath: \智能数据构建\src\api\rd\exreact\main-id.js
 */
import fetch from '@/libs/fetch'

// 主体id-来源物理表
export function getSourceTableList(data = {}) {
  return fetch({
    url: '/label/TLabelLcIdRule/queryCubeList',
    method: 'post',
    data
  })
}

// 主体-来源物理表字段/分区
export function getQueryColumnList(data = {}) {
  return fetch({
    url: '/label/TLabelLcIdRule/queryColumnList',
    method: 'post',
    data
  })
}


// 主体-实体ID
export function getQueryIdInfo(data = {}) {
  return fetch({
    url: '/label/TLabelLcIdRule/queryIdInfo',
    method: 'post',
    data
  })
}

// 主体-列表
export function getMainList(data = {}) {
  return fetch({
    url: '/label/TLabelLcIdRule/list',
    method: 'post',
    data
  })
}

// 主体-列表
export function deleteMain(data = {}) {
  return fetch({
    url: '/label/TLabelLcIdRule/delete',
    method: 'post',
    data
  })
}

// 主体-保存
export function savemain(data = {}) {
  return fetch({
    url: '/label/TLabelLcIdRule/save',
    method: 'post',
    data
  })
}

// 主体-信息
export function queryById(data = {}) {
  return fetch({
    url: '/label/TLabelLcIdRule/queryById',
    method: 'post',
    data
  })
}

// 主体-编辑
export function editMain(data = {}) {
  return fetch({
    url: '/label/TLabelLcIdRule/update',
    method: 'post',
    data
  })
}