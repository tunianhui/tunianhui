<template>
  <section class="apply-data-table">
    <el-card>
      <el-form label-width="80px" ref="formFilter" :model="formFilter" :rules="rules2">
        <p class="mb-10">数据源权限信息</p>
        <el-form-item label="数据源" prop="businessSegment">
          <el-select v-model="formFilter.datasource" disabled placeholder="请选择业务板块">
            <el-option v-for="(item, index) in businessSegmentList" :key="index" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限类型" prop="auth_type">
          <el-checkbox-group v-model="formFilter.auth_type" disabled>
            <el-checkbox label="1" name="auth_type">同步读</el-checkbox>
            <el-checkbox label="2" name="auth_type">同步写</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <p class="mb-10">账号类型</p>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-radio v-model="formFilter.accountType" disabled label="0">个人账号</el-radio>
          </el-col>
          <el-col :span="5">
            <el-form-item label="有效期至" prop="expiration">
              <el-select v-model="formFilter.expiration" disabled placeholder="请选择有效期">
                <el-option v-for="(item, index) in timeList" :key="index" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-date-picker v-model="formFilter.date" type="date" disabled placeholder="选择日期"> </el-date-picker>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-radio v-model="formFilter.accountType" disabled label="1">项目生产账号（有效期为长期）</el-radio>
          </el-col>
          <el-col :span="5">
            <el-form-item label="归属项目" prop="project">
              <el-select v-model="formFilter.project" disabled placeholder="请选择项目">
                <el-option v-for="(item, index) in projectList" :key="index" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="申请原因" prop="remark">
          <el-input type="textarea" v-model="formFilter.remark" disabled maxlength="128" show-word-limit placeholder="请输入申请原因"></el-input>
        </el-form-item>
      </el-form>

      <div class="mb-20 mt-20 font-14">审批信息</div>
      <el-card class="notice-center-card mb-20">
        <el-form ref="form" :model="approvalInfo" label-width="100px" label-suffix="：" :rules="approvalInfoRules">
          <el-row class="mb-20">
            <el-col>
              <el-form-item label="审批结果" prop="reject">
                <el-radio-group v-model="approvalInfo.reject">
                  <el-radio :label="false">通过</el-radio>
                  <el-radio :label="true">驳回</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="mb-10">
            <el-col>
              <el-form-item label="审批说明" prop="message">
                <el-input type="textarea" :rows="4" resize="none" :show-word-limit="true" :maxlength="128" placeholder="请输入内容" v-model="approvalInfo.message"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div class="flex-center">
        <el-button type="primary" class="mr-20" @click="confirm">提 交</el-button>
        <el-button type="primary" @click="cancel">返 回</el-button>
      </div>
    </el-card>
  </section>
</template>
<script>
import { getDataSource } from '@/api/plan/project-manage'
import { getPassTask, getRejectTask } from '@/api/notice/task-center/index.js'
export default {
  name: 'auth-ds',
  inject: ['tabStore'],
  props: {
    proc_inst_id: String,
    flow_type: String,
    baseinfo: Object,
  },
  data () {
    const validateEndTime = (rule, value, callback) => {
      if (this.formFilter.accountType === '0') {
        if (value === '') {
          callback(new Error('请选择有效期'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validateProjectName = (rule, value, callback) => {
      if (this.formFilter.accountType === '1') {
        if (value === '') {
          callback(new Error('请选择归属项目'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      formFilter: {
        datasource: '',
        auth_type: [],
        accountType: '',
        expiration: '',
        date: '',
        project: '',
        remark: '',
      },
      timeList: [
        {
          label: '自定义',
          value: '0',
        },
        {
          label: '长期',
          value: '1',
        },
        {
          label: '一天',
          value: '2',
        },
        {
          label: '一周',
          value: '3',
        },
      ],
      rules2: {
        authType: [{ type: 'array', required: false, message: '请至少选择一个权限类型', trigger: 'change' }],
        validEndTime: [{ required: false, validator: validateEndTime, trigger: 'change' }],
        projectName: [{ required: false, validator: validateProjectName, trigger: 'change' }],
        remark: [{ required: false, message: '请输入申请原因', trigger: 'blur' }],
      },
      projectList: [],
      businessSegmentList: [],
      approvalInfo: {
        message: '',
        reject: '',
      },
      approvalInfoRules: {
        reject: [{ required: true, message: '请选择审批结果', trigger: 'blur' }],
      },
    }
  },
  watch: {
    baseinfo: {
      deep: true,
      handler (val) {
        this.getData()
      },
    },
  },
  created () {
    this.getBusinessSegmentList()
    this.getData()
  },
  methods: {
    getData () {
      this.formFilter.datasource = this.baseinfo.datasource
      this.formFilter.auth_type = this.baseinfo.permissionype.map((a) => String(a))
      this.formFilter.accountType = this.baseinfo.personalAccount
      this.formFilter.expiration = this.baseinfo.expiration
      this.formFilter.date = this.baseinfo.date
      this.formFilter.project = this.baseinfo.project
      this.formFilter.remark = this.baseinfo.remark
    },
    async getBusinessSegmentList () {
      const res = await this.$simpleAsyncTo(getDataSource())
      if (res) {
        this.businessSegmentList = res.data.map((item) => {
          return {
            label: item.data_source_name,
            value: item.id,
          }
        })
      }
    },
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitForm()
        }
      })
    },
    cancel () {
      this.$emit('cancel')
    },
    async submitForm () {
      const params = {
        proc_inst_id: this.proc_inst_id,
        opinion: this.approvalInfo.message,
      }
      let fn = null
      if (this.approvalInfo.reject) {
        fn = getRejectTask
      } else {
        fn = getPassTask
      }
      const res = await this.$simpleAsyncTo(fn(params), '提交失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '提交成功',
        })
        this.$emit('cancel')
      }
    },
  },
}
</script>
