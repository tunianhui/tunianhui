/*
 * @Author: 大炸鹅
 * @Date: 2023-07-31 10:56:37
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-08-08 13:43:06
 * @FilePath: \智能数据构建\src\api\management\datasource.js
 */
import fetch from '@/libs/fetch'

// 数据源类型列表
export function getDataSourceTypeList(data = {}) {
  return fetch({
    url: '/plan/planDatasourceManger/queryDataSourceType',
    method: 'post',
    data
  })
}

// 数据源列表
export function getDataSourceList(data = {}) {
  return fetch({
    url: '/plan/planDatasourceManger/list',
    method: 'post',
    data
  })
}

// 数据源保存
export function saveDataSource(data = {}, type) {
  return fetch({
    url: '/plan/planDatasourceManger/save',
    method: 'post',
    data,
    type
  })
}

// 数据源编辑
export function editDataSource(data = {}, type) {
  return fetch({
    url: '/plan/planDatasourceManger/edit',
    method: 'post',
    data,
    type
  })
}

// 删除
export function delDataSource(data = {}) {
  return fetch({
    url: '/plan/planDatasourceManger/del',
    method: 'post',
    data
  })
}

// 数据源版本号
export function getDataSourceVersion(data = {}) {
  return fetch({
    url: '/plan/planDatasourceManger/queryDataSourceVersion',
    method: 'post',
    data
  })
}