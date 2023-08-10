/*
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-08-19 10:38:45
 * @LastEditTime: 2023-07-28 16:12:07
 * @Description:
 */
import fetch from '@/libs/fetch'

// 行为动作列表
export function getListPage(data = {}) {
  return fetch({
    url: '/label/TLabelBcAct/listPage',
    method: 'post',
    data
  })
}

// 行为动作全部
export function getListAll(data = {}) {
  return fetch({
    url: '/label/TLabelBcAct/listAll',
    method: 'post',
    data
  })
}

// 行为动作删除
export function del(data = {}) {
  return fetch({
    url: '/label/TLabelBcAct/delete',
    method: 'post',
    data
  })
}

// 行为动作批量删除
export function batchDelete(data = {}) {
  return fetch({
    url: '/label/TLabelBcAct/batchDelete',
    method: 'post',
    data
  })
}

// 新增动作
export function insert(data = {}) {
  return fetch({
    url: '/label/TLabelBcAct/insert',
    method: 'post',
    data
  })
}

// 更新动作
export function update(data = {}) {
  return fetch({
    url: '/label/TLabelBcAct/update',
    method: 'post',
    data
  })
}

// 根据id查找动作
export function queryById(data = {}) {
  return fetch({
    url: '/label/TLabelBcAct/queryById',
    method: 'post',
    data
  })
}
