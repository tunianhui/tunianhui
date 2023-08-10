import * as THREE from 'three'
import * as colorFns from '../tool/color'
import * as tools from './tools'
// import { requestAnimationFrame, on, off, setStyles } from '@/libs/dom'
// import { addOrbit, addGui, addTween, addStats } from '../tool/util'
import EventEmitter from '@/libs/event-emitter'
// import {getType} from '@/libs/util'
import Three from '../tool/three'

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
export default class VThree extends Three {
  constructor(el, options, Vue = {}) {
    super(el, options)

    Vue.eventEmitter = new EventEmitter()
    this.Vue = Vue
    this.THREE = THREE

    Object.assign(this.options, options)
    // options 中的beforeTrender, trender, createCamera主要是提供给v-three 指令使用, 这里给它们改变了它们执行时的this指向
    // this.bind(this.options.beforeTrender)
    // this.bind(this.options.trender)
    // this.bind(this.options.createCamera)

    // 工具方法
    this.tu = {}
    this.addUtils(colorFns)
    this.addUtils(tools)

    this.init()
  }

  async init() {
    const { beforeTrender } = this.options

    await this.necessaryInit()

    this.Vue && this.bindVue()
    const _beforeTrender = beforeTrender || this.beforeTrender.bind(this)
    await _beforeTrender()
    this.emit('ready')
    this.Vue.eventEmitter.emit('ready')

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
  // 子类覆盖
  beforeTrender() {}

  // 子类覆盖
  render() {
    this.options.trender && this.options.trender()
  }

  // 子类覆盖使用
  setCamera() {
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

  getHexString(hex) {
    return `#${new THREE.Color(hex).getHexString()}`
  }

  // utils Object类型
  addUtils(utils) {
    Object.keys(utils).forEach(key => {
      this.tu[key] = utils[key]
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
}
