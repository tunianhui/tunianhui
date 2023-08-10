/*
 * @Author: 大炸鹅
 * @Date: 2023-06-08 14:05:27
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-13 16:26:07
 * @FilePath: \智能数据构建\src\views\rd\operation-new\component\flow\config.js
 */
import {instanceMenuNew} from '@/config/ops-config'
export const nodeWidth = 230
export const nodeHeight = 48

export const edgeAttrs = {
  line: {
    stroke: '#A2B1C3',
    strokeWidth: 1,
    targetMarker: {
      name: 'block',
      width: 12,
      height: 8,
    },
    strokeDasharray: 0, // 0 表示实线
    style: {
      animation: 'act-line 30s infinite linear',
      'z-index': 1,
      'pointer-events': 'none',
    }
  }
}

export const nodeTyps = {
  SQL: 'SQL',
  SHELL: 'SHELL',
  SUB_PROCESS: 'SUB_PROCESS',
  PROCEDURE: 'PROCEDURE',
  PYTHON: 'PYTHON',
  DEPENDENT: 'DEPENDENT',
  HTTP: 'HTTP',
  CONDITIONS: 'CONDITIONS',
  SWITCH: 'SWITCH',
  K8S: 'K8S',
  MLFLOW: 'MLFLOW',
  Pytorch: 'Pytorch',
  CHUNJUN: 'CHUNJUN',
  Spark: 'Spark',
  Flink: 'Flink',
  HIVECLI: 'HIVECLI',
}

export const icons = {
  [nodeTyps.SQL]: 'iconfont icon-MxSQL',
  [nodeTyps.SHELL]: 'iconfont icon-Shell',
  [nodeTyps.PYTHON]: 'iconfont icon-Python',
  [nodeTyps.Flink]: 'iconfont icon-Flink_SQL',

  [nodeTyps.SUB_PROCESS]: 'iconfont icon-shujuyuanquanxianguanli',
  [nodeTyps.PROCEDURE]: 'iconfont icon-PROCEDURE',
  [nodeTyps.DEPENDENT]: 'iconfont icon-DEPENDENT',
  [nodeTyps.HTTP]: 'iconfont icon-HTTP',
  [nodeTyps.CONDITIONS]: 'iconfont icon-Conditions',
  [nodeTyps.SWITCH]: 'iconfont icon-SWITCH',
  [nodeTyps.K8S]: 'iconfont icon-K8S',
  [nodeTyps.MLFLOW]: 'iconfont icon-MLFLOW',
  [nodeTyps.Pytorch]: 'iconfont icon-Pytorch',
  [nodeTyps.CHUNJUN]: 'iconfont icon-CHUNJUN',
  [nodeTyps.Spark]: 'iconfont icon-Spark',
  [nodeTyps.HIVECLI]: 'iconfont icon-HIVECLI',
}

export const nodeStatus = {
  '0': '未运行',
  '1': '运行中',
  '3': '暂停',
  '5': '停止',
  '6': '失败',
  '7': '成功',
}

export const nodeStatusColors = {
  '0': '#9b9b9b',
  '1': '#A186FF',
  '3': '#FFB100',
  '5': '#9b9b9b',
  '6': '#FF4D4F',
  '7': '#4FB079',
  default: '#52619B',
}

export const nodeStatusIcon = {
  '0': 'iconfont icon-weikaiqi',
  '1': 'iconfont icon-wait',
  '3': 'iconfont execute',
  '5': 'iconfont zhongzhi',
  '6': 'el-icon-error',
  '7': 'iconfont icon-yikaiqi',
}

export const nodeColors = {
  [nodeTyps.SQL]: '#4FB079',
  [nodeTyps.SHELL]: '#4FB079',
  [nodeTyps.SUB_PROCESS]: '#4FB079',
  [nodeTyps.PROCEDURE]: '#4FB079',
  [nodeTyps.PYTHON]: '#4FB079',
  [nodeTyps.DEPENDENT]: '#4FB079',
  [nodeTyps.HTTP]: '#4FB079',
  [nodeTyps.CONDITIONS]: '#4FB079',
  [nodeTyps.SWITCH]: '#4FB079',
  [nodeTyps.K8S]: '#4FB079',
  [nodeTyps.MLFLOW]: '#4FB079',
  [nodeTyps.Pytorch]: '#4FB079',
  [nodeTyps.CHUNJUN]: '#4FB079',
  [nodeTyps.Spark]: '#4FB079',
  [nodeTyps.Flink]: '#4FB079',
  [nodeTyps.HIVECLI]: '#4FB079',
}

export const pageColors = {
  cycleExample: '#4FB079',
  cycleTask: '#4FB079',
}

export const isRound = {
  [nodeTyps.SQL]: false,
  [nodeTyps.SHELL]: false,
  [nodeTyps.SUB_PROCESS]: false,
  [nodeTyps.PROCEDURE]: false,
  [nodeTyps.PYTHON]: false,
  [nodeTyps.DEPENDENT]: false,
  [nodeTyps.HTTP]: false,
  [nodeTyps.CONDITIONS]: false,
  [nodeTyps.SWITCH]: false,
  [nodeTyps.K8S]: false,
  [nodeTyps.MLFLOW]: false,
  [nodeTyps.Pytorch]: false,
  [nodeTyps.CHUNJUN]: false,
  [nodeTyps.Spark]: false,
  [nodeTyps.Flink]: false,
  [nodeTyps.HIVECLI]: false,
}

export const pageTypeMenu = {
  cycleInstance: instanceMenuNew, // 周期实例
  cycle: instanceMenuNew, // 周期任务
  manual: instanceMenuNew, // 手动任务
  manualInstance: instanceMenuNew, // 手动实例
}