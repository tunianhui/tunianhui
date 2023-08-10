import * as d3 from 'd3'
// import _ from 'lodash'
import './style.less'
import {
  eventBinder
} from './utils'
import Bar from './bar'
import Fly from './fly'
import Line from './line'
import Point from './point'
import Icon from './icon'
import MapBuilder from './mapBuilder'
import defs from './defs'

export default class Map {
  constructor(element, json, options) {
    this.root = element
    this.options = {
      zoom: true,
      rotateX: 30,
      // 伪3D设置，如果不想用伪3D，则可以设置 Shadow:false 或 Shadow:null,
      shadow: {
        left: 0,
        top: 8,
        fill: ''
      },
      light: {
        min: 10,
        max: 30
      },
      Shape: null,
      Text: null,
      Line: null,
      Bar: null,
      Point: null,
      Icon: null,
      Fly: null,
      animation: {
        duration: 1500,
        ease: 'easeExpOut'
      },
      material: '',
      ...options
    }
    this.timer = null
    this.transform = {
      x: 0,
      y: 0,
      k: 0,
      ix: 0,
      iy: 0
    }
    this.pheight = Math.cos(Math.PI * 2 * this.options.rotateX / 360)
    this.setSize()

    this.rootBuilder = new MapBuilder(element, json, {
      ...this.options.map
    })
    this.container = d3.select(element)
      // .attr('style', 'perspective: 1000px;transform-style: preserve-3d;')
      .append('div')
      .attr('class', 'v-map')
      .attr('width', this.width)
      .attr('height', this.theight)
    // .attr('style', `margin-top: ${(this.height - this.theight) / 2}px; transform: rotateX(${this.options.rotateX}deg);`)
    // transform: rotateX(${this.options.rotateX}deg);
    this.rootSvg = this.container.append('svg')
      .attr('width', this.width)
      .attr('height', this.theight)
    // .attr('style', 'perspective: 1000px; transform-style: preserve-3d;')
    // .append('g')
    // .classed('__g', true)
    this.rootSvg.append('defs').html(defs)

    this.rootProjection = null
    this.shapes = null
    this.texts = null
    if (this.options.material) {
      d3.select('#material image').attr('xlink:href', this.options.material)
    }
    this._init(json)
  }

  _init(json) {
    const center = this.rootBuilder.getCenter()
    const scale = this.rootBuilder.getFullScale()
    // const self = this
    if (this.options.shadow) {
      this.darwShadow(json, center, scale)
    }

    this.groupArea = this.rootSvg.append('g').attr('class', 'v-group')
    const path = this.getMapPath(center, scale)

    // console.log(path, this.rootProjection, path.bounds)

    this.shapes = this.groupArea.append('g')
      .classed('v-areas', true)
      .attr('fill', d => this.options.material ? 'url(#material)' : 'rgba(2, 171, 255, 0.35)')
      // .attr('style', `transform: rotateX(${this.options.rotateX}deg)`)
      .selectAll('v-area')
      .data(json.features)
      .enter()
      .append('path')
      .attr('class', 'v-area')
      .attr('data-label', d => d.properties.adcode || d.properties.id || d.properties.name)
      .attr('id', d => '_area_' + d.properties.adcode || d.properties.id || d.properties.name)
      .attr('d', path)
      .attr('transform', this.pathTransform.bind(this))

    // if (this.options.material) {
    //   this.setMaterial(this.options.material)
    // }
    // this.mapComnoAnimation(this.shapes, this.pathHoverTransform.bind(this) )
    this.mapComnoAnimation(this.shapes, function (data) {
      // const el = this
      d3.select(this)
        .classed('v-path-animate', true)
      // setTimeout(function() {
      //   d3.select(el)
      //   .classed('v-path-animate', false)
      // }, 8000)
    })

    this.texts = this.groupArea.append('g')
      .classed('v-labels', true)
      .selectAll('v-label')
      .data(json.features)
      .enter()
      .append('text')
      .attr('class', 'v-label')
      .attr('data-label', d => d.properties.adcode || d.properties.id || d.properties.name)
      .attr('x', d => this.rootProjection(this.rootBuilder.getPoint(d.properties.name))[0])
      .attr('y', d => this.rootProjection(this.rootBuilder.getPoint(d.properties.name))[1] + 5)
      .text(d => d.properties.name)
      .attr('transform', this.pathTransform.bind(this))
    this.mapComnoAnimation(this.texts)

    this._bindEvent()

    const options = {
      rootSvg: this.rootSvg,
      rootBuilder: this.rootBuilder,
      rootProjection: this.rootProjection
    }
    this.Bar = new Bar({
      ...this.options.Bar,
      ...options
    })
    this.Line = new Line({
      ...this.options.Line,
      ...options
    })
    this.Fly = new Fly({
      ...this.options.Fly,
      ...options
    })
    this.Point = new Point({
      ...this.options.Point,
      ...options
    })
    this.Icon = new Icon({
      ...this.options.Icon,
      ...options
    })
  }

  _bindEvent() {
    const self = this
    const shapeNativeEvent = {
      mouseover(...args) {
        this.timer = setTimeout(self.pathHoverTransform.bind(self), 100, ...args)
        const label = this.getAttribute('data-label')
        d3.selectAll('.v-label').classed('active', function () {
          return this.getAttribute('data-label') === label
        })
      },
      mouseout(...args) {
        clearTimeout(this.timer)
        d3.selectAll('.v-label').classed('active', false)
      },
      click(d, i, nodes) {
        const areaName = d.properties.name
        const id = self.rootBuilder.getId(areaName)
        self.rootSvg.selectAll('.v-area').classed('v-area-selected', false)
        self.rootSvg.selectAll('#_area_' + id).classed('v-area-selected', true)
      }
    }

    const textNativeEvent = {
      mouseover() {
        const label = this.getAttribute('data-label')
        d3.selectAll('.v-area').classed('active', function () {
          return this.getAttribute('data-label') === label
        })
      },
      mouseout() {
        d3.selectAll('.v-area').classed('active', false)
      }
    }

    eventBinder(this.options.Shape, this.shapes, shapeNativeEvent)
    eventBinder(this.options.Text, this.texts, textNativeEvent)

    window.addEventListener('resize', this._resize.bind(this), false)

    if (this.options.zoom) {
      this.rootSvg.call(d3.zoom().on('zoom', _ => {
        this._zoom()
      })).on('dblclick.zoom', null)
    }
  }

  _resize() {
    this.setSize()

    this.container.attr('style', 'width:' + this.width + 'px;height:' + this.theight + 'px;margin-top:' + (this.height - this.theight) / 2 + 'px;transform: rotateX(' + this.options.rotateX + 'deg);')
    this.rootSvg.attr('width', this.width).attr('height', this.theight)

    const center = this.rootBuilder.getCenter()
    const scale = this.rootBuilder.getFullScale()
    const path = this.getMapPath(center, scale)
    this.rootSvg.selectAll('path.v-area')
      .attr('d', path)
    this.rootSvg.selectAll('text.v-label')
      .attr('x', d => this.rootProjection(this.rootBuilder.getPoint(d.properties.name))[0])
      .attr('y', d => this.rootProjection(this.rootBuilder.getPoint(d.properties.name))[1] + 5)

    if (this.options.shadow) {
      const pathBkg = this.getMapPath(center, scale, [
        this.options.shadow.left,
        this.options.shadow.top
      ])
      this.rootSvg.selectAll('path.v-item-background').attr('d', pathBkg)
    }

    this.Bar.resize(this.rootProjection)
    this.Line.resize(this.rootProjection)
    this.Point.resize(this.rootProjection)
    this.Fly.resize(this.rootProjection)
  }

  setSize() {
    this.width = this.root.clientWidth
    this.height = this.root.clientHeight
    this.theight = this.height / this.pheight
    console.log(this.width, this.height, this.theight)
  }

  getCenter() {
    return this.rootBuilder.getCenter()
  }

  getScale() {
    return this.rootBuilder.getFullScale()
  }

  // 设置 path translate 初始值
  pathTransform(data, index, nodeList) {
    const center = this.getCenter()
    const c = data.properties.center
    let lng, lat
    if (!data.properties.center) {
      return `translate(0, 0)`
    } else {
      if (Object.prototype.toString.call(c) === '[object Array]') {
        lng = c[0]
        lat = c[1]
      } else if (Object.prototype.toString.call(c) === '[object Object]') {
        lng = c.lng
        lat = c.lat
      }
      return `translate(${(lng - center[0]) * 500}, ${(center[1] - lat) * 500})`
    }
  }

  // 地图 组合动画
  mapComnoAnimation(selector, callback) {
    const {
      duration,
      ease
    } = this.options.animation
    selector.transition()
      .duration(duration)
      .ease(d3[ease])
      .attr('transform', `translate(0, 0)`)
      // .attr('style', `transform: translate(0, 0) rotateX(${this.options.rotateX}deg);`)
      .on('end', function (...args) {
        callback && callback.call(this, ...args)
      })
  }

  // 地区活动状态的动画
  pathHoverTransform(data) {
    const _data = data.geometry.coordinates
    let list = []
    _data.forEach(item => {
      const _item = this.options.map === 'china' ? item : item[0]
      list.push(..._item)
    })
    const ligths = this.groupArea.append('g').attr('class', 'v-lights-group')
    list = list.filter((item, index) => (index % Math.floor(list.length / 12)) === 0)
    const {
      ease
    } = this.options.animation

    ligths.append('g')
      .classed('v-light-dots', true)
      .selectAll('v-light-dot')
      .data(list)
      .enter()
      .append('circle')
      .attr('cx', d => this.rootProjection(d)[0])
      .attr('cy', d => this.rootProjection(d)[1])
      .attr('r', 1)
      .attr('fill', 'yellow')
      .attr('opacity', 0.3)
      .attr('filter', 'url(#blurFilter5)')
      .transition()
      .duration(500)
      .ease(d3[ease])
      .attr('r', 2)
      .attr('opacity', 0.75)
      .transition()
      .duration(500)
      .ease(d3[ease])
      .attr('r', 1)
      .attr('opacity', 0.3)
      .transition()
      // .duration(500)
      // .ease(d3[ease])
      .attr('r', 3)
      .attr('opacity', 1)
      .transition()
      .duration(1500)
      .ease(d3[ease])
      .attr('r', 1)
      .attr('opacity', 0)
      // .remove()
      .on('end', _ => {
        ligths.remove()
      })
  }

  // 获取地图path数据
  getMapPath(center, scale, offset) {
    let translate
    if (offset) {
      translate = [this.width / 2 + offset[0], this.theight / 2 + offset[1]]
    } else {
      translate = [this.width / 2, this.theight / 2]
    }
    const projectionBkg = d3.geoMercator()
      .center(center)
      .scale(scale)
      .translate(translate)
    if (!offset) {
      this.rootProjection = projectionBkg
    }
    return d3.geoPath().projection(projectionBkg)
  }

  darwShadow(json, center, scale) {
    const pathBkg = this.getMapPath(center, scale, [
      this.options.shadow.left,
      this.options.shadow.top
    ])
    const mapBg = this.rootSvg.append('g')
      .attr('class', 'v-group-background')
      // .attr('style', `transform: rotateX(${this.options.rotateX}deg)`)
      .selectAll('path.v-item-background')
      .data(json.features)
      .enter()
      .append('path')
      .attr('class', 'v-item-background')
      .attr('d', pathBkg)
      .attr('fill', this.options.fill)
      .attr('transform', this.pathTransform.bind(this))
    // .attr('style', this.pathTransform.bind(this))

    this.mapComnoAnimation(mapBg)
  }

  _zoom() {
    // console.log(d3.event, d3, this.transform, this)
    let transform = d3.event.transform
    if (transform.k === this.transform.k) {
      this.transform.x += transform.x - this.transform.ix
      this.transform.y += transform.y - this.transform.iy
    } else {
      this.transform.k = transform.k
      this.transform.ix = transform.x
      this.transform.iy = transform.y
    }
    this.rootSvg.attr('transform', 'translate(' + this.transform.x + ',' + this.transform.y + ') scale(' + this.transform.k + ')')
    // this.rootSvg.attr('transform', 'translate(' + transform.x + ',' + transform.y + ') scale(' + transform.k + ')')
  }

  setBars(arr) {
    this.Bar.setData(arr)
  }

  setLines(arr) {
    this.Line.setData(arr)
  }

  setPoints(arr) {
    this.Point.setData(arr)
  }

  setIcons(arr) {
    this.Icon.setData(arr)
  }

  setColors(arr) {
    this.rootSvg.selectAll('path.v-area').attr('style', ';')
    arr.map(item => {
      const id = this.rootBuilder.getId(item.area)
      this.rootSvg.select(`#_area_${id}`).attr('style', `fill: ${item.fill}`)
    })
  }

  // 飞到点内
  fly(from, to, callback) {
    this.Fly.fly(from, to, callback)
  }

  destroyed() {
    this.root.innerHTML = ''
    this.options.Line = null
    this.options.Fly = null
    this.options.Point = null
    this.options.Bar = null
    this.rootBuilder = null
    this.rootProjection = null
    window.removeEventListener('resize', this._resize, false)
  }
  // showTip(html, target) {
  //   if (_.isString(target)) {
  //     const point = this.rootProjection(this.rootBuilder.getPoint(target))
  //     const offset = this.root.getBoundingClientRect()
  //     // Tip.showBy(offset.x + point[0], offset.y + point[1] * PHEIGHT, html)
  //   } else {
  //     Tip.show(html)
  //   }
  // }
  // hideTip() {
  //   Tip.hide()
  // }
}
