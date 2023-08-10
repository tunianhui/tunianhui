<template>
  <div class="sql-mode height-100per flex-column">
    <div class="sql-mode-content">
      <div class="sql-editor" v-if="showSQLEditor == true">
        <el-alert
          title="当前输入框中‘库名 表名’即使修改，真正建表时也只会按照上一步中选择的库下配置的表名创建！"
          type="warning"
          show-icon
        >
        </el-alert>
        <div>
          <MonacoEditor :code.sync="sqlContent" style="height: 500px;"></MonacoEditor>
        </div>
        <el-alert
          style="margin-bottom: 0px"
          title="SQL解析错误，详细信息如下："
          type="error"
          v-if="tableStructureInfo != ''"
          :description="tableStructureInfo"
          show-icon
        >
        </el-alert>
        <el-button
          class="el-button-define"
          type="primary"
          @click="creatTableStructure"
          >生成表结构</el-button
        >
      </div>
      <div class="sql-editor-after" v-else>
        <el-button
          class="el-button-define"
          type="primary"
          @click="returnSQLEditor"
          >返回SQL编辑器</el-button
        >
        <el-collapse v-model="formActiveNames">
          <el-collapse-item :name="'1'">
            <span class="collapse-title" slot="title">字段配置</span>
            <el-table :data="columnInfo" style="width: 100%">
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column prop="column_code">
                <template slot="header"
                  >字段名称&nbsp;<el-icon class="el-icon-question"></el-icon
                ></template>
              </el-table-column>
              <el-table-column label="类型" prop="column_type" width="270px">
              </el-table-column>
              <el-table-column label="描述" prop="column_name">
              </el-table-column>
              <el-table-column label="主键" width="50">
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.is_primary"
                    :true-label="'0'"
                    :false-label="'1'"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot="header"
                  >标准化标签&nbsp;<el-icon class="el-icon-question"></el-icon
                ></template>
                <template slot-scope="scope">
                  <StandardizedLabel
                    :refID="
                      scope.row.column_id
                        ? scope.row.column_id
                        : scope.row.tempID
                    "
                    :selectedType="scope.row.selected_type"
                    :selectedValue="scope.row.selected_value"
                    :levelList="levelList"
                    @changeType="changeType($event, scope.row)"
                    @changeVal="changeVal($event, scope.row)"
                    @valChange="valChange($event, scope.row)"
                  ></StandardizedLabel>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="isHive">
              <el-table :data="partitionInfo" style="width: 100%">
                <el-table-column type="index" width="50"> </el-table-column>
                <el-table-column label="分区字段名称" prop="column_code">
                </el-table-column>
                <el-table-column label="类型" prop="column_type" width="270px">
                </el-table-column>
                <el-table-column label="描述" prop="column_name">
                </el-table-column>
                <el-table-column label="主键" width="50">
                  <template slot-scope="scope">
                    <el-checkbox
                      v-model="scope.row.is_primary"
                      :true-label="'0'"
                      :false-label="'1'"
                    ></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column label="标准化标签">
                  <template slot-scope="scope">
                    <StandardizedLabel
                      :refID="
                        scope.row.column_id
                          ? scope.row.column_id
                          : scope.row.tempID
                      "
                      :selectedType="scope.row.selected_type"
                      :selectedValue="scope.row.selected_value"
                      :levelList="levelList"
                      @changeType="changeType2($event, scope.row)"
                      @changeVal="changeVal2($event, scope.row)"
                      @valChange="valChange2($event, scope.row)"
                    ></StandardizedLabel>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-input
              v-else
              class="mt-10 ml-10 mr-10"
              type="textarea"
              :rows="5"
              placeholder="请输入分区信息内容"
              v-model="tableParam.table_properties"
            >
            </el-input>
          </el-collapse-item>
          <el-collapse-item :name="'3'">
            <span class="collapse-title" slot="title">基础属性设置</span>
            <el-form :data="tableParam" label-width="120px">
              <el-form-item label="核心表">
                <el-switch
                  v-model="tableParam.is_core_table"
                  :active-value="'0'"
                  :inactive-value="'1'"
                >
                </el-switch>
              </el-form-item>
              <el-form-item label="表类型" v-if="isHive">
                <el-radio-group v-model="tableParam.table_type">
                  <el-radio label="internal">内部表</el-radio>
                  <el-radio label="external">外部表</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="表生命周期">
                <el-radio-group v-model="tableParam.table_lifecycle_type" @input="changeTableLifecycleType">
                  <el-radio :label="'0'">永久</el-radio>
                  <el-radio :label="'1'"
                    >非永久<el-input
                      v-model="tableParam.table_lifecycle"
                      :disabled="tableParam.table_lifecycle_type == '0'"
                    ></el-input
                    ><span>天</span></el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="分区生命周期">
                <el-radio-group v-model="tableParam.part_lifecycle_type" @input="changePartLifecycleType">
                  <el-radio :label="'0'">永久</el-radio>
                  <el-radio :label="'1'"
                    >非永久<el-input
                      v-model="tableParam.part_lifecycle"
                      :disabled="tableParam.part_lifecycle_type == '0'"
                    ></el-input
                    ><span>天</span></el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="存储格式" v-if="isHive">
                <el-radio-group v-model="tableParam.storage_type">
                  <el-radio :label="'0'">Parquet</el-radio>
                  <el-radio :label="'1'">TextFile</el-radio>
                  <el-radio :label="'2'">SequenceFile</el-radio>
                  <el-radio :label="'3'">ORC</el-radio>
                  <el-radio :label="'4'">AVRO</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import StandardizedLabel from './components/standardized-label.vue'
import MoveUpDown from './components/move-up-down.vue'
import {mapGetters} from 'vuex'

import {
  queryDataType,
  queryLabelDim,
  queryLabelMeasure,
  createTableSqlParser,
} from '@/api/rd/table-manage.js'

export default {
  name: 'SQLMode',
  mixins: [pager],
  components: {
    StandardizedLabel,
    MoveUpDown,
  },
  props: {
    isHive: {
      type: Boolean,
      default: false,
    },
    sqlParams: {
      type: Object,
      default: () => {},
    },
    showSQLEditor: {
      type: Boolean,
      default: true,
    },
    table_basic: {
      type: Object,
      default: () => {},
    },
    column_info: {
      type: Array,
      default: () => [],
    },
    partition_info: {
      type: Array,
      default: () => [],
    },
    table_param: {
      type: Object,
      default: () => {},
    },
    isSave: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formActiveNames: '1',
      tableRowTypes: [],
      columnInfo: [
        {
          tempID: Date.now().toString(),
          column_code: '',
          column_type: '',
          column_name: '',
          is_primary: '1',
          label_dim_id: '',
          label_dim_name: '',
          label_measure_id: '',
          label_measure_name: '',
          selected_type: '2',
          selected_value: [],
        },
      ],
      partitionInfo: [
        {
          tempID: Date.now().toString(),
          column_code: '',
          column_type: '',
          column_name: '',
          is_primary: '1',
          label_dim_id: '',
          label_dim_name: '',
          label_measure_id: '',
          label_measure_name: '',
          selected_type: '2',
          selected_value: [],
        },
      ],
      tableParam: {
        is_core_table: '1',
        table_type: 'internal',
        table_lifecycle_type: '0',
        table_lifecycle: '',
        part_lifecycle_type: '0',
        part_lifecycle: '',
        storage_type: '0',
        table_properties: '',
      },
      sqlContent: '',
      levelList: [
        {
          code: '0',
          codeValue: '维度',
          placeholder: '请选择维度',
          options: [],
        },
        {
          code: '1',
          codeValue: '度量',
          placeholder: '请选择度量，表内不可重复',
          options: [],
        },
      ],
      tableStructureInfo: '',
    }
  },
  computed: {
    ...mapGetters(['project']),
  },
  watch: {
  },
  created() {
    this.queryDataType()
    this.getLevelList()
    if (this.isSave) {
      this.uncommittedOrReject()
    }
  },
  methods: {
    changeTableLifecycleType(type,val){
      if(type=='0' ){
        this.tableParam.table_lifecycle = ''
      }
    },
    changePartLifecycleType(type,val){
      if(type=='0' ){
        this.tableParam.part_lifecycle = ''
      }
    },
    uncommittedOrReject() {
      console.log('sql保存')
      this.sqlContent = this.table_basic.sql_context
      this.columnInfo = this.column_info
      this.partitionInfo = this.partition_info
      this.tableParam = {
        ...this.tableParam,
        ...this.table_param,
      }
    },
    async getLevelList() {
      let params = {
        project_id: this.project.project_id,
      }
      const resDim = await queryLabelDim(params)
      const resMeasure = await queryLabelMeasure(params)
      let tempDim, tempMeasure
      if (resDim.flag) {
        tempDim = resDim.data.child
      }
      if (resMeasure.flag) {
        tempMeasure = resMeasure.data.child
      }
      let tempDimArr = []
      let tempMeasureArr = []
      this.recursionData(tempDim, tempDimArr)
      this.recursionData(tempMeasure, tempMeasureArr)
      this.levelList[0].options = tempDimArr
      this.levelList[1].options = tempMeasureArr
    },
    recursionData(source, target) {
      source.forEach((i) => {
        const {id, name, type, child} = i
        let treeItem = {
          id,
          name,
          type,
          value: i.id,
          label: i.name,
          children: child || [],
        }
        if (child && child.length) {
          treeItem.children = []
          this.recursionData(child, treeItem.children)
        } else {
          delete treeItem.children
        }
        target.push(treeItem)
      })
    },
    collectData() {
      let allData = {}
      if (this.isHive) {
        delete this.tableParam.table_properties
        allData = {
          sql_context: this.sqlContent,
          column_info: JSON.stringify(this.columnInfo),
          partition_info: JSON.stringify(this.partitionInfo),
          table_param: JSON.stringify(this.tableParam),
        }
      } else {
        delete this.tableParam.table_type
        delete this.tableParam.storage_type
        allData = {
          sql_context: this.sqlContent,
          column_info: JSON.stringify(this.columnInfo),
          table_param: JSON.stringify(this.tableParam),
        }
      }
      return allData
    },
    async queryDataType() {
      let params = {
        datasource_type: '',
      }
      const res = await queryDataType(params)
      if (res.flag) {
        this.tableRowTypes = res.data.map((i) => {
          return {
            ...i,
            value: i.data_type,
            label: i.data_type,
          }
        })
      }
    },
    async creatTableStructure() {
      this.tableStructureInfo = ''
      let parmas = {
        ...this.sqlParams,
        sql: this.sqlContent,
      }
      this.$emit('req-start')
      const res = await createTableSqlParser(parmas)
      if (res.flag) {
        this.$emit('req-end')
        const {column_info, partition_info, table_param, table_name, sql} =
          res.data
        this.columnInfo = column_info
        this.partitionInfo = partition_info
        this.tableParam = table_param
        this.$emit('creatTableStructure', false)
      } else {
        this.$emit('req-end')
        this.tableStructureInfo = res.msg
      }
    },
    returnSQLEditor() {
      this.$emit('returnSQLEditor', true)
    },
    changeVal(v, row) {
      if (Array.isArray(v) && v.length == 0) {
        row.label_measure_id = ''
        row.label_measure_name = ''
        row.label_dim_id = ''
        row.label_dim_name = ''
      }
      row.selected_value = v
    },
    valChange(v, row) {
      if (row.selected_type == '0') {
        row.label_measure_id = ''
        row.label_measure_name = ''
        row.label_dim_id = v[0].value
        row.label_dim_name = v[0].label
      } else if (row.selected_type == '1') {
        row.label_measure_id = v[0].value
        row.label_measure_name = v[0].label
        row.label_dim_id = ''
        row.label_dim_name = ''
      }
    },
    changeVal2(v, row) {
      if (Array.isArray(v) && v.length == 0) {
        row.label_measure_id = ''
        row.label_measure_name = ''
        row.label_dim_id = ''
        row.label_dim_name = ''
      }
      row.selected_value = v
    },
    valChange2(v, row) {
      if (row.selected_type == '0') {
        row.label_measure_id = ''
        row.label_measure_name = ''
        row.label_dim_id = v[0].value
        row.label_dim_name = v[0].label
      } else if (row.selected_type == '1') {
        row.label_measure_id = v[0].value
        row.label_measure_name = v[0].label
        row.label_dim_id = ''
        row.label_dim_name = ''
      }
    },
    changeType(t, row) {
      let temp = '2'
      if (t == '0') {
        temp = '0'
      } else if (t == '1') {
        temp = '1'
      }
      row.selected_type = temp
    },
    changeType2(t, row) {
      let temp = '2'
      if (t == '0') {
        temp = '0'
      } else if (t == '1') {
        temp = '1'
      }
      row.selected_type = temp
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
.sql-mode {
  margin: 10px 0px 0px 40px;
  width: 95%;
  .sql-mode-content {
    .creat-table-engine {
      margin-bottom: 10px;
    }
    .el-button-define {
      margin: 10px 0px;
    }
  }
}
</style>
<style lang="scss" scoped>
::v-deep .collapse-title {
  flex: 1 0 90%;
  order: 1;
  .el-collapse-item__header {
    flex: 1 0 auto;
    order: -1;
  }
}
</style>