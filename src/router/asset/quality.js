const WrapperView = {render: c => c('router-view')}

const Layout = _ =>
  import(
    /* webpackChunkName: "sidemenu-layout" */ '@/views/layout/sidemenu-layout.vue'
  )
const Overview = _ =>
  import(
    /* webpackChunkName: "quality-overview" */ '@/views/asset/quality/overview/index.vue'
  )
const Datasource = _ =>
  import(
    /* webpackChunkName: "quality-data-source" */ '@/views/asset/quality/data-source/index.vue'
  )
const DataTable = _ =>
  import(
    /* webpackChunkName: "quality-data-table" */ '@/views/asset/quality/data-table/index.vue'
  )
const RealTime = _ =>
  import(
    /* webpackChunkName: "quality-real-time" */ '@/views/asset/quality/real-time/index.vue'
  )
const Record = _ =>
  import(
    /* webpackChunkName: "quality-record" */ '@/views/asset/quality/record/index.vue'
  )

export default [
  {
    path: '/asset/quality',
    name: 'quality',
    meta: {
      name: '质量',
      sideMenu: true,
      href: '/asset/quality'
    },
    redirect: '/asset/quality/survey',
    component: Layout,
    children: [
      {
        path: '/asset/quality/survey',
        name: 'survey',
        meta: {
          name: '质量概况',
          jump: false
        },
        redirect: '/asset/quality/survey/overview',
        component: WrapperView,
        children: [
          {
            path: '/asset/quality/survey/overview',
            name: 'overview',
            meta: {
              name: '全局概况',
              icon: 'iconfont icon-quanjugaikuang'
            },
            component: Overview
          }
        ]
      },
      {
        path: '/asset/quality/quality-manage',
        name: 'quality-manage',
        meta: {
          name: '质量管理',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/quality/quality-manage/data-table',
            name: 'data-table',
            meta: {
              name: '数据表规则',
              icon: 'iconfont icon-zhiliangguize'
            },
            component: DataTable
          },
          {
            path: '/asset/quality/quality-manage/data-source',
            name: 'data-source',
            meta: {
              name: '数据源规则',
              icon: 'iconfont icon-zhiliangguize'
            },
            component: Datasource
          },
          {
            path: '/asset/quality/quality-manage/real-time',
            name: 'real-time',
            meta: {
              name: '实时元表规则',
              icon: 'iconfont icon-zhiliangguize'
            },
            component: RealTime
          },
          {
            path: '/asset/quality/quality-manage/record',
            name: 'record',
            meta: {
              name: '校验记录',
              icon: 'iconfont icon-xiaoyanjilu'
            },
            component: Record
          }
        ]
      }
    ]
  }
]
