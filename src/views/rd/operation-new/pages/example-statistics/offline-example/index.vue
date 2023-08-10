<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-18 09:14:37
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-15 18:07:03
 * @FilePath: \智能数据构建\src\views\rd\operation-new\pages\example-statistics\offline-example\index.vue
-->
<template>
  <div class="statistics-offline-example">
    <div v-loading="loading">
      <div class="top-title">
        <div class="title">实例运行统计</div>
        <div class="right">
          <span>统计截止日期：10:00:00</span>
          <el-select v-model="runTimeType" placeholder="请选择时间类型" style="width:160px">
            <el-option
              v-for="item in runTimeTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker
            style="width:160px"
            class="ml-10"
            v-model="date"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <el-button type="default" size="mini" class="ml-10" @click="visibleViewNote = true"> <i class="iconfont icon-biaodanliebiao"></i> 查看注释</el-button>
        </div>
      </div>
      <div class="content-body">
        <RunDetail
          :RunDetailData="RunDetailData"
        ></RunDetail>
        <RunningTrend :runningTrendCycleData="runningTrendCycleData"></RunningTrend>
      </div>
      <template v-if="activeAngleView === '2'">
        <div class="top-title">
          <div class="title">实例运行统计</div>
          <div class="right">
            <span>统计截止日期：10:00:00</span>
            <el-button type="default" size="mini" class="ml-10" @click="visibleViewNote = true"> <i class="iconfont icon-biaodanliebiao"></i> 查看注释</el-button>
          </div>
        </div>
        <div class="ranking-wrapper">
          <div class="ranking-left">
            <RunExampleStat title="运行失败实例数排行"></RunExampleStat>
          </div>
          <div class="ranking-right">
            <RunExampleStat title="运行失败实例对应任务数排行"></RunExampleStat>
          </div>
        </div>
      </template>
      <ViewNote v-if="visibleViewNote" @close="visibleViewNote = false"></ViewNote>
    </div>
  </div>
</template>

<script>
import ViewNote from './view-note'
import RunDetail from './run-detail'
import RunningTrend from './running-trend'
import RunExampleStat from './run-example-stat'
import { getExampleStatistics } from '@/api/rd/operation-new/example-statistics'
import {mapGetters} from 'vuex'
export default {
  name: 'OfflineExample',
  props: {
    activeAngleView: String
  },
  components: {
    ViewNote,
    RunDetail,
    RunningTrend,
    RunExampleStat
  },
  data() {
    return {
      runTimeType: '1',
      date: '',
      runTimeTypeOptions: [
        {
          label: '运行日期',
          value: '1'
        },
        {
          label: '业务日期',
          value: '2'
        }
      ],
      visibleViewNote: false,
      statisticsData: {},
      loading: false,
      RunDetailData: {},
      runningTrendCycleData: {},
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  created() {
    this.getExampleStatistics()
  },
  mounted() {
  },
  methods: {
    // 获取实例运行统计数据
    async getExampleStatistics() {
      this.loading = true
      const params = {
        projectId: this.project.project_id,
        bizDate: this.date
      }
      const res = await this.$simpleAsyncTo(getExampleStatistics(params), '获取实例运行统计数据失败')
      if (res) {
        this.statisticsData = res.data
        this.RunDetailData = {
          instanceTotal: res.data.instanceTotal, // 实例总数
          success: {
            prop: res.data.sucessProp, // 运行成功占比
            total: res.data.sucessTotal, // 运行成功数
          },
          error: {
            total: res.data.faildTotal, // 运行失败数
            prop: res.data.faildProp, // 运行失败占比
          },
          running: {
            total: res.data.runningTotal, // 运行中数
            prop: res.data.runningProp, // 运行中占比
          },
          waiting: {
            total: res.data.waitingTotal, // 等待中数
            prop: res.data.waitingProp, // 等待中占比
          }
        }
        this.runningTrendCycleData = this.getRunningTrendCycleData(res.data)
      }
      this.loading = false
    },
    getRunningTrendCycleData(data) {
      const totalList = this.getDataList(data, '已运行实例总数', 'cycleList', 'total')
      const successList = this.getDataList(data, '运行成功', 'cycleList', 'success')
      const errorList = this.getDataList(data, '运行失败', 'cycleList', 'faild')
      const handTotalList = this.getDataList(data, '手动实例总数', 'manualList', 'total')
      const handSuccessList = this.getDataList(data, '运行成功', 'manualList', 'success')
      const handErrorList = this.getDataList(data, '运行失败', 'manualList', 'faild')
      return {
        cycle: {
          1: {
            total: data.cycleInstanceTotal,
            list: totalList
          },
          2: {
            total: data.cycleInstanceSucess,
            list: successList
          },
          3: {
            total: data.cycleInstanceFaild,
            list: errorList
          },
        },
        hand: {
          1: {
            total: data.manualInstanceTotal,
            list: handTotalList
          },
          2: {
            total: data.manualInstanceSucess,
            list: handSuccessList
          },
          3: {
            total: data.manualInstanceFaild,
            list: handErrorList
          },
        }
      }
    },
    getDataList(data, text, key, valueKey) {
      return data[key].map(d => {
        return {
          time: d.bizdate,
          value: d[valueKey],
          type: text
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics-offline-example {
  .top-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    height: 40px;
    .title {
      font-size: 16px;
      color: #606266;
    }
    .right {
      display: flex;
      align-items: center;
      span {
        font-size: 12px;
        color: #909399;
        margin-right: 10px;
      }
    }
  }
  .content-body {
    background: #F5F5F7;
    padding: 20px;
  }
  .ranking-wrapper {
    display: flex;
    justify-content: space-between;
    .ranking-left {
      flex: 1;
      margin-right: 10px;
      background: #fff;
    }
    .ranking-right {
      flex: 1;
      background: #fff;
    }
  }
}
</style>

