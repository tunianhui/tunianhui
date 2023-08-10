const WrapperView = {render: c => c('router-view')}
const Layout = _ => import('@/views/layout/sidemenu-layout.vue')
// 基本标准
const Domain = _ => import('@/views/asset/standup/basic/domain')
const TermGroup = _ => import('@/views/asset/standup/basic/term-group')
const Term = _ => import('@/views/asset/standup/basic/term')
const Unit = _ => import('@/views/asset/standup/basic/unit')
// 业务标准
const DimensionGroup = _ => import('@/views/asset/standup/business/dimension-group')
const Dimension = _ => import('@/views/asset/standup/business/dimension')
const Indicator = _ => import('@/views/asset/standup/business/indicator')
const Condition = _ => import('@/views/asset/standup/business/condition')
const TableType = _ => import('@/views/asset/standup/business/table-type')
const DataLayer = _ => import('@/views/asset/standup/business/data-layer')

export default {
  path: '/asset/standup',
  name: 'standup',
  meta: {
    name: '元数据',
    href: '/asset/standup',
    sideMenu: true
  },
  component: Layout,
  redirect: '/asset/standup/basic/domain',
  children: [
    {
      path: '/asset/standup/basic',
      name: 'basic',
      meta: {
        name: '基本标准',
        jump: false // 是否可以跳转，组件中做全等（===）判断
      },
      component: WrapperView,
      children: [
        {
          path: '/asset/standup/basic/domain',
          name: 'domain',
          meta: {
            name: '业务域',
            icon: 'iconfont icon-quanbu1'
          },
          component: Domain
        },
        {
          path: '/asset/standup/basic/term-group',
          name: 'domain',
          meta: {
            name: '术语组',
            icon: 'iconfont icon-quanbu1'
          },
          component: TermGroup
        },
        {
          path: '/asset/standup/basic/term',
          name: 'domain',
          meta: {
            name: '术语',
            icon: 'iconfont icon-quanbu1'
          },
          component: Term
        },
        {
          path: '/asset/standup/basic/unit',
          name: 'domain',
          meta: {
            name: '单位',
            icon: 'iconfont icon-quanbu1'
          },
          component: Unit
        }
      ]
    },
    {
      path: '/asset/standup/business',
      name: 'business',
      meta: {
        name: '业务标准',
        jump: false // 是否可以跳转，组件中做全等（===）判断
      },
      component: WrapperView,
      children: [
        {
          path: '/asset/standup/business/dimension-group',
          name: 'dimension-group',
          meta: {
            name: '维度组',
            icon: 'iconfont icon-quanbu1'
          },
          component: DimensionGroup
        },
        {
          path: '/asset/standup/business/dimension',
          name: 'dimension',
          meta: {
            name: '维度',
            icon: 'iconfont icon-quanbu1'
          },
          component: Dimension
        },
        {
          path: '/asset/standup/business/indicator',
          name: 'indicator',
          meta: {
            name: '指标',
            icon: 'iconfont icon-quanbu1'
          },
          component: Indicator
        },
        {
          path: '/asset/standup/business/condition',
          name: 'condition',
          meta: {
            name: '约束条件',
            icon: 'iconfont icon-quanbu1'
          },
          component: Condition
        },
        {
          path: '/asset/standup/business/table-type',
          name: 'table-type',
          meta: {
            name: '表类型',
            icon: 'iconfont icon-quanbu1'
          },
          component: TableType
        },
        {
          path: '/asset/standup/business/data-layer',
          name: 'data-layer',
          meta: {
            name: '数据层级',
            icon: 'iconfont icon-quanbu1'
          },
          component: DataLayer
        }
      ]
    }
  ]
}
