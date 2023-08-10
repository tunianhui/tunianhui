<template>
  <div class="mapping-analysis height-100per flex-column">
    <div class="mapping-analysis-content">
      <el-steps :active="active" space="25%" :align-center="true">
        <el-step
          v-for="(item, index) in elSteps"
          :key="index"
          :title="item.title"
        ></el-step>
      </el-steps>
      <div v-if="active == 2">
        <el-alert
          title="已解析道如下数据源及库列表，请确认导入的目标数据源及库"
          type="warning"
          :closable="false"
          show-icon
        >
        </el-alert>
        <el-table :data="dataSourceData">
          <el-table-column prop="type"></el-table-column>
          <el-table-column prop="dataSource"></el-table-column>
          <el-table-column prop="libraryTable"></el-table-column>
          <el-table-column prop="owningLayer"></el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-select v-model="scope.row.targetDataSource">
                <el-option
                  v-for="(item, index) in targetDataSourceList"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-select v-model="scope.row.targetLibraryTable">
                <el-option
                  v-for="(item, index) in targetLibraryTableList"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="next">下一步</el-button>
      </div>
      <div v-if="active == 3">
        <el-dialog
          title="前置检测异常"
          :visible.sync="dialogVisible"
          width="30%"
        >
          <span>在xxxx-xx-xx xx:xx:xx检测完成时，发现如下异常内容</span>
          <el-table :data="abnormalResultsData">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="abnormalItem"></el-table-column>
            <el-table-column prop="abnormalContent"></el-table-column>
          </el-table>
          <span slot="footer">
            <el-button type="primary" @click="closeDialog">知道了</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import pager from '@/mixins/pager'

export default {
  name: 'MappingAnalysis',
  mixins: [pager],
  components: {},
  data() {
    return {
      active: 2,
      elSteps: [
        {title: '选择模版上传'},
        {title: '数据源映射'},
        {title: '解析结果'},
      ],
      dataSourceData: [
        {
          type: 'Hive',
          dataSource: 'por-张得十',
          libraryTable: 'training1',
          owningLayer: 'dwd',
          targetDataSource: '',
          targetLibraryTable: '',
        },
        {
          type: 'Hive',
          dataSource: 'por-张得九',
          libraryTable: 'training2',
          owningLayer: 'dwd',
          targetDataSource: '',
          targetLibraryTable: '',
        },
        {
          type: 'Hive',
          dataSource: 'por-张得八',
          libraryTable: 'training3',
          owningLayer: 'dwd',
          targetDataSource: '',
          targetLibraryTable: '',
        },
      ],
      targetDataSourceList: [
        {
          value: 'poe-张得十',
          label: 'poe-张得十',
        },
        {
          value: 'poe-张得百',
          label: 'poe-张得百',
        },
        {
          value: 'poe-张得千',
          label: 'poe-张得千',
        },
      ],
      targetLibraryTableList: [
        {
          value: 'training1',
          label: 'training1',
        },
        {
          value: 'training2',
          label: 'training2',
        },
        {
          value: 'training3',
          label: 'training3',
        },
      ],
      abnormalResultsData: [
        {
          abnormalItem: '表名不符合"拼接规则"',
          abnormalContent:
            '拼接规则：dwd_一级主题域缩写_表名主体；表名称：aaaaa；错误原因：表名所需字段数与规则字段数不匹配',
        },
        {
          abnormalItem: '未设置联合主键',
          abnormalContent: '',
        },
        {
          abnormalItem: '该分层下的表必须设置分区',
          abnormalContent: '',
        },
      ],
      dialogVisible: true,
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    next() {
      this.active = 3
    },
    closeDialog() {
      this.dialogVisible = false
    },
  },
}
</script>
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  overflow: hidden;
  overflow-y: auto;
  padding-left: 10px;
}
.page-title {
  margin-bottom: 50px;
}
</style>
<style lang="scss">
.mapping-analysis {
  .mapping-analysis-content {
  }
}
</style>
