<template>
  <section class="apply-logic-table">
    <el-card>
      <el-row class="mb-10">
        <el-col :span="12" :offset="6">
          <el-steps :align-center="true" :active="step" finish-status="success">
            <el-step title="申请权限对象"></el-step>
            <el-step title="权限申请配置"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <el-form label-width="80px" ref="formData1" :model="formData1" :rules="rules1" v-show="step === 0">
        <el-form-item label="环境" prop="environment">
          <el-select v-model="formData1.environment" placeholder="请选择环境">
            <el-option v-for="(item, index) in environmentList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务板块" prop="businessSegment">
          <el-select v-model="formData1.businessSegment" placeholder="请选择业务板块">
            <el-option v-for="(item, index) in businessSegmentList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="逻辑表">
          <el-select v-model="formData1.logicTable" placeholder="请选择逻辑表" style="width: 260px;">
            <el-option v-for="(item, index) in logicTableList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-show="step === 1">
        <el-form label-width="80px" ref="formData2" :model="formData2" :rules="rules2">
          <el-row>
            <el-col :span="8">
              <el-form-item label="环境">
                <el-select v-model="formData2.environment" disabled placeholder="请选择环境" style="width: 260px;">
                  <el-option v-for="(item, index) in environmentList" :key="index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="业务板块">
                <el-select v-model="formData2.businessSegment" disabled placeholder="请选择业务板块" style="width: 260px;">
                  <el-option v-for="(item, index) in businessSegmentList" :key="index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="逻辑表">
                <el-select v-model="formData2.logicTable" disabled placeholder="请选择逻辑表" style="width: 260px;">
                  <el-option v-for="(item, index) in logicTableList" :key="index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <p class="title-name">权限字段</p>
          <el-table ref="multipleTable" :data="formData2.tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="100" label="序号">
            </el-table-column>
            <el-table-column label="字段名">
              <template slot-scope="scope">{{ scope.row.element_name }}</template>
            </el-table-column>
            <el-table-column prop="element_code" label="字段描述">
            </el-table-column>
            <el-table-column prop="element_type" label="数据类型" show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <p class="title-name">权限配置</p>
          <el-form-item label="权限类型" prop="authType">
            <el-checkbox-group v-model="formData2.authType">
              <el-checkbox label="1" name="authType">查询</el-checkbox>
              <el-checkbox label="2" name="authType">写入</el-checkbox>
              <el-checkbox label="3" name="authType">修改</el-checkbox>
              <el-checkbox label="4" name="authType">删除</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <p class="title-name">账号类型</p>
          <el-row :gutter="20">
            <el-col :span="4">
              <el-radio v-model="formData2.accountType" label="0">个人账号</el-radio>
            </el-col>
            <el-col :span="5">
              <el-form-item label="有效期至" prop="validEndTime">
                <el-select v-model="formData2.validEndTime" :disabled="formData2.accountType !== '0'" placeholder="请选择有效期">
                  <el-option v-for="(item, index) in timeList" :key="index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-date-picker v-model="formData2.periodValidity" type="date" :disabled="formData2.accountType !== '0'" placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <el-radio v-model="formData2.accountType" label="1">项目生产账号</el-radio>
            </el-col>
            <el-col :span="5">
              <el-form-item label="归属项目" prop="projectName">
                <el-select v-model="formData2.projectName" :disabled="formData2.accountType !== '1'" placeholder="请选择项目">
                  <el-option v-for="(item, index) in projectList" :key="index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="申请原因" prop="remark">
            <el-input type="textarea" v-model="formData2.remark" maxlength="128" show-word-limit placeholder="请输入申请原因"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-wrapper">
        <el-button v-if="step === 0" type="primary" size="mini" @click="nextStep">下一步</el-button>
        <el-button v-if="step === 1" type="plain" size="mini" @click="cancel">取消</el-button>
        <el-button v-if="step === 1" type="primary" size="mini" @click="submitForm">提交</el-button>
      </div>
    </el-card>
  </section>
</template>

<script>
import * as dayjs from 'dayjs'
import {
  getFormAll
} from '@/api/rd/publish/form.js'
import {
  authoritySubmit,
  getLogicTables,
  getLogicColumns
} from '@/api/asset/authority.js'
import { getListBusiness, getTableList } from '@/api/plan/project-manage'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'ApplyLogicTable',
  inject: ['tabStore'],
  props: {
    data: Object
  },
  data () {
    var validateEndTime = (rule, value, callback) => {
      if (this.formData2.accountType === '0') {
        if (value === '') {
          callback(new Error('请选择有效期'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateProjectName = (rule, value, callback) => {
      if (this.formData2.accountType === '1') {
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
      // form-json 表单对象JSON
      // 注意：如表单Json是从后端接口异步获取到的，请使用下述的API方法——setFormJson()赋值，使用form-json属性传值则会导致表单校验异常或表单渲染不成功。
      formJson: {},
      // form-data 表单数据对象
      // 注意：form-data属性通常用于表单初始化时给表单传递回显数据，如需多次修改表单数据或发现表单部分数据失去响应式更新，请调用下述的setFormData(formData)方法。
      formData: {},
      // option-data  表单radio、checkbox、select、cascader组件的选择项集合
      optionData: {},
      // 默认申请步骤 0
      step: 0,
      modelKey: '',
      formData1: {
        environment: '',
        businessSegment: '',
        logicTable: '',
      },
      rules1: {
        environment: [
          { required: true, message: '请选择环境', trigger: 'change' }
        ],
        businessSegment: [
          { required: true, message: '请选择业务板块', trigger: 'change' }
        ],
      },
      environmentList: [
        {
          label: '生产环境',
          value: '生产环境'
        },
        {
          label: '测试环境',
          value: '测试环境'
        },
        {
          label: '开发环境',
          value: '开发环境'
        },
      ],
      businessSegmentList: [],
      logicTableList: [],
      formData2: {
        environment: '',
        businessSegment: '',
        logicTable: '',
        tableData: [],
        authType: [],
        accountType: '',
        validEndTime: '',
        periodValidity: '',
        projectName: '',
        remark: ''
      },
      timeList: [
        {
          label: '自定义',
          value: '0'
        },
        {
          label: '长期',
          value: '1'
        },
        {
          label: '一天',
          value: '2'
        },
        {
          label: '一周',
          value: '3'
        },
      ],
      rules2: {
        authType: [
          { type: 'array', required: true, message: '请至少选择一个权限类型', trigger: 'change' }
        ],
        validEndTime: [
          { required: true, validator: validateEndTime, trigger: 'change' }
        ],
        projectName: [
          { required: true, validator: validateProjectName, trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入申请原因', trigger: 'blur' }
        ],
      },
      codes: [],
      projectList: []
    }
  },
  mounted () {
    this.modelKey = this.data.modelKey
    this.getBusinessSegmentList()
    this.getLogicTableList()
    this.getLogicColumns()
    this.getProjectList()
  },

  methods: {
    handleSelectionChange (val) {
      this.codes = val.map(item => item.element_code)
    },
    async getBusinessSegmentList () {
      const res = await this.$simpleAsyncTo(getListBusiness())
      if (res) {
        this.businessSegmentList = res.data.map(item => {
          return {
            label: item.busin_name,
            value: item.busin_id,
          }
        })
      }
    },
    async getLogicTableList () {
      const res = await this.$simpleAsyncTo(getLogicTables({ type: 0 }))
      if (res) {
        this.logicTableList = res.data.map(item => {
          return {
            label: item.cube_code,
            value: item.cube_id,
          }
        })
      }
    },
    async getLogicColumns () {
      const res = await this.$simpleAsyncTo(getLogicColumns())
      if (res) {
        this.formData2.tableData = res.data
      }
    },
    async getProjectList () {
      const res = await this.$simpleAsyncTo(getTableList())
      if (res) {
        this.projectList = res.data.map(item => {
          return {
            label: item.project_name,
            value: item.id,
          }
        })
      }
    },

    // 下一步
    nextStep () {
      this.$refs.formData1.validate((valid) => {
        if (valid) {
          Object.assign(this.formData2, this.formData1)
          this.step = 1
        } else {
          return false
        }
      })
    },

    // 提交请求不一样 axios 动态配置
    submitForm () {
      // 表单提交
      this.$refs.formData2.validate((valid) => {
        if (valid) {
          let data = {
            environment: this.formData2.environment,
            businessSegment: this.formData2.businessSegment,
            logicTable: this.formData2.logicTable,
            permissionype: this.formData2.authType,
            personalAccount: this.formData2.accountType,
            expiration: this.formData2.validEndTime,
            date: this.formData2.periodValidity ? dayjs(this.formData2.periodValidity).format('YYYY-MM-DD') : '',
            project: this.formData2.projectName,
            remark: this.formData2.remark,
            codes: this.codes
          }
          const params = {
            modelKey: this.modelKey,
            formData: JSON.stringify(data)
          }
          this.submit(params)
        } else {
          return false
        }
      })

    },

    async submit (formData) {
      const res = await this.$simpleAsyncTo(authoritySubmit(formData))
      if (res) {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        // 关闭弹窗
        this.tabStore.commit('remove', this.data.name)
      }
    },

    cancel () {
      // 关闭弹窗
      this.tabStore.commit('remove', this.data.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.apply-logic-table {
  padding: 20px 20px;
  background: $grey7;
  height: 100%;
  .el-card__header {
    padding: 0;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .btn-wrapper {
    text-align: center;
    margin-top: 20px;
  }
  .title-name {
    margin-bottom: 20px;
  }
  .el-table {
    margin-bottom: 20px;
  }
}
body {
  margin: 0; /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
}

</style>
