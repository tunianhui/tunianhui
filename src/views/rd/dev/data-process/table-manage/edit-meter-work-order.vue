<template>
  <div
    class="edit-meter-work-order height-100per flex-column"
    v-loading="!!loading"
  >
    <div class="edit-meter-work-order-content">
      <el-alert
        class="ml-40"
        style="width: 600px"
        title="仅能修改自己有修改权限的表！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-form
        class="form"
        ref="formStep"
        :model="table_basic"
        :rules="formRules"
        :label-position="labelPosition"
        :label-width="labelWidth"
      >
        <el-form-item label="数据源类型" prop="datasource_type">
          <el-select
            v-model="table_basic.datasource_type"
            @change="changeDatasourceType"
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
            @change="changeDatasourceID"
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
            @change="changeDatasourceDB"
            placeholder="请先选择数据源"
          >
            <el-option
              v-for="(item, index) in datasourceDbList"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表名称" prop="table_code">
          <el-select
            v-model="table_basic.table_code"
            @change="changeTableCode"
            placeholder="请先选择库"
            filterable
          >
            <el-option
              v-for="(item, index) in tableCodeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
        <el-form-item label="表分层">
          <div v-if="table_basic.table_code == ''">请依次选择上述内容</div>
          <div v-else>
            <span>{{ table_basic.table_layer }}</span>
          </div>
        </el-form-item>
        <el-form-item label="主题归属">
          <div v-if="table_basic.table_code == ''">请依次选择上述内容</div>
          <div v-else>
            <span>{{ table_basic.data_name }}</span>
          </div>
        </el-form-item>
        <el-form-item label="表名描述">
          <div v-if="table_basic.table_code == ''">请依次选择上述内容</div>
          <div v-else>
            <span>{{ table_basic.table_name }}</span>
          </div>
        </el-form-item>
        <el-form-item label="表结构">
          <div v-if="table_basic.table_code == ''">请依次选择上述内容</div>
          <div v-else>
            <el-collapse v-model="activeCollapseName">
              <el-collapse-item name="1" title="非分区字段（现有）">
                <el-table :data="column_info">
                  <el-table-column type="index"></el-table-column>
                  <el-table-column
                    label="字段名称"
                    prop="column_code"
                  ></el-table-column>
                  <el-table-column
                    label="类型"
                    prop="column_type"
                    width="270px"
                  ></el-table-column>
                  <el-table-column
                    label="描述"
                    prop="column_name"
                  ></el-table-column>
                  <el-table-column label="标准化标签">
                    <template slot-scope="scope">
                      <div
                        v-if="
                          scope.row.selected_type !== '0' ||
                          scope.row.selected_type !== '1'
                        "
                      >
                        -
                      </div>
                      <div v-else>
                        <el-tag>{{
                          scope.row.selected_type === '0' ? '维度' : '度量'
                        }}</el-tag
                        >&nbsp;{{
                          scope.row.label_dim_name != '' ||
                          scope.row.label_dim_name !== null
                            ? scope.row.label_dim_name
                            : scope.row.label_measure_name
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column width="120px"></el-table-column>
                </el-table>
              </el-collapse-item>
              <el-collapse-item name="2" title="非分区字段（新增）">
                <el-table :data="nonpartitionedFieldDataAdd">
                  <el-table-column type="index"></el-table-column>
                  <el-table-column label="字段名称">
                    <template slot="header">
                      <span
                        >字段名称&nbsp;<i class="el-icon-question"></i
                      ></span>
                    </template>
                    <template slot-scope="scope">
                      <ElInputVerify
                        :ref="`nameVerify${
                          scope.row.column_id
                            ? scope.row.column_id
                            : scope.row.tempID
                        }`"
                        :propIndexValue="
                          scope.row.column_id
                            ? scope.row.column_id
                            : scope.row.tempID
                        "
                        :propInputValue="scope.row.column_code"
                        :propName="propInputName"
                        propPlaceholder="必填项,不能为空,仅支持小写字母、数字、**"
                        @update-data="updateInputNameData($event, scope.row)"
                      ></ElInputVerify>
                    </template>
                  </el-table-column>
                  <el-table-column label="类型" width="270px">
                    <template slot-scope="scope">
                      <ElInputAutocompleteVerify
                        :ref="`autocomplete${
                          scope.row.column_id
                            ? scope.row.column_id
                            : scope.row.tempID
                        }`"
                        :propIndexValue="
                          scope.row.column_id
                            ? scope.row.column_id
                            : scope.row.tempID
                        "
                        :propInputValue="scope.row.column_type"
                        :propName="propAutocompleteName"
                        :propQuerySearch="querySearch"
                        propPlaceholder="必填项,不能为空,选择列表项后允许编辑"
                        @update-data="updateAutocompleteData($event, scope.row)"
                      ></ElInputAutocompleteVerify>
                    </template>
                  </el-table-column>
                  <el-table-column label="描述">
                    <template slot-scope="scope">
                      <ElInputVerify
                        :ref="`typeVerify${
                          scope.row.column_id
                            ? scope.row.column_id
                            : scope.row.tempID
                        }`"
                        :propIndexValue="
                          scope.row.column_id
                            ? scope.row.column_id
                            : scope.row.tempID
                        "
                        :propInputValue="scope.row.column_name"
                        :propName="propInputDesc"
                        propPlaceholder=""
                        @update-data="updateInputDescData($event, scope.row)"
                      ></ElInputVerify>
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
                        @changeType="changeType1($event, scope.row)"
                        @changeVal="changeVal1($event, scope.row)"
                        @valChange="valChange1($event, scope.row)"
                      ></StandardizedLabel>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="
                          deleteRow1(scope.$index, nonpartitionedFieldDataAdd)
                        "
                        type="text"
                        size="small"
                      >
                        删除
                      </el-button>
                      <MoveUpDown
                        :s_scope="scope"
                        :tableData="nonpartitionedFieldDataAdd"
                        @moveUp="moveUp1($event, nonpartitionedFieldDataAdd)"
                        @moveDown="
                          moveDown1($event, nonpartitionedFieldDataAdd)
                        "
                      ></MoveUpDown>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button
                  class="el-button-define mt-10"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addRow1"
                  >添加字段</el-button
                >
              </el-collapse-item>
              <el-collapse-item name="3" title="分区字段（现有）">
                <div v-if="isHive">
                  <el-table :data="partition_info">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column
                      label="字段名称"
                      prop="column_code"
                    ></el-table-column>
                    <el-table-column
                      label="类型"
                      prop="column_type"
                      width="270px"
                    ></el-table-column>
                    <el-table-column
                      label="描述"
                      prop="column_name"
                    ></el-table-column>
                    <el-table-column label="标准化标签">
                      <template slot-scope="scope">
                        <div
                          v-if="
                            scope.row.selected_type !== '0' ||
                            scope.row.selected_type !== '1'
                          "
                        >
                          -
                        </div>
                        <div v-else>
                          <el-tag>{{
                            scope.row.selected_type === '0' ? '维度' : '度量'
                          }}</el-tag
                          >&nbsp;{{
                            scope.row.label_dim_name != '' ||
                            scope.row.label_dim_name !== null
                              ? scope.row.label_dim_name
                              : scope.row.label_measure_name
                          }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column width="120px"></el-table-column>
                  </el-table>
                </div>
                <el-input
                  v-else
                  class="mt-10 ml-10 mr-10"
                  style="width: 99%"
                  type="textarea"
                  :rows="5"
                  :read-only="true"
                  placeholder="请输入分区信息内容"
                  v-model="table_properties"
                >
                </el-input>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-form-item>
      </el-form>
      <div
        v-if="table_basic.table_code != ''"
        style="margin: 0px 0px 20px 40px"
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
import StandardizedLabel from './components/standardized-label.vue'
import MoveUpDown from './components/move-up-down.vue'
import ElInputVerify from './components/el-input-verify.vue'
import ElInputAutocompleteVerify from './components/el-input-autocomplete-verify.vue'
import {
  queryLabelDim, // 维度
  queryLabelMeasure, //度量
} from '@/api/rd/table-task.js'
import {
  queryDataSourceTypeList,
  queryDataSource,
  queryDataSourceDb,
  queryMetaTableList,
  queryMetaTableInfo,
  queryDataType,
  queryById,
  modifyTableSave,
  modifyTableEdit,
} from '@/api/rd/table-manage.js'
import task from './mixins2'
import {mapGetters} from 'vuex'

export default {
  name: 'EditMeterWorkOrder',
  mixins: [pager, task],
  components: {
    StandardizedLabel,
    MoveUpDown,
    ElInputVerify,
    ElInputAutocompleteVerify,
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
      labelPosition: 'left',
      labelWidth: '100px',
      activeCollapseName: '1',
      datasourceTypeList: [],
      datasourceIdList: [],
      datasourceDbList: [],
      tableCodeList: [],
      tableRowTypes: [],
      column_info: [],
      nonpartitionedFieldDataAdd: [
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
      partition_info: [],
      table_properties: '',
      partitionedFieldDataAdd: [{}],
      isHive: false,
      table_basic: {
        datasource_type: '',
        datasource_id: '',
        datasource_db: '',
        table_code: '',
        table_layer: '',
        table_name: '',
        parent_id: '',
        file_catalog: '',
        name: '',
        data_id: '',
        data_name: '',
        data_code: '',
        submit_comments: '',
      },
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
      submitStatus: false,
      dialogVisible: false,
      isSave: false,
      isSaveID: '',
      currentNodeKey: '',
      title: '',
      loading: 0,
      propInputName: 'column_code',
      propAutocompleteName: 'column_type',
      propInputDesc: 'column_name',
      formRules:{
        datasource_type:{required:true,message: '请选择数据源类型', trigger: 'change'},
        datasource_id:{required:true,message: '请选择数据源', trigger: 'change'},
        datasource_db:{required:true,message: '请选择库', trigger: 'change'},
        table_code:{required:true,message: '请选择表名称', trigger: 'change'},
        parent_id:{required:true,message: '请选择目录', trigger: 'change'},
      }
    }
  },
  computed: {
    ...mapGetters(['project']),
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
    this.queryDataSourceTypeList()
    this.getLevelList()
  },
  methods: {
    updateInputNameData(inputValue, row) {
      row[this.propInputName] = inputValue.data[this.propInputName]
    },
    updateAutocompleteData(inputValue, row) {
      row[this.propAutocompleteName] =
        inputValue.data[this.propAutocompleteName]
    },
    updateInputDescData(inputValue, row) {
      row[this.propInputDesc] = inputValue.data[this.propInputDesc]
    },
    async queryById() {
      let params = {
        id: this.data.id,
      }
      const res = await queryById(params)
      if (res.flag) {
        this.isSave = true
        this.isSaveID = this.data.id
        const {
          table_basic,
          column_info,
          new_column_info,
          partition_info,
          table_properties,
        } = res.data
        let temp_column_info = this.parseJsonData(
          column_info ? column_info : '[]'
        )
        let temp_new_column_info = this.parseJsonData(
          new_column_info ? new_column_info : '[]'
        )
        let temp_partition_info = this.parseJsonData(
          partition_info ? partition_info : '[]'
        )
        this.table_basic = {
          ...this.table_basic,
          ...table_basic,
        }
        this.column_info = temp_column_info
        this.nonpartitionedFieldDataAdd = temp_new_column_info
        this.partition_info = temp_partition_info
        this.table_properties = table_properties ? table_properties : ''
        this.setIsHiveStatus(this.table_basic.datasource_type)
        this.queryDataSourceTypeList()
        this.queryDataSource()
        this.queryDataSourceDb()
        this.queryMetaTableList()
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
    async saveData(status) {
      let validateField = ['datasource_type','datasource_id','datasource_db','table_code','parent_id',]
      let flag = true
      this.$refs.formStep.validateField(validateField,(valid)=>{
        flag = flag && valid == ''
      })
      let nameFlag = true,
        typeFlag = true,
        descFlag = true
      for (
        let index = 0;
        index < this.nonpartitionedFieldDataAdd.length;
        index++
      ) {
        const refMap = this.nonpartitionedFieldDataAdd.map((i) =>
          i.column_id ? i.column_id : i.tempID
        )
        refMap.map((i, d) => {
          if (this.nonpartitionedFieldDataAdd[index].tempID == i) {
            let nameResult = this.$refs[`nameVerify` + i].isValid()
            let typeResult = this.$refs[`autocomplete` + i].isValid()
            let descResult = this.$refs[`typeVerify` + i].isValid()
            nameFlag = nameFlag && nameResult
            typeFlag = typeFlag && typeResult
            descFlag = descFlag && descResult
          }
        })
      }
      if (flag && nameFlag && typeFlag && descFlag) {
      } else {
        return false
      }
      let params = {
        project_id: this.project.project_id,
        project_code: this.project.project_code,
        ...this.table_basic,
        new_column_info: JSON.stringify([
          ...this.nonpartitionedFieldDataAdd,
        ]),
        status: status,
      }
      params.column_info = JSON.stringify(
        params.column_info ? params.column_info : '[]'
      )
      params.partition_info = JSON.stringify(
        params.partition_info ? params.partition_info : '[]'
      )
      console.log('save-params', params)
      this.loading++
      let res
      if (this.isSave) {
        res = await modifyTableEdit({id: this.isSaveID, ...params})
      } else {
        res = await modifyTableSave(params)
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
      this.$root.eventEmitter.emit('table-manage-refresh-treeData')
    },
    async submitData(status) {
      let validateField = ['datasource_type','datasource_id','datasource_db','table_code','parent_id',]
      let flag = true
      this.$refs.formStep.validateField(validateField,(valid)=>{
        flag = flag && valid == ''
      })
      let nameFlag = true,
        typeFlag = true,
        descFlag = true
      for (
        let index = 0;
        index < this.nonpartitionedFieldDataAdd.length;
        index++
      ) {
        const refMap = this.nonpartitionedFieldDataAdd.map((i) =>
          i.column_id ? i.column_id : i.tempID
        )
        refMap.map((i, d) => {
          if (this.nonpartitionedFieldDataAdd[index].tempID == i) {
            let nameResult = this.$refs[`nameVerify` + i].isValid()
            let typeResult = this.$refs[`autocomplete` + i].isValid()
            let descResult = this.$refs[`typeVerify` + i].isValid()
            nameFlag = nameFlag && nameResult
            typeFlag = typeFlag && typeResult
            descFlag = descFlag && descResult
          }
        })
      }
      if (flag && nameFlag && typeFlag && descFlag) {
      } else {
        this.dialogVisible = false
        return false
      }
      let params = {
        project_id: this.project.project_id,
        project_code: this.project.project_code,
        ...this.table_basic,
        new_column_info: JSON.stringify([
          ...this.nonpartitionedFieldDataAdd,
        ]),
        status: status,
      }
      params.column_info = JSON.stringify(
        params.column_info ? params.column_info : '[]'
      )
      params.partition_info = JSON.stringify(
        params.partition_info ? params.partition_info : '[]'
      )
      console.log('submit-params', params)
      this.loading++
      let res
      if (this.isSave) {
        res = await modifyTableEdit({id: this.isSaveID, ...params})
      } else {
        res = await modifyTableSave(params)
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
          message: '提交成功',
        })
      } else {
        this.loading--
        this.$message({
          type: 'error',
          message: res.msg,
        })
      }
      this.$root.eventEmitter.emit('table-manage-refresh-treeData')
    },
    saveOrSubmitRemove(id) {
      this.tabStore.commit('remove', id ? id : 'modify_EditTable')
    },
    resetColumn_info() {
      this.column_info = []
    },
    resetNonpartitionedFieldDataAdd() {
      this.nonpartitionedFieldDataAdd = [
        {
          tempID: Date.now().toString(),
          column_code: '',
          column_type: '',
          column_name: '',
          label_dim_id: '',
          label_dim_name: '',
          label_measure_id: '',
          label_measure_name: '',
          selected_type: '2',
          selected_value: [],
        },
      ]
    },
    resetPartition_info() {
      this.partition_info = []
    },
    resetTable_properties() {
      this.table_properties = ''
    },
    resetTable_basic(params) {
      const {datasource_type, datasource_id, datasource_db} = this.table_basic
      this.table_basic = {
        datasource_type: '',
        datasource_id: '',
        datasource_db: '',
        table_code: '',
        table_layer: '',
        table_name: '',
        parent_id: '',
        file_catalog: '',
        name: '',
        data_id: '',
        data_name: '',
        data_code: '',
        submit_comments: '',
      }
      if (params.type == 'type') {
        this.table_basic.datasource_type = params.value
      } else if (params.type == 'id') {
        this.table_basic.datasource_type = datasource_type
        this.table_basic.datasource_id = params.value
      } else if (params.type == 'db') {
        this.table_basic.datasource_type = datasource_type
        this.table_basic.datasource_id = datasource_id
        this.table_basic.datasource_db = params.value
      }
    },
    async queryDataType() {
      let params = {
        datasource_type: this.table_basic.datasource_type,
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
    querySearch(queryString, cb) {
      let tableRowTypes = this.tableRowTypes
      let results = queryString
        ? tableRowTypes.filter(this.createFilter(queryString))
        : tableRowTypes
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    handleSelect(item) {
    },
    changeDatasourceType(val) {
      this.setIsHiveStatus(val)
      this.queryDataType()
      this.table_basic.datasource_id = ''
      this.resetColumn_info()
      this.resetNonpartitionedFieldDataAdd()
      this.resetPartition_info()
      this.resetTable_properties()
      this.resetTable_basic({type: 'type', value: val})
      this.queryDataSource()
    },
    changeDatasourceID(val) {
      this.table_basic.datasource_db = ''
      this.queryDataSourceDb()
      this.resetColumn_info()
      this.resetNonpartitionedFieldDataAdd()
      this.resetPartition_info()
      this.resetTable_properties()
      this.resetTable_basic({type: 'id', value: val})
    },
    changeDatasourceDB(val) {
      this.table_basic.table_code = ''
      this.queryMetaTableList()
      this.resetColumn_info()
      this.resetNonpartitionedFieldDataAdd()
      this.resetPartition_info()
      this.resetTable_properties()
      this.resetTable_basic({type: 'db', value: val})
    },
    async changeTableCode() {
      let params = {
        project_id: this.project.project_id,
        datasource_type: this.table_basic.datasource_type,
        datasource_id: this.table_basic.datasource_id,
        datasource_db: this.table_basic.datasource_db,
        table_code: this.table_basic.table_code,
      }
      const res = await queryMetaTableInfo(params)
      console.log(res)
      if (res.flag) {
        const {
          column_info,
          partition_info,
          table_layer,
          table_name,
          data_name,
          data_id,
          data_code,
          table_properties,
        } = res.data
        this.column_info = column_info ? column_info : []
        this.partition_info = partition_info ? partition_info : []
        this.table_properties = table_properties ? table_properties : ''
        this.table_basic = {...this.table_basic, ...res.data}
      }
    },
    setIsHiveStatus(val) {
      if (val == 'hive') {
        this.isHive = true
      } else {
        this.isHive = false
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
    async queryDataSourceDb() {
      this.datasourceDbList = []
      let params = {
        project_code: this.project.project_code,
        datasource_type: this.table_basic.datasource_type,
        datasource_id: this.table_basic.datasource_id,
      }
      const res = await queryDataSourceDb(params)
      if (res.flag) {
        this.datasourceDbList = res.data.map((i, d) => {
          return {
            ...i,
            value: i.name,
            label: i.name,
          }
        })
      }
    },
    async queryMetaTableList() {
      this.tableCodeList = []
      let params = {
        project_id: this.project.project_id,
        datasource_type: this.table_basic.datasource_type,
        datasource_id: this.table_basic.datasource_id,
        datasource_db: this.table_basic.datasource_db,
      }
      const res = await queryMetaTableList(params)
      if (res.flag) {
        this.tableCodeList = res.data.map((i, d) => {
          return {
            ...i,
            value: i.table_code,
            label: i.table_code,
          }
        })
      }
    },
    changeType1(t, row) {
      let temp = '2'
      if (t == '0') {
        temp = '0'
      } else if (t == '1') {
        temp = '1'
      }
      row.selected_type = temp
    },
    changeVal1(v, row) {
      if (Array.isArray(v) && v.length == 0) {
        row.label_measure_id = ''
        row.label_measure_name = ''
        row.label_dim_id = ''
        row.label_dim_name = ''
      }
      row.selected_value = v
    },
    valChange1(v, row) {
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
    deleteRow1(index, rows) {
      rows.splice(index, 1)
    },
    moveUp1(e, table) {
      table = e
    },
    moveDown1(e, table) {
      table = e
    },
    addRow1() {
      this.nonpartitionedFieldDataAdd.push({
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
      })
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
.el-button-define {
  margin: 10px 10px;
}
.page-title {
  margin-bottom: 50px;
}
</style>
<style lang="scss">
.edit-meter-work-order {
  padding: 40px 0px;
  background-color: #fff;
  .edit-meter-work-order-content {
    .form {
      width: 90%;
      margin: 10px 0px 0px 40px;
      .el-select,
      .el-cascader {
        width: 80%;
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