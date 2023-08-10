<template>
  <section class="govern-source-analyze" v-loading="!!loading">
    <div class="head">
      <div class="head-left">资源分析报告</div>
      <div class="head-right">
        <el-date-picker placement="bottom-start" v-model="date" type="date"  placeholder="选择日期" @change="getImportProjectAndPerson(), _getGlobalMessage(), _getTotalHealthScore(), getProjectDetail()"></el-date-picker>
      </div>
    </div>
    <div class="card">
      <div class="grid-content">
        <div class="left">
            <img :src="srcpng" width="60px" height="60px" alt />
            <div>
              <p>队列个数</p>
              <strong>{{ globalMessage.queueNum }}</strong>
            </div>
        </div>
        <div class="center">
          <img :src="srcpng2" width="60px" height="60px" alt />
          <div>
              <p>项目个数</p>
              <strong>{{ globalMessage.projectNum }}</strong>
            </div>
        </div>
        <div class="center-right">
              <img :src="srcpng3" width="60px" height="60px" alt />
              <div>
                <p>表数</p>
                <strong>{{ globalMessage.tableNum }}</strong>
              </div>
        </div>
        <div class="right">
          <img :src="srcpng4" width="60px" height="60px" alt />
          <div>
              <p>开发者数</p>
              <strong>{{ globalMessage.projectMenNum }}</strong>
          </div>
        </div>
        <!-- <div class="grid-left">
          <div class="left">
            <img :src="srcpng" width="60px" height="60px" alt />
            <div>
              <p>队列个数</p>
              <strong>{{ globalMessage.queueNum }}</strong>
            </div>
        </div>
        <div class="center">
          <img :src="srcpng2" width="60px" height="60px" alt />
          <div>
              <p>项目个数</p>
              <strong>{{ globalMessage.projectNum }}</strong>
            </div>
        </div>
        </div>
        <div class="grid-right">
          <div class="center-right">
              <img :src="srcpng3" width="60px" height="60px" alt />
              <div>
                <p>表数</p>
                <strong>{{ globalMessage.tableNum }}</strong>
              </div>
        </div>
        <div class="right">
          <img :src="srcpng4" width="60px" height="60px" alt />
          <div>
              <p>开发者数</p>
              <strong>{{ globalMessage.projectMenNum }}</strong>
          </div>
        </div>
        </div> -->
        
      </div>
      <!-- <div class="grid-content">
        <div v-for="(item, index) in globalMessage" :key="item.title" :class="['flex-1 detail-card', index < 2 && 'mr-10']">
              <img :src="item.src" width="40px" height="40px" alt />
              <div>
                <p>{{item.title}}</p>
                <p>
                  <strong>{{item.score}}</strong>
                </p>
              </div>
            </div>
      </div> -->
      <!-- <div class="grid-content">
        <div class="left">
            <img :src="srcpng" width="60px" height="60px" alt />
            <el-form :model="globalMessage">
              <el-form-item v-for="(value, key) in computeResources" :key="key" :label="value">
                <div>{{ globalMessage[key]  }}</div>
              </el-form-item>
            </el-form>
        </div>
        <div class="center">
          <img :src="srcpng2" width="60px" height="60px" alt />
          <el-form :model="globalMessage">
            <el-form-item v-for="(value, key) in computeResources1" :key="key" :label="value">
              <div>{{ globalMessage[key]  }}</div>
            </el-form-item>
          </el-form>
        </div>
        <div class="center-right">
              <img :src="srcpng3" width="60px" height="60px" alt />
              <el-form :model="globalMessage">
                <el-form-item v-for="(value, key) in storeResources" :key="key" :label="value">
                <strong>{{ globalMessage[key] }}</strong>
              </el-form-item>
              </el-form>
        </div>
        <div class="right">
          <img :src="srcpng4" width="60px" height="60px" alt />
          <el-form :model="globalMessage">
            <el-form-item v-for="(value, key) in storeResources1" :key="key" :label="value">
            <div>{{ globalMessage[key] }}</div>
          </el-form-item>
          </el-form>
        </div>
      </div> -->
          <!-- <div class="grid-content">
  
          </div> -->
      <!-- <div class="steps flex-layout">
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
      </div> -->
    </div>
    <el-row :gutter="10">
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
                    <el-tooltip class="item" effect="dark" placement="top-start">
                    <div class="batch-info-content" slot="content">
                      待治理的存储对象所消耗的资源总和。
                    </div>
                    <i class="el-icon-info"></i>
                    </el-tooltip>
                  </template>
                  <template slot="foot">
                    环比：
                    <span>{{storeInfo.radio}}</span>
                    <i :class="`iconfont ${storeInfo.rise ? 'icon-rise' : 'icon-decline'} ${storeInfo.rise ? 'success' : 'error'} font-18`"></i>
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
                  <template slot="empty">
                      <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
                      <img width="80%" src="@/assets/images/nodata.png" alt="">
                      <p>暂无数据</p>
                  </template>
                  <el-table-column label="项目" prop="projectName" show-overflow-tooltip></el-table-column>
                  <el-table-column label="负责人" prop="createdBy" show-overflow-tooltip></el-table-column>
                  <el-table-column label="健康分" prop="stoTotalPoint" show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="table">
                <div class="table-title">待提升管理个人</div>
                <el-table :data="storeManager" height="260">
                  <template slot="empty">
                      <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
                      <img width="80%" src="@/assets/images/nodata.png" alt="">
                      <p>暂无数据</p>
                  </template>
                  <el-table-column label="负责人" prop="goverName" show-overflow-tooltip></el-table-column>
                  <el-table-column label="存储消耗(G)" prop="goverByte" min-width="87px" show-overflow-tooltip>
                    <!-- <template slot-scope="scope">
                      <Byte :value="scope.row.consume"></Byte>
                    </template> -->
                  </el-table-column>
                  <el-table-column label="健康分" prop="score" show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
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
                    <el-tooltip class="item" effect="dark" placement="top-start">
                    <div class="batch-info-content" slot="content">
                      待治理的yarn任务所消耗的资源总和，其计算口径为CM/CU/KCU。其中： 60core*s = 1CM , 24*60CM = 1CU , 1000CU = 1KCU 。
                    </div>
                    <i class="el-icon-info"></i>
                    </el-tooltip>
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
                  <template slot="empty">
                    <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
                    <img width="80%" src="@/assets/images/nodata.png" alt="">
                    <p>暂无数据</p>
                </template>
                  <el-table-column label="项目" prop="projectName" show-overflow-tooltip></el-table-column>
                  <el-table-column label="负责人" prop="createdBy" show-overflow-tooltip></el-table-column>
                  <el-table-column label="健康分" prop="comTotalPoint" show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="table">
                <div class="table-title">待提升管理个人</div>
                <el-table :data="computeManager" height="260">
                  <template slot="empty">
                      <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
                      <img width="80%" src="@/assets/images/nodata.png" alt="">
                      <p>暂无数据</p>
                  </template>
                  <el-table-column label="负责人" prop="goverName" show-overflow-tooltip></el-table-column>
                  <el-table-column label="计算消耗(CU)" prop="goverCom" min-width="95px">
                    <!-- <template slot-scope="scope">
                      <Compute :value="scope.row.goverByte"></Compute>
                    </template> -->
                  </el-table-column>
                  <el-table-column label="健康分" prop="score" show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <TabsCard class="card mb-10" headBorder title="趋势分析" v-model="activeTrendTab" :tabs="trendTabs" @tab-click="tabClick" @comm-click="commandclick">
      <template slot="right">
        <el-select v-if="scList.includes(command)" placeholder="请选择时间范围" v-model="timeRange" @change="selectTime">
          <el-option v-for="item in dictList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-date-picker placement="bottom-start" v-model="trendDate" type="daterange" range-separator="至" v-if="visibleTime"
        start-placeholder="开始日期" end-placeholder="结束日期" @change="getTrendData"></el-date-picker>
        <el-date-picker class="pickTime" v-if="visibleTime2" :clearable="false" @change="pickerChange" v-model="trendDate1"  
        type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </template>
      <LineChart v-if="command === 'store' || command === 'compute' " :data="lineData" :prefix="lineLegendPrefix"></LineChart>
      <HdfsChart v-if="command === 'storageSapacity'" :data="hdfsClusterList" style="width: 100%; height: 250px;"></HdfsChart>
      <YarnChart v-if="command === 'cpu'" :data="yarnTrendList" style="width: 100%; height: 250px;"></YarnChart>
      <YarnMChart v-if="command === 'internalStorage'" :data="yarnTrendList" style="width: 100%; height: 250px;"></YarnMChart>
      <!-- <LineChart v-if="visibleLine" :data="lineData" :prefix="lineLegendPrefix"></LineChart>
      <HdfsChart v-if="visiblehdfs" :data="hdfsClusterList" style="width: 100%; height: 250px;"></HdfsChart>
      <YarnChart v-if="visiblecpu" :data="yarnTrendList" style="width: 100%; height: 250px;"></YarnChart>
      <YarnMChart v-if="visibleyarn" :data="yarnTrendList" style="width: 100%; height: 250px;"></YarnMChart> -->
    </TabsCard>

    <CardTabs class="card" title="项目分析">
      <div class="flex-layout" slot="right">
        <el-input placeholder="请输入" clearable prefix-icon="el-icon-search" v-model="keyword" @change="getProjectDetail"></el-input>
        <!-- <el-button class="ml-10" icon="iconfont icon-filter" @click></el-button> -->
      </div>
      <el-table :data="projectData" border>
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
        <!-- <el-table-column label="业务板块" prop="business_field_name" align="center" show-overflow-tooltip></el-table-column> -->
        <el-table-column label="任务数(个)" sortable prop="comTotalTaskNum"></el-table-column>
        <el-table-column label="表数量(个)" sortable prop="stoTotalTables"></el-table-column>
        <el-table-column label="待治理存储量(G)"  prop="noDealByte">
          <!-- <template slot-scope="scope">
            <Byte :value="scope.row.stoTotalByte"></Byte>
          </template> -->
        </el-table-column>
        <el-table-column label="待治理计算量(CU)"  prop="comTotalTaskCost">
          <!-- <template slot-scope="scope">
            <Compute :value="scope.row.comTaskNum"></Compute>
          </template> -->
        </el-table-column>
        <el-table-column label="存储健康分" sortable prop="stoTotalPoint"></el-table-column>
        <el-table-column label="计算健康分" sortable prop="comTotalPoint"></el-table-column>
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
  getProjectAnalyzeData,
  //新接口
  getGlobalMessage,
  getTotalHealthScore,
  getImportProjectAndPerson,
  getTrendstorage,
  getProjectDetail,
  getDictList,
  getHdfsTrend,
  getYarnTrend
} from '@/api/govern/source-analyze'
import LineChart from './line-chart'
import RingChart from './ring-chart'
import CardTabs from '@c/card-tabs'
import TabsCard from '@c/tabscard'
import HdfsChart from '../hdfsChart'
import YarnChart from '../yarnChart'
import YarnMChart from '../yarnMChart'
// import {dateFormat} from '@/libs/util'
import {
  dateFormat,
  getByteUnit,
  getComputeUnit,
  insertSeparator,
  convertByte,
  convertCompute,
  getLevel,
  getcolor,
  setDatatime,
  dateFormat2
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
    Compute,
    TabsCard,
    HdfsChart,
    YarnChart,
    YarnMChart
  },
  data () {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    const endtime = new Date()
    const startime = new Date()
    startime.setTime(startime.getTime() - 3600 * 1000 * 24 * 30)
    return {
      visibleLine: true,
      visiblehdfs: false,
      visiblecpu: false,
      visibleyarn: false,
      visibleTime: true,
      visibleTime2: false,
      timeRange: '0',
      dictList: [],
      srcpng: require('@/assets/images/govern/govern.png'),
      srcpng2: require('@/assets/images/govern/item.png'),
      srcpng3: require('@/assets/images/govern/store.png'),
      srcpng4: require('@/assets/images/govern/pending.png'),
      pageNo: 1,
      pageSize: 15,
      total: 0,
      globalMessage: {},
      // globalMessage: {
      //   diskSize: '',
      //   usedDiskSize: '',
      //   usedRate: '',
      //   projectNum: '',
      //   tableNum: '',
      //   projectMenNum: '',
      //   cpuNum: '',
      //   usedCpuNum: '',
      //   avgCpuRate: '',
      //   menSize: '',
      //   usedMenSize: '',
      //   avgMenRate: '',
      //   queueNum: ''
      // },
      loading: 0,
      date: new Date(),
      // date: dateFormat(new Date()),
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
        { label: '存储', key: 'store'},
        { label: '计算', key: 'compute' }
      ],
      activeTrendTab: 'store',
      trendDate: [start, end] || [],
      trendDate1: [startime, endtime] || [],
      lineData: [],
      keyword: '',
      projectData: [],
      hdfsClusterList: {},
      yarnTrendList: {},
      command: 'store',
      scList: ['storageSapacity', 'internalStorage', 'cpu'],
      storeResources: {
        diskSize: '存储总资源:',
      },
      storeResources1: {
        projectNum: '项目个数(个):',
      },
      computeResources: {
        cpuNum: '总CPU(核):',
      },
      computeResources1: {
        menSize: '总内存(G):',
      }
    }
  },
  computed: {
    lineLegendPrefix () {
      return this.trendTabs.find(tab => this.command === tab.key).label
    }
  },
  created () {
    this._getOverview()
    this._getGlobalMessage()
    this._getTotalHealthScore()
    this.getImportProjectAndPerson()
    this.getTrendstorage()
    this.getProjectDetail()
    this.getDictList()
  },
  mounted () { },
  destroyed () { },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getProjectDetail()
    },
    tabClick (tab) {
      this.activeTrendTab = tab.key
      // this.getTrendData()
      this.getTrendstorage()
    },
    commandclick(val) {
      this.command = val
      // if (!this.timeRange) {
      //   this.timeRange = '0'
      // }
      if (val === 'store' || val === 'compute') {
        this.getTrendstorage()
        this.visibleTime = true
        this.visibleTime2 = false
        this.timeRange = '0'
      }
      if (this.scList.includes(val)) {
        this.visibleTime = false
        this.selectTime(this.timeRange)
        // this.visibleTime2 = true
        // this.getDictList()
        // const data = this.timeRange ? this.timeRange : '0'
        // if (val === 'storageSapacity') {
        //   this.getHdfsTrend(data)
        // } else {
        //   this.getYarnTrend(data)
        // }
      }
      
    },
    selectTime(val) {
      if (val === '0') {
        this.visibleTime2 = true
      } else {
        this.visibleTime2 = false
      }
      if (this.command === 'storageSapacity') {
        this.getHdfsTrend(val)
      } else {
        this.getYarnTrend(val)
      }
    },
    getTrendData () {
      this.getTrendstorage()
      // if (this.command === 'store' || this.command === 'compute') {
      //   this.getTrendstorage()
      // } else if (this.command === 'storageSapacity') {
      //   this.getHdfsTrend('0')
      // } else {
      //   this.getYarnTrend('0')
      // }
    },
    pickerChange(val) {
      if (!val) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        this.trendDate1 = [start, end]
      }
      if (this.command === 'storageSapacity') {
        this.getHdfsTrend('0')
      } else {
        this.getYarnTrend('0')
      }
    },
    async _getOverview () {
      this.loading++
      const res = await this.$simpleAsyncTo(getOverview(), '获取概览失败')
      if (res) {
        this.overview = res.data
      }
      this.loading--
    },
    
    //根据超总的文档写的接口
    async _getGlobalMessage() {
      this.loading++
      const res = await this.$simpleAsyncTo(getGlobalMessage({day: dateFormat(this.date)}), '获取失败')
      if (res) {
        this.globalMessage = res.data ? res.data : {}
        // if (res.data) {
        //   this.globalMessage 
        // }
      }
      this.loading--
    },
    async _getTotalHealthScore() {
      this.loading++
      const params = {
        day: dateFormat(this.date)
      }
      const res = await this.$simpleAsyncTo(getTotalHealthScore(params), '获取资源分析页面查询存储健康分和计算健康分失败')
      if (res) {
        const data = res.data.computeObject
        const healtLevel = data ? data.healtLevel : ''
        const pointComment = data ? data.pointComment : ''
        const totalPoint = data ? data.totalPoint : 0
        const ratio = data ?  data.ratio : ''
        const unit = data ? data.unit : ''
        const computeCost  = data ? data.computeCost : ''
        const {color, icon} = getcolor(Number(totalPoint))
        this.computeRing = {
          level: healtLevel ,
          title: '健康等级',
          value: Number(totalPoint) 
        }
        this.computeInfo = {
          score: Number(totalPoint),
          desc: pointComment,
          radio: ratio,
          icon,
          unit,
          consume: Number(computeCost),
          rise: ratio >= 0 ? true : false
        }
        this.computeColor = color
        const storageObject = res.data.storageObject
        const stotalPoint = storageObject ? Number(storageObject.totalPoint) : 0
        const shealtLevel = storageObject ? storageObject.healtLevel : ''
        const spointComment = storageObject ? storageObject.pointComment : ''
        const storageCost = storageObject ? storageObject.storageCost : 0
        const sunit = storageObject ? storageObject.unit : ''
        const sratio = storageObject ? storageObject.ratio : ''
        const scolor = getcolor(stotalPoint).color
        const siocn = getcolor(stotalPoint).icon
        this.storeRing = {
          level: shealtLevel,
          title: '健康等级',
          value: stotalPoint
        }
        this.storeInfo = {
          score: stotalPoint,
          consume: parseFloat(storageCost),
          unit: sunit,
          desc: spointComment,
          icon: siocn,
          radio: sratio,
          rise: sratio >= 0 ? true : false
        }
        this.storeColor = scolor
      }
      this.loading--
    },
    //重点关注项目
    async getImportProjectAndPerson() {
      const params = {
        day: dateFormat(this.date)
      }
      const res = await this.$simpleAsyncTo(getImportProjectAndPerson(params), '获取重点关注项目列表失败')
      if (res) {
        this.storeEmphasis = res.data.stoImportProject
        this.storeManager = res.data.stoPerson
        this.computeEmphasis = res.data.comImportProject
        this.computeManager = res.data.comPerson
      }
    },
    //趋势存储
    async getTrendstorage() {
      let [startDate, endDate] = []
      let params = []
      if (this.trendDate) {
        [startDate, endDate] = this.trendDate
        params = {
          startDay: dateFormat(startDate),
          endDay: dateFormat(endDate),
          queryType: this.command === 'store' ? 0 : 1
        }
      } else {
        params = {
          startDay: '',
          endDay: '',
          queryType: this.command === 'store' ? 0 : 1
        }
      }
      const res = await this.$simpleAsyncTo(getTrendstorage(params), '获取')
      if (res) {
        this.lineData = res.data
      }
    },
    //项目查询
    async getProjectDetail() {
      const params = {
        deployName: this.keyword,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        day: dateFormat(this.date)
      }
      const res = await this.$simpleAsyncTo(getProjectDetail(params), '')
      if (res) {
        this.projectData = res.data ? res.data.totalList : []
        this.total =  res.data ? res.data.total : 0
      }
    },
    async getDictList() {
      const res = await this.$simpleAsyncTo(getDictList({type: 'yarn_resource_trend'}), '获取列表失败')
      if (res) {
        this.dictList = res.data
      }
    },
    async getHdfsTrend(val) {
      const [startDate, endDate] = this.trendDate1
      const params = {}
      if (val === '0') {
        params.timeRange = val,
        params.startDate = dateFormat(startDate) + ' ' + dateFormat2(startDate),
        params.endDate = dateFormat(endDate) + ' ' + dateFormat2(endDate)
      } else {
        params.timeRange = val
      }
      const res = await this.$simpleAsyncTo(getHdfsTrend(params), '获取hdfs存储趋势')
      if (res) {
        this.visiblehdfs = true
        this.hdfsClusterList = res.data
      }
    },
    async getYarnTrend(val) {
      const [startDate, endDate] = this.trendDate1
      const params = {}
      if (val === '0') {
        params.timeRange = val,
        params.startDate = dateFormat(startDate) + ' ' + dateFormat2(startDate),
        params.endDate = dateFormat(endDate) + ' ' + dateFormat2(startDate)
      } else {
        params.timeRange = val
      }
      const res = await this.$simpleAsyncTo(getYarnTrend(params), '获取yarn趋势列表失败')
      if (res) {
        this.yarnTrendList = res.data
      }
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
  .card {
    .grid-content {
      display: flex;
      // margin-bottom: 10px;
      height: 90px;
      .el-form {
        margin: auto;
          // margin-left: 10%;
        width: 90%;
          .el-form-item{
            min-width: 125px;
            margin-bottom: 0px;
            // border: 1px solid black;
          }
      }
      img {
        // margin: 30px;
        margin: 15px 30px 20px 30px;
        // margin-left: 40px;
      }
      strong{
        font-size: 24px;
      }
      .left {
          align-items: center;
          display: flex;
          width: 50%;
          background: #FFFFFF;
          // margin-left: 15px;
          // .iconfont {
          //   font-size: 100px;
          //   color:#78ABFF ;
          // }
          // 
        }
      .center{
        align-items: center;
        display: flex;
        width: 50%;
        background: #FFFFFF;
        margin-left: 10px;
      }
      .center-right {
        align-items: center;
        display: flex;
        width: 50%;
        background: #FFFFFF;
        margin-left: 10px;
      }
      .right {
        align-items: center;
        display: flex;
        width: 50%;
        // height: 150px;
        background: #FFFFFF;
        margin-left: 10px;
      }
      // .grid-left{
      //   // border: 1px solid blue;
      //   width: 49%;
      //   display: flex;
      //   .left {
      //     align-items: center;
      //     display: flex;
      //     width: 50%;
      //     background: #FFFFFF;
      //     // margin-left: 15px;
      //     // .iconfont {
      //     //   font-size: 100px;
      //     //   color:#78ABFF ;
      //     // }
      //     // 
      //   }
      // .center{
      //   align-items: center;
      //   display: flex;
      //   width: 50%;
      //   background: #FFFFFF;
      //   margin-left: 10px;
      // }
      // }
      // .grid-right{
      //   // border: 1px solid black;
      //   width: 50%;
      //   margin-left: 30px;
      //   display: flex;
      //   .center-right {
      //   align-items: center;
      //   display: flex;
      //   width: 50%;
      //   background: #FFFFFF;
      //   margin-left: 10px;
      // }
      // .right {
      //   align-items: center;
      //   display: flex;
      //   width: 50%;
      //   // height: 150px;
      //   background: #FFFFFF;
      //   margin-left: 10px;
      // }
      // }
      
    }
    .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #FFFFFF;
    // .el-form-item {
    //   // border: 1px solid black;
    //   width: 185px;
    // }
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  // .grid-content {
  //   border-radius: 4px;
  //   min-height: 36px;
  // }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
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
      font-size: 28px;
      color: #68b6b0;
      // font-size: 28px;
      margin-right: 8px;
    }
  }
}

</style>
<style lang="less" scoped>
.pickTime{
  // border: 1px solid blueviolet;
  .el-picker-panel__footer{

    border: 1px solid rgb(228, 8, 8);
    background-color: pink;
    /deep/.el-button {
      display: none;
    }
  }
}
</style>
