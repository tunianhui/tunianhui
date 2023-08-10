<template>
  <section class="platform-manage-monitor">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="item in $route.matched.slice(2)" :key="item.name">{{item.meta.name}}</el-breadcrumb-item>
    </el-breadcrumb> -->
    <header class="flex-layout mb-20">
      <span>API监控</span>
    </header>
    <div class="title mb-10">
      <i class="circle mr-5"></i>
        {{title}}
        <el-button plain size="mini" type="primary" class="ml-10" v-if="!infoShow" @click="backHandle">返回</el-button>
    </div>
    <div v-if="infoShow">
      <el-card class="box-card mb-10">
        <div>
          <el-input
            v-model="input"
            placeholder="请输入API_ID或者API名称关键字搜索"
            @input="changeInputHandle"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </el-card>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="!!loading">
        <el-table-column
          prop="api_id"
          label="API_ID"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="api_name"
          label="API名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="project_api_count"
          label="授权应用数"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="response_avg"
          label="平均响应时长(ms)"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="call_count"
          label="调用次数"
          show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column
          prop="exception_rate"
          label="错误率"
          show-overflow-tooltip>
        </el-table-column> -->
        <!-- <el-table-column
          prop="address"
          label="offline百分比"
          show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column
          label="操作"
          width="130">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
            <el-button type="text" size="small" @click="limitHandle(scope.row)">限流</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="fr pt-10"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-size="pageFilters.pageSize"
        :page-sizes="pageSizes"
        :current-page.sync="pageFilters.pageNo"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
    <div v-if="!infoShow" class="line-chart-box">
      <el-row :gutter="10">
        <el-col :span="12" class="mb-10"><LineChart :data="call_count_data" prefix="调用次数"></LineChart></el-col>
        <!-- <el-col :span="12" class="mb-10"><LineChart :data="exception_rate_data" prefix="错误率"></LineChart></el-col> -->
        <!-- <el-col :span="12" class="mb-10"><LineChart :data="lineData" prefix="offline百分比"></LineChart></el-col> -->
        <el-col :span="12" class="mb-10"><LineChart :data="response_avg_data" prefix="平均响应时间 (ms)"></LineChart></el-col>
        <el-col :span="12" class="mb-10"><LineChart :data="project_api_count" prefix="授权应用数"></LineChart></el-col>
      </el-row>
    </div>
    <LimitDialog v-if="visible" :data="curRow" @close="close"></LimitDialog>
  </section>
</template>

<script>
import LineChart from './line-chart'
import LimitDialog from './limit'
import {
  getSerivceMonitorList,
  getExceptionRate
} from '@/api/server/server.js'
import pager from '@/mixins/pager'
export default {
  name: 'Monitor',
  components: {
    LineChart,
    LimitDialog
  },
  mixins: [pager],
  data() {
    return {
      loading: 0,
      title: 'API当天运行情况',
      input: '',
      infoShow: true,
      visible: false,
      tableData: [],
      lineData: [],
      curRow: {},
      call_count_data: [],
      exception_rate_data: [],
      project_api_count: [],
      response_avg_data: []
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    async getTableList() {
      this.loading++
      const params = {
        keyword: this.input,
        pageNo: this.pageFilters.pageNo,
        pageSize: this.pageFilters.pageSize
      }
      const res = await this.$simpleAsyncTo(getSerivceMonitorList(params), '监控列表获取失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    changeInputHandle(val) {
      this.input = val
      this.getTableList()
    },
    async handleClick(row) {
      this.infoShow = false
      this.title = `API-${row.api_name} 近1小时运行情况`
      const res = await this.$simpleAsyncTo(getExceptionRate({api_id: row.api_id}), '查看详情失败')
      if (res) {
        this.response_avg_data = res.data.response_avg_data
        this.call_count_data = res.data.call_count_data
        this.exception_rate_data = res.data.exception_rate_data
        this.project_api_count = res.data.project_api_count
      }
    },
    limitHandle(row) {
      this.visible = true
      this.curRow = row
    },
    backHandle() {
      this.infoShow = true
      this.title = `API当天运行情况`
      this.getTableList()
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.platform-manage-monitor {
  .title {
    display: flex;
    align-items: center;
    font-size: 14px;
    height: 28px;
    .circle {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: $editorLightSelectionBg;
    }
  }
  .box-card {
    box-shadow: none;
    border-radius: 0;
    border: none;
    .el-input {
      width: 280px;
      .el-input__inner {
        border-radius: 0;
        border: none;
        border-bottom: 1px solid $grey6;
      }
    }
  }
  .line-chart-box {
  }
}
</style>
