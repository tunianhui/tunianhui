<template>
  <el-dialog
    title="新建自定义指标"
    class="create-custom-index"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
    append-to-body
    width="1100px"
    @close="close"
    v-draggable="{
      trigger: '.create-custom-index .el-dialog__header',
      body: '.create-custom-index .el-dialog',
      recover: false
    }"
  >
    <el-steps
      :space="250"
      :active="activeStep"
      process-status="finish"
      finish-status="success"
      align-center
    >
      <el-step title="主键信息"></el-step>
      <el-step title="汇总逻辑表描述信息"></el-step>
    </el-steps>
    <el-form ref="form" :model="filter" label-position="right" label-width="120px" label-suffix="：">
      <div class="form-step1" v-if="activeStep === 0">
        <el-form-item
          label="来源物理表"
          prop="source_table"
          :rules="{required: true, message: '请选择来源物理表'}"
        >
          <el-select v-model="filter.source_table" placeholder="请选择来源物理表">
            <el-option
              v-for="item in sourceList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字段" prop="key_user"></el-form-item>
      </div>
      <div v-else class="form-step2">
        <div class="tip-content">
          <p>来源物理表{{filter.source_table}}</p>
          <p>关联逻辑表{{filter.dim_code}} = {{filter.pk_code}}</p>
        </div>
        <div class="form-step2-body" :style="{height: `${step2bodyHeight}px`}">
          <div class="fsb-left">
            <el-input
              placeholder="请输入关键字搜索"
              v-model="keyword"
              suffix-icon="el-icon-search"
              @input="filterByKeyword"
            ></el-input>
            <el-table
              :data="visibleFieldList"
              :height="tableHeight"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="45"></el-table-column>
              <el-table-column label="字段英文名" prop="code">
                <template #default="scope">
                  <span v-html="$highlightKeyword(scope.row.element_code, keyword)"></span>
                </template>
              </el-table-column>
              <el-table-column label="字段描述" prop="desc"></el-table-column>
            </el-table>
          </div>
          <div class="fsb-center">
            <el-button
              icon="el-icon-plus"
              type="primary"
              plain
              :disabled="!selectedData.length"
              @click="addFields"
            >添加</el-button>
          </div>
          <div class="fsb-right">
            <el-tabs v-model="activeTab">
              <el-tab-pane name="new">
                <span slot="label">&nbsp;&nbsp;{{`新建列表(${filter.newTable.length})`}}&nbsp;&nbsp;</span>
                <el-table :data="filter.newTable" :height="tableHeight">
                  <el-table-column label="字段英文名" prop="element_code">
                    <template #default="scope">
                      <el-form-item
                        :prop="`newTable.${scope.$index}.element_code`"
                        label-width="0px"
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
                        <span class="initial-value">原始英文名：{{scope.row.init_element_code}}</span>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="字段名称" prop="element_name">
                    <template #default="scope">
                      <el-form-item
                        label-width="0px"
                        :prop="`newTable.${scope.$index}.element_name`"
                        :rules="{required: true, message: '请输入中文名'}"
                      >
                        <el-input v-model="scope.row.element_name" maxlength="32" show-word-limit></el-input>
                        <span class="initial-value">原始名称：{{scope.row.init_element_name}}</span>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="数据类型" prop="element_type" width="80"></el-table-column>
                  <el-table-column label="操作" width="55">
                    <template #default="scope">
                      <SimpleConfirm @confirm="handleDelete(scope.$index, scope.row, 'newTable')"></SimpleConfirm>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane :label="`历史已添加列表(${filter.historyTable.length})`" name="history">
                <el-table :data="filter.historyTable" :height="tableHeight">
                  <el-table-column label="字段英文名" prop="element_code"></el-table-column>
                  <el-table-column label="字段名称" prop="element_name"></el-table-column>
                  <el-table-column label="数据类型" prop="element_type"></el-table-column>
                  <el-table-column label="操作" width="55">
                    <template #default="scope">
                      <SimpleConfirm
                        @confirm="handleDelete(scope.$index, scope.row, 'historyTable')"
                      ></SimpleConfirm>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="nextStep" v-if="activeStep === 0">下一步</el-button>
      <el-button type="primary" @click="activeStep = 0" v-if="activeStep === 1">上一步</el-button>
      <el-button type="primary" @click="confirm" v-if="activeStep === 1">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import editDialog from '@/mixins/edit-dialog'
import dialogHeight from '@/mixins/dialog-height'

export default {
  name: 'CunstomIndexCreate',
  mixins: [dialogHeight],
  props: {
    visible: Boolean
  },
  data() {
    return {
      isVisible: this.visible,
      activeStep: 0,
      activeTab: 'new',
      filter: this.initFilter(),
      keyword: '',
      sourceList: [{label: 'test', value: 'test'}],
      fieldList: [],
      selectedData: []
    }
  },
  computed: {
    step2bodyHeight() {
      return Math.max(this.dialogBodyHeight - 140, 200)
    },
    tableHeight() {
      return this.step2bodyHeight - 28
    },
    visibleFieldList() {
      return this.fieldList.filter(field => field.visible)
    }
  },
  watch: {
    visible(val) {
      this.isVisible = val
    }
  },
  created() {
    this.fieldList = Array.from({length: 8}, (d, i) => ({
      element_code: `test${i}`,
      element_name: `测试${i}`,
      element_type: 'init',
      desc: 'aa',
      visible: true
    }))
  },
  methods: {
    initFilter() {
      return {
        source_table: '',
        key_user: '',
        newTable: [],
        historyTable: []
      }
    },
    close() {
      this.activeStep = 0
      this.$refs.form.resetFields()
      this.filter = this.initFilter()
      this.$emit('update:visible', false)
    },
    validateRepeat(rule, value, callback) {
      if (
        this.filter.newTable.filter(item => item.element_code === value)
          .length > 1
      ) {
        return callback(new Error('字段英文名重复'))
      }
      callback()
    },
    nextStep() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.activeStep = 1
        }
      })
    },
    filterByKeyword(val) {
      const reg = new RegExp(val, 'i')
      this.fieldList.forEach(item => {
        item.visible = reg.test(item.element_code)
      })
    },
    handleSelectionChange(val) {
      this.selectedData = val
    },
    addFields() {
      this.selectedData.forEach(item => {
        this.filter.newTable.push({
          ...item,
          init_element_code: item.element_code,
          init_element_name: item.element_name
        })
        this.fieldList = this.fieldList.filter(
          field => field.element_code !== item.element_code
        )
      })
    },
    handleDelete(index, row, key) {
      this.filter[key].splice(index, 1)
      this.fieldList.push({...row})
    },
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.close()
        }
      })
    }
  }
}
</script>

<style lang="scss">
.create-custom-index {
  .el-dialog {
    width: 750px;
  }
  .el-steps {
    width: 500px;
    margin: 0 auto 20px auto;
  }
  .form-step1 {
    min-height: 200px;
  }
  .form-step2 {
    .tip-content {
      color: $grey4;
      margin-bottom: 15px;
    }

    $headHeight: 28px;
    .form-step2-body {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .el-table::before {
        height: 0px;
      }
      .fsb-left {
        width: 30%;
        border: 1px solid $grey7;
        .el-input__inner {
          border-width: 0;
          border-bottom-width: 1px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
      .fsb-center {
        margin: 15px;
      }
      .fsb-right {
        width: calc(70% - 103px);
        border: 1px solid $grey7;

        .el-tabs {
          .el-tabs__header {
            margin-bottom: 0;
          }
          .el-tabs__item {
            height: $headHeight;
            line-height: $headHeight;
          }
        }
        .el-table {
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
        }
      }
    }
  }
}
</style>
