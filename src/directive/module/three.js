// import VThree from '@/libs/visual/v-three'
import VThree from '@/libs/v-three'

/**
 * threejs 指令 基于VThree类 v-three.stats.gui.orbit.tween="options"
 * stats.gui.orbit.tween 修饰符，会引入相对应的包
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
 *   beforeRender(), 在render之前执行，同步
 *   render() // _t_render中执行的函数
 * }
 *
 * 工具函数：
 * getIntersects
 * promisify
 * loaderPromisify
 * registerMouseEvent 给canvas注册鼠标事件,具体请查看 /libs/v-three
 * */
export default {
  bind(el, binding, vnode) {
    // console.log(el.parentNode, 'bind', el.clientWidth, el.clientHeight, el)
    // null "bind" 0 0 ==> 组件未创建 但可以获取到dom元素
  },
  inserted(el, binding, vnode, oldVnode) {
    console.time('insert')
    const vm = vnode.context,
      {modifiers = {}, value = {}} = binding,
      options = {...value, ...modifiers}
    // eslint-disable-next-line
    new VThree(el, options, vm)
    console.timeEnd('insert')
  },
  update(el, binding, vnode) {
    console.log('update')
  },
  unbind(el, binding, vnode) {
    console.log(vnode, 'unbind', vnode.context.destroy)
    vnode.context.tdestroy && vnode.context.tdestroy()
  }
}
