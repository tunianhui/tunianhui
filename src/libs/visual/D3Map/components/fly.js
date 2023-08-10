import * as d3 from 'd3'
import _ from 'lodash'
const line = d3.line().curve(d3.curveCatmullRom).x(d => d[0]).y(d => d[1])

export default class Fly {
  constructor(options) {
    this.options = {
      effectMin: 2000,
      effectMax: 4000,
      ...options
    }
  }

  /**
   * 从任意一个点飞到一个地区的中心点
   *
   * @param {string | array} from string: 区域名称, array: [100, 100] 页面上的位置
   * @param {string | array} to string: 区域名称, array: [100, 100] 页面上的位置
   * @param {function | void} callback function: 飞行完成后的回调
   * @memberof Fly
   */
  fly(from, to, callback) {
    if (_.isString(from)) {
      from = this.options.rootProjection(this.options.rootBuilder.getPoint(from))
    }
    if (_.isString(to)) {
      to = this.options.rootProjection(this.options.rootBuilder.getPoint(to))
    }
    const data = [
      from,
      to
    ]
    this.options.rootSvg.append('path')
      .datum(data)
      .attr('class', 'v-fly-line')
      .transition()
      .duration(_.random(this.options.effectMin, this.options.effectMax))
      .attrTween('d', d => {
        const h = d[1][0] - d[0][0]
        const v = d[1][1] - d[0][1]
        const [x, y] = d[0]
        return function (t) {
          let [cx, cy] = [x, y]
          if (t > 0.2 && t <= 0.8) {
            [cx, cy] = [x + d3.easeSinOut(t - 0.2) * h, y + d3.easeSinIn(t - 0.2) * v]
          } else if (t > 0.8) {
            [cx, cy] = [x + d3.easeSinOut(2 * t - 1) * h, y + d3.easeSinIn(2 * t - 1) * v]
          }
          const [tx, ty] = [x + d3.easeSinOut(t) * h, y + d3.easeSinIn(t) * v]
          return line([
            [cx, cy],
            [cx + (tx - cx) / 3, cy + (ty - cy) / 4],
            [tx, ty]
          ])
        }
      })
      .on('end', function () {
        callback && callback()
      })
      .remove()
  }

  resize() {}
}
