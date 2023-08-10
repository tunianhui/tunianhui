import * as THREE from 'three'
import * as colorFns from '../tool/color'
import * as tools from './tools'
import { requestAnimationFrame, on, off, setStyles } from '@/libs/dom'
import {addOrbit, addGui, addTween, addStats} from '../tool/util'
import EventEmitter from '@/libs/event-emitter'
// import {getType} from '@/libs/util'

/**
 * VThree
 *
 * 帮助初始化renderer/scene/camera(OrthographicCamera)
 * 绑定window.onresize事件， 执行render函数
 *
 * options = {
 *   background: 0xffffff,
 *   rendererOptions: {
 *     // 使线条平滑
 *     antialias: true,
 *     alpha: true
 *   },
 *   beforeTrender(), 在render之前执行，可以是异步函数async 或 promise
 *   trender() //_render中执行的函数
 *   createCamera()  修改默认的camera，为 OrthographicCamera时aspect必传，window.resize是需要用到
 * }
 * options中 stats ,gui orbit tween 为true时， 会引入相对应的包
 *
 * 异步获取的数据可以通过this.eventEmitter.on('ready', callback) callback回调函数中执行 文字 | 图形大小 的渲染，此事件表示scene|camera|renderer等都已加载完成
 *
 * 工具函数：tu
 * getIntersects
 * promisify
 * loaderPromisify
 * registerMouseEvent 给canvas注册鼠标事件
 *
 * gui 设置的数据显示小数点，初始值保留n小数，显示的值则保留 n 位小数，初始值没有小数，显示值则不会保留小数
 *
 * tween chain 使用时注意开始属性，会变成to中设置的属性，所以如果用chain时，开始属性直接使用物体的属性，to属性使用自定义的值
 *
 * init完成后会触发ready事件，可以在Vue组件或者实例中调用 this.emitter.on('ready', _ => {})事件
 *
 * 性能优化：
 * 多用Mesh.copy()
 * */
export default class VThree {
  constructor(el, options, Vue = {}) {
    this.el = el
    this.eventEmitter = new EventEmitter()
    Vue.eventEmitter = this.eventEmitter
    this.Vue = Vue

    setStyles(el, {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      position: 'relative'
    })
    this._setSize()

    const aspect = 2

    this.options = {
      stats: false,
      gui: false,
      tween: true,
      orbit: false,
      background: 0xffffff,
      rendererOptions: {
        // 在 css 中设置背景色透明显示渐变色
        antialias: true,
        // 开启抗锯齿,使线条平滑
        alpha: true
      },
      ftp: 60,
      // createCamera为 OrthographicCamera时aspect必传，window.resize是需要用到
      aspect,
      ...options
    }
    // options 中的beforeTrender, trender, createCamera主要是提供给v-three 指令使用, 这里给它们改变了它们执行时的this指向
    // this.bind(this.options.beforeTrender)
    // this.bind(this.options.trender)
    // this.bind(this.options.createCamera)

    this.f = Math.round(60 / this.options.ftp)
    this.skip = 0
    // 存储鼠标事件
    this._mouseEvents = []
    // 工具方法
    this.tu = {}
    this.addUtils(colorFns)
    this.addUtils(tools)
  }

  async init() {
    const {
      stats,
      gui,
      tween,
      orbit,
      beforeTrender,
      createCamera
    } = this.options

    this.gui && this.gui.destroy()

    this.THREE = THREE
    this._initRenderer()
    this.scene = new THREE.Scene()

    createCamera ? createCamera() : this.createCamera()
    this.scene.add(this.camera)

    // this.addLight()
    if (process.env.NODE_ENV === 'development') {
      if (stats) await addStats(this)
      if (gui) await addGui(this)
    }
    if (tween) await addTween(this)
    if (orbit) await addOrbit(this)

    // this.addHelper()
    this.Vue && this.bindVue()
    const _beforeTrender = beforeTrender || this.beforeTrender.bind(this)
    await _beforeTrender()
    this.eventEmitter.emit('ready')

    this._resize && on(window, 'resize', this._resize.bind(this))
    this._render()
  }

  bindVue() {
    ;[
      'rendererSize',
      'tu',
      'stats',
      'gui',
      'tween',
      'orbit',
      'TWEEN',
      'tweenEasing',
      'THREE',
      'scene',
      'camera',
      'renderer',
      'registerMouseEvent',
      'getIntersects',
      'removeGroup',
      'tdestroy',
      'getHexString'
    ].forEach(key => {
      this[key] &&
        (this.Vue[key] =
          typeof this[key] === 'function' ? this[key].bind(this) : this[key])
    })
  }

  bind(callback) {
    callback && (callback = callback.bind(this))
  }
  // 给继承的子类覆盖使用
  beforeTrender() {}

  // 给继承的子类覆盖使用
  trender() {}

  getHexString(hex) {
    return `#${new THREE.Color(hex).getHexString()}`
  }

  // 给继承的子类覆盖使用
  createCamera() {
    const { width, height } = this.rendererSize
    const aspect = this.options.aspect
    this.camera = new THREE.OrthographicCamera(
      -width / aspect,
      width / aspect,
      height / aspect,
      -height / aspect,
      0,
      2000
    )
  }

  // utils Object类型
  addUtils(utils) {
    Object.keys(utils).forEach(key => {
      this.tu[key] = utils[key]
    })
  }

  // flag 是否获取事件的Mesh对象
  registerMouseEvent(eventType, callback, flag = true) {
    const canvas = this.renderer.domElement,
      fn = e => {
        flag && (e.intersects = this.getIntersects(e))
        callback && callback.call(this, e)
      }
    on(canvas, eventType, fn)
    this._mouseEvents.push({ eventType: eventType, callback: fn })
  }

  /**
   * 获取鼠标事件产生的 THREE.Object3D对象
   * 使用e.offsetX而不使用e.clientX是父元素相对屏幕的位置会有偏移，用clientX会导致Mesh定位不准
   * @param {鼠标事件对象} e
   * @return [Array] THREE.Object3D对象组成的数组
   */
  getIntersects(e) {
    const width = e.target.width,
      height = e.target.height,
      vector = new THREE.Vector2(
        (e.offsetX / width) * 2 - 1,
        -(e.offsetY / height) * 2 + 1
      ),
      raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(vector, this.camera)
    return raycaster.intersectObjects(this.scene.children, true)
  }
  // 删除THREE.Group对象
  // group THREE.Group 对象或者 group名称
  removeGroup(group) {
    group =
      group instanceof THREE.Group ? group : this.scene.getObjectByName(group)
    if (!group) return
    group.traverse(item => {
      if (item instanceof THREE.Mesh) {
        item.geometry.dispose()
        item.material.dispose()
      }
    })
    this.scene.remove(group)
  }
  // 清除WebGL上下文
  tdestroy() {
    if (!this.renderer) return
    const el = this.renderer.domElement.parentNode

    this._mouseEvents.forEach(({ eventType, callback }) => {
      off(this.renderer.domElement, eventType, callback)
    })
    this._mouseEvents = []
    this.renderer.forceContextLoss()
    this.renderer.context = null
    this.renderer.domElement = null
    this.renderer = null
    if (this.stats) {
      el.removeChild(this.stats.dom)
      this.stats = null
    }
    this.gui && this.gui.destroy()
    this._resize && off(window, 'resize', this._resize.bind(this))
  }

  _setSize() {
    this.rendererSize = Object.freeze({
      width: this.el.clientWidth,
      height: this.el.clientHeight
    })
  }

  _initRenderer() {
    const { width, height } = this.rendererSize
    this.renderer = new THREE.WebGLRenderer(this.options.rendererOptions)
    this.renderer.shadowMapSoft = true
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(this.options.background)
    this.el.appendChild(this.renderer.domElement)
    // this.renderer = renderer 这里不能这么写，渲染会有问题
  }

  _render() {
    if (!this.renderer) return
    // 根据otpions中的 ftp 做跳帧处理，优化
    if (this.skip !== 0 || this.f === 1) {
      this.options.trender ? this.options.trender() : this.trender()
      this.stats && this.stats.update()
      this.orbit && this.orbit.update()
      this.renderer.render(this.scene, this.camera)

      this.skip = ++this.skip % this.f
    } else {
      this.skip = ++this.skip % this.f
    }
    requestAnimationFrame(_ => this._render())
  }

  _resize() {
    if (!this || !this.renderer) return
    this._setSize()
    const { width, height } = this.rendererSize
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = width / height
    } else {
      const aspect = this.options.aspect
      this.camera.left = -width / aspect
      this.camera.right = width / aspect
      this.camera.top = height / aspect
      this.camera.bottom = -height / aspect
    }
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }
}
