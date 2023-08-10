const WrapperView = {render: c => c('router-view')}
const Layout = _ =>
  import(
    /* webpackChunkName: "sidemenu-layout" */ '@/views/layout/sidemenu-layout.vue'
  )
const SourceAnalyze = _ =>
  import(
    /* webpackChunkName: 'source-analyze' */ '@/views/asset/govern/source-manage/source-analyze'
  )
// const SourceAnalyze = _ =>
//   import(
//     /* webpackChunkName: 'source-analyze' */ '@/views/asset/govern'
//   )
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
const HiveTraceability = _ =>
  import(
    /* webpackChunkName: 'hivetraceability' */ '@/views/asset/govern/item-manage/hivetraceability'
  )
const IcebergTraceability = _ =>
  import(
    /* webpackChunkName: 'icebergtraceability' */ '@/views/asset/govern/item-manage/icebergtraceability'
  )
const HdfsTraceability = _ =>
  import(
    /* webpackChunkName: 'hdfstraceability' */ '@/views/asset/govern/item-manage/hdfstraceability'
  )
// const ItemManagementEdit = _ =>
//   import(
//     /* webpackChunkName: 'item-management-edit' */ '@/views/asset/govern/item-manage/icebergtraceability/edit'
//   )
const YarnQueue = _ =>
  import(
    /* webpackChunkName: 'item-manage-yarnqueue' */ '@/views/asset/govern/item-manage/yarnqueue'
  )
// const LaunchPTush = _ =>
//   import(
//     /* webpackChunkName: 'item-manage-launchPush' */ '@/views/asset/govern/item-manage/yarnqueue/launchPush'
//   )
const YarnTask = _ =>
  import(
    /* webpackChunkName: 'item-manage-yarntask' */ '@/views/asset/govern/item-manage/yarntask'
  )
const Trashlist = _ =>
  import(
    /* webpackChunkName: 'trashlist' */ '@/views/asset/govern/trash/trashlist'
  )
const tablePage = _ =>
  import(
    /* webpackChunkName: 'tablePage' */ '@/views/asset/govern/item-manage/icebergtraceability/tablePage'
  )



export default [
  {
    path: '/asset/govern',
    name: 'govern',
    meta: {
      name: '资源',
      sideMenu: true,
      href: '/asset/govern'
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
        ]
      },
      // 
      {
        path: '/asset/govern/configuration',
        name: 'configuration',
        meta: {
          name: '治理工作台',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/govern/configuration/project',
            name: 'project-govern',
            meta: {
              name: '治理项管理',
              icon: 'iconfont icon-yichulizhilixiang'
            },
            component: Project
          }
        ]
      },
      {
        path: '/asset/govern/item-manage',
        name: 'item-manage',
        meta: {
          name: '溯源管理',
          jump: false
        },
        component: WrapperView,
        children: [
          // {
          //   path: '/asset/govern/item-manage/hivetraceability',
          //   name: 'hivetraceability',
          //   meta: {
          //     name: 'hive溯源数据查询',
          //     icon: 'iconfont icon-yuanshujuzhuce'
          //   },
          //   component: HiveTraceability
          // },
          {
            path: '/asset/govern/item-manage/icebergtraceability',
            name: 'icebergtraceability',
            meta: {
              name: '表溯源数据查询',
              icon: 'iconfont icon-xiangmuzhili'
            },
            component: IcebergTraceability
          },
          // {
          //   path: '/asset/govern/item-manage/hdfstraceability',
          //   name: 'hdfstraceability',
          //   meta: {
          //     name: 'hdfs溯源数据查询',
          //     icon: 'iconfont icon-yunHDFS'
          //   },
          //   component: HdfsTraceability
          // },
          {
            path: '/asset/govern/item-manage/yarnqueue',
            name: 'yarnqueue',
            meta: {
              name: '队列溯源数据查询',
              icon: 'iconfont icon-yarn'
            },
            component: YarnQueue
          },
          {
            path: '/asset/govern/item-manage/yarntask',
            name: 'yarntask',
            meta: {
              name: '任务溯源数据查询',
              icon: 'iconfont icon-tuisongguanli'
            },
            component: YarnTask
          },
          {
            path: '',
            name: 'tablePage',
            meta: {
              name: '表详情页面',
            },
            component: tablePage
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
      },
      // {
      //     path: '/add',
      //     name: 'add',
      //     meta: {
      //       name: '资源'
      //     },
      //     component: add,
      //   }
    ]
  },
  // {
  //   path: '/asset/govern',
  //   name: 'govern',
  //   meta: {
  //     name: '资源',
  //     sideMenu: true
  //   },
  //   redirect: '/asset/govern/source-manage/source-analyze',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/asset/govern/source-manage',
  //       name: 'source-manage',
  //       meta: {
  //         name: '资源管理',
  //         jump: false
  //       },
  //       component: WrapperView,
  //       children: [
  //         {
  //           path: '/asset/govern/source-manage/source-analyze',
  //           name: 'source-analyze',
  //           meta: {
  //             name: '资源分析',
  //             icon: 'iconfont icon-zhilifangan'
  //           },
  //           component: SourceAnalyze
  //         }
  //       ]
  //     },
  //     {
  //       path: '/asset/govern/concept',
  //       name: 'concept',
  //       meta: {
  //         name: '治理概念',
  //         jump: false
  //       },
  //       component: WrapperView,
  //       children: [
  //         {
  //           path: '/asset/govern/concept/govern-analyze',
  //           name: 'govern-analyze',
  //           meta: {
  //             name: '治理分析',
  //             icon: 'iconfont icon-zhilifenxi'
  //           },
  //           component: GovernAnalyze
  //         },
  //         {
  //           path: '/asset/govern/concept/govern-effect',
  //           name: 'govern-effect',
  //           meta: {
  //             name: '治理效果',
  //             icon: 'iconfont icon-zhilixiaoguo'
  //           },
  //           component: GovernEffect
  //         }
  //       ]
  //     },
  //     {
  //       path: '/asset/govern/platform',
  //       name: 'platform',
  //       meta: {
  //         name: '治理工作台',
  //         jump: false
  //       },
  //       component: WrapperView,
  //       children: [
  //         {
  //           path: '/asset/govern/platform/self',
  //           name: 'self-govern',
  //           meta: {
  //             name: '我的治理',
  //             icon: 'iconfont icon-wodezhili'
  //           },
  //           component: Self
  //         },
  //         // {
  //         //   path: '/asset/govern/platform/project',
  //         //   name: 'project-govern',
  //         //   meta: {
  //         //     name: '项目治理',
  //         //     icon: 'iconfont icon-xiangmuzhili'
  //         //   },
  //         //   component: Project
  //         // }
  //       ]
  //     },
  //     {
  //       path: '/asset/govern/item-manage',
  //       name: 'item-manage',
  //       meta: {
  //         name: '溯源管理',
  //         jump: false
  //       },
  //       component: WrapperView,
  //       children: [
  //         // {
  //         //   path: '/asset/govern/item-manage/hivetraceability',
  //         //   name: 'hivetraceability',
  //         //   meta: {
  //         //     name: 'hive溯源数据查询',
  //         //     icon: 'iconfont icon-yuanshujuzhuce'
  //         //   },
  //         //   component: HiveTraceability
  //         // },
  //         {
  //           path: '/asset/govern/item-manage/icebergtraceability',
  //           name: 'icebergtraceability',
  //           meta: {
  //             name: '表溯源数据查询',
  //             icon: 'iconfont icon-xiangmuzhili'
  //           },
  //           component: IcebergTraceability
  //         },
  //         {
  //           path: '/asset/govern/item-manage/hdfstraceability',
  //           name: 'hdfstraceability',
  //           meta: {
  //             name: 'hdfs溯源数据查询',
  //             icon: 'iconfont icon-xiangmuzhili'
  //           },
  //           component: HdfsTraceability
  //         },
  //         {
  //           path: '/asset/govern/item-manage/yarnqueue',
  //           name: 'yarnqueue',
  //           meta: {
  //             name: 'yarn队列溯源数据查询',
  //             icon: 'iconfont icon-tuisongguanli'
  //           },
  //           component: YarnQueue
  //         },
  //         {
  //           path: '/asset/govern/item-manage/yarntask',
  //           name: 'yarntask',
  //           meta: {
  //             name: 'yarn任务溯源数据查询',
  //             icon: 'iconfont icon-tuisongguanli'
  //           },
  //           component: YarnTask
  //         }
  //       ]
  //       // children: [
  //       //   {
  //       //     path: '/asset/govern/item-manage/hivetraceability',
  //       //     name: 'hivetraceability',
  //       //     meta: {
  //       //       name: 'hive溯源数据查询',
  //       //       icon: 'iconfont icon-yuanshujuzhuce'
  //       //     },
  //       //     component: HiveTraceability
  //       //   },
  //       //   {
  //       //     path: '/asset/govern/item-manage/item-management',
  //       //     name: 'item-management',
  //       //     meta: {
  //       //       name: '治理项管理',
  //       //       icon: 'iconfont icon-xiangmuzhili'
  //       //     },
  //       //     component: ItemManagement
  //       //   },
  //       //   {
  //       //     path: '/asset/govern/item-manage/edit',
  //       //     name: 'item-manage-edit',
  //       //     meta: {
  //       //       name: '编辑治理项',
  //       //       icon: 'iconfont icon-xiangmuzhili'
  //       //       // hideInMenu: true
  //       //     },
  //       //     component: ItemManagementEdit
  //       //   },
  //       //   {
  //       //     path: '/asset/govern/item-manage/dispatch',
  //       //     name: 'dispatch-manage',
  //       //     meta: {
  //       //       name: '推送管理',
  //       //       icon: 'iconfont icon-tuisongguanli'
  //       //     },
  //       //     component: Dispatch
  //       //   },
  //       //   {
  //       //     path: '/asset/govern/item-manage/launchPush',
  //       //     name: 'launchPush',
  //       //     meta: {
  //       //       name: '发起推送',
  //       //       hideInMenu: true
  //       //     },
  //       //     component: LaunchPush
  //       //   },
  //       //   {
  //       //     path: '/asset/govern/item-manage/task',
  //       //     name: 'task-manage',
  //       //     meta: {
  //       //       name: '任务管理',
  //       //       icon: 'iconfont icon-liebiao4'
  //       //     },
  //       //     component: Task
  //       //   }
  //       // ]
  //     },
  //     {
  //       path: '/asset/govern/trash',
  //       name: 'trash',
  //       meta: {
  //         name: '回收站',
  //         jump: false
  //       },
  //       component: WrapperView,
  //       children: [
  //         {
  //           path: '/asset/govern/trash/trashlist',
  //           name: 'trashlist',
  //           meta: {
  //             name: '回收站列表',
  //             icon: 'iconfont icon-xingzhuang'
  //           },
  //           component: Trashlist
  //         }
  //       ]
  //     },{
  //       path: '/add',
  //       name: 'add',
  //       meta: {
  //         name: '资源'
  //       },
  //       component: add,
  //     }
  //   ]
  // }
]
