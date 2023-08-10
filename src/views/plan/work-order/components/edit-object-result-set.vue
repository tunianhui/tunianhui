<template>
  <div class="edit-object-result-set height-100per flex-column">
    <div class="edit-object-result-set-content">
      <el-dialog
        :title="'局部编辑--编辑对象：' + titleContent"
        width="70%"
        :visible.sync="visible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @opened="getAndSetSlectedTable"
      >
        <div>
          <div v-if="ifTemp" style="width: 30%">
            <el-select v-model="selectedTempData">
              <el-option
                v-for="(item, index) in tempSelectList"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </div>
          <el-row>
            <el-col :span="12">
              <el-collapse v-model="activeItem">
                <el-collapse-item title="输入表字段选择" name="1">
                  <el-table
                    ref="inputTableData"
                    :data="inputTableData"
                    @selection-change="changeSelectedTable"
                  >
                    <el-table-column
                      type="selection"
                      width="55"
                      v-model="selectedTableData"
                    ></el-table-column>
                    <el-table-column
                      label="字段名称"
                      prop="fieldName"
                    ></el-table-column>
                    <el-table-column label="类型" prop="type"></el-table-column>
                    <el-table-column
                      label="描述"
                      prop="description"
                    ></el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </el-col>
            <el-col :span="12">
              <el-collapse v-model="activeItem">
                <el-collapse-item title="结果集加工1--字段" name="1">
                  <el-table :data="resultSetProcessField">
                    <el-table-column label="聚" width="55">
                      <template slot-scope="scope">
                        <el-checkbox :disabled="scope.row.status"></el-checkbox>
                      </template>
                    </el-table-column>
                    <el-table-column label="原始字段加工">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.fieldName">
                          <el-option
                            v-for="(item, index) in resultSetOptions"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                          ></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="新字段名称">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.newFieldName"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="新类型">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.newType">
                          <el-option
                            v-for="(item, index) in resultSetOptions1"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                          ></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="新描述">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.newDescription"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button
                          type="text"
                          size="small"
                          @click="delItem(scope.row)"
                        >
                          <i class="el-icon-close"></i>
                        </el-button>
                        <el-button
                          type="text"
                          size="small"
                          @click="addItem(scope.row)"
                          :disabled="true"
                        >
                          <i class="el-icon-plus"></i>
                        </el-button>
                        <MoveUpDown
                          :s_scope="scope"
                          :tableData="resultSetProcessField"
                          :showText="false"
                          @moveUp="moveUp($event, resultSetProcessField)"
                          @moveDown="moveDown($event, resultSetProcessField)"
                        >
                        </MoveUpDown>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="12">
              <el-collapse v-model="activeItem">
                <el-collapse-item title="结果集加工2--过滤条件" name="1">
                  <div>
                    表过滤条件
                    <el-input
                      placeholder="请输入表过滤内容，即where子句的内容，如分组和其他字段过滤，子句自动会添加左右括号"
                      v-model="resultSetProcessFilterCondition.condition"
                      type="textarea"
                    >
                    </el-input>
                  </div>
                  <div>
                    表过滤备注
                    <el-input
                      placeholder="请输入表过滤条件的附加说明，用于记录处理逻辑，非必填"
                      v-model="resultSetProcessFilterCondition.remark"
                      type="textarea"
                    >
                    </el-input>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">关闭</el-button>
          <el-button type="primary" @click="saveDialog">保存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import MoveUpDown from './move-up-down.vue'

export default {
  name: 'EditObjectResultSet',
  mixins: [pager],
  components: {
    MoveUpDown,
  },
  props: {
    DMLvisible: {
      type: Boolean,
      default: false,
    },
    ifTemp: {
      type: Boolean,
      default: true,
    },
    indexNum: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      activeItem: '1',
      inputTableData: [],
      selectedTableData: [],
      resultSetProcessField: [],
      resultSetOptions: [
        {
          value: 't1.id',
          label: 't1.id',
        },
        {
          value: 't1.user_name',
          label: 't1.user_name',
        },
        {
          value: 't1.dt',
          label: 't1.dt',
        },
        {
          value: 't2.id',
          label: 't2.id',
        },
        {
          value: 't2.user_name',
          label: 't2.user_name',
        },
        {
          value: 't2.dt',
          label: 't2.dt',
        },
      ],
      resultSetOptions1: [
        {
          value: 'string',
          label: 'string',
        },
        {
          value: 'array',
          label: 'array',
        },
        {
          value: 'object',
          label: 'object',
        },
      ],
      resultSetProcessFilterCondition: {
        condition: '',
        remark: '',
      },
      initialLoading: true,
      resultSetClick: false,
      tempSelectList: [
        {
          value: 'show.dwd_test',
          label: 'show.dwd_test',
        },
        {
          value: 'show.dwd_test1',
          label: 'show.dwd_test1',
        },
      ],
      selectedTempData: 'show.dwd_test',
    }
  },
  computed: {
    visible: {
      get() {
        return this.DMLvisible
      },
      set(v) {
        this.$emit('closeDialog')
        this.initialLoading = true
        this.inputTableData = []
        this.selectedTableData = []
        this.resultSetProcessField = []
      },
    },
    titleContent() {
      if (this.ifTemp) {
        return '临时结果集' + (Number(this.indexNum) + 1)
      } else {
        return '最终结果集'
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    delItem(row) {
      console.log('row', row)
      console.log('this.inputTableData', this.inputTableData)
      console.log('this.selectedTableData', this.selectedTableData)
      console.log('this.resultSetProcessField', this.resultSetProcessField)
      let index1 = this.resultSetProcessField.findIndex((item1, index11) => {
        return item1.id == row.id
      })
      this.resultSetProcessField.splice(index1, 1)
      let index2 = this.inputTableData.findIndex((item2, index22) => {
        return item2.id == row.id
      })
      this.resultSetClick = true
      this.$refs.inputTableData.toggleRowSelection(
        this.inputTableData[index2],
        false
      )
      let index3 = this.selectedTableData.findIndex((item3, index33) => {
        return item3.id == row.id
      })
      this.selectedTableData.splice(index3, 1)
    },
    addItem() {},
    closeDialog() {
      this.$emit('closeDialog')
      this.initialLoading = true
      this.inputTableData = []
      this.selectedTableData = []
      this.resultSetProcessField = []
    },
    saveDialog() {
      console.log('EditObjectResultSet', this.indexNum)
      this.$emit('saveDialog', {
        index: this.indexNum,
        table: 'show.dwd_test',
        str1: {
          label: 'id',
          value: 'STRING',
        },
        str2: {
          label: 'user_name',
          value: 'STRING',
        },
        str3: {
          label: 'dt',
          value: 'STRING',
        },
      })
      this.initialLoading = true
      this.inputTableData = []
      this.selectedTableData = []
      this.resultSetProcessField = []
    },
    getAndSetSlectedTable() {
      console.log('getAndSetSlectedTable')
      this.selectedTableData = [
        {
          id: '1',
          fieldName: 't1.id',
          type: 'string',
          description: '-',
        },
        {
          id: '2',
          fieldName: 't1.user_name',
          type: 'string',
          description: '-',
        },
      ]
      this.inputTableData = [
        {
          id: '1',
          fieldName: 't1.id',
          type: 'string',
          description: '-',
        },
        {
          id: '2',
          fieldName: 't1.user_name',
          type: 'string',
          description: '-',
        },
        {
          id: '3',
          fieldName: 't1.dt',
          type: 'string',
          description: '-',
        },
        {
          id: '4',
          fieldName: 't2.id',
          type: 'string',
          description: '-',
        },
        {
          id: '5',
          fieldName: 't2.user_name',
          type: 'string',
          description: '-',
        },
        {
          id: '6',
          fieldName: 't2.dt',
          type: 'string',
          description: '-',
        },
      ]
      this.selectedTableData.forEach((item, index) => {
        this.inputTableData.forEach((ite, inde) => {
          if (ite.id == item.id) {
            this.$nextTick(() => {
              this.$refs.inputTableData.toggleRowSelection(ite, true)
            })
          }
        })
      })
      this.convertSelectedToResultSet('request')
    },
    changeSelectedTable(val) {
      console.log('changeSelectedTable')
      if (this.initialLoading) return
      if (this.resultSetClick) {
        setTimeout(() => {
          this.resultSetClick = false
        }, 0)
        return
      }
      this.convertSelectedToResultSet('inputChange', val)
    },
    convertSelectedToResultSet(type, val) {
      console.log('convertSelectedToResultSet')
      if (type == 'request') {
        this.resultSetProcessField = this.selectedTableData.map(
          (item, index) => {
            return {
              ...item,
              status: true,
              newFieldName: '',
              newType: item.type,
              newDescription: '',
            }
          }
        )
        setTimeout(() => {
          this.initialLoading = false
        }, 0)
      }
      if (type == 'inputChange') {
        let oldVal = this.selectedTableData,
          newVal = val
        const res = this.getArrDiffValue(oldVal, newVal)
        if (res.type == 'add') {
          let temp = res.result
          for (let index = 0; index < temp.length; index++) {
            const element = temp[index]
            this.selectedTableData.push({
              ...element,
            })
            this.resultSetProcessField.push({
              ...element,
              status: true,
              newFieldName: '',
              newType: element.type,
              newDescription: '',
            })
          }
        } else {
          let temp = res.result
          for (let index = 0; index < temp.length; index++) {
            const element = temp[index]
            let index1 = this.selectedTableData.findIndex((item1, index11) => {
              return item1.id == element.id
            })
            this.selectedTableData.splice(index1, 1)
            let index2 = this.resultSetProcessField.findIndex(
              (item2, index22) => {
                return item2.id == element.id
              }
            )
            this.resultSetProcessField.splice(index2, 1)
          }
        }
      }
    },
    getArrDiffValue(oldVal, newVal) {
      console.log('getArrDiffValue')
      let result = [],
        longVal = oldVal.length > newVal.length ? oldVal : newVal,
        shortVal = oldVal.length > newVal.length ? newVal : oldVal
      for (let i = 0; i < longVal.length; i++) {
        let longItem = longVal[i]
        let lId = longItem.id
        let isExist = false
        for (let j = 0; j < shortVal.length; j++) {
          let shortItem = shortVal[j]
          let sID = shortItem.id
          if (sID == lId) {
            isExist = true
            break
          }
        }
        if (!isExist) {
          result.push(longItem)
        }
      }
      return {
        type: oldVal.length > newVal.length ? 'subtract' : 'add',
        result,
      }
    },
    moveUp(e, val) {
      val = e
    },
    moveDown(e, val) {
      val = e
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
.edit-object-result-set {
  .edit-object-result-set-content {
  }
}
</style>
