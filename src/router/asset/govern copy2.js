const WrapperView = {render: c => c('router-view')}
const Layout = _ =>
  import(
    /* webpackChunkName: "sidemenu-layout" */ '@/views/layout/sidemenu-layout.vue'
  )
const SourceAnalyze = _ =>
  import(
    /* webpackChunkName: 'source-analyze' */ '@/views/asset/govern/source-manage/source-analyze'
  )
const GovernAnalyze = _ =>
  import(
    /* webpackChunkName: 'govern-analyze' */ '@/views/asset/govern/concept/govern-analyze'
  )
const GovernEffect = _ =>
  import(
    /* webpackChunkName: 'govern-effect' */ '@/views/asset/govern/concept/govern-effect'
  )
const Self = _ =>
  import(
    /* webpackChunkName: 'platform-self' */ '@/views/asset/govern/platform/self'
  )
const Project = _ =>
  import(
    /* webpackChunkName: 'platform-project' */ '@/views/asset/govern/platform/project'
  )
const Metadata = _ =>
  import(
    /* webpackChunkName: 'metadata' */ '@/views/asset/govern/item-manage/metadata'
  )
const ItemManagement = _ =>
  import(
    /* webpackChunkName: 'item-management' */ '@/views/asset/govern/item-manage/item-management'
  )
const ItemManagementEdit = _ =>
  import(
    /* webpackChunkName: 'item-management-edit' */ '@/views/asset/govern/item-manage/item-management/edit'
  )
const Dispatch = _ =>
  import(
    /* webpackChunkName: 'item-manage-dispatch' */ '@/views/asset/govern/item-manage/dispatch'
  )
const LaunchPush = _ =>
  import(
    /* webpackChunkName: 'item-manage-launchPush' */ '@/views/asset/govern/item-manage/dispatch/launchPush'
  )
const Task = _ =>
  import(
    /* webpackChunkName: 'item-manage-task' */ '@/views/asset/govern/item-manage/task'
  )
const Trashlist = _ =>
  import(
    /* webpackChunkName: 'trashlist' */ '@/views/asset/govern/trash/trashlist'
  )

export default [
  {
    path: '/asset/govern',
    name: 'govern',
    meta: {
      name: '资源',
      sideMenu: true
    },
    redirect: '/asset/govern/source-manage/source-analyze',
    component: Layout,
    children: [
      {
        path: '/asset/govern/source-manage',
        name: 'source-manage',
        meta: {
          name: '资源管理',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/govern/source-manage/source-analyze',
            name: 'source-analyze',
            meta: {
              name: '资源分析',
              icon: 'iconfont icon-zhilifangan'
            },
            component: SourceAnalyze
          }
        ]
      },
      {
        path: '/asset/govern/concept',
        name: 'concept',
        meta: {
          name: '治理概念',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/govern/concept/govern-analyze',
            name: 'govern-analyze',
            meta: {
              name: '治理分析',
              icon: 'iconfont icon-zhilifenxi'
            },
            component: GovernAnalyze
          },
          {
            path: '/asset/govern/concept/govern-effect',
            name: 'govern-effect',
            meta: {
              name: '治理效果',
              icon: 'iconfont icon-zhilixiaoguo'
            },
            component: GovernEffect
          }
        ]
      },
      {
        path: '/asset/govern/platform',
        name: 'platform',
        meta: {
          name: '治理工作台',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/govern/platform/self',
            name: 'self-govern',
            meta: {
              name: '我的治理',
              icon: 'iconfont icon-wodezhili'
            },
            component: Self
          },
          {
            path: '/asset/govern/platform/project',
            name: 'project-govern',
            meta: {
              name: '项目治理',
              icon: 'iconfont icon-xiangmuzhili'
            },
            component: Project
          }
        ]
      },
      {
        path: '/asset/govern/item-manage',
        name: 'item-manage',
        meta: {
          name: '治理项管理',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/govern/item-manage/metadata',
            name: 'metadata',
            meta: {
              name: '元数据注册',
              icon: 'iconfont icon-yuanshujuzhuce'
            },
            component: Metadata
          },
          {
            path: '/asset/govern/item-manage/item-management',
            name: 'item-management',
            meta: {
              name: '治理项管理',
              icon: 'iconfont icon-xiangmuzhili'
            },
            component: ItemManagement
          },
          {
            path: '/asset/govern/item-manage/edit',
            name: 'item-manage-edit',
            meta: {
              name: '编辑治理项',
              hideInMenu: true
            },
            component: ItemManagementEdit
          },
          {
            path: '/asset/govern/item-manage/dispatch',
            name: 'dispatch-manage',
            meta: {
              name: '推送管理',
              icon: 'iconfont icon-tuisongguanli'
            },
            component: Dispatch
          },
          {
            path: '/asset/govern/item-manage/launchPush',
            name: 'launchPush',
            meta: {
              name: '发起推送',
              hideInMenu: true
            },
            component: LaunchPush
          },
          {
            path: '/asset/govern/item-manage/task',
            name: 'task-manage',
            meta: {
              name: '任务管理',
              icon: 'iconfont icon-liebiao4'
            },
            component: Task
          }
        ]
      },
      {
        path: '/asset/govern/trash',
        name: 'trash',
        meta: {
          name: '回收站',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/govern/trash/trashlist',
            name: 'trashlist',
            meta: {
              name: '回收站列表',
              icon: 'iconfont icon-xingzhuang'
            },
            component: Trashlist
          }
        ]
      }
    ]
  }
]
