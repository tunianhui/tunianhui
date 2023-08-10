<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-19 09:53:43
 * @LastEditTime: 2022-11-02 16:22:30
 * @Description:
-->

<template>
  <section class="select-footer">
    <div>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-button type="text" :disabled="multipleSelection.length===0" @click="batchDel" class="ml-10">
        <i class="el-icon-delete font-12 color-btn mr-5"><span class="ml-5
        ">移入回收站</span></i>
      </el-button>
      <el-button type="text" :disabled="multipleSelection.length===0" @click="batchRecover">
        <i class="el-icon-refresh-right font-12 color-btn mr-5"><span class="ml-5
        ">生命周期</span></i>
      </el-button>
    </div>
    <div class="font-12">已选中 {{multipleSelection.length}} 个</div>
  </section>
</template>

<script>
export default {
  name: 'SelectFooter',
  props: {
    multipleSelection: Array,
    tableData: Array,
    isIndeterminate: {
      type: Boolean,
      default: false
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
