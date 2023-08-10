/*
 * @Author: 大炸鹅
 * @Date: 2023-07-28 09:19:48
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-28 09:50:19
 * @FilePath: \智能数据构建\src\router\management\system.js
 */
const WrapperView = {render: c => c('router-view')}
const Layout = _ =>
  import(/* webpackChunkName: "Layout" */ '@/views/management/layout/index')

const Compute = _ =>
  import(
    /* webpackChunkName: "Compute" */ '@/views/management/system/compute/index.vue'
  )

const addComputeSet = _ =>
  import(
    /* webpackChunkName: "addComputeSet" */ '@/views/management/system/compute/add-compute/index.vue'
  )

const Tenant = _ =>
  import(
    /* webpackChunkName: "Tenant" */ '@/views/management/system/tenant/index.vue'
  )

const ResourceSettings = _ =>
  import(
    /* webpackChunkName: "ResourceSettings" */ '@/views/management/system/resource/index.vue'
  )
export default {
  path: '/management/system',
  name: 'system',
  meta: {
    name: '系统设置',
    sideMenu: true
  },
  component: Layout,
  redirect: '/management/system/compute',
  children: [
    {
      path: '/management/system/compute',
      name: 'compute',
      meta: {
        name: '计算设置',
        icon: 'iconfont icon-yun'
      },
      component: Compute
    },
    {
      path: '/management/system/add-compute',
      name: 'add-compute',
      meta: {
        name: '添加计算设置',
        hideInMenu: true
      },
      component: addComputeSet
    },
    {
      path: '/management/system/tenant',
      name: 'tenant',
      meta: {
        name: '租户设置',
        icon: 'iconfont icon-Administrators'
      },
      component: Tenant
    },
    {
      path: '/management/system/resource',
      name: 'resource',
      meta: {
        name: '资源设置',
        icon: 'iconfont icon-yun'
      },
      component: ResourceSettings
    }
  ]
}