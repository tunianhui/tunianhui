import {textSize} from '@/libs/dom'
import {statusMap, runStatus} from '@/config/ops-config'

/* eslint-disable */

export const width = 220
export const height = 60
const paddingx = 23,
  iconSize = 16,
  labelSize = 14,
  borderWidth = 2,
  iconMargin = 8,
  mainTagHeight = 14,
  mainTagWidth = 32,
  mainTagTrangleWidth = 5,
  selectedBorderWidth = 3,
  labelWidth = width - paddingx * 2 - iconSize

export const colors = {
  success: '#2BC048',
  fail: '#ca435b',
  info: '#9b9b9b',
  active: '#52619b',
  labelColor: '#000',
  moreColor: '#777',
  bg: '#fff',
  selectedBg: '#dbe1f6'
}

const labelColor = '#000',
  moreColor = '#777',
  primaryBackground = '#fff',
  iconColor = '#52619b',
  nodeStatus = {
    default: {
      primary: '#52619b',
      background: '#dbe1f6'
    },
    success: {
      primary: '#2BC048',
      background: '#edf7f1'
    },
    fail: {
      primary: '#ca435b',
      background: '#ffe8eb'
    },
    waitRun: {
      primary: '#c3c3c3',
      background: '#f2f2f2'
    },
    running: {
      primary: '#A286FF',
      background: '#f2f2f2'
    }
  }

const priorityMap = {
  2: '高优先级',
  5: '中等优先级'
}

const operatorTypeMap = {
  10: 'sh',
  15: 'dx',
  25: 'sql',
  999: 'vi'
}

export const iconUnicodeMap = {
  sql: '\ue703',
  vi: '\ue680',
  sh: '\ue681',
  dx: '\ue795'
}

export class Node {
  constructor(data) {
    const {instance_status, run_Duration} = data
    if (instance_status) {
      const {label, icon} = statusMap[instance_status]
      this.statusLabel = label
      this.statusIcon = icon
    }
    if (run_Duration) {
      this.duration = data.run_Duration
      this.excuteTime = `${data.start_date} 至 ${data.end_date}`
    } else {
      this.duration = '--'
      this.excuteTime = '--'
    }
    this.id = data.id
    this.cids = data.cids
    this.pids = data.pids
    this.cube_id = data.cube_id
    this.job_id = data.job_id
    this.instance_id = data.instance_id
    this.name = data.cube_code
    this.cube_name = data.cube_name
    this.project_name = data.project_name
    this.oper_user = data.oper_user
    this.priority = priorityMap[data.priority]
    this.desc = data.desc
    // this.operatorType = data.operatorType
    this.operatorType = 25
    this.updateTime = data.create_time
    this.icon = iconUnicodeMap[operatorTypeMap[25]]
    this.style = nodeStatus[instance_status] || nodeStatus.default
    this.runStatus = runStatus[data.status]
    this.isMain = data.isMain
  }
}

export const registerNodeConfig = {
  draw(cfg, group) {
    // 节点最好以节点的宽高的中点为中心，从左上角开始画，所以所有的shape都要加上-width/2 ，-height/2
    // 这样使用drage的布局时，才不会出现连线的位置出现错乱
    const shape = group.addShape('rect', {
      attrs: {
        // x: 0,
        // y: 0,
        x: -width / 2,
        y: -height / 2,
        width,
        height,
        lineWidth: borderWidth,
        stroke: cfg.style.primary,
        fill: primaryBackground,
        cursor: 'pointer'
      },
      className: 'rect'
    })

    group.addShape('text', {
      attrs: {
        x: -width / 2 + paddingx,
        y: -height / 2 + (height - iconSize) / 2,
        // x: paddingx,
        // y: (height - iconSize) / 2,
        fontSize: iconSize,
        fontFamily: 'iconfont',
        fill: iconColor,
        text: cfg.icon,
        // textAlign: 'center',
        textBaseline: 'top',
        cursor: 'pointer'
      },
      className: 'icon'
    })

    group.addShape('text', {
      attrs: {
        x: -width / 2 + (paddingx + iconSize + iconMargin),
        y: -height / 2 + (height - labelSize) / 2,
        // x: paddingx + iconSize + iconMargin,
        // y: (height - labelSize) / 2,
        textBaseline: 'top',
        fill: labelColor,
        fontSize: labelSize,
        text: fittingString(cfg.name, labelWidth, labelSize),
        cursor: 'pointer'
      },
      className: 'label'
    })

    // 更多
    group.addShape('text', {
      attrs: {
        // x: width - labelSize - iconMargin / 2,
        // y: iconMargin,
        x: -width / 2 + width - labelSize - iconMargin / 2,
        y: -height / 2 + iconMargin,
        fontFamily: 'element-icons',
        fill: moreColor,
        text: '\ue794',
        textBaseline: 'middle',
        cursor: 'pointer'
      },
      className: 'more'
    })

    if (cfg.isMain) {
      group.addShape('polygon', {
        attrs: {
          points: [
            // [0, 0],
            // [0, mainTagHeight],
            // [mainTagWidth + mainTagTrangleWidth, mainTagHeight],
            // [mainTagWidth, 0]
            [-width / 2, -height / 2],
            [-width / 2, -height / 2 + mainTagHeight],
            [
              -width / 2 + mainTagWidth + mainTagTrangleWidth,
              -height / 2 + mainTagHeight
            ],
            [-width / 2 + mainTagWidth, -height / 2]
          ],
          fill: cfg.style.primary,
          cursor: 'pointer'
        },
        className: 'main-polygon'
      })
      const main = group.addShape('text', {
        attrs: {
          x: -width / 2 + 2,
          y: -height / 2 + (mainTagHeight * 0.8) / 2 - 4,
          // x: 2,
          // y: mainTagHeight / 2 + 1,
          fill: primaryBackground,
          text: 'Main',
          fontSize: 12,
          textBaseline: 'middle',
          cursor: 'pointer'
        },
        className: 'main-text'
      })
      main.scale(1, 0.8)
    }
    return shape
  },
  getAnchorPoints(cfg, group) {
    const inputAchorPoints = computedAnchorPoints(cfg.pids.length).map(step => [
      step,
      0
    ])
    return [
      // [0.5, 0],
      ...(inputAchorPoints.length ? inputAchorPoints : [[0.5, 0]]),
      [0.5, 1]
      // ...computedAnchorPoints(cfg.cids.length).map(step => [step, 1])
    ]
  },
  setState(name, value, item) {
    const group = item.getContainer(),
      keyShape = group.findByClassName('rect'),
      model = item.getModel()
    // children = group.get('children')
    // console.log(children.map(shape => shape.get('className')))
    // 这里的keyShape是draw里面的 keyShape
    // const keyShape = item.getKeyShape()
    if (name === 'selected') {
      const bgColor = value ? model.style.background : primaryBackground,
        lineWidth = value ? selectedBorderWidth : borderWidth
      keyShape.attr('fill', bgColor)
      keyShape.attr('lineWidth', lineWidth)
    }
  }
}

/**
 * 计算显示的字符串
 * @param {string} str 要裁剪的字符串
 * @param {number} maxWidth 最大宽度
 * @param {number} fontSize 字体大小
 */
function fittingString(str, maxWidth, fontSize) {
  const {width} = textSize(str, fontSize)
  if (width > maxWidth) {
    const len = (maxWidth / width) * str.length
    str = str.substring(0, Math.floor(len - 2)) + '...'
  }

  return str
}

function computedAnchorPoints(count) {
  const step = 0.8 / (count + 1)
  return Array.from({length: count}, (d, i) => (i + 1) * step + 0.1)
}
