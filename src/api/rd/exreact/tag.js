/*
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-08-10 17:46:21
 * @LastEditTime: 2023-07-28 16:35:52
 * @Description:
 */
import fetch from '@/libs/fetch'

// 获取逻辑表数据失败
export function getLogicTableData(data) {
  return fetch({
    url: '/label/exreact/tag/logic/data',
    method: 'post',
    data
  })
}
