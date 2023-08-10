import _ from 'lodash'
import {
  eventBinder
} from './utils'

export default class Point {
  constructor(options) {
    this.options = {
      effectMin: 2000,
      effectMax: 4000,
      radiusMin: 8,
      radiusMax: 16,
      start: 1,
      ...options
    }
  }

  /**
   * 添加点
   * @param {Array} arr
   * ['湖南省', '湖北省']
   */
  setData(arr) {
    const {
      rootSvg,
      rootBuilder,
      rootProjection,
      start,
      radiusMin,
      radiusMax,
      effectMin,
      effectMax
    } = this.options

    rootSvg.selectAll('circle.v-point')
      .data([])
      .exit()
      .remove()
    if (!arr.length) {
      console.info(`Point setData 请添加数据`)
      return
    }

    const points = rootSvg.selectAll('circle.v-point')
      .data(arr)
      .enter()
      .append('circle')
      .attr('class', 'v-point')
      .attr('cx', d => rootProjection(rootBuilder.getPoint(d))[0])
      .attr('cy', d => rootProjection(rootBuilder.getPoint(d))[1] - 12)
      .attr('r', start)
      .append('animate')
      .attr('attributeName', 'r')
      .attr('attributeType', 'xml')
      .attr('form', radiusMin)
      .attr('to', radiusMax)
      .attr('begin', '0s')
      .attr('dur', d => _.random(effectMin, effectMax) / 1000 + 's')
      .attr('repeatCount', 'indefinite')

    eventBinder(this.options, points)
  }

  resize(projection) {
    this.options.rootProjection = projection
    const {
      rootSvg,
      rootBuilder
    } = this.options
    rootSvg.selectAll('circle.v-point')
      .attr('cx', d => projection(rootBuilder.getPoint(d))[0])
      .attr('cy', d => projection(rootBuilder.getPoint(d))[1] - 12)
  }
}
