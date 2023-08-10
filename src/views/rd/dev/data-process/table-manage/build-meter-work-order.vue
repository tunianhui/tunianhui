<template>
  <div
    class="build-meter-work-order height-100per flex-column"
    v-loading="!!loading"
  >
    <div class="build-meter-work-order-content">
      <el-steps :active="active" space="25%" :align-center="true">
        <el-step
          v-for="(item, index) in elSteps"
          :key="index"
          :title="item.title"
        ></el-step>
      </el-steps>
      <div class="table-name mt-30" v-if="active == 1">
        <el-form
          class="form"
          ref="formStep"
          :model="table_basic"
          :rules="formRules"
          label-position="left"
          label-width="120px"
        >
          <el-form-item label="表分层" prop="table_layer">
            <el-select v-model="table_basic.table_layer">
              <el-option
                v-for="(item, index) in tableLevelList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="layer-library" @click="layerLibrary"
              >查看分层和选库说明</span
            >
          </el-form-item>
          <el-form-item label="数据源类型" prop="datasource_type">
            <el-select
              v-model="table_basic.datasource_type"
              @change="changeDataSourceType"
            >
              <el-option
                v-for="(item, index) in datasourceTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据源" prop="datasource_id">
            <el-select
              v-model="table_basic.datasource_id"
              @change="changeDatasourceTypeList"
              placeholder="请先选择数据源类型"
            >
              <el-option
                v-for="(item, index) in datasourceIdList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库" prop="datasource_db">
            <el-select
              v-model="table_basic.datasource_db"
              placeholder="请先选择数据源"
            >
              <el-option
                v-for="(item, index) in libraryList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主题归属" prop="data_id">
            <el-cascader
              ref="subjectAttribution"
              placeholder="请先选择表分层"
              @change="tempChange"
              v-model="table_basic.data_id"
              :options="subjectAttributionList"
              :props="cascaderProps"
              filterable
              clearable
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="目录" prop="parent_id">
            <el-select
              v-model="table_basic.parent_id"
              placeholder="请选择"
              ref="treeSelect"
              :disabled="title.indexOf('重命名') > -1"
              popper-class="select-tree"
            >
              <el-option
                :label="table_basic.file_catalog"
                :value="table_basic.parent_id"
                style="max-height: auto; background-color: #fff"
              >
                <el-tree
                  :data="treeData"
                  :props="defaultProps"
                  :current-node-key="currentNodeKey"
                  node-key="id"
                  accordion
                  :highlight-current="true"
                  :expand-on-click-node="false"
                  @node-click="handleNodeClick"
                  ref="tree"
                  style="font-weight: 400"
                >
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-collapse accordion v-model="activeNames" @change="handleChange">
            <el-collapse-item name="1">
              <span class="collapse-title" slot="title">表名配置</span>
              <div>
                <el-alert
                  title="您选择的表分层下未设置表设计规则，可自行设置表名称"
                  type="warning"
                  show-icon
                  :closable="false"
                >
                </el-alert>
                <el-form-item label="表名称" prop="table_code">
                  <el-input
                    placeholder="1~64个字符，需以字母开头，仅支持小写字母、数字、‘_’"
                    v-model="table_basic.table_code"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="表名描述" prop="table_name">
                  <el-input
                    type="textarea"
                    placeholder="请输入表的描述"
                    v-model="table_basic.table_name"
                  >
                  </el-input>
                </el-form-item>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </div>
      <div
        class="basic-property-field"
        v-if="active == 2 && pattern == 'undefined'"
      >
        <div class="choose-mode">请选择一种配置模式</div>
        <div class="modes">
          <span>
            <div>
              <img
                :src="
                  require('@/assets/images/' +
                    modeStatus.formMode.icon +
                    '.png')
                "
              />
              <el-button
                type="primary"
                @click="showForm"
                :disabled="modeStatus.formMode.disabled"
                >表单模式</el-button
              >
            </div>
            <div>
              <img
                :src="
                  require('@/assets/images/' + modeStatus.sqlMode.icon + '.png')
                "
              />
              <el-button
                type="primary"
                @click="showSQL"
                :disabled="modeStatus.sqlMode.disabled"
                >SQL模式</el-button
              >
            </div>
            <div>
              <img
                :src="
                  require('@/assets/images/' + modeStatus.dmlMode.icon + '.png')
                "
              />
              <el-button
                type="primary"
                @click="showDML"
                :disabled="modeStatus.dmlMode.disabled"
                >DML模式</el-button
              >
            </div>
          </span>
        </div>
      </div>
      <div class="form-pattern" v-if="active == 2 && pattern == 'form'">
        <formMode
          ref="formMode"
          :isHive="isHive"
          :datasource_type="table_basic.datasource_type"
          :table_basic="table_basic"
          :column_info="column_info"
          :partition_info="partition_info"
          :table_param="table_param"
          :isSave="isSave"
        ></formMode>
      </div>
      <div class="form-pattern" v-if="active == 2 && pattern == 'sql'">
        <sqlMode
          ref="sqlMode"
          :isHive="isHive"
          :sqlParams="sqlParams"
          :showSQLEditor="showSQLEditor"
          :table_basic="table_basic"
          :column_info="column_info"
          :partition_info="partition_info"
          :table_param="table_param"
          :isSave="isSave"
          @creatTableStructure="creatTableStructure"
          @returnSQLEditor="returnSQLEditor"
          @req-start="SQLReqStart"
          @req-end="SQLReqEnd"
        ></sqlMode>
      </div>
      <div
        class="form-pattern"
        v-if="(active == 2 || active == 3) && pattern == 'dml'"
      >
        <dmlMode ref="dmlMode" :showDMLSubmitPage="showDMLSubmitPage"></dmlMode>
      </div>
      <div style="margin-left: 40px">
        <el-button
          style="margin-top: 12px"
          v-if="active > 1"
          @click="pre($event)"
          >上一步</el-button
        >
        <el-button
          style="margin-top: 12px"
          v-if="active != 2 && active != 3"
          @click="next($event)"
          >下一步</el-button
        >
        <el-button
          style="margin-top: 12px"
          v-if="active == 2 && active != 3 && pattern == 'dml'"
          @click="nextDML($event)"
          >下一步</el-button
        >
        <span
          v-if="
            (active == 2 && pattern == 'form') ||
            (active == 2 && pattern == 'sql' && !showSQLEditor) ||
            (active == 3 && pattern == 'dml')
          "
          style="margin-left: 12px"
        >
          <el-button
            icon="el-icon-check"
            type="success"
            :disabled="submitStatus"
            @click="dialogVisible = true"
          >
            提交
          </el-button>
          <el-button
            icon="el-icon-folder"
            type="primary"
            :disabled="submitStatus"
            @click="saveData(1)"
          >
            保存
          </el-button>
        </span>
      </div>
      <el-dialog title="提交工单" :visible.sync="dialogVisible" width="30%">
        <el-input
          type="textarea"
          v-model="table_basic.submit_comments"
          placeholder="请填写备注信息，非必填"
        >
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitData(2)">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import formMode from './form-mode.vue'
import sqlMode from './sql-mode.vue'
import dmlMode from './dml-mode.vue'
import {
  queryTableLevelList,
  queryDataSourceDb,
  queryDataField,
  queryDataSourceTypeList,
  queryDataSource,
  createTableSave,
  queryById,
  createTableEdit,
} from '@/api/rd/table-manage.js'
import {P} from '@antv/g2plot'
import task from './mixins2'
import {mapGetters} from 'vuex'

export default {
  name: 'BuildMeterWorkOrder',
  mixins: [pager, task],
  components: {
    formMode,
    sqlMode,
    dmlMode,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  inject: ['tabStore'],
  data() {
    return {
      active: 1,
      elSteps: [{title: '表名'}, {title: '基础属性及字段'}],
      column_info: [],
      partition_info: [],
      table_param: {},
      table_basic: {
        table_layer: '',
        datasource_type: '',
        datasource_id: '',
        datasource_db: '',
        data_id: '',
        table_code: '',
        table_name: '',
        parent_id: '',
        file_catalog: '',
        name: '',
        data_name: '',
        data_code: '',
        submit_comments: '',
      },
      tableLevelList: [],
      libraryList: [],
      subjectAttributionList: [],
      datasourceTypeList: [],
      datasourceIdList: [],
      activeNames: '1',
      pattern: 'undefined',
      coreTable: false,
      formData2: {
        radio1: 3,
        radio2: 3,
      },
      showDMLSubmitPage: false,
      cascaderProps: {
        multiple: false,
      },
      showSQLEditor: true,
      dialogVisible: false,
      isHive: false,
      currentNodeKey: '',
      title: '',
      submitStatus: false,
      loading: 0,
      config_mode: '',
      modeStatus: {
        formMode: {
          icon: 'form-mode',
          disabled: false,
        },
        sqlMode: {
          icon: 'sql-mode',
          disabled: false,
        },
        dmlMode: {
          icon: 'dml-mode',
          disabled: false,
        },
      },
      isAlreadySQL: false,
      isSave: false,
      isSaveID: '',
      formRules:{
        table_layer:{required:true,message: '请选择表分层', trigger: 'change'},
        datasource_type:{required:true,message: '请选择数据源类型', trigger: 'change'},
        datasource_id:{required:true,message: '请选择数据源', trigger: 'change'},
        datasource_db:{required:true,message: '请选择库', trigger: 'change'},
        data_id:{required:true,message: '请选择主题归属', trigger: 'change'},
        parent_id:{required:true,message: '请选择目录', trigger: 'change'},
        table_code:{required:true,message: '请选择表名称', trigger: 'blur'},
        table_name:{required:true,message: '请选择表描述', trigger: 'blur'},
      }
    }
  },
  computed: {
    ...mapGetters(['project']),
    sqlParams() {
      return {
        table_code: this.table_basic.table_code,
        datasource_type: this.table_basic.datasource_type,
        datasource_id: this.table_basic.datasource_id,
        datasource_db: this.table_basic.datasource_db,
      }
    },
  },
  watch: {},
  created() {
    if (this.data.creatClick) {
      console.log('新建点击')
      this.isSave = false
      this.isSaveID = ''
    } else {
      console.log('未提交/已驳回')
      console.log(this.data)
      this.queryById()
    }
    this.queryTableLevelList()
    this.queryDataField()
    this.queryDataSourceTypeList()
  },
  methods: {
    async queryById() {
      let params = {
        id: this.data.id,
      }
      const res = await queryById(params)
      if (res.flag) {
        this.isSave = true
        this.isSaveID = this.data.id
        const {table_basic, column_info, partition_info, table_param} = res.data
        let temp_column_info = this.parseJsonData(column_info)
        let temp_partition_info = this.parseJsonData(partition_info)
        this.isAlreadySQL =
          table_basic.oper_type == '新建表' &&
          table_basic.config_mode == 'SQL模式'
            ? true
            : false
        this.table_basic = {
          ...this.table_basic,
          ...table_basic,
        }
        this.column_info = temp_column_info
        this.partition_info = temp_partition_info
        this.table_param = table_param
        this.setIsHiveStatus(this.table_basic.datasource_type)
        this.setModeStatus()
        this.queryDataSource()
        this.queryDataSourceDb()
      }
    },
    parseJsonData(table) {
      if (Array.isArray(table) && table.length > 0) {
        let temp = table.map((i, d) => {
          return {
            ...i,
            selected_value: JSON.parse(
              typeof i.selected_value == 'string' ? i.selected_value : '[]'
            ),
          }
        })
        return temp
      }
    },
    setModeStatus() {
      if (this.table_basic.config_mode) {
        if (this.table_basic.config_mode == '表单模式') {
          this.modeStatus = {
            formMode: {
              icon: 'form-mode-active',
              disabled: false,
            },
            sqlMode: {
              icon: 'sql-mode',
              disabled: true,
            },
            dmlMode: {
              icon: 'dml-mode',
              disabled: true,
            },
          }
        } else if (this.table_basic.config_mode == 'SQL模式') {
          this.modeStatus = {
            formMode: {
              icon: 'form-mode',
              disabled: true,
            },
            sqlMode: {
              icon: 'sql-mode-active',
              disabled: false,
            },
            dmlMode: {
              icon: 'dml-mode',
              disabled: true,
            },
          }
        } else if (this.table_basic.config_mode == 'DML模式') {
          this.modeStatus = {
            formMode: {
              icon: 'form-mode',
              disabled: true,
            },
            sqlMode: {
              icon: 'sql-mode',
              disabled: true,
            },
            dmlMode: {
              icon: 'dml-mode-active',
              disabled: false,
            },
          }
        }
      }
    },
    tempChange(val) {
      const res = this.$refs.subjectAttribution.getCheckedNodes(false)
      this.table_basic.data_id = res[0].data.id
      this.table_basic.data_name = res[0].data.name
      this.table_basic.data_code = res[0].data.code
    },
    changeDataSourceType(val) {
      this.setIsHiveStatus(val)
      this.table_basic.datasource_id = ''
      this.queryDataSource()
    },
    setIsHiveStatus(val) {
      if (val == 'hive') {
        this.isHive = true
      } else {
        this.isHive = false
      }
    },
    changeDatasourceTypeList() {
      this.table_basic.datasource_db = ''
      this.queryDataSourceDb()
    },
    saveOrSubmitRemove(id) {
      this.tabStore.commit('remove', id ? id : 'new_CreatTable')
    },
    async saveData(status) {
      if (this.pattern == 'form') {
        const formData = this.$refs.formMode.collectData()
        if(!formData) {
          return false
        }
        let params = {
          project_id: this.project.project_id,
          project_code: this.project.project_code,
          parent_id: this.table_basic.parent_id,
          table_layer: this.table_basic.table_layer,
          datasource_type: this.table_basic.datasource_type,
          datasource_id: this.table_basic.datasource_id,
          datasource_db: this.table_basic.datasource_db,
          table_code: this.table_basic.table_code,
          table_name: this.table_basic.table_name,
          config_mode: '表单模式',
          data_id: this.table_basic.data_id,
          data_name: this.table_basic.data_name,
          data_code: this.table_basic.data_code,
          submit_comments: this.table_basic.submit_comments,
          ...formData,
          status: status,
        }
        console.log('save-params', params)
        this.loading++
        let res
        if (this.isSave) {
          res = await createTableEdit({id: this.isSaveID, ...params})
        } else {
          res = await createTableSave(params)
        }
        if (res.flag) {
          this.loading--
          this.submitStatus = true
          if (this.isSave) {
            this.saveOrSubmitRemove(this.isSaveID)
          } else {
            this.saveOrSubmitRemove()
          }
          this.$message({
            type: 'success',
            message: '保存成功',
          })
        } else {
          this.loading--
          this.$message({
            type: 'error',
            message: res.msg,
          })
        }
      } else if (this.pattern == 'sql') {
        const sqlData = this.$refs.sqlMode.collectData()
        if(!sqlData) {
          return false
        }
        let params = {
          project_id: this.project.project_id,
          project_code: this.project.project_code,
          parent_id: this.table_basic.parent_id,
          table_layer: this.table_basic.table_layer,
          datasource_type: this.table_basic.datasource_type,
          datasource_id: this.table_basic.datasource_id,
          datasource_db: this.table_basic.datasource_db,
          table_code: this.table_basic.table_code,
          table_name: this.table_basic.table_name,
          config_mode: 'SQL模式',
          data_id: this.table_basic.data_id,
          data_name: this.table_basic.data_name,
          data_code: this.table_basic.data_code,
          submit_comments: this.table_basic.submit_comments,
          ...sqlData,
          status: status,
        }
        console.log('save-params', params)
        this.loading++
        let res
        if (this.isSave) {
          res = await createTableEdit({id: this.isSaveID, ...params})
        } else {
          res = await createTableSave(params)
        }
        if (res.flag) {
          this.loading--
          this.submitStatus = true
          if (this.isSave) {
            this.saveOrSubmitRemove(this.isSaveID)
          } else {
            this.saveOrSubmitRemove()
          }
          this.$message({
            type: 'success',
            message: '保存成功',
          })
        } else {
          this.loading--
          this.$message({
            type: 'error',
            message: res.msg,
          })
        }
      } else if (this.pattern == 'dml') {
        const dmlData = this.$refs.dmlMode.collectData()
        console.log('dmlData', dmlData)
      }
      this.$root.eventEmitter.emit('table-manage-refresh-treeData')
    },
    async submitData(status) {
      if (this.pattern == 'form') {
        const formData = this.$refs.formMode.collectData()
        if(!formData) {
          return false
        }
        let params = {
          project_id: this.project.project_id,
          project_code: this.project.project_code,
          parent_id: this.table_basic.parent_id,
          table_layer: this.table_basic.table_layer,
          datasource_type: this.table_basic.datasource_type,
          datasource_id: this.table_basic.datasource_id,
          datasource_db: this.table_basic.datasource_db,
          table_code: this.table_basic.table_code,
          table_name: this.table_basic.table_name,
          config_mode: '表单模式',
          data_id: this.table_basic.data_id,
          data_name: this.table_basic.data_name,
          data_code: this.table_basic.data_code,
          submit_comments: this.table_basic.submit_comments,
          ...formData,
          status: status,
        }
        console.log('submit-params', params)
        this.loading++
        let res
        if (this.isSave) {
          res = await createTableEdit({id: this.isSaveID, ...params})
        } else {
          res = await createTableSave(params)
        }
        if (res.flag) {
          this.loading--
          this.submitStatus = true
          this.dialogVisible = false
          if (this.isSave) {
            this.saveOrSubmitRemove(this.isSaveID)
          } else {
            this.saveOrSubmitRemove()
          }
          this.$message({
            type: 'success',
            message: '提交成功！',
          })
        } else {
          this.loading--
          this.$message({
            type: 'error',
            message: res.msg,
          })
        }
      } else if (this.pattern == 'sql') {
        const sqlData = this.$refs.sqlMode.collectData()
        if(!sqlData) {
          return false
        }
        let params = {
          project_id: this.project.project_id,
          project_code: this.project.project_code,
          parent_id: this.table_basic.parent_id,
          table_layer: this.table_basic.table_layer,
          datasource_type: this.table_basic.datasource_type,
          datasource_id: this.table_basic.datasource_id,
          datasource_db: this.table_basic.datasource_db,
          table_code: this.table_basic.table_code,
          table_name: this.table_basic.table_name,
          config_mode: 'SQL模式',
          data_id: this.table_basic.data_id,
          data_name: this.table_basic.data_name,
          data_code: this.table_basic.data_code,
          submit_comments: this.table_basic.submit_comments,
          ...sqlData,
          status: status,
        }
        console.log('submit-params', params)
        this.loading++
        let res
        if (this.isSave) {
          res = await createTableEdit({id: this.isSaveID, ...params})
        } else {
          res = await createTableSave(params)
        }
        if (res.flag) {
          this.loading--
          this.submitStatus = true
          this.dialogVisible = false
          if (this.isSave) {
            this.saveOrSubmitRemove(this.isSaveID)
          } else {
            this.saveOrSubmitRemove()
          }
          this.$message({
            type: 'success',
            message: '提交成功！',
          })
        } else {
          this.loading--
          this.$message({
            type: 'error',
            message: res.msg,
          })
        }
      } else if (this.pattern == 'dml') {
        const dmlData = this.$refs.dmlMode.collectData()
        console.log('dmlData', dmlData)
      }
      this.$root.eventEmitter.emit('table-manage-refresh-treeData')
    },
    async queryTableLevelList() {
      const res = await queryTableLevelList()
      if (res.flag) {
        this.tableLevelList = res.data.map((i, d) => {
          return {
            ...i,
            value: i.table_layer,
            label: i.table_layer_name,
          }
        })
      }
    },
    async queryDataSourceDb() {
      this.libraryList = []
      let params = {
        project_code: this.project.project_code,
        datasource_type: this.table_basic.datasource_type,
        datasource_id: this.table_basic.datasource_id,
      }
      const res = await queryDataSourceDb(params)
      if (res.flag) {
        this.libraryList = res.data.map((i, d) => {
          return {
            ...i,
            value: i.name,
            label: i.name,
          }
        })
      }
    },
    async queryDataField() {
      let params = {
        busin_id: this.project.business_field_id,
      }
      const res = await queryDataField(params)
      if (res.flag) {
        let tempArr = []
        this.recursionData(res.data.children, tempArr)
        let tempArr2 = [
          {
            id: res.data.id,
            name: res.data.name,
            value: res.data.id,
            label: res.data.name,
            children: tempArr,
          },
        ]
        this.subjectAttributionList = tempArr
      }
    },
    async queryDataSourceTypeList() {
      const res = await queryDataSourceTypeList()
      if (res.flag) {
        this.datasourceTypeList = res.data.map((i, d) => {
          return {
            ...i,
            value: i.datasource_type,
            label: i.datasource_name,
          }
        })
      }
    },
    async queryDataSource() {
      this.datasourceIdList = []
      let params = {
        project_id: this.project.project_id,
        datasource_type: this.table_basic.datasource_type,
      }
      const res = await queryDataSource(params)
      if (res.flag) {
        this.datasourceIdList = res.data.map((i, d) => {
          return {
            ...i,
            value: i.datasource_id,
            label: i.datasource_name,
          }
        })
      }
    },
    recursionData(source, target) {
      source.forEach((item) => {
        const {id, name, code, parent_id, children} = item
        let treeItem = {
          id,
          name,
          code,
          parent_id,
          value: item.id,
          label: item.name,
          children: children || [],
        }
        if (children && children.length) {
          treeItem.children = []
          this.recursionData(children, treeItem.children)
        } else {
          delete treeItem.children
        }
        target.push(treeItem)
      })
    },
    pre(ev) {
      if ((ev.target.nodeName == 'SPAN') | (ev.target.nodeName == 'I')) {
        ev.target.parentNode.blur()
      } else {
        ev.target.blur()
      }
      if (this.pattern != 'undefined') {
        if (this.pattern == 'dml') {
          if (this.active == 3) {
            this.showDMLSubmitPage = false
            this.active = 2
          } else {
            this.elSteps = [{title: '表名'}, {title: '基础属性及字段'}]
            this.pattern = 'undefined'
          }
        } else {
          this.pattern = 'undefined'
        }
      } else {
        if (this.active-- < 1) this.active = 1
      }
    },
    next(ev) {
      if ((ev.target.nodeName == 'SPAN') | (ev.target.nodeName == 'I')) {
        ev.target.parentNode.blur()
      } else {
        ev.target.blur()
      }
      let validateField = ['table_layer','datasource_type','datasource_id','datasource_db','data_id','parent_id','table_code','table_name',]
      let flag = true
      this.$refs.formStep.validateField(validateField,(valid)=>{
        flag = flag && valid == ''
      })
      if(flag) {
        if (this.active++ > 1) this.active = 1
      }
    },
    nextDML(ev) {
      if ((ev.target.nodeName == 'SPAN') | (ev.target.nodeName == 'I')) {
        ev.target.parentNode.blur()
      } else {
        ev.target.blur()
      }
      this.showDMLSubmitPage = true
      this.active = 3
    },
    handleChange() {},
    showForm() {
      this.pattern = 'form'
    },
    showSQL() {
      this.pattern = 'sql'
      if (this.isAlreadySQL) {
        this.creatTableStructure()
      }
    },
    showDML() {
      this.pattern = 'dml'
      this.elSteps = [
        {title: '表名'},
        {title: '构建DML'},
        {title: '基础属性及字段'},
      ]
    },
    layerLibrary() {},
    creatTableStructure() {
      this.showSQLEditor = false
    },
    returnSQLEditor() {
      this.showSQLEditor = true
    },
    SQLReqStart() {
      this.loading++
    },
    SQLReqEnd() {
      this.loading--
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
.build-meter-work-order {
  padding: 40px 0px;
  background-color: #fff;
  .build-meter-work-order-content {
    .el-steps {
      justify-content: center;
    }
    .layer-library {
      color: #409eff;
      margin-left: 10px;
      cursor: pointer;
    }
    .form {
      width: 70%;
      margin: 10px 0px 0px 40px;
      .el-select,
      .el-cascader {
        width: 80%;
      }
    }
    .el-alert {
      margin-bottom: 18px;
    }
    .choose-mode {
      text-align: center;
    }
    .modes {
      text-align: center;
      margin-top: 18px;
      span {
        display: flex;
        justify-content: space-evenly;
        div {
          display: flex;
          flex-direction: column;
        }
      }
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
