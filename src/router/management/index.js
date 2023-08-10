/*
 * @Author: 大炸鹅
 * @Date: 2023-07-27 14:37:08
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-28 09:55:39
 * @FilePath: \智能数据构建\src\router\management\index.js
 */
const WrapperView = {render: c => c('router-view')}

import dataSource from './data-source'
import member from './member'
import system from './system'

export default {
  path: '/management',
  name: 'management',
  meta: {
    name: '管理中心',
    icon: 'iconfont icon-Administrators',
    sideMenu: true,
    headMenu: true,
  },
  component: WrapperView,
  redirect: '/management/member',
  children: [
    member,
    dataSource,
    system
  ]
}