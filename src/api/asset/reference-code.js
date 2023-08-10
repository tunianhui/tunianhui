/*
 * @Author: 大炸鹅
 * @Date: 2023-05-12 16:53:45
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-12 16:54:18
 * @FilePath: \数据智能构建\src\api\asset\reference-code.js
 */
import fetch from '@/libs/fetch'

// 标准代码列表
export function getLookuptableList (data) {
  return fetch({
    url: `/datastandard/lookuptable/query`,
    method: 'get',
    params: data
  })
}