<template>
  <section class="trend-content">
    <div class="trend-head">
      <div>规则应用趋势</div>
      <div class="trend-head-title font-12">
        日期选择：
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="quality-date"
          :clearable="false"
          @change="dateChangeHandle">
        </el-date-picker>
      </div>
    </div>
    <div class="trend-body">
      <div class="trend-">
        <div class="trend-left">
          <div class="font-12 tredn-title mb-10">今日日期：{{time}}</div>
          <div class="trend-item mb-20">
            <div class="tredn-title font-12">
              总{{trendText}}数
              <span class="ml-5">
                <el-tooltip class="item" effect="dark" content="离线物理数据源总数，不包含实时物理数据源" placement="top">
                  <i class="el-icon-info font-14" style="vertical-align: bottom;"></i>
                </el-tooltip>
              </span>
            </div>
            <div class="trend-item-value">{{Number(statistics.total) === 0 ? '暂无' : statistics.total}}</div>
            <div class="trend-bar">
              <div class="trend-bar-inner total" :style="{width: Number(statistics.total) > 0 ? `${statistics.total / statistics.total * 100}%` : '0'}"></div>
            </div>
          </div>
          <div class="trend-item mb-20">
            <div class="tredn-title font-12">
              应用规则{{trendText}}数
              <span class="ml-5">
                <el-tooltip class="item" effect="dark" content="离线物理数据源总数，不包含实时物理数据源" placement="top">
                  <i class="el-icon-info font-14" style="vertical-align: bottom;"></i>
                </el-tooltip>
              </span>
            </div>
            <div class="trend-item-value">{{Number(statistics.ruleCount) === 0 ? '暂无' : statistics.ruleCount}}</div>
            <div class="trend-bar">
              <div class="trend-bar-inner count" :style="{width: Number(statistics.total) > 0 ? `${statistics.ruleCount / statistics.total * 100}%` : '0'}"></div>
            </div>
          </div>
          <div class="trend-item">
            <div class="tredn-title font-12">
              应用强规则{{trendText}}数
              <span class="ml-5">
                <el-tooltip class="item" effect="dark" content="离线物理数据源总数，不包含实时物理数据源" placement="top">
                  <i class="el-icon-info font-14" style="vertical-align: bottom;"></i>
                </el-tooltip>
              </span>
            </div>
            <div class="trend-item-value">{{Number(statistics.ruleStrongCount) === 0 ? '暂无' : statistics.ruleStrongCount}}</div>
            <div class="trend-bar">
              <div class="trend-bar-inner strong" :style="{width: Number(statistics.total) > 0 ? `${statistics.ruleStrongCount / statistics.total * 100}%` : '0'}"></div>
            </div>
          </div>
        </div>
        <div class="trend-divider"></div>
        <div class="trend-right">
          <AreaChart :data="areaData" :fields="fields" :colors="[' #5CB4FC', ' #545F99', '#7DC995']"></AreaChart>
        </div>
      </div>
    </div>
    <div class="trend-head">
      <div>规则应用趋势</div>
      <div class="trend-head-title font-12">
        日期选择：
        <el-date-picker
          v-model="date1"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="quality-date"
          :clearable="false"
          @change="dateChangeHandle1">
        </el-date-picker>
      </div>
    </div>
    <div class="trend-body">
      <div class="error-trend-head">
        <div class="font-12 tredn-title mb-10">今日日期：{{time}}</div>
        <div class="font-12 tredn-title mb-10">规则类型：
          <el-radio v-model="radio" label="0">强规则</el-radio>
          <el-radio v-model="radio" label="1">弱规则</el-radio>
        </div>
      </div>
      <div class="error-trend-count-items">
        <div class="mr-30">
          <i class="iconfont icon-shishiluojibiao1 tredn-title font-14 icon-color1"></i>
          <span class="tredn-title font-12 mr-5 ml-5">应用{{radio === '0' ? '强' : '弱'}}规则数</span>
          <span>{{radio === '1' ? statistics.applyStrong : statistics.applyWeak}}</span>
        </div>
        <div>
          <i class="iconfont icon-jinggao tredn-title font-14 icon-color2"></i>
          <span class="tredn-title font-12 mr-5 ml-5">异常{{radio === '1' ? '强' : '弱'}}规则数</span>
          <span>{{radio === '1' ? statistics.abnormalStrong : statistics.abnormalWeak}}</span>
        </div>
      </div>
      <AreaChart :data="errorData" :fields="errorFields" :colors="['#5CB4FC', '#f33']"></AreaChart>
    </div>
  </section>
</template>

<script>
import {dateFormat} from '@/libs/util'
import AreaChart from './area-chart'
import { getAppTrendData } from '@/api/asset/quality'
import {
  queryApplicationSt,
  queryApplicationTableRuleTrend,
  queryApplicationRuleTrend
} from '@/api/asset/quality/overview'
export default {
  name: 'TrendContent',
  props: {
    type: String
  },
  components: {
    AreaChart
  },
  data() {
    return {
      trendText: '',
      time: dateFormat(new Date(), 'YYYY-MM-dd'),
      date: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
      date1: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
      statistics: {
        today: dateFormat(new Date(), 'YYYY-MM-dd'),
        total: 780,
        ruleCount: 100,
        ruleStrongCount: 10,
        applyStrong: 10,
        applyWeak: 10,
        abnormalStrong: 10,
        abnormalWeak: 10
      },
      fields: {},
      areaData: [],
      radio: '0',
      errorFields: {},
      errorData: []
    }
  },
  watch: {
    type: {
      immediate: true,
      handler(val) {
        this.initText(val)
      }
    },
    radio: {
      handler(val) {
        const fields = ['ruleCount', 'errorCount']
        let str = ''
        if (val === '0') {
          str = '强规则'
        } else {
          str = '弱规则'
        }
        this.errorFields = {
          fields,
          label: {
            ruleCount: `应用${str}数`,
            errorCount: `异常${str}数`
          }
        }
        if (this.type === 'table') {
          this._queryApplicationRuleTrend()
        } else {
          this._getAppErrorList()
        }
        
      }
    }
  },
  created() {},
  methods: {
    initText(val) {
      if (val === 'table') {
        this.trendText = '表'
      } else if (val === 'datasource') {
        this.trendText = '数据源'
      } else {
        this.trendText = '实时元表'
      }
      const fields = ['tableTotal', 'ruleCount', 'strong']
      this.fields = {
        fields,
        label: {
          tableTotal: `总${this.trendText}数`,
          ruleCount: `应用规则${this.trendText}数`,
          strong: `应用强规则${this.trendText}数`
        }
      }
      const eFields = ['ruleCount', 'errorCount']
      let str = ''
      if (this.radio === '0') {
        str = '强规则'
      } else {
        str = '弱规则'
      }
      this.errorFields = {
        fields: eFields,
        label: {
          ruleCount: `应用${str}数`,
          errorCount: `异常${str}数`
        }
      }
      if (val === 'table') {
        this._queryApplicationSt()
        this._queryApplicationTableRuleTrend()
        this._queryApplicationRuleTrend()
      } else {
        this._getAppTableData()
        this._getAppTableAreaList()
        this._getAppErrorList()
      }
    },
    async _queryApplicationSt() {
      const params = {
        stat_type: this.type
      }
      const res = await this.$simpleAsyncTo(queryApplicationSt(params), '获取数据失败')
      if (res) {
        this.statistics = {
          today: res.data.today,
          total: res.data.total_num,
          ruleCount: res.data.audit_num,
          ruleStrongCount: res.data.force_num,
          applyStrong: res.data.force_rule_num,
          applyWeak: res.data.weak_rule_num,
          abnormalStrong: res.data.force_non_rule_num,
          abnormalWeak: res.data.weak_non_rule_num
        }
      }
    },
    async _queryApplicationTableRuleTrend() {
      const params = {
        stat_type: this.type,
        start_time: dateFormat(this.date[0], 'YYYY-MM-dd'),
        end_time: dateFormat(this.date[1], 'YYYY-MM-dd')
      }
      const res = await this.$simpleAsyncTo(queryApplicationTableRuleTrend(params), '获取数据失败')
      if (res) {
        this.areaData = res.data.map(item => {
          return {
            tableTotal: item.total_num,
            ruleCount: item.audit_num,
            strong: item.force_num,
            date: item.create_date
          }
        })
      }
    },
    async _queryApplicationRuleTrend() {
      const params = {
        rule_level: this.radio,
        stat_type: this.type,
        start_time: dateFormat(this.date1[0], 'YYYY-MM-dd'),
        end_time: dateFormat(this.date1[1], 'YYYY-MM-dd')
      }
      const res = await this.$simpleAsyncTo(queryApplicationRuleTrend(params), '获取数据失败')
      if (res) {
        this.errorData = res.data.map(item => {
          return {
            ruleCount: item.rule_num,
            errorCount: item.non_rule_num,
            date: item.create_date
          }
        })
      }
    },
    dateChangeHandle() {
      if (this.type === 'table') {
        this._queryApplicationTableRuleTrend()
      } else {
        this._getAppTableAreaList()
      }
    },
    dateChangeHandle1() {
      if (this.type === 'table') {
        this._queryApplicationRuleTrend()
      } else {
        this._getAppErrorList()
      }
    },
    // 数据表
    async _getAppTableData() {
      const res = await this.$simpleAsyncTo(getAppTrendData({startDate: this.time, endDate: this.time}), '获取失败')
      if (res) {
        this.total = res.data[0].tableTotal
        this.ruleCount = res.data[0].ruleCount
        this.ruleStrongCount = res.data[0].strong
      }
    },
    async _getAppTableAreaList() {
      const params = {
        startDate: dateFormat(this.date[0], 'YYYY-MM-dd'),
        endDate: dateFormat(this.date[1], 'YYYY-MM-dd')
      }
      const res = await this.$simpleAsyncTo(getAppTrendData(params), '获取失败')
      if (res) {
        this.areaData = res.data
      }
    },
    async _getAppErrorList() {
      const params = {
        startDate: dateFormat(this.date[0], 'YYYY-MM-dd'),
        endDate: dateFormat(this.date[1], 'YYYY-MM-dd')
      }
      const res = await this.$simpleAsyncTo(getAppTrendData(params), '获取失败')
      if (res) {
        this.errorData = res.data
      }
    }
  }
}
</script>

<style lang="scss">
$total: #5CB4FC;
$count: #545F99;
$strong: #7DC995;
$error:  #f33;
.trend-content {
  .tredn-title {
    color: rgba($color: #000000, $alpha: .6);
  }
  .icon-color1 {
    color: $total;
  }
  .icon-color2 {
    color: $error;
  }
  .trend-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .trend-head-title {
      color: rgba($color: #000000, $alpha: .7);
    }
    .quality-date {
      border-radius: 0;
    }
  }
  .trend-body {
    margin: 12px 0;
    padding: 20px;
    background: $grey10;
    .trend- {
      display: flex;
      .trend-left {
        flex: 2;
        .trend-item {
          .trend-item-value {
            font-size: 16px;
            line-height: 24px;
          }
          .trend-bar {
            height: 10px;
            background: $grey7;
            margin-top: 7px;
            .trend-bar-inner {
              // width: 90%;
              height: 10px;
              &.total {
                background: $total;
              }
              &.count {
                background: $count;
              }
              &.strong {
                background: $strong;
              }
            }
          }
        }
      }
      .trend-divider {
        position: relative;
        top: -.06em;
        display: inline-block;
        width: 1px;
        margin: 0 8px;
        vertical-align: middle;
        margin: 0 16px;
        height: auto;
        background: #e8e8e8;
      }
      .trend-right {
        flex: 9;
      }
    }
    .error-trend-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .error-trend-count-items {
      display: flex;
      align-items: center;
    }
  }
}
</style>
