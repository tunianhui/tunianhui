<template>
  <SimpleEditDialog
    title="创建质量规则"
    :visible="isVisible"
    @close="close"
    @confirm="confirm"
    width="530px"
    top="25vh"
    class="add-rule-dialog"
    confirmText="开始配置"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-row class="mb-10">
        <el-col>请选择数据表进入配置</el-col>
      </el-row>
      <el-card class="mb-10">
        <div class="head-f">
          <span>数据筛选</span>
          <el-button type="text" @click="clearHandle">清空筛选</el-button>
        </div>
      </el-card>
      <el-form-item label="所属项目" prop="project_id">
        <el-select v-model="ruleForm.project_id" placeholder="请选择所属项目" clearable @change="proChange" style="width:calc(100% - 10px)">
          <el-option :label="item.project_code" :value="item.project_id" v-for="item in projectList" :key="item.project_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据表" prop="cube_id">
        <el-select v-model="ruleForm.cube_id" placeholder="请选择数据表" clearable filterable style="width:calc(100% - 10px)">
          <el-option :label="item.table_code" :value="item.cube_id" v-for="item in tableDataList" :key="item.cube_id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import {
  queryProject,
  queryTableByProject,
  insertAuditTableBase
} from '@/api/asset/quality/tableRules'
export default {
  name: 'AddRuleDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      isVisible: false,
      ruleForm: {
        project_id: '',
        cube_id: ''
      },
      rules: {
        project_id: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        cube_id: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      projectList: [],
      tableDataList: []
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.isVisible = val
      }
    }
  },
  created() {
    this._queryProject()
  },
  methods: {
    // 所属项目
    async _queryProject() {
      const params = {}
      const res = await this.$simpleAsyncTo(queryProject(params), '获取失败')
      if (res) {
        this.projectList = res.data
      }
    },
    proChange(val) {
      if (val) {
        this._queryTableByProject({project_id: val})
      } else {
        this.tableDataList = []
      }
    },
    // 数据表
    async _queryTableByProject(params) {
      const res = await this.$simpleAsyncTo(queryTableByProject(params), '获取失败')
      if (res) {
        this.tableDataList = res.data
      }
    },
    clearHandle() {
      this.ruleForm.project_id = ''
      this.ruleForm.cube_id = ''
    },
    confirm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this._insertAuditTableBase()
        }
      })
    },
    async _insertAuditTableBase() {
      const params = {
        ...this.ruleForm,
        table_code: this.tableDataList.find(item => item.cube_id === this.ruleForm.cube_id).table_code,
        project_code: this.projectList.find(item => item.project_id === this.ruleForm.project_id).project_code
      }
      const res = await this.$simpleAsyncTo(insertAuditTableBase(params), '获取失败')
      if (res) {
        this.$emit('refresh', {
          id: res.data.id,
          table_code: res.data.table_code,
          project_code: res.data.project_code,
          oper_user: res.data.oper_user,
          job_id: res.data.job_id,
          source_config: 'startConfig'
        })
        this.$message({
          type: 'success',
          message: '添加成功'
        })
      }
    },
    close() {
      this.$emit('close')
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
