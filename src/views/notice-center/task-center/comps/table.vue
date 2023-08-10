<template>
  <div class="table">
    <div class="header">
      <span>{{data.projectCode}}</span>
      <i class="el-icon-close"></i>
    </div>
    <div class="wrapper">
      <h5>基础信息</h5>
      <div class="card-body">
        <div class="task-detail-list-item" style="width:33%">
          <span style="width:90px">所属项目</span>
          <span>{{data.projectCode}}</span>
        </div>
        
        <div class="task-detail-list-item" style="width:33%">
          <span>环境</span>
          <span>{{data.environment === 'dev' ? '开发' : '生产'}}</span>
        </div>
        <div class="task-detail-list-item" style="width:33%">
          <span>创建时间</span>
          <span>2023-07-19 14:24:02</span>
        </div>
      </div>
      <el-divider></el-divider>
      <h5>账号详情</h5>
      <div class="task-detail-body">
        <div class="left">
          <div class="task-detail-list-item" style="width:100%">
            <span style="width:90px">个人账号</span>
            <span>{{getUserType(data.grantToUsers, 0)}}</span>
          </div>
          <div class="task-detail-list-item" style="width:100%">
            <span style="width:90px">有效期</span>
            <span>{{this.getEndTime(data.grantToUsers, 0)}}</span>
          </div>
          <div class="task-detail-list-item" style="width:100%">
            <span style="width:90px">生产账号</span>
            <span>{{getProUser(data.grantToUsers, 1)}}</span>
          </div>
          <div class="task-detail-list-item" style="width:100%">
            <span style="width:90px">有效期至</span>
            <span>{{getProUser(data.grantToUsers, 1) ? '长期' : ''}}</span>
          </div>
        </div>
        <div class="right">
          <div class="task-detail-list-item" style="width:100%">
            <span style="width:90px">所属项目</span>
            <span>{{data.projectCode}}</span>
          </div>
          <div class="task-detail-list-item" style="width:100%">
            <span style="width:90px">申请原因</span>
            <span>{{data.reason}}</span>
          </div>
        </div>
      </div>
      <h5>字段列表</h5>
      <SelectField v-model="selectFieldData"></SelectField>
      <h5>审批信息</h5>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="审批结果" prop="approvalResults">
          <el-radio-group v-model="ruleForm.approvalResults">
            <el-radio label="1">通过</el-radio>
            <el-radio label="0">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批说明" prop="opeions">
          <el-input type="textarea" v-model="ruleForm.opeions" :rows="5"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" @click="confirm">提交</el-button>
      <el-button type="primary">取消</el-button>
    </div>
  </div>
</template>

<script>
import SelectField from './select-foeld.vue'
import {
  getTableTypeList,
  getAccountList
} from '@/api/asset/authority'
import {
  getPassTask,
  getRejectTask
} from '@/api/notice/task-center/index.js'
export default {
  name: 'AuthTable',
  components: {
    SelectField
  },
  props: {
    data: Object,
    proc_inst_id: String
  },
  watch: {
    data: {
      handler(val) {
        this.selectFieldData = {}
        if (val.permissionDTOS && val.permissionDTOS.length) {
          val.permissionDTOS.forEach(item => {
            this.$set(this.selectFieldData, item.resource.cubeId, {
              list: item.resource.children,
              cube_code: item.resource.cubeCode,
              cube_id: item.resource.cubeId,
              operates: item.operates
            })
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    filterTableType() {
      return val => {
        const item = this.tableTypeList.find(item => item.value === val)
        return item ? item.name : ''
      }
    }
  },
  data() {
    return {
      selectFieldData: {},
      tableTypeList: [],
      accountList: [],
      ruleForm: {
        approvalResults: '1',
        opeions: ''
      },
      rules: {
        approvalResults: [{
          required: true,
          message: '请选择审批结果',
          trigger: 'change'
        }],
      }
    }
  },
  created() {
    this.getTableType()
    this._getAccountList()
  },
  methods: {
    // 表类型
    async getTableType() {
      const res = await this.$simpleAsyncTo(getTableTypeList(), '获取表类型失败')
      if (res) {
        this.tableTypeList = res.data
      }
    },
    getUserType(data, index) {
      // const typess = []
      if (!data) return ''
      // data.map(item => {
      //   typess.push(item.accountType == 'PERSONAL' ? '个人账号' : '生产账号')
      // })
      return data[index] ? data[index].code : ''
    },
    getEndTime(data, index) {
      const typess = []
      if (!data) return ''
      data.map(item => {
        typess.push(item.periodEnd)
      })
      return typess[index] ? typess[index] : ''
    },
    async _getAccountList() {
      const params = {}
      const res = await this.$simpleAsyncTo(
        getAccountList(params),
        '获取账号列表失败'
      )
      if (res) {
        this.accountList = res.data
      }
    },
    getProUser(data, index) {
      if (!data) return ''
      // if (data[index]) {
      //   const account = this.accountList.find(
      //     item => item.project_id === data[index].projectId
      //   )
      //   return account ? account.project_name : ''
      // } else {
      //   return ''
      // }
      return data[index] ? data[index].code : ''
    },
    async confirm() {
      const params = {
        proc_inst_id: this.proc_inst_id,
        opinion: this.ruleForm.opeions
      }
      let fn = null
      if (this.ruleForm.approvalResults == '0') {
        fn = getRejectTask
      } else {
        fn = getPassTask
      }
      const res = await this.$simpleAsyncTo(fn(params), '提交失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.$emit('close')
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
  .header {
    display: flex;
    justify-content: space-between;
    height: 50px;
    font-size: 14px;
    padding: 0 20px;
    align-items: center;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
    color: #4a4a4a;
    > i {
      cursor: pointer;
      font-size: 13px;
    }
  }
  .wrapper {
    overflow: auto;
    height: calc(100% - 100px);
    padding: 10px 20px;
    h5 {
      font-size: 14px;
      font-weight: 500;
      color: rgba($color: #000000, $alpha: 0.7);
      margin-bottom: 10px;
    }
    .card-body {
      margin: 0;
      padding: 10px 0;
      display: flex;
    }
    .task-detail-list-item {
      display: inline-flex;
      align-items: center;
      line-height: 36px;
      margin-right: 20px;
      font-size: 12px;
      color: rgba($color: #000000, $alpha: 0.9);
      > span:first-child {
        margin-right: 5px;
        width: 65px;
        color: #999999;
        margin-right: 10px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

    }
    .task-detail-body {
      display: flex;
      .left {
        width: 50%;
      }
      .right {
        width: 50%;
        border-left: 1px solid rgba($color: #000000, $alpha: 0.1);
      }
    }
  }
  .footer {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid rgba($color: #000000, $alpha: 0.1);
  }
  ::v-deep {
    .el-collapse-item__wrap {
      border-bottom: none;
    }
  }
}
</style>