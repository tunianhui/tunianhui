<template>
  <section class="platform-manage-overview">
    <header class="flex-layout mb-20">
      <span>服务运维大盘</span>
    </header>
    <el-row :gutter="20" class="card-item">
      <el-col :span="6" v-for="(item, index) in overview" :key="index">
        <div class="chart-item" :style="{'border-left': `3px solid ${item.color}`}">
          <div class="left">
            <div class="value" :style="{color: item.color}">
              {{ item.count }}
            </div>
            <div class="label">{{ item.name }}</div>
          </div>
          <div class="right">
            <div class="chart-item">
              <el-progress type="circle" :percentage="Number(item.exception_rate)" :stroke-width="10" :color="item.color" :width="95"></el-progress>
            </div>
            <div class="text">
              <span>被调用数：{{ item.call_count }}</span>
              <span>失败数：{{ item.exception_count }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="tab-item">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="API调用趋势" name="first">
          <div class="chart-item">
            <LineChart :chartData="chartData1"></LineChart>
          </div>
        </el-tab-pane>
        <el-tab-pane label="函数调用趋势" name="second">
          <div class="chart-item">
            <LineChart :chartData="chartData2"></LineChart>
          </div>
        </el-tab-pane>
        <el-tab-pane label="服务编排调用趋势" name="third">
          <div class="chart-item">
            <LineChart :chartData="chartData3"></LineChart>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-row :gutter="20" class="table-item">
      <el-col :span="12">
        <div class="chart-item">
          <div class="header">
            <span>调用次数排名</span>
            <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchInput1" style="width: 200px; height: 28px">
            </el-input>
          </div>
          <el-table :data="tableData" class="chart-table">
            <el-table-column prop="api_id" label="API_ID"></el-table-column>
            <el-table-column prop="api_name" label="API名称"></el-table-column>
            <el-table-column prop="count" label="调用次数"> </el-table-column>
            <el-table-column prop="time" label="平均响应时间(ms)"> </el-table-column>
            <el-table-column label="设置">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="limitHandle(scope.row)">限流</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-item">
          <div class="header">
            <span>调用失败排行</span>
            <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchInput2" style="width: 200px; height: 28px">
            </el-input>
          </div>
          <el-table :data="tableData" class="chart-table">
            <el-table-column prop="api_id" label="API_ID"></el-table-column>
            <el-table-column prop="api_name" label="API名称"></el-table-column>
            <el-table-column prop="fail_count" label="失败数"> </el-table-column>
            <el-table-column prop="error_rate" label="错误率"> </el-table-column>
            <el-table-column label="设置">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="limitHandle(scope.row)">限流</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <LimitDialog v-if="visible" :data="curRow" @close="close"></LimitDialog>
  </section>
</template>
<script>
// import Pie from './pie'
import LineChart from './lineChart'
import LimitDialog from './limit'
import pager from '@/mixins/pager'

import { getInfo, getRunData } from '@/api/server/platform'

export default {
  name: 'platform-manage-overview',
  components: {
    // Pie
    LineChart,
    LimitDialog
  },
  mixins: [pager],
  data () {
    return {
      overview: [
        // {
        //   name: 'API总数',
        //   key: 'api',
        //   color: '#2d64f0',
        //   exception_rate: 20,
        //   call_count: 2,
        //   count: 23,
        //   exception_count: 2
        // },
        // {
        //   name: 'API注册总数',
        //   key: 'api_zc',
        //   color: '#64bc58',
        //   exception_rate: 30,
        //   call_count: 2,
        //   count: 23,
        //   exception_count: 3
        // },
        // {
        //   name: '函数总数',
        //   key: 'function',
        //   color: '#e2bb44',
        //   exception_rate: 40,
        //   call_count: 2,
        //   count: 23,
        //   exception_count: 4
        // },
        // {
        //   name: '服务编排总数',
        //   key: 'process',
        //   color: '#ec7b7a',
        //   exception_rate: 50,
        //   call_count: 2,
        //   count: 23,
        //   exception_count: 5
        // }
      ],
      activeName: 'first',
      chartData1: {},
      chartData2: {},
      chartData3: {},
      tableData: [
        {
          api_id: 'a',
          api_name: 'a',
          count: 'a',
          time: 'a'
        }
      ],
      searchInput1: '',
      searchInput2: '',
      visible: false,
      curRow: {}
    }
  },
  created () {
    this.getInfo()
    this.getRunData()
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    limitHandle (row) {
      this.visible = true
      this.curRow = row
    },
    close () {
      this.visible = false
    },
    async getInfo () {
      const params = {}
      const res = await getInfo(params)
      const { api, api_zc, function: func, process } = res.data
      this.$set(this.overview, 0, { name: 'API总数', color: '#2d64f0', ...api })
      this.$set(this.overview, 1, {
        name: 'API注册总数',
        color: '#64bc58',
        ...api_zc
      })
      this.$set(this.overview, 2, { name: '函数总数', color: '#e2bb44', ...func })
      this.$set(this.overview, 3, {
        name: '服务编排总数',
        color: '#ec7b7a',
        ...process
      })
    },
    async getRunData () {
      const params = {}
      const res = await getRunData(params)
      const { api, function: func, process } = res.data
      const callback = (item) => {
        for (const [key, value] of Object.entries(item)) {
          return {
            xAxisData: key,
            seriesData: Number(value)
          }
        }
      }
      this.chartData1 = ['xAxisData', 'seriesData'].reduce((acc, key) => {
        return {
          ...acc,
          ...{ [key]: api.map((item) => callback(item)).map((item) => item[key]) }
        }
      }, {})
      this.chartData2 = ['xAxisData', 'seriesData'].reduce((acc, key) => {
        return {
          ...acc,
          ...{
            [key]: func.map((item) => callback(item)).map((item) => item[key])
          }
        }
      }, {})
      this.chartData3 = ['xAxisData', 'seriesData'].reduce((acc, key) => {
        return {
          ...acc,
          ...{
            [key]: process.map((item) => callback(item)).map((item) => item[key])
          }
        }
      }, {})
    }
  }
}
</script>
<style lang="scss" scoped>
.platform-manage-overview {
  .card-item {
    .chart-item {
      height: 9.9vw; //190px
      background-color: #fff;
      display: flex;
      align-items: center;
      .left {
        margin: 0 3.13vw; //60px
        .value {
          font-size: 36px;
          font-family: Arial, Arial-BoldMT;
          font-weight: BoldMT;
          text-align: center;
          line-height: 32px;
        }
        .label {
          font-size: 22px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: center;
          color: #333333;
          line-height: 22px;
          margin-top: 10px;
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        align-items: center;
        .text {
          margin-top: 10px;
        }
      }
      .chart-item {
        width: 4.95vw; //95px
        height: 4.95vw; //95px
      }
    }
  }
  .tab-item {
    height: 16.04vw;
    background-color: #fff;
    margin-top: 20px;
    .chart-item {
      width: 100%;
      height: 12vw;
    }
  }
  .table-item {
    margin-top: 20px;
    height: 15.63vw; //300px
    .chart-item {
      height: 15.63vw; //300px
      background-color: #fff;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 3.23vw; // 62px
        padding: 0 5%;
        position: relative;
        font-size: 18px;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          background-color: #e4e7ed;
          z-index: 1;
        }
      }
      .chart-table {
        padding: 0 5%;
      }
    }
  }
  ::v-deep .el-tabs__item {
    font-size: 18px;
  }
  ::v-deep .el-tabs__item.is-active {
    font-size: 18px;
  }
  ::v-deep .el-tabs__nav {
    line-height: 60px;
  }
  ::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding: 0 20px;
  }
}
</style>
