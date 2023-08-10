/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 09:38:23
 * @LastEditTime: 2023-04-23 14:29:13
 * @Description:
 */
const WrapperView = {render: c => c('router-view')}
const Layout = _ =>
  import(
    /* webpackChunkName: "sidemenu-layout" */ '@/views/layout/sidemenu-layout.vue'
  )

const SecurityOverview = _ =>
  import(
    /* webpackChunkName: 'security-overview' */ '@/views/asset/security/security-platform/overview'
  )

const SecurityStrategy = _ =>
  import(
    /* webpackChunkName: 'security-strategy' */ '@/views/asset/security/security-platform/security-strategy'
  )

const IdentificationFeature = _ =>
  import(
    /* webpackChunkName: 'identification-feature' */ '@/views/asset/security/data-identification/feature'
  )

const IdentificationTemplate = _ =>
  import(
    /* webpackChunkName: 'identification-template' */ '@/views/asset/security/data-identification/templateManagement'
  )

const IdentificationRecord = _ =>
  import(
    /* webpackChunkName: 'identification-record' */ '@/views/asset/security/data-identification/record'
  )

const IdentificationAddition = _ =>
  import(
    /* webpackChunkName: 'identification-addition' */ '@/views/asset/security/data-identification/record/addition'
  )

const IdentificationTaskDetail = _ =>
  import(
    /* webpackChunkName: 'task-detail' */ '@/views/asset/security/data-identification/record/taskDetail'
  )

const IdentificationPlanning = _ =>
  import(
    /* webpackChunkName: 'identification-planning' */ '@/views/asset/security/data-identification/planning'
  )

const IdentificationCategory = _ =>
  import(
    /* webpackChunkName: 'identification-category' */ '@/views/asset/security/data-identification/category'
  )

const IdentificationLevel = _ =>
  import(
    /* webpackChunkName: 'identification-level' */ '@/views/asset/security/data-identification/level'
  )

const DesensitizationRule = _ =>
  import(
    /* webpackChunkName: 'rule' */ '@/views/asset/security/data-desensitization/rule'
  )

const DesensitizationAlgorithm = _ =>
  import(
    /* webpackChunkName: 'algorithm' */ '@/views/asset/security/data-desensitization/algorithm'
  )

const KeyManage = _ =>
  import(
    /* webpackChunkName: 'key-manage' */ '@/views/asset/security/data-desensitization/key-manage'
  )

export default [
  {
    path: '/asset/security',
    name: 'security',
    meta: {
      name: '安全',
      sideMenu: true
    },
    redirect: '/asset/security/security-platform/overview',
    component: Layout,
    children: [
      {
        path: '/asset/security/security-platform',
        name: 'security-platform',
        meta: {
          name: '安全工作台',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/security/security-platform/overview',
            name: 'security-overview',
            meta: {
              name: '安全概览',
              icon: 'iconfont icon-zhilifangan'
            },
            component: SecurityOverview
          },
          {
            path: '/asset/security/security-platform/security-strategy',
            name: 'security-strategy',
            meta: {
              name: '项目安全策略',
              icon: 'iconfont icon-shenqingjilu'
            },
            component: SecurityStrategy
          }
        ]
      },
      {
        path: '/asset/security/data-identification',
        name: 'data-identification',
        meta: {
          name: '数据识别',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/security/data-identification/feature',
            name: 'identification-feature',
            meta: {
              name: '识别特征',
              icon: 'iconfont icon-wodezhili'
            },
            component: IdentificationFeature
          },
          {
            path: '/asset/security/data-identification/template',
            name: 'identification-template',
            meta: {
              name: '模板管理',
              icon: 'iconfont icon-wodezhili'
            },
            component: IdentificationTemplate
          },
          {
            path: '/asset/security/data-identification/record',
            name: 'identification-record',
            meta: {
              name: '识别记录',
              icon: 'iconfont icon-wodezhili'
            },
            component: IdentificationRecord
          },
          {
            path: '/asset/security/data-identification/record/addittion',
            name: 'identification-addition',
            meta: {
              name: '手动添加',
              hideInMenu: true,
            },
            component: IdentificationAddition,
          },
          {
            path: '/asset/security/data-identification/taskDetail',
            name: 'identification-task-detail',
            meta: {
              name: '识别任务详情',
              icon: '',
              hideInMenu: true
            },
            component: IdentificationTaskDetail
          },
          {
            path: '/asset/security/data-identification/planning',
            name: 'identification-planning',
            meta: {
              name: '识别规则',
              icon: 'iconfont icon-xiangmuzhili'
            },
            component: IdentificationPlanning
          },
          {
            path: '/asset/security/data-identification/category',
            name: 'identification-category',
            meta: {
              name: '数据分类',
              icon: 'iconfont icon-liebiao4'
            },
            component: IdentificationCategory
          },
          {
            path: '/asset/security/data-identification/level',
            name: 'identification-level',
            meta: {
              name: '数据分级',
              icon: 'iconfont icon-xiangmuzhili'
            },
            component: IdentificationLevel
          }
        ]
      },
      {
        path: '/asset/security/data-desensitization',
        name: 'data-desensitization',
        meta: {
          name: '数据脱敏',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/security/data-desensitization/rule',
            name: 'desensitization-rule',
            meta: {
              name: '脱敏规则',
              icon: 'iconfont icon-yuanshujuzhuce'
            },
            component: DesensitizationRule
          },
          {
            path: '/asset/security/data-desensitization/algorithm',
            name: 'desensitization-algorithm',
            meta: {
              name: '脱敏算法',
              icon: 'iconfont icon-xiangmuzhili'
            },
            component: DesensitizationAlgorithm
          },
          {
            path: '/asset/security/data-desensitization/key-manage',
            name: 'desensitization-key',
            meta: {
              name: '密钥管理',
              icon: 'iconfont icon-shezhi1'
            },
            component: KeyManage
          }
        ]
      }
    ]
  }
]
