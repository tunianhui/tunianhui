<template>
  <div class="run-detail">
    <div class="body-title">
      <span>运行详情</span>
      <span>
        <i class="iconfont icon-shishishili"></i>
        <span>实例总数</span>
        <span>{{RunDetailData.instanceTotal}}</span>
      </span>
    </div>
    <div class="detail-select-wrapper">
      <div :class="['tabs-top']">
        <div
          :class="['tabs-item-wrapper', activeTabsItem === item.value ? 'active' : '']"
          :style="{margin: index === runStatusOptions.length - 1 ? '0' : '0 10px 0 0'}"
          v-for="(item, index) in runStatusOptions" :key="item.value"
          @click="selectTabsItemHandle(item, index)"
        >
          <div class="tabs-item-main">
            <div class="tabs-item-title">
              <div class="status-icon">
                <i :class="[item.icon]" :style="{color: item.color, 'font-size': '16px'}"></i>
                <span class="run-label">{{item.label}}</span>
              </div>
              <div class="run-value">
                {{item.count}}
              </div>
              <div class="percentage">
                <span>占实例总数：</span>
                <span>{{item.percent}}%</span>
              </div>
            </div>
            <div class="tabs-item-count">
              <el-progress type="circle" :percentage="item.percent" :width="100" :stroke-width="10" color="#598AE8" stroke-linecap="butt"></el-progress>
            </div>
          </div>
        </div>
        <div
          class="line"
          :style="{
            left: `calc((100% - ${(runStatusOptions.length - 1) * 10 }px) / ${runStatusOptions.length} * ${activeTabsItemIndex} + ${activeTabsItemIndex * 10}px)`,
            width: `calc((100% - ${(runStatusOptions.length - 1) * 10}px) / ${runStatusOptions.length})`
          }"
        ></div>
      </div>
      <div class="tabs-body">
        <div class="detail-title">实例详情</div>
        <div class="bar-legend">
          <div class="legend-item">
            <div class="legend-icon">
              <span style="background:#40A7D1"></span>
              <span>周期实例</span>
            </div>
            <div class="legend-text">1844</div>
          </div>
          <div class="legend-item">
            <div class="legend-icon">
              <span style="background:#3D4374"></span>
              <span>手动实例</span>
            </div>
            <div class="legend-text">0</div>
          </div>
          <div class="legend-item">
            <div class="legend-icon">
              <span style="background:#50C079"></span>
              <span>补数据实例</span>
            </div>
            <div class="legend-text">0</div>
          </div>
        </div>
        <div class="chart-box">
          <div class="bar-chart" ref="barChart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from '@c/bar-chart'
export default {
  name: 'RunDetail',
  props: {
    RunDetailData: Object,
  },
  data() {
    return {
      activeTabsItem: 'success',
      activeTabsItemIndex: 0,
      runStatusOptions: [
        {
          label: '运行成功',
          value: 'success',
          color: '#47B447',
          icon: 'el-icon-success',
          count: 0,
          percent: 0,
          data: []
        },
        {
          label: '运行失败',
          value: 'error',
          color: '#C14E63',
          icon: 'el-icon-error',
          count: 0,
          percent: 0,
        },
        {
          label: '运行中',
          value: 'running',
          color: '#577AD5',
          icon: 'el-icon-loading',
          count: 0,
          percent: 0
        },
        {
          label: '等待中',
          value: 'waiting',
          color: '#745BB8',
          icon: 'el-icon-warning',
          count: 0,
          percent: 0
        },
        // {
        //   label: '未运行',
        //   value: '5',
        //   color: '#79767C',
        //   icon: 'el-icon-warning',
        //   count: 217,
        //   percent: 7.8
        // }
      ],
      barChart: null
    }
  },
  watch: {
    RunDetailData: {
      handler(val) {
        this.runStatusOptions.forEach(item => {
          item.count = Number(val[item.value].total)
          item.percent = Number(val[item.value].prop)
        })
        // this.barChart.chart.update({
        //   data: this.runStatusOptions[0].data || []
        // })
      },
      deep: true
    }
  },
  mounted() {
    this.initBarChart(this.runStatusOptions[0].data || [])
  },
  methods: {
    selectTabsItemHandle(item, index) {
      this.activeTabsItem = item.value
      this.activeTabsItemIndex = index
       this.barChart.chart.update({
        data: item.data || []
      })
    },
    initBarChart(data) {
      this.barChart = new BarChart({
        container: this.$refs.barChart,
        data: data,
        xField: 'xField',
        yField: 'value',
        seriesField: 'name',
        color: ['#40A7D1', '#3D4374', '#50C079'],
      })
      this.barChart.init()
    },
  }
}
</script>

<style lang="scss" scoped>
@import './scss.scss';
.run-detail {
  .body-title {
    display: flex;
    align-items: center;
    height: 30px;
    margin-bottom: 10px;
    >span {
      &:nth-child(1) {
        font-size: 16px;
        color: rgba($color: #000000, $alpha: 0.85);
        font-weight: 600;
        margin-right: 10px;
      }
      &:nth-child(2) {
        height: 30px;
        display: flex;
        align-items: center;
        padding: 5px 10px;
        background: #E4E6F6;
        border-radius: 15px;
        i {
          font-size: 14px;
          color: #409EFF;
          margin-right: 5px;
        }
        span {
          font-size: 12px;
          color: #909399;
          margin-right: 5px;
          &:nth-child(3) {
            font-size: 14px;
            color: #606266;
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>