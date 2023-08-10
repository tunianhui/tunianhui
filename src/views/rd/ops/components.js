export default {
  OfflineAlarm: _ =>
    import(
      /* webpackChunkName: "alarm-monitor-offline-alarm" */ '@/views/rd/ops/alarm-monitor/offline/alarm/index.vue'
    ),
  OfflineMonitor: _ =>
    import(
      /* webpackChunkName: "alarm-monitor-offline-monitor" */ '@/views/rd/ops/alarm-monitor/offline/monitor/index.vue'
    ),
  Blank: _ =>
    import(
      /* webpackChunkName: "blank" */ '@/views/rd/ops/alarm-monitor/realtime/blank.vue'
    ),
  // Flow: _ => import(/* webpackChunkName: "g6-flow" */ '@c/g6-graph/index.vue')
  TaskPeriodGraph: _ =>
    import(
      /* webpackChunkName: "task-period-graph" */ '@/views/rd/ops/task/period/graph'
    ),
  InstancePeriodGraph: _ =>
    import(
      /* webpackChunkName: "instance-period-graph" */ '@/views/rd/ops/instance/period/graph'
    ),
  InstanceAddDataGraph: _ =>
    import(
      /* webpackChunkName: "instance-add-data-graph" */ '@/views/rd/ops/instance/add-data/graph'
    ),
  AddData: _ =>
    import(/* webpackChunkName: "add-data" */ '@/views/rd/ops/add-data'),
  RerunDownstream: _ =>
    import(
      /* webpackChunkName: "rerun-downstream" */ '@/views/rd/ops/rerun-downstream'
    ),
  OperatorLog: _ =>
    import(/* webpackChunkName: "operator-log" */ '@/views/rd/ops/operator-log')
}
