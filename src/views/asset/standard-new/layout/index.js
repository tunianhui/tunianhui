/*
 * @Author: 大炸鹅
 * @Date: 2022-10-25 14:46:20
 * @LastEditors: YONG
 * @LastEditTime: 2023-05-29 15:44:12
 * @FilePath: \智能数据构建\src\views\asset\safety-new\layout\index.js
 */
import Layout from '@/views/layout/sidemenu-layout.vue'
export default {
  extends: Layout,
  data() {
    return {
      showpadding: ['table', 'datasource-power', 'function', 'ability-power', 'dataserver-power'],
      isActive: false
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler(val) {
        const a = this.showpadding.some(d => {
          if (val.indexOf(d) > -1) {
            return true
          } else {
            return false
          }
        })
        this.isActive = a
      }
    }
  }
}
