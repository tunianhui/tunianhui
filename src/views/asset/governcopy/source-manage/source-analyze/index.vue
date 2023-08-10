<template>
  <section class="govern-source-analyze" v-loading="!!loading">
    <div class="head">
      <div class="head-left">资源分析报告</div>
      <div class="head-right">
        <el-date-picker v-model="date" type="date" value-format="YYYY-MM-dd" placeholder="选择日期"></el-date-picker>
      </div>
    </div>
    <div class="card">
      <div class="steps flex-layout">
        <div class="step-item flex-1">
          <div class="step-item-title">来源</div>
          <div class="step-item-body">
            <StepItemCard title="业务来源表数" :count="overview.source"></StepItemCard>
          </div>
        </div>
        <i class="step-icon iconfont icon-jiantou"></i>
        <div class="step-item flex-4">
          <div class="step-item-title">现有资源</div>
          <div class="step-item-body step-center flex-layout">
            <StepItemCard class="flex-1" title="总任务数" :count="overview.task"></StepItemCard>
            <StepItemCard class="flex-1" title="总表数" :count="overview.table"></StepItemCard>
            <StepItemCard class="flex-1" title="项目数" :count="overview.project"></StepItemCard>
            <StepItemCard class="flex-1" title="开发者数" :count="overview.developer"></StepItemCard>
          </div>
        </div>
        <i class="step-icon iconfont icon-jiantou"></i>
        <div class="step-item flex-1">
          <div class="step-item-title">去向</div>

          <div class="step-item-body">
            <StepItemCard title="数据回流表" :count="overview.reflowTable"></StepItemCard>
          </div>
        </div>
      </div>
    </div>
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="card">
          <div class="card-title">计算</div>
          <div class="chart-main">
            <div class="chart">
              <RingChart :data="computeRing" :activeColor="computeColor"></RingChart>
            </div>
            <div class="chart-content flex-1">
              <div class="chart-content-left flex-1">
                <AnalyzeInfo title="计算健康分" :value="computeInfo.score">
                  <template slot="foot">
                    <i :class="computeInfo.icon"></i>
                    {{computeInfo.desc}}
                  </template>
                </AnalyzeInfo>
              </div>
              <div class="chart-content-right flex-1">
                <AnalyzeInfo :unit="computeInfo.unit" :value="computeInfo.consume">
                  <template slot="head">
                    计算消耗
                    <i class="el-icon-info"></i>
                  </template>
                  <template slot="foot">
                    环比：
                    <span>{{computeInfo.radio}}</span>
                    <i :class="`iconfont ${computeInfo.rise ? 'icon-rise' : 'icon-decline'} ${computeInfo.rise ? 'success' : 'error'}  font-18`"></i>
                  </template>
                </AnalyzeInfo>
              </div>
            </div>
          </div>
          <el-row :gutter="10" class="mt-10">
            <el-col :span="12">
              <div class="table">
                <div class="table-title">重点关注项目</div>
                <el-table :data="computeEmphasis" height="260">
                  <el-table-column label="项目" prop="projectName" show-overflow-tooltip></el-table-column>
                  <el-table-column label="负责人" prop="leader" show-overflow-tooltip></el-table-column>
                  <el-table-column label="健康分" prop="score"></el-table-column>
                </el-table>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="table">
                <div class="table-title">待提升管理个人</div>
                <el-table :data="computeManager" height="260">
                  <el-table-column label="负责人" prop="leader" show-overflow-tooltip></el-table-column>
                  <el-table-column label="计算" prop="consume" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <Compute :value="scope.row.consume"></Compute>
                    </template>
                  </el-table-column>
                  <el-table-column label="健康分" prop="score"></el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card">
          <div class="card-title">存储</div>
          <div class="chart-main">
            <div class="chart">
              <RingChart :data="storeRing" :activeColor="storeColor"></RingChart>
            </div>
            <div class="chart-content flex-1">
              <div class="chart-content-left flex-1">
                <AnalyzeInfo title="存储健康分" :value="storeInfo.score">
                  <template slot="foot">
                    <i :class="storeInfo.icon"></i>
                    {{storeInfo.desc}}
                  </template>
                </AnalyzeInfo>
              </div>
              <div class="chart-content-right flex-1">
                <AnalyzeInfo :unit="storeInfo.unit" :value="storeInfo.consume">
                  <template slot="head">
                    存储消耗
                    <i class="el-icon-info"></i>
                  </template>
                  <template slot="foot">
                    环比：
                    <span>{{storeInfo.radio}}</span>
                    <i :class="`iconfont ${computeInfo.rise ? 'icon-rise' : 'icon-decline'} ${storeInfo.rise ? 'success' : 'error'} font-18`"></i>
                  </template>
                </AnalyzeInfo>
              </div>
            </div>
          </div>
          <el-row :gutter="10" class="mt-10">
            <el-col :span="12">
              <div class="table">
                <div class="table-title">重点关注项目</div>
                <el-table :data="storeEmphasis" height="260">
                  <el-table-column label="项目" prop="projectName" show-overflow-tooltip></el-table-column>
                  <el-table-column label="负责人" prop="leader" show-overflow-tooltip></el-table-column>
                  <el-table-column label="健康分" prop="score"></el-table-column>
                </el-table>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="table">
                <div class="table-title">待提升管理个人</div>
                <el-table :data="storeManager" height="260">
                  <el-table-column label="负责人" prop="leader" show-overflow-tooltip></el-table-column>
                  <el-table-column label="存储" prop="consume" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <Byte :value="scope.row.consume"></Byte>
                    </template>
                  </el-table-column>
                  <el-table-column label="健康分" prop="score"></el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <CardTabs class="card mb-10" headBorder title="趋势分析" v-model="activeTrendTab" :tabs="trendTabs" @tab-click="tabClick">
      <template slot="right">
        <el-date-picker v-model="trendDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getTrendData"></el-date-picker>
      </template>
      <LineChart :data="lineData" :prefix="lineLegendPrefix"></LineChart>
    </CardTabs>

    <CardTabs class="card" title="项目分析">
      <div class="flex-layout" slot="right">
        <el-input placeholder="请输入" prefix-icon="el-icon-search" v-model="keyword"></el-input>
        <!-- <el-button class="ml-10" icon="iconfont icon-filter" @click></el-button> -->
      </div>
      <el-table :data="projectData" border>
        <el-table-column label="项目名称" prop="project_name">
          <template slot-scope="scope">
            <div class="project-name-td">
              <i class="iconfont icon-project"></i>
              <span>{{scope.row.project_name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="业务板块" prop="business_field_name" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="任务数" sortable prop="task_count" align="center"></el-table-column>
        <el-table-column label="表数量" sortable prop="table_count"></el-table-column>
        <el-table-column label="计算量" sortable prop="compute_count">
          <template slot-scope="scope">
            <Compute :value="scope.row.compute_count"></Compute>
          </template>
        </el-table-column>
        <el-table-column label="存储量" sortable prop="store_count">
          <template slot-scope="scope">
            <Byte :value="scope.row.store_count"></Byte>
          </template>
        </el-table-column>
        <el-table-column label="计算分" sortable prop="compute_score"></el-table-column>
      </el-table>
    </CardTabs>
  </section>
</template>

<script>
import {
  getOverview,
  getComputeInfo,
  getStoreInfo,
  getComputeList,
  getStoreList,
  getComputeTrend,
  getStoreTrend,
  getProjectAnalyzeData
} from '@/api/govern/source-analyze'
import LineChart from './line-chart'
import RingChart from './ring-chart'
import CardTabs from '@c/card-tabs'
// import {dateFormat} from '@/libs/util'
import {
  dateFormat,
  getByteUnit,
  getComputeUnit,
  insertSeparator,
  convertByte,
  convertCompute,
  getLevel
} from '@/libs/util'

import Byte from '@c/byte'
import Compute from '@c/compute'

const StepItemCard = {
  props: {
    title: String,
    count: Number
  },
  render (h) {
    return (
      <div class="step-item-card">
        <div class="step-item-card-title">
          <span>{this.title}</span>
          <i class="el-icon-info ml-5"></i>
        </div>
        <div class="step-item-card-body">
          {insertSeparator(this.count) || 0}
        </div>
      </div>
    )
  }
}

const AnalyzeInfo = {
  props: {
    title: String,
    value: Number,
    desc: String,
    unit: {
      type: String,
      default: '分'
    }
  },
  computed: {
    icon () {
      return ''
    }
  },
  render () {
    return (
      <div class="chart-info">
        <div class="chart-info-head">{this.$slots.head || this.title}</div>
        <div class="chart-info-body">
          <div class="mt-10 mb-10">
            <strong>{this.value}</strong>&nbsp;
            <span class="unit">{this.unit}</span>
          </div>
          <div>{this.$slots.foot}</div>
        </div>
      </div>
    )
  }
}

export default {
  name: 'GovernSourceAnalyze',
  components: {
    AnalyzeInfo,
    RingChart,
    LineChart,
    StepItemCard,
    CardTabs,
    Byte,
    Compute
  },
  data () {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    return {
      loading: 0,
      date: dateFormat(new Date()),
      overview: Object.create(null),
      computeRing: {
        title: '健康等级',
        level: '',
        value: ''
      },
      storeRing: {
        title: '健康等级',
        level: '',
        value: ''
      },
      computeInfo: Object.create(null),
      storeInfo: Object.create(null),
      computeEmphasis: [],
      computeManager: [],
      computeColor: '',
      storeEmphasis: [],
      storeManager: [],
      computeTrend: [],
      storeTrend: [],
      storeColor: '',
      trendTabs: [
        { label: '存储', key: 'store' },
        { label: '计算', key: 'compute' }
      ],
      activeTrendTab: 'store',
      trendDate: [start, end],
      lineData: [],
      keyword: '',
      projectData: []
    }
  },
  computed: {
    lineLegendPrefix () {
      return this.trendTabs.find(tab => this.activeTrendTab === tab.key).label
    }
  },
  created () {
    this._getOverview()
    this._getComputeInfo()
    this._getStoreInfo()
    this._getComputeList()
    this._getStoreList()
    this._getComputeTrend()
    this._getStoreTrend()
    this._getProjectData()
  },
  mounted () { },
  destroyed () { },
  methods: {
    tabClick (tab) {
      this.activeTrendTab = tab.key
      this.getTrendData()
    },
    getTrendData () {
      this.activeTrendTab === 'score'
        ? this._getStoreTrend()
        : this._getComputeTrend()
    },
    async _getOverview () {
      this.loading++
      const res = await this.$simpleAsyncTo(getOverview(), '获取概览失败')
      if (res) {
        this.overview = res.data
      }
      this.loading--
    },
    async _getComputeInfo () {
      this.loading++
      const res = await this.$simpleAsyncTo(
        getComputeInfo(),
        '获取计算信息失败'
      )
      if (res) {
        const { score, consume, radio, rise } = res.data
        const { level, desc, icon, color } = getLevel(score)

        this.computeRing = {
          level,
          title: '健康等级',
          value: score
        }

        this.computeInfo = {
          score,
          consume: parseFloat(convertCompute(consume)),
          desc,
          icon,
          radio,
          rise,
          unit: getComputeUnit(consume)
        }

        this.computeColor = color
      }
      this.loading--
    },
    async _getComputeList () {
      this.loading++
      const res = await this.$simpleAsyncTo(
        getComputeList(),
        '获取计算列表失败'
      )
      if (res) {
        const { emphasis, manager } = res.data
        this.computeEmphasis = emphasis
        this.computeManager = manager
      }
      this.loading--
    },
    async _getStoreInfo () {
      this.loading++
      const res = await this.$simpleAsyncTo(getStoreInfo(), '获取计算信息失败')
      if (res) {
        const { score, consume, radio, rise } = res.data
        const { level, desc, icon, color } = getLevel(score)
        this.storeRing = {
          level,
          title: '健康等级',
          value: score
        }

        this.storeInfo = {
          score,
          consume: parseFloat(convertByte(consume)),
          unit: getByteUnit(consume),
          desc,
          icon,
          radio,
          rise
        }
        this.storeColor = color
      }
      this.loading--
    },
    async _getStoreList () {
      this.loading++
      const res = await this.$simpleAsyncTo(getStoreList(), '获取计算列表失败')
      if (res) {
        const { emphasis, manager } = res.data
        this.storeEmphasis = emphasis
        this.storeManager = manager
      }
      this.loading--
    },
    async _getComputeTrend () {
      this.loading++

      const [startDate, endDate] = this.trendDate
      const res = await this.$simpleAsyncTo(
        getComputeTrend({
          startDate: dateFormat(startDate),
          endDate: dateFormat(endDate)
        }),
        '获取计算列表失败'
      )
      if (res) {
        this.lineData = res.data
      }
      this.loading--
    },
    async _getStoreTrend () {
      this.loading++
      const [startDate, endDate] = this.trendDate
      const res = await this.$simpleAsyncTo(
        getStoreTrend({
          startDate: dateFormat(startDate),
          endDate: dateFormat(endDate)
        }),
        '获取计算列表失败'
      )
      if (res) {
        this.lineData = res.data
      }
      this.loading--
    },
    async _getProjectData () {
      this.loading++
      const res = await this.$simpleAsyncTo(
        getProjectAnalyzeData(),
        '获取项目分析数据失败'
      )
      if (res) {
        this.projectData = res.data
      }
      this.loading--
    }
  }
}
</script>

<style lang="scss" scoped>
.govern-source-analyze {
  .head {
    &-left {
      font-size: 16px;
    }
  }

  .steps {
    .step-item {
      &-title {
        color: $grey4;
        margin-bottom: 8px;
      }

      .step-item-card {
        padding: 15px 25px;
        background: $grey10;

        ::v-deep .step-item-card-title {
          /* color: $grey4; */
          i {
            color: $grey4;

            &:hover {
              cursor: pointer;
              color: $grey2;
            }
          }
        }

        ::v-deep .step-item-card-body {
          font-size: 24px;
          font-weight: bold;
        }
      }

      .step-center {
        .step-item-card:not(:last-child) {
          position: relative;
          &::after {
            content: '';
            position: absolute;
            right: 0;
            top: 25%;
            width: 1px;
            height: 50%;
            background-color: $grey6;
          }
        }
      }
    }
    .step-icon {
      margin-top: 62px;
      color: lighten($--color-primary, 10%);
      font-size: 20px;
      padding: 0 5px;
    }
  }

  .chart {
    min-width: 120px;
    width: 18%;
    display: flex;
    justify-content: center;
    margin-right: 10px;
  }

  .chart-main {
    display: flex;
    align-items: center;
    background-color: $grey10;

    .g2-chart-ring {
      width: 100px;
      height: 100px;
    }

    .chart-content {
      display: flex;
      align-items: center;
      height: 140px;
    }
    .chart-content-left {
      margin-right: 5%;
      ::v-deep .chart-info-body {
        border-right: 1px solid $grey7;
      }
    }
  }

  .table {
    padding: 10px;
    background-color: $grey10;
    &-title {
      margin-bottom: 10px;
    }
  }

  .chart-info {
    font-size: 12px;
    color: $grey2;
    ::v-deep strong {
      font-size: 24px;
    }
    ::v-deep .iconfont {
      font-size: 16px;
    }
  }

  .trend {
    &-head {
      /* padding-bottom: 6px; */
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid $grey6;
      margin-bottom: 10px;

      &-left {
        display: flex;

        height: 32px;
        line-height: 32px;
      }
    }

    &-tabs {
      display: flex;
      font-size: 12px;
      margin-left: 15px;
      margin-top: 2px;

      li {
        padding: 0 4px;
        color: $grey3;
        margin-right: 30px;
        position: relative;
        cursor: pointer;

        &::before {
          content: '';
          display: block;
          width: 0;
          height: 2px;
          background: $--color-primary;
          position: absolute;
          bottom: 0;
          left: 50%;
          transition: $transition;
        }

        &.is-active {
          color: $grey1;
          &::before {
            width: 100%;
            left: 0;
          }
        }
      }
    }
  }
  .project-analyze-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .project-name-td {
    display: flex;
    align-items: center;
    height: 30px;
    .iconfont {
      color: #68b6b0;
      font-size: 28px;
      margin-right: 8px;
    }
  }
}

</style>
