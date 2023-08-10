/*
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-07-20 15:25:46
 * @LastEditTime: 2021-07-20 18:00:45
 * @Description:
 */
import {getCategoryList} from '@/api/asset/catalogue'
import FilterFieldCard from '@c/filter-card'
import OverflowTooltip from '@c/overflow-tooltip'
import Dialog from './dialog'
import {on, off} from '@/libs/dom'
export default {
  components: {
    FilterFieldCard,
    OverflowTooltip,
    Dialog
  },
  data() {
    return {
      visible: false,
      ruleVisible: false,
      curData: null,
      textTitle: '',
      textDes: '',
      title: '',
      fn: null,
      visibleEdit: false,
      visibleInfo: false,
      row: {},
      categoryList: []
    }
  },
  watch: {},
  created() {},
  mounted() {
    on(this.$refs.quality, 'scroll', this.handleScroll)
  },
  beforeDestroy() {
    off(this.$refs.quality, 'scroll')
  },
  methods: {
    _seeHandle(row) {
      this.visibleInfo = true
      this.row = row
    },
    _editHandle(row) {
      this.visibleEdit = true
      this.row = row
    },
    closeEdit() {
      this.visibleEdit = false
    },
    closeInfo() {
      this.visibleInfo = false
    },
    _offlineHandle(row) {
      let statusText = row.status === '0' ? '上线' : '下线'
      this.$confirm(`此操作将${statusText} 该API, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {})
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消${statusText}`
          })
        })
    },
    refresh() {
      this.visibleEdit = false
      this.getTableList()
    },
    close() {
      this.visible = false
      this.getTableList()
    },
    async handleScroll(e) {
      const scrollTop = e.target.scrollTop,
        headHeight = this.$refs.head.clientHeight,
        filterFieldCardHeight = this.$refs.filterFieldCard.$el.clientHeight
      if (scrollTop > headHeight + filterFieldCardHeight) {
        this.fixed = true
      } else {
        this.fixed = false
      }
    },
    // 所属类目
    async _getCategoryList() {
      const params = {}
      const res = await this.$simpleAsyncTo(getCategoryList(params), '获取失败')
      if (res) {
        this.categoryList = res.data.map(item => {
          return {
            id: item.catalog_id,
            label: item.catalog_name
          }
        })
      }
    }
  }
}
