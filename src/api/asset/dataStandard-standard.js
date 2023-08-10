/*
 * @Author: 大炸鹅
 * @Date: 2023-05-12 17:07:53
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-12 17:11:15
 * @FilePath: \数据智能构建\src\api\asset\dataStandard-standard.js
 */
import fetch from '@/libs/fetch'

// 词根列表
export function getstandardsetFuzzySearchList (data) {
  return fetch({
    url: `/datastandard/standardset/fuzzySearch`,
    method: 'get',
    params: data
  })
}