<template>
  <section class="apply-data-table">
    <el-card>
      <el-form label-width="80px" ref="formFilter" :model="formFilter" :rules="rules2">
        <p class="mb-10">数据源权限信息</p>
        <el-form-item label="数据源" prop="businessSegment">
          <el-select v-model="formFilter.datasource" placeholder="请选择业务板块">
            <el-option v-for="(item, index) in businessSegmentList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限类型" prop="auth_type">
          <el-checkbox-group v-model="formFilter.auth_type">
            <el-checkbox label="1" name="auth_type">同步读</el-checkbox>
            <el-checkbox label="2" name="auth_type">同步写</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <p class="mb-10">账号类型</p>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-radio v-model="formFilter.accountType" label="0">个人账号</el-radio>
          </el-col>
          <el-col :span="5">
            <el-form-item label="有效期至" prop="expiration">
              <el-select v-model="formFilter.expiration" :disabled="formFilter.accountType !== '0'" placeholder="请选择有效期">
                <el-option v-for="(item, index) in timeList" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-date-picker v-model="formFilter.date" type="date" :disabled="formFilter.accountType !== '0'" placeholder="选择日期">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-radio v-model="formFilter.accountType" label="1">项目生产账号（有效期为长期）</el-radio>
          </el-col>
          <el-col :span="5">
            <el-form-item label="归属项目" prop="project">
              <el-select v-model="formFilter.project" :disabled="formFilter.accountType !== '1'" placeholder="请选择项目">
                <el-option v-for="(item, index) in projectList" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="申请原因" prop="remark">
          <el-input type="textarea" v-model="formFilter.remark" maxlength="128" show-word-limit placeholder="请输入申请原因"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-wrapper">
        <el-button type="plain" size="mini" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" @click="submitForm">提交</el-button>
      </div>
    </el-card>
  </section>
</template>

<script>
import {
  getFormAll
} from '@/api/rd/publish/form.js'
import {
  authoritySubmit
} from '@/api/asset/authority.js'
import { getDataSource } from '@/api/plan/project-manage'
import dayjs from 'dayjs'
export default {
  name: 'ApplyDataTable',
  inject: ['tabStore'],
  props: {
    data: Object
  },
  data () {
    var validateEndTime = (rule, value, callback) => {
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
    var validateProjectName = (rule, value, callback) => {
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
      // form-json 表单对象JSON
      // 注意：如表单Json是从后端接口异步获取到的，请使用下述的API方法——setFormJson()赋值，使用form-json属性传值则会导致表单校验异常或表单渲染不成功。
      formJson: {},
      // form-data 表单数据对象
      // 注意：form-data属性通常用于表单初始化时给表单传递回显数据，如需多次修改表单数据或发现表单部分数据失去响应式更新，请调用下述的setFormData(formData)方法。
      formData: {},
      // option-data  表单radio、checkbox、select、cascader组件的选择项集合
      optionData: {},
      modelKey: '',
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
      projectList: [],
      businessSegmentList: []
    }
  },
  mounted () {
    this.modelKey = this.data.modelKey
    this.getBusinessSegmentList()
  },
  methods: {
    async getBusinessSegmentList () {
      const res = await this.$simpleAsyncTo(getDataSource())
      if (res) {
        this.businessSegmentList = res.data.map(item => {
          return {
            label: item.data_source_name,
            value: item.id,
          }
        })
      }
    },
    async setFormJson () {
      if (this.modelKey === 'service_ds_auth_flow') {
        this.formJson = require('./datasource.json')
      } else if (this.modelKey === 'service_api_auth_flow') {
        this.formJson = require('./api.json')
      }
      this.$refs.vFormRef.setFormJson(this.formJson)
      const res = await this.$simpleAsyncTo(getFormAll({ modelKey: this.modelKey }))
      if (res.flag) {
        // const formJson = res.data.formJson
        // this.$refs.vFormRef.setFormJson(formJson)
      }
    },

    // 提交请求不一样 axios 动态配置
    submitForm () {
      this.$refs.formFilter.validate(valid => {
        if (valid) {
          const formData = {
            datasource: this.formFilter.datasource,
            auth_type: this.formFilter.auth_type,
            accountType: this.formFilter.accountType,
            expiration: this.formFilter.expiration,
            date: this.formFilter.date ? dayjs(this.formFilter.date).format('YYYY-MM-DD') : '',
            project: this.formFilter.project,
            remark: this.formFilter.remark
          }
          const params = {
            modelKey: this.modelKey,
            formData: JSON.stringify(formData)
          }
          this.submit(params)
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

<style lang="scss">
.apply-data-table {
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
  }
}
body {
  margin: 0; /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
}

</style>
