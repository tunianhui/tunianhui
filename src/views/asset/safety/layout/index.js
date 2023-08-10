import Vue from 'vue'
import Tabs from '@/libs/tabs'
import Layout from './main.vue'
import storage from '@/libs/storage'

// 获取数组中对象的map
// function getArrayObjectMap(arr = [], result = {}) {
//   return arr.reduce((prev, cur) => {
//     prev[cur.value] = cur
//     cur.children && getArrayObjectMap(cur.children, prev)
//     return prev
//   }, result)
// }
/**
 * 提供给外部组建扩展layout组建
 * @param {String} key
 * @param {Object} data
 * @return Component
 */
export default function(key, data) {
  const tabStoreKey = `${key}TabStore`,
    tabStore = Vue.observable(
      new Tabs({
        storeKey: tabStoreKey,
        mode: 'insert',
        ...(storage.get(tabStoreKey) || {})
      })
    )

  return {
    extends: Layout,
    name: key,
    provide: {
      tabStore,
      components: data.components
    },
    data() {
      return {
        tabStore,
        ...data
      }
    }
  }
}
