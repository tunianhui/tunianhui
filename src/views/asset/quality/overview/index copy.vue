<template>
  <section class="quality-overview">
    <header class="quality-header">
      <h1 class="quality-title">质量监控概况</h1>
      <div class="quality-extra my-btn">
        <span class="font-14 mr-20">今日如期：{{time}}</span>
        <el-button
          icon="el-icon-refresh"
          type="primary"
          plain
          @click="handleRefresh"
        ></el-button>
      </div>
    </header>
    <Indicators></Indicators>
    <div class="mt-10">
      <el-card class="quality-card">
        <div slot="header" class="clearfix quality-card-title">
          <span class="font-16">数据表规则应用趋势</span>
        </div>
        <div class="quality-card-body">
          <div>
            <div class="card-chart-title">今日日期：{{time}}</div>
            <BarChart :data="appTrendData" :fields = "{'actual': '应用规则表数','strong': '应用强规则表数'}"></BarChart>
          </div>
          <div></div>
          <div>
            <div class="card-chart-title mb-10">
              日期选择：
              <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                class="quality-date"
                :clearable="false">
              </el-date-picker>
            </div>
            <AreaChart :data="appTrendBarData" :fields = "{'actual': '应用规则表数','strong': '应用强规则表数'}"></AreaChart>
          </div>
        </div>
      </el-card>
    </div>
    <div class="mt-10">
      <el-card class="quality-card">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="强规则异常趋势" name="strong" lazy>
            <div slot="header" class="clearfix quality-card-title">
              <span class="font-16">数据表规则应用趋势</span>
            </div>
            <div class="quality-card-body">
              <div>
                <div class="card-chart-title">今日日期：{{time}}</div>
                <BarChart :data="strongTrendData" :fields = "{'actual': '应用强规则数','strong': '异常强规则数'}"></BarChart>
              </div>
              <div></div>
              <div>
                <div class="card-chart-title mb-10">
                  日期选择：
                  <el-date-picker
                    v-model="date"
                    type="daterange"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    class="quality-date"
                    :clearable="false">
                  </el-date-picker>
                </div>
                <AreaChart :data="weakTrendBarData" :fields = "{'actual': '应用强规则数','strong': '异常强规则数'}"></AreaChart>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="弱规则异常趋势" name="weak" lazy>
            <div slot="header" class="clearfix quality-card-title">
              <span class="font-16">数据表规则应用趋势</span>
            </div>
            <div class="quality-card-body">
              <div>
                <div class="card-chart-title">今日日期：{{time}}</div>
                <BarChart :data="weakTrendData" :fields = "{'actual': '应用弱规则数','strong': '异常弱规则数'}"></BarChart>
              </div>
              <div></div>
              <div>
                <div class="card-chart-title mb-10">
                  日期选择：
                  <el-date-picker
                    v-model="date"
                    type="daterange"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    class="quality-date"
                    :clearable="false">
                  </el-date-picker>
                </div>
                <AreaChart :data="weakTrendBarData" :fields = "{'actual': '应用弱规则数','strong': '异常弱规则数'}"></AreaChart>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </section>
</template>

<script>
import {dateFormat} from '@/libs/util'
import Indicators from './indicators'
import BarChart from './bar-chart'
import AreaChart from './area-chart'
import { getAppTrendData, getWeakTrendData, getStrongTrendData, getAppTrendBarData, getWeakTrendBarData } from '@/api/asset/quality'
// import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'QualityOverview',
  components: {
    // OverflowTooltip
    Indicators,
    BarChart,
    AreaChart
  },
  data() {
    return {
      time: dateFormat(new Date(), 'YYYY-MM-dd'),
      date: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      appTrendData: [],
      weakTrendData: [],
      strongTrendData: [],
      appTrendBarData: [],
      weakTrendBarData: [],
      activeName: 'strong'
    }
  },
  created() {
    this._getAppTrendData()
    this._getWeakTrendData()
    this._getStrongTrendData()
    this._getAppTrendBarData()
    this._getWeakTrendBarData()
  },
  methods: {
    handleRefresh() {},
    async _getAppTrendData() {
      const res = await this.$simpleAsyncTo(getAppTrendData({startDate: this.time, endDate: this.time}), '获取失败')
      if (res) {
        this.appTrendData = res.data
      }
    },
    async _getWeakTrendData() {
      const res = await this.$simpleAsyncTo(getWeakTrendData({startDate: this.time, endDate: this.time}), '获取失败')
      if (res) {
        this.weakTrendData = res.data
      }
    },
    async _getStrongTrendData() {
      const res = await this.$simpleAsyncTo(getStrongTrendData({startDate: this.time, endDate: this.time}), '获取失败')
      if (res) {
        this.strongTrendData = res.data
      }
    },
    async _getAppTrendBarData() {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      const res = await this.$simpleAsyncTo(getAppTrendBarData({startDate: dateFormat(date, 'YYYY-MM-dd'), endDate: this.time}), '获取失败')
      if (res) {
        this.appTrendBarData = res.data
      }
    },
    async _getWeakTrendBarData() {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      const res = await this.$simpleAsyncTo(getWeakTrendBarData({startDate: dateFormat(date, 'YYYY-MM-dd'), endDate: this.time}), '获取失败')
      if (res) {
        this.weakTrendBarData = res.data
      }
    },
    handleTabClick(tab) {}
  }
}
</script>

<style lang="scss">
.quality-overview {
  .quality-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 10px 0 12px;
    .quality-title {
      font-size: 18px;
      font-weight: 500;
    }
  }
  .quality-card {
    box-shadow: none;
    background-color: $grey8;
    border-radius: 0;
    .el-card__header {
      border: none;
      padding-bottom: 0;
      .quality-card-title {
        line-height: 28px;
      }
    }
    .el-card__body {
      padding-top: 0;
      .quality-card-body {
        display: flex;
        .quality-date {
          border-radius: 0;
          height: 32px;
        }
        .card-chart-title {
          height: 32px;
          display: flex;
          align-items: center;
          font-size: 13px;
        }
        >div:first-child {
          flex: 2;
        }
        >div:nth-child(2) {
          margin: 0 16px;
          height: auto;
          width: 1px;
          background-color: $grey7;
        }
        >div:last-child {
          flex: 5;
        }
      }
    }
  }
}
</style>
