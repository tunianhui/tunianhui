<template>
  <section class="dev-api-server api-server-detail" v-if="show==='apiHome'">
    <header class="space-between mb-20">
      <span>API服务</span>
      <el-button type="primary" @click="createApi">生成API</el-button>
    </header>
    <el-card class="box-card">
      <div slot="header" class="serach flex-layout">
        <div>
          <el-input placeholder="请输入内容" v-model="keyword" class="input-with-select" @keyup.enter.native="searchClickHandle">
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="API名称" value="1"></el-option>
              <el-option label="API分组" value="2"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="searchClickHandle"></el-button>
          </el-input>
        </div>
      </div>
      <div class="">
        <el-table :data="tableData" style="width: 100%" v-loading="!!loading">
          <el-table-column prop="id" label="API ID">
            <template slot-scope="scope">
              <a href="javascript:;">
                <OverflowTooltip class="width" @click.native.prevent="editApiHandle(scope.row)">{{scope.row.id}}</OverflowTooltip>
              </a>
            </template>
          </el-table-column>
          <el-table-column label="API名称/API path">
            <template slot-scope="scope">
              <div class="name">
                <OverflowTooltip class="width">{{scope.row.api_name}}</OverflowTooltip>
              </div>
              <div class="path">
                <OverflowTooltip class="width">{{scope.row.api_path}}</OverflowTooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="api_group_name" label="分组">
          </el-table-column>
          <el-table-column prop="source_name" label="数据源名称">
            <template slot-scope="scope">
              <OverflowTooltip class="width">{{scope.row.source_name}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="api_type" label="API类型">
          </el-table-column>
          <el-table-column prop="creator" label="负责人">
          </el-table-column>
          <el-table-column label="发布人/发布状态">
            <template slot-scope="scope">
              <div class="name">
                <OverflowTooltip class="width">{{scope.row.publish_person}}</OverflowTooltip>
              </div>
              <div class="path">
                <OverflowTooltip>{{scope.row.status==='0'?'未发布':'已发布'}}</OverflowTooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="update_time" label="最后发布时间">
            <template slot-scope="scope">
              <OverflowTooltip class="width">{{scope.row.update_time}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click.native.prevent="testClickHandle(scope.row)" type="text" size="small">
                测试
              </el-button>
              <el-button @click.native.prevent="releaseOfflineRow(scope.row)" type="text" size="small">
                {{scope.row.status==='0'?'上线':'下线'}}
              </el-button>
              <el-button @click.native.prevent="detailRow(scope.row)" type="text" size="small" class="mr-10">
                详情
              </el-button>
              <SimpleConfirm @confirm="handleDeleteDatasource(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination class="fr pt-10" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>
    </el-card>
    <div :class="['api-detail', {'active': detailShow}]" ref="detail">
      <div class="toggle" @click="detailShow=false" v-if="detailShow"><i class="el-icon-d-arrow-right"></i></div>
      <el-tabs tab-position="right" style="height: 200px;">
        <el-tab-pane label="属性">
          <ApiAttr :rowData="rowData" :flag="flag"></ApiAttr>
        </el-tab-pane>
        <el-tab-pane label="请求参数">
          <RequestParams :whereList="whereList" :flag="flag"></RequestParams>
        </el-tab-pane>
        <el-tab-pane label="返回参数">
          <Return :selectList="selectList" :flag="flag"></Return>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>

  <section v-else>
    <ApiTest :rowData="rowDataTest" @toBackHandle="toBackHandle"></ApiTest>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import { getApiList, getDelApi, getOffline, getRelease } from '@/api/server/server.js'
import pager from '@/mixins/pager'
import ApiAttr from './detail/attr'
import RequestParams from './detail/request-params'
import ApiTest from './test'
import Return from './detail/return'
import { mapGetters } from 'vuex'
export default {
  name: 'Create', // DevAPIServer
  components: {
    OverflowTooltip,
    ApiAttr,
    RequestParams,
    Return,
    ApiTest
  },
  mixins: [pager],
  computed: {
    ...mapGetters(['project'])
  },
  data () {
    return {
      keyword: '',
      flag: '',
      select: '1',
      tableData: [],
      loading: 0,
      detailShow: false,
      rowData: {},
      name: '',
      group: '',
      whereList: [],
      selectList: [],
      show: 'apiHome',
      rowDataTest: {}
    }
  },
  created () {
    if (this.project.project_id) {
      this.getTableList()
    }
  },
  methods: {
    async getTableList () {
      this.loading++
      const params = {
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo,
        api_name: this.name,
        id: '',
        api_path: '',
        api_group: this.group,
        creator: '',
        project_id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(getApiList(params), '获取列表失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    releaseOfflineRow (row) {
      let statusText, func
      if (row.status === '0') {
        statusText = '上线'
        func = getRelease
      } else {
        statusText = '下线'
        func = getOffline
      }
      this.$confirm(`此操作将 ${statusText} 该API, 请谨慎操作, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = { id: row.id }
        this.globalLoading()
        const res = await this.$simpleAsyncTo(func(params), '下线失败')
        if (res) {
          this.$message({
            type: 'success',
            message: `${statusText}成功!`
          })
        }
        this.keyword = ''
        this.getTableList()
        this.globalLoading().close()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${statusText}`
        })
      })
    },
    searchClickHandle () {
      if (this.select === '1') {
        this.name = this.keyword
        this.group = ''
      } else {
        this.group = this.keyword
        this.name = ''
      }
      this.getTableList()
    },
    detailRow (row) {
      this.detailShow = true
      this.rowData = row
      this.whereList = row.where
      this.selectList = row.select
      this.flag = 'detail'
    },
    async handleDeleteDatasource (row) {
      const params = { id: row.id }
      const res = await this.$simpleAsyncTo(getDelApi(params), '删除失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.keyword = ''
        this.getTableList()
      }
    },
    editApiHandle (row) {
      if (row.status === '1') {
        return this.$message({
          type: 'waring',
          message: '该API已上线，请下线后修改'
        })
      } else {
        this.$router.push({ path: '/server/api-dev/create', query: row })
      }
    },
    testClickHandle (row) {
      // this.$router.push({
      //   name: 'api-test',
      //   query: {
      //     id: row.id,
      //     api_name: row.api_name,
      //     api_request_type: row.api_request_type,
      //     api_reponse_type: row.api_reponse_type,
      //     sql_template: row.sql_template,
      //     where: row.where
      //   }
      // })
      this.show = 'test'
      this.rowDataTest = row
    },
    toBackHandle (data) {
      this.show = data
      this.keyword = ''
    },
    createApi () {
      if (!this.project.project_id) {
        return this.$message({
          type: 'warning',
          message: '请选择项目'
        })
      }
      this.$router.push({ path: '/server/api-dev/create', query: {} })
    }
  }
}
</script>

<style lang="scss">
.dev-api-server {
  header {
    justify-content: space-between;
  }
  $height: calc(100% - 150px);
  .box-card {
    .serach {
      justify-content: space-between;
      .el-input-group__prepend {
        width: 25%;
      }
    }
    .name {
      color: $grey2;
    }
  }
  .el-table .cell {
    .width {
      width: calc(100% - 20px);
    }
  }
}
.api-server-detail {
  .api-detail {
    position: fixed;
    display: flex;
    justify-content: space-between;
    z-index: 99;
    width: 0;
    background: $grey6;
    height: calc(100% - 150px);
    top: calc(108px);
    right: 0;
    transition: $transition;
    box-shadow: 0 2px 12px $grey4;
    &.active {
      width: 60%;
    }
    &.active-create {
      width: 30px;
      height: 100%;
      top: 50px;
      &.width {
        width: 60%;
      }
    }
    .el-tabs {
      height: 100% !important;
      width: 100%;
      .el-tabs__header {
        background: $editorDarkBg;
        width: 30px;
        margin-left: 0;
        // width: 30px;
        .el-tabs__item {
          font-size: 12px;
          white-space: normal;
          word-break: break-all;
          vertical-align: middle;
          height: auto;
          line-height: normal;
          width: 30px;
          text-align: center;
          padding: 20px 10px 20px 10px;
          box-sizing: border-box;
          color: $grey5;
          background: transparent;
          &.is-active {
            background: $headerBg;
          }
        }
        .el-tabs__nav-wrap {
          margin-left: 0 !important;
        }
      }
      .el-tabs__content {
        overflow-y: auto;
        height: calc(100% - 80px);
      }
      .el-tabs__nav-wrap::after {
        height: 0;
      }
      .el-tabs__active-bar {
        height: 0 !important;
      }
    }
    .toggle {
      position: absolute;
      top: 50%;
      left: -30px;
      width: 30px;
      margin-top: -80px;
      line-height: 40px;
      text-align: center;
      background: $grey6;
      cursor: pointer;
      font-size: 16px;
      white-space: normal;
      word-break: break-all;
      vertical-align: middle;
      &::before,
      &::after {
        left: 0;
        position: absolute;
        content: '';
        width: 0px;
        height: 0px;
      }
      &::before {
        top: -30px;
        border-left: 15px solid transparent;
        border-top: 15px solid transparent;
        border-bottom: 15px solid $grey6;
        border-right: 15px solid $grey6;
      }
      &::after {
        bottom: -30px;
        border-left: 15px solid transparent;
        border-top: 15px solid $grey6;
        border-bottom: 15px solid transparent;
        border-right: 15px solid $grey6;
      }
    }
  }
}
</style>
