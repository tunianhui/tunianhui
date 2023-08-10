<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-19 09:53:43
 * @LastEditTime: 2022-11-02 16:22:56
 * @Description:
-->

<template>
  <section class="footer">
    <div>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>

      <el-button type="text"  @click="batchDel" class="ml-10">
        <span class="ml-5
        ">批量清除</span>
      </el-button>
      <el-button type="text" @click="batchRecover" class="ml-10">
        <span class="ml-5
        ">批量恢复</span>
      </el-button>
    </div>
    <div class="font-14">已选中 {{multipleSelection.length}} 个</div>
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
      this.$emit('batchRecover', '恢复')
    },
    batchDel () {
      this.$emit('batchDel', '清除')
    }
  }
}
</script>

<style lang="scss" scoped>
.footer{
  display: flex;
  .ml-10{
    font-size: 14px;
    // color: #567B9E;
    color: #606266;
    .ml-5:hover{
      color: blue;
    }
  }
  .font-14{
    color: #606266;
    margin-left: 30px;
    line-height: 30px;
    align-items: center;
  }
}
</style>
