<template>
  <section class="api-grant">
    <div v-if="show==='home'">
      <header class="space-between mb-20">
        <span>API服务</span>
        <el-button type="primary" @click="applyApiHandle">申请API</el-button>
      </header>
      <el-card class="box-card mb-10 ">
        <el-form :inline="true" :model="formData" class="api-grant-form">
          <el-form-item label="请选择应用分组" class="mr-20">
            <el-select v-model="formData.app_group_id" placeholder="请选择应用分组" clearable @change="appGroupChange">
              <el-option :label="item.group_name" :value="item.id" v-for="item in appGroupList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="mr-20 input-name">
            <el-input v-model="formData.app_name" placeholder="请输入应用名称" @input="appNameChange">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <!-- <el-select v-model="formData.app_name" placeholder="请选择应用" clearable @change="appNameChange">
              <el-option :label="item.app_name" :value="item.app_name" v-for="item in appList" :key="item.app_id"></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="请选择API分组">
            <el-select v-model="formData.servunit_group_id" placeholder="请选择API分组" clearable @change="apiGroupChange">
              <el-option :label="item.group_name" :value="item.id" v-for="item in apiGroupList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="input-name">
            <el-input v-model="formData.api_name" placeholder="请输入API名称" @input="apiNameChange">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <el-table :data="tableData" v-loading="!!loading" style="width: 100%">
        <el-table-column prop="app_name" label="应用" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="api_id" label="API_ID" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="api_name" label="API名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="servunit_group_name" label="API所属分组" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="param_num" label="总参数个数" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sq_param_num" label="已授权参数个数" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sq_person" label="申请人" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="flag" label="申请状态" show-overflow-tooltip>
          <template slot-scope="scope">
            {{flag[scope.row.flag]}}
          </template>
        </el-table-column>
        <el-table-column prop="publish_info" label="发布信息">
          <template slot-scope="scope">
            <div>
              <OverflowTooltip class="width">负责人：{{scope.row.publish_person}}</OverflowTooltip>
              <OverflowTooltip class="width">发布时间：{{scope.row.publish_time}}</OverflowTooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editHandle(scope.row)" type="text" size="small" title="编辑">
              <i class="el-icon-edit-outline font-16"></i>
            </el-button>
            <el-button @click="seeHandle(scope.row)" type="text" size="small" title="调试">
              <i class="iconfont icon-qushi1 font-16"></i>
            </el-button>
            <el-button @click="delHandle(scope.row)" type="text" size="small" title="删除">
              <i class="el-icon-delete font-16"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="fr pt-10" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
    <ApiGrantDetail v-if="show==='detail'" :appGroupList="appGroupList" :apiGroupList="apiGroupList" :applyInfo="applyInfo" @cancel="cancel"></ApiGrantDetail>
    <div v-if="show==='debug'">
      <Debug :id="id" @cancel="cancel"></Debug>
    </div>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import { mapGetters } from 'vuex'
import pager from '@/mixins/pager'
import ApiGrantDetail from './detail'
import Debug from './debug'
import {
  getApiGroup,
  getAppGroup,
  getApiGrantList,
  delApiGrant,
  getApplyApiData
} from '@/api/server/server.js'
export default {
  name: 'ApiGrant',
  mixins: [pager],
  components: {
    ApiGrantDetail,
    Debug,
    OverflowTooltip
  },
  data () {
    return {
      formData: {
        app_group_id: '',
        servunit_group_id: '',
        api_name: '',
        app_name: ''
      },
      appList: [],
      appGroupList: [],
      apiGroupList: [],
      tableData: [],
      loading: 0,
      show: 'home',
      applyInfo: {},
      flag: {
        '0': '审批中',
        '1': '审批通过',
        '2': '审批不通过'
      },
      id: ''
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  watch: {
    $route: {
      immediate: true,
      handler (val) {
        if (JSON.stringify(val.params) === '{}') {
          this.show = 'home'
        } else {
          this.show = 'detail'
          this.applyInfo = val.params
        }
      }
    }
  },
  created () {
    this.getAppGroup()
    this.getGroupList()
    this.getTableList()
    // this.getAppList()
  },
  methods: {
    async getAppGroup () {
      const params = {}
      const res = await this.$simpleAsyncTo(getAppGroup(params), '获取应用分组列表失败')
      if (res) {
        this.appGroupList = res.data
      }
    },
    async getGroupList () {
      let params = {
        // project_id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(getApiGroup(params), '获取分组列表失败')
      if (res) {
        this.apiGroupList = res.data
      }
    },
    // async getAppList() {
    //   const params = {}
    //   const res = await this.$simpleAsyncTo(getAppList(params), '获取应用列表失败')
    //   if (res) {
    //     this.appList = res.data
    //   }
    // },
    // async getApiList() {
    //   const params = {
    //     pageSize: 1,
    //     pageNo: 999999,
    //     api_name: '',
    //     id: '',
    //     api_path: '',
    //     api_group: '',
    //     creator: '',
    //     project_id: this.project.project_id
    //   }
    //   const res = await this.$simpleAsyncTo(getApiList(params), '获取api列表失败')
    //   if (res) {
    //     this.apiList = res.data
    //   }
    // },
    async getTableList () {
      this.loading++
      const params = {
        ...this.formData,
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo
      }
      const res = await this.$simpleAsyncTo(getApiGrantList(params), '获取申请列表失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    appGroupChange (val) {
      this.pageFilters.pageNo = 1
      this.formData.app_group_id = val
      this.getTableList()
    },
    apiGroupChange (val) {
      this.pageFilters.pageNo = 1
      this.formData.servunit_group_id = val
      this.getTableList()
    },
    apiNameChange (val) {
      this.pageFilters.pageNo = 1
      this.formData.api_name = val
      this.getTableList()
    },
    appNameChange (val) {
      this.pageFilters.pageNo = 1
      this.formData.app_name = val
      this.getTableList()
    },
    delHandle (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async _ => {
        const res = await this.$simpleAsyncTo(delApiGrant({ id: row.id }), '删除失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.pageFilters.pageNo = 1
          this.formData.app_group_id = ''
          this.formData.servunit_group_id = ''
          this.formData.api_name = ''
          this.formData.app_name = ''
          this.getTableList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    editHandle (row) {
      this.getApplyApiData(row.id)
    },
    applyApiHandle () {
      this.show = 'detail'
      this.applyInfo = {}
    },
    cancel (data) {
      this.show = data
      this.formData.app_group_id = ''
      this.formData.servunit_group_id = ''
      this.formData.api_name = ''
      this.formData.app_name = ''
      this.getTableList()
    },
    async getApplyApiData (id) {
      const params = { id }
      const res = await this.$simpleAsyncTo(getApplyApiData(params), '获取申请数据失败')
      if (res) {
        this.show = 'detail'
        this.applyInfo = res.data
      }
    },
    seeHandle (row) {
      this.show = 'debug'
      this.id = row.id
    }
  }
}
</script>

<style lang="scss">
.api-grant {
  .box-card {
    box-shadow: none;
    border-radius: 0;
    border: none;
    .el-card__body {
      padding: 20px 20px 0;
      box-sizing: 0;
      .api-grant-form {
        .el-form-item {
          margin-right: 20px;
          .el-input {
            width: 230px;
          }
        }
        .input-name {
          .el-input {
            width: 280px;
            .el-input__inner {
              border-radius: 0;
              border: none;
              border-bottom: 1px solid $grey6;
            }
          }
        }
      }
    }
  }
  .width {
    width: calc(100% - 10px);
  }
}

</style>
