<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-19 09:53:43
 * @LastEditTime: 2022-11-02 16:22:30
 * @Description:
-->

<template>
  <section>
    <div class="content">
      <div >
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-button type="text"  @click="batchDel" class="ml-10"><span class="ml-5">批量激活</span>
      </el-button>
      <el-button type="text" @click="batchRecover" class="ml-10">
       <span class="ml-5
        ">批量失效</span>
      </el-button>
      </div>
      <div class="font-12">已选中 {{multipleSelection.length}} 个</div>
    </div>
      
    
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
      checkAll: false,
    }
  },
  methods: {
    handleCheckAllChange (val) {
      this.$emit('checkAllChange', val)
    },
    batchRecover () {
      // this.$emit('batchRecover')
      this.$emit('batchDel', '失效')
    },
    batchDel () {
      this.$emit('batchDel', '激活')
    }
  }
}
</script>

<style lang="less" scoped>
.content{
  height: 30px;
  display: flex;
  .ml-10{
    font-size: 10px;
    // color: #567B9E;
    color: #606266;
    .ml-5:hover{
      color: blue;
    }
  }
  .font-12{
    color: #606266;
    margin-left: 30px;
    line-height: 30px;
    align-items: center;
  }
}
</style>
