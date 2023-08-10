<template>
  <section class="govern-effect" v-loading="!!loading">
    <CardTabs title="治理效果">
      <template slot="right">
        <el-date-picker v-model="date" type="date"  placeholder="选择日期" @change="dateChange"></el-date-picker>
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
          <div class="card-title">资源优化量</div>
          <div class="flex-layout">
            <div class="flex-1 mr-10">
              <SmallCard :data="storeInfo"></SmallCard>
            </div>
            <div class="flex-1">
              <SmallCard :data="cumputeInfo"></SmallCard>
            </div>
          </div>
        </div>
      </div>
    </CardTabs>
    <CardTabs class="card" title="趋势分析" headBorder :tabs="tabs" v-model="activeTab" @tab-click="tabClick">
      <template slot="right">
        <el-date-picker v-model="trendDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getStoandComGoverTrend"></el-date-picker>
      </template>
      <LineChart :data="lineData" :prefix="lineLegendPrefix"></LineChart>
    </CardTabs>

    <CardTabs class="card" title="项目治理明细">
      <div class="flex-layout" slot="right">
        <el-input placeholder="请输入项目名称" prefix-icon="el-icon-search" v-model="keyword" @change="_getProjectDetail" clearable></el-input>
        <!-- <el-button class="ml-10" icon="iconfont icon-filter" @click></el-button> -->
      </div>
      <el-table v-loading="loading" fit border  ref="multipleTable" :data="projectData">
        <template slot="empty">
            <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
            <img src="@/assets/images/nodata.png" alt="">
            <p>暂无数据</p>
        </template>
        <el-table-column label="项目名称" prop="projectName" min-width="190">
          <template slot-scope="scope">
            <div class="project-name-td">
              <i class="iconfont icon-project"></i>
              <span>{{scope.row.projectName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="负责人" prop="createdBy" show-overflow-tooltip></el-table-column>
        <el-table-column label="存储量(G)" sortable prop="stoTotalByte" min-width="100">
          <!-- <template slot-scope="scope">
            <Byte :value="scope.row.stoTotalByte"></Byte>
          </template> -->
        </el-table-column>
        <el-table-column label="存储分" sortable prop="stoTotalPoint" min-width="85"></el-table-column>
        <el-table-column label="存储优化量(G)" sortable prop="dealByte" min-width="130">
          <!-- <template slot-scope="scope">
            <Byte :value="scope.row.dealByte"></Byte>
          </template> -->
        </el-table-column>
        <el-table-column label="计算量(CU)" sortable prop="comTotalTaskCost"  min-width="115" show-overflow-tooltip>
          <!-- <template slot-scope="scope">
            <Compute :value="scope.row.comTotalTaskCost"></Compute>
          </template> -->
        </el-table-column>
        <el-table-column label="计算分" sortable prop="comTotalPoint" min-width="85"></el-table-column>
        <el-table-column label="计算优化量(CU)" min-width="135px"  sortable prop="comDealCost">
          <!-- <template slot-scope="scope">
            <Compute :value="scope.row.comDealCost"></Compute>
          </template> -->
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button type="text" class="iconfont icon-qushi1 font-16 mr-10" @click="showTrend(scope.row)"></el-button>
            <!-- <el-button type="text" class="iconfont icon-bar font-16" @click="showRank(scope.row)"></el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      class="fr pt-10 pb-10"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNo"
      :page-sizes="[15, 25, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total">
      </el-pagination>
    </CardTabs>

    <Trend :visible.sync="visibleTrend" :data="activeRow" ></Trend>
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
import {getGoverDetail, getStoandComGoverTrend} from '@/api/govern/govern-effect'
import { getProjectDetail } from '@/api/govern/govern-analyze'
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
      visibleRank: false,
      pageSize: 15,
      pageNo: 1,
      total: 0,
    }
  },
  computed: {
    lineLegendPrefix () {
      return this.tabs.find(tab => this.activeTab === tab.key).label
    }
  },
  created () {
    // this._getInfo()
    // this._getProjectData()
    // this._getTrendData()
    this._getGoverDetail()
    this.getStoandComGoverTrend()
    this._getProjectDetail()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this._getProjectDetail()
    },
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
      // this._getTrendData()
    },
    showTrend (row) {
      this.activeRow = row
      this.visibleTrend = true
    },
    showRank (row) {
      this.activeRow = row
      this.visibleRank = true
    },


    dateChange() {
      this._getGoverDetail()
      this._getProjectDetail()
    },

    //治理项详情和资源节约查询接口
    async _getGoverDetail() {
      this.loading++
      const res = await this.$simpleAsyncTo(getGoverDetail({day: dateFormat(this.date)}), '获取治理项详情和资源节约查询数据失败')
      if (res) {
        if (res.data) {
          const {dealRate, totalNum, dealNum, weekRate, comWeekRate, stoSave, stoWeekRate, comSave, comUnit, stoUnit} = res.data
          this.rateInfo = {
            src: rateUrl,
            title: '处理率',
            label: '治理项',
            value1: dealRate,
            value2: totalNum
            // value2: insertSeparator(governCount)
          }
          this.governInfo = {
            src: governUrl,
            title: '已处理治理项',
            label: '周增长',
            value1: dealNum,
            value2: weekRate > 0 ? weekRate + '%' : weekRate,
            // value1: insertSeparator(disposeCount),
            // value2: governRate
          }
          this.cumputeInfo = {
            src: computeUrl,
            title: '计算',
            label: '周增长',
            value1: comSave,
            unit: comUnit ,
            // value1: parseFloat(convertCompute(comSave)),
            // unit: getComputeUnit(comSave),
            value2: comWeekRate > 0 ? comWeekRate + '%' : comWeekRate,
            // value1: parseFloat(convertCompute(computeCount)),
            // unit: getComputeUnit(computeCount),
            // value2: computeRate
          }
          this.storeInfo = {
            src: storeUrl,
            title: '存储',
            label: '周增长',
            value1: stoSave,
            unit: stoUnit,
            // value1: parseFloat(convertByte(stoSave)),
            // unit: getByteUnit(stoSave),
            value2: stoWeekRate > 0 ? stoWeekRate + '%' : stoWeekRate,
            // value1: parseFloat(convertByte(storeCount)),
            // unit: getByteUnit(storeCount),
            // value2: storeRate
          }
        } else {
          this.rateInfo = {
            src: rateUrl,
            title: '处理率',
            label: '治理项',
            value1: '',
            value2: ''
          }
          this.governInfo = {
            src: governUrl,
            title: '已处理治理项',
            label: '周增长',
            value1: '',
            value2: '',
          }
          this.cumputeInfo = {
            src: computeUrl,
            title: '计算',
            label: '周增长',
            value1: '',
            value2: '',
          }
          this.storeInfo = {
            src: storeUrl,
            title: '存储',
            label: '周增长',
            value1: '',
            value2: '',
          }
        }
      }
      this.loading--
    },
    //治理效果趋势查询接口
    async getStoandComGoverTrend() {
      const [start, end] = this.trendDate
      const param = {
        startDay: dateFormat(start),
        endDay: dateFormat(end)
      }
      const res = await this.$simpleAsyncTo(getStoandComGoverTrend(param), '获取治理效果数据失败')
      if (res) {
        this.lineData = res.data
        console.log(this.lineData, '一一一一一一一')
      }
    },
    //项目治理明细
    async _getProjectDetail() {
      const param = {
        deployName: this.keyword,
        day: dateFormat(this.date),
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      const res = await this.$simpleAsyncTo(getProjectDetail(param), '获取项目治理明细列表失败')
      if (res) {
        this.projectData = res.data ? res.data.totalList : []
        this.total = res.data ? res.data.total : 0
      }
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
