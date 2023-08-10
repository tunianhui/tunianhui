<template>
  <section class="govern-analyze">
    <CardTabs headBorder title="治理分析" :tabs="tabs" v-model="activeTab" @tab-click="tabClick">
      <template slot="right">
        <el-date-picker v-model="date" type="date" placement="bottom-start" placeholder="选择日期" @change="dateClick"></el-date-picker>
      </template>
      <div class="flex-layout">
        <div class="card dashboard-card mr-10">
          <div class="card-title">存储健康分</div>
          <Dashboard :data="score" :color="levelInfo.color"></Dashboard>
          <div class="text-center font-12">
            <i :class="[levelInfo.icon, 'font-14']"></i>
            {{levelInfo.desc}}
          </div>
          <div class="progress">
            <div class="progress-title">健康评估</div>
            <div class="progress-tip" :style="`left: calc(${score}% - ${score >= 60 ? 69 : 8}px);`">
              <template v-if="score >= 60">
                <span>当前：{{score}}分</span>
              </template>
              <i class="iconfont font-16 icon-arrow_down" :style="`color: ${levelInfo.color}`"></i>
              <template v-if="score < 60">
                <span>当前：{{score}}分</span>
              </template>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-low">低</div>
              <div class="progress-bar-center">中</div>
              <div class="progress-bar-high">高</div>
            </div>
          </div>
        </div>
        <div class="flex-1 card">
          <div class="card-title">分数明细</div>
          <div class="detail-list">
            <div v-for="(item, index) in detailList" :key="item.title" :class="['flex-1 detail-card', index < 2 && 'mr-10']">
              <img :src="item.src" width="40px" height="40px" alt />
              <div>
                <p>{{item.title}}</p>
                <p>
                  <strong>{{item.score}}</strong>
                </p>
              </div>
            </div>
          </div>

          <div class="cart-table">
            <el-table ref="multipleTable" :data="detailTable" :height="200" >
              <template slot="empty">
            <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
                <img style="height: 80px;" src="@/assets/images/nodata.png" alt="">
                <p>暂无数据</p>
            </template>
            <el-table-column label="治理项名称" prop="itemName"></el-table-column>
            <el-table-column label="健康分扣分" prop="point"></el-table-column>
            <el-table-column v-if="this.activeTab === 'store'" label="待治理项数" prop="noDealNumber">
              <!-- <template slot-scope="scope">
                <Compute :value="scope.row.noDealNumber"></Compute>
              </template> -->
            </el-table-column>
            <el-table-column v-if="activeTab === 'compute'" label="待治理任务数" prop="totalDealNumber"></el-table-column>
            <!-- <el-table-column label="待治理量(单位G)" prop="noDealCost"></el-table-column> -->
            <el-table-column :label="activeTab === 'compute' ? '待治理量(单位CU)' : '待治理量(单位G)'" prop="noDealCost"></el-table-column>
          </el-table>
          </div>
          
        </div>
      </div>
    </CardTabs>
    <CardTabs class="card" title="项目治理明细">
      <div class="flex-layout" slot="right">
        <el-input placeholder="项目名称" prefix-icon="el-icon-search" v-model="keyword" @change="_getProjectDetail" clearable></el-input>
        <!-- <el-button class="ml-10" icon="iconfont icon-filter" @click></el-button> -->
      </div>
      <el-table border  ref="multipleTable"  :data="projectData">
        <template slot="empty">
            <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
                <img  src="@/assets/images/nodata.png" alt="">
                <p>暂无数据</p>
            </template>
        <el-table-column label="项目名称" prop="projectName" min-width="188px">
          <template slot-scope="scope">
            <div class="project-name-td">
              <i class="iconfont icon-project"></i>
              <span>{{scope.row.projectName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="项目负责人" prop="createdBy" min-width="100"></el-table-column>
        <el-table-column :label="activeTab === 'store' ? '存储治理率' : '计算治理率'" sortable :prop="activeTab === 'store' ? 'stoDealRate' : 'comDealRate'" min-width="105"></el-table-column>
        <el-table-column  :label="activeTab === 'store' ? '待治理存储量(G)' : '待治理计算量(CU)'" sortable :prop="activeTab === 'store' ? 'noDealByte' : 'comNoDealNum'" min-width="135px" ></el-table-column>
        <el-table-column  label="待治理项数" sortable :prop="activeTab === 'store' ? 'stoNoDealNum' : 'comNoDealNum'" min-width="106"></el-table-column>

       
        <!-- <el-table-column v-if="visible" label="计算治理率" sortable prop="comDealRate" :key="Math.random()"></el-table-column>
        <el-table-column v-if="visible" label="待治理计算量(CU)" sortable prop="comNoDealNum" min-width="120px" :key="Math.random()"></el-table-column>
        <el-table-column v-if="visible" label="待治理项数" sortable prop="comNoDealNum" :key="Math.random()"></el-table-column>

        <el-table-column v-if="visible1" label="存储治理率" sortable prop="stoDealRate" :key="Math.random()"></el-table-column>
        <el-table-column v-if="visible1" label="待治理存储量(G)" sortable prop="noDealByte" :key="Math.random()"></el-table-column>
        <el-table-column v-if="visible1" label="待治理项数" sortable prop="stoNoDealNum" :key="Math.random()"></el-table-column> -->
        <el-table-column label="操作">
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
    <Trend :visible.sync="visibleTrend" :data="activeRow" :activeTab="activeTab"></Trend>
    <!-- <Rank :visible.sync="visibleRank" :data="activeRow"></Rank> -->
  </section>
</template>

<script>
import CardTabs from '@c/card-tabs'
import { getStoreScore, getProjectData, getStoScoreDetail, getTotalHealthScore, getComScoreDetail, getProjectDetail } from '@/api/govern/govern-analyze'
import { dateFormat, insertSeparator, getLevel, getcolor } from '@/libs/util'
import Rank from './rank'
import Trend from './trend'
import Dashboard from './dashboard'
import Compute from '@c/compute'

export default {
  name: 'GovernAnalyze',
  components: {
    CardTabs,
    Rank,
    Trend,
    Compute,
    Dashboard
  },
  data () {
    return {
      pageSize: 15,
      total: 0,
      pageNo: 1,
      activeTab: 'store',
      visible: false,
      visible1: true,
      tabs: [
        { label: '存储', key: 'store' },
        { label: '计算', key: 'compute' }
      ],
      date: new Date(),
      detailList: [
        {
          src: require('@/assets/images/govern/item.png'),
          title: '治理项数',
          score: 0,
          // score: 5,
          key: 'itemNum'
        },
        {
          src: require('@/assets/images/govern/items.png'),
          title: '治理事项数',
          score: 0,
          key: 'totalDealNumber'
        },
        {
          src: require('@/assets/images/govern/pending.png'),
          title: '待治理事项数',
          score: 0,
          key: 'noDealNumber'
        }
      ],
      detailTable: [],
      keyword: '',
      projectData: [],
      loading: 0,
      score: 0,
      visibleTrend: false,
      visibleRank: false,
      activeRow: Object.create(null),
      levelInfo: Object.create(null),
      tabslist: {},
      totalDealNumber: 0,
      noDealNumber: 0,
      itemNum: 0
    }
  },
  created () {
    // this._getStoreScore()
    // this._getProjectData()
    this._getStoScoreDetail()
    this._getTotalHealthScore()
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
      // this.getProjectDetail()
    },
    dateClick() {
       this._getTotalHealthScore()
       this._getProjectDetail()
       if (this.activeTab === 'store') {
        this._getStoScoreDetail()
       } else {
        this. _getComScoreDetail()
       }
    },
    showTrend (row) {
      this.activeRow = row
      this.visibleTrend = true
    },
    showRank (row) {
      this.activeRow = row
      this.visibleRank = true
    },
    tabClick (tab) {
      this._getTotalHealthScore()
      // this._getStoreScore()
      if (tab.key === 'store' || this.activeTab === 'store') {
        this.visible = false
        this.visible1 = true
        this._getStoScoreDetail()
        // const {totalPoint, healtLevel, pointComment} = this.tabslist.storageObject
        // const {color, icon} = getcolor(Number(totalPoint))
        // this.score = Number(totalPoint)
        // this.levelInfo = {
        //   color,
        //   icon,
        //   desc: pointComment,
        //   level: healtLevel
        // }
      } else {
        this.visible = true
        this.visible1 = false
        this._getComScoreDetail()
        // const {totalPoint, healtLevel, pointComment} = this.tabslist.computeObject
        // const {color, icon} = getcolor(Number(totalPoint))
        // this.score = Number(totalPoint)
        // this.levelInfo = {
        //   color,
        //   icon,
        //   desc: pointComment,
        //   level: healtLevel
        // }
      }
    },
    async _getStoreScore () {
      this.loading++
      const res = await this.$simpleAsyncTo(getStoreScore(), '获取数据失败')
      if (res) {
        const { score, detail, list } = res.data
        this.levelInfo = getLevel(score)
        this.score = score
        this.detailList.forEach(item => {
          item.score = insertSeparator(detail[item.key])
        })
        this.detailTable = list
      }
      this.loading--
    },
    // async _getProjectData () {
    //   this.loading++
    //   const res = await this.$simpleAsyncTo(
    //     getProjectData(),
    //     '获取项目治理明细'
    //   )
    //   if (res) {
    //     this.projectData = res.data
    //   }
    //   this.loading--
    // },


    //治理分析存储健康分
    async _getTotalHealthScore() {
      const params = {
        queryType: this.activeTab === 'store' ? 2 : 1,
        day: dateFormat(this.date),
      }
      const res = await this.$simpleAsyncTo(getTotalHealthScore(params), '获取治理分析存储健康分失败')
      if (res) {
        this.tabslist = res.data
        if (res.data && (res.data.storageObject || res.data.computeObject)) {
          const {totalPoint, healtLevel, pointComment} = this.activeTab === 'store' ? res.data.storageObject : res.data.computeObject
          const {color, icon} = getcolor(totalPoint)
          this.score = totalPoint
          this.levelInfo = {
            color,
            icon,
            desc: pointComment,
            level: healtLevel
          }
        // } else {
        //   const {totalPoint, healtLevel, pointComment} = res.data.computeObject
        //   const {color, icon} = getcolor(totalPoint)
        //   this.score = totalPoint
        //   this.levelInfo = {
        //     color,
        //     icon,
        //     desc: pointComment,
        //     level: healtLevel
        //   }
        // }
        } else {
          this.score = 0
          const {color, icon} = getcolor(this.score)
          this.levelInfo = {
            color,
            icon,
            desc: '',
            level: ''
          }
        }
        
      } 
    },
    //存储分数明细
    async _getStoScoreDetail() {
      const res = await this.$simpleAsyncTo(getStoScoreDetail({day: dateFormat(this.date)}), '获取存储分数明细失败') 
      if (res) {
        this.detailTable = res.data.list
        this.detailList.forEach(item => {
          if (item.key === 'itemNum') {
            item.score = res.data.itemNum
          }
          if (item.key === 'noDealNumber') {
            item.score = res.data.noDealNumber
          }
          if (item.key === 'totalDealNumber') {
            item.score = res.data.totalDealNumber
          }
        })
      }
    },
    //计算分数明细查询
    async _getComScoreDetail() {
      const res = await this.$simpleAsyncTo(getComScoreDetail({day: dateFormat(this.date)}), '获取计算分数明细失败')
      if (res) {
        this.detailTable = res.data.list
        this.detailList.forEach(item => {
          if (item.key === 'itemNum') {
            item.score = res.data.itemNum
          }
          if (item.key === 'noDealNumber') {
            item.score = res.data.noDealNumber
          }
          if (item.key === 'totalDealNumber') {
            item.score = res.data.totalDealNumber
          }
        })
        this.itemNum = res.data.itemNum
        this.noDealNumber = res.data.noDealNumber
        this.totalDealNumber = res.data.totalDealNumber
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
.govern-analyze {
  flex-layout{
    display: flex;
  }
  .dashboard-card {
    flex: 1;
    // width: 430px;  // for stretch layout. 这里不要包括ioBox的宽度，ioBox的宽度应该在页面加载完成后自动计算。 大约10000宽度的ioBox也可以使用。 如果不希望ioBox的宽度自动计算，可以将其放在这里面。 如果不希望屏幕宽度自动计算，可以将ioBox的宽度设置为页面最外层ioBox的宽度。 此外，ioBox的
    // width: 25%;
    // min-width: 200px;
  }
  .flex-1{
    flex: 3;
  }
  .detail-list {
    display: flex;
    margin-bottom: 10px;

    .detail-card {
      background-color: $grey10;
      padding: 15px;
      display: flex;
      align-items: center;
      img {
        margin-right: 10px;
      }
      p {
        font-size: 12px;

        strong {
          font-size: 24px;
        }
      }
    }
  }
  .cart-table{
    min-height: 200px;
    overflow: auto;
  }

  .progress {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px dashed $grey6;
    position: relative;

    &-title {
      font-size: 14px;
    }
    &-tip {
      display: inline-block;
      margin: 10px 0;
      color: $grey3;
      font-size: 12px;
      position: relative;
    }
    &-bar {
      display: flex;
      color: $grey10;
      &-low {
        width: 60%;
        line-height: 14px;
        font-size: 14px;
        text-align: center;
        background-color: $error;
      }
      &-center {
        width: 25%;
        line-height: 14px;
        font-size: 14px;
        text-align: center;
        background-color: $warning;
      }
      &-high {
        width: 15%;
        line-height: 14px;
        font-size: 14px;
        text-align: center;
        background-color: $success;
      }
    }
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
