<!--
 * @Author: cxm
 * @LastEditors: YONG
 * @Date: 2021-08-10 17:44:11
 * @LastEditTime: 2022-11-02 16:21:29
 * @Description:
-->
<template>
  <section class="select-footer">
    <div>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">本页全选</el-checkbox>
      <el-button type="text" :disabled="multipleSelection.length===0" @click="batchOpen">
        <i class="el-icon-switch-button font-12 color-btn mr-5"><span class="ml-5
        ">开启</span></i>
      </el-button>
      <el-button type="text" :disabled="multipleSelection.length===0" @click="batchClose">
        <i class="el-icon-circle-close font-12 color-btn mr-5"><span class="ml-5
        ">关闭</span></i>
      </el-button>
      <el-button type="text" :disabled="multipleSelection.length===0" @click="batchDel">
        <i class="el-icon-delete font-12 color-btn mr-5"><span class="ml-5
        ">删除</span></i>
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
    isIndeterminate: Boolean
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
      // isIndeterminate: false,
      checkAll: false
    }
  },
  methods: {
    handleCheckAllChange (val) {
      this.$emit('checkAllChange', val)
    },
    batchOpen () {
      this.$emit('batchOpen')
    },
    batchClose () {
      this.$emit('batchClose')
    },
    batchDel () {
      this.$emit('batchDel')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
