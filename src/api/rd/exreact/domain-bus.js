/*
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-08-19 10:38:45
 * @LastEditTime: 2023-07-28 16:29:51
 * @Description:
 */
import fetch from '@/libs/fetch'

export function getDoaminBusTreeData(data = {}) {
  return fetch({
    url: '/label/DomainBus/treelist',
    method: 'post',
    data
  })
}

export function getlistFieldAndBusiField(data = {}) {
  return fetch({
    url: '/label/TLabelBcField/listFieldAndBusiField',
    method: 'post',
    data
  })
}

// 行为域列表
export function getDomainListPage(data = {}) {
  return fetch({
    url: '/label/TLabelBcField/listPage',
    method: 'post',
    data
  })
}

// 行为域全部
export function getDomainListAll(data = {}) {
  return fetch({
    url: '/label/TLabelBcField/listAll',
    method: 'post',
    data
  })
}

// 行为域删除
export function delDomain(data = {}) {
  return fetch({
    url: '/label/TLabelBcField/delete',
    method: 'post',
    data
  })
}

// 行为域批量删除
export function batchDeleteDomain(data = {}) {
  return fetch({
    url: '/label/TLabelBcField/batchDelete',
    method: 'post',
    data
  })
}

// 新增行为域
export function insertDomain(data = {}) {
  return fetch({
    url: '/label/TLabelBcField/insert',
    method: 'post',
    data
  })
}

// 更新行为域
export function updateDomain(data = {}) {
  return fetch({
    url: '/label/TLabelBcField/update',
    method: 'post',
    data
  })
}

// 根据id查找行为域
export function queryByIdDomain(data = {}) {
  return fetch({
    url: '/label/TLabelBcField/queryById',
    method: 'post',
    data
  })
}

// ----------业务线----------

// 业务线列表
export function getBusListPage(data = {}) {
  return fetch({
    url: '/label/TLabelBcBusiFiled/listPage',
    method: 'post',
    data
  })
}

// 业务线全部
export function getBusListAll(data = {}) {
  return fetch({
    url: '/label/TLabelBcBusiFiled/listAll',
    method: 'post',
    data
  })
}

// 业务线删除
export function delBus(data = {}) {
  return fetch({
    url: '/label/TLabelBcBusiFiled/delete',
    method: 'post',
    data
  })
}

// 业务线批量删除
export function batchDeleteBus(data = {}) {
  return fetch({
    url: '/label/TLabelBcBusiFiled/batchDelete',
    method: 'post',
    data
  })
}

// 新增业务线
export function insertBus(data = {}) {
  return fetch({
    url: '/label/TLabelBcBusiFiled/insert',
    method: 'post',
    data
  })
}

// 更新业务线
export function updateBus(data = {}) {
  return fetch({
    url: '/label/TLabelBcBusiFiled/update',
    method: 'post',
    data
  })
}

// 根据id查找业务线
export function queryByIdBus(data = {}) {
  return fetch({
    url: '/label/TLabelBcBusiFiled/queryById',
    method: 'post',
    data
  })
}
