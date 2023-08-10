import * as d3 from 'd3-geo'
import * as THREE from 'three'
import _ from 'lodash'
import {decode, loaderPromisify, getType} from './tool'
import {createCanvas, drawText, textSize} from '../tool/canvas'
import {hex2Rgba, rgbToRgba} from '../tool/color'
import Three from '../tool/three'
import Scatter from './scatter'
import Flyline from './flyline'
// import {MapControls} from 'three/examples/jsm/controls/MapControls'

const AREA = 'area',
  TEXT = 'text',
  BORDER = 'border',
  OTHERSIDEBORDER = 'otherSideBorder',
  HOVERMODEL = 'hoverMode',
  CLICKMODEL = 'clickModel',
  zoomKeys = [
    // 'fontSize',
    // 'size',
    'depth'
    // 'offset',
    // 'height',
    // 'bevelThickness',
    // 'bevelSize',
    // 'bevelSegments',
    // 'curveSegments',
    // 'steps'
  ]

class Map3D extends Three {
  constructor(el, mapJson, options) {
    if (mapJson.type !== 'FeatureCollection') {
      throw new Error('geoJson数据格式不正确，请传入正确的geoJson地图数据')
    }
    const depth = -15,
      defaultStyles = {
        areaStyle: {
          normal: {
            show: true,
            color: '#006de0',
            opacity: 1,
            texture: '',
            depth
          },
          emphasis: {
            show: true,
            color: '#ffff00',
            opacity: 1,
            texture: '',
            depth
          }
        },
        borderStyle: {
          normal: {
            show: true,
            color: '#aaffff',
            opacity: 1
          },
          emphasis: {
            show: true,
            color: '#55ffff',
            opacity: 1
          }
        },
        textStyle: {
          normal: {
            show: true,
            fontSize: 12,
            color: '#cccccc',
            opacity: 1,
            texture: '',
            height: 2,
            style: 'normal',
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 1,
            curveSegments: 10,
            rotation: {
              x: 0,
              y: Math.PI / 4,
              z: Math.PI / 2
            },
            steps: 1
          },
          emphasis: {
            show: true,
            color: '#00ff00',
            fontSize: 12,
            opacity: 1,
            texture: '',
            height: 2,
            style: 'normal',
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 1,
            curveSegments: 10,
            steps: 1,
            rotation: {
              x: 0,
              y: Math.PI / 4,
              z: Math.PI / 2
            }
          }
        }
      },
      defaultOptions = {
        depth,
        layers: 15,
        gui: false,
        stats: true,
        // controls: 'orbit', // orbit | map
        controls: true, // orbit | map
        background: '#000000',
        opacity: 0,
        cameraPosition: {x: 100, y: 0, z: 100},
        // 字体样式，font.json的绝对路径，修改文字字体需要传入对应字体的font.json路径
        // font: '/t-sources/fonts/MicrosoftYaHei_Regular.json',
        // font: '/t-sources/fonts/FZYouSJVFWT1_Regular.json',
        font: '/t-sources/fonts/FZNewShuSong-Z10S__filterd.json',
        // zoom: 30,
        rotate: Math.PI / 4,
        offset: [0, 0],
        roam: true,
        autoResize: true,
        light: {
          color: 0xffffff,
          intensity: 0.5
        },
        actived: '', // 北京市
        regions: {
          // 广东省: {...defaultStyles}
          香港: {
            // center: [], // 文字的位置，经纬度
            textStyle: {
              normal: {
                show: false
              }
            }
          },
          澳门: {
            textStyle: {
              normal: {
                show: false
              }
            }
          }
        },
        tooltip: '',
        flylines: null,
        scatters: null,
        nameMap: {},
        stopDefaultMousemove: false,
        stopDefaultClick: true
      },
      _options = _.cloneDeep(options),
      opts = _.merge({}, defaultStyles, {...defaultOptions}, _options)
    super(el, opts)
    this._options = _.cloneDeep(opts)
    this.mapJson = decode(mapJson)
    this.defaultStyles = defaultStyles
    this.init()
  }

  regionsMerge(regions, defaultStyles) {
    for (let name in regions) {
      if (regions[name] && getType(regions[name]) === 'object') {
        regions[name] = _.merge({}, defaultStyles, regions[name])
      } else {
        regions[name] = defaultStyles
      }
    }
  }

  async init() {
    await this.necessaryInit()
    this.processMapJson()
    this.regionsMerge(this.options.regions, this.defaultStyles)
    this.zoomOptionsValue(this.options)

    this.promisifyLoader()
    // this.setMapControl()
    this.setLight()
    await this.drawMap()
    this.options.scatters &&
      (this.scatters = new Scatter(this, this.options.scatters))
    this.options.flylines &&
      (this.flylines = new Flyline(this, this.options.flylines))
    this._render()
    this.emit('ready', this)
    !this.options.stopDefaultMousemove &&
      this.registerMouseEvent(
        'mousemove',
        this.mousemove.bind(this),
        this.areaMeshes
      ) &&
      this.registerMouseEvent(
        'mouseout',
        this.mouseout.bind(this),
        this.areaMeshes
      )
    !this.options.stopDefaultClick &&
      this.registerMouseEvent('click', this.click.bind(this), this.areaMeshes)
  }

  // setMapControl() {
  //   const controls = new MapControls(this.camera, this.renderer.domElement)
  //   controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
  //   controls.dampingFactor = 0.25

  //   controls.screenSpacePanning = false

  //   controls.minDistance = 100
  //   controls.maxDistance = 500

  //   controls.maxPolarAngle = Math.PI / 2
  //   this.mapControls = controls
  // }

  promisifyLoader() {
    this.fontLoader = loaderPromisify(new THREE.FontLoader())
    this.textureLoader = loaderPromisify(new THREE.TextureLoader())
  }

  render() {
    this.scatters && this.scatters.render()
    this.flylines && this.flylines.render()
  }

  click(event) {
    const group = this.getIntersectGroup(event)
    if (!group) {
      if (this[CLICKMODEL] && this[CLICKMODEL].selected) {
        this.setModelStyleByType(this.selectedArea, 'normal')
        this[CLICKMODEL] = null
      }
      return
    }
    if (group === this[HOVERMODEL]) return
    this.setModelStyle(group, CLICKMODEL)
    group.selected = true
  }

  mousemove(event) {
    const group = this.getIntersectGroup(event)
    if (
      this[HOVERMODEL] &&
      this[CLICKMODEL] &&
      this[HOVERMODEL].name === this[CLICKMODEL].name
    ) {
      return
    }
    if (!group) {
      this[HOVERMODEL] && this.setModelStyleByType(this[HOVERMODEL], 'normal')
      this[HOVERMODEL] = null
      return
    }

    if (
      (this[CLICKMODEL] && group.name === this[CLICKMODEL].name) ||
      (this[HOVERMODEL] && this[HOVERMODEL].name === group.name)
    ) {
      return
    }
    this.setModelStyle(group, HOVERMODEL)
  }

  mouseout(event) {
    if (this[HOVERMODEL]) {
      this.setModelStyleByType(this[HOVERMODEL], 'normal')
      this[HOVERMODEL] = null
    }
  }

  getIntersectGroup(event) {
    const intersect = event.intersects[0]
    if (!intersect) return null
    const group = intersect.object.parent
    return this.mapNames.includes(group.name)
      ? group
      : this.mapNames.includes(group.name.split('_')[0]) && group.parent
  }

  setModelStyle(group, key) {
    if (group instanceof THREE.Group) {
      this[key] && this.setModelStyleByType(this[key], 'normal')
      this[key] = group
      this.setModelStyleByType(this[key], 'emphasis')
    }
  }

  processMapJson() {
    const {nameMap} = this.options
    !this.left && this.getGeoBounds()

    this.mapNames = []
    this.mapCenters = {}
    this.mapCenterVectors = {}

    // 把经纬度转换成x, y, z坐标
    this.mapJson.features.forEach(d => {
      const {cp, name: origionName} = d.properties,
        name = nameMap[origionName] || origionName,
        vectors3 = this.coordToVector3(cp)
      d.name = name
      d.center = cp
      d.centerVector3 = vectors3

      this.mapCenterVectors[name] = vectors3
      this.mapNames.push(name)
      this.mapCenters[name] = cp
      d.vector3 = []
      d.geometry.coordinates.forEach((coordinates, i) => {
        d.vector3[i] = []
        coordinates.forEach((c, j) => {
          if (Array.isArray(c[0])) {
            d.vector3[i][j] = c.map(cinner => this.coordToVector3(cinner))
          } else {
            d.vector3[i].push(this.coordToVector3(c))
          }
        })
      })
    })
  }

  zoomOptionsValue(options) {
    for (let key in options) {
      if (key === 'mapData') return
      const value = options[key]
      if (typeof value === 'number' && zoomKeys.includes(key)) {
        options[key] = value / this.mapZoom
      } else if (getType(value) === 'object') {
        this.zoomOptionsValue(value)
      }
    }
  }
  // 经纬度转换成墨卡托投影
  coordToVector3(coord, z = 0) {
    if (!this.projection) {
      const {rotate, offset, center, zoom} = this.options
      if (!this.mapCenter) {
        this.mapCenter = center || this.getMapCenter()
        this.options.center = this.mapCenter
      }
      if (!this.mapZoom) {
        this.mapZoom = zoom || this.getZoom()
        this.options.zoom = this.mapZoom
      }
      this.projection = d3
        .geoMercator()
        .center(this.mapCenter)
        .scale(this.mapZoom)
        .rotate(rotate)
        .translate(offset)
    }
    const [x, y] = this.projection(coord.concat()).reverse()
    return [x, y, z]
  }

  getGeoBounds() {
    ;[[this.left, this.top], [this.right, this.bottom]] = d3.geoBounds(
      this.mapJson
    )
  }

  getMapCenter() {
    return [(this.left + this.right) * 0.5, (this.bottom + this.top) * 0.5]
  }

  getZoom() {
    const {width, height} = this.rendererSize,
      scaleX = width / Math.abs(this.left - this.right),
      scaleY = height / Math.abs(this.top - this.bottom)
    return Math.min(scaleX, scaleY) * 2
  }

  getModelCenter(geoJson) {
    const [[left, top], [right, bottom]] = d3.geoBounds(geoJson)
    return [(left + right) * 0.5, (bottom + top) * 0.5]
  }

  drawMap() {
    // await this.initFont()
    this.areaMeshes = []
    this.textList = []

    const mapGroup = new THREE.Group(),
      {regions, depth, layers} = this.options

    this.mapJson.features.forEach(d => {
      const modelGroup = new THREE.Group(),
        areaGroup = new THREE.Group(),
        borderGroup = new THREE.Group(),
        {name, vector3, centerVector3} = d,
        {areaStyle, borderStyle, textStyle, center} = regions[name],
        centerPoint = center ? this.coordToVector3(center) : centerVector3
      // text =
      //   this.font && this.drawThreeText(name, textStyle.normal, centerPoint)
      // this.drawCanvasText(name, textStyle.normal)
      this.textList.push({
        text: name,
        center: centerPoint,
        textStyle
      })

      vector3.forEach(points => {
        // 多个面
        if (Array.isArray(points[0][0])) {
          points.forEach(p => {
            const mesh = this.drawArea(p, areaStyle.normal),
              borderMesh = this.drawBorder(
                p,
                borderStyle.normal,
                areaStyle.normal
              )
            borderGroup.add(borderMesh)
            areaGroup.add(mesh)
          })
        } else {
          // 单个面
          const mesh = this.drawArea(points, areaStyle.normal),
            borderMesh = this.drawBorder(
              points,
              borderStyle.normal,
              areaStyle.normal
            )
          borderGroup.add(borderMesh)
          areaGroup.add(mesh)
        }
      })

      modelGroup.data = d
      modelGroup.name = name
      areaGroup.name = `${name}_${AREA}`
      borderGroup.name = `${name}_${BORDER}`
      const segDepth = depth / (layers - 1)
      Array.from({length: layers - 1}).forEach((item, i) => {
        const bg = borderGroup.clone()
        bg.position.z = segDepth * (i + 1)
        bg.name = `${name}_${OTHERSIDEBORDER}${i}`
        modelGroup.add(bg)
      })
      // if (text) {
      //   text.name = `${name}_${TEXT}`
      //   modelGroup.add(text)
      // }
      modelGroup.add(areaGroup)
      modelGroup.add(borderGroup)
      mapGroup.add(modelGroup)
    })
    this.mapGroup = mapGroup
    this.scene.add(mapGroup)
    this.drawTexts()
  }
  // 绘制地图区域 points 是一个二维数组 [[x,y], [x,y], [x,y]]
  drawArea(points, {show, color, opacity, depth, texture}) {
    const shape = new THREE.Shape()

    points.forEach((d, i) => {
      const [x, y] = d
      if (i === 0) {
        shape.moveTo(x, y)
      } else if (i === points.length - 1) {
        shape.quadraticCurveTo(x, y, x, y)
      } else {
        shape.lineTo(x, y, x, y)
      }
    })
    const geometry = new THREE.ExtrudeBufferGeometry(shape, {
        steps: 2,
        depth: depth,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 1
      }),
      material = new THREE.MeshBasicMaterial({
        color,
        opacity,
        transparent: true,
        side: THREE.DoubleSide
      })
    texture && (material.map = texture)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = AREA
    mesh.visible = show
    this.areaMeshes.push(mesh)
    return mesh
  }

  drawBorder(points, {show, color, opacity}, {depth}) {
    const material = new THREE.LineBasicMaterial({
        // vertexColors: THREE.VertexColors,
        color,
        opacity,
        transparent: true
      }),
      geometry = new THREE.BufferGeometry(),
      positions = []
    points.forEach(d => {
      const [x, y, z] = d
      positions.push(x, y, z + 0.1)
    })
    geometry.addAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    )
    geometry.computeBoundingSphere()

    const border = new THREE.Line(geometry, material)
    border.position.z = -2 / this.mapZoom
    border.visible = show
    // border.name = BORDER
    // depth && (border.position.z = depth)
    return border
  }

  async initFont() {
    const {regions = {}, textStyle} = this.options
    if (textStyle.normal.show || textStyle.emphasis.show) {
      this.font = await this.fontLoader(this.options.font)
    } else {
      Object.keys(regions).some(item => {
        const textStyle = regions[item].textStyle
        return textStyle.normal.show || textStyle.emphasis.show
      }) && (this.font = await this.fontLoader(this.options.font))
    }
  }

  async drawTexts() {
    await this.initFont()
    if (!this.font) return
    this.textList.forEach(item => {
      const {text, center, textStyle} = item,
        mesh = this.drawThreeText(text, textStyle.normal, center),
        model = this.scene.getObjectByName(text) || this.scene
      mesh.name = `${text}_${TEXT}`
      model.add(mesh)
    })
  }

  drawThreeText(
    text,
    {
      show,
      color,
      opacity,
      texture,
      height,
      style,
      fontSize,
      steps,
      bevelThickness,
      bevelSize,
      bevelSegments,
      curveSegments,
      rotation
    },
    center
  ) {
    const geometry = new THREE.TextBufferGeometry(text, {
        font: this.font,
        // 比html字体感觉大2号
        size: fontSize - 2,
        height,
        style,
        bevelThickness,
        bevelSize,
        bevelSegments,
        curveSegments,
        steps
      }),
      material = new THREE.MeshBasicMaterial({
        color,
        opacity,
        transparent: true
      })
    texture && (material.map = texture)
    const mesh = new THREE.Mesh(geometry, material),
      scale = 1 / this.mapZoom || 1

    mesh.rotation.set(rotation.x, rotation.y, rotation.z)
    mesh.position.set(center[0], center[1], (fontSize * scale) / 2)
    mesh.scale.set(scale, scale, scale)
    mesh.rendererOrder = 2
    mesh.geometry.center()
    mesh.name = TEXT
    mesh.visible = show
    return mesh
  }

  drawCanvasText(text, {color, opacity, fontSize, fontFaimly, texture}) {
    const {width, height} = textSize(text, fontSize, fontFaimly),
      {canvas, ctx} = createCanvas(width, height)
    drawText(ctx, {
      color:
        color.indexOf('rgba') !== -1
          ? color
            ? color.indexOf('rgb') !== -1
            : rgbToRgba(color, opacity)
          : hex2Rgba(color, opacity)
    })
    return this.drawTextPlane(canvas, width, height)
  }

  drawTextPlane(canvas, width, height) {
    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    const planeGeometry = new THREE.PlaneBufferGeometry(width, height, 1, 1),
      // MeshLambertMaterial
      planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0xffffff,
        // opacity,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      }),
      plane = new THREE.Mesh(planeGeometry, planeMaterial)
    return plane
  }

  /**
   * 设置一个区域的颜色
   * @param {THREE.Group} g area group
   * @param {String} type normal | emphasis
   */
  setModelStyleByType(model, type) {
    const name = model.name,
      {
        regions = {},
        areaStyle: defaultAreaStyle,
        textStyle: defaultTextStyle,
        borderStyle: defaultBorderStyle
      } = this.options,
      {
        areaStyle = defaultAreaStyle,
        textStyle = defaultTextStyle,
        borderStyle = defaultBorderStyle
      } = regions[name] || {}
    model.children.forEach(group => {
      const cname = group.name
      if (`${name}_${TEXT}` === cname) {
        this.setTextStyle(group, textStyle[type])
      } else if (`${name}_${AREA}` === cname) {
        this.setAreaStyle(group, areaStyle[type])
      } else if (`${name}_${BORDER}` === cname) {
        this.setBorderStyle(group, borderStyle[type], areaStyle[type])
      }
    })
  }

  setAreaStyle(group, {show, color, depth, opacity, texture}) {
    group.children.forEach(mesh => {
      color && mesh.material.color.set(color)
      opacity && (mesh.material.opacity = opacity)
      depth && (mesh.geometry.depth = depth)
      texture && (mesh.material.map = texture)
      mesh.visible = show
    })
  }

  setBorderStyle(group, {show, color, opacity}, {depth}) {
    group.children.forEach(mesh => {
      color && mesh.material.color.set(color)
      opacity && (mesh.material.opacity = opacity)
      mesh.visible = show
      // mesh.position.z = depth
    })
  }

  setTextStyle(mesh, {show, color, height, opacity, texture, rotation}) {
    color && mesh.material.color.set(color)
    opacity && (mesh.material.opacity = opacity)
    height && (mesh.material.height = height)
    texture && (mesh.material.map = texture)
    if (rotation) {
      rotation.x && (mesh.rotation.x = rotation.x)
      rotation.y && (mesh.rotation.y = rotation.y)
      rotation.z && (mesh.rotation.z = rotation.z)
    }
    mesh.visible = show
  }

  setCamera() {
    const {x, y, z} = this.options.cameraPosition,
      {width, height} = this.rendererSize

    this.camera = new THREE.PerspectiveCamera(10, width / height, 1, 1000)
    this.camera.up.x = 0
    this.camera.up.y = 0
    this.camera.up.z = 1
    this.camera.position.set(x, y, z)
    this.camera.lookAt(0, 0, 0)
  }

  setLight() {
    const {color = 0xffffff, intensity = 0.5} = this.options.light || {}
    const directionalLight = new THREE.DirectionalLight(color, intensity)
    this.scene.add(directionalLight)
  }

  setHelper() {
    const axesHelper = new THREE.AxesHelper(5)
    this.scene.add(axesHelper)
  }
}

export default Map3D
