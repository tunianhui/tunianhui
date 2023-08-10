/*
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-08-10 17:12:34
 * @LastEditTime: 2021-08-20 17:14:05
 * @Description:
 */
import FilterFieldCard from '@c/filter-card'
import TableCell from '@c/table-cell'
import OverflowTooltip from '@c/overflow-tooltip'
import {on, off} from '@/libs/dom'
import {types} from '@/config/asset-config'
import {
  getSubmitterList,
  getBusinessList,
  getCatalogList
} from '@/api/asset/standard/edition'
export default {
  components: {
    FilterFieldCard,
    OverflowTooltip,
    TableCell
  },
  inject: ['tabStore', 'attrStore'],
  data() {
    return {
      types,
      visible: false,
      ruleVisible: false,
      curData: null,
      textTitle: '',
      textDes: '',
      title: '',
      fn: null,
      multipleSelection: [],
      isIndeterminate: false,
      loading: 0,
      tableData: [],
      fixed: false,
      filterData: [],
      submitterList: [],
      businessList: [],
      catalogList1: [],
      catalogList2: [],
      catalogList3: []
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
  async created() {
    await this._getSubmitterList()
    await this._getBusinessList()
    await this._getCatalogList1()
    await this._getCatalogList2()
    await this._getCatalogList3()
    this.filterData = [
      {
        label: '最近提交人',
        id: '最近提交人',
        options: this.submitterList
      },
      {
        label: '最近提交时间',
        id: '最近提交时间',
        type: 'date'
      },
      {
        label: '业务板块',
        id: '业务板块',
        options: this.businessList
      },
      {
        label: '一级分类',
        id: '一级分类',
        options: this.catalogList1
      },
      {
        label: '二级分类',
        id: '二级分类',
        options: this.catalogList2
      },
      {
        label: '三级分类',
        id: '三级分类',
        options: this.catalogList3
      }
    ]
    this.getTableList()
  },
  mounted() {
    on(this.$refs.editionBox, 'scroll', this.handleScroll)
  },
  beforeDestroy() {
    off(this.$refs.editionBox, 'scroll')
  },
  methods: {
    _delCheckRule(row) {
      this.visible = true
      this.title = '删除记录'
      this.curData = row
      this.textTitle = '是否确认删除记录？'
      this.textDes = ''
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
    close(flag) {
      this.visible = false
      if (flag) {
        this.getTableList()
      }
    },
    async handleScroll(e) {
      const scrollTop = e.target.scrollTop,
        headHeight = this.$refs.head.clientHeight,
        filterFieldCardHeight = this.$refs.filterFieldCard.$el.clientHeight
      console.log(scrollTop, headHeight + filterFieldCardHeight)
      if (scrollTop > headHeight + filterFieldCardHeight) {
        this.fixed = true
      } else {
        this.fixed = false
      }
    },
    // 最近提交人
    async _getSubmitterList() {
      const params = {}
      const res = await this.$simpleAsyncTo(
        getSubmitterList(params),
        '获取失败'
      )
      if (res) {
        this.submitterList = res.data.map(item => {
          return {
            id: item.oper_user,
            label: item.oper_user
          }
        })
      }
    },
    // 业务板块
    async _getBusinessList() {
      const params = {}
      const res = await this.$simpleAsyncTo(getBusinessList(params), '获取失败')
      if (res) {
        this.businessList = res.data.map(item => {
          return {
            id: item.busin_id,
            label: item.busin_name
          }
        })
      }
    },
    // 一级分类
    async _getCatalogList1() {
      const params = {level: '1'}
      const res = await this.$simpleAsyncTo(getCatalogList(params), '获取失败')
      if (res) {
        this.catalogList1 = res.data.map(item => {
          return {
            id: item.catalog_id,
            label: item.catalog_name
          }
        })
      }
    },
    // 二级分类
    async _getCatalogList2() {
      const params = {level: '2'}
      const res = await this.$simpleAsyncTo(getCatalogList(params), '获取失败')
      if (res) {
        this.catalogList2 = res.data.map(item => {
          return {
            id: item.catalog_id,
            label: item.catalog_name
          }
        })
      }
    },
    // 三级分类
    async _getCatalogList3() {
      const params = {level: '3'}
      const res = await this.$simpleAsyncTo(getCatalogList(params), '获取失败')
      if (res) {
        this.catalogList3 = res.data.map(item => {
          return {
            id: item.catalog_id,
            label: item.catalog_name
          }
        })
      }
    }
  }
}
