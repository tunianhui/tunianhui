<template>
  <div class="form-mode height-100per flex-column" v-loading="!!loading">
    <div class="form-mode-content">
      <el-collapse v-model="formActiveNames">
        <el-collapse-item :name="'1'">
          <span class="collapse-title" slot="title">字段配置</span>
          <div>
            <el-table
              :data="columnInfo"
              :row-key="(r) => (r.column_id ? r.column_id : r.tempID)"
              style="width: 100%"
            >
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column>
                <template slot="header"
                  >字段名称&nbsp;<el-icon class="el-icon-question"></el-icon
                ></template>
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
              <el-table-column label="操作" width="120px">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, columnInfo)"
                    type="text"
                    size="small"
                  >
                    删除
                  </el-button>
                  <MoveUpDown
                    :s_scope="scope"
                    :tableData="columnInfo"
                    @moveUp="moveUp1($event, columnInfo)"
                    @moveDown="moveDown1($event, columnInfo)"
                  ></MoveUpDown>
                </template>
              </el-table-column>
            </el-table>
            <el-button
              class="el-button-define"
              type="primary"
              icon="el-icon-plus"
              @click="addRow"
              >添加字段</el-button
            >
          </div>
          <div v-if="isHive">
            <el-table
              :data="partitionInfo"
              :row-key="(r) => (r.column_id ? r.column_id : r.tempID)"
              style="width: 100%"
            >
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column label="分区字段名称">
                <template slot-scope="scope">
                  <!-- <el-input
                    v-model="scope.row.column_code"
                    placeholder="必填项,不能为空,仅支持小写字母、数字、**"
                  ></el-input> -->
                  <ElInputVerify
                    :ref="`partitionNameVerify${
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
                    :ref="`partitionAutocomplete${
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
                    :ref="`partitionTypeVerify${
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
              <el-table-column label="操作" width="120px">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="
                      deleteRow2(scope.$index, partitionInfo)
                    "
                    type="text"
                    size="small"
                  >
                    删除
                  </el-button>
                  <MoveUpDown
                    :s_scope="scope"
                    :tableData="partitionInfo"
                    @moveUp="moveUp2($event, partitionInfo)"
                    @moveDown="moveDown2($event, partitionInfo)"
                  ></MoveUpDown>
                </template>
              </el-table-column>
            </el-table>
            <el-button
              class="el-button-define"
              type="primary"
              icon="el-icon-plus"
              @click="addRow2"
              >添加分区字段</el-button
            >
          </div>
          <el-input
            v-else
            class="mt-10 ml-10 mr-10"
            style="width: 99%"
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
              <el-radio-group
                v-model="tableParam.table_lifecycle_type"
                @input="changeTableLifecycleType"
              >
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
              <el-radio-group
                v-model="tableParam.part_lifecycle_type"
                @input="changePartLifecycleType"
              >
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
</template>

<script>
import pager from '@/mixins/pager'
import StandardizedLabel from './components/standardized-label.vue'
import MoveUpDown from './components/move-up-down.vue'
import ElInputVerify from './components/el-input-verify.vue'
import ElInputAutocompleteVerify from './components/el-input-autocomplete-verify.vue'
import {
  queryDataType,
  queryLabelDim,
  queryLabelMeasure,
} from '@/api/rd/table-manage.js'
import {mapGetters} from 'vuex'

export default {
  name: 'FormMode',
  mixins: [pager],
  components: {
    StandardizedLabel,
    MoveUpDown,
    ElInputVerify,
    ElInputAutocompleteVerify,
  },
  props: {
    loading: {
      type: Number,
      default: 0,
    },
    datasource_type: {
      type: String,
      default: '',
    },
    isHive: {
      type: Boolean,
      default: false,
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
      restaurants: [],
      propInputName: 'column_code',
      propAutocompleteName: 'column_type',
      propInputDesc: 'column_name',
    }
  },
  computed: {
    ...mapGetters(['project']),
  },
  watch: {},
  created() {
    this.queryDataType()
    this.getLevelList()
    if (this.isSave) {
      this.uncommittedOrReject()
    }
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
    changeTableLifecycleType(type, val) {
      if (type == '0') {
        this.tableParam.table_lifecycle = ''
      }
    },
    changePartLifecycleType(type, val) {
      if (type == '0') {
        this.tableParam.part_lifecycle = ''
      }
    },
    querySearch(queryString, cb) {
      let tableRowTypes = this.tableRowTypes
      let results = queryString
        ? tableRowTypes.filter(this.createFilter(queryString))
        : tableRowTypes
      // 调用 callback 返回建议列表的数据
      let temp = cb(results)
      return temp
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    handleSelect(item) {},
    uncommittedOrReject() {
      console.log('form保存')
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
      let nameFlag = true,
        typeFlag = true,
        descFlag = true
      for (let index = 0; index < this.columnInfo.length; index++) {
        const refMap = this.columnInfo.map((i) =>
          i.column_id ? i.column_id : i.tempID
        )
        refMap.map((i, d) => {
          if (this.columnInfo[index].tempID == i) {
            let nameResult = this.$refs[`nameVerify` + i].isValid()
            let typeResult = this.$refs[`autocomplete` + i].isValid()
            let descResult = this.$refs[`typeVerify` + i].isValid()
            nameFlag = nameFlag && nameResult
            typeFlag = typeFlag && typeResult
            descFlag = descFlag && descResult
          }
        })
      }
      if (nameFlag && typeFlag && descFlag) {
      } else {
        return false
      }
      if (this.isHive) {
        for (let index = 0; index < this.partitionInfo.length; index++) {
          const refMap = this.partitionInfo.map((i) =>
            i.column_id ? i.column_id : i.tempID
          )
          refMap.map((i, d) => {
            if (this.partitionInfo[index].tempID == i) {
              let nameResult = this.$refs[`partitionNameVerify` + i].isValid()
              let typeResult = this.$refs[`partitionAutocomplete` + i].isValid()
              let descResult = this.$refs[`partitionTypeVerify` + i].isValid()
              nameFlag = nameFlag && nameResult
              typeFlag = typeFlag && typeResult
              descFlag = descFlag && descResult
            }
          })
        }
        if (nameFlag && typeFlag && descFlag) {
        } else {
          return false
        }
      }
      let allData = {}
      if (this.isHive) {
        delete this.tableParam.table_properties
        allData = {
          column_info: JSON.stringify(this.columnInfo),
          partition_info: JSON.stringify(this.partitionInfo),
          table_param: JSON.stringify(this.tableParam),
        }
      } else {
        delete this.tableParam.table_type
        delete this.tableParam.storage_type
        allData = {
          column_info: JSON.stringify(this.columnInfo),
          table_param: JSON.stringify(this.tableParam),
        }
      }
      return allData
    },
    async queryDataType() {
      let params = {
        datasource_type: this.datasource_type,
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
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    addRow() {
      this.columnInfo.push({
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
    deleteRow2(index, rows) {
      rows.splice(index, 1)
    },
    addRow2() {
      this.partitionInfo.push({
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
    moveUp(scope, array) {
      array[scope.$index] = array.splice(
        scope.$index - 1,
        1,
        array[scope.$index]
      )[0]
    },
    moveDown(scope, array) {
      array[scope.$index] = array.splice(
        scope.$index + 1,
        1,
        array[scope.$index]
      )[0]
    },
    moveUp1(e, table) {
      table = e
    },
    moveDown1(e, table) {
      table = e
    },
    moveUp2(e, table) {
      table = e
    },
    moveDown2(e, table) {
      table = e
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
.form-mode {
  .form-mode-content {
    margin: 10px 0px 0px 40px;
    width: 95%;
    .el-button-define {
      margin: 10px 0px;
    }
    .el-button-define:last-of-type {
      margin: 10px 0px 0px;
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
