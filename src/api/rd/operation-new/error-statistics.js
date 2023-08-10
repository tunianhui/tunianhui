/*
 * @Author: 大炸鹅
 * @Date: 2023-07-15 18:23:45
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-15 18:24:40
 * @FilePath: \智能数据构建\src\api\rd\operation-new\error-statistics.js
 */
import fetch from '@/libs/fetch'

// 错误统计
export function getErrorStatistics(data = {}) {
  return fetch({
    url: '/developTask/operations/errorStatis',
    method: 'post',
    data
  })
}