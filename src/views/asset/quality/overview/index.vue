<template>
  <section class="quality-overview">
    <header class="quality-header">
      <h1 class="quality-title">质量监控概况</h1>
      <div class="quality-extra">
        <span class="font-14 mr-20" style="color:rgba(0,0,0,.6)">今日日期：{{time}}</span>
        <el-select v-model="ownerName" placeholder="请选择" popper-class="quality-select" class="mr-5">
          <el-option
            v-for="item in ownerNameList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button
          icon="el-icon-refresh"
          type="primary"
          plain
        ></el-button>
      </div>
    </header>
    <el-row :gutter="10" class="overview-container">
      <el-col :span="6">
        <div>
          <div class="font-14" style="line-height:28px">总览</div>
          <div class="base">
            <div class="base-left">
              <div class="font-12">规则校验资产数</div>
              <div>{{indicatorsData.tableCount}}</div>
              <div class="font-12">较昨日：-100%</div>
            </div>
            <div class="base-right">
              <PieChart :data="pieChartData"></PieChart>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="quality-rule-error">
          <div class="rule-error-title font-14">异常规则</div>
          <div class="rule-error-index">
            <el-row :gutter="10">
              <el-col :span="8" v-for="item in statistics" :key="item.title">
                <div>
                  <ErrorCard :total="item"></ErrorCard>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-card class="rule-trend-card mt-10">
      <div class="rule-trend-main">
        <div class="info-title">详情</div>
        <el-tabs v-model="activeName" @tab-click="tabHandleClick">
          <el-tab-pane :label="item.label" :name="item.name" lazy v-for="item in tabs" :key="item.name">
            <TrendContent :type="activeName"></TrendContent>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </section>
</template>

<script>
import {dateFormat} from '@/libs/util'
// import OverflowTooltip from '@c/overflow-tooltip'
import PieChart from './pie-chart'
import ErrorCard from './error-card'
import { getIndicatorsData } from '@/api/asset/quality'
import {
  queryAlarmRuleSt,
  queryApplicationSt
} from '@/api/asset/quality/overview'
import TrendContent from './trend-content'
export default {
  name: 'QualityOverview',
  components: {
    // OverflowTooltip
    PieChart,
    ErrorCard,
    TrendContent
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
      statistics: [
        {title: '数据表异常数', value: 0, type: '', strong: 0, weak: 0, key: 'table'},
        {title: '数据源异常数', value: 0, type: '', strong: 0, weak: 0, key: 'datasource'},
        {title: '实时元素异常数', value: 0, type: '', strong: 0, weak: 0, key: 'realtime'}
      ],
      tabs: [{
        label: '数据表',
        name: 'table'
      },
      {
        label: '数据源',
        name: 'datasource'
      },
      {
        label: '实时元素',
        name: 'realtime'
      }],
      ownerName: '',
      ownerNameList: [],
      indicatorsData: {},
      pieChartData: [],
      activeName: 'table',
      trendText: '表'
    }
  },
  created() {
    this.date = new Date()
    this.date.setTime(this.date.getTime() - 3600 * 1000 * 24 * 7)
    this._getIndicatorsData()
    this._queryAlarmRuleSt()
    this._queryApplicationSt()
  },
  methods: {
    async _getIndicatorsData() {
      const res = await this.$simpleAsyncTo(getIndicatorsData(), '获取数据失败')
      if (res) {
        this.indicatorsData = res.data
        this.pieChartData = [{type: '数据表', value: this.indicatorsData.tableCount}]
      }
    },
    tabHandleClick(val) {
      if (val.name === 'table') {
        this.trendText = '表'
      } else if (val.name === 'datasource') {
        this.trendText = '数据源'
      } else {
        this.trendText = '实时元表'
      }
    },
    async _queryAlarmRuleSt() {
      const res = await this.$simpleAsyncTo(queryAlarmRuleSt(), '获取数据失败')
      if (res) {
        this.statistics.forEach(item => {
          if (item.key === 'table') {
            item.value = res.data.table_alarm_count
            item.type = res.data.tableDayRingRatio
          }
        })
      }
    },
    async _queryApplicationSt() {
      const params = {
        stat_type: this.activeName
      }
      const res = await this.$simpleAsyncTo(queryApplicationSt(params), '获取数据失败')
      if (res) {
        this.statistics.forEach(item => {
          if (item.key === 'table') {
            item.strong = res.data.force_non_rule_num
            item.weak = res.data.weak_non_rule_num
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.quality-overview {
  $padding: 8px 20px;
  $noPadingTop: 0 20px 20px 20px;
  $height: 28px;
  padding: 0 20px;
  height: 100%;
  overflow-y: auto;
  .head-wrapper {
    display: flex;
    align-items: center;
    .head-wrapper-title {
      font-size: 12px;
      font-weight: 400;
      color: rgba(0,0,0,.5);
      line-height: $height;
    }
  }
  .quality-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 20px 0 12px;
    .quality-title {
      font-size: 16px;
      font-weight: 500;
    }
    .quality-extra {
      .el-input__inner {
        border-radius: 0;
      }
      .el-button {
        border-radius: 0;
        border-color: $grey6;
        background-color: $grey10;
        color: $grey5;
        padding: 7px 10px;
        &:hover {
          border-color: $grey6;
          background-color: rgba($grey10, 1);
        }
      }
    }
  }
  .overview-container {
    height: 175px;
    >.el-col {
      height: 100%;
      &:first-child {
        >div {
          &:first-child {
            height: 100%;
            padding: $padding;
          }
        }
      }
      >div {
        background-color: $grey9;
      }
      .base {
        display: flex;
        .base-left {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          flex: 1;
          div:first-child {
            color: rgba($grey3, .7);
          }
          div:nth-child(2) {
            font-size: 22px;
          }
        }
        .base-right {
          width: 120px;
          height: 120px;
        }
      }
      .quality-rule-error {
        height: 100%;
        .rule-error-title {
          padding: $padding;
        }
        .rule-error-index {
          padding: $noPadingTop;
          >.el-row {
            >.el-col {
              >div {
                background-color: $grey10;
              }
            }
          }
        }
      }
    }
  }
  .rule-trend-card {
    border-radius: 0;
    box-shadow: none;
    border: none;
    background: $grey9;
    .el-card__body {
      padding-top: 0;
    }
    .rule-trend-main {
      position: relative;
      .info-title {
        position: absolute;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
      }
      .el-tabs__nav-scroll {
        margin-left: 60px;
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
    }
  }
}
.quality-select {
  &.el-popper {
    margin-top: 0;
  }
  &.el-select-dropdown {
    border-radius: 0;
    // box-shadow: none;
  }
  .popper__arrow {
    border-width: 0;
    &::after {
      border-width: 0;
    }
  }
}
</style>
