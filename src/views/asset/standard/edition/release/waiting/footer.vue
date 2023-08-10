<!--
 * @Author: cxm
 * @LastEditors: YONG
 * @Date: 2021-08-10 17:44:11
 * @LastEditTime: 2022-11-02 16:25:09
 * @Description:
-->
<template>
  <section class="select-footer">
    <div>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-button type="text" :disabled="multipleSelection.length===0" @click="batchPublish">
        <i class="el-icon-s-promotion font-12 color-btn mr-5"><span class="ml-5
        ">发布</span></i>
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
        console.log(val.length, '===val.length===')
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
    batchPublish () {
      this.$emit('batchPublish')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
