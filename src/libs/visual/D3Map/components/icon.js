import {
  eventBinder
} from './utils'
export default class Icon {
  constructor(options) {
    this.options = {
      width: 20,
      height: 20,
      offset: [10, 10],
      ...options
    }
  }

  /**
   * 添加icon
   * @param {Array} arr
   * arr => [
   *  {
   *    name: '湖南省', // required: true
   *    url: 'static/img/***.jpg', // required: true
   *    size: [10, 10], // required: false
   *    offset: [10, 10], // required: false
   *  }
   * ]
   * @memberof Icon
   */
  setData(arr) {
    const {
      rootSvg,
      rootBuilder,
      rootProjection,
      width,
      height,
      offset
    } = this.options

    rootSvg.selectAll('image.v-icons')
      .data([])
      .exit()
      .remove()
    if (!arr.length) {
      console.info(`Icon setData 请添加数据`)
      return
    }

    const points = rootSvg.selectAll('image.v-icons')
      .data(arr)
      .enter()
      .append('image')
      .attr('class', 'v-icons')
      .attr('x', d => (rootProjection(rootBuilder.getPoint(d.name))[0] + (d.offset ? d.offset[0] : offset[0])))
      .attr('y', d => (rootProjection(rootBuilder.getPoint(d.name))[1] + (d.offset ? d.offset[1] : offset[1])))
      .attr('width', d => d.size ? d.size[0] : width)
      .attr('height', d => d.size ? d.size[1] : height)
      .attr('xlink:href', d => d.url)

    eventBinder(this.options, points)
  }

  clearData() {

  }

  resize(projection) {
    this.options.rootProjection = projection
    const {
      rootSvg,
      rootBuilder
    } = this.options
    rootSvg.selectAll('iamge.v-icons')
      .attr('x', d => projection(rootBuilder.getPoint(d.name))[0])
      .attr('y', d => projection(rootBuilder.getPoint(d.name))[1] - 12)
  }
}
