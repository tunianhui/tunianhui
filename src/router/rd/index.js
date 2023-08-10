/*
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2022-08-19 09:53:45
 * @LastEditTime: 2023-07-17 17:06:35
 * @Description:
 */
import dev from './dev'
// import exreact from './exreact'
import ops from './ops'
import publish from './publish'
import operationNew from './operation-new'

// import tag from './tag'

const WrapperView = {render: c => c('router-view')}

const TrialRun = _ =>
  import(
    /* webpackChunkName: "trial-run" */ '@/views/rd/dev/trial-run/index.vue'
  )

const OperationNewLog = _ =>
  import(
    /* webpackChunkName: "operation-new-log" */ '@/views/rd/operation-new/pages/log/index'
  )
export default {
  path: '/rd',
  name: 'rd',
  meta: {
    name: '研发',
    headMenu: true,
    icon: 'iconfont icon-yanfa'
  },
  redirect: '/rd/dev',
  component: WrapperView,
  children: [
    dev,
    // exreact,
    publish,
    ops,
    // tag,
    operationNew,
    {
      path: '/rd/trialRun',
      name: 'node-code',
      meta: {
        name: '节点代码',
        icon: '',
        hideInMenu: true
      },
      component: TrialRun
    },
    {
      path: '/rd/operation-new/operation-new-log',
      name: 'operation-new-log',
      meta: {
        name: '运维日志',
        hideInMenu: true
      },
      component: OperationNewLog
    }
  ]
}
