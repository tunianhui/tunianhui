<!--
 * @Author: 大炸鹅
 * @Date: 2022-10-24 14:25:30
 * @LastEditors: YONG
 * @LastEditTime: 2023-06-07 14:19:13
 * @FilePath: \智能数据构建\src\views\asset\safety-new\power-apply\function\index.vue
-->
<template>
  <div class="function-power">
    <div v-if="showHome" ref="quality">
      <Header :tabs="tabs" v-model="activeName" title="函数权限" ref="head">
        <div class="actions">
          <el-button type="primary" @click="functionPowerVisible = true">申请函数权限</el-button>
          <el-button>权限申请记录</el-button>
          <el-button><i class="el-icon-refresh-right"></i></el-button>
        </div>
      </Header>
      <FilterFieldCard class="mb-10" ref="filterFieldCard" placeholder="请输入关键字" @confirm="getTableList" :filterData="filterData"></FilterFieldCard>
      <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading">
        <el-table-column prop="data_project" label="数据对象">
          <template slot-scope="scope">
            <TableCell :data="scope.row" keyName="name" keyDesc="desc" icon="iconfont icon-yuanbiao-xianxing"></TableCell>
          </template>
        </el-table-column>
        <el-table-column prop="environment" label="环境">
        </el-table-column>
        <el-table-column prop="data_plate" label="项目">
        </el-table-column>
        <el-table-column prop="data_plate" label="权限账号">
          <template slot-scope="scope">
            <strong>{{scope.row.name}}</strong>
            <p>{{scope.row.desc}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="到期日期">
          <template slot-scope="scope">
            <p>{{scope.row.date}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="powerType" label="权限类型">
          <template slot-scope="scope">
            <p>{{scope.row.powerType}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="applyPowerHandle(scope.row)">
              <i class="iconfont icon-qiangzhizhongpao" style="font-size:14px;"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-footer">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>
      </div>
    </div>

    <el-dialog title="申请函数权限" :visible.sync="functionPowerVisible">
      <el-form :model="functionPowerForm" :rules="functionPowerRules" ref="functionPowerForm">
        <el-form-item label="环境" prop="environment" :label-width="formLabelWidth">
          <el-select v-model="functionPowerForm.environment" placeholder="请选择环境">
            <el-option :label="item.label" :value="item.value" v-for="item in environmentList" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目" prop="project" :label-width="formLabelWidth">
          <el-select v-model="functionPowerForm.project" placeholder="请选择项目">
            <el-option :label="item.label" :value="item.value" v-for="item in projectList" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实时函数" prop="realTimeFn" :label-width="formLabelWidth">
          <el-select v-model="functionPowerForm.realTimeFn" placeholder="请选择实时函数">
            <el-option :label="item.label" :value="item.value" v-for="item in realTimeFnList" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限类型" prop="powerType" :label-width="formLabelWidth">
          <el-checkbox-group v-model="functionPowerForm.powerType">
            <el-checkbox label="查询" name="1"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="账号类型" prop="userType" :label-width="formLabelWidth">
          <UserType v-model="functionPowerForm.userType"></UserType>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="申请原因" prop="applyReason">
          <el-input type="textarea" v-model="functionPowerForm.applyReason" :rows="7" :maxlength="128" :minlength="5" resize="none" placeholder="请填写续费原因，不少于5个字" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="functionPowerVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('functionPowerForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from '../../mixins'
import pager from '@/mixins/pager'

const UserType = {
  name: 'UserType',
  props: {
    value: Object
  },
  data () {
    return {
      data: {},
      quickTimeList: [
        {
          label: '30天',
          value: '30'
        },
        {
          label: '60天',
          value: '60'
        }
      ],
      useProject: [
        {
          label: '项目1',
          value: '项目1'
        }
      ]
    }
  },
  watch: {
    value: {
      handler (val) {
        this.data = val
      },
      immediate: true
    }
  },
  render (h) {
    return (
      <div style="width:100%">
        <div class="mb-10">
          <el-checkbox v-model={this.data.userCheck} on-change={this.changeUserChecked} style="width: 230px">
            个人账号
          </el-checkbox>
          <span class="ml-5 mr-10" style="color: #606266;">有效期至</span>
          <el-select v-model={this.data.quickTime} placeholder="请选择" style="width: 75px" on-change={this.changeUserChecked}>
            {
              this.quickTimeList.map(item => {
                return (
                  <el-option
                    key={item.value}
                    label={item.label}
                    value={item.value}>
                  </el-option>
                )
              })
            }

          </el-select>
          <el-date-picker
            on-change={this.changeUserChecked}
            style="width: calc(100% - 395px)"
            align="center"
            v-model={this.data.date}
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div>
          <el-checkbox v-model={this.data.projectCheck} on-change={this.changeUserChecked} style="width: 230px">
            项目生产账号<span style="opacity: 0.3">(有效期为长期)</span>
          </el-checkbox>
          <span class="ml-5 mr-10" style="color: #606266;">使用项目</span>
          <el-select v-model={this.data.useproject} placeholder="请选择" style="width: calc(100% - 320px)" on-change={this.changeUserChecked}>
            {
              this.useProject.map(item => {
                return (
                  <el-option
                    key={item.value}
                    label={item.label}
                    value={item.value}>
                  </el-option>
                )
              })
            }

          </el-select>
        </div>
      </div>
    )
  },
  methods: {
    changeUserChecked () {
      this.$emit('change', this.data)
    }
  }
}

export default {
  name: 'FunctionPower',
  mixins: [mixin, pager],
  components: {
    UserType
  },
  data () {
    return {
      fixed: false,
      showHome: true,
      activeName: '1',
      tabs: [
        {
          label: '已生效',
          value: '1',
          total: 14
        },
        {
          label: '已失效',
          value: '2',
          total: 17
        }
      ],
      filterData: [
        {
          label: '到期日期',
          id: '到期日期',
          options: [
            {
              id: '0',
              label: '七日内'
            },
            {
              id: '1',
              label: '七日后'
            }
          ]
        }
      ],
      loading: 0,
      tableData: [
        {
          name: 'ms_test',
          desc: 'ms_test',
          date: '2020-10-22',
          user: '个人账号',
          powerType: '改表数据，查表数据'
        },
        {
          name: 'ms_test',
          desc: 'ms_test',
          date: '2020-10-22',
          user: '个人账号',
          powerType: '改表数据，查表数据'
        },
        {
          name: 'ms_test',
          desc: 'ms_test',
          date: '2020-10-22',
          user: '个人账号',
          powerType: '改表数据，查表数据'
        },
        {
          name: 'ms_test',
          desc: 'ms_test',
          date: '2020-10-22',
          user: '个人账号',
          powerType: '改表数据，查表数据'
        },
        {
          name: 'ms_test',
          desc: 'ms_test',
          date: '2020-10-22',
          user: '个人账号',
          powerType: '改表数据，查表数据'
        },
        {
          name: 'ms_test',
          desc: 'ms_test',
          date: '2020-10-22',
          user: '个人账号',
          powerType: '改表数据，查表数据'
        },
        {
          name: 'ms_test',
          desc: 'ms_test',
          date: '2020-10-22',
          user: '个人账号',
          powerType: '改表数据，查表数据'
        }
      ],
      formLabelWidth: '120px',
      functionPowerVisible: false,
      functionPowerForm: {
        environment: '',
        project: '',
        realTimeFn: '',
        powerType: '',
        userType: {},
        applyReason: ''
      },
      functionPowerRules: {
        environment: [
          { required: true, message: '请选择环境', trigger: ['blur', 'change'] }
        ],
        project: [
          { required: true, message: '请选择项目', trigger: ['blur', 'change'] }
        ],
        realTimeFn: [
          { required: true, message: '请选择实时函数', trigger: ['blur', 'change'] }
        ],
        powerType: [
          { required: true, message: '请选择权限类型', trigger: ['blur', 'change'] }
        ],
        userType: [
          { required: true, message: '请选择账号类型', trigger: ['blur', 'change'] }
        ],
        applyReason: [
          { required: true, message: '请输入申请类型', trigger: ['blur', 'change'] }
        ]
      },
      environmentList: [
        {
          label: '生产环境',
          value: 'prod'
        },
        {
          label: '开发环境',
          value: 'dev'
        }
      ],
      projectList: [
        {
          label: '项目1',
          value: '项目1'
        }
      ],
      realTimeFnList: [
        {
          label: '实时函数1',
          value: '实时函数1'
        }
      ]
    }
  },
  created () {

  },
  methods: {
    getTableList () { },
    applyPowerHandle () { },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {

      })
    }
  }
}
</script>

<style lang="less" scoped>
.function-power {
  height: 100%;
  position: relative;
  background: #ebeaef;
  > div {
    overflow-y: overlay;
    height: 100%;
    padding: 10px 15px 56px 15px;
  }
}
</style>
