<template>
  <SimpleEditDialog
    :title="title"
    :visible.sync="isVisible"
    :parentClass="parentClass"
    @close="close"
    @confirm="confirm"
    width="75%"
    top="8vh"
    class="new-field-fact"
    ref="dialog"
    v-loading="loading"
  >
    <div class="new-field-top">
      <span class="mr-15 font-12">来源表类型：</span>
      <el-radio-group v-model="sourceTable" disabled>
        <el-radio label="0">引入字段</el-radio>
        <el-radio label="1">SQL自定义字段</el-radio>
      </el-radio-group>
    </div>
    <div class="edit-body" v-if="sourceTable === '0'" :style="{height: `${height}px`}">
      <div class="edit-body-left">
        <div class="edit-item">
          <span class="label">来源表：</span>
          <el-select v-model="table" @change="changeSourceTable" filterable>
            <el-option
              v-for="item in tables"
              :key="item.cube_id"
              :label="item.cube_code"
              :value="item.cube_id"
            ></el-option>
          </el-select>
        </div>
        <el-divider></el-divider>
        <template v-for="(item_field, index) in source_table_relation">
          <div :key="item_field.id">
            <div class="edit-item" v-if="showFieldConfig">
              <span class="label">来源表关联字段：</span>
              <el-select v-model="item_field.rel_element_id" @change="val => relElementIdChange(val, item_field)" filterable>
                <el-option
                  v-for="item in sourceFields"
                  :key="item.element_id"
                  :label="item.element_code"
                  :value="item.element_id + ''"
                ></el-option>
              </el-select>

              <el-tooltip content="即本表与当前主表关联时引用的字段" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </div>
            <div class="edit-item" v-if="showFieldConfig">
              <span class="label">主表关联字段：</span>
              <el-select v-model="item_field.masterId" @change="val => maseterFieldChange(val, item_field)" filterable>
                <el-option
                  v-for="item in masterFields"
                  :key="item.masterId"
                  :label="item.sql_context"
                  :value="item.masterId + ''"
                ></el-option>
              </el-select>
            </div>
            <div class="edit-item1" v-if="showFieldConfig">
              <span class="label">关联逻辑：</span>
              <div class="content">
                <div class="content-top" style="display: flex;font-weight: 900;">
                  <span style="width:180px;">已关联主表字段</span>
                  <span style="width:100px;margin-right:5px" class="ml-5">关联关系</span>
                  <span style="flex:1">已关联来源字段</span>
                </div>
                <div class="content-bottom mt-10">
                  <div class="mb-5">
                    <div style="width: 180px;padding-right:10px;display:flex;align-items:center">
                      <OverflowTooltip style="width: 180px">{{item_field.cube_code}}</OverflowTooltip>
                    </div>
                    <div style="width:100px" class="mr-5">
                      <el-select v-model="item_field.sql_rel_type" placeholder="请选择" @change="val => changeSqlRelType(val, item_field)">
                        <el-option
                          v-for="item in optionsRelType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                    <OverflowTooltip style="flex:1;display:flex;align-items:center">{{sourceTableName}}</OverflowTooltip>
                  </div>
                  <div>
                    <div style="width: 180px;padding-right:10px">
                      <el-input v-model="item_field.sql_context" placeholder="请输入内容" @input="val => custominput(val, item_field)"></el-input>
                    </div>
                    <div style="width:100px" class="mr-5">
                      <el-select v-model="item_field.related_expression" placeholder="请选择">
                        <el-option
                          v-for="item in operatorList"
                          :key="item.operator_code"
                          :label="item.operator_name"
                          :value="item.operator_code">
                        </el-option>
                      </el-select>
                    </div>
                    <el-input v-model="item_field.rel_sql_context" placeholder="请输入内容" @input="val => custominput(val, item_field)" style="flex:1"></el-input>
                  </div>
                  <!-- <div style="width:210px">
                    
                    <el-input v-model="item_field.sql_context" placeholder="请输入内容" @input="val => custominput(val, item_field)" style="width: 130px"></el-input>
                  </div>
                  <span style="width: 100px!important;display:inline-block" class="ml-5 mr-5">
                    <div>
                      <el-select v-model="item_field.related_expression" placeholder="请选择">
                        <el-option
                          v-for="item in operatorList"
                          :key="item.operator_code"
                          :label="item.operator_name"
                          :value="item.operator_code">
                        </el-option>
                      </el-select>
                    </div>
                    <div class="mt-5">
                      <el-select v-model="item_field.sql_rel_type" placeholder="请选择">
                        <el-option
                          v-for="item in optionsRelType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </span>
                  <span style="display: flex;flex:1;align-items:center">
                    <OverflowTooltip style="max-width: 80px">{{sourceTableName}}.</OverflowTooltip>
                    <el-input v-model="item_field.rel_sql_context" placeholder="请输入内容" @input="val => custominput(val, item_field)" style="flex:1"></el-input>
                  </span> -->
                  <span class="ml-5" style="cursor: pointer;font-size: 16px;position: absolute;right: -25px;"><i class="el-icon-delete" @click="deleteRel(index)"></i></span>
                </div>
              </div>
            </div>
            <el-divider></el-divider>
          </div>
        </template>
        <el-button type="primary" @click="addRelation" class="mb-5" v-if="showFieldConfig">新增关联关系</el-button>
        <div class="mb-10">
          <span class="label">选择新增字段</span>
          <span class="grey-value">(注：可以从不同物理表选择字段，同一字段可以添加多次)</span>
        </div>
        <div class="edit-filter">
          <span class="label">字段及描述</span>
          <el-input
            prefix-icon="el-icon-search"
            placeholder="请输入关键字搜索"
            v-model="keyword"
            clearable
          ></el-input>
        </div>
        <ul class="field-list">
          <li v-for="(item, index) in getFields" :key="item.element_id + index">
            <span class="name" v-html="$highlightKeyword(item.element_code, keyword)"></span>
            <span class="desc">{{item.comment || '未填写'}}</span>
            <span class="el-icon-circle-plus" @click="add(item)"></span>
          </li>
        </ul>
      </div>
      <div class="edit-body-right">
        <el-form :model="tableFilter" ref="tableForm">
          <el-table :data="tableFilter.columns">
            <el-table-column label="计算属性" prop="sql_context">
              <template #default="scope">
                <el-form-item
                  :prop="`columns.${scope.$index}.sql_context`"
                  :rules="[
                    {required: true, message: '请输入计算属性'}
                  ]"
                >
                  <el-input v-model="scope.row.sql_context"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="字段英文名" prop="alias_element_code">
              <template #default="scope">
                <el-form-item
                  :prop="`columns.${scope.$index}.alias_element_code`"
                  :rules="[
                    {required: true, message: '请输入英文名'},
                    {
                      pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
                      message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
                    },
                    {validator: validateRepeat, trigger: 'blur'}
                  ]"
                >
                  <el-input v-model="scope.row.alias_element_code"></el-input>
                  <span class="initial-value">原始英文名：{{initialData[scope.$index].element_code}}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="字段名称" prop="alias_element_name">
              <template #default="scope">
                <el-form-item
                  :prop="`columns.${scope.$index}.alias_element_name`"
                  :rules="{required: true, message: '请输入中文名'}"
                >
                  <el-input v-model="scope.row.alias_element_name"></el-input>
                  <span class="initial-value">原始名称：{{initialData[scope.$index].element_name}}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="数据类型" prop="element_type" width="100px">
              <template #default="scope">
                <el-select
                  v-model="scope.row.element_type"
                  placeholder="数据类型"
                >
                  <el-option
                    v-for="(item, index) in pkTypeList"
                    :key="index"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100px">
              <template #default="scope">
                <div>
                  <SimpleConfirm @confirm="deleteHandle(scope.$index, scope.row)" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
    <div class="custom-sql" v-if="sourceTable === '1'">
      <MonacoEditor
        :style="{height: `${height}px`}"
        :code.sync="code"
        has-top-tools
        has-bottom-tools
      ></MonacoEditor>
    </div>
  </SimpleEditDialog>
</template>

<script>
// import FieldForm from './field-form'
import {on, off} from '@/libs/dom'
import {getMetaCubes} from '@/api/rd/dev'
import {
  queryTableRelInfo,
  getLastOperSourceTable,
  factLogicElementSaves,
  sqlVerificationMultiSql,
  queryCondition
} from '@/api/rd/fact-table'
import {
  getPkTypeList
} from '@/api/rd/dimension' 
import {mapGetters} from 'vuex'
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'NewFieldFact',
  inject: ['tabStore'],
  props: {
    title: String,
    visible: Boolean,
    data: Object,
    tableData: Array,
    type: String,
    parentClass: String,
    factType: String
  },
  components: {
    // FieldForm,
    OverflowTooltip
  },
  data() {
    return {
      sourceTable: '',
      table: '',
      // field: '',
      // filter: {
      //   table: '',
      //   field: ''
      // },
      tables: [],
      fields: [],
      isVisible: false,
      keyword: '',
      code: '',
      height: 400,
      initialData: [],
      tableFilter: {
        columns: []
      },
      showFieldConfig: true,
      relationFields: {},
      source_table_relation: [],
      masterFields: [],
      sourceFields: [],
      operatorList: [],
      loading: false,
      optionsRelType: [
        {label: '内联接', value: '0'},
        {label: '左联接', value: '1'},
        {label: '右联接', value: '2'},
        {label: '全联接', value: '3'}
      ],
      sqlValid: false,
      col_info: [],
      pkTypeList: []
    }
  },
  watch: {
    visible: {
      immediate: true,
      async handler(val) {
        this.isVisible = val
        if (val) {
          this.initData()
        }
      }
    },
    data: {
      deep: true,
      handler(val) {
        this.initData()
      }
    },
    source_table_relation: {
      handler(val) {
        if (val.length) {

        }
      }
    }
  },
  computed: {
    ...mapGetters(['project']),
    visibleFields(val) {
      return this.fields.filter(item => item.visible)
    },
    sourceTableName() {
      const data = this.tables.find(d => d.cube_id === this.table)
      return data ? data.cube_code : ''
    },
    getFields() {
      return this.sourceFields.filter(d => {
        // return this.source_table_relation.findIndex(dd => dd.rel_element_id === d.element_id) !== -1 && d.element_code.indexOf(this.keyword) > -1
        return d.element_code.indexOf(this.keyword) > -1
      })
    }
  },
  created() {
    this.getPkTypeList()
    this._queryCondition()
    this.initData()
  },
  mounted() {
    this.setHeight()
    on(window, 'resize', this.setHeight)
  },
  beforeDestroy() {
    off(window, 'resize', this.setHeight)
  },
  methods: {
     // 获取数据类型
    async getPkTypeList() {
      const res = await this.$simpleAsyncTo(getPkTypeList(), '获取主键类型失败')
      if (res) {
        this.pkTypeList = res.data.data_type
      }
    },
    setHeight() {
      this.height = this.$refs.dialog.dialogBodyHeight - 41
    },
    validateRepeat(rule, value, callback) {
      if (
        this.tableFilter.columns.filter(item => item.element_code === value)
          .length > 1
      ) {
        return callback(new Error('字段英文名重复'))
      }
      callback()
    },
    async initData() {
      this.loading = true
      await this.getMetaCubes()
      await this._getLastOperSourceTable()
      const {info = {}} = this.data
      this.sourceTable = info.source_type
      if (this.sourceTable === '0') {
        await this.getQueryTableRelInfo()
        const {source_element_codes, master_element_codes, source_table_relation} = this.relationFields
        this.source_table_relation = source_table_relation.map(d => {
          // const strIndex = d.rel_sql_context.indexOf('.')
          return {
            ...d,
            masterId: d.cube_id + d.element_id
            // rel_value_custom: d.rel_sql_context.slice(strIndex + 1)
          }
        })
        this.masterFields = master_element_codes.map(d => {
          return {
            ...d,
            masterId: d.cube_id + d.element_id
          }
        })
        this.sourceFields = source_element_codes
        if (this.table === info.cube_id) {
          this.showFieldConfig = false
          this.source_table_relation = []
        }
      } else {
        // this.code = this.decrypt(info.sql_context)
        this.code = this.decrypt(info.sql_custom_context)
      }
      this.loading = false
    },
    add(data) {
      data.alias_element_code = data.element_code
      data.cube_id = this.table
      data.sql_context = data.element_code
      data.alias_element_name = data.element_name
      this.tableFilter.columns.push({...data})
      this.initialData.push({...data})
    },
    close() {
      this.sourceTable = 0
      this.tableFilter.columns = []
      this.initialData = []
      this.$emit('update:visible', false)
    },
    deleteHandle(index, row) {
      this.tableFilter.columns.splice(index, 1)
      this.initialData.splice(index, 1)
    },
    async confirm() {
      if (this.$refs.tableForm) {
        if (this.showFieldConfig && !this.source_table_relation.length) {
          return this.$message({
            type: 'warning',
            message: '请添加关联关系后在提交'
          })
        }
        this.$refs.tableForm.validate(async valid => {
          if (valid) {
            const logic_rel_info = this.source_table_relation.map(d => {
              return {
                rel_cube_code: d.rel_cube_code,
                cube_id: d.cube_id,
                cube_code: d.cube_code,
                sql_context: d.sql_context,
                sql_rel_type: d.sql_rel_type,
                element_id: d.element_id,
                related_expression: d.related_expression,
                rel_cube_id: d.rel_cube_id,
                rel_element_id: d.rel_element_id,
                rel_sql_context: d.rel_sql_context
              }
            })
            const logic_element_info = this.tableFilter.columns.map(d => {
              return {
                alias_element_name: d.alias_element_name,
                alias_element_code: d.alias_element_code,
                alias_element_type: d.element_type,
                sql_context: d.sql_context,
                cube_id: d.cube_id,
                element_id: d.element_id
              }
            })
            let attribute_tag = ''
            if (this.factType === 'attr') {
              attribute_tag = '1'
            } else if (this.factType === 'measure') {
              attribute_tag = '2'
            } else {
              attribute_tag = '3'
            }
            const params = {
              source_type: this.sourceTable,
              fact_logic_id: this.data.info.fact_logic_id,
              attribute_tag,
              logic_rel_info: JSON.stringify(logic_rel_info),
              logic_element_info: JSON.stringify(logic_element_info),
              source_cube_id: this.table
            }
            const res = await this.$simpleAsyncTo(factLogicElementSaves(params), '新建失败')
            if (res.flag) {
              this.$message({
                type: 'success',
                message: '新建成功'
              })
              this.tableFilter.columns = []
              this.initialData = []
              if (this.data.info.status !== '5') {
                this.$root.eventEmitter.emit('refresh')
              }
              this.$root.eventEmitter.emit(`refreshGetData${this.tabStore.states.active.name}`)
              this.$emit('update:visible', false)
            }
          }
        })
      } else {
        await this.sqlVerification()
        if (!this.sqlValid) return
        let attribute_tag = ''
        if (this.factType === 'attr') {
          attribute_tag = '1'
        } else if (this.factType === 'measure') {
          attribute_tag = '2'
        } else {
          attribute_tag = '3'
        }
        const params = {
          source_type: this.sourceTable,
          fact_logic_id: this.data.info.fact_logic_id,
          attribute_tag,
          logic_fact_code: this.data.info.logic_fact_code,
          sql_content: this.encrypt(this.code),
          source_table_info: JSON.stringify(this.col_info)
        }
        const res = await this.$simpleAsyncTo(factLogicElementSaves(params), '新建失败')
        if (res.flag) {
          this.$message({
            type: 'success',
            message: '新建成功'
          })
          this.$root.eventEmitter.emit(`refreshGetData${this.tabStore.states.active.name}`)
          if (this.data.info.status !== '5') {
            this.$root.eventEmitter.emit('refresh')
          }
          this.$emit('update:visible', false)
        }
      }
    },
    async changeSourceTable(val) {
      const {info = {}} = this.data
      if (val === info.cube_id) {
        this.showFieldConfig = false
      } else {
        this.showFieldConfig = true
      }
      this.source_table_relation = []
      await this.getQueryTableRelInfo()
      const {source_element_codes, master_element_codes, source_table_relation} = this.relationFields
      this.source_table_relation = source_table_relation.map(d => {
        return {
          ...d,
          masterId: d.cube_id + d.element_id
        }
      })
      this.masterFields = master_element_codes.map(d => {
        return {
          ...d,
          masterId: d.cube_id + d.element_id
        }
      })
      this.sourceFields = source_element_codes
      this.tableFilter.columns = []
      this.initialData = []
    },
    async getMetaCubes() {
      const res = await this.$simpleAsyncTo(getMetaCubes({project_id: this.project.project_id}), '获取来源表失败')
      if (res) {
        this.tables = res.data
      }
    },
    async getQueryTableRelInfo() {
      await this.$sleep(50)
      const res = await this.$simpleAsyncTo(queryTableRelInfo({fact_logic_id: this.data.info.fact_logic_id, cube_id: this.table}), '获取数据失败')
      if (res) {
        this.relationFields = res.data
      }
    },
    async _getLastOperSourceTable() {
      await this.$sleep(50)
      const res = await this.$simpleAsyncTo(getLastOperSourceTable({fact_logic_id: this.data.info.fact_logic_id}), '获取数据失败')
      if (res) {
        this.table = res.data.cube_id
      }
    },
    relElementIdChange(val, item) {
      const data = (this.sourceFields.find(d => d.element_id === val) || {}).element_code || ''
      item.rel_sql_context = data
    },
    maseterFieldChange(val, item) {
      const data = (this.masterFields.find(d => d.masterId === val) || {})
      item.sql_context = data.element_code
      item.cube_code = data.cube_code
      item.cube_id = data.cube_id
      item.element_id = data.element_id
    },
    addRelation() {
      let data = {
        sql_context: '',
        cube_id: '',
        cube_code: '',
        element_id: '',
        element_code: '',
        sql_rel_type: '',
        related_expression: '',
        rel_id: '',
        rel_cube_id: '',
        rel_cube_code: '',
        rel_element_id: '',
        rel_element_code: '',
        rel_sql_context: ''
      }
      const maseterD = this.masterFields.filter(d => {
        return this.source_table_relation.findIndex(i => i.masterId === d.masterId) === -1
      })
      const sourceD = this.sourceFields.filter(d => {
        return this.source_table_relation.findIndex(i => i.rel_element_id === d.element_id) === -1
      })
      if (maseterD.length) {
        data.element_id = maseterD[0].element_id
        data.sql_context = maseterD[0].element_code
        data.cube_id = maseterD[0].cube_id
        data.cube_code = maseterD[0].cube_code
        data.element_code = maseterD[0].element_code.slice(maseterD[0].element_code.indexOf('.') + 1)
        data.masterId = maseterD[0].cube_id + maseterD[0].element_id
      }
      if (sourceD.length) {
        data.rel_cube_id = this.table
        data.rel_cube_code = (this.tables.find(d => d.cube_id === this.table) || {}).cube_code
        data.rel_element_id = sourceD[0].element_id
        data.rel_element_code = sourceD[0].element_code
        // data.rel_value_custom = sourceD[0].element_code
        data.rel_sql_context = `${sourceD[0].element_code}`
      }
      data.related_expression = '='
      data.sql_rel_type = '0'
      this.source_table_relation.forEach(item => {
        if (item.cube_id === data.cube_id) {
          item.sql_rel_type = data.sql_rel_type
        }
      })
      this.source_table_relation.push(data)
    },
    custominput(val, item) {
      // item.rel_sql_context = `${item.rel_cube_code}.${val}`
    },
    async sqlVerification() {
      this.sqlValid = false
      const fn = sqlVerificationMultiSql
      const params = {
          sql: this.encrypt(this.code),
          cube_code: this.data.info.cube_code,
          project_id: this.project.project_id
        }
      const res = await this.$simpleAsyncTo(
        fn(params),
        '规范性校验失败'
      )
      if (res) {
        this.sqlValid = true
        this.col_info = res.data.source_table_info
      }
    },
    deleteRel(index) {
      this.source_table_relation.splice(index, 1)
    },
    async _queryCondition() {
      const res = await this.$simpleAsyncTo(queryCondition(), '获取数据失败')
      if (res) {
        this.operatorList = res.data
      }
    },
    changeSqlRelType(val, item_field) {
      this.source_table_relation.forEach(item => {
        if (item.cube_id === item_field.cube_id) {
          item.sql_rel_type = val
        }
      })
    }
  }
}
</script>

<style lang="scss">
.new-field-fact {
  .el-dialog__body {
    padding-top: 15px;
    padding-bottom: 25px;
  }
  .new-field-top {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid $grey6;
  }
  .custom-sql {
    // height: calc(100% - 41px);
  }
  .el-form-item {
    margin-bottom: 0;
    .initial-value {
      font-size: 12px;
      color: $grey4;
    }
    .el-form-item__error {
      width: 100%;
      height: 22px;
      line-height: 18px;
      top: 50%;
      background: $grey10;
      padding-left: 5px;
    }
  }
  .edit-body {
    display: flex;
    .edit-body-left {
      width: 650px;
      font-size: 12px;
      border-right: 1px solid $grey6;
      padding-right: 10px;
      .edit-item {
        display: flex;
        margin-bottom: 10px;
        line-height: 30px;
        position: relative;
        align-items: center;
        .el-icon-info {
          position: absolute;
          right: 5px;
          top: 8px;
          font-size: 16px;
        }
      }
      .edit-item1 {
        display: flex;
        align-items: center;
      }
      .grey-value {
        color: $grey4;
      }
      .label {
        display: inline-block;
        width: 110px;
        text-align: right;
        padding-right: 10px;
        color: $grey2;
      }
      .el-select {
        flex: 1;
        margin-right: 25px;
      }

      .edit-filter {
        display: flex;
        justify-content: space-between;
        // margin-bottom: 5px;
        height: 40px;
        background: $grey10;
        line-height: 40px;
        padding: 0 20px;
        .label {
          width: 70px;
          // text-align: left;
        }
        .el-input {
          width: 225px;
          .el-input__inner {
            border: none;
            border-radius: 0;
            border-bottom: 1px solid $grey6;
          }
        }
      }
      .field-list {
        height: calc(100% - 148px);
        overflow: auto;

        li {
          padding: 0 20px;
          display: flex;
          height: 40px;
          margin-top: 3px;
          background: $grey10;
          align-items: center;
        }
        .name {
          width: 70px;
          color: $grey2;
        }
        .desc {
          flex: 1;
          padding: 0 10px;
          @include textEllipsis;
        }
        .el-icon-circle-plus {
          width: 20px;
          font-size: 16px;
          color: lighten($--color-primary, 10%);
          cursor: pointer;

          &:hover {
            color: $--color-primary;
          }
        }
      }
    }
    .edit-body-right {
      flex: 1;
      padding-left: 10px;
    }
  }
  .content-bottom {
    display: flex;
    flex-direction: column;
    // align-items: start;
    align-items: flex-start;
    position: relative;
    > div {
      display: flex;
    }
  }
}
</style>
