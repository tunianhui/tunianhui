/*
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2023-03-02 10:33:59
 * @LastEditTime: 2023-05-12 18:55:00
 * @Description:
 */
const WrapperView = {render: c => c('router-view')}

const Layout = _ =>
  import(
    /* webpackChunkName: "Layout" */ '@/views/asset/standard-new/layout.vue'
  )
const DataStandard = _ =>
  import(
    /* webpackChunkName: "dataStandard" */ '@/views/asset/standard-new/dataStandard/dataStandard'
  )

const StandardSet = _ =>
  import(
    /* webpackChunkName: "standardSet" */ '@/views/asset/standard-new/dataStandard/standardSet'
  )

const Rule = _ =>
  import(
    /* webpackChunkName: "rule" */ '@/views/asset/standard-new/assess/rule'
  )

const Code = _ =>
  import(
    /* webpackChunkName: "code" */ '@/views/asset/standard-new/reference/code'
  )

const Root = _ =>
  import(
    /* webpackChunkName: "root" */ '@/views/asset/standard-new/reference/root'
  )

const Catalogue = _ =>
  import(
    /* webpackChunkName: "catalogue" */ '@/views/asset/standard-new/platform-management/catalogue'
  )

const Attribute = _ =>
  import(
    /* webpackChunkName: "attribute" */ '@/views/asset/standard-new/platform-management/attribute'
  )

const template = _ =>
  import(
    /* webpackChunkName: "template" */ '@/views/asset/standard-new/platform-management/template'
  )

export default [
  {
    path: '/asset/standard-new',
    name: 'standard-new',
    meta: {
      name: '标准',
      sideMenu: true
    },
    redirect: '/asset/standard-new/dataStandard/dataStandard',
    component: Layout,
    children: [
      {
        path: '/asset/standard-new/dataStandard',
        name: 'data-standard',
        meta: {
          name: '数据标准',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/standard-new/dataStandard/dataStandard',
            name: 'data-standard',
            meta: {
              name: '数据标准',
              icon: 'iconfont icon-shujuyuanquanxian'
            },
            component: DataStandard
          },
          {
            path: '/asset/standard-new/dataStandard/standardSet',
            name: 'standard-set',
            meta: {
              name: '标准集',
              icon: 'iconfont icon-shujuyuanquanxian'
            },
            component: StandardSet
          }
        ]
      },
      {
        path: '/asset/standard-new/assess',
        name: 'assess',
        meta: {
          name: '落地评估',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/standard-new/assess/rule',
            name: 'rule',
            meta: {
              name: '落标映射规则',
              icon: 'iconfont icon-zhilifangan'
            },
            component: Rule
          }
        ]
      },
      {
        path: '/asset/standard-new/reference',
        name: 'reference',
        meta: {
          name: '参考数据',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/standard-new/reference/code',
            name: 'code',
            meta: {
              name: '标准代码(码表)',
              icon: 'iconfont icon-shujuyuanquanxian'
            },
            component: Code
          },
          {
            path: '/asset/standard-new/reference/root',
            name: 'root',
            meta: {
              name: '词根',
              icon: 'iconfont icon-shujuyuanquanxian'
            },
            component: Root
          }
        ]
      },
      {
        path: '/asset/standard-new/platform-management',
        name: 'platform-management',
        meta: {
          name: '平台管理',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/standard-new/platform-management/catalogue',
            name: 'catalogue',
            meta: {
              name: '标准集目录',
              icon: 'iconfont icon-zhilifangan'
            },
            component: Catalogue
          },
          {
            path: '/asset/standard-new/platform-management/attribute',
            name: 'attribute',
            meta: {
              name: '公共标准集属性',
              icon: 'iconfont icon-zhilifangan'
            },
            component: Attribute
          },
          {
            path: '/asset/standard-new/platform-management/template',
            name: 'template',
            meta: {
              name: '审批模板',
              icon: 'iconfont icon-zhilifangan'
            },
            component: template
          }
        ]
      }
    ]
  }
]
