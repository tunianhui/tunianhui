<template>
  <section class="response">
    <header class="mb-10 header">返回参数</header>
    <div class="pr-20 pl-20">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="param_name" label="参数名称">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.param_name}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="param_type" label="参数类型">
          <template slot-scope="scope">
            <el-select v-model="scope.row.param_type" slot="prepend" placeholder="请选择" v-if="flag==='add'||flag==='edit'">
              <el-option :label="item.value" :value="item.key" v-for="item in dics.data_type" :key="item.key"></el-option>
            </el-select>
            <OverflowTooltip v-if="flag==='detail'" class="width">{{scope.row.param_type}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="demo_value" label="示例值">
          <template slot-scope="scope">
            <el-input v-model="scope.row.demo_value" v-if="flag==='add'||flag==='edit'"></el-input>
            <OverflowTooltip v-if="flag==='detail'" class="width">{{scope.row.demo_value}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" v-if="flag==='add'||flag==='edit'"></el-input>
            <OverflowTooltip v-if="flag==='detail'" class="width">
              {{scope.row.remark}}
            </OverflowTooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'return',
  props: {
    flag: {
      type: String,
      default: ''
    },
    selectList: {
      type: Array
    }
  },
  components: {
    OverflowTooltip
  },
  watch: {
    selectList: {
      handler (val) {
        this.tableData = val
        this.$emit('editRow', { data: this.tableData, flag: 'select' })
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      tableData: []
    }
  },
  created () {
  }
}
</script>

<style lang="scss" scope>
.response {
  .header {
    padding: 10px 20px;
    font-weight: 900;
  }
}
</style>
