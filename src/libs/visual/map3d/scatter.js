import * as THREE from 'three'
import _ from 'lodash'
import lightray from './images/lightray.jpg'
const _animationEasing = 'linear',
  _animationDuration = 1500,
  SCATTER = 'scatter',
  symbolMap = {
    triangle: 3,
    diamond: 6,
    hexagon: 6,
    circle: 100
  }

export default class Scatter {
  constructor(context, options) {
    const color = '#6DE8F3',
      scatterOpt = {
        show: true,
        effectType: 'ripple', // ripple | none
        size: 6,
        coordinate: '',
        color,
        // triangle(3) | diamond(6) === hexagon | 传2-7的数字
        symbol: 'circle',
        effect: {
          period: 4, // max 7
          brushType: 'stroke', // fill | stroke
          scale: 2.5
        },
        offset: [0, 0, 0],
        lightray: {
          show: false,
          texture: lightray,
          color,
          opacity: 1,
          width: 12,
          height: 60,
          widthSegments: 1,
          heightSegments: 1
        },
        animationEasing: _animationEasing,
        animationDuration: _animationDuration
      },
      defaultOptions = {
        ...scatterOpt,
        data: [
          // { name: '北京市', ...scatterOpt }
        ]
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
        _.merge({}, scatterOpt, item)
      ))
    this.options = _.merge({}, defaultOptions, _.omit(options, ['data']))
    _.extend(this, _.pick(context, necessaryExtendProps))
    this.context = context
    this.init()
  }

  init() {
    this.rippleGroup = []
    this.textures = []
    this.lightrays = []
    this.options &&
      this.options.data.forEach(item => {
        const group = new THREE.Group(),
          {
            show,
            name,
            color,
            symbol,
            size,
            offset,
            effectType,
            effect,
            center,
            lightray
          } = item,
          position = center
            ? this.context.coordToVector3(center.slice(0, 2), center[3])
            : this.mapCenterVectors[name]
        this.lightrays.push({
          name,
          options: lightray,
          position
        })
        if (offset && Array.isArray(offset)) {
          offset[0] && (position[0] += offset[0])
          offset[1] && (position[1] += offset[1])
          offset[2] && (position[2] += offset[2])
        }
        position[2] += 0.1 / this.mapZoom
        const options = {
            position,
            color,
            show,
            segments: typeof symbol === 'number' ? symbol : symbolMap[symbol],
            size: size / this.mapZoom
          },
          mesh = this.drawRegularPolygonMesh({...options}),
          model = this.scene.getObjectByName(name) || this.scene
        mesh.name = 'scatter'
        group.name = `${name}_${SCATTER}`
        group.add(mesh)
        if (effectType === 'ripple') {
          const {period, brushType, scale} = effect,
            // seg = scale / period,
            drawFn =
              brushType === 'fill'
                ? 'drawRegularPolygonMesh'
                : 'drawRegularPolygonLine'
          Array.from({length: period - 1}).forEach((item, i) => {
            const mesh = this[drawFn]({...options})
            mesh.name = 'effectScatter'
            group.add(mesh)
          })
          group.scaleEnd = scale
          this.rippleGroup.push(group)
        }
        model.add(group)
      })
    this.drawLightrays()
    this.effectScatterRipple()
  }

  effectScatterRipple() {
    !this.rippleGroupTween && (this.rippleGroupTween = new this.TWEEN.Group())
    this.rippleGroupTween.removeAll()
    const {
        animationEasing = _animationEasing,
        animationDuration = _animationDuration
      } = this.options,
      easing = this.tweenEasing[animationEasing]
    this.rippleGroup.forEach(group => {
      const meshes = group.children
      if (meshes) {
        const scale = group.scaleEnd,
          delay = animationDuration / meshes.length
        meshes.forEach((mesh, i) => {
          if (mesh.name === 'effectScatter') {
            const start = {
                scale: 1,
                opacity: 1
              },
              end = {
                scale,
                opacity: 0
              }
            new this.TWEEN.Tween(start, this.rippleGroupTween)
              .to(end, animationDuration)
              .easing(easing)
              .delay(delay * i)
              .repeat(Infinity)
              // .yoyo(true)
              .onUpdate(obj => {
                const {scale, opacity} = obj
                // console.log(scale, opacity)
                mesh.material.opacity = opacity
                mesh.scale.set(scale, scale, scale)
              })
              .start()
          }
        })
      }
    })
    new this.TWEEN.Tween(this, this.rippleGroupTween)
      .to({}, animationDuration)
      .delay(animationDuration)
      .start()
  }

  render() {
    this.rippleGroupTween && this.rippleGroupTween.update()
  }

  // 画多边形
  drawRegularPolygonMesh({size = 6, segments = 6, color, position, show}) {
    const geometry = new THREE.CircleBufferGeometry(size, segments),
      material = new THREE.MeshBasicMaterial({
        color,
        transparent: true
      }),
      mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(...position)
    mesh.visible = show
    return mesh
  }
  // 画多边形的边线
  drawRegularPolygonLine({size = 8, segments = 6, color, position, show}) {
    const geometry = new THREE.CircleGeometry(size, segments),
      material = new THREE.MeshBasicMaterial({
        color,
        transparent: true
      })
    geometry.vertices.shift()
    const line = new THREE.LineLoop(geometry, material)
    line.position.set(...position)
    line.visible = show
    return line
  }

  async drawLightrays() {
    for (let value of this.lightrays) {
      await this.drawLightray(value)
    }
  }

  async drawLightray({name, options, position}) {
    const {texture: src, width, height} = options
    let texture = this.textures.find(t => t.name === src)
    if (!texture) {
      texture = await this.textureLoader(src)
      texture.name = src
      this.textures.push(texture)
    }
    const lightray1 = this.drawPlane({
        ...options,
        texture,
        position,
        width: width / this.mapZoom,
        height: height / this.mapZoom
      }),
      model = this.scene.getObjectByName(name) || this.scene
    lightray1.name = `${name}_lightray`
    const lightray2 = lightray1.clone()
    lightray2.rotation.y = Math.PI / 2
    // if (model) {
    //   model.add(lightray1)
    //   model.add(lightray2)
    // } else {
    //   this.scene.add(lightray1)
    //   this.scene.add(lightray2)
    // }
    model.add(lightray1)
    model.add(lightray2)
  }

  drawPlane({
    position = [0, 0, 0],
    show = true,
    color = 'red',
    width = 6,
    height = 10,
    widthSegments = 1,
    heightSegments = 1,
    opacity = 1,
    texture = ''
  }) {
    const geometry = new THREE.PlaneGeometry(
        width,
        height,
        widthSegments,
        heightSegments
      ),
      material = new THREE.MeshLambertMaterial({
        map: texture,
        // emissiveMap: texture,
        // emissive: color,
        // emissiveIntensity: 1,
        // opacity,
        color,
        depthTest: false,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      })
    // texture && (material.map = texture)
    const plane = new THREE.Mesh(geometry, material),
      [x, y, z] = position
    plane.position.set(x, y, z + height / 2 + 0.01)
    plane.rotation.x = Math.PI / 2
    plane.rotation.z = Math.PI
    // plane.rotation.y = Math.PI / 2
    plane.visible = show
    return plane
  }
}
