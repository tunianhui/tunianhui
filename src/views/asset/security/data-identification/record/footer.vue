<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:48:05
 * @LastEditTime: 2023-07-26 15:34:09
 * @Description:
-->

<template>
  <section class="select-footer">
    <div>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
        <span class="font-12">选中 {{multipleSelection.length}} 个</span>
      </el-checkbox>
      <el-popover :disabled="multipleSelection.length===0" placement="top" width="15" trigger="hover">
        <div class="ml-10" @click="handleCommand('a')">
          <i class="iconfont icon-lock-line font-14 color-btn mr-5"></i>
          <span class="m1-5">锁定</span>
        </div>
        <div class="ml-10" @click="handleCommand('b')">
          <i class="iconfont icon-unlock font-14 color-btn mr-5"></i>
          <span class="m1-5">解锁</span>
        </div>
        <el-button slot="reference" type="text" class="ml-10">
          <i class="iconfont icon-lock-line font-14 color-btn"></i>
          <span class="color-btn ml-5">锁定识别规则</span>
        </el-button>
      </el-popover>
      <el-button type="text" :disabled="multipleSelection.length===0" @click="handleEdit" class="ml-10">
        <i class="el-icon-edit-outline font-12 color-btn"></i>
        <span class="color-btn ml-5">更改识别模式</span>
      </el-button>
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
      checkAll: false,
      activeIndex: 1
    }
  },
  methods: {
    handleCommand (command) {
      if (command === 'a') {
        this.batchDel()
      } else if (command === 'b') {
        this.batchRecover()
      }
    },
    handleEdit () {
      this.$emit('handleEdit')
    },
    handleCheckAllChange (val) {
      this.$emit('checkAllChange', val)
    },
    batchRecover () {
      this.$emit('batchRecover')
    },
    batchDel () {
      this.$emit('batchDel')
    },
    getTableList () {
      this.$emit('sendTableList', this.pageFilters)
    }
  }
}
</script>
