<template>
  <div class="running-trend">
    <TabsHeader
      class="mt-20"
      title="运行趋势"
      :tabs="tabs"
      :active="activeTabRunningTrend"
      :height="'40px'"
      :borderBottomWrapper="true"
      @tab-click="handleTabClick"
    >
      <span slot="title" style="font-weight:600font-size: 16px;color: rgba(0, 0, 0, 0.85);" class="mr-10">运行趋势</span>
      <template #right>
        <div class="right">
          <span>统计时间：2020-08-26 至 2020-09-10</span>
          <el-popover
            placement="bottom-end"
            width="400"
            trigger="manual"
            popper-class="filter-popover"
            v-model="filterVisible"
          >
            <div class="filter-wrapper">
              <div class="filter-wrapper-title">
                <span class="text">条件筛选</span>
                <span @click="clearFilterHandle">
                  <span>清空筛选</span>
                  <i class="el-icon-close"></i>
                </span>
              </div>
              <div class="filter-wrapper-body">
                <span>业务分类</span>
                <span>
                  <el-select v-model="businessClassValue" placeholder="请选择" @change="changeBusinessClassValue">
                    <el-option
                      v-for="item in businessClassOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </span>
              </div>
            </div>
            <el-button slot="reference" @click.stop="filterVisible = !filterVisible">
              <i class="iconfont icon-shaixuan"></i>
            </el-button>
          </el-popover>
          <el-button type="default" size="mini"> <i class="el-icon-download"></i> 下载CSV</el-button>
        </div>
      </template>
    </TabsHeader>
    <div class="content" style="margin-top:10px">
      <template v-if="activeTabRunningTrend === 'cycle' || activeTabRunningTrend === 'hand'">
        <div style="font-size: 14px; color: #909399;margin:10px 0">已运行的实例：{{filterBusinessClassValue(businessClassValue)}}</div>
        <div :class="['tabs-top']" style="height:100px">
          <div
            :class="['tabs-item-wrapper', activeTabsTunningTrendItem.includes(item.value) ? 'active' : '']"
            :style="{margin: index === runningTrendList.length - 1 ? '0' : '0 10px 0 0'}"
            v-for="(item, index) in runningTrendList" :key="item.value"
            @click="selectTunningTrendItemHandle(item, index)"
          >
            <div class="tabs-item-main">
              <div class="tabs-item-title">
                <div class="status-icon">
                  <i :class="[item.icon]" :style="{color: item.color, 'font-size': '16px'}" v-if="item.icon"></i>
                  <span class="run-label">{{item.label}}</span>
                </div>
                <div class="run-value">
                  {{item.count}}
                </div>
                <div class="percentage"></div>
              </div>
            </div>
            <div class="select-box" v-if="activeTabsTunningTrendItem.includes(item.value)"></div>
            <div class="select-icon" v-if="activeTabsTunningTrendItem.includes(item.value)">
              <i class="el-icon-check"></i>
            </div>
          </div>
          <div
            v-if="activeTabsTunningTrendItem.includes('1')"
            class="line tunning-trend "
            :style="{left: `calc((100% - 20px) / 3 * ${0} + ${(0) * 10}px)`}">
          </div>
          <div
            v-if="activeTabsTunningTrendItem.includes('2')"
            class="line tunning-trend "
            :style="{left: `calc((100% - 20px) / 3 * ${1} + ${(1) * 10}px)`}">
          </div>
          <div
            v-if="activeTabsTunningTrendItem.includes('3')"
            class="line tunning-trend "
            :style="{left: `calc((100% - 20px) / 3 * ${2} + ${(2) * 10}px)`}">
          </div>
        </div>
        <div class="tabs-body">
          <div ref="cycleExample" style="height:230px"></div>
        </div>
      </template>
      <template v-if="activeTabRunningTrend === 'hand'">
      </template>
    </div>
  </div>
</template>

<script>
import TabsHeader from '@/components/tabs-header'
import LineAreaChart from '@c/line-area-chart'
export default {
  name: 'RunningTrend',
  components: {
    TabsHeader
  },
  props: {
    runningTrendCycleData: Object
  },
  watch: {
    runningTrendCycleData: {
      handler(val) {
        if (val) {
          const data = val[this.activeTabRunningTrend]
          this.runningTrendList.map(d => {
            d.count = data[d.value].total
            d.data = data[d.value].list
          })

          console.log(this.runningTrendList)
          this.$nextTick(_ => {
            this.initLineAreaChart(this.runningTrendList[0].data || [])
          })
        }
      },
      deep: true
    }
  },
  data() {
    return {
      tabs: [
        {
          label: '周期实例',
          name: 'cycle'
        },
        {
          label: '手动实例',
          name: 'hand'
        },
        {
          label: '补数据实例',
          name: '3'
        }
      ],
      activeTabRunningTrend: 'cycle',
      businessClassOptions: [
        { label: '全部', value: 'all' },
        { label: '数据处理-代码任务', value: '1' },
        { label: '数据处理-同步&管道', value: '2' },
        { label: '逻辑表', value: '3' },
      ],
      businessClassValue: 'all',
      filterVisible: false,
      activeTabsTunningTrendItem: ['1'],
      runningTrendList: [
        {
          label: '已运行实例总数',
          value: '1',
          color: '#47B447',
          count: 0,
          data: []
        },
        {
          label: '运行成功',
          value: '2',
          color: '#47B447',
          icon: 'el-icon-success',
          count: 0,
          data: []
        },
        {
          label: '运行失败',
          value: '3',
          color: '#C14E63',
          icon: 'el-icon-error',
          count: 0,
          data: []
        }
      ],
    }
  },
  mounted() {
    // this.initLineAreaChart(this.runningTrendList[0].data || [])
  },
  methods: {
    initLineAreaChart(data) {
      this.lineAreaChart && this.lineAreaChart.chart.destroy()
      this.lineAreaChart = new LineAreaChart({
        container: this.$refs.cycleExample,
        data: data,
        xField: 'time',
        yField: 'value',
        seriesField: 'type',
        color: ['#53A2C1', '#416080', '#6AB08A'],
        legend: false,
        areaStyle: (data) => {
          if (data.type === '已运行实例总数') {
            return {
              fill: 'l(270) 0:#ffffff 1:#6AA0C0'
            }
          } else if (data.type === '运行失败') {
            return {
              fill: 'l(270) 0:#ffffff 1:#416080'
            }
          } else if (data.type === '运行成功') {
            return {
              fill: 'l(270) 0:#ffffff 1:#6AB08A'
            }
          }
        }
      })
      this.lineAreaChart.init()
    },
    handleTabClick(tab) {
      this.activeTabRunningTrend = tab.name
      this.activeTabsTunningTrendItem = ['1']
      const data = this.runningTrendCycleData[this.activeTabRunningTrend]
      this.runningTrendList.map(d => {
        d.count = data[d.value].total
        d.data = data[d.value].list
      })
      this.$nextTick(_ => {
        this.initLineAreaChart(this.runningTrendList[0].data || [])
      })
    },
    changeBusinessClassValue(val) {
      this.businessClassValue = val
      if (val) {
        this.filterVisible = false
      }
    },
    clearFilterHandle() {
      this.businessClassValue = 'all'
    },
    filterBusinessClassValue(val) {
      const data = this.businessClassOptions.find(d => d.value === val)
      if (data) {
        if (data.value === 'all') {
          return '全部业务'
        }
        return data.label
      }
      return ''
    },
    selectTunningTrendItemHandle(item, index) {
      if (this.activeTabsTunningTrendItem.includes(item.value)) {
        this.activeTabsTunningTrendItem = this.activeTabsTunningTrendItem.filter(_ => _ !== item.value)
      } else {
        this.activeTabsTunningTrendItem = [...this.activeTabsTunningTrendItem, item.value]
      }
      if (this.activeTabsTunningTrendItem.length === 0) {
        this.activeTabsTunningTrendItem = ['1']
        this.lineAreaChart.chart.update({
          data: this.runningTrendList[0].data || []
        })
        return
      }
      const dataList = this.runningTrendList.filter(_ => this.activeTabsTunningTrendItem.includes(_.value))
      const data = dataList.map(_ => _.data).flat()
      this.lineAreaChart.chart.update({
        data: data || []
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import './scss.scss';
.running-trend {
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
</style>

<style lang="scss">
.filter-popover {
  padding: 0;
  width: 300px!important;
  .filter-wrapper {
    &-title {
      padding: 12px;
      display: flex;
      height: 30px;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #E4E6F6;
      cursor: pointer;
      .text {
        font-size: 14px;
        font-weight: 600;
      }
      > span:last-child {
        >span {
          color: #000DAE;
          margin-right: 10px;
        }
      }
    }
    &-body {
      padding: 20px;
      display: flex;
      align-items: center;
      >span:first-child {
        margin-right: 20px;
        width: 60px;
      }
      >span:last-child {
        flex: 1;
        width: 0;
      }
    }
  }
}
</style>