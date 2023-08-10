import * as d3 from 'd3'
/**
 *  地图经纬度构造器
 */
export default class MapBuilder {
  /**
   * 支持标准GeoJson 和 经过转换后的 topojson
   */
  constructor(element, json, options) {
    this.options = {
      zoom: 48 * 0.9, // 容器内缩放至 90%
      ...options
    };
    [
      [this.left, this.top],
      [this.right, this.bottom]
    ] = d3.geoBounds(json)
    this.coordMap = {}
    this.el = element
    this.setSize()
    window.addEventListener('resize', _ => {
      this.setSize()
    })
    json.features.map(item => {
      this.coordMap[item.properties.name] = {}
      this.coordMap[item.properties.name]['id'] = item.properties.adcode || item.properties.id || item.properties.name
      // if (item.properties.center) {
      //   this.coordMap[item.properties.name]['center'] = [item.properties.center.lng, item.properties.center.lat]
      // } else {
      this.coordMap[item.properties.name]['center'] = d3.geoCentroid(item)
      // }
    })
  }

  setSize() {
    this.width = this.el.clientWidth
    this.height = this.el.clientHeight
  }

  getId(cityName) {
    if (this.coordMap.hasOwnProperty(cityName)) {
      return this.coordMap[cityName].id
    }
    return new Error(`getPoint methods can not find ${cityName}`)
  }

  getPoint(cityName) {
    if (this.coordMap.hasOwnProperty(cityName)) {
      return this.coordMap[cityName].center
    }
    return new Error(`getPoint methods can not find ${cityName}`)
  }

  // 获取地图中心点
  getCenter() {
    return [this.left * 0.5 + this.right * 0.5, this.bottom * 0.5 + this.top * 0.5]
  }

  // 获取地图全部显示的比例
  getFullScale() {
    const cScale = this.width / this.height
    const mScale = (this.right - this.left) / (this.bottom - this.top)
    const scale = (cScale > mScale) ? this.height / (this.bottom - this.top) : this.width / (this.right - this.left)
    return scale * this.options.zoom
  }
}
