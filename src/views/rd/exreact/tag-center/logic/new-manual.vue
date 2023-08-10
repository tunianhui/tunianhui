<template>
  <div class="new-manual">
    <el-dialog
      :visible.sync="isVisible"
      title="新建手工标签"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="create-munual"
      top="10vh"
      :width="width"
      @close="close"
    >
      <div class="step-wrapper">
        <div class="steps-progress-bar" :style="style"></div>
        <div class="steps">
          <div class="steps-item">
            <div class="steps-item-container">
              <div class="steps-icon">
                <i class="iconfont icon-1 active" v-if="activeStep === 0"></i>
                <i class="el-icon-success success" v-if="activeStep === 1"></i>
              </div>
              <div class="step-content">关联逻辑</div>
            </div>
          </div>
          <div class="steps-item">
            <div class="steps-item-container">
              <div class="steps-icon">
                <i :class="['iconfont icon-2', activeStep === 1 ? 'active' : '']"></i>
              </div>
              <div class="step-content">关联逻辑</div>
            </div>
          </div>
        </div>
      </div>
      <el-form
        class="mt-10"
        ref="form"
        :model="filter"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <template v-if="activeStep === 0">
          <el-form-item label="来源物理表：" prop="dataSource">
            <el-select
              v-model="filter.source_table_id"
              placeholder="请选择来源物理表"
              clearable
              filterable
              @change="selectSourceTableChange"
            >
              <el-option
                v-for="item in tables"
                :key="item.source_table_id"
                :value="item.source_table_id"
                :label="item.display_table_code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联逻辑：">
            <div class="card">
              <p>标签主键</p>
              <el-form-item label-width="90px" label="ID_type =" prop="id_type">
                <el-input v-model="filter.id_type" v-if="show" disabled></el-input>
                <el-select
                  v-model="filter.id_type"
                  placeholder="请输入string类型的字段"
                  clearable
                  filterable
                  v-if="!show"
                  @change="changeIdType"
                >
                  <el-option
                    v-for="item in idTypeList"
                    :key="item.id"
                    :value="item.id_type"
                    :label="item.id_name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="90px" label="ID_value =" prop="id_value">
                <el-input v-model="filter.id_value" disabled v-if="show"></el-input>
                <el-select
                  v-model="filter.id_value"
                  placeholder="请输入string类型的字段"
                  clearable
                  filterable
                  v-if="!show"
                >
                  <el-option
                    v-for="item in idValueList"
                    :key="item.element_id"
                    :value="item.label_code"
                    :label="item.label_code"
                  ></el-option>
                </el-select>
              </el-form-item>
              <p>时间分区</p>
              <el-form-item label-width="90px" label="ds =" prop="partition_col">
                <el-input v-model="filter.partition_col" v-if="show" disabled></el-input>
                <el-select
                  v-model="filter.partition_col"
                  placeholder="请输入string类型的字段"
                  v-if="!show"
                >
                  <el-option
                    v-for="item in dsList"
                    :key="item.element_id"
                    :value="item.label_code"
                    :label="item.label_code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form-item>
        </template>

        <template v-if="activeStep === 1">
          <el-row class="step2-header mb-10">
            <el-col :span="24" class="mt-5 mb-5">
              <span class="mr-5">来源物理表:</span>
              <i>{{source_table_code}}</i>
            </el-col>
            <el-col :span="24" class="mt-5 mb-15">
              <span class="mr-5">关联逻辑:</span>
              <i>{{relation_logic}}</i>
            </el-col>
          </el-row>
          <div class="field-info">
            <div class="origin-field-list">
               <el-input
                size="mini"
                placeholder="请输入内容"
                suffix-icon="el-icon-search"
                v-model="field_key">
              </el-input>
              <el-table
                :data="filterField"
                style="width: 100%"
                class="field-table"
                ref="multipleTable"
                max-height="300"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="label_code"
                  label="字段及描述">
                </el-table-column>
              </el-table>
              <div class="all-select">
                <el-checkbox v-model="allChecked" @change="allSelect">全选</el-checkbox>
              </div>
            </div>
            <div class="add-field-btn my-btn pr-10 pl-10">
              <el-button type="primary" plain @click="add">添加 >></el-button>
            </div>
            <div class="target-field-list">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="新增列表" name="add">
                      <el-table
                      :data="addTableData"
                      max-height="230"
                      style="width: 100%">
                      <el-table-column
                        prop="label_code"
                        label="标签英文名"
                        width="140">
                        <template slot="header">
                          <span style="color: #FF0A0A;vertical-align: middle;" class="mr-5">*</span>标签英文名
                        </template>
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.new_label_code"></el-input>
                          <OverflowTooltip
                            style="opacity: 0.5;display: inline-block;width: calc(100% - 10px)"
                            class="mt-5">原始英文名: {{scope.row.label_code}}
                          </OverflowTooltip>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="label_name"
                        label="标签名称"
                        width="140">
                        <template slot="header">
                          <span style="color: #FF0A0A;vertical-align: middle;" class="mr-5">*</span>标签名称
                        </template>
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.new_label_name" @input="input"></el-input>
                          <!-- <span style="opacity: 0.5;display: inline-block;" class="mt-5">原始英文名: {{scope.row.label_code}}</span> -->
                          <span style="opacity: 0.5;display: inline-block;" class="mt-5">原始描述</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="category_id"
                        label="所属类目">
                        <template slot-scope="scope">
                          <!-- <el-select v-model="scope.row.category_id">
                            <el-option
                              v-for="item in categoryList"
                              :key="item.category_name"
                              :label="item.category_name"
                              :value="item.id">
                            </el-option>
                          </el-select> -->
                          <el-select
                            v-model="scope.row.category_id"
                            placeholder="请选择"
                            ref="treeSelect"
                            popper-class="select-tree"
                          >
                            <el-option
                              :label="scope.row.category_name"
                              :value="scope.row.category_id"
                              style="max-height:auto;background-color:#fff"
                            >
                              <el-tree
                                :data="treeData"
                                :props="defaultProps"
                                :current-node-key="currentNodeKey"
                                node-key="id"
                                accordion
                                :highlight-current="true"
                                :expand-on-click-node="false"
                                @node-click="((data, node) => handleNodeClick(data, node, scope.row))"
                                ref="tree"
                                style="font-weight: 400"
                              >
                              </el-tree>
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="auth_status"
                        label="公开状态"
                        width="100">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.auth_status">
                            <el-option
                              label="隐藏"
                              value="1">
                            </el-option>
                            <el-option
                              label="公开"
                              value="0">
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                       <el-table-column
                        label="操作"
                        width="50">
                        <template slot-scope="scope">
                          <el-button
                            class="font-16"
                            type="text"
                            size="small"
                            icon="el-icon-delete"
                            @click="del(scope.row)">
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane :label="`历史已添加列表(${historyLength})`" name="history">
                    <el-table
                      :data="historyTableData"
                      max-height="230"
                      style="width: 100%">
                      <el-table-column
                        prop="label_code"
                        label="标签英文名">
                      </el-table-column>
                      <el-table-column
                        prop="label_name"
                        label="标签名称">
                      </el-table-column>
                      <el-table-column
                        prop="label_category"
                        label="所属类目">
                      </el-table-column>
                      <el-table-column
                        prop="auth_status"
                        label="公开状态">
                        <template slot-scope="scope">{{scope.row.auth_status === '0' ? '公开' : '隐藏'}}</template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                </el-tabs>
            </div>
          </div>
        </template>

      </el-form>
      <div slot="footer" class="my-btn">
        <el-button @click="close" plain type="primary">取消</el-button>
        <el-button type="primary" class="primary" @click="nextStep" v-if="activeStep === 0">
          关联并下一步
        </el-button>
        <el-button type="primary" plain class="primary" @click="upStep" v-if="activeStep === 1">
          上一步
        </el-button>
        <el-button type="primary" class="primary" @click="confirm" v-if="activeStep === 1" :loading="disabledBtn">
          {{ disabledBtn ? '提交中。。。' : '提交'}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import OverflowTooltip from '@c/overflow-tooltip'
import {
  queryListSrcTab,
  getTabCol,
  queryCategory,
  isLabelExists,
  addManual,
  getTabCategoryList,
  getHistroyList,
  getIdType
} from '@/api/rd/exreact/tag-center'
export default {
  name: 'NewManual',
  mixins: [editDialog],
  components: {
    OverflowTooltip
  },
  data() {
    const idTypeValidator = (rule, value, callback) => {
      const curObj = this.idTypeList.find(item => item.id_type === value)
      if (!this.show) {
        if (curObj) {
          if (curObj.element_type.toLowerCase() !== 'string') {
            callback(new Error('来源表ID_TYPE字段类型有误！请选择String类型的来源字段'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请选择id_type'))
        }
      } else {
        callback()
      }
    }
    const idValueValidator = (rule, value, callback) => {
      const curObj = this.idValueList.find(item => item.label_code === value)
      if (!this.show) {
        if (curObj) {
          if (curObj.element_type.toLowerCase() !== 'string') {
            callback(new Error('来源表ID_VALUE字段类型有误！请选择String类型的来源字段'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请选择id_value'))
        }
      } else {
        callback()
      }
    }
    return {
      width: '780px',
      style: {
        width: '190px'
      },
      activeStep: 0,
      filter: {
        source_table_id: '',
        id_type: '',
        id_value: '',
        partition_col: ''
      },
      tables: [],
      list: [],
      rules: {
        source_table_id: {required: true, message: '请选择来源物理表'},
        // id_type: {validator: idTypeValidator, trigger: ['blur']},
        id_type: {required: true, trigger: ['blur']},
        // id_value: {validator: idValueValidator, trigger: ['blur']},
        id_value: {required: true, trigger: ['blur']},
        partition_col: {required: true, message: '请选择ds'}
      },
      show: false,
      source_table_code: '',
      display_table_code: '',
      relation_logic: '',
      field_key: '',
      fieldList: [],
      allChecked: false,
      curField: [],
      activeName: 'add',
      addTableData: [],
      categoryList: [],
      flag: false,
      treeData: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      currentNodeKey: '',
      historyTableData: [],
      historyLength: 0,
      idTypeList: [],
      disabledBtn: false
    }
  },
  watch: {
    curField: {
      handler(val) {
        if (val.length === this.list.length) {
          this.allChecked = true
        } else {
          this.allChecked = false
        }
      }
    },
    show: {
      handler(val) {
        if (val) {
          this.$refs.form.clearValidate()
        }
      }
    }
  },
  computed: {
    // idTypeList() {
    //   return this.list.filter(item => item.label_code !== this.filter.id_value && item.label_code !== this.filter.partition_col)
    // },
    idValueList() {
      return this.list.filter(item => item.label_code !== this.filter.id_type && item.label_code !== this.filter.partition_col)
    },
    dsList() {
      return this.list.filter(item => item.label_code !== this.filter.id_type && item.label_code !== this.filter.id_value)
    },
    filterField() {
      return this.fieldList.filter(item => item.label_code.indexOf(this.field_key) > -1)
    }
  },
  created() {
    this._queryListSrcTab()
    this._getIdType()
  },
  methods: {
    selectSourceTableChange(val) {
      const o = this.tables.find(item => item.source_table_id === val)
      if (o.exist_tag === 1) {
        this.filter.id_type = o.id_type
        this.filter.id_value = o.id_value
        this.filter.partition_col = o.partition_col
        this.show = true
      } else {
        this.show = false
        this.filter.id_type = o.id_type
        this.filter.id_value = o.id_value
        this.filter.partition_col = o.partition_col
      }
      this._getTabCol()
    },
    beforeClose() {

    },
    upStep() {
      this.activeStep = 0
      this.width = '780px'
      this.style.width = '190px'
    },
    nextStep() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.activeStep = 1
          this.width = '1050px'
          this.style.width = '460px'
          const o = this.tables.find(item => item.source_table_id === this.filter.source_table_id)
          this.source_table_code = o.source_table_code
          this.display_table_code = o.display_table_code
          this.relation_logic = `ID_type=${this.filter.id_type};id_value=${this.filter.id_value};ds=${this.filter.partition_col}`
          this.fieldList = this.list.filter(item => {
            return item.label_code !== this.filter.id_type &&
            item.label_code !== this.filter.id_value &&
            item.label_code !== this.filter.partition_col &&
            item.exists_tag === '0'
          })
          this._queryCategory()
          this.getTreeData()
          this._getHistroyList()
        }
      })
    },
    async confirm() {
      if (!this.addTableData.length) return this.$message({type: 'error', message: '请添加字段'})
      const f = this.addTableData.some(item => item.new_label_name === '')
      if (f) return this.$message({type: 'error', message: '必填项不能为空'})
      if (!this.flag) return this.$message({type: 'error', message: '存在重复标签名称，请检查重新输入'})
      this.disabledBtn = true
      const manualParam = this.addTableData.map(item => {
        // const category = this.categoryList.find(val => val.id === item.category_id) || {}
        return {
          category_id: item.category_id,
          element_id: item.element_id,
          auth_status: item.auth_status,
          element_type: item.element_type,
          label_name: item.new_label_name,
          label_code: item.new_label_code,
          label_category: item.category_name || ''
        }
      })
      const params = {
        subjectParam: JSON.stringify({
          project_id: this.filter.project_id,
          sum_id: this.filter.sum_id,
          source_table_id: this.filter.source_table_id,
          id_type: this.filter.id_type,
          sum_code: this.filter.sum_code,
          id_value: this.filter.id_value,
          display_table_code: this.display_table_code,
          ds: this.filter.partition_col
        }),
        manualParam: JSON.stringify(manualParam)
      }
      const res = await this.$simpleAsyncTo(addManual(params), '提交失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '新增成功'
        })
        this.$root.eventEmitter.emit('queryManualList')
        this.close()
      }
      this.disabledBtn = false
    },
    async _queryListSrcTab() {
      const res = await this.$simpleAsyncTo(queryListSrcTab(), '获取数据失败')
      if (res) {
        this.tables = res.data
      }
    },
    async _getTabCol() {
      const res = await this.$simpleAsyncTo(getTabCol({
        project_id: this.project.project_id, source_table_id: this.filter.source_table_id
      }))
      if (res) {
        this.list = res.data[0]
      }
    },
    changeIdType(val) {

    },
    handleSelectionChange(val) {
      this.curField = val
    },
    allSelect(val) {
      this.$refs.multipleTable.clearSelection()
      if (val) {
        this.list.forEach(item => {
          this.$refs.multipleTable.toggleRowSelection(item)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    add() {
      this.curField.forEach(item => {
        this.addTableData.push(item)
      })
      this.addTableData = this.addTableData.map(item => {
        return {
          ...item,
          new_label_code: item.label_code,
          new_label_name: '',
          category_id: '',
          auth_status: ''
        }
      })
      this.fieldList = this.deal(this.fieldList, this.curField, 'element_id')
    },
    deal(arr1, arr2, key) {
      const arr3 = []
      for (let index = 0; index < arr1.length; index++) {
        const item = arr1[index]
        if (!arr2.some(v => v[key] === item[key])) {
          arr3.push(item)
        }
      }
      return arr3
    },
    handleClick() {},
    del(row) {
      this.fieldList.push(row)
      this.addTableData.splice(row, 1)
    },
    async _queryCategory() {
      const res = await this.$simpleAsyncTo(queryCategory({project_code: this.project.project_code}))
      if (res) {
        this.categoryList = res.data
      }
    },
    async input(val) {
      const res = await this.$simpleAsyncTo(isLabelExists({
        project_id: this.project.project_id,
        label_code: val
      }), '校验失败')
      if (res) {
        if (!res.data) {
          this.flag = false
          this.$message({
            type: 'error',
            message: `${val} 名称重复，重新输入`
          })
        } else {
          this.flag = true
        }
      }
    },
    async getTreeData() {
      const params = {
        project_code: this.project.project_code
      }
      const res = await this.$simpleAsyncTo(getTabCategoryList(params), '获取失败')
      if (res) {
        this.treeData = []
        this.recursionTreeData(res.data.child, this.treeData)
        console.log(this.treeData)
      }
    },
    recursionTreeData(nodes, arr = []) {
      for (let item of nodes) {
        if (item.name === '工厂标签' || item.name === '手工标签') continue
        let obj = {...item, child: []}
        arr.push(obj)
        if (item.child && item.child.length) this.recursionTreeData(item.child, obj.child)
      }
      return arr
    },
    handleNodeClick(data, node, row) {
      row.category_id = data.id
      row.category_name = data.name
      this.$refs.treeSelect.blur()
    },
    async _getHistroyList() {
      const params = {
        source_table_id: this.filter.source_table_id,
        project_id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(getHistroyList(params), '获取历史列表失败')
      if (res) {
        this.historyTableData = res.data
        this.historyLength = this.historyTableData.length
      }
    },
    async _getIdType() {
      const res = await this.$simpleAsyncTo(getIdType(), '获取数据失败')
      if (res) {
        this.idTypeList = res.data
      }
    }
  }
}
</script>

<style lang="scss">
.create-munual {
  .step-wrapper {
    height: 43px;
    margin: -20px -20px 0;
    border-bottom: 1px solid #ccc;
    background: #fff;
    .steps-progress-bar{
      position: relative;
      top: 18px;
      left: 297px;
      width: 520px;
      height: 0;
      border-bottom: 1px dashed rgba(0,0,0,.3);
    }
    .steps {
      padding: 0 210px;
      margin: 0;
      color: #333;
      line-height: 1.5;
      list-style: none;
      display: flex;
      width: 100%;
      >div:first-child {
        flex: 1;
      }
      &-item {
        height: 35px;
        display: flex;
        align-items: center;
        &-container {
          display: flex;
          .steps-icon {
            > i {
              font-size: 18px;
              color: $grey5;
              vertical-align: middle;
              &.active {
                color: RGB(77,136,232);
              }
              &.success {
                color: $success;
              }
            }
          }
        }
      }
    }
  }
  .step2-header {
    &.el-row {
      border-bottom: 1px solid $grey7;
      > .el-col {
        > span {
          display: inline-block;
          width: 85px;
          text-align: end;
          color: $grey4;
        }
      }
    }
  }
  .field-info {
    display: flex;
    .origin-field-list {
      width: 30%;
      .field-table {
        .el-table__header {
          .cell {
            .el-checkbox {
              display: none;
            }
          }
        }
      }
      .all-select {
        height: 35px;
        background: $grey10;
        line-height: 35px;
      }
    }
    .add-field-btn {
      display: flex;
      align-items: center;
    }
    .target-field-list {
      width: 63%;
    }
  }
}
</style>
