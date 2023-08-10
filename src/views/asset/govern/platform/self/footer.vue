<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-19 09:53:43
 * @LastEditTime: 2022-11-02 16:22:46
 * @Description:
-->

<template>
  <section>
    <!-- <div>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-button type="text" :disabled="multipleSelection.length===0" @click="batchDel" class="ml-10">
        <i class="el-icon-delete font-12 color-btn mr-5"><span class="ml-5
        ">移入回收站</span></i>
      </el-button>
      <el-button type="text" :disabled="multipleSelection.length===0" @click="batchRecover">
        <i class="el-icon-refresh-right font-12 color-btn mr-5"><span class="ml-5
        ">生命周期</span></i>
      </el-button>
    </div> -->
    <div class="center">
      <div>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-button type="text" @click="batchDel" class="ml-10">
          <span class="ml-5
          ">批量线下治理</span>
        </el-button>
        <el-button type="text"  @click="batchRecover" class="ml-10">
          <span class="ml-5
          ">批量设置白名单</span>
        </el-button>
        <el-button type="text"  @click="resPerson" class="ml-10">
          <span class="ml-5 
          ">批量转交责任人</span>
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
    },
    resPerson() {
      this.$emit('resPerson')
    }
  }
}
</script>

<style lang="less" scoped>
.center{
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
