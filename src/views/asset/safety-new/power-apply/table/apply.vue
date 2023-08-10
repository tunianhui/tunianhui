<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2023-05-29 16:10:50
 * @LastEditTime: 2023-08-08 11:10:00
 * @Description:
-->
<template>
  <div>
    <div class="pt-10 pb-10">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          ><a href="javascript:;" @click="jump">表权限</a></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><a href="javascript:;">申请表权限</a></el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="add-nav mb-10">
      <div class="add-nav-label">申请表权限</div>
      <div class="add-nav-item">
        <span>功能定位：</span>
        <span
          >填写申请信息
          <i class="iconfont icon-iconfontzhizuobiaozhun023117"></i
        ></span>
        <span class="dotted-line"></span>
        <span class="ml-15"
          >表及字段选择<i class="iconfont icon-iconfontzhizuobiaozhun023117"></i
        ></span>
        <span class="dotted-line"></span>
        <span class="ml-15"
          >申请原因<i class="iconfont icon-iconfontzhizuobiaozhun023117"></i
        ></span>
      </div>
    </div>

    <div class="power-content-box">
      <el-form
        :model="formData"
        :rules="formRules"
        ref="formRef"
        label-width="100px"
        label-position="left"
      >
        <div class="top-form">
          <div class="form-left">
            <i class="iconfont icon-xiangmu2 mb-5"></i> 填写申请信息
          </div>
          <div class="form-right">
            <el-form-item label="表类型" prop="tableType">
              <el-select
                v-model="formData.tableType"
                placeholder="请选择表类型"
                style="width: 36%"
                @change="changeTableType"
              >
                <el-option
                  v-for="item in tableTypeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="环境" prop="environment">
              <el-select
                v-model="formData.environment"
                placeholder="请选择表类型"
                style="width: 36%"
              >
                <el-option
                  v-for="item in environmentList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="表所在项目" prop="projectId">
              <el-select
                v-model="formData.projectId"
                placeholder="请搜索表所在的项目"
                style="width: 36%"
                @change="changeProject"
              >
                <el-option
                  v-for="item in projectList"
                  :key="item.project_id"
                  :label="item.project_name"
                  :value="item.project_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="账号类型" prop="accountType">
              <AccountType v-model="formData.accountType" :accountList="accountList"></AccountType>
            </el-form-item>
            <el-divider></el-divider>
          </div>
        </div>
        <div class="center-form">
          <div class="form-left">
            <i class="iconfont icon-daichulibiaoshu mb-5"></i> 表及字段选择
          </div>
          <div class="form-right">
            <el-form-item label="申请表名" prop="tableName">
              <el-select
                v-model="formData.tableName"
                filterable
                multiple
                placeholder="请选择表"
                style="width: 85%"
                @change="changeTable"
              >
                <el-option
                  v-for="item in tableNameList"
                  :key="item.cube_id"
                  :label="item.cube_code"
                  :value="item.cube_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="permissionDTOS" label="选择字段">
              <SelectField v-model="formData.permissionDTOS"></SelectField>
            </el-form-item>
            <!-- <el-form-item label="权限类型" prop="auth_type">
              <el-checkbox-group v-model="formData.auth_type">
                <el-checkbox label="1">查表数据</el-checkbox>
                <el-checkbox label="2">改表数据</el-checkbox>
                <el-checkbox label="3">删除表</el-checkbox>
                <el-checkbox label="4">改表结构</el-checkbox>
              </el-checkbox-group>
            </el-form-item> -->
            <!-- <el-form-item label="选择字段" prop="field">
              <el-table
                :data="tableData"
                tooltip-effect="dark"
                :class="{fixed: fixed, 'tabel-cell-noe': false}"
                v-loading="!!loading"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="element_code" label="字段">
                </el-table-column>
                <el-table-column prop="element_name" label="字段描述">
                </el-table-column>
                <el-table-column prop="element_type" label="数据类型">
                </el-table-column>
                <el-table-column
                  prop="classifyShortName"
                  label="数据分类"
                  width="110"
                >
                  <template slot-scope="{row}">
                    <span class="data-classify">{{
                      row.classifyShortName
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="levelShortName"
                  label="数据分级"
                  width="110"
                >
                  <template slot-scope="{row}">
                    <span class="data-classify">{{ row.levelShortName }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item> -->
            <el-divider></el-divider>
          </div>
        </div>
        <div class="bottom-form">
          <div class="form-left">
            <i class="iconfont icon-chulishuai mb-5"></i> 申请原因
          </div>
          <div class="form-right">
            <el-form-item label="申请理由" prop="reason">
              <el-input
                type="textarea"
                v-model="formData.reason"
                resize="none"
                placeholder="请填写申请理由"
                :maxlength="500"
                show-word-limit
                :autosize="{minRows: 4}"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="btn-wrapper">
      <el-button type="primary" @click="submitForm('formRef')">提 交</el-button>
    </div>
  </div>
</template>

<script>
// import {getProjectList} from '@/api/rd/dev'
import {
  getTableTypeList,
  getLogicColumns,
  getLogicTables,
  authoritySubmit,
  getAccountList,
  getAllBusinessProject
} from '@/api/asset/authority'
import dayjs from 'dayjs'
import SelectField from './select-field.vue'
const AccountType = {
  name: 'AccountType',
  props: {
    value: Object,
    accountList: Array,
  },
  data() {
    return {
      data: {},
      quickTimeList: [
        {
          label: '30天',
          value: 'DAYS_30',
        },
        {
          label: '90天',
          value: 'DAYS_90',
        },
        {
          label: '180天',
          value: 'DAYS_180',
        },
        {
          label: '长期',
          value: 'LONG_TERM',
        },
        {
          label: '自定义',
          value: 'CUSTOM',
        },
      ],
      projectList: [],
    }
  },
  watch: {
    value: {
      handler(val) {
        this.data = val
        if (val.quickTime === 'CUSTOM') {
          this.data.date = ''
        } else if (val.quickTime == 'DAYS_30') {
          this.data.date = dayjs().add(30, 'days').format('YYYY-MM-DD')
        } else if (val.quickTime == 'DAYS_90') {
          this.data.date = dayjs().add(90, 'days').format('YYYY-MM-DD')
        } else if (val.quickTime == 'DAYS_180') {
          this.data.date = dayjs().add(180, 'days').format('YYYY-MM-DD')
        } else if (val.quickTime == 'LONG_TERM') {
          this.data.date = ''
        }
      },
      immediate: true,
    },
    accountList: {
      handler(val) {
        this.projectList = val.map((item) => {
          return {
            label: item.project_name,
            value: item.project_id,
          }
        })
      },
      immediate: true,
    },
  },
  render(h) {
    return (
      <div style="width:100%">
        <div style="width:36%" class="mb-10">
          <el-checkbox
            v-model={this.data.userCheck}
            on-change={(val) => this.changeUserChecked(val)}
          >
            个人账号
            <i class="el-icon-info ml-5"></i>
          </el-checkbox>
          <span class="ml-5 mr-10" style="color: #606266;">
            有效期至
          </span>
          <el-select
            v-model={this.data.quickTime}
            placeholder="请选择"
            style="width: 80px"
            disabled={!this.data.userCheck}
            on-change={(val) => this.changeQuickTime(val)}
          >
            {this.quickTimeList.map((item) => {
              return (
                <el-option
                  key={item.value}
                  label={item.label}
                  value={item.value}
                ></el-option>
              )
            })}
          </el-select>
          <el-date-picker
            style="width:calc(100% - 255px); margin-left: 5px;"
            align="center"
            v-model={this.data.date}
            value-format="YYYY-MM-DD"
            disabled={!this.data.userCheck || (this.data.quickTime != 'CUSTOM')}
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </div>
        <div>
          <el-checkbox
            v-model={this.data.productionCheck}
            on-change={(val) => this.changeProductionChecked(val)}
          >
            生产账号
            <i class="el-icon-info ml-5"></i>
          </el-checkbox>
          <span class="ml-5 mr-10">账号</span>
          <el-select
            v-model={this.data.projectId}
            placeholder="请选择"
            style="width: 298px"
            disabled={!this.data.productionCheck}
          >
            {this.projectList.map((item) => {
              return (
                <el-option
                  key={item.value}
                  label={item.label}
                  value={item.value}
                ></el-option>
              )
            })}
          </el-select>
          <span class="ml-5 mr-10" style="color: #606266;opacity: 0.5">
            有效期至
          </span>
          <span class="ml-5 mr-10" style="color: #606266;opacity: 0.5">
            长期
          </span>
        </div>
      </div>
    )
  },
  methods: {
    changeUserChecked(val) {
      this.$emit('change', this.data)
    },
    changeProductionChecked(val) {},
    changeQuickTime(val) {
      if (val === 'CUSTOM') {
        this.data.date = ''
      } else if (val == 'DAYS_30') {
        this.data.date = dayjs().add(30, 'days').format('YYYY-MM-DD')
      } else if (val == 'DAYS_90') {
        this.data.date = dayjs().add(90, 'days').format('YYYY-MM-DD')
      } else if (val == 'DAYS_180') {
        this.data.date = dayjs().add(180, 'days').format('YYYY-MM-DD')
      } else if (val == 'LONG_TERM') {
        this.data.date = '2123-12-31'
      }
      this.$emit('change', this.data)
    },
  },
}
export default {
  name: 'apply',
  components: {
    AccountType,
    SelectField
  },
  props: {},
  mixins: [],
  data() {
    return {
      loading: 0,
      fixed: false,
      multipleSelection: [],
      tableData: [],
      formData: {
        tableType: '',
        environment: 'dev',
        projectId: '',
        accountType: {
          userCheck: false,
          quickTime: 'DAYS_30',
          date: '',
          productionCheck: false,
          projectId: '',
        },
        tableName: [],
        auth_type: [],
        field: '',
        reason: '',
        permissionDTOS: {}
      },
      formRules: {
        tableType: [
          {
            required: true,
            message: '请选择表类型',
            trigger: ['blur', 'change'],
          },
        ],
        environment: [
          {
            required: true,
            message: '请选择生产环境',
            trigger: ['blur', 'change'],
          },
        ],
        projectId: [
          {
            required: true,
            message: '请选择表所属项目',
            trigger: ['change'],
          },
        ],
        accountType: [
          {required: true, message: '请选择账号类型'},
          {validator: this.validateAccountType, trigger: ['blur', 'change']},
        ],
        tableName: [
          {required: true, message: '请选择表', trigger: ['blur', 'change']},
        ],
        auth_type: [
          {
            required: true,
            message: '请选择权限类型',
            trigger: ['blur', 'change'],
          },
        ],
        field: [
          {required: true, message: '请选择字段', trigger: ['blur', 'change']},
        ],
        reason: [
          {required: true, message: '请输入申请原因', trigger: ['blur']},
        ],
      },
      // 表类型
      tableTypeList: [],
      // 环境
      environmentList: [
        {
          label: '生产环境',
          value: 'prod',
        },
        {
          label: '开发环境',
          value: 'dev',
        },
      ],
      projectList: [],
      // 表名
      tableNameList: [],
      accountList: [],
      // selectFieldList: {},
      oldSelectFieldList: [],
    }
  },
  computed: {},
  watch: {},
  async created() {
    await this._getProjectList()
    this._getAccountList()
    await this.getTableType()
    this.formData.tableType = this.tableTypeList[0].code
    // this.getTableNamesData()
    // this.getColumnsData()
  },
  mounted() {},
  methods: {
    changeTableType() {
      this.formData.tableName = []
      this.formData.permissionDTOS = {}
      this.oldSelectFieldList = []
      this.tableNameList = []
      this.formData.projectId = ''
    },
    changeProject(val) {
      console.log(val)
      this.getTableNamesData(val)
    },
    // 表类型
    async getTableType() {
      const res = await this.$simpleAsyncTo(getTableTypeList(), '获取表类型失败')
      if (res) {
        this.tableTypeList = res.data
      }
    },

    // 表名
    async getTableNamesData(val) {
      if (!val) return this.tableNameList = []
      const params = {
        projectId: val,
        type: this.formData.tableType,
      }
      const res = await this.$simpleAsyncTo(getLogicTables(params), '获取表名失败')
      if (res) {
        this.tableNameList = res.data
      }
    },

    // 所属项目
    async _getProjectList() {
      const params = {}
      const res = await this.$simpleAsyncTo(
        getAllBusinessProject(params),
        '获取所属项目失败'
      )
      if (res) {
        this.projectList = res.data
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
      // 字段赋值
      if (val.length) {
        this.formData.field = val.map((ele) => ele.element_code)
      } else {
        this.formData.field = []
      }
    },

    checkAllChange(boolean) {
      if (boolean) {
        this.tableData.forEach((item) => {
          this.$refs.multipleTable.toggleAllSelection(item)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },

    validateAccountType(rule, value, callback) {
      callback()
    },

    jump() {
      // 二次确认 --->
      this.$emit('close')
    },

    submitForm(formName) {
      
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const project = this.projectList.find((item) => item.project_id === this.formData.projectId)
          const accountType = this.formData.accountType
          const grantToUsers = []
          const permissionDTOSData = this.formData.permissionDTOS
          const permissionDTOS = []
          for(let key in permissionDTOSData) {
            const operates = permissionDTOSData[key].operates
            const cubes = this.tableNameList.find((item) => item.cube_id === key)
            const resource = {
              allFiled: '',
              children: permissionDTOSData[key].list.filter(d => d.select).map(d => {
                console.log(d)
                return {
                  elementId: d.element_id,
                  elementCode: d.element_code,
                  elementName: d.element_name,
                  elementType: d.element_type,
                }
              }),
              cubeId: key,
              cubeCode: cubes.cube_code,
            }
            permissionDTOS.push({
              resource,
              operates,
            })
          }
          if (accountType.userCheck) {
            grantToUsers.push({
              accountType: 'PERSONAL',
              periodType: accountType.quickTime,
              periodEnd: accountType.date,
            })
          }
          if (accountType.productionCheck) {
            grantToUsers.push({
              accountType: 'PRODUCE',
              periodType: 'LONG_TERM',
              periodEnd: '2123-12-31',
              projectId: accountType.projectId,
            })
          }
          const params = {
            tableType: this.formData.tableType,
            environment: this.formData.environment,
            projectId: this.formData.projectId,
            projectCode: project.project_code,
            reason: this.formData.reason,
            grantToUsers: JSON.stringify(grantToUsers),
            permissionDTOS: JSON.stringify(permissionDTOS),
          }
          console.log(params)
          const res = await this.$simpleAsyncTo(authoritySubmit(params), '提交失败')
          if (res) {
            this.$message.success('提交成功')
            this.$emit('close')
          }
        }
      })
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
    //
    changeTable(val) {
      // console.log(val)
      // 比较val和oldSelectFieldList的差异
      const oldList = this.oldSelectFieldList
      const newList = val
      const addList = newList.filter((item) => !oldList.includes(item))
      const delList = oldList.filter((item) => !newList.includes(item))
      // 新增的表
      addList.forEach((item) => {
        this.getColumnsData(item)
      })
      // 删除的表
      delList.forEach((item) => {
        this.$delete(this.formData.permissionDTOS, item)
      })
      this.oldSelectFieldList = val
    },
    // 获取表字段
    async getColumnsData(val) {
      if (!val) return
      const params = {
        cube_id: val
      }
      const res = await this.$simpleAsyncTo(getLogicColumns(params), '获取表字段失败')
      if (res) {
        const cubes = this.tableNameList.find((item) => item.cube_id === val)
        this.$set(this.formData.permissionDTOS, val, {
          ...(cubes || {}),
          list: [...res.data].map(d => {
            return {
              ...d,
              select: false,
            }
          }),
          operates: []
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
:deep(.el-divider--horizontal) {
  margin: 5px 0;
}

:deep(.el-form) {
  width: 100%;
}

.data-classify {
  display: block;
  width: fit-content;
  text-align: center;
  border: 1px solid #c6dcff;
  background-color: #d1e3fd;
  border-radius: 10px;
  padding: 0 20px;
}

.add-nav {
  display: flex;
  align-items: center;
  &-label {
    font-size: 16px;
    font-weight: 500;
    margin-right: 20px;
  }
  &-item {
    font-size: 12px;
    padding: 5px 20px;
    background: #d9dbea;
    display: flex;
    span:first-child {
      color: rgba(0, 0, 0, 0.5);
    }
    .dotted-line {
      position: relative;
      width: 40px;
      padding: 0 5px;
      &::after {
        content: '';
        border-bottom: 1px dashed rgba(0, 0, 0, 0.5);
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
      &::before {
        content: '';
        width: 5px;
        height: 5px;
        border: 1px solid rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        transform: translateY(-50%);
        top: 50%;
        right: -12px;
        position: absolute;
      }
    }
  }
}
.power-content-box {
  display: flex;
  background: #f5f5f7;
  .top-form,
  .center-form,
  .bottom-form {
    display: flex;
    .form-left {
      width: 50px;
      padding: 10px;
      background: #fff;
      display: flex;
      align-items: center;
      writing-mode: tb;
      letter-spacing: 10px;
      font-size: 14px;
      opacity: 0.7;
      i {
        color: #1588f5;
        font-size: 16px;
      }
    }
    .form-right {
      flex: 1;
      padding: 20px 20px 0 20px;
    }
  }
}
.btn-wrapper {
  text-align: end;
  margin-top: 20px;
}
</style>
