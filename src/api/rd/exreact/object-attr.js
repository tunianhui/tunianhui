/*
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-08-19 10:38:45
 * @LastEditTime: 2023-07-28 16:23:29
 * @Description:
 */
import fetch from '@/libs/fetch'

// 行为对象属性列表
export function getListPage(data = {}) {
  return fetch({
    url: '/label/TLabelBcObjectAttr/listPage',
    method: 'post',
    data
  })
}

// 行为对象属性全部
export function getListAll(data = {}) {
  return fetch({
    url: '/label/TLabelBcObjectAttr/listAll',
    method: 'post',
    data
  })
}

// 行为对象属性删除
export function del(data = {}) {
  return fetch({
    url: '/label/TLabelBcObjectAttr/delete',
    method: 'post',
    data
  })
}

// 行为对象属性批量删除
export function batchDelete(data = {}) {
  return fetch({
    url: '/label/TLabelBcObjectAttr/batchDelete',
    method: 'post',
    data
  })
}

// 新增对象属性
export function insert(data = {}) {
  return fetch({
    url: '/label/TLabelBcObjectAttr/insert',
    method: 'post',
    data
  })
}

// 更新对象属性
export function update(data = {}) {
  return fetch({
    url: '/label/TLabelBcObjectAttr/update',
    method: 'post',
    data
  })
}

// 根据id查找对象属性
export function queryById(data = {}) {
  return fetch({
    url: '/label/TLabelBcObjectAttr/queryById',
    method: 'post',
    data
  })
}
