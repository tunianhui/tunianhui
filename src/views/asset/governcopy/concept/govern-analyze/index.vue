<template>
  <section class="govern-analyze">
    <CardTabs headBorder title="治理分析" :tabs="tabs" v-model="activeTab" @tab-click="tabClick">
      <template slot="right">
        <el-date-picker v-model="date" type="date" value-format="YYYY-MM-dd" placeholder="选择日期"></el-date-picker>
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
          <div class="flex-layout detail-list">
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

          <el-table ref="multipleTable" :data="detailTable" :height="200">
            <el-table-column label="治理项名称" prop="name"></el-table-column>
            <el-table-column label="健康分扣分" prop="score"></el-table-column>
            <el-table-column label="待治理存储量" prop="store_count">
              <template slot-scope="scope">
                <Compute :value="scope.row.store_count"></Compute>
              </template>
            </el-table-column>
            <el-table-column label="待治理表数" prop="table_count"></el-table-column>
          </el-table>
        </div>
      </div>
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
        <el-table-column label="管理员" prop="manager"></el-table-column>
        <el-table-column label="存储量" sortable prop="store_count">
          <template slot-scope="scope">
            <Compute :value="scope.row.store_count"></Compute>
          </template>
        </el-table-column>
        <el-table-column label="存储治理率" sortable prop="rate"></el-table-column>
        <el-table-column label="待治理项" sortable prop="pending_count"></el-table-column>
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
import { getStoreScore, getProjectData } from '@/api/govern/govern-analyze'
import { dateFormat, insertSeparator, getLevel } from '@/libs/util'
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
      activeTab: 'store',
      tabs: [
        { label: '存储', key: 'store' },
        { label: '计算', key: 'compute' }
      ],
      date: dateFormat(new Date()),
      detailList: [
        {
          src: require('@/assets/images/govern/item.png'),
          title: '治理项数',
          score: 6,
          key: 'count'
        },
        {
          src: require('@/assets/images/govern/items.png'),
          title: '治理事项数',
          score: 1834,
          key: 'itemCount'
        },
        {
          src: require('@/assets/images/govern/pending.png'),
          title: '待处理表',
          score: 2142,
          key: 'pendingCount'
        }
      ],
      detailTable: [],
      keyword: '',
      projectData: [],
      loading: 0,
      score: 60.34,
      visibleTrend: false,
      visibleRank: false,
      activeRow: Object.create(null),
      levelInfo: Object.create(null)
    }
  },
  created () {
    this._getStoreScore()
    this._getProjectData()
  },
  methods: {
    showTrend (row) {
      this.activeRow = row
      this.visibleTrend = true
    },
    showRank (row) {
      this.activeRow = row
      this.visibleRank = true
    },
    tabClick (tab) {
      this._getStoreScore()
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
    async _getProjectData () {
      this.loading++
      const res = await this.$simpleAsyncTo(
        getProjectData(),
        '获取项目治理明细'
      )
      if (res) {
        this.projectData = res.data
      }
      this.loading--
    }
  }
}
</script>

<style lang="scss">
.govern-analyze {
  .dashboard-card {
    width: 25%;
    min-width: 200px;
  }
  .detail-list {
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
