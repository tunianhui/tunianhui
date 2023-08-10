import * as THREE from 'three'
import _ from 'lodash'
import {createCanvas} from '../tool/canvas'
import point from './images/point1.png'

const COLOR = '#005fc4',
  pointCount = 100

export default class Flyline {
  constructor(context, options) {
    const flylineOpt = {
        lineStyle: {
          color: COLOR,
          show: true,
          opacity: 1,
          maxHeight: 100
        },
        symbolStyle: {
          size: 6,
          speed: 0.01,
          color: COLOR,
          opacity: 1,
          shadow: true,
          center: [],
          // symbol: 'dotted' // dotted | line | ball
          symbol: `images://${point}`
        }
        // center: null
      },
      defaultOptions = {
        ...flylineOpt,
        data: []
      },
      necessaryExtendProps = [
        'mapZoom',
        'mapCenterVectors',
        // 'coordToVector3',
        'scene',
        'textureLoader',
        'TWEEN',
        'tweenEasing'
      ]
    options.data &&
      (defaultOptions.data = _.cloneDeep(options.data).map(item =>
        _.merge({}, flylineOpt, item)
      ))
    this.options = _.merge({}, defaultOptions, _.omit(options, ['data']))
    _.extend(this, _.pick(context, necessaryExtendProps))
    this.symbols = []
    this.textures = []
    this.context = context
    this.init()
  }

  init() {
    this.drawFlylines()
  }

  render() {
    this.symbolAnimate()
  }

  symbolAnimate() {
    this.symbols.forEach(item => {
      item.progress > 1.0 && (item.progress = 0)
      item.progress += item.speed
      const {x, y, z} = item.curve.getPoint(item.progress) || []
      x && item.mesh.position.set(x, y, z)
    })
  }

  drawFlylines() {
    this.symbolOpts = []
    const group = new THREE.Group()
    group.name = 'flylines'
    this.options.data &&
      this.options.data.forEach(item => {
        const g = new THREE.Group(),
          {source, target, lineStyle, symbolStyle} = item,
          {name: sname, center: scenter} = source,
          {name: tname, center: tcenter} = target,
          {maxHeight} = lineStyle,
          name = `${sname}-${tname}`,
          [x1, y1, z1] = scenter
            ? this.context.coordToVector3(scenter.slice(0, 2), scenter[3])
            : this.mapCenterVectors[sname],
          [x2, y2, z2] = tcenter
            ? this.context.coordToVector3(tcenter.slice(0, 2), tcenter[3])
            : this.mapCenterVectors[tname],
          curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(x1, y1, z1),
            new THREE.Vector3(
              (x1 + x2) / 2,
              (y1 + y2) / 2,
              // maxHeight
              maxHeight / this.mapZoom
            ),
            new THREE.Vector3(x2, y2, z2)
          ),
          points = curve.getPoints(pointCount),
          line = this.drawFlyline(points, lineStyle)
        this.symbolOpts.push({
          ...symbolStyle,
          position: [x1, y1, z1],
          name,
          curve
        })
        g.add(line)
        g.name = name
        group.add(g)
      })
    this.scene.add(group)
    this.drawSymbols()
  }

  drawFlyline(points, {color = COLOR, opacity = 1, show = true}) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points),
      material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        side: THREE.DoubleSide
      })
    const line = new THREE.Line(geometry, material)
    line.name = 'flyline'
    return line
  }

  async drawSymbols() {
    for (let opt of this.symbolOpts) {
      const {curve, name, speed} = opt,
        symbol = await this.drawSymbol(opt)
      if (symbol) {
        this.symbols.push({
          name,
          curve,
          speed,
          progress: 0,
          mesh: symbol
        })
        const g = this.scene.getObjectByName(name) || this.scene
        g.add(symbol)
      }
    }
  }

  async drawSymbol({symbol, size, color, opacity, position, shadow}) {
    let mesh
    if (symbol.startsWith('images://')) {
      const src = symbol.slice(9)
      let texture = this.textures.find(t => t.name === symbol)
      if (!texture) {
        texture = await this.textureLoader(src)
        texture.name = src
        this.textures.push(texture)
      }
      mesh = this.drawDotted({color, shadow, size, texture})
    } else {
      switch (symbol) {
        case 'dotted':
          !this.dottedTexture &&
            (this.dottedTexture = this.drawSymbolTexture(color, shadow))
          mesh = this.drawDotted({
            color,
            shadow,
            size,
            texture: this.dottedTexture
          })
          break
        case 'ball':
          mesh = this.drawBall({color, opacity, size})
          break
      }
    }
    if (mesh) {
      mesh.position.set(...position)

      mesh.renderOrder = 10
      mesh.name = 'flyline-symbol'
    }
    return mesh
  }

  drawDotted({color, size, texture}) {
    const material = new THREE.PointsMaterial({
        color,
        size: size * 3,
        // opacity,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        map: texture
      }),
      // geometry = new THREE.Geometry()
      // geometry.vertices.push(new THREE.Vector3(0, 0, 0))
      geometry = new THREE.BufferGeometry()
    geometry.addAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(3), 3)
    )

    return new THREE.Points(geometry, material)
  }

  drawBall({color = 0xffffff, opacity = 1, size = 10}) {
    const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        depthTest: false
      }),
      geometry = new THREE.SphereGeometry(size / this.mapZoom, 100, 100)
    return new THREE.Mesh(geometry, material)
  }

  drawSymbolTexture(color, shadow) {
    const size = 32,
      {canvas, ctx} = createCanvas(size, size)
    let gradient = color
    if (shadow) {
      gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      )
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, 'transparent')
    }
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    return texture
  }
}
