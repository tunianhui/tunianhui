<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-18 09:15:32
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-19 17:31:51
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\example-statistics\real-time-example\index.vue
-->
<template>
  <div class="real-time-example">
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
      <RunDetailRealTime></RunDetailRealTime>
      <RunningTrendRealTime></RunningTrendRealTime>
    </div>

    <div class="top-title">
      <div class="title">实例运行统计</div>
      <div class="right">
        <span>统计截止日期：10:00:00</span>
        <el-button type="default" size="mini" class="ml-10" @click="visibleViewNote = true"> <i class="iconfont icon-biaodanliebiao"></i> 查看注释</el-button>
      </div>
    </div>
    <div class="ranking-wrapper">
      <div class="ranking-left">
        <RunExampleStat title="失败报警实例数据排行" :columns="columns"></RunExampleStat>
      </div>
      <div class="ranking-right">
        <RunExampleStat title="延时报警实例数排行"></RunExampleStat>
      </div>
    </div>
  </div>
</template>

<script>
import RunDetailRealTime from './run-detail'
import RunningTrendRealTime from './running-trend'
import RunExampleStat from '../offline-example/run-example-stat'
export default {
  name: 'RealTimeExample',
  components: {
    RunDetailRealTime,
    RunningTrendRealTime,
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
      columns: [
        {
          label: '排序',
          prop: 'index',
          width: '50px',
          slots: {
            name: 'index'
          }
        },
        {
          label: '项目',
          prop: 'project',
          slots: {
            name: 'project'
          }
        },
        {
          label: '管理员',
          prop: 'manageUser',
          slots: {
            name: 'manageUser'
          }
        },
        {
          label: '',
          prop: 'errorNum',
          slots: {
            name: 'progress'
          }
        },
        {
          label: '失败实例数',
          prop: 'taskNum',
          align: 'right'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.real-time-example {
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