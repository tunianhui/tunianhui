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

      <el-button v-if="tab === '1'" type="text" :disabled="multipleSelection.length === 0" @click="batchDel" class="ml-10">
        <i class="iconfont icon-lishibanben font-12 color-btn mr-5"><span class="ml-5
        ">续期</span></i>
      </el-button>
      <el-button v-if="tab === '1'" type="text" :disabled="multipleSelection.length === 0" @click="batchRecover">
        <i class="iconfont icon-huifu font-12 color-btn mr-5"><span class="ml-5
        ">交还</span></i>
      </el-button>
      <el-button v-if="tab === '2'" type="text" :disabled="multipleSelection.length === 0" @click="batchApply">
        <i class="iconfont icon-huifu font-12 color-btn mr-5"><span class="ml-5
        ">申请权限</span></i>
      </el-button>
    </div>
    <el-pagination
    background 
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 25, 50, 75, 100]"
      :page-size="pageFilters.pageSize"
      :current-page="pageFilters.pageNo"
      layout="total, prev, pager, next,sizes, jumper"
      :total="total">
    </el-pagination>
    <!-- <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination> -->
  </section>
</template>

<script>
import pager from '@/mixins/pager'
export default {
  name: 'SelectFooter',
  mixins: [pager],
  props: {
    tab: String,
    multipleSelection: Array,
    tableData: Array,
    isIndeterminate: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    },
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
  mounted() {
  },
  methods: {
    handleCheckAllChange (val) {
      this.$emit('checkAllChange', val)
    },
    batchRecover () {
      this.$emit('batchRecover')
    },
    batchApply() {
      this.$emit('batchApply')
    },
    batchDel () {
      this.$emit('batchDel')
    },
    getTableList() {
      this.$emit('sendValue', this.pageFilters)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
