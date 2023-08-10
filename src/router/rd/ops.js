const WrapperView = {render: c => c('router-view')}
const Layout = _ =>
  import(/* webpackChunkName: "DevLayout" */ '@/views/rd/ops/index.vue')

const TaskPeriod = _ =>
  import(
    /* webpackChunkName: "task-period" */ '@/views/rd/ops/task/period/index.vue'
  )
// const TaskManual = _ =>
//   import(/* webpackChunkName: "task-manual" */ '@/views/rd/ops/task/manual/index.vue')

const InstancePeriod = _ =>
  import(
    /* webpackChunkName: "instance-period" */ '@/views/rd/ops/instance/period/index.vue'
  )
// const InstanceManual = _ =>
//   import(/* webpackChunkName: "instance-manual" */ '@/views/rd/ops/instance/manual/index.vue')
const InstanceAddData = _ =>
  import(
    /* webpackChunkName: "instance-add-data" */ '@/views/rd/ops/instance/add-data/index.vue'
  )

// const LogicTask = _ =>
//   import(/* webpackChunkName: "logic-task" */ '@/views/rd/ops/logic/task/index.vue')
// const LogicInstance = _ =>
//   import(/* webpackChunkName: "logic-instance" */ '@/views/rd/ops/logic/instance/index.vue')

const OfflineLayout = _ =>
  import(
    /* webpackChunkName: "offline-layout" */ '@/views/rd/ops/alarm-monitor/offline/index.vue'
  )
const RealtimeLayout = _ =>
  import(
    /* webpackChunkName: "realtime-layout" */ '@/views/rd/ops/alarm-monitor/realtime/index.vue'
  )

const NodeCode = _ =>
  import(/* webpackChunkName: "node-code" */ '@/views/rd/ops/node-code.vue')
const RunLog = _ =>
  import(/* webpackChunkName: "run-log" */ '@/views/rd/ops/run-log.vue')

export default {
  path: '/rd/ops',
  name: 'ops',
  meta: {
    name: '调度',
    href: '/rd/ops',
    sideMenu: true
  },
  component: Layout,
  redirect: '/rd/ops/task/period',
  children: [
    {
      path: '/rd/ops/whole',
      name: 'ops-whole',
      meta: {
        name: '全局运维',
        jump: false
      },
      component: WrapperView,
      redirect: '/rd/ops/task/period',
      children: [
        {
          path: '/rd/ops/task',
          name: 'whole-task',
          meta: {
            name: '任务',
            jump: false
          },
          redirect: '/rd/ops/task/period',
          component: WrapperView,
          children: [
            {
              path: '/rd/ops/task/period',
              name: 'task-period',
              meta: {
                name: '周期任务',
                icon: 'iconfont icon-zhouqirenwu1'
              },
              component: TaskPeriod
            }
            // {
            //   path: '/rd/ops/task/manual',
            //   name: 'task-manual',
            //   meta: {
            //     name: '手动任务',
            //     icon: 'iconfont icon-shoudongrenwu1'
            //   },
            //   component: TaskManual
            // }
          ]
        },
        {
          path: '/rd/ops/instance',
          name: 'whole-instance',
          meta: {
            name: '实例',
            jump: false
          },
          component: WrapperView,
          children: [
            {
              path: '/rd/ops/instance/period',
              name: 'instance-period',
              meta: {
                name: '周期实例',
                icon: 'iconfont icon-zhouqishili'
              },
              component: InstancePeriod
            },
            // {
            //   path: '/rd/ops/instance/manual',
            //   name: 'instance-manual',
            //   meta: {
            //     name: '手动实例',
            //     icon: 'iconfont icon-shoudongshili'
            //   },
            //   component: InstanceManual
            // },
            {
              path: '/rd/ops/instance/add-data',
              name: 'instance-add-data',
              meta: {
                name: '补数据实例',
                icon: 'iconfont icon-zhouqirenwu2'
              },
              component: InstanceAddData
            }
          ]
        }
      ]
    },
    // {
    //   path: '/rd/ops/logic',
    //   name: 'ops-logic',
    //   meta: {
    //     name: '逻辑表运维',
    //     jump: false
    //   },
    //   component: WrapperView,
    //   redirect: '/rd/ops/logic/task',
    //   children: [
    //     {
    //       path: '/rd/ops/logic-task',
    //       name: 'ops-logic-task',
    //       meta: {
    //         name: '任务',
    //         jump: false
    //       },
    //       redirect: '/rd/ops/logic/task',
    //       component: WrapperView,
    //       children: [
    //         {
    //           path: '/rd/ops/logic/task',
    //           name: 'logic-task',
    //           meta: {
    //             name: '逻辑表任务',
    //             icon: 'iconfont icon-luojibiaorenwu'
    //           },
    //           component: LogicTask
    //         }
    //       ]
    //     },
    //     {
    //       path: '/rd/ops/logic-instance',
    //       name: 'ops-logic-instance',
    //       meta: {
    //         name: '实例',
    //         jump: false
    //       },
    //       redirect: '/rd/ops/logic/instance',
    //       component: WrapperView,
    //       children: [
    //         {
    //           path: '/rd/ops/logic/instance',
    //           name: 'logic-instance',
    //           meta: {
    //             name: '逻辑表实例',
    //             icon: 'iconfont icon-luojibiaoshili'
    //           },
    //           component: LogicInstance
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      path: '/rd/ops/alarm-monitor',
      name: 'alarm-monitor',
      meta: {
        name: '监控报警',
        jump: false
      },
      component: WrapperView,
      redirect: '/rd/ops/alarm-monitor/offline-record',
      children: [
        {
          path: '/rd/ops/alarm-monitor/offline',
          name: 'alarm-monitor-offline',
          meta: {
            name: '离线',
            jump: false
          },
          component: WrapperView,
          redirect: '/rd/ops/alarm-monitor/offline-record',
          children: [
            {
              path: '/rd/ops/alarm-monitor/offline-record',
              name: 'offline-record',
              meta: {
                name: '离线监控告警',
                icon: 'iconfont icon-warning'
              },
              component: OfflineLayout
            }
          ]
        }, {
          path: '/rd/ops/alarm-monitor/realtime',
          name: 'alarm-monitor-realtime',
          meta: {
            name: '实时',
            jump: false
          },
          component: WrapperView,
          redirect: '/rd/ops/alarm-monitor/realtime-record',
          children: [
            {
              path: '/rd/ops/alarm-monitor/realtime-record',
              name: 'realtime-record',
              meta: {
                name: '实时监控告警',
                icon: 'iconfont icon-lishibanben'
              },
              component: RealtimeLayout
            }
          ]
        }
        // {
        //   path: '/rd/ops/alarm-monitor/record',
        //   name: 'alarm-monitor-record',
        //   meta: {
        //     name: '报警记录',
        //     jump: false
        //   },
        //   component: WrapperView,
        //   redirect: '/rd/ops/alarm-monitor/alarm-record',
        //   children: [
        //     {
        //       path: '/rd/ops/alarm-monitor/alarm-record',
        //       name: 'alarm-record',
        //       meta: {
        //         name: '任务报警记录',
        //         icon: 'iconfont icon-baojingjiluguanli'
        //       },
        //       // component: Alarm
        //       component: AlarmMonitorLayout
        //     }
        //   ]
        // },
        // {
        //   path: '/rd/ops/alarm-monitor/config',
        //   name: 'alarm-monitor-config',
        //   meta: {
        //     name: '监控配置',
        //     jump: false
        //   },
        //   component: WrapperView,
        //   redirect: '/rd/ops/alarm-monitor/monitor-config',
        //   children: [
        //     {
        //       path: '/rd/ops/alarm-monitor/monitor-config',
        //       name: 'monitor-config',
        //       meta: {
        //         name: '任务监控配置',
        //         icon: 'iconfont icon-jiankong1'
        //       },
        //       // component: Monitor
        //       component: AlarmMonitorLayout
        //     }
        //   ]
        // }
      ]
    },
    {
      path: '/rd/ops/node-code',
      name: 'node-code',
      meta: {
        name: '节点代码',
        icon: '',
        hideInMenu: true
      },
      component: NodeCode
    },
    {
      path: '/rd/ops/run-log',
      name: 'run-log',
      meta: {
        name: '运行日志',
        icon: '',
        hideInMenu: true
      },
      component: RunLog
    }
  ]
}
