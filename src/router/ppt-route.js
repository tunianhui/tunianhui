import Layout from '@/views/layout'
// import plan from './plan'
import server from './server'
const WrapperView = {
  render: c => c('router-view')
}
const SidemenuLayout = _ =>
  import(
    /* webpackChunkName: "sidemenu-layout" */
    '@/views/layout/sidemenu-layout.vue'
  )
const ProjectManage = _ =>
  import(
    /* webpackChunkName: "project-manage" */
    '@/views/plan/project-manage/index.vue'
  )
const PhysicalDatasource = _ =>
  import(
    /* webpackChunkName: "physical-datasource" */
    '@/views/plan/physical-datasource/index.vue'
  )

const User = _ => import(/* webpackChunkName: "User" */ '@/views/management/user/index.vue')

const Home = _ =>
  import(/* webpackChunkName: "home" */ '@/views/home/index.vue')

/**
 * meta除了原生参数外可配置的参数:
 * meta: {
 *   name: 页面上菜单显示的内
 *         显示在侧边栏和标签栏的文字
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在菜单标签导航处显示的图标
 *  href: URL地址,在新标签页中打开该网址
 *  headMenu: 设为true，子路由在头部显示
 *  sideMenu: 设为true，子路由在左侧显示
 *  jump: false // 路由是否可以跳转，组件中做全等（===）判断，不能跳转，加上jump:  false即可
 * }
 */
export default [{
  path: '/',
  name: 'index',
  meta: {
    hideInMenu: true
  },
  redirect: '/home',
  component: Layout,
  children: [{
    path: '/home',
    name: 'home',
    meta: {
      name: '首页',
      icon: 'iconfont icon-phonemenuhome6464',
      headMenu: true
    },
    component: Home
  },
  {
    path: '/plan',
    name: 'plan',
    meta: {
      name: '规划',
      icon: 'iconfont icon-guihua',
      sideMenu: true
    },
    component: SidemenuLayout,
    redirect: '/plan/project-manage',
    children: [{
      path: '/plan/project',
      name: 'project',
      meta: {
        name: '项目',
        jump: false
      },
      component: WrapperView,
      children: [{
        path: '/plan/project-manage',
        name: 'project-manage',
        meta: {
          name: '项目管理',
          icon: 'iconfont icon-xiangmu'
        },
        component: ProjectManage
      }]
    },
    {
      path: '/plan/datasource',
      name: 'datasource',
      meta: {
        name: '数据源',
        jump: false
      },
      component: WrapperView,
      children: [{
        path: '/plan/physical-datasource',
        name: 'physical-datasource',
        meta: {
          name: '物理数据源',
          icon: 'iconfont icon-quanbu1'
        },
        component: PhysicalDatasource
      }]
    }
    ]
  },
  {
    path: '/management',
    name: 'management',
    meta: {
      name: '管理中心',
      icon: 'iconfont icon-guihua',
      sideMenu: true
    },
    component: SidemenuLayout,
    redirect: '/management/user',
    children: [{
      path: '/management/usermanage',
      name: 'usermanage',
      meta: {
        name: '账号管理',
        jump: false
      },
      component: WrapperView,
      children: [{
        path: '/management/user',
        name: 'user',
        meta: {
          name: '成员管理',
          icon: 'iconfont icon-guanliyuan1'
        },
        component: User
      }]
    }]
  },
  server
  ]
},
{
  path: '/401',
  name: 'error_401',
  meta: {
    hideInMenu: true
  },
  component: _ =>
      import(
        /* webpackChunkName: "error-page-401" */
        '@/views/error-page/401.vue'
      )
},
{
  path: '/500',
  name: 'error_500',
  meta: {
    hideInMenu: true
  },
  component: _ =>
      import(
        /* webpackChunkName: "error-page-500" */
        '@/views/error-page/500.vue'
      )
},
{
  path: '*',
  name: 'error_404',
  meta: {
    hideInMenu: true
  },
  component: _ =>
      import(
        /* webpackChunkName: "error-page-404" */
        '@/views/error-page/404.vue'
      )
}
]
