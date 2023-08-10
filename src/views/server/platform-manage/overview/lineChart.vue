<template>
  <Echarts :option="option" autoresize></Echarts>
</template>
<script>
import {use} from 'echarts/core'
import {TooltipComponent, GridComponent} from 'echarts/components'
import {LineChart} from 'echarts/charts'
import {UniversalTransition} from 'echarts/features'
import {CanvasRenderer} from 'echarts/renderers'
import Echarts from 'vue-echarts'

use([
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])

export default {
  name: '',
  components: {
    Echarts
  },
  props: {
    chartData: {
      type: Object,
      default: function () {
        return {
          xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          seriesData: [150, 230, 224, 218, 135, 147, 260]
        }
      }
    }
  },
  watch: {
    chartData: {
      immediate: true,
      handler(val) {
        this.initChart()
      }
    }
  },
  data() {
    return {
      option: {}
    }
  },
  created() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.option = {
        grid: {
          left: '4%',
          top: '5%',
          right: '4%',
          bottom: '10%'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.chartData.xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.chartData.seriesData,
            type: 'line',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#8ca2e4' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#fff' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }
        ]
      }
    }
  }
}
</script>
