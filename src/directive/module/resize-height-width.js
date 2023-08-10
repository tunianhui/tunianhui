/*
 * @Author: 大炸鹅
 * @Date: 2023-01-07 17:56:10
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-11 17:58:49
 * @FilePath: \数据智能构建\src\directive\module\resize-height-width.js
 */
export default {
  bind(el, binding) {
    let height = '', width = ''
    function isReize() {
      const style = document.defaultView.getComputedStyle(el) || {}
      if (height !== style.height || width !== style.width) {
        binding.value({height: style.height, width: style.width})
      }
      height = style.height
      width = style.width
    }
    el.__vueSetInterval__ = setInterval(isReize, 50)
  },
  unbind(el) {
    clearInterval(el.__vueSetInterval__)
  }
}