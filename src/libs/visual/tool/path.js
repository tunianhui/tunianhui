// 图形技术的工具函数
import { getRect } from '@/libs/dom'
/**
 * 生成三次贝塞尔曲线的path，可直接作为在svg中path的d的值
 * @export
 * @param {*} x1 起始点x
 * @param {*} y1 起始点y
 * @param {*} x2 终止点x
 * @param {*} y2 终止点y
 * @param {number} [dx = (x2 - x1) / 2] // 控制x轴延伸，值越大，延伸越大
 * @param {*} [angle = 0] // 控制y轴延伸与弧度向上还是向下 正值弧度向上，反之弧度向下
 * @returns path
 */
export function bezierCurveTo(x1, y1, x2, y2, dx = (x2 - x1) / 2, angle = 0) {
  if (
    Math.abs(Math.floor(x1 - x2)) <= 1 ||
    Math.abs(Math.floor(y1 - y2)) <= 1
  ) {
    return `M ${x1} ${y1} ${x2} ${y2}`
  }
  const radian = (angle * Math.PI) / 180
  const dy = Math.tan(radian) * dx
  const cpx1 = x1 + dx
  const cpx2 = x2 - dx

  // const cpx1 = x1 + (x2 - x1) / 4
  // const cpx2 = x2 - (x2 - x1) / 4
  const cpy1 = y1 < y2 ? y1 - dy : y1 + dy
  const cpy2 = y1 < y2 ? y2 + dy : y2 - dy
  return `M ${x1} ${y1} C ${cpx1} ${cpy1} ${cpx2} ${cpy2} ${x2} ${y2}`
}

/**
 * getCornerPoint 返回一个给二次贝塞尔曲线使用的坐标点数组
 * @param {Array<Number>} start 起点坐标
 * @param {Number} radius 圆角半径
 * @param {String} direction 方向 ['top-left', 'bottom-left', 'top-right', 'bottom-right']
 * @return {Array} [控制点，结束点] 二次贝塞尔曲线使用
 */
export function getCornerPoint(start, radius, direction = 'top-right') {
  const [x, y] = start
  const points = []
  switch (direction) {
    case 'top-left':
      points.push(x, y + radius, x - radius, y + radius)
      break
    case 'bottom-left':
      points.push(x, y - radius, x - radius, y - radius)
      break
    case 'bottom-right':
      points.push(x, y - radius, x + radius, y - radius)
      break
    case 'top-right':
    default:
      points.push(x, y + radius, x + radius, y + radius)
      break
  }
}

/**
 * getCornerLinePath根据起点与终点获取有弧度的path路径
 * start 起点
 * end 终点
 * radius 圆角弧度的半径
 * dir 方向 起点向终点画线是从那个方向进入节点
 * left-top left-bottom left-right, left-left,
 * right-top right-bottom right-left, right-right
 * top-bottom top-left top-right, top-top
 * bottom-top bottom-left bottom-right, bottom-bottom
 * length 画拐角前的延伸长度 当起点的x(或y)与终点的x(或y)相同时 可选，默认为 0
 */
export function getCornerLinePath(start, end, radius, dir, length = 0) {
  const dirs = [
    'left-top',
    'left-bottom',
    'left-right',
    'right-top',
    'right-bottom',
    'right-left',
    'top-bottom',
    'top-left',
    'top-right',
    'bottom-top',
    'bottom-left',
    'bottom-right',
    'left-left',
    'right-right',
    'top-top',
    'bottom-bottom'
  ]
  if (!dirs.includes(dir)) {
    throw new Error(`参数dir 只能是${dirs.join(',')}中的一个`)
  }
  const [x0, y0] = start,
    [xn, yn] = end

  let path = `M ${x0} ${y0} `

  if (
    (x0 === xn && ['top-bottom', 'bottom-top'].includes(dir)) ||
    (y0 === yn && ['left-right', 'right-left'].includes(dir))
  ) {
    path += `L ${xn} ${yn}`
  } else {
    const [, d2] = dir.split('-')
    // 相同x 或 y，可能会有两个个拐角
    if (x0 === xn) {
      const xdelta = d2 === 'left' ? -1 : 1,
        ydelta = yn > y0 ? 1 : -1,
        x1 = x0 + (length + radius) * xdelta,
        gap = yn - y0 - radius * 2
      // 两个拐角
      if (gap > 0) {
        path += `L ${x0 + length * xdelta} ${y0} `
        // 第一个拐角
        path += `Q ${x1} ${y0} ${x1} ${ydelta * radius + y0} `
        // 拐角中间的线
        path += `L ${x1} ${yn - radius * ydelta} `
        // 第二个拐角
        path += `Q ${x1} ${yn} ${x0 + length * xdelta} ${yn} `
        path += `L ${xn} ${yn}`
      } else {
        radius = Math.abs(yn - y0)
        path += `Q ${x0 + radius * xdelta} ${y0 + radius * ydelta} ${xn} ${yn}`
      }
    } else if (y0 === yn) {
      // 同上
      const xdelta = xn > x0 ? 1 : -1,
        ydelta = d2 === 'top' ? -1 : 1,
        y1 = y0 + (length + radius) * ydelta,
        gap = xn - x0 - radius * 2

      // 两个拐角
      if (gap > 0) {
        path += `L ${x0} ${y0 + length * ydelta} `
        // 第一个拐角
        path += `Q ${x0} ${y1} ${x0 + xdelta * radius} ${y1} `
        // 拐角中间的线
        path += `L ${xn - xdelta * radius} ${y1} `
        // 第二个拐角
        path += `Q ${xn} ${y1} ${xn} ${y0 + length * ydelta} `
        path += `L ${xn} ${yn}`
      } else {
        radius = Math.abs(xn - x0)
        path += `Q ${x0 + radius * xdelta} ${y0 + radius * ydelta} ${xn} ${yn}`
      }
    } else {
      const xr = Math.abs(xn - x0),
        yr = Math.abs(yn - y0)
      if (xr < radius && yr < radius) {
        path += `Q ${xn}, ${y0} ${xn} ${yn}`
      } else {
        const xdelta = xn > x0 ? 1 : -1,
          ydelta = yn > y0 ? 1 : -1
        switch (d2) {
          // 从top来 yn > yo, 只需要考虑x轴
          case 'top':
          case 'bottom':
            if (xr < radius) {
              path += `Q ${xn} ${y0} ${xn} ${y0 + xr * ydelta} `
              path += `L ${xn} ${yn}`
            } else if (yr < 0) {
              path += `L ${xn + yr * xdelta} ${y0} `
              path += `Q ${xn} ${y0} ${xn} ${yn} `
            } else {
              path += `L ${xn - radius * xdelta} ${y0} `
              path += `Q ${xn} ${y0} ${xn} ${y0 + radius * ydelta} `
              path += `L ${xn} ${yn}`
            }
            break
          case 'left':
          case 'right':
            if (xr < radius) {
              path += `L ${x0} ${y0 + xr * ydelta} `
              path += `Q ${x0} ${yn} ${xn} ${yn}`
            } else if (yr < 0) {
              path += `Q ${x0} ${yn} ${x0 + yr * xdelta} ${yn} `
              path += `L ${xn} ${yn}`
            } else {
              path += `L ${x0} ${yn - radius * ydelta} `
              // + radius * xdelta
              path += `Q ${x0} ${yn} ${x0 + radius * xdelta} ${yn} `
              path += `L ${xn} ${yn}`
            }
            break
        }
      }
    }
  }

  return path
}

export function getPathPoints(path) {
  return path
    .split(' ')
    .filter(item => parseFloat(item))
    .reduce((prev, cur, index) => {
      const len = prev.length
      cur = parseFloat(cur)
      if (len) {
        prev[len - 1] && prev[len - 1].length < 2
          ? prev[len - 1].push(cur)
          : prev.push([cur])
      } else {
        prev.push([cur])
      }
      return prev
    }, [])
}

// 根据方向获取 DOM元素要连线的中间点
export function getCenterPoint(el, dir) {
  if (!el) return
  const { width, height, left, top } = getRect(el),
    point = []
  switch (dir) {
    case 'top':
      point.push(left + width / 2, top)
      break
    case 'bottom':
      point.push(left + width / 2, top + height)
      break
    case 'left':
      point.push(left, top + height / 2)
      break
    case 'right':
      point.push(left + width, top + height / 2)
      break
  }
  return point
}

// 返回椭圆的路径
export function ellipsePath(cx, cy, rx, ry) {
  // 非数值单位计算，如当宽度像100%则移除
  if (isNaN(cx - cy + rx - ry)) return
  return `
    M ${cx - rx} ${cy}
    a ${rx} ${ry} 0 1 1 ${2 * rx} 0
    a ${rx} ${ry} 0 1 1 ${-2 * rx} 0
    z
  `
}
