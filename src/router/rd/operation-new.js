/*
 * @Author: 大炸鹅
 * @Date: 2023-04-17 12:00:54
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-11 15:05:47
 * @FilePath: \智能数据构建\src\router\rd\operation-new.js
 */
import Layout from '@/views/rd/operation-new/layout/index.vue'
const WrapperView = {render: c => c('router-view')}
export default {
  path: '/rd/operation-new',
  name: 'operation-new',
  meta: {
    name: '运维',
    icon: 'iconfont icon-yunwei',
    sideMenu: true
  },
  component: Layout,
  redirect: '/rd/operation-new/operation-large-market/example-statistics',
  children: [
    {
      path: '/rd/operation-new/operation-large-market',
      name: 'operation-large-market',
      meta: {
        name: '运维大盘',
        jump: false
      },
      component: WrapperView,
      children: [
        {
          path: '/rd/operation-new/operation-large-market/example-statistics',
          name: 'example-statistics',
          meta: {
            name: '实例统计',
            icon: 'iconfont icon-shilitongji'
          },
          component: () => import(/* webpackChunkName: "example-statistics" */ '@/views/rd/operation-new/pages/example-statistics/index.vue')
        },
        {
          path: '/rd/operation-new/operation-large-market/error-statistics',
          name: 'error-statistics',
          meta: {
            name: '异常统计',
            icon: 'iconfont icon-yichangtongji'
          },
          component: () => import(/* webpackChunkName: "error-statistics" */ '@/views/rd/operation-new/pages/error-statistics/index.vue')
        }
      ]
    },
    {
      path: '/rd/operation-new/task-operation',
      name: 'task-operation',
      meta: {
        name: '任务运维',
        jump: false
      },
      component: WrapperView,
      children: [
        {
          path: '/rd/operation-new/task-operation/cycle-task',
          name: 'cycle-task',
          meta: {
            name: '周期任务',
            icon: 'iconfont icon-zhouqirenwu4'
          },
          component: () => import(/* webpackChunkName: "cycle-task" */ '@/views/rd/operation-new/pages/cycle-task/index.vue')
        },
        {
          path: '/rd/operation-new/task-operation/hand-task',
          name: 'hand-task',
          meta: {
            name: '手动任务',
            icon: 'iconfont icon-shoudongrenwu2'
          },
          component: () => import(/* webpackChunkName: "hand-task" */ '@/views/rd/operation-new/pages/hand-task/index.vue')
        },
        {
          path: '/rd/operation-new/task-operation/real-time-task',
          name: 'real-time-task',
          meta: {
            name: '实时任务',
            icon: 'iconfont icon-shishirenwu'
          },
          component: () => import(/* webpackChunkName: "real-time-task" */ '@/views/rd/operation-new/pages/real-time-task/index.vue')
        },
      ]
    },
    {
      path: '/rd/operation-new/task-operation',
      name: 'example-operation',
      meta: {
        name: '实例运维',
        jump: false
      },
      component: WrapperView,
      children: [
        {
          path: '/rd/operation-new/example-operation/baseline-example',
          name: 'baseline-example',
          meta: {
            name: '基线实例',
            icon: 'iconfont icon-jixianshili'
          },
          component: () => import(/* webpackChunkName: "baseline-example" */ '@/views/rd/operation-new/pages/baseline-example/index.vue')
        },
        {
          path: '/rd/operation-new/example-operation/cycle-example',
          name: 'cycle-example',
          meta: {
            name: '周期实例',
            icon: 'iconfont icon-zhouqishili1'
          },
          component: () => import(/* webpackChunkName: "cycle-example" */ '@/views/rd/operation-new/pages/cycle-example/index.vue')
        },
        {
          path: '/rd/operation-new/task-operation/record-example',
          name: 'record-example',
          meta: {
            name: '补数据实例',
            icon: 'iconfont icon-bushujushili'
          },
          component: () => import(/* webpackChunkName: "record-example" */ '@/views/rd/operation-new/pages/record-example/index.vue')
        },
        {
          path: '/rd/operation-new/task-operation/hand-example',
          name: 'hand-example',
          meta: {
            name: '手动实例',
            icon: 'iconfont icon-shoudongshili1'
          },
          component: () => import(/* webpackChunkName: "hand-example" */ '@/views/rd/operation-new/pages/hand-example/index.vue')
        },
        {
          path: '/rd/operation-new/task-operation/real-time-example',
          name: 'real-time-example',
          meta: {
            name: '实时实例',
            icon: 'iconfont icon-shishishili'
          },
          component: () => import(/* webpackChunkName: "real-time-example" */ '@/views/rd/operation-new/pages/real-time-example/index.vue')
        }
      ]
    },
    {
      path: '/rd/operation-new/monitoring-alarm',
      name: 'monitoring-alarm',
      meta: {
        name: '监控报警',
        jump: false
      },
      component: WrapperView,
      children: [
        {
          path: '/rd/operation-new/monitoring-alarm/baseline-monitor',
          name: 'baseline-monitor',
          meta: {
            name: '基线监控',
            icon: 'iconfont icon-jixianjiankong'
          },
          component: () => import(/* webpackChunkName: "baseline-monitor" */ '@/views/rd/operation-new/pages/baseline-monitor/index.vue')
        },
        {
          path: '/rd/operation-new/monitoring-alarm/offline-monitoring-config',
          name: 'offline-monitoring-config',
          meta: {
            name: '离线监控配置',
            icon: 'iconfont icon-a-N42x'
          },
          component: () => import(/* webpackChunkName: "offline-monitoring-config" */ '@/views/rd/operation-new/pages/offline-monitoring-config/index.vue')
        },
        {
          path: '/rd/operation-new/task-operation/real-time-monitoring-config',
          name: 'real-time-monitoring-config',
          meta: {
            name: '实时监控配置',
            icon: 'iconfont icon-shishijiankong'
          },
          component: () => import(/* webpackChunkName: "real-time-monitoring-config" */ '@/views/rd/operation-new/pages/real-time-monitoring-config/index.vue')
        }
      ]
    }
  ]
}