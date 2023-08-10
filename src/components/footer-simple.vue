<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-07-25 14:14:30
 * @LastEditTime: 2023-07-25 16:28:45
 * @Description:
-->

<template>
  <section class="select-footer">
    <div>
      <slot></slot>
    </div>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 25, 50, 75, 100]" :page-size="pageFilters.pageSize" :current-page="pageFilters.pageNo" layout="total, prev, pager, next,sizes, jumper" :total="totalNum">
    </el-pagination>
  </section>
</template>

<script>
import pager from '@/mixins/pager'
export default {
  name: 'SelectFooter',
  mixins: [pager],
  props: {
    multipleSelection: Array,
    tableData: Array,
    isIndeterminate: {
      type: Boolean,
      default: false
    },
    totalNum: {
      type: Number,
      default: 0
    }
  },
  watch: {
    multipleSelection: {
      deep: true,
      handler (val) {
        if (val.length === this.tableData.length) {
          this.checkAll = true
        }
        if (val.length === 0) {
          this.checkAll = false
        }
      }
    }
  },
  data () {
    return {
      checkAll: false
    }
  },
  methods: {
    handleCheckAllChange (val) {
      this.$emit('checkAllChange', val)
    },

    getTableList () {
      this.$emit('sendTableList', this.pageFilters)
    }
  }
}
</script>
