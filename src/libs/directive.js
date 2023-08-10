import normalizeWheel from 'normalize-wheel'
import {
  once,
  on
} from './dom'

const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1

const directive = {
  'repeat-click': {
    bind(el, binding, vnode) {
      let interval = null
      let startTime
      const handler = () => vnode.context[binding.expression].apply()
      const clear = () => {
        if (new Date() - startTime < 100) {
          handler()
        }
        clearInterval(interval)
        interval = null
      }
      on(el, 'mousedown', (e) => {
        if (e.button !== 0) return
        startTime = new Date()
        once(document, 'mouseup', clear)
        clearInterval(interval)
        interval = setInterval(handler, 100, e)
      })
    }
  },
  'mousewheel': {
    bind(el, binding) {
      if (el && el.addEventListener) {
        el.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', function (event) {
          const normalized = normalizeWheel(event)
          binding.value && binding.value.apply(this, [event, normalized])
        })
      }
    }
  },
  /**
   * [页面元素权限判断是否显示]
   */
  'act-security': {
    inserted(el, binding, vnode) {
      // console.log(vnode.context.$store, el, binding, vnode)
      const value = binding.value

      if (typeof (value) === 'undefined' || value === '' || value === null) {
        return
      }

      // const isSystemEl = binding.modifiers.system === true
      const activeTab = vnode.context.$store.state.tabs.active_tab
      if (!activeTab.security) { // 如果没有元素权限
        // coding
        return
      }
      if (activeTab.security.indexOf(value) === -1) {
        vnode.componentInstance && vnode.componentInstance.$destroy()
        el.remove()
      }
    }
  }
}

export default function (Vue) {
  for (const name in directive) {
    Vue.directive(name, directive[name])
  }
}
