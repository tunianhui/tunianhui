<template>
  <div class="running-trend-real-time">
    <TabsHeader
      class="mt-20"
      title="运行趋势"
      :height="'40px'"
      :borderBottomWrapper="true"
    >
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
                <i :class="['iconfont', item.icon]" :style="{color: item.color, 'font-size': '16px'}" v-if="item.icon"></i>
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
          class="line tunning-trend-1"
          :style="{left: `calc((100% - 30px) / 4 * ${0} + ${(0) * 10}px)`}">
        </div>
        <div
          v-if="activeTabsTunningTrendItem.includes('2')"
          class="line tunning-trend-1"
          :style="{left: `calc((100% - 30px) / 4 * ${1} + ${(1) * 10}px)`}">
        </div>
        <div
          v-if="activeTabsTunningTrendItem.includes('3')"
          class="line tunning-trend-1"
          :style="{left: `calc((100% - 30px) / 4 * ${2} + ${(2) * 10}px)`}">
        </div>
        <div
          v-if="activeTabsTunningTrendItem.includes('4')"
          class="line tunning-trend-1"
          :style="{left: `calc((100% - 30px) / 4 * ${3} + ${(3) * 10}px)`}">
        </div>
      </div>
      <div class="tabs-body">
        <div ref="cycleExample" style="height:230px"></div>
      </div>
    </div>
  </div>
</template>

<script>
import TabsHeader from '@/components/tabs-header'
import LineAreaChart from '@c/line-area-chart'
export default {
  name: 'RunningTrendRealTime',
  components: {
    TabsHeader
  },
  data() {
    return {
      activeTabRunningTrend: '1',
      filterVisible: false,
      businessClassValue: 'all',
      businessClassOptions: [
        { label: '全部', value: 'all' },
        { label: '数据处理-代码任务', value: '1' },
        { label: '数据处理-同步&管道', value: '2' },
        { label: '逻辑表', value: '3' },
      ],
      activeTabsTunningTrendItem: ['1'],
      runningTrendList: [
        {
          label: '已运行实例总数',
          value: '1',
          color: '#47B447',
          count: 1,
          data: [
            { time: '2019-08-27', value: 2500, type: '已运行实例总数' },
            { time: '2019-08-28', value: 2500, type: '已运行实例总数' },
            { time: '2019-08-29', value: 2500, type: '已运行实例总数' },
            { time: '2019-08-30', value: 2500, type: '已运行实例总数' },
            { time: '2019-08-31', value: 2500, type: '已运行实例总数' },
            { time: '2019-09-01', value: 2500, type: '已运行实例总数' },
            { time: '2019-09-02', value: 2500, type: '已运行实例总数' },
            { time: '2019-09-03', value: 2500, type: '已运行实例总数' },
            { time: '2019-09-04', value: 2500, type: '已运行实例总数'},
            { time: '2019-09-05', value: 2500, type: '已运行实例总数' },
            { time: '2019-09-06', value: 2500, type: '已运行实例总数' },
            { time: '2019-09-07', value: 2500, type: '已运行实例总数' },
            { time: '2019-09-08', value: 2500, type: '已运行实例总数' },
            { time: '2019-09-09', value: 0, type: '已运行实例总数' },
            { time: '2019-09-10', value: 2300, type: '已运行实例总数' }
          ]
        },
        {
          label: '运行中',
          value: '2',
          color: '#6089D9',
          icon: 'icon-wait',
          count: 1,
          data: [
            { time: '2019-08-27', value: 2200, type: '运行中' },
            { time: '2019-08-28', value: 2200, type: '运行中' },
            { time: '2019-08-29', value: 2400, type: '运行中' },
            { time: '2019-08-30', value: 2200, type: '运行中' },
            { time: '2019-08-31', value: 2200, type: '运行中' },
            { time: '2019-09-01', value: 2200, type: '运行中' },
            { time: '2019-09-02', value: 2200, type: '运行中' },
            { time: '2019-09-03', value: 2200, type: '运行中' },
            { time: '2019-09-04', value: 2200, type: '运行中' },
            { time: '2019-09-05', value: 2200, type: '运行中' },
            { time: '2019-09-06', value: 2200, type: '运行中' },
            { time: '2019-09-07', value: 2200, type: '运行中' },
            { time: '2019-09-08', value: 2200, type: '运行中' },
            { time: '2019-09-09', value: 0, type: '运行中' },
            { time: '2019-09-10', value: 2000, type: '运行中' }
          ]
        },
        {
          label: '暂停',
          value: '3',
          color: '#CEAE4D',
          icon: 'icon-execute-',
          count: 0,
          data: [
            { time: '2019-08-27', value: 1200, type: '暂停' },
            { time: '2019-08-28', value: 1200, type: '暂停' },
            { time: '2019-08-29', value: 1400, type: '暂停' },
            { time: '2019-08-30', value: 1200, type: '暂停' },
            { time: '2019-08-31', value: 1200, type: '暂停' },
            { time: '2019-09-01', value: 1200, type: '暂停' },
            { time: '2019-09-02', value: 1200, type: '暂停' },
            { time: '2019-09-03', value: 1200, type: '暂停' },
            { time: '2019-09-04', value: 1200, type: '暂停' },
            { time: '2019-09-05', value: 1200, type: '暂停' },
            { time: '2019-09-06', value: 1200, type: '暂停' },
            { time: '2019-09-07', value: 1200, type: '暂停' },
            { time: '2019-09-08', value: 1200, type: '暂停' },
            { time: '2019-09-09', value: 0, type: '暂停' },
            { time: '2019-09-10', value: 1000, type: '暂停' }
          ]
        },
        {
          label: '停止',
          value: '4',
          color: '#B14861',
          icon: 'icon-zhongzhi',
          count: 0,
          data: [
            { time: '2019-08-27', value: 1200, type: '停止' },
            { time: '2019-08-28', value: 1200, type: '停止' },
            { time: '2019-08-29', value: 1400, type: '停止' },
            { time: '2019-08-30', value: 1200, type: '停止' },
            { time: '2019-08-31', value: 1200, type: '停止' },
            { time: '2019-09-01', value: 1200, type: '停止' },
            { time: '2019-09-02', value: 1200, type: '停止' },
            { time: '2019-09-03', value: 1200, type: '停止' },
            { time: '2019-09-04', value: 1200, type: '停止' },
            { time: '2019-09-05', value: 1200, type: '停止' },
            { time: '2019-09-06', value: 1200, type: '停止' },
            { time: '2019-09-07', value: 1200, type: '停止' },
            { time: '2019-09-08', value: 1200, type: '停止' },
            { time: '2019-09-09', value: 0, type: '停止' },
            { time: '2019-09-10', value: 1000, type: '停止' }
          ]
        }
      ],
    }
  },
   mounted() {
    this.initLineAreaChart(this.runningTrendList[0].data || [])
  },
  methods: {
    initLineAreaChart(data) {
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
@import '../offline-example/scss.scss';
.running-trend-real-time {
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