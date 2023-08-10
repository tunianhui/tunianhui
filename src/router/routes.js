/*
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-07-28 17:39:31
 * @LastEditTime: 2023-07-27 14:37:58
 * @Description:
 */
import Layout from '@/views/layout'
import rd from './rd'
import asset from './asset/'
import plan from './plan'
import management from './management/index'
import server from './server'
import noticeCenter from './notice-center'
import tag from './tag/index'

const Home = _ =>
  import(/* webpackChunkName: "home" */ '@/views/home/index.vue')
const ExreactInitialize = _ =>
  import(/* webpackChunkName: "exreact-initialize" */ '@/views/rd/exreact/initialize/index.vue')
const Welcome = _ => 
  import(/* webpackChunkName: "home" */ '@/views/layout/welcome.vue')
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
export default [
  {
    path: '/',
    name: 'index',
    meta: {
      hideInMenu: true
    },
    // redirect: '/home',
    redirect: '/welcome',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          name: '首页',
          icon: 'iconfont icon-phonemenuhome6464',
          headMenu: true,
        },
        component: Home
      },
      rd,
      asset,
      plan,
      management,
      server,
      noticeCenter,
      {
        path: '/exreact/initialize',
        name: 'exreact-initialize',
        meta: {
          name: '萃取初始化',
          hideInMenu: true
        },
        component: ExreactInitialize
      },
      tag
    ]
  },
  {
    path: '/welcome',
    name: 'welcome',
    meta: {
      hideInMenu: true,
    },
    component: Welcome
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: _ =>
      import(
        /* webpackChunkName: "error-page-401" */ '@/views/error-page/401.vue'
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
        /* webpackChunkName: "error-page-500" */ '@/views/error-page/500.vue'
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
        /* webpackChunkName: "error-page-404" */ '@/views/error-page/404.vue'
      )
  },
  {
    path: '/ruleLog',
    name: 'ruleLog',
    meta: {
      name: '规则日志',
      hideInMenu: true,
      href: '/ruleLog'
    },
    component: _ =>
      import(
        /* webpackChunkName: "ruleLog-log" */ '@/views/asset/standard-new/assess/rule/log.vue'
      )
  }
]
