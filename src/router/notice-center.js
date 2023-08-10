/*
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2022-08-19 09:53:45
 * @LastEditTime: 2023-07-20 11:18:29
 * @Description:
 */
const WrapperView = {render: c => c('router-view')}
const Layout = _ =>
  import(
    /* webpackChunkName: "notice-center-layout" */ '@/views/notice-center/index.js'
  )

const msgCenter = _ =>
  import(/* webpackChunkName: "msg-center" */ '@/views/notice-center/msg-center/index.vue')

const taskCenter = _ =>
  import(/* webpackChunkName: "task-center" */ '@/views/notice-center/task-center/index.vue')

export default {
  path: '/notice-center',
  name: 'notice-center',
  meta: {
    name: '通知中心',
    icon: 'iconfont icon-nav_icon_fuwuqiguanl',
    sideMenu: true
  },
  redirect: '/notice-center/msg-center',
  component: Layout,
  children: [
    {
      path: '/notice-center/msg',
      name: 'msg',
      meta: {
        name: '消息',
        jump: false
      },
      component: WrapperView,
      children: [
        {
          path: '/notice-center/msg-center',
          name: 'msg-center',
          meta: {
            name: '消息中心',
            icon: 'iconfont icon-icon1'
          },
          component: msgCenter
        }
      ]
    },
    {
      path: '/notice-center/task',
      name: 'task',
      meta: {
        name: '任务',
        jump: false
      },
      component: WrapperView,
      children: [
        {
          path: '/notice-center/task-center',
          name: 'task-center',
          meta: {
            name: '任务中心',
            icon: 'iconfont icon-chakanshili'
          },
          component: taskCenter
        }
      ]
    }
  ]
}
