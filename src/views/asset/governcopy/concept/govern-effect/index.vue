<template>
  <section class="govern-effect" v-loading="!!loading">
    <CardTabs title="治理效果">
      <template slot="right">
        <el-date-picker v-model="date" type="date" value-format="YYYY-MM-dd" placeholder="选择日期"></el-date-picker>
      </template>
      <div class="flex-layout">
        <div class="card flex-1 mr-10">
          <div class="card-title">治理项详情</div>
          <div class="flex-layout">
            <div class="flex-1 mr-10">
              <SmallCard :data="rateInfo"></SmallCard>
            </div>
            <div class="flex-1">
              <SmallCard :data="governInfo"></SmallCard>
            </div>
          </div>
        </div>
        <div class="card flex-1">
          <div class="card-title">资源节约量</div>
          <div class="flex-layout">
            <div class="flex-1 mr-10">
              <SmallCard :data="cumputeInfo"></SmallCard>
            </div>
            <div class="flex-1">
              <SmallCard :data="storeInfo"></SmallCard>
            </div>
          </div>
        </div>
      </div>
    </CardTabs>
    <CardTabs class="card" title="趋势分析" headBorder :tabs="tabs" v-model="activeTab" @tab-click="tabClick">
      <template slot="right">
        <el-date-picker v-model="trendDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="_getTrendData"></el-date-picker>
      </template>
      <LineChart :data="lineData" :prefix="lineLegendPrefix"></LineChart>
    </CardTabs>

    <CardTabs class="card" title="项目治理明细">
      <div class="flex-layout" slot="right">
        <el-input placeholder="请输入" prefix-icon="el-icon-search" v-model="keyword"></el-input>
        <!-- <el-button class="ml-10" icon="iconfont icon-filter" @click></el-button> -->
      </div>
      <el-table ref="multipleTable" :data="projectData">
        <el-table-column label="项目名称" prop="project_name">
          <template slot-scope="scope">
            <div class="project-name-td">
              <i class="iconfont icon-project"></i>
              <span>{{scope.row.project_name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="业务板块" prop="business_field_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="负责人" prop="loader" show-overflow-tooltip></el-table-column>
        <el-table-column label="计算量" sortable prop="compute_count" show-overflow-tooltip>
          <template slot-scope="scope">
            <Compute :value="scope.row.compute_count"></Compute>
          </template>
        </el-table-column>
        <el-table-column label="计算分" sortable prop="compute_score"></el-table-column>
        <el-table-column label="计算优化量" sortable prop="compute_optimize_count">
          <template slot-scope="scope">
            <Compute :value="scope.row.compute_optimize_count"></Compute>
          </template>
        </el-table-column>
        <el-table-column label="存储量" sortable prop="store_count">
          <template slot-scope="scope">
            <Byte :value="scope.row.store_count"></Byte>
          </template>
        </el-table-column>
        <el-table-column label="存储分" sortable prop="store_score"></el-table-column>
        <el-table-column label="存储优化量" sortable prop="store_optimize_count">
          <template slot-scope="scope">
            <Byte :value="scope.row.store_optimize_count"></Byte>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="iconfont icon-qushi1 font-16 mr-10" @click="showTrend(scope.row)"></el-button>
            <el-button type="text" class="iconfont icon-bar font-16" @click="showRank(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </CardTabs>

    <Trend :visible.sync="visibleTrend" :data="activeRow"></Trend>
    <Rank :visible.sync="visibleRank" :data="activeRow"></Rank>
  </section>
</template>

<script>
import CardTabs from '@c/card-tabs'
import {
  dateFormat,
  getByteUnit,
  getComputeUnit,
  insertSeparator,
  convertByte,
  convertCompute
} from '@/libs/util'
import { getProjectData, getInfo, getTrendList } from '@/api/govern/govern-effect'
import rateUrl from '@/assets/images/govern/rate.png'
import governUrl from '@/assets/images/govern/govern.png'
import computeUrl from '@/assets/images/govern/compute.png'
import storeUrl from '@/assets/images/govern/store.png'
import Byte from '@c/byte'
import Compute from '@c/compute'
import LineChart from './line-chart'
import Rank from './rank'
import Trend from './trend'

const SmallCard = {
  props: {
    data: Object
  },
  render () {
    const { src, title, label, value1, value2, unit } = this.data
    return (
      <div
        class="small-card flex-layout"
        style="align-items: center; background: #fff; padding: 10px 15px;"
      >
        <img src={src} width="50px" height="50px" />
        <div class="flex-1 ml-20">
          <p class="label font-14">{title}</p>
          <p>
            <strong class="font-24">{value1}</strong>
            <span class="unit">{unit}</span>
          </p>
          <p>
            <span class="label font-12">{label}：</span>
            <span>{value2}</span>
          </p>
        </div>
      </div>
    )
  }
}

export default {
  name: 'GovernEffect',
  components: {
    CardTabs,
    SmallCard,
    Byte,
    Compute,
    LineChart,
    Rank,
    Trend
  },
  data () {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    return {
      date: new Date(),
      tabs: [
        { label: '存储', key: 'store' },
        { label: '计算', key: 'compute' }
      ],
      activeTab: 'store',
      trendDate: [start, end],
      lineData: [],
      projectData: [],
      loading: 0,
      rateInfo: Object.create(null),
      governInfo: Object.create(null),
      cumputeInfo: Object.create(null),
      storeInfo: Object.create(null),
      keyword: '',
      activeRow: Object.create(null),
      visibleTrend: false,
      visibleRank: false
    }
  },
  computed: {
    lineLegendPrefix () {
      return this.tabs.find(tab => this.activeTab === tab.key).label
    }
  },
  created () {
    this._getInfo()
    this._getProjectData()
    this._getTrendData()
  },
  methods: {
    async _getInfo () {
      this.loading++
      const res = await this.$simpleAsyncTo(getInfo(), '获取数据失败')
      if (res) {
        const {
          rate,
          governCount,
          disposeCount,
          governRate,
          computeCount,
          computeRate,
          storeCount,
          storeRate
        } = res.data

        this.rateInfo = {
          src: rateUrl,
          title: '处理率',
          label: '治理项',
          value1: rate,
          value2: insertSeparator(governCount)
        }
        this.governInfo = {
          src: governUrl,
          title: '已处理治理项',
          label: '周增长',
          value1: insertSeparator(disposeCount),
          value2: governRate
        }
        this.cumputeInfo = {
          src: computeUrl,
          title: '计算',
          label: '周增长',
          value1: parseFloat(convertCompute(computeCount)),
          unit: getComputeUnit(computeCount),
          value2: computeRate
        }
        this.storeInfo = {
          src: storeUrl,
          title: '存储',
          label: '周增长',
          value1: parseFloat(convertByte(storeCount)),
          unit: getByteUnit(storeCount),
          value2: storeRate
        }
      }
      this.loading--
    },
    async _getTrendData () {
      this.loading++
      const [start, end] = this.trendDate
      const res = await this.$simpleAsyncTo(
        getTrendList({
          startDate: dateFormat(start),
          endDate: dateFormat(end)
        }),
        '获取数据失败'
      )
      if (res) {
        this.lineData = res.data
      }
      this.loading--
    },
    async _getProjectData () {
      this.loading++
      const res = await this.$simpleAsyncTo(getProjectData(), '获取数据失败')
      if (res) {
        this.projectData = res.data
      }
      this.loading--
    },
    tabClick (tab) {
      this._getTrendData()
    },
    showTrend (row) {
      this.activeRow = row
      this.visibleTrend = true
    },
    showRank (row) {
      this.activeRow = row
      this.visibleRank = true
    }
  }
}
</script>

<style lang="scss">
.govern-effect {
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
