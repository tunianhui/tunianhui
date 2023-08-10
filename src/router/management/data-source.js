/*
 * @Author: 大炸鹅
 * @Date: 2023-07-27 14:38:52
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-08-03 13:50:12
 * @FilePath: \智能数据构建\src\router\management\data-source.js
 */
const WrapperView = {render: c => c('router-view')}
const Layout = _ =>
  import(/* webpackChunkName: "Layout" */ '@/views/management/layout/index')

const dataSourceMain = _ =>
  import(/* webpackChunkName: "dataSourceMain" */ '@/views/management/datasourceManage/datasource/index')

const CustomSource = _ =>
  import(/* webpackChunkName: "CustomSource" */ '@/views/management/datasourceManage/custom-source/index')
export default {
  path: '/management/dataSourceManage',
  name: 'dataSourceManage',
  meta: {
    name: '数据源管理',
    sideMenu: true
  },
  redirect: '/management/dataSourceManage/dataSource',
  component: Layout,
  children: [
    {
      path: '/management/dataSourceManage/dataSource',
      name: 'dataSource',
      meta: {
        name: '数据源',
        jump: false
      },
      redirect: '/management/dataSourceManage/dataSource/dataSource',
      component: WrapperView,
      children: [
        {
          path: '/management/dataSourceManage/dataSource/dataSource',
          name: 'dataSourceMain',
          meta: {
            name: '数据源',
            icon: 'iconfont icon-yuanshuju'
          },
          component: dataSourceMain
        },
        {
          path: '/management/dataSourceManage/dataSource/customSource',
          name: 'customSource',
          meta: {
            name: '自定义源类型',
            icon: 'iconfont icon-icon-sanweifenxi'
          },
          component: CustomSource
        }
      ]
    },
  ]
}