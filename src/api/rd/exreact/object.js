/*
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-08-19 10:38:45
 * @LastEditTime: 2023-07-28 16:25:21
 * @Description:
 */
import fetch from '@/libs/fetch'

// 行为对象列表
export function getListPage(data = {}) {
  return fetch({
    url: '/label/TLabelBcObject/listPage',
    method: 'post',
    data
  })
}

// 行为对象全部
export function getListAll(data = {}) {
  return fetch({
    url: '/label/TLabelBcObject/listAll',
    method: 'post',
    data
  })
}

// 行为对象删除
export function del(data = {}) {
  return fetch({
    url: '/label/TLabelBcObject/delete',
    method: 'post',
    data
  })
}

// 行为对象批量删除
export function batchDelete(data = {}) {
  return fetch({
    url: '/label/TLabelBcObject/batchDelete',
    method: 'post',
    data
  })
}

// 新增对象
export function insert(data = {}) {
  return fetch({
    url: '/label/TLabelBcObject/insert',
    method: 'post',
    data
  })
}

// 更新对象
export function update(data = {}) {
  return fetch({
    url: '/label/TLabelBcObject/update',
    method: 'post',
    data
  })
}

// 根据id查找对象
export function queryById(data = {}) {
  return fetch({
    url: '/label/TLabelBcObject/queryById',
    method: 'post',
    data
  })
}
