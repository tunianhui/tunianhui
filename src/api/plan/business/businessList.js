/*
 * @Author: 大炸鹅
 * @Date: 2022-12-21 16:52:27
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-27 09:10:01
 * @FilePath: \数据智能构建\src\api\plan\business\businessList.js
 */
import fetch from '@/libs/fetch'

export function getTableList(data = {}) {
  return fetch({
    url: '/plan/planBusiness/listBusiness',
    method: 'post',
    data
  })
}
