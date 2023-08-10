/*
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-05-28 10:00:04
 * @LastEditTime: 2020-07-30 13:34:45
 * @Description:
 */
import Vue from 'vue'
import Tabs from '@/libs/tabs'
import Layout from './main.vue'
import storage from '@/libs/storage'

// 获取数组中对象的map
function getArrayObjectMap(arr = [], result = {}) {
  return arr.reduce((prev, cur) => {
    prev[cur.value] = cur
    cur.children && getArrayObjectMap(cur.children, prev)
    return prev
  }, result)
}
/**
 * 提供给外部组建扩展layout组建
 * @param {String} key
 * @param {Object} data
 * @return Component
 */
export default function (key, data) {
  const tabStoreKey = `${key}TabStore`,
    attrStoreKey = `${key}AttrStore`,
    fileStoreKey = `${key}FileStore`,
    tabStore = Vue.observable(
      new Tabs({
        storeKey: tabStoreKey,
        mode: 'insert',
        ...(storage.get(tabStoreKey) || {})
      })
    ),
    attrStore = Vue.observable(
      new Tabs({
        storeKey: attrStoreKey,
        mode: 'insert',
        ...(storage.get(attrStoreKey) || {})
      })
    ),
    fileStore = Vue.observable(
      new Tabs({
        storeKey: fileStoreKey,
        mode: 'insert',
        ...(storage.get(fileStoreKey) || {})
      })
    ),
    editComponentsMap = getArrayObjectMap(data.editComponents)

  return {
    extends: Layout,
    name: key,
    provide: {
      tabStore,
      attrStore,
      fileStore,
      editComponentsMap,
      editComponents: data.editComponents,
      components: data.components
    },
    data() {
      return {
        tabStore,
        attrStore,
        fileStore,
        editComponentsMap,
        ...data
      }
    }
  }
}
