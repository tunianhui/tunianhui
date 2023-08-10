import * as d3 from 'd3-geo'
import * as THREE from 'three'
import _ from 'lodash'
import { decode, loaderPromisify, getType } from './tool'
import { createCanvas, drawText, textSize } from '../tool/canvas'
import { hex2Rgba, rgbToRgba } from '../tool/color'
import Three from '../tool/three'

const AREA = 'AREA',
  TEXT = 'TEXT',
  BORDER = 'BORDER',
  OTHERSIDEBORDER = 'OTHERSIDEBORDER',
  HOVERMODEL = 'HOVERMODEL',
  CLICKMODEL = 'CLICKMODEL',
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
    super(el, options)
    if (mapJson.type !== 'FeatureCollection') {
      throw new Error('geoJson数据格式不正确，请传入正确的geoJson地图数据')
    }
    this.mapJson = decode(mapJson)
    const defaultStyles = {
        areaStyle: {
          normal: {
            show: true,
            color: '#006de0',
            opacity: 0.75,
            texture: '',
            depth: -15 // 厚度 负数表示阴影向下
          },
          emphasis: {
            show: true,
            color: '#ffff00',
            opacity: 1,
            texture: '',
            depth: 5
          }
        },
        borderStyle: {
          normal: {
            show: true,
            color: '#cccccc',
            opacity: 0.85
          },
          emphasis: {
            show: true,
            color: '#33ffff',
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
          // 选中
          emphasis: {
            show: true,
            three: false,
            color: '#00ff33',
            fontSize: 12,
            opacity: 1,
            texture: '',
            height: 1,
            style: 'normal',
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 1,
            curveSegments: 50,
            steps: 1
          }
        }
      },
      defaultOptions = {
        gui: true,
        orbit: true,
        background: '#000000',
        opacity: 0,
        cameraPosition: { x: 100, y: 0, z: 100 },
        // 字体样式，默认微软雅黑 font.json的绝对路径，修改文字字体需要传入对应字体的font.json路径
        font: '/t-sources/fonts/MicrosoftYaHei_Regular.json',
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
        lines: [],
        scatters: [],
        nameMap: {},
        stopDefaultMousemove: false,
        stopDefaultClick: true
      }
    // Object.assign(this.options, defaultStyles, defaultOptions, options)
    _.merge(this.options, defaultStyles, defaultOptions, options)
    this.regionsMerge(this.options.regions, defaultStyles)
    this._options = _.cloneDeep(this.options)
    this.init()
  }

  regionsMerge(regions, defaultStyles) {
    for (let name in regions) {
      if (regions[name] && getType(regions[name]) === 'object') {
        _.merge(regions[name], defaultStyles)
      } else {
        regions[name] = defaultStyles
      }
    }
  }

  async init() {
    await this.necessaryInit()
    this.promisifyLoader()
    this.setLight()
    await this.drawMap()
    this._render()
    this.emit('ready', this)
    !this.options.stopDefaultMousemove &&
      this.registerMouseEvent(
        'mousemove',
        this.mousemove.bind(this),
        this.areaMeshes
      )
    !this.options.stopDefaultClick &&
      this.registerMouseEvent('click', this.click.bind(this), this.areaMeshes)
  }

  promisifyLoader() {
    this.fontLoader = loaderPromisify(new THREE.FontLoader())
    this.textureLoader = loaderPromisify(new THREE.TextureLoader())
  }

  /**
   * @desc 鼠标事件处理
   */
  mouseEvent(event) {
    if (!this.raycaster) {
      this.raycaster = new THREE.Raycaster()
    }
    if (!this.mouse) {
      this.mouse = new THREE.Vector2()
    }
    if (!this.meshes) {
      this.meshes = []
      this.mapGroup.children.forEach(g => {
        g.children.forEach(mesh => {
          this.meshes.push(mesh)
        })
      })
    }

    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    // 通过摄像机和鼠标位置更新射线
    this.raycaster.setFromCamera(this.mouse, this.camera)

    // 计算物体和射线的焦点
    const intersects = this.raycaster.intersectObjects(this.meshes)
    if (intersects.length > 0) {
      this.clickFunction(event, intersects[0].object.parent)
    }
  }

  render() {}

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
    // if (group instanceof THREE.Group) {
    //   this.selectedArea && this.setModelStyleByType(this.hoverArea, 'normal')
    //   this.hoverArea = group
    //   this.setModelStyleByType(this.hoverArea, 'emphasis')
    // }
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
    const { center, rotate, offset, zoom } = this.options,
      z = 0
    this.getGeoBounds()
    this.mapCenter = center || this.getMapCenter()
    this.mapZoom = zoom || this.getZoom()
    this.projection = d3
      .geoMercator()
      .center(this.mapCenter)
      .scale(this.mapZoom)
      .rotate(rotate)
      .translate(offset)

    // 把经纬度转换成x, y, z坐标
    this.mapJson.features.forEach(d => {
      const { cp, name } = d.properties
      d.name = name
      d.cp = cp
      d.vector3 = []
      d.geometry.coordinates.forEach((coordinates, i) => {
        d.vector3[i] = []
        coordinates.forEach((c, j) => {
          if (Array.isArray(c[0])) {
            d.vector3[i][j] = c.map(cinner => {
              // 经纬度转换成墨卡托投影
              const [y, x] = this.projection(cinner.concat())
              return [x, y, z]
            })
          } else {
            // 经纬度转换成墨卡托投影
            const [y, x] = this.projection(c.concat())
            d.vector3[i].push([x, y, z])
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
        // console.log('value', key, value)
        // options[`_${key}`] = value / this.mapZoom
        options[key] = value / this.mapZoom
      } else if (getType(value) === 'object') {
        this.zoomOptionsValue(value)
      }
    }
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
    const { width, height } = this.rendererSize,
      scaleX = width / Math.abs(this.left - this.right),
      scaleY = height / Math.abs(this.top - this.bottom)
    return Math.min(scaleX, scaleY) * 2
  }

  getModelCenter(geoJson) {
    const [[left, top], [right, bottom]] = d3.geoBounds(geoJson)
    return [(left + right) * 0.5, (bottom + top) * 0.5]
  }

  async drawMap() {
    this.processMapJson()
    this.zoomOptionsValue(this.options)
    // console.log(this.options)
    await this.initFont()
    this.mapNames = []
    this.mapCenters = {}
    this.areaMeshes = []

    const mapGroup = new THREE.Group(),
      {
        regions = {},
        nameMap = {},
        areaStyle: defaultAreaStyle,
        borderStyle: defaultBorderStyle,
        textStyle: defaultTextStyle
      } = this.options
    this.mapJson.features.forEach(d => {
      // console.log(
      //   this.getModelCenter(d),
      //   this.projection(d.cp.concat()).reverse()
      // )
      const modelGroup = new THREE.Group(),
        areaGroup = new THREE.Group(),
        borderGroup1 = new THREE.Group(),
        borderGroup2 = new THREE.Group(),
        { name: originName, vector3, cp } = d,
        centerPoint = this.projection(cp.concat()).reverse(),
        // centerPoint = this.getModelCenter(d),
        name = nameMap[originName] || originName,
        {
          areaStyle = defaultAreaStyle,
          borderStyle = defaultBorderStyle,
          textStyle = defaultTextStyle
        } = regions[name] || {},
        text =
          this.font &&
          textStyle.normal.show &&
          this.drawThreeText(name, textStyle.normal, centerPoint)
      // this.drawCanvasText(name, textStyle.normal)

      this.mapNames.push(name)
      this.mapCenters[name] = cp

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
            borderGroup1.add(borderMesh)
            borderGroup2.add(borderMesh.clone())
            // lineGroup.add(borderMesh)
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
          borderGroup1.add(borderMesh)
          borderGroup2.add(borderMesh.clone())
          // lineGroup.add(borderMesh)
          areaGroup.add(mesh)
        }
      })
      borderGroup2.position.z = defaultAreaStyle.normal.depth

      modelGroup.data = d
      modelGroup.name = name
      areaGroup.name = `${name}_${AREA}`
      borderGroup1.name = `${name}_${BORDER}`
      borderGroup2.name = `${name}_${OTHERSIDEBORDER}`
      if (text) {
        text.name = `${name}_${TEXT}`
        modelGroup.add(text)
      }
      modelGroup.add(areaGroup)
      modelGroup.add(borderGroup1)
      modelGroup.add(borderGroup2)
      mapGroup.add(modelGroup)
    })
    this.mapGroup = mapGroup
    this.scene.add(mapGroup)
  }

  async initFont() {
    const { regions = {}, textStyle } = this.options
    if (textStyle.normal.show || textStyle.emphasis.show) {
      this.font = await this.fontLoader(this.options.font)
    } else {
      Object.keys(regions).some(item => {
        const textStyle = regions[item].textStyle
        return textStyle.normal.show || textStyle.emphasis.show
      }) && (this.font = await this.fontLoader(this.options.font))
    }
  }

  // 绘制地图区域 points 是一个二维数组 [[x,y], [x,y], [x,y]]
  drawArea(points, { color, opacity, depth, texture }) {
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
    this.areaMeshes.push(mesh)
    return mesh
  }

  drawBorder(points, { color, opacity }, { depth }) {
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
    // border.name = BORDER
    // depth && (border.position.z = depth)
    return border
  }

  drawThreeText(
    text,
    {
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
    const geometry = new THREE.TextGeometry(text, {
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
      scale = 1 / this.mapZoom

    mesh.rotation.set(rotation.x, rotation.y, rotation.z)
    mesh.position.set(...center, (fontSize * scale) / 2)
    mesh.scale.set(scale, scale, scale)
    mesh.rendererOrder = 2
    mesh.geometry.center()
    mesh.name = TEXT
    return mesh
  }

  drawCanvasText(text, { color, opacity, fontSize, fontFaimly, texture }) {
    const { width, height } = textSize(text, fontSize, fontFaimly),
      { canvas, ctx } = createCanvas(width, height)
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

  setAreaStyle(group, { color, depth, opacity, texture }) {
    group.children.forEach(mesh => {
      mesh.material.color.set(color)
      mesh.material.opacity = opacity
      mesh.geometry.depth = depth
      texture && (mesh.material.map = texture)
    })
  }

  setBorderStyle(group, { color, opacity }, { depth }) {
    group.children.forEach(mesh => {
      mesh.material.color.set(color)
      // mesh.position.z = depth
      mesh.material.opacity = opacity
    })
  }

  setTextStyle(mesh, { color, height, opacity, texture }) {
    mesh.material.color.set(color)
    mesh.material.height = height
    mesh.material.opacity = opacity
    texture && (mesh.material.map = texture)
  }

  setObjectStyle(object, { color, texture, opacity, depth }) {
    if (object.children) {
      object instanceof THREE.Group &&
        object.children.forEach(mesh => {
          mesh.material.color.set(color)
          mesh.material.map = texture
          mesh.material.opacity = opacity
        })
    } else {
      object.material.color.set(color)
      object.material.map = texture
      object.material.opacity = opacity
    }
  }

  setCamera() {
    const { x, y, z } = this.options.cameraPosition,
      { width, height } = this.rendererSize

    this.camera = new THREE.PerspectiveCamera(10, width / height, 1, 1000)
    this.camera.up.x = 0
    this.camera.up.y = 0
    this.camera.up.z = 1
    this.camera.position.set(x, y, z)
    this.camera.lookAt(0, 0, 0)
  }

  setLight() {
    const { color = 0xffffff, intensity = 0.5 } = this.options.light || {}
    const directionalLight = new THREE.DirectionalLight(color, intensity)
    this.scene.add(directionalLight)
  }

  setHelper() {
    const axesHelper = new THREE.AxesHelper(5)
    this.scene.add(axesHelper)
  }
}

export default Map3D
