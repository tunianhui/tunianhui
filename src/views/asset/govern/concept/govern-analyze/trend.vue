<template>
  <el-dialog
    title="排行榜"
    class="govern-trend"
    :visible.sync="dialogVisible"
    @close="close"
    v-loading="!!loading"
  >
  <!-- <div class="head-right"> <el-date-picker class="pickTime"  :clearable="false" @change="getLineData" v-model="trendDate"  
  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker></div> -->
    <LineChart :data="lineData" :height="dialogBodyHeight" :activeType="activeTab"></LineChart>
    <el-radio-group v-model="recent" @change="getLineData">
      <el-radio-button :label="7">近7天</el-radio-button>
      <el-radio-button :label="30">近30天</el-radio-button>
    </el-radio-group>
    <div slot="footer">
      <el-button type="primary" @click="close">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getTrendList, getStoandComTrend} from '@/api/govern/govern-analyze'
import dialogHeight from '@/mixins/dialog-height'
import LineChart from './line-chart'
import { dateFormat } from '@/libs/util'

export default {
  name: 'GovernTrend',
  mixins: [dialogHeight],
  props: {
    data: Object,
    visible: Boolean,
    activeTab: String
  },
  components: {
    LineChart
  },
  data() {
    return {
      dialogVisible: false,
      lineData: [],
      recent: 7,
      loading: 0,
      // trendDate: [start, end] || []
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        const [start, end] = this.setTimefun(this.recent)
        const data = {
          startDay: dateFormat(start),
          endDay: dateFormat(end),
        }
        // this.getLineData()
        // if (this.activeTab === 'store') {
        //   this.getStoTrend(data)
        // } else {
          this.getStoandComTrend(data)
        // }
      }
    }
  },
  methods: {
    setTimefun(val) {
      const start = new Date()
      const end = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * val)
      return [start, end]
    },
    getLineData(val) {
      const [start, end] = this.setTimefun(val)
      const data = {
        startDay: dateFormat(start),
        endDay: dateFormat(end),
      }
      // if (this.activeTab === 'store') {
      //   this.getStoTrend(data)
      // } else {
        this.getStoandComTrend(data)
      // }
    },
    // async getLineData() {
    //   this.laoding++
    //   const res = await this.$simpleAsyncTo(
    //     getTrendList({recent: this.recent}),
    //     '获取数据失败'
    //   )
    //   if (res) {
    //     this.lineData = res.data
    //   }
    //   this.laoding--
    // },
    async getStoandComTrend(data) {
      this.loading++
      const param = {
        ...data,
        deployName: this.data.deployName
        // projectName: this.data.projectName,
      }
      const res = await this.$simpleAsyncTo(getStoandComTrend(param), '获取计算数据失败') 
      if (res) {
        this.lineData = res.data
      }
      this.loading--
    },
    // async getStoTrend(data) {
    //   this.loading++
    //   const param = {
    //     ...data,
    //     deployName: this.data.deployName
    //     // projectName: this.data.projectName,
    //   }
    //   const res = await this.$simpleAsyncTo(getStoTrend(param), '获取存储数据失败')
    //   if (res) {
    //     this.lineData = res.data
    //   }
    //   this.loading--
    // },
    close() {
      this.recent = 7
      this.$emit('update:visible', false)
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.govern-trend {
  ::v-deep .el-dialog__body {
    position: relative;

    // .head-right {
    //   position: absolute;
    //   right: 20px;
    //   top: 20px;
    //   z-index: 2;
    //   // z-index: 2px;
    // }
    .el-radio-group{
      position: absolute;
      right: 20px;
      top: 20px;
      z-index: 2;
      // z-index: 2px;
    }
  }
}
</style>
