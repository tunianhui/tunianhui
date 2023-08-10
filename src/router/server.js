import {iconMap, types} from '@/config/server-config'

const WrapperView = {render: c => c('router-view')}

const Layout = _ =>
  import(
    /* webpackChunkName: "sidemenu-layout" */ '@/views/layout/sidemenu-layout.vue'
  )

const serverLayout = _ =>
  import(/* webpackChunkName: "server-layout" */ '@/views/server/index.js')

const ServerArrange = _ =>
  import(/* webpackChunkName: "Wellcome" */ '@/views/server/service-dev/arrange/index')

const ApiCreate = _ =>
  import(
    /* webpackChunkName: "api-create" */ '@/views/server/service-dev/api-create/index'
  )

const ApiRegister = _ =>
  import(
    /* webpackChunkName: "api-register" */ '@/views/server/service-dev/register/index'
  )

const Func = _ =>
  import(/* webpackChunkName: "func" */ '@/views/server/service-dev/func/index')

const Flow = _ =>
  import(/* webpackChunkName: "flow" */ '@/views/server/service-dev/flow/index')

const ServerUnit = _ =>
  import(
    /* webpackChunkName: "ServerUnit" */ '@/views/server/api-dev/unit/index'
  )
const APIDev = _ =>
  import(
    /* webpackChunkName: "APIDev" */ '@/views/server/api-dev/api-dev/index'
  )
const Create = _ =>
  import(
    /* webpackChunkName: "Create" */ '@/views/server/api-dev/api-dev/create.vue'
  )
const APIMarket = _ =>
  import(
    /* webpackChunkName: "APIMarket" */ '@/views/server/api-market/api-market/index.vue'
  )
const AppManage = _ =>
  import(
    /* webpackChunkName: "AppManage" */ '@/views/server/api-app/manage/index.vue'
  )
const ApiGrant = _ =>
  import(
    /* webpackChunkName: "ApiGrant" */ '@/views/server/api-app/grant/index.vue'
  )
const Group = _ =>
  import(/* webpackChunkName: "Group" */ '@/views/server/platform-manage/group')
const Overview = _ =>
  import(
    /* webpackChunkName: "Overview" */ '@/views/server/platform-manage/overview'
  )
const Member = _ =>
  import(
    /* webpackChunkName: "Member" */ '@/views/server/platform-manage/member'
  )
const Monitor = _ =>
  import(
    /* webpackChunkName: "Monitor" */ '@/views/server/platform-manage/monitor'
  )
// const ServerDev = _ =>
//   import(/* webpackChunkName: "ServeDev" */ '@/views/server/serve-dev/index')
const FlowMonitor = _ =>
  import(
    /* webpackChunkName: "FlowMonitor" */ '@/views/server/platform-manage/flow-monitor/index'
  )
export default {
  path: '/server',
  name: 'server',
  meta: {
    name: '服务',
    icon: 'iconfont icon-nav_icon_fuwuqiguanl',
    headMenu: true
  },
  component: WrapperView,
  redirect: '/server/dev',
  // redirect: '/server/api-dev',
  children: [
    {
      path: '/server/dev',
      name: 'dev',
      meta: {
        name: '服务开发',
        sideMenu: true
      },
      component: serverLayout, // 服务开发模块的layout与其他不同
      redirect: '/server/api-create',
      children: [
        {
          path: '/server/api-create',
          name: 'apiCreate', // name 小驼峰命名 格式有要求
          meta: {
            name: 'Api生成',
            icon: 'iconfont icon-APIshengcheng2'
          },
          component: ApiCreate
        },
        {
          path: '/server/api-register',
          name: 'register',
          meta: {
            name: 'Api注册',
            icon: 'iconfont icon-APIzhuce2'
          },
          component: ApiRegister
        },
        {
          path: '/server/func',
          name: 'func',
          meta: {
            name: '函数',
            icon: 'iconfont icon-hanshu3'
          },
          component: Func
        },
        {
          path: '/server/arrange',
          name: 'arrange',
          meta: {
            name: '服务编排',
            icon: 'iconfont icon-fuwubianpai1'
          },
          component: ServerArrange
        },
        {
          path: '/server/flow',
          name: 'flow',
          meta: {
            name: '业务流程',
            icon: 'iconfont icon-yewuliucheng'
          },
          component: Flow
        }
      ]
    },
    {
      path: '/server/api-dev',
      name: 'api-dev',
      meta: {
        name: 'API开发',
        sideMenu: true
      },
      redirect: '/server/api-dev/dev',
      component: Layout,
      children: [
        {
          path: '/server/api-dev/unit',
          name: 'unit',
          meta: {
            icon: 'iconfont icon-fuwudanyuan',
            name: '服务单元',
            hideInMenu: true
          },
          component: ServerUnit
        },
        {
          path: '/server/api-dev/dev',
          name: 'api-dev-sub',
          meta: {
            icon: 'iconfont icon-xiangmu',
            name: 'API开发'
          },
          component: APIDev
        },
        {
          path: '/server/api-dev/create',
          name: 'create-api',
          meta: {
            name: '创建API',
            icon: '',
            hideInMenu: true
          },
          component: Create
        }
      ]
    },
    {
      path: '/server/api-market',
      name: 'api-market',
      meta: {
        name: 'API市场',
        sideMenu: true
      },
      redirect: '/server/api-market/market',
      component: Layout,
      children: [
        {
          path: '/server/api-market/market',
          name: 'market',
          meta: {
            name: 'API市场'
          },
          component: APIMarket
        }
      ]
    },
    {
      path: '/server/api-app',
      name: 'api-app',
      meta: {
        name: 'API应用',
        sideMenu: true
      },
      redirect: '/server/api-app/manage',
      component: Layout,
      children: [
        {
          path: '/server/api-app/manage',
          name: 'app-manage',
          meta: {
            name: '应用管理',
            icon: 'iconfont icon-shujujianmo'
          },
          component: AppManage
        },
        {
          path: '/server/api-app/grant',
          name: 'api-grant',
          meta: {
            name: 'API授权',
            icon: 'iconfont icon-APIshouquan'
          },
          component: ApiGrant
        }
      ]
    },
    {
      path: '/server/platform-manage',
      name: 'platform-manage',
      meta: {
        name: '平台管理',
        sideMenu: true
      },
      redirect: '/server/platform-manage/group',
      component: Layout,
      children: [
        {
          path: '/server/platform-manage/group',
          name: 'platform-manage-group',
          meta: {
            name: '分组',
            icon: 'iconfont icon-zu'
          },
          component: Group
        },
        {
          path: '/server/platform-manage/overview',
          name: 'platform-manage-overview',
          meta: {
            name: '运维大盘',
            icon: 'iconfont icon-zu'
          },
          component: Overview
        },
        {
          path: '/server/platform-manage/member',
          name: 'platform-manage-member',
          meta: {
            name: '成员管理',
            icon: 'iconfont icon-chengyuanguanli',
            hideInMenu: true
          },
          component: Member
        },
        {
          path: '/server/platform-manage/monitor',
          name: 'platform-manage-monitor',
          meta: {
            name: '监控运维',
            icon: 'iconfont icon-jiankong'
          },
          component: Monitor
        },
        {
          path: '/server/platform-manage/flow-monitor',
          name: 'platform-manage-flow-monitor',
          meta: {
            name: '编排监控',
            icon: 'iconfont icon-jiankong'
          },
          component: FlowMonitor
        }
      ]
    }
  ]
}
