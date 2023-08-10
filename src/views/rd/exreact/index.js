/*
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2020-08-10 17:19:59
 * @Description:
 */
import Layout from '../layout'
import components from './components'
import {
  types
} from '@/config/rd-config'

// type 用于定义打开新建的组件的方式，tab为新增到tabs中，dialog为通过el-dialog组件打开，不写type则默认为tab
const editComponents = [{
  value: 'behaviorCenter',
  label: '行为中心',
  children: [{
    value: types.REGULAR,
    label: '行为规则',
    type: 'dialog',
    component: 'RegularEditDialog',
    btnId: '研发-萃取-行为中心-行为规则-新建'
  },
  {
    value: types.DOMAIN,
    label: '行为域',
    type: 'dialog',
    btnId: '研发-萃取-行为中心-行为域-新建'
  },
  {
    value: types.BUS,
    label: '业务线',
    type: 'dialog',
    btnId: '研发-萃取-行为中心-业务线-新建'
  },
  {
    value: types.ACTION,
    label: '动作',
    type: 'dialog',
    btnId: '研发-萃取-行为中心-动作-新建'
  },
  {
    value: types.OBJECT,
    label: '对象',
    type: 'dialog',
    btnId: '研发-萃取-行为中心-动作-新建'
  },
  {
    value: types.OBJECTATTR,
    label: '对象属性',
    type: 'dialog',
    btnId: '研发-萃取-行为中心-对象属性-新建'
  }
  ]
},
{
  value: 'tagCenter',
  label: '标签中心',
  children: [
    {
      value: types.FACTORY,
      label: '标签工厂',
      type: 'dialog',
      btnId: '研发-萃取-标签中心-标签工厂-新建'
    },
    {
      value: types.CATEGORY,
      label: '标签类目',
      type: 'dialog',
      btnId: '研发-萃取-标签中心-标签类目-新建'
    }
  ]
}]

export default Layout('exreact', {
  editComponents,
  components
}, true)
