import {iconMap, types} from '@/config/rd-config'

const WrapperView = {render: c => c('router-view')}
// const Layout = _ => import(/* webpackChunkName: "DevLayout" */ '@/views/rd/layout/index.vue')
const Layout = _ =>
  import(/* webpackChunkName: "DevLayout" */ '@/views/rd/dev/index.js')

// 规范定义
const Dimension = _ =>
  import(
    /* webpackChunkName: "norm-define-dimension" */ '@/views/rd/dev/norm-modeling/norm-define/dimension/index.vue'
  )
const Fact = _ =>
  import(
    /* webpackChunkName: "norm-define-fact" */ '@/views/rd/dev/norm-modeling/norm-define/fact/index.vue'
  )
const Limit = _ =>
  import(
    /* webpackChunkName: "norm-define-limit" */ '@/views/rd/dev/norm-modeling/norm-define/limit/index.vue'
  )
const Atom = _ =>
  import(
    /* webpackChunkName: "norm-define-atom" */ '@/views/rd/dev/norm-modeling/norm-define/atom/index.vue'
  )
const Derive = _ =>
  import(
    /* webpackChunkName: "norm-define-derive" */ '@/views/rd/dev/norm-modeling/norm-define/derive/index.vue'
  )

// 数据建模
const DimensionTable = _ =>
  import(
    /* webpackChunkName: "modeling-dimension" */ '@/views/rd/dev/norm-modeling/modeling/dimension/index.vue'
  )
const FactTable = _ =>
  import(
    /* webpackChunkName: "modeling-fact" */ '@/views/rd/dev/norm-modeling/modeling/fact/index.vue'
  )
const PolymerTable = _ =>
  import(
    /* webpackChunkName: "modeling-polymer" */ '@/views/rd/dev/norm-modeling/modeling/polymer/index.vue'
  )

// 数据处理
const CodeTask = _ =>
  import(
    /* webpackChunkName: "data-process-code-task" */ '@/views/rd/dev/data-process/code-task/index.vue'
  )
const SyncTask = _ =>
  import(
    /* webpackChunkName: "data-process-sync-task" */ '@/views/rd/dev/data-process/sync-task/index.vue'
  )

// 计算任务
const ComputingTask = _ =>
  import(
    /* webpackChunkName: "data-process-computing-task" */ '@/views/rd/dev/data-process/computing-task/index.vue'
  )

const FuncManage = _ =>
  import(
    /* webpackChunkName: "data-process-func-manage" */ '@/views/rd/dev/data-process/func-manage/index.vue'
  )
const SourceManage = _ =>
  import(
    /* webpackChunkName: "data-process-source-manage" */ '@/views/rd/dev/data-process/source-manage/index.vue'
  )

// 即席查询
const AdSearch = _ =>
  import(
    /* webpackChunkName: "ad-search" */ '@/views/rd/dev/ad-search/index.vue'
  )
const TableManage = _ =>
import(
  /* webpackChunkName: "table-manage" */ '@/views/rd/dev/data-process/table-manage/index.vue'
)

export default {
  path: '/rd/dev',
  name: 'dev',
  meta: {
    name: '开发',
    href: '/rd/dev',
    sideMenu: true
  },
  component: Layout,
  redirect: '/rd/dev/norm-define/dimension',
  children: [
    {
      path: '/rd/dev/normmodeling',
      name: 'normmodeling',
      meta: {
        name: '规范建模'
      },
      component: WrapperView,
      redirect: '/rd/dev/norm-define/dimension',
      children: [
        {
          path: '/rd/dev/norm-define',
          name: 'norm-define',
          meta: {
            name: '规范定义',
            jump: false
          },
          component: WrapperView,
          redirect: '/rd/dev/norm-define/dimension',
          children: [
            {
              path: '/rd/dev/norm-define/dimension',
              name: types.DIMENSION,
              meta: {
                name: '维度',
                // icon: 'iconfont icon-dimension'
                ...iconMap[types.DIMENSION]
              },
              component: Dimension
            },
            {
              path: '/rd/dev/norm-define/fact',
              name: types.FACT,
              meta: {
                name: '业务过程',
                // icon: 'iconfont icon-tubiaoshangshengqushi'
                ...iconMap[types.FACT]
              },
              component: Fact
            },
            {
              path: '/rd/dev/norm-define/limit',
              name: types.LIMIT,
              meta: {
                name: '业务限定',
                // icon: 'iconfont icon-quanbu1'
                ...iconMap[types.LIMIT]
              },
              component: Limit
            },
            {
              path: '/rd/dev/norm-define/atom',
              name: types.ATOM,
              meta: {
                name: '原子指标',
                // icon: 'iconfont icon-yewuchangjing'
                ...iconMap[types.ATOM]
              },
              component: Atom
            },
            {
              path: '/rd/dev/norm-define/derive',
              name: types.DERIVE,
              meta: {
                name: '派生指标',
                // icon: 'iconfont icon-tubiao-zhexiantu'
                ...iconMap[types.DERIVE]
              },
              component: Derive
            }
          ]
        },
        {
          path: '/rd/dev/modeling',
          name: 'modeling',
          meta: {
            name: '数据建模',
            jump: false
          },
          component: WrapperView,
          redirect: '/rd/dev/modeling/dimension-table',
          children: [
            {
              path: '/rd/dev/modeling/dimension-table',
              name: types.DIMENSIONTABLE,
              meta: {
                name: '维度逻辑表',
                // icon: 'iconfont icon-weiduluojibiao1'
                ...iconMap[types.DIMENSIONTABLE]
              },
              component: DimensionTable
            },
            {
              path: '/rd/dev/modeling/fact-table',
              name: types.FACTTABLE,
              meta: {
                name: '事实逻辑表',
                // icon: 'iconfont icon-shishiluojibiao2'
                ...iconMap[types.FACTTABLE]
              },
              component: FactTable
            },
            {
              path: '/rd/dev/modeling/polymer-table',
              name: types.POLYMERTABLE,
              meta: {
                name: '汇总逻辑表',
                // icon: 'iconfont icon-huizongluojibiao2'
                ...iconMap[types.POLYMERTABLE]
              },
              component: PolymerTable
            }
          ]
        },
        {
          path: '/rd/dev/data-process',
          name: 'data-process',
          meta: {
            name: '数据处理',
            jump: false
          },
          component: WrapperView,
          redirect: '/rd/dev/data-process/code-task',
          children: [
            {
              path: '/rd/dev/data-process/table-task',
              name: types.TABLEMANAGE,
              meta: {
                name: '表管理',
                // icon: 'iconfont icon-code'
                ...iconMap[types.TABLEMANAGE]
              },
              component: TableManage
            },
            {
              path: '/rd/dev/data-process/code-task',
              name: types.CODETASK,
              meta: {
                name: '代码任务',
                // icon: 'iconfont icon-code'
                ...iconMap[types.CODETASK]
              },
              component: CodeTask
            },
            // {
            //   path: '/rd/dev/data-process/sync-task',
            //   name: types.SYNCTASK,
            //   meta: {
            //     name: '同步任务',
            //     // icon: 'iconfont icon-tongbu'
            //     ...iconMap[types.SYNCTASK]
            //   },
            //   component: SyncTask
            // },
            {
              path: '/rd/dev/data-process/func-manage',
              name: types.FUNCMANAGE,
              meta: {
                name: '函数管理',
                // icon: 'iconfont icon-hanshu1'
                ...iconMap[types.FUNCMANAGE]
              },
              component: FuncManage
            },
            {
              path: '/rd/dev/data-process/source-manage',
              name: types.SOURCEMANAGE,
              meta: {
                name: '资源管理',
                // icon: 'iconfont icon-ziyuan3'
                ...iconMap[types.SOURCEMANAGE]
              },
              component: SourceManage
            },
            {
              path: '/rd/dev/data-process/computing-task',
              name: 'computingTask',
              meta: {
                name: '计算任务',
                icon: 'iconfont icon-tubiao-zhexiantu'
              },
              component: ComputingTask
            }
          ]
        },
        {
          path: '/rd/dev/ad-search',
          name: 'ad-search',
          meta: {
            name: '即席查询',
            jump: false
          },
          component: WrapperView,
          redirect: '/rd/dev/ad-search',
          children: [
            {
              path: '/rd/dev/ad-search',
              name: 'ad-search',
              meta: {
                name: '即席查询',
                ...iconMap[types.ADSEARCH]
              },
              component: AdSearch
            }
          ]
        }
      ]
    }
  ]
}
