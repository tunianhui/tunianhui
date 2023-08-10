import {preprocess, init, destory} from '@/libs/clipboard'

function getOptions(el, binding) {
  const value = binding.value || {
    value: el.textContent
  }
  return preprocess(value)
}

/**
 * clipboard指令 v-clipboard || v-clipboard="options"
 * 不传options则取el.textContent为值
 * options = {
 *  value:    /在输入框中使用v-model绑定的值/,
 *  success:  /复制成功后的回调/,
 *  error:    /复制失败后的回调/
 * }
 */
export default {
  bind(el, binding) {
    const options = getOptions(el, binding)
    if (!options) return
    init(el, options)
  },
  update(el, binding) {
    const options = getOptions(el, binding)
    if (!options) return
    el.__clipboard__.text = () => options.value
    el.__success_callback__ = options.success
    el.__error_callback__ = options.error
  },
  unbind(el, binding) {
    destory(el)
  }
}
