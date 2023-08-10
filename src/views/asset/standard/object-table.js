/*
 * @Autor: Gang
 * @LastEditors: cxm
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2021-08-07 17:10:48
 * @Description:
 */
import ObjectTable from '@c/object-table'
import {types} from '@/config/asset-config'

const tabs = [
  {
    label: '标准',
    name: types.CRITERION,
    component: 'CriterionTable',
    path: '/asset/standard/manage/define/criterion'
  },
  {
    label: '字典',
    name: types.DICT,
    component: 'DictTable',
    path: '/asset/standard/manage/define/dict'
  }
]

export default ObjectTable('standard', tabs)
