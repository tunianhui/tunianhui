/*
 * @Autor: Gang
 * @LastEditors: cxm
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2021-08-07 17:06:51
 * @Description:
 */
import Layout from '../layout'
import components from './components'
import {types} from '@/config/asset-config'

// type 用于定义打开新建的组件的方式，tab为新增到tabs中，dialog为通过el-dialog组件打开，不写type则默认为tab
const editComponents = [
  {
    value: 'manage',
    label: '标准管理',
    children: [
      {
        value: types.CRITERION,
        label: '标准定义',
        type: 'dialog',
        component: 'CriterionEditDialog',
        btnId: '资产-标准-标准管理-标准定义-新建'
      },
      {
        value: types.CATEGORY,
        label: '类目定义',
        type: 'dialog',
        btnId: '资产-标准-标准管理-类目定义-新建'
      },
      {
        value: types.DICT,
        label: '字典定义',
        type: 'dialog',
        btnId: '资产-标准-标准管理-字典定义-新建'
      },
      {
        value: types.REGULAR,
        label: '规则映射',
        type: 'dialog',
        btnId: '资产-标准-标准管理-规则映射-新建'
      },
      {
        value: types.METADATA,
        label: '元数据映射',
        type: 'dialog',
        btnId: '资产-标准-标准管理-元数据映射-新建'
      }
    ]
  }
]

export default Layout(
  'standard',
  {
    editComponents,
    components
  },
  true
)
