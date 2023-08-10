<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:50:41
 * @LastEditTime: 2023-05-24 16:29:59
 * @Description:
-->

<template>
  <section class="select-footer ">
    <div>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
        <span class="font-12">选中 {{multipleSelection.length}} 个</span>
      </el-checkbox>

      <el-button type="text" :disabled="multipleSelection.length === 0" @click="batchDel" class="ml-10">
        <i class="iconfont icon-lishibanben font-12 color-btn mr-5"><span class="ml-5
        ">续期</span></i>
      </el-button>
      <el-button type="text" :disabled="multipleSelection.length === 0" @click="batchRecover">
        <i class="iconfont icon-huifu font-12 color-btn mr-5"><span class="ml-5
        ">交还</span></i>
      </el-button>
    </div>
    <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>
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
    total: {
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
    batchRecover () {
      this.$emit('batchRecover')
    },
    batchDel () {
      this.$emit('batchDel')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
