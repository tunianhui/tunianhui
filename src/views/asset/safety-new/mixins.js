/*
 * @Author: 大炸鹅
 * @Date: 2022-10-24 15:45:23
 * @LastEditors: YONG
 * @LastEditTime: 2023-06-08 09:44:34
 * @FilePath: \智能数据构建\src\views\asset\safety-new\mixins.js
 */
import Header from '@c/header'
import TableCell from './table-cell.vue'
import {on, off} from '@/libs/dom'

export default {
  components: {
    Header,
    TableCell
  },
  mounted() {
    on(this.$refs.quality, 'scroll', this.handleScroll)
  },
  beforeDestroy() {
    off(this.$refs.quality, 'scroll')
  },
  methods: {
    async handleScroll(e) {
      const scrollTop = e.target.scrollTop,
        headHeight = this.$refs.head.$el.clientHeight,
        filterFieldCardHeight = this.$refs.filterFieldCard.$el.clientHeight
      if (scrollTop > headHeight + filterFieldCardHeight) {
        this.fixed = true
      } else {
        this.fixed = false
      }
    }
  }
}
