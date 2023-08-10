/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-22 10:43:55
 * @LastEditTime: 2023-06-26 13:52:58
 * @Description:
 */
import Layout from '../layout'
import components from './components'
import {types} from '@/config/rd-config'

const editComponents = [
  {
    value: 'dataProcess',
    label: '数据处理',
    children: [
      {
        value: types.SYNCTASK,
        label: '离线管道',
        btnId: '研发-集成-同步任务-新建'
      }
    ]
  }
]

export default Layout('dev', {
  editComponents,
  components
})
