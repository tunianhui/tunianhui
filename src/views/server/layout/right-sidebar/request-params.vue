<template>
  <section class="request-params">
    <header class="mb-10 header">请求参数</header>
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
              <el-option :label="item.value" :value="item.key" v-for="item in dics.data_type" :key="item.value"></el-option>
            </el-select>
            <OverflowTooltip v-if="flag==='detail'" class="width">{{scope.row.param_type}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="is_require" label="是否必填">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.is_require"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="demo_value" label="示例值">
          <template slot-scope="scope">
            <el-input v-model="scope.row.demo_value" v-if="flag==='add'||flag==='edit'"></el-input>
            <OverflowTooltip v-if="flag==='detail'" class="width">{{scope.row.demo_value}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="default_value" label="默认值">
          <template slot-scope="scope">
            <el-input v-model="scope.row.default_value" v-if="flag==='add'||flag==='edit'"></el-input>
            <OverflowTooltip v-if="flag==='detail'" class="width">{{scope.row.default_value}}</OverflowTooltip>
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
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button icon="el-icon-plus" @click="addParam" class="mt-10 ml-10">新增参数</el-button>

    <header class="mt-20 mb-10 header">常量参数</header>
    <div class="pr-20 pl-20">
      <el-table :data="tableData2" style="width: 100%">
        <el-table-column prop="param_name" label="参数名称">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.param_name}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="param_type" label="参数类型">
          <template slot-scope="scope">
            <el-select v-model="scope.row.param_type" slot="prepend" placeholder="请选择" v-if="flag==='add'||flag==='edit'">
              <el-option :label="item.value" :value="item.key" v-for="item in dics.data_type" :key="item.value"></el-option>
            </el-select>
            <OverflowTooltip v-if="flag==='detail'" class="width">{{scope.row.param_type}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="is_require" label="是否必填">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.is_require"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="default_value" label="默认值">
          <template slot-scope="scope">
            <el-input v-model="scope.row.default_value" v-if="flag==='add'||flag==='edit'"></el-input>
            <OverflowTooltip v-if="flag==='detail'" class="width">{{scope.row.default_value}}</OverflowTooltip>
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
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button @click.native.prevent="deleteRow2(scope.$index, tableData2)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button icon="el-icon-plus" @click="addParam2" class="mt-10 ml-10">新增参数</el-button>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'RequestParams',
  props: {
    flag: {
      type: String,
      default: 'add'
    },
    // 请求参数 --> 动态控制
    whereList: {
      type: Array,
      default: () => { }
    }
  },
  components: {
    OverflowTooltip
  },
  watch: {
    whereList: {
      handler (val) {
        this.tableData = val || []
      },
      deep: true,
      immediate: true
    },
    tableData: {
      handler (val) {
        // 请求参数更新
        this.$emit('editRow', { data: val, flag: 'where' })
      },
      deep: true
    },
    tableData2: {
      handler (val) {
        // 常量参数更新
        this.$emit('editRow', { data: val, flag: 'where' })
      },
      deep: true
    }
  },
  data () {
    return {
      // 请求参数
      tableData: [],
      // 常量参数
      tableData2: [],
      // 参数
      params: {
        default_value: 'bbb',
        demo_value: 'vvvv',
        is_require: true,
        param_class: 'hhhh',
        param_name: 'gggg',
        param_type: 'qqq',
        remark: 'aaa'
      },
      // 常量参数
      params2: {
        default_value: 'bbb',
        is_require: true,
        param_class: 'hhhh',
        param_name: 'abcdef',
        param_type: 'qqq',
        remark: 'aaa'
      }
    }
  },
  created () {
  },
  methods: {
    // 新增参数
    addParam () {
      this.tableData.push(this.params)
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },

    // 常量参数
    addParam2 () {
      this.tableData2.push(this.params2)
    },
    deleteRow2 (index, rows) {
      rows.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scope>
.request-params {
  .header {
    padding: 10px 20px;
    font-weight: 700;
  }
}
</style>
