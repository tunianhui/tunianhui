<template>
  <section class="api-grant-detail">
    <el-row class="mb-10">
      <el-col>API权限申请</el-col>
    </el-row>
    <el-card class="steps-card mb-10 ">
      <div class="steps-title" slot="header">
        <span>
          <i :class="['iconfont icon-1', completed ? 'active' : '']"></i>
          <span>申请权限对象</span>
        </span>
        <span></span>
        <span>
          <i class="iconfont icon-2"></i>
          <span>权限申请配置</span>
        </span>
      </div>
      <div class="card-body" v-show="showStep === '1'">
        <div class="mb-10">对象信息</div>
        <div>
          <el-form :model="objInfoForm" class="demo-form-inline" label-width="120px" :rules="rulesObjInfo">
            <el-row type="flex">
              <el-col :span="7">
                <el-form-item label="应用" prop="app_group_id">
                  <el-select v-model="objInfoForm.app_group_id" placeholder="请选择应用分组" style="width:100%" @change="appGroupSelectChange" :disabled="disabledEdit1">
                    <el-option :label="item.group_name" :value="item.id" v-for="item in appGroupList" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label=" " label-width="20px" prop="app_id">
                  <el-select v-model="objInfoForm.app_id" placeholder="请输入/选择应用名称" style="width:100%" filterable :disabled="disabledEdit1">
                    <el-option :label="item.app_name" :value="item.app_id" v-for="item in appList" :key="item.app_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="API" prop="servunit_group_id">
                  <el-select v-model="objInfoForm.servunit_group_id" placeholder="请选择API分组" style="width:100%" @change="apiGroupSelectChange" :disabled="disabledEdit">
                    <el-option :label="item.group_name" :value="item.id" v-for="item in apiGroupList" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label=" " label-width="20px" prop="api_id">
                  <el-select v-model="objInfoForm.api_id" placeholder="请输入/选择API名称" style="width:100%" filterable :disabled="disabledEdit">
                    <el-option :label="item.api_name" :value="item.api_id" v-for="item in apiList" :key="item.api_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item class="space-between" label-width="0px" style="margin-top:100px">
              <el-button type="primary" class="mr-20" @click="cancel">取 消</el-button>
              <el-button type="primary" @click="nextStep">下 一 步</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="showStep === '2'">
        <div class="mb-20">对象信息</div>
        <el-card class="obj-basic-info mb-20">
          <el-form class="demo-form-inline" label-width="120px" label-suffix="：">
            <el-row type="flex">
              <el-col :span="6">
                <el-form-item label="应用名称">
                  <span class="font-12"><i>{{
                      filterObjName(objInfoForm.app_id, appList, 'app_id')
                        .app_name
                    }}</i></span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="应用分组">
                  <span class="font-12"><i>{{
                      filterObjName(
                        objInfoForm.app_group_id,
                        appGroupList,
                        'id'
                      ).group_name
                    }}</i></span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="6">
                <el-form-item label="API名称">
                  <span class="font-12"><i>{{
                      filterObjName(objInfoForm.api_id, apiList, 'api_id')
                        .api_name
                    }}</i></span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="API分组">
                  <span class="font-12"><i>{{
                      filterObjName(
                        objInfoForm.servunit_group_id,
                        apiGroupList,
                        'id'
                      ).group_name
                    }}</i></span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <div class="mb-20">权限字段</div>
        <div class="grant-field space-between">
          <div class="font-12">
            已选中
            <span style="color: #6CA0F4">{{ multipleSelection.length }}</span>
          </div>
          <div class="">
            <el-input v-model="searchParams" placeholder="搜索参数">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
        </div>
        <el-table ref="multipleTable" :data="filterField" tooltip-effect="dark" style="width: 100%" max-height="170" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="序号" type="index"> </el-table-column>
          <el-table-column prop="param_name" label="返回参数名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="param_type" label="参数类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="remark" label="返回参数描述" show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <div class="mb-20 mt-20">权限配置</div>
        <el-card class="obj-basic-info mb-20">
          <el-form ref="form" :model="grantConfig" label-width="100px" label-suffix="：" :rules="grantConfigRules">
            <el-row class="mb-10">
              <el-col :span="6">
                <el-form-item label="权限类型">
                  {{ auth_type }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="账号类型">
                  {{ number_type }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="mb-10">
              <el-col :span="6">
                <el-form-item label="有效期至" prop="expire_type">
                  <el-select v-model="grantConfig.expire_type" placeholder="" @change="expireTypeChange">
                    <el-option :label="item.label" :value="item.value" v-for="item in untils" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="" label-width="30px">
                  <el-date-picker v-model="grantConfig.expire_time" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" :picker-options="pickerOptions" :disabled="disabled">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="申请原因" prop="reason">
              <el-input type="textarea" :rows="4" resize="none" :show-word-limit="true" :maxlength="128" placeholder="请输入内容" v-model="grantConfig.reason">
              </el-input>
            </el-form-item>
          </el-form>
        </el-card>
        <div class="flex-center">
          <el-button type="primary" class="mr-20" @click="upStep">
            上 一 步
          </el-button>
          <el-button type="primary" @click="submitConfirm"> 确 定 </el-button>
        </div>
      </div>
    </el-card>
  </section>
</template>

<script>
import {
  getGrantFieldList,
  getSubmit,
  editApply,
  getApplyAppList,
  getApplyApList
} from '@/api/server/server.js'
import { dateFormat } from '@/libs/util'
import { mapGetters } from 'vuex'
export default {
  name: 'ApiGrantDetail',
  props: {
    appGroupList: Array,
    apiGroupList: Array,
    applyInfo: Object
  },
  data () {
    return {
      objInfoForm: {
        app_group_id: '',
        app_id: '',
        servunit_group_id: '',
        api_id: ''
      },
      rulesObjInfo: {
        app_group_id: [
          { required: true, message: '请选择应用分组', trigger: 'change' }
        ],
        servunit_group_id: [
          { required: true, message: '请选择API分组', trigger: 'change' }
        ]
      },
      showStep: '1',
      searchParams: '',
      tableData: [],
      multipleSelection: [],
      grantConfig: {
        expire_type: '1',
        expire_time: this.formatTime(30),
        reason: ''
      },
      grantConfigRules: {
        expire_type: [
          { required: true, message: '请选择有效期', trigger: 'change' }
        ],
        reason: [{ required: true, message: '请输入申请原因', trigger: 'blur' }]
      },
      untils: [
        {
          label: '30天',
          value: '1'
        },
        {
          label: '90天',
          value: '2'
        },
        {
          label: '180天',
          value: '3'
        },
        {
          label: '长期',
          value: '4'
        },
        {
          label: '自定义',
          value: '5'
        }
      ],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7 // 如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      disabled: true,
      auth_type: '查询',
      number_type: '个人账号',
      appList: [],
      apiList: [],
      disabledEdit: false,
      disabledEdit1: false
    }
  },
  computed: {
    ...mapGetters(['project']),
    completed () {
      let flag = true
      for (let key in this.objInfoForm) {
        if (this.objInfoForm[key] !== '0' && !this.objInfoForm[key]) {
          return false // 终止程序
        }
      }
      return flag
    },
    filterField () {
      return this.tableData.filter(e => {
        return e.param_name.match(this.searchParams)
      })
    }
  },
  watch: {
    'objInfoForm.api_id': {
      deep: true,
      handler (val) {
        if (val) {
          this.multipleSelection = []
          this.getGrantFieldList()
        }
      }
    },
    applyInfo: {
      immediate: true,
      async handler (val) {
        // if (val.api_id) {
        //   await this.getAppList()
        //   await this.getApiList()
        //   this.$nextTick(_ => {
        //     this.objInfoForm.app_group_id = val.app_group_id
        //     this.objInfoForm.servunit_group_id = val.servunit_group_id
        //     // await this.getAppList()
        //     // await this.getApiList()
        //     this.objInfoForm.app_id = val.app_id
        //     this.objInfoForm.api_id = val.api_id
        //     this.auth_type = val.auth_type
        //     this.number_type = val.auth_type
        //   })
        // }
        if (JSON.stringify(val) !== '{}') {
          if (val.app_id) {
            this.disabledEdit1 = true
          } else {
            this.disabledEdit1 = false
          }
          this.disabledEdit = true
          await this.getAppList()
          await this.getApiList()
          this.$nextTick(_ => {
            this.objInfoForm.app_group_id = val.app_group_id || ''
            this.objInfoForm.servunit_group_id = val.servunit_group_id || ''
            // await this.getAppList()
            // await this.getApiList()
            this.objInfoForm.app_id = val.app_id || ''
            this.objInfoForm.api_id = val.api_id || ''
            this.auth_type = val.auth_type || '查询'
            this.number_type = val.number_type || '个人账号'
          })
        }
      }
    }
  },
  created () {
    if (JSON.stringify(this.applyInfo) === '{}') {
      this.getAppList()
      this.getApiList()
    }
  },
  methods: {
    nextStep () {
      if (!this.objInfoForm.app_group_id) {
        return this.$message({ type: 'error', message: '请选择应用分组' })
      }
      if (!this.objInfoForm.app_id) {
        return this.$message({ type: 'error', message: '请选择应用名称' })
      }
      if (!this.objInfoForm.servunit_group_id) {
        return this.$message({ type: 'error', message: '请选择API分组' })
      }
      if (!this.objInfoForm.api_id) {
        return this.$message({ type: 'error', message: '请选择API名称' })
      }
      if (JSON.stringify(this.applyInfo) !== '{}') {
        this.grantConfig.expire_type = this.applyInfo.expire_type || '1'
        this.grantConfig.expire_time =
          this.applyInfo.expire_time || this.formatTime(30)
        this.grantConfig.reason = this.applyInfo.reason || ''
        let fieldArr
        if (this.applyInfo.returnFields && this.applyInfo.returnFields.length) {
          fieldArr = this.applyInfo.returnFields.split(',')
        } else {
          fieldArr = []
        }
        let newArr = []
        this.tableData.filter(item => {
          fieldArr.includes(item.param_name) && newArr.push(item)
        })
        newArr.forEach(e => {
          this.$refs.multipleTable.toggleRowSelection(e, true)
        })
      }
      this.showStep = '2'
    },
    // 权限字段列表
    async getGrantFieldList () {
      const params = {
        id: this.objInfoForm.api_id
      }
      const res = await this.$simpleAsyncTo(
        getGrantFieldList(params),
        '获取权限字段失败'
      )
      if (res) {
        this.tableData = res.data
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    expireTypeChange (val) {
      switch (val) {
        case '1':
          this.disabled = true
          this.grantConfig.expire_time = this.formatTime(30)
          break
        case '2':
          this.disabled = true
          this.grantConfig.expire_time = this.formatTime(90)
          break
        case '3':
          this.disabled = true
          this.grantConfig.expire_time = this.formatTime(180)
          break
        case '4':
          this.disabled = true
          this.grantConfig.expire_time = this.formatTime(99999)
          break
        case '5':
          this.disabled = false
          this.grantConfig.expire_time = this.formatTime(0)
          break
      }
    },
    async submitConfirm () {
      if (!this.multipleSelection.length) {
        return this.$message({ type: 'error', message: '请选择权限字段' })
      }
      if (!this.grantConfig.reason) {
        return this.$message({ type: 'error', message: '请输入申请原因' })
      }
      if (
        this.grantConfig.expire_type === '5' &&
        !this.grantConfig.expire_time
      ) {
        return this.$message({ type: 'error', message: '请选择日期' })
      }
      let arrField = []
      this.multipleSelection.forEach(e => {
        arrField.push(e.param_name)
      })
      let curApiObj = this.apiList.filter(
        item => item.api_id === this.objInfoForm.api_id
      ),
        project_id
      if (curApiObj && curApiObj.length) {
        project_id = curApiObj[0].project_id
      }
      let params = {
        app_group_id: this.objInfoForm.app_group_id,
        project_id,
        app_id: this.objInfoForm.app_id,
        servunit_group_id: this.objInfoForm.servunit_group_id,
        api_id: this.objInfoForm.api_id,
        returnField: arrField.join(),
        auth_type: this.auth_type,
        number_type: this.number_type,
        expire_type: this.grantConfig.expire_type,
        expire_time: this.grantConfig.expire_time,
        reason: this.grantConfig.reason
      }
      let msg = ''
      let fn = null
      if (JSON.stringify(this.applyInfo) !== '{}') {
        if (this.applyInfo.app_id) {
          params.id = this.applyInfo.id
          fn = editApply
          msg = '编辑'
        } else {
          fn = getSubmit
          msg = '申请'
        }
      } else {
        fn = getSubmit
        msg = '申请'
      }
      const res = await this.$simpleAsyncTo(fn(params), `${msg}失败`)
      if (res) {
        this.$message({
          type: 'success',
          message: `${msg}成功`
        })
        this.cancel()
      }
    },
    filterObjName (id, arr, idField) {
      if (id) {
        let newArr = arr.filter(e => {
          return e[idField] === id
        })
        if (newArr && newArr.length) {
          return newArr[0]
        } else {
          return {}
        }
      } else {
        return {}
      }
    },
    formatTime (day) {
      let n = new Date()
      let s = 60 * 60 * 24 * day * 1000
      let t = n.getTime()
      let nw = t + s
      return dateFormat(new Date(nw))
    },
    cancel () {
      this.$emit('cancel', 'home')
    },
    upStep () {
      this.showStep = '1'
    },
    appGroupSelectChange (val) {
      this.objInfoForm.app_id = ''
      this.getAppList()
    },
    async getAppList () {
      const params = {
        app_group_id: this.objInfoForm.app_group_id
      }
      const res = await this.$simpleAsyncTo(
        getApplyAppList(params),
        '获取应用列表失败'
      )
      if (res) {
        this.appList = res.data
      }
    },
    apiGroupSelectChange () {
      this.objInfoForm.api_id = ''
      this.getApiList()
    },
    async getApiList () {
      const params = {
        servunit_group_id: this.objInfoForm.servunit_group_id
      }
      const res = await this.$simpleAsyncTo(
        getApplyApList(params),
        '获取api列表失败'
      )
      if (res) {
        this.apiList = res.data
      }
    }
  }
}
</script>

<style lang="scss">
.api-grant-detail {
  .steps-card {
    border-radius: 0;
    box-shadow: none;
    background-color: $grey9;
    border: none;
    .obj-basic-info {
      background-color: $grey10;
      border-radius: 0;
      box-shadow: none;
      border: none;
      .el-form-item {
        margin-bottom: 0;
        .el-form-item__label {
          color: $grey4;
          font-size: 14px;
        }
      }
    }
    .grant-field {
      .el-input {
        width: 280px;
        .el-input__inner {
          border-radius: 0;
          border: none;
          border-bottom: 1px solid $grey6;
          background-color: $grey9;
        }
      }
    }
  }
  .steps-title {
    height: 40px;
    background: $grey9;
    line-height: 40px;
    text-align: center;
    font-size: 12px;
    > span:first-child,
    > span:last-child {
      i:first-child {
        font-size: 22px;
        color: $user2;
        vertical-align: sub;
        &.active {
          color: $success;
        }
      }
      i:last-child {
        color: $grey5;
      }
      span {
        padding: 0 5px;
      }
    }
    > span:nth-child(2) {
      display: inline-block;
      width: 20%;
      border-bottom: 1px dashed $grey4;
      margin: 0 5px 3px 5px;
    }
  }
}
</style>
