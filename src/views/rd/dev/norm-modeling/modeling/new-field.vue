<template>
  <SimpleEditDialog
    :title="title"
    :visible.sync="isVisible"
    :parentClass="parentClass"
    @close="close"
    @confirm="confirm"
    width="1100px"
    top="8vh"
    class="new-field"
    ref="dialog"
  >
    <div class="new-field-top">
      <span class="mr-15 font-12">来源表</span>
      <el-radio-group v-model="sourceTable">
        <el-radio :label="0">引入字段</el-radio>
        <el-radio :label="1">SQL自定义字段</el-radio>
      </el-radio-group>
    </div>
    <div class="edit-body" v-if="sourceTable === 0" :style="{height: `${height}px`}">
      <div class="edit-body-left">
        <div class="edit-item">
          <span class="label">来源表</span>
          <el-select v-model="table">
            <el-options
              v-for="item in tables"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-options>
          </el-select>
        </div>
        <div class="edit-item">
          <span class="label">关联逻辑字段</span>
          <el-select v-model="field">
            <el-option
              v-for="item in fields"
              :key="item.element_id"
              :label="item.element_code"
              :value="item.element_id + ''"
            ></el-option>
          </el-select>

          <el-tooltip content="即本表与当前主表关联时引用的字段" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </div>
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
            @input="filterFields"
          ></el-input>
        </div>
        <ul class="field-list">
          <li v-for="(item, index) in getFields(fields)" :key="item.element_id + index">
            <!-- <li v-for="(item, index) in visibleFields" :key="item.element_id + index"> -->
            <span class="name" v-html="$highlightKeyword(item.element_code, keyword)"></span>
            <span class="desc">{{item.comment || '未填写'}}</span>
            <span class="el-icon-circle-plus" @click="add(item)"></span>
          </li>
        </ul>
      </div>
      <div class="edit-body-right">
        <el-form :model="tableFilter" ref="tableForm">
          <el-table :data="tableFilter.columns">
            <el-table-column label="字段英文名" prop="element_code">
              <template #default="scope">
                <el-form-item
                  :prop="`columns.${scope.$index}.element_code`"
                  :rules="[
                    {required: true, message: '请输入英文名'},
                    {
                      pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
                      message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
                    },
                    {validator: validateRepeat, trigger: 'blur'}
                  ]"
                >
                  <el-input v-model="scope.row.element_code" maxlength="32" show-word-limit></el-input>
                  <span class="initial-value">原始英文名：{{initialData[scope.$index].element_code}}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="字段名称" prop="element_name">
              <template #default="scope">
                <el-form-item
                  :prop="`columns.${scope.$index}.element_name`"
                  :rules="{required: true, message: '请输入中文名'}"
                >
                  <el-input v-model="scope.row.element_name" maxlength="32" show-word-limit></el-input>
                  <span class="initial-value">原始名称：{{initialData[scope.$index].element_name}}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" v-if="type === 'dim'" label="联合属性" prop="union_key_tag" width="100px">
              <template #default="scope">
                <!-- {{unionMap[scope.row.union_key_tag] || '否'}} -->
                <el-form-item :prop="`columns.${scope.$index}.union_key_tag`">
                  <el-tooltip :content="unionMap[scope.row.union_key_tag] || '否'" placement="top">
                    <el-switch
                      v-model="scope.row.union_key_tag"
                      active-value="1"
                      inactive-value="0">
                    </el-switch>
                  </el-tooltip>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="数据类型" prop="element_type" width="100px"></el-table-column>
            <el-table-column label="操作" width="100px">
              <template #default="scope">
                <div>
                  <el-popover
                    placement="left"
                    width="400"
                    trigger="click"
                    popper-class="dark-popper"
                  >
                    <MonacoEditor
                      ref="monacoEditor"
                      style="height: 300px;"
                      :code.sync="scope.row.code"
                    />
                    <el-button
                      slot="reference"
                      type="text"
                      icon="font-16 iconfont icon-yewuliu"
                    ></el-button>
                      <!-- @click="editField(scope.$index, scope.row)" -->
                  </el-popover>
                  <el-button
                    type="text"
                    class="mr-10 ml-10"
                    icon="font-16 el-icon-edit-outline"
                    @click="showEditFieldDialog(scope.$index, scope.row)"
                  ></el-button>
                  <SimpleConfirm @confirm="deleteHandle(scope.$index, scope.row)" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
    <div class="custom-sql" v-if="sourceTable === 1">
      <MonacoEditor
        :style="{height: `${height}px`}"
        :code.sync="code"
        has-top-tools
        has-bottom-tools
      ></MonacoEditor>
    </div>
    <SimpleEditDialog
      title="编辑字段"
      :visible.sync="visibleEditFieldDialog"
      @confirm="saveField"
      width="1000px"
      :class="`${parentClass}-saveField`"
      :parentClass="`${parentClass}-saveField`"
    >
      <FieldForm :type="type" :data="editFieldData" ref="fieldForm"></FieldForm>
    </SimpleEditDialog>
  </SimpleEditDialog>
</template>

<script>
import FieldForm from './field-form'
import {on, off} from '@/libs/dom'
export default {
  name: 'NewField',
  props: {
    title: String,
    visible: Boolean,
    data: Object,
    tableData: Array,
    type: String,
    parentClass: String
  },
  components: {
    FieldForm
  },
  data() {
    return {
      sourceTable: 0,
      table: '',
      field: '',
      filter: {
        table: '',
        field: ''
      },
      tables: [],
      fields: [],
      isVisible: false,
      keyword: '',
      code: '',
      height: 400,
      visibleEditFieldDialog: false,
      editFieldData: {},
      initialData: [],
      tableFilter: {
        columns: []
      },
      unionMap: {
        0: '否',
        1: '是'
      }
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.isVisible = val
        if (val) {
          this.initData()
        }
      }
    }
  },
  computed: {
    visibleFields(val) {
      return this.fields.filter(item => item.visible)
    }
  },
  created() {
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
    setHeight() {
      this.height = this.$refs.dialog.dialogBodyHeight - 41
    },
    validateRepeat(rule, value, callback) {
      if (
        this.tableData.find(item => item.element_code === value) ||
        this.tableFilter.columns.filter(item => item.element_code === value)
          .length > 1
      ) {
        return callback(new Error('字段英文名重复'))
      }
      callback()
    },
    initData() {
      const {info = {}, elementDatas = []} = this.data,
        tableData = this.tableData.filter(
          item =>
            !item.head &&
            ['attr', 'relation', 'measure'].includes(item.group_type)
        )
      this.table = info.cube_code
      this.fields = []
      elementDatas.forEach(item => {
        if (tableData.every(d => d.element_id + '' !== item.element_id + '')) {
          item.element_id += ''
          item.visible = true
          item.element_type = item.element_type.toUpperCase()
          this.fields.push(item)
        }
      })
      this.field = info.element_id
    },
    getFields(data) {
      const {logicKeyDatas = {}} = this.data
      if (JSON.stringify(logicKeyDatas) === '{}') {
        return this.fields.filter(item => item.visible)
      } else {
        return this.fields.filter(item => item.visible && logicKeyDatas.element_id + '' !== item.element_id + '')
      }
    },
    filterFields(val) {
      const reg = new RegExp(val, 'i')
      this.fields.forEach(item => {
        item.visible = reg.test(item.element_code)
      })
    },
    add(data) {
      const item = this.tableFilter.columns.find(
        d => d.element_id === data.element_id
      )
      if (item) {
        this.$message({
          type: 'warning',
          message: '该字段已添加'
        })
      } else {
        const key = (
          this.fields.find(item => item.element_id === this.field) || {}
        ).element_code
        data.code = `select ${key} as k, ${data.element_code} from ${this.table}`
        this.tableFilter.columns.push({...data})
        this.initialData.push({...data})
      }
    },
    close() {
      this.sourceTable = 0
      this.tableFilter.columns = []
      this.$emit('update:visible', false)
    },
    // editField(index, row) {
    //   this.editFieldData = row
    //   this.editFieldIndex = index
    // },
    showEditFieldDialog(index, row) {
      this.editFieldData = row
      this.editFieldIndex = index
      this.visibleEditFieldDialog = true
    },
    deleteHandle(index, row) {
      this.tableFilter.columns.splice(index, 1)
      this.initialData.splice(index, 1)
    },
    saveField() {
      const data = this.$refs.fieldForm.getData()
      if (data) {
        this.tableFilter.columns.splice(this.editFieldIndex, 1, data)
        this.visibleEditFieldDialog = false
      }
    },
    confirm() {
      if (this.$refs.tableForm) {
        this.$refs.tableForm.validate(valid => {
          if (valid) {
            this.$emit('confirm', {
              columns: this.tableFilter.columns,
              table: this.table
            })
            this.$emit('update:visible', false)
            this.tableFilter.columns = []
          }
        })
      } else {
        this.$emit('update:visible', false)
      }
    }
  }
}
</script>

<style lang="scss">
.new-field {
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
      width: 420px;
      font-size: 12px;
      border-right: 1px solid $grey6;
      padding-right: 10px;
      .edit-item {
        display: flex;
        margin-bottom: 10px;
        line-height: 30px;
        position: relative;
        .el-icon-info {
          position: absolute;
          right: 5px;
          top: 8px;
          font-size: 16px;
        }
      }
      .grey-value {
        color: $grey4;
      }
      .label {
        display: inline-block;
        width: 90px;
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
}
</style>
