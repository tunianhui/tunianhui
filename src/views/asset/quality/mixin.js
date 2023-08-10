import Head from '@c/head.vue'
import FilterFieldCard from '@c/filter-card'
import OverflowTooltip from '@c/overflow-tooltip'
import TableCell from './table-cell'
import SelectFooter from './footer'
import Dialog from './dialog'
import AddRuleDialog from './add-rule'
import {
  on,
  off
} from '@/libs/dom'
import storage from '@/libs/storage'
export default {
  components: {
    Head,
    FilterFieldCard,
    OverflowTooltip,
    TableCell,
    SelectFooter,
    Dialog,
    AddRuleDialog
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
      multipleSelection: [],
      isIndeterminate: false,
      isFilterTableData: true,
      rulesListVisible: false,
      curRulesListData: {}
    }
  },
  watch: {
    multipleSelection: {
      deep: true,
      handler(val) {
        if (val.length === 0 || val.length === this.tableData.length) {
          this.isIndeterminate = false
        } else if (val.length < this.tableData.length) {
          this.isIndeterminate = true
        }
      }
    }
  },
  created() {
    if (this.key) {
      const rulesConfig = storage.get(this.key)
      if (rulesConfig) {
        this.rulesListVisible = rulesConfig.visible
        this.curRulesListData = rulesConfig.data
      } else {
        this.rulesListVisible = false
      }
    }
  },
  mounted() {
    on(this.$refs.quality, 'scroll', this.handleScroll)
  },
  beforeDestroy() {
    off(this.$refs.quality, 'scroll')
  },
  methods: {
    _delCheckRule(row) {
      this.visible = true
      this.title = '删除规则'
      this.curData = row
      this.textTitle = '是否确认删除该质量规则对象？'
      this.textDes = '删除该质量规则对象，将同时删除该对象下的质量规则。'
      this.fn = this.delCheckRule
    },
    checkAllChange(boolean) {
      if (boolean) {
        this.tableData.forEach(item => {
          this.$refs.multipleTable.toggleRowSelection(item)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchOpen() {
      this.visible = true
      this.title = '开启校验'
      this.curData = this.multipleSelection
      this.textTitle = '是否确认开启校验？'
      this.textDes = '开启后，后台自动进行数据校验'
      this.fn = this.batchOpenCheckRule
    },
    batchDel() {
      this.visible = true
      this.title = '删除规则'
      this.curData = this.multipleSelection
      this.textTitle = '是否确认删除该质量规则对象？'
      this.textDes = '删除该质量规则对象，将同时删除该对象下的质量规则。'
      this.fn = this.batchDelCheckRule
    },
    close(flag) {
      this.visible = false
      if (flag) {
        this.getTableList()
      }
    },
    async handleScroll(e) {
      // if (e.target.scrollTop > this.$refs.card.$el.clientHeight + 88) {
      //   this.fixed = true
      // } else {
      //   this.fixed = false
      // }
      // let dom = this.$refs.alarm
      // const scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight
      // if (scrollDistance <= 0) {
      //   if (this.currentPage < Math.ceil(this.total / this.pageRow)) {
      //     this.currentPage++
      //     await this.getTableList()
      //     dom.scrollTop = dom.scrollTop - dom.scrollHeight / this.currentPage
      //   }
      // }
      const scrollTop = e.target.scrollTop,
        headHeight = this.$refs.head.$el.clientHeight,
        filterFieldCardHeight = this.$refs.filterFieldCard.$el.clientHeight
      if (scrollTop > headHeight + filterFieldCardHeight) {
        this.fixed = true
      } else {
        this.fixed = false
      }
    },
    toRulesConfigHandle(row) {
      this.rulesListVisible = true
      storage.set(this.key, {
        visible: true,
        data: row
      })
      this.curRulesListData = row
    },
    goBack() {
      this.rulesListVisible = false
      storage.set(this.key, {
        visible: false,
        data: {}
      })
      this.getTableList()
    }
  }
}
