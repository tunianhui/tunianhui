import * as d3 from 'd3'
import _ from 'lodash'
import {
  eventBinder
} from './utils'

const line = d3.line().curve(d3.curveCatmullRom).x(d => d[0]).y(d => d[1])
let id = 1000

export default class Line {
  constructor(options) {
    this.options = {
      effectMin: 2000,
      effectMax: 4000,
      pointRadius: 4,
      ...options
    }
  }

  /**
   * 添加一个区域到另外一个区域的线条组
   * @param { array } arr
   * @memberof Line
   */
  setData(arr) {
    const {
      rootSvg,
      rootBuilder,
      rootProjection,
      pointRadius,
      effectMin,
      effectMax
    } = this.options

    rootSvg.selectAll('.v-group-line').data([]).exit().remove()

    if (!arr.length) {
      console.info(`Line setData 请添加数据`)
      return
    }

    arr.map(item => {
      item.__id = '_line_' + id++
    })
    const linesGroup = rootSvg.selectAll('g.v-group-line').data(arr).enter()
      .append('g')
      .attr('class', 'v-group-line')
      .attr('id', d => d.__id)

    linesGroup.append('path')
      .attr('class', 'v-line')
      .attr('id', d => d.__id + '_path')
      .attr('d', d => {
        const from = rootProjection(rootBuilder.getPoint(d.from))
        const to = rootProjection(rootBuilder.getPoint(d.to))
        const data = [
          from,
          [from[0] + (to[0] - from[0]) / 4, from[1] + (to[1] - from[1]) / 2],
          [from[0] + (to[0] - from[0]) * 3 / 4, to[1]],
          to
        ]
        return line(data)
      })

    linesGroup.append('circle')
      .attr('class', 'v-line-point')
      .attr('r', pointRadius)
      .attr('cx', 0)
      .attr('cy', 0)
      .append('animateMotion')
      .attr('begin', '0s')
      .attr('dur', _.random(effectMin, effectMax) / 1000 + 's')
      .attr('repeatCount', 'indefinite')
      .append('mpath')
      .attr('xlink:href', d => `#${d.__id}_path`)

    eventBinder(this.options, linesGroup)
  }

  resize(projection) {
    this.options.rootProjection = projection
    const {
      rootSvg,
      rootBuilder
    } = this.options

    rootSvg.selectAll('g.v-group-line path').attr('d', d => {
      const from = projection(rootBuilder.getPoint(d.from))
      const to = projection(rootBuilder.getPoint(d.to))
      const data = [
        from, [from[0] + (to[0] - from[0]) / 4, from[1] + (to[1] - from[1]) / 2],
        [from[0] + (to[0] - from[0]) * 3 / 4, to[1]],
        to
      ]
      return line(data)
    })
  }
}
