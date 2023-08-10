const WrapperView = {render: c => c('router-view')}
const Layout = _ =>
  import(
    /* webpackChunkName: "sidemenu-layout" */ '@/views/layout/sidemenu-layout.vue'
  )

const Business = _ =>
  import(/* webpackChunkName: "business" */ '@/views/plan/business/index.vue')
const DataArchitecture = _ =>
  import(/* webpackChunkName: "data-architecture" */ '@/views/plan/data-architecture/index.vue')
const WorkOrder = _ =>
import(/* webpackChunkName: "work-order" */ '@/views/plan/work-order/index.vue')
const PublicDefinition = _ =>
  import(
    /* webpackChunkName: "public-definition" */ '@/views/plan/public-definition/index.vue'
  )
const ProjectManage = _ =>
  import(
    /* webpackChunkName: "project-manage" */ '@/views/plan/project-manage/index.vue'
  )
const PhysicalDatasource = _ =>
  import(
    /* webpackChunkName: "physical-datasource" */ '@/views/plan/physical-datasource/index.vue'
  )
const ComputeEngine = _ =>
  import(
    /* webpackChunkName: "compute-engine" */ '@/views/plan/compute-engine/index.vue'
  )

export default {
  path: '/plan',
  name: 'plan',
  meta: {
    name: '规划',
    icon: 'iconfont icon-guihua',
    sideMenu: true
  },
  component: Layout,
  redirect: '/plan/DataArchitecture',
  children: [
    {
      path: '/plan/bus',
      name: 'bus',
      meta: {
        name: '业务',
        jump: false // 是否可以跳转，组件中做全等（===）判断
      },
      component: WrapperView,
      children: [
        {
          path: '/plan/DataArchitecture',
          name: 'data-architecture',
          meta: {
            name: '数据架构',
            icon: 'iconfont icon-yewuliu'
          },
          component: DataArchitecture
        },
        {
          path: '/plan/business',
          name: 'business',
          meta: {
            name: '业务板块',
            icon: 'iconfont icon-yewuliu'
          },
          component: Business
        },
        {
          path: '/plan/public-definition',
          name: 'public-definition',
          meta: {
            name: '公共定义',
            icon: 'iconfont icon-quanbu-copy'
          },
          component: PublicDefinition
        },
        // {
        //   path: '/plan/WorkOrder',
        //   name: 'work-order',
        //   meta: {
        //     name: '工单',
        //     icon: 'iconfont icon-yewuliu'
        //   },
        //   component: WorkOrder
        // },
      ]
    },
    {
      path: '/plan/work-order-management',
      name: 'work-order-management',
      meta: {
        name: '表设计工单管理',
        jump: false
      },
      component: WrapperView,
      children: [
        {
          path: '/plan/work-order',
          name: 'work-order',
          meta: {
            name: '与我相关',
            icon: 'iconfont icon-xiangmu'
          },
          component: WorkOrder
        }
      ]
    },
    {
      path: '/plan/project',
      name: 'project',
      meta: {
        name: '项目',
        jump: false
      },
      component: WrapperView,
      children: [
        {
          path: '/plan/project-manage',
          name: 'project-manage',
          meta: {
            name: '项目管理',
            icon: 'iconfont icon-xiangmu'
          },
          component: ProjectManage
        }
      ]
    },
    {
      path: '/plan/datasource',
      name: 'datasource',
      meta: {
        name: '数据源',
        jump: false
      },
      component: WrapperView,
      children: [
        {
          path: '/plan/physical-datasource',
          name: 'physical-datasource',
          meta: {
            name: '物理数据源',
            icon: 'iconfont icon-quanbu1'
          },
          component: PhysicalDatasource
        },
        {
          path: '/plan/compute-engine',
          name: 'compute-engine',
          meta: {
            name: '计算引擎源',
            icon: 'iconfont icon-engineoutline'
          },
          component: ComputeEngine
        }
      ]
    }
  ]
}
