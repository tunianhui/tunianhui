import * as d3 from 'd3'
import _ from 'lodash'
import {
  eventBinder
} from './utils'

export default class Bar {
  constructor(options) {
    this.options = {
      duration: 1000,
      ease: 'easeCubicIn',
      heightMin: 10,
      heightMax: 60,
      width: 8,
      radius: 2,
      ...options
    }
  }

  /**
   * 设置柱状图
   * @param {*} arr
   * [
   *  {
   *    area: '北京',
   *    count: 1123
   *  }
   * ]
   */
  setData(arr) {
    const {
      width,
      heightMin,
      heightMax,
      duration,
      radius,
      ease,
      rootSvg,
      rootBuilder,
      rootProjection
    } = this.options
    rootSvg.selectAll('.v-bar').data([]).exit().remove()
    if (!arr.length) {
      console.info(`Bar setData 没有数据`)
      return
    }

    const min = _.minBy(arr, 'count').count
    const max = _.maxBy(arr, 'count').count
    const heightScale = d3.scaleLinear().domain([min, max]).range([heightMin, heightMax])
    const barsGroup = rootSvg.selectAll('rect.v-bar')
      .data(arr)
      .enter()
      .append('rect')
      .attr('class', 'v-bar')
      .attr('x', d => rootProjection(rootBuilder.getPoint(d.area))[0] - width / 2)
      .attr('y', d => rootProjection(rootBuilder.getPoint(d.area))[1])
      .attr('width', width)
      .attr('height', 0)
      .attr('rx', radius)
      .attr('ry', radius)

    barsGroup.transition()
      .duration(duration)
      .ease(d3[ease])
      .attr('y', d => rootProjection(rootBuilder.getPoint(d.area))[1] - heightScale(d.count))
      .attr('height', d => heightScale(d.count))

    eventBinder(this.options, barsGroup)
  }

  resize(projection) {
    this.options.rootProjection = projection
    const {
      rootSvg,
      rootBuilder,
      width
    } = this.options
    rootSvg.selectAll('rect.v-bar')
      .attr('x', d => projection(rootBuilder.getPoint(d.area))[0] - width / 2)
      .attr('y', d => projection(rootBuilder.getPoint(d.area))[1])
  }
}
