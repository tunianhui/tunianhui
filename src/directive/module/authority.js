export default {
  bind(el, binding, vnode) {
    console.log('bind')
  },
  inserted(el, binding, vnode, oldVnode) {
    console.log('inserted')
  },
  update(el, binding, vnode) {
    console.log('update')
  },
  unbind(el, binding, vnode) {
    console.log(vnode, 'unbind')
    vnode.context.tdestroy && vnode.context.tdestroy()
  }
}
