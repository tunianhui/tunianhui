/*
 * @Autor: YONG
 * @LastEditors: YONG
 * @Date: 2022-02-24 14:25:25
 * @LastEditTime: 2022-02-24 15:34:25
 * @Description:
 */
import Layout from './layout'
import components from './components'
import {types} from '@/config/server-config'

const editComponents = [
  {
    value: 'serverDev',
    label: '服务开发',
    children: [
      {
        value: types.APICREATE,
        label: 'Api生成',
        type: 'tab',
        btnId: '服务-服务开发-Api生成-新建'
      },
      {
        value: types.REGISTER,
        label: 'Api注册',
        type: 'tab',
        btnId: '服务-服务开发-Api注册-新建'
      },
      {
        value: types.FUNC,
        label: '函数',
        type: 'tab',
        btnId: '服务-服务开发-函数-新建'
      },
      {
        value: types.ARRANGE,
        label: '服务编排',
        type: 'tab',
        btnId: '服务-服务开发-服务编排-新建'
      },
      {
        value: types.FLOW,
        label: '业务过程',
        type: 'dialog',
        btnId: '服务-服务开发-业务过程-新建'
      }
    ]
  }
]

export default Layout('server', {
  editComponents,
  components
})
