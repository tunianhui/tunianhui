/*
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-07-31 16:09:07
 * @LastEditTime: 2023-07-28 16:35:26
 * @Description:
 */
import fetch from '@/libs/fetch'

export function getTreeData(data = {}) {
  return fetch({
    url: '/label/exreact/list',
    method: 'post',
    data
  })
}

export function getBehaviorBoard(data = {}) {
  return fetch({
    url: '/label/exreact/behaviorBoard',
    method: 'post',
    data
  })
}
