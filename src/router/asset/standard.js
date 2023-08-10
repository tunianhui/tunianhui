import {iconMap, types} from '@/config/asset-config'
const WrapperView = {
  render: c => c('router-view')
}
const Layout = _ =>
  import(/* webpackChunkName: "DevLayout" */ '@/views/asset/standard/index.js')

// 标准管理
const Criterion = _ =>
  import(/* webpackChunkName: "define-criterion" */ '@/views/asset/standard/manage/define/criterion/index.vue')
const Category = _ =>
  import(/* webpackChunkName: "define-category" */ '@/views/asset/standard/manage/define/category/index.vue')
const Dict = _ =>
  import(/* webpackChunkName: "define-dict" */ '@/views/asset/standard/manage/define/dict/index.vue')
const Regular = _ =>
  import(/* webpackChunkName: "mapping-regular" */ '@/views/asset/standard/manage/mapping/regular/index.vue')
const Metadata = _ =>
  import(/* webpackChunkName: "through-metadata" */ '@/views/asset/standard/manage/through/metadata/index.vue')

// 版本管理
const EditionLayout = _ =>
  import(/* webpackChunkName: "edition-layout" */ '@/views/asset/standard/edition/index.vue')
// const ReleaseWaiting = _ =>
//   import(/* webpackChunkName: "release-waiting" */ '@/views/asset/standard/edition/release/waiting/index.vue')
// const ReleasePublish = _ =>
//   import(/* webpackChunkName: "release-publish" */ '@/views/asset/standard/edition/release/publish/index.vue')
// const ManageCurrent = _ =>
//   import(/* webpackChunkName: "manage-current" */ '@/views/asset/standard/edition/manage/current/index.vue')
// const ManageHistory = _ =>
//   import(/* webpackChunkName: "manage-history" */ '@/views/asset/standard/edition/manage/history/index.vue')

export default {
  path: '/asset/standard',
  name: 'standard',
  meta: {
    name: '标准',
    href: '/asset/standard',
    sideMenu: true
  },
  component: Layout,
  redirect: '/asset/standard/manage/define/criterion',
  children: [
    {
      path: '/asset/standard/manage',
      name: 'manage',
      meta: {
        name: '标准管理'
      },
      component: WrapperView,
      redirect: '/asset/standard/manage/define/criterion',
      children: [
        {
          path: '/asset/standard/manage/define',
          name: 'define',
          meta: {
            name: '标准定义',
            jump: false
          },
          component: WrapperView,
          redirect: '/asset/standard/manage/define/criterion',
          children: [
            {
              path: '/asset/standard/manage/define/criterion',
              name: types.CRITERION,
              meta: {
                name: '标准定义',
                ...iconMap[types.CRITERION]
              },
              component: Criterion
            },
            {
              path: '/asset/standard/manage/define/category',
              name: types.CATEGORY,
              meta: {
                name: '类目定义',
                ...iconMap[types.CATEGORY]
              },
              component: Category
            },
            {
              path: '/asset/standard/manage/define/dict',
              name: types.DICT,
              meta: {
                name: '字典定义',
                ...iconMap[types.DICT]
              },
              component: Dict
            }
          ]
        },
        {
          path: '/asset/standard/manage/mapping',
          name: 'mapping',
          meta: {
            name: '标准映射',
            jump: false
          },
          component: WrapperView,
          children: [
            {
              path: '/asset/standard/manage/mapping/regular',
              name: types.REGULAR,
              meta: {
                name: '规则映射',
                ...iconMap[types.REGULAR]
              },
              component: Regular
            }
          ]
        },
        {
          path: '/asset/standard/manage/through',
          name: 'through',
          meta: {
            name: '贯标',
            jump: false
          },
          component: WrapperView,
          children: [
            {
              path: '/asset/standard/manage/through/metadata',
              name: types.METADATA,
              meta: {
                name: '元数据映射',
                ...iconMap[types.METADATA]
              },
              component: Metadata
            }
          ]
        }
      ]
    },
    {
      path: '/asset/standard/edition',
      name: 'edition',
      meta: {
        name: '版本管理'
      },
      component: EditionLayout
      // component: WrapperView,
      // redirect: '/asset/standard/edition/release',
      // children: [
      //   {
      //     path: '/asset/standard/edition/release',
      //     name: 'release',
      //     meta: {
      //       name: '标准发布',
      //       jump: false
      //     },
      //     component: WrapperView,
      //     redirect: '/asset/standard/edition/release/waiting',
      //     children: [
      //       {
      //         path: '/asset/standard/edition/release/waiting',
      //         name: 'waiting',
      //         meta: {
      //           name: '待发布对象',
      //           icon: 'iconfont icon-zhiliangguize'
      //         },
      //         component: ReleaseWaiting
      //       },
      //       {
      //         path: '/asset/standard/edition/release/publish',
      //         name: 'publish',
      //         meta: {
      //           name: '发布记录',
      //           icon: 'iconfont icon-zhiliangguize'
      //         },
      //         component: ReleasePublish
      //       }
      //     ]
      //   },
      //   {
      //     path: '/asset/standard/edition/manage',
      //     name: 'manage',
      //     meta: {
      //       name: '版本管理',
      //       jump: false
      //     },
      //     component: WrapperView,
      //     children: [
      //       {
      //         path: '/asset/standard/edition/manage/curr',
      //         name: 'curr',
      //         meta: {
      //           name: '当前版本',
      //           icon: 'iconfont icon-zhiliangguize'
      //         },
      //         component: ManageCurrent
      //       },
      //       {
      //         path: '/asset/standard/edition/manage/his',
      //         name: 'his',
      //         meta: {
      //           name: '历史版本',
      //           icon: 'iconfont icon-zhiliangguize'
      //         },
      //         component: ManageHistory
      //       }
      //     ]
      //   }
      // ]
    }
  ]
}
