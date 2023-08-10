/*
 * @Author: cxm
 * @LastEditors: YONG
 * @Date: 2021-07-20 09:25:34
 * @LastEditTime: 2022-10-18 18:38:55
 * @Description:
 */
const WrapperView = {
  render: c => c('router-view')
}

const Layout = _ =>
  import(
    /* webpackChunkName: "sidemenu-layout" */ '@/views/layout/sidemenu-layout.vue'
  )
const Type = _ =>
  import(
    /* webpackChunkName: "catalogue-type" */ '@/views/asset/catalogue/type/index.vue'
  )
const DataTable = _ =>
  import(
    /* webpackChunkName: "catalogue-data-table" */ '@/views/asset/catalogue/data-table/index.vue'
  )
const FileManager = _ =>
  import(
    /* webpackChunkName: "catalogue-file-manage" */ '@/views/asset/catalogue/file-manage/index.vue'
  )
const APIManager = _ =>
  import(
    /* webpackChunkName: "catalogue-api-manage" */ '@/views/asset/catalogue/api-manage/index.vue'
  )

export default [
  {
    path: '/asset/catalogue',
    name: 'catalogue',
    meta: {
      name: '其它',
      sideMenu: true,
      href: '/asset/catalogue'
    },
    redirect: '/asset/catalogue/data-manage',
    component: Layout,
    children: [
      {
        path: '/asset/catalogue/data-manage',
        name: 'data-manage',
        meta: {
          name: '数据管理',
          jump: false
        },
        redirect: '/asset/catalogue/data-manage/data-table',
        component: WrapperView,
        children: [
          {
            path: '/asset/catalogue/data-manage/data-table',
            name: 'data-table',
            meta: {
              name: '数据表管理',
              icon: 'iconfont icon-zhiliangguize'
            },
            component: DataTable
          },
          {
            path: '/asset/catalogue/data-manage/file-manage',
            name: 'file-manage',
            meta: {
              name: '文件管理',
              icon: 'iconfont icon-zhiliangguize'
            },
            component: FileManager
          },
          {
            path: '/asset/catalogue/data-manage/api-manage',
            name: 'api-manage',
            meta: {
              name: 'API管理',
              icon: 'iconfont icon-zhiliangguize'
            },
            component: APIManager
          }
        ]
      },
      {
        path: '/asset/catalogue/catalogue-manage',
        name: 'catalogue-manage',
        meta: {
          name: '类目管理',
          jump: false
        },
        redirect: '/asset/catalogue/catalogue-manage/type',
        component: WrapperView,
        children: [
          {
            path: '/asset/catalogue/catalogue-manage/type',
            name: 'type',
            meta: {
              name: '其它',
              icon: 'iconfont icon-quanjugaikuang'
            },
            component: Type
          }
        ]
      }
    ]
  }
]
