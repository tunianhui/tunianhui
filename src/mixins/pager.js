/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-11-25 17:13:37
 * @LastEditTime: 2023-06-06 15:59:03
 * @Description:
 */
export default {
  data() {
    return {
      pageFilters: {
        pageSize: 10,
        pageNo: 1 // 前台分页使用
      },
      inputValue: 1,
      pageSizes: [10, 15, 20, 30, 50],
      total: 0,
      layout: 'total, prev, pager, next'
    }
  },
  methods: {
    // 一页显示多少条
    handleSizeChange(val) {
      this.pageFilters.pageSize = val
      this.handleCurrentChange(1)
    },
    // 上下页
    handleCurrentChange(val) {
      this.pageFilters.pageNo = val
      this.getTableList()
    }
  }
}
