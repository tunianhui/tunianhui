<template>
  <el-dialog
    title="编辑属性"
    :visible="dialogTableVisible"
    @close="close"
    width="75%"
    top="8vh"
    class="new-field-fact new-field-fact-tutu"
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
    <div class="edit-body" v-if="sourceTable === '0'" :style="{height: `${height}px`, 'max-height': '650px', overflow: 'auto'}">
      <div class="edit-body-left" style="height:100%">
        <div class="edit-item">
          <span class="label">来源表：</span>
          <el-select v-model="table" @change="changeSourceTable" filterable>
            <el-option
              v-for="item in tables"
              :key="item.cube_id"
              :label="item.cube_code"
              :value="item.cube_id + ''"
            ></el-option>
          </el-select>
        </div>
        <el-divider></el-divider>
        <template v-for="(item_field, index) in source_table_relation">
          <div :key="item_field.id" v-if="!is_master_table">
            <div class="edit-item">
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
            <div class="edit-item">
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
            <div class="edit-item1">
              <span class="label">关联逻辑：</span>
              <div class="content">
                <div class="content-top" style="display: flex;font-weight: 900;">
                  <span style="width:180px;">已关联主表字段</span>
                  <span style="width:100px;margin-right:5px" class="mr-5 ml-5">关联关系</span>
                  <span style="flex:1">已关联来源字段</span>
                </div>
                <div class="content-bottom mt-10">
                  <!-- <div style="width:210px">
                    <OverflowTooltip style="width: 80px">{{item_field.cube_code}}</OverflowTooltip>
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
                  <span class="ml-5" style="cursor: pointer;font-size: 16px;position: absolute;right: -25px;" @click="deleteRel(index)"><i class="el-icon-delete"></i></span>
                </div>
              </div>
            </div>
            <el-divider></el-divider>
          </div>
        </template>
        <el-button type="primary" @click="addRelation" class="mb-5" v-if="!is_master_table">新增关联关系</el-button>
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
    <div class="custom-sql" v-if="sourceTable === '1'" :style="{height: `${height}px`}">
      <MonacoEditor
        :style="{height: `${height}px`}"
        :code.sync="sql_content"
        has-top-tools
        has-bottom-tools
      ></MonacoEditor>
    </div>
    <div slot="footer" class="dialog-footer my-btn">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {on, off} from '@/libs/dom'
import OverflowTooltip from '@c/overflow-tooltip'
import {
  getPkTypeList
} from '@/api/rd/dimension' 
import {
  queryTableRelInfo,
  factLogicElementRelEdit,
//   getLastOperSourceTable,
//   factLogicElementSaves,
  sqlVerificationMultiSql,
  queryElementInfoByLogicId,
  queryCondition
} from '@/api/rd/fact-table'
import {mapGetters} from 'vuex'
import {
  getMetaCubes
} from '@/api/rd/dev'
export default {
  name: 'EditFieldFact',
  props: {
    activeEditField: Object,
    data: Object
  },
  inject: ['tabStore'],
  components: {
    OverflowTooltip
  },
  data() {
    return {
      dialogTableVisible: true,
      sourceTable: '',
      disabled: false,
      height: 600,
      tables: [],
      table: '',
      source_table_relation: [],
      is_master_table: false,
      masterFields: [],
      sourceFields: [],
      operatorList: [],
      optionsRelType: [
        {label: 'inner join', value: '0'},
        {label: 'left join', value: '1'},
        {label: 'right join', value: '2'},
        {label: 'full join', value: '3'}
      ],
      loading: false,
      keyword: '',
      tableFilter: {
        columns: []
      },
      initialData: [],
      sql_content: '',
      col_info: [],
      sqlValid: false,
      pkTypeList: []
    }
  },
  computed: {
    ...mapGetters(['project']),
    sourceTableName() {
      const data = this.tables.find(d => d.cube_id + '' === this.table)
      return data ? data.cube_code : ''
    },
    getFields() {
      return this.sourceFields.filter(d => {
        return d.element_code.indexOf(this.keyword) > -1
      })
    }
  },
  mounted() {
    // this.setHeight()
    // on(window, 'resize', this.setHeight)
  },
  beforeDestroy() {
    // off(window, 'resize', this.setHeight)
  },
  async created() {
    this.getPkTypeList()
    this._queryCondition()
    this.loading = true
    await this.getMetaCubes()
    await this._queryElementInfoByLogicId()
    // alias_element_code: "phone_imei"
    // alias_element_name: "设备编码"
    // cube_id: 20045
    // element_code: (...)
    // element_id: (...)
    // element_name: "设备编码"
    // element_type: "string"
    // sql_context: "phone_imei"
    const data = {
      alias_element_code: this.activeEditField.element_code,
      alias_element_name: this.activeEditField.element_name,
      cube_id: this.activeEditField.cube_id,
      element_code: this.activeEditField.element_code,
      element_id: this.activeEditField.element_id,
      element_name: this.activeEditField.element_name,
      element_type: this.activeEditField.element_type,
      sql_context: this.activeEditField.sql_context
    }
    this.tableFilter.columns.push({...data})
    this.initialData.push({...data})
    this.loading = false
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
    async getMetaCubes() {
      const res = await this.$simpleAsyncTo(getMetaCubes({project_id: this.project.project_id}), '获取来源表失败')
      if (res) {
        this.tables = res.data
      }
    },
    close() {
      this.initialData = []
      this.tableFilter.columns = []
      this.$emit('close')
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
    async _queryElementInfoByLogicId() {
      const params = {
        id: this.activeEditField.id
      }
      const res = await this.$simpleAsyncTo(queryElementInfoByLogicId(params), '获取数据失败')
      if (res) {
        const data = res.data
        this.sourceTable = data.source_type
        if (this.sourceTable === '0') {
          this.is_master_table = data.is_master_table
          if (data.is_master_table) {
            const {table_info} = data
            this.table = table_info.source_cube_id
          } else {
            this.table = data.cube_id
          }
          await this.getQueryTableRelInfo()
        } else {
          this.sql_content = this.decrypt(data.sql_content)
        }
      }
    },
    async getQueryTableRelInfo() {
      await this.$sleep(50)
      const res = await this.$simpleAsyncTo(queryTableRelInfo({fact_logic_id: this.data.info.fact_logic_id, cube_id: this.table}), '获取数据失败')
      if (res) {
        this.relationFields = res.data
        const {source_element_codes, master_element_codes, source_table_relation} = this.relationFields
        if (!this.is_master_table) {
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
        } else {
          this.sourceFields = source_element_codes
        }
      }
    },
    async changeSourceTable(val) {
      // if (this.is_master_table) {
      //   this.getQueryTableRelInfo()
      // }
      const {info = {}} = this.data
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
    relElementIdChange(val, item_field) {
      const data = (this.sourceFields.find(d => d.element_id === val) || {}).element_code || ''
      item_field.rel_sql_context = data
    },
    maseterFieldChange(val, item) {
      const data = (this.masterFields.find(d => d.masterId === val) || {})
      item.sql_context = data.element_code
      item.cube_code = data.cube_code
      item.cube_id = data.cube_id
    },
    custominput(val, item) {
      // item.rel_sql_context = `${item.rel_cube_code}.${val}`
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
    add(data) {
      data.alias_element_code = data.element_code
      data.cube_id = this.table
      data.sql_context = data.element_code
      data.alias_element_name = data.element_name
      if (this.tableFilter.columns.length > 0) {
        this.tableFilter.columns.splice(0, 1)
        this.initialData.splice(0, 1)
      }
      this.tableFilter.columns.push({...data})
      this.initialData.push({...data})
    },
    deleteHandle(index, row) {
      this.tableFilter.columns.splice(index, 1)
      this.initialData.splice(index, 1)
    },
    async ok() {
      if (this.$refs.tableForm) {
        if (!this.tableFilter.columns.length) {
          return this.$message({
            type: 'warning',
            message: '请选择新增字段'
          })
        }
        this.$refs.tableForm.validate(async valid => {
          if (valid) {
            let params = {}
            if (this.is_master_table) {
              params = {
                source_type: '0',
                is_master_table: true,
                source_cube_id: this.table,
                id: this.activeEditField.id,
                alias_element_code: (this.tableFilter.columns[0] || {}).alias_element_code,
                element_id: (this.tableFilter.columns[0] || {}).element_id,
                sql_context: (this.tableFilter.columns[0] || {}).sql_context,
                alias_element_name: (this.tableFilter.columns[0] || {}).alias_element_name,
                alias_element_type: (this.tableFilter.columns[0] || {}).element_type,
              }
            } else {
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
              params = {
                source_type: '0',
                is_master_table: false,
                logic_rel_info: JSON.stringify(logic_rel_info),
                source_cube_id: this.table,
                id: this.activeEditField.id,
                alias_element_code: (this.tableFilter.columns[0] || {}).alias_element_code,
                element_id: (this.tableFilter.columns[0] || {}).element_id,
                sql_context: (this.tableFilter.columns[0] || {}).sql_context,
                alias_element_name: (this.tableFilter.columns[0] || {}).alias_element_name
              }
            }
            const res = await this.$simpleAsyncTo(factLogicElementRelEdit(params), '编辑失败')
            if (res.flag) {
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
              this.$root.eventEmitter.emit(`refreshGetData${this.tabStore.states.active.name}`)
              if (this.data.info.status !== '5') {
                this.$root.eventEmitter.emit('refresh')
              }
              this.close()
            }
          }
        })
      } else {
        await this.sqlVerification()
        if (!this.sqlValid) return
        const params = {
          source_type: '1',
          fact_logic_id: this.data.info.fact_logic_id,
          logic_fact_code: this.data.info.logic_fact_code,
          sql_content: this.encrypt(this.sql_content),
          cube_id: this.data.info.cube_id,
          source_table_info: JSON.stringify(this.col_info)
        }
        const res = await this.$simpleAsyncTo(factLogicElementRelEdit(params), '编辑失败')
        if (res.flag) {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.$root.eventEmitter.emit(`refreshGetData${this.tabStore.states.active.name}`)
          if (this.data.info.status !== '5') {
            this.$root.eventEmitter.emit('refresh')
          }
          this.close()
        }
      }
    },
    async sqlVerification() {
      this.sqlValid = false
      const fn = sqlVerificationMultiSql
      const params = {
          sql: this.encrypt(this.sql_content),
          cube_code: this.activeEditField.cube_code,
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

</style>
