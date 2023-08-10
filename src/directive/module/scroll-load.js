import {on, off} from '@/libs/dom'

export default {
  bind(el, binding, vnode) {
    if (typeof binding.value !== 'function') {
      throw new Error('scroll-load指令的配置必须是个函数')
    } else {
      const vm = vnode.context
      vm.$nextTick(_ => {
        el.__load = binding.value
        el.__scrollHandle = ev => {
          const distance = el.scrollHeight - el.scrollTop - el.clientHeight
          if (distance <= 0) {
            el.__load()
          }
        }
        on(el, 'scroll', el.__scrollHandle.bind(vm))
      })
    }
  },
  unbind(el, binding, vnode) {
    off(el, 'scroll', el.__scrollHandle)
    el.__scrollHandle = null
  }
}
