import G2 from '@antv/g2'
// import DataSet from '@antv/data-set'

export default {
  name: 'LineChart2',
  props: {
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 220
    },
    data: Array,
    colors: {
      type: Array,
      default: _ => ['#3A9EFF', '#4D5A95']
    },
    activeType: String
  },
  data() {
    return {}
  },
  watch: {
    data: {
      // immediate: true,
      handler(data) {
        this.$nextTick(_ => {
          this.chart.clear()
          if (this.activeType === 'store') {
            this.render()
          } else {
            this.renderC()
          }
        })
      }
    }
  },
  render() {
    return <div ref="chart"></div>
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = new G2.Chart({
        container: this.$refs.chart,
        forceFit: true,
        height: this.height,
        padding: [60, 'auto']
      })
      if (this.activeType === 'store') {
        this.render()
      } else {
        this.renderC()
      }
    },
    render() {
      this.chart.source(this.data, {
        day: {
          alias: '日期'
        },
        stoTotalPoint: {
          alias: '健康分',
          formatter(val) {
            return val + '分'
          }
        },
        noDealByte: {
          alias: '存储消耗',
          formatter(val) {
            return val + 'G'
          }
        }
      })

      this.chart.axis('stoTotalPoint', {
        grid: null
      })
      this.chart.axis('noDealByte', {
        grid: null
      })

      this.chart
        .line()
        .position('day*stoTotalPoint')
        .color(this.colors[0])
        .size(3)
        .shape('smooth')

      this.chart
        .line()
        .position('day*noDealByte')
        .color(this.colors[1])
        .size(3)
        .shape('smooth')

      this.chart.legend({
        title: null,
        type: 'cut',
        marker: 'square',
        attachLast: false,
        itemMarginBottom: 20,
        offsetX: 15,
        offsetY: -20,
        position: 'top-left'
      })

      this.chart.tooltip({
        crosshairs: {
          type: 'line'
        }
      })
      this.chart.render()
    },
    renderC() {
      this.chart.source(this.data, {
        day: {
          alias: '日期'
        },
        comTotalPoint: {
          alias: '健康分',
          formatter(val) {
            return val + '分'
          }
        },
        comTotalTaskCost: {
          alias: '计算消耗',
          formatter(val) {
            return val + 'CU'
          }
        }
      })

      this.chart.axis('comTotalPoint', {
        grid: null
      })
      this.chart.axis('comTotalTaskCost', {
        grid: null
      })

      this.chart
        .line()
        .position('day*comTotalPoint')
        .color(this.colors[0])
        .size(3)
        .shape('smooth')

      this.chart
        .line()
        .position('day*comTotalTaskCost')
        .color(this.colors[1])
        .size(3)
        .shape('smooth')

      this.chart.legend({
        title: null,
        type: 'cut',
        marker: 'square',
        attachLast: false,
        itemMarginBottom: 20,
        offsetX: 15,
        offsetY: -20,
        position: 'top-left'
      })

      this.chart.tooltip({
        crosshairs: {
          type: 'line'
        }
      })
      this.chart.render()
    }
  }
}
