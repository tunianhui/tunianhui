<template>
  <div class="switch-options">
    <div class="tips">
      <i class="el-icon-warning-outline"></i>
      <span>
        条件表达式示例：${节点ID输出值名}>1,$输出值名>1(表示前续节点输出)。支持的操作符:==,!=,>,&lt;=,&lt;,&&,!,(),+.-,*,/,%
      </span>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :header-cell-style="{borderColor: '#ccc'}"
      :cell-style="{borderColor: '#ccc', backgroundColor: '#eee'}"
    >
      <el-table-column prop="date" label="分支" width="120"> </el-table-column>
      <el-table-column prop="name" label="条件表达式">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.name"
            placeholder="请输入条件表达式"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="描述">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.address"
            placeholder="请输入描述"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '分支1',
          name: '',
          address: ''
        },
        {
          date: '分支2',
          name: '',
          address: ''
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.switch-options {
  height: 400px;
  .tips {
    display: flex;
    align-items: center;
    height: 74px;
    background: rgba(63, 155, 249, 0.06);
    border: 1px solid #cccccc;
    padding: 0 15px;
    color: #409eff;
    line-height: 20px;
    margin-bottom: 20px;
    .el-icon-warning-outline {
      font-size: 24px;
      margin-right: 15px;
    }
  }
}
</style>

<style lang="scss">
.switch-options {
  .el-table--group,
  .el-table--border {
    border: 1px solid #cccccc;
  }
}
</style>
