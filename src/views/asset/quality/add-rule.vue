<template>
  <SimpleEditDialog
    title="创建质量规则"
    :visible="isVisible"
    @close="myClose"
    @confirm="myConfirm"
    width="530px"
    top="25vh"
    class="add-rule-dialog"
    confirmText="开始配置"
    :disabled="disabled"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-row class="mb-10">
        <el-col>请选择数据表进入配置</el-col>
      </el-row>
      <el-card class="mb-10" v-if="isFilterTableData">
        <div class="head-f">
          <span>数据筛选</span>
          <el-button type="text" @click="clearHandle">清空筛选</el-button>
        </div>
        <el-row>
          <el-col :span="4">
            所属项目
          </el-col>
          <el-col :span="20">
              <el-select v-model="ruleForm.project" placeholder="请选择所属项目" clearable>
                <el-option :label="item.label" :value="item.label" v-for="item in projectList" :key="item.id"></el-option>
              </el-select>
          </el-col>
        </el-row>
      </el-card>
      <el-form-item label="数据表" prop="dataTable">
        <el-select v-model="ruleForm.dataTable" placeholder="请选择数据表" clearable>
          <el-option :label="item.label" :value="item.id" v-for="item in tableDataList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import {
  getBusinessList,
  getProjectList,
  getTableDataList
} from '@/api/asset/quality'
export default {
  name: 'AddRuleDialog',
  props: {
    visible: Boolean,
    isFilterTableData: {
      type: Boolean,
      default: true
    },
    tableType: String
  },
  data() {
    return {
      isVisible: false,
      ruleForm: {},
      rules: {
        dataTable: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      businessList: [],
      projectList: [],
      disabled: true,
      tableDataList: []
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.isVisible = val
      }
    },
    'ruleForm.dataTable': {
      handler(val) {
        if (val === '') {
          this.disabled = true
        } else {
          this.disabled = false
        }
      }
    }
  },
  created() {
    this._getBusinessList()
    this._getProjectList()
    this._getTableDataList()
  },
  methods: {
    // 业务板块
    async _getBusinessList() {
      const params = {}
      const res = await this.$simpleAsyncTo(getBusinessList(params), '获取失败')
      if (res) {
        this.businessList = res.data
      }
    },
    // 所属项目
    async _getProjectList() {
      const params = {}
      const res = await this.$simpleAsyncTo(getProjectList(params), '获取失败')
      if (res) {
        this.projectList = res.data
      }
    },
    // 所属项目
    async _getTableDataList() {
      const params = {}
      const res = await this.$simpleAsyncTo(getTableDataList(params), '获取失败')
      if (res) {
        this.tableDataList = res.data
      }
    },
    clearHandle() {
      this.ruleForm.business = ''
      this.ruleForm.project = ''
      this.ruleForm.tableType = ''
      this.ruleForm.dataTable = ''
    },
    myConfirm() {},
    myClose() {
      this.$emit('update:visible', false)
      this.$emit('close', false)
    }
  }
}
</script>

<style lang="scss">
.add-rule-dialog {
  .el-dialog__body {
    .sed-body {
      padding-right: 0;
    }
  }
  .el-card {
    border-radius: 0;
    border: none;
    box-shadow: none;
    .el-card__body {
      // padding-right: 0;
      .el-row {
        height: 36px;
        line-height: 36px;
        .el-col {
          color: $grey3;
        }
        .el-radio {
          margin: 0;
          .el-radio__label {
            padding: 0 8px;
          }
        }
      }
    }
    .head-f {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 36px;
    }
  }
}
</style>
