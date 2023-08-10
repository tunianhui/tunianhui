import {
  errCb,
  asyncTo,
  sleep,
  simpleAsyncTo,
  encodeBase64,
  debounce,
  throttle,
  resetOtherFields,
  loop,
  highlightKeyword
} from './util'

export default {
  install(Vue) {
    Vue.prototype.$errCb = errCb
    Vue.prototype.$asyncTo = asyncTo
    Vue.prototype.$sleep = sleep
    Vue.prototype.$encodeBase64 = encodeBase64
    Vue.prototype.$simpleAsyncTo = simpleAsyncTo
    Vue.prototype.$debounce = debounce
    Vue.prototype.$throttle = throttle
    Vue.prototype.$resetOtherFields = resetOtherFields
    Vue.prototype.$loop = loop
    Vue.prototype.$highlightKeyword = highlightKeyword
  }
}
