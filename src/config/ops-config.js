import {taskRunningStatusIcon} from './dics'
export const statusMap = {
  success: {
    icon: `${taskRunningStatusIcon['success']} success`,
    label: '运行成功'
  },
  fail: {
    icon: `${taskRunningStatusIcon['fail']} error`,
    label: '运行失败'
  },
  running: {
    icon: `${taskRunningStatusIcon['running']} running`,
    label: '运行中'
  },
  waitRun: {
    icon: `${taskRunningStatusIcon['waitRun']} info`,
    label: '未运行'
  }
}

export const nodeMap = {
  vi: 'iconfont icon-Vi',
  sql: 'iconfont icon-MxSQL'
}

export const runStatus = {
  0: 'pause',
  1: 'recover'
}

const getLevelCommand = prefix =>
  Array.from({length: 6}, (d, i) => `${prefix}${i + 1}`)

export const parentCommand = getLevelCommand('p')
export const childCommand = getLevelCommand('c')

const parentLayers = [
  {label: '一层', command: 'p1'},
  {label: '二层', command: 'p2'},
  {label: '三层', command: 'p3'},
  {label: '四层', command: 'p4'},
  {label: '五层', command: 'p5'},
  {label: '六层', command: 'p6'}
]

const childLayers = [
  {label: '一层', command: 'c1'},
  {label: '二层', command: 'c2'},
  {label: '三层', command: 'c3'},
  {label: '四层', command: 'c4'},
  {label: '五层', command: 'c5'},
  {label: '六层', command: 'c6'}
]

const expandParent = {
  icon: 'iconfont icon-zhankaifujiedian',
  label: '展开父节点',
  children: parentLayers
}

const expandChild = {
  icon: 'iconfont icon-zhankaizijiedian',
  label: '展开子节点',
  children: childLayers
}

export const showOperateLog = {
  icon: 'iconfont icon-rizhi',
  label: '查看操作日志',
  command: 'showOperateLog'
}

export const modifyDutyOfficer = {
  icon: 'iconfont icon-zerenren',
  label: '修改责任人',
  command: 'modifyDutyOfficer'
}

export const addData = {
  icon: 'iconfont icon-bushuju',
  label: '补数据',
  command: 'addData'
}

// 分割线
const hr = {
  hr: true
}

const showRunLog = {
  icon: 'iconfont icon-run-log',
  label: '查看运行日志',
  command: 'showRunLog'
}

const showNodeCode = {
  icon: 'iconfont icon-chakanjiediandaima',
  label: '查看节点代码',
  command: 'showNodeCode'
}

const rerun = {
  icon: 'iconfont icon-zhongpao',
  label: '重跑',
  command: 'rerun'
}

const rerunDownstream = {
  icon: 'iconfont icon-zhongpaoxiayou',
  label: '重跑下游',
  command: 'rerunDownstream'
}

export const pause = {
  icon: 'iconfont icon-execute-',
  label: '暂停',
  command: 'pause'
}

export const recover = {
  icon: 'iconfont icon-zhongpaobinghuifutiaodu',
  label: '恢复',
  command: 'recover'
}

const showPeriodTask = {
  icon: 'iconfont icon-zhouqirenwu3',
  label: '查看周期任务',
  command: 'showPeriodTask'
}

const showInstance = {
  icon: 'iconfont icon-chakanshili',
  label: '查看实例',
  // command: 'showInstance',
  children: [
    {icon: '', label: '查看周期实例', command: 'showPeriodInstance'},
    {icon: '', label: '查看补数据实例', command: 'showAddDataInstance'}
  ]
}

const showDetail = {
  icon: 'iconfont icon-chakanshili',
  label: '详情',
  command: 'showDetail'
}

// 逻辑表任务菜单
export const logicInstanceMenu = [
  showRunLog,
  showNodeCode,
  rerun,
  showPeriodTask,
  showInstance
]

// 逻辑表实例菜单
export const logicTaskMenu = [
  showNodeCode,
  hr,
  showInstance,
  showPeriodTask,
  addData
]

// 虚拟节点菜单
export const vitualNodeMenu = [expandParent, expandChild, hr, showDetail]

// 任务菜单
export const taskMenu = [
  expandParent,
  expandChild,
  hr,
  showNodeCode,
  // showOperateLog,
  hr,
  showInstance,
  addData
]

// 实例菜单
export const instanceMenu = [
  expandParent,
  expandChild,
  hr,
  showRunLog,
  showNodeCode,
  // showOperateLog,
  hr,
  rerun,
  rerunDownstream,
  pause
]

export const instanceMenuNew = [
  showRunLog,
  showNodeCode,
  showOperateLog,
]
