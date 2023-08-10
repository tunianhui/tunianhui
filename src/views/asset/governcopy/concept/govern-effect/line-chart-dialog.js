import G2 from '@antv/g2'
// import DataSet from '@antv/data-set'

export default {
  name: 'LineChartDialog',
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
    unit: String
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
          this.render()
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
        padding: [50, 65, 25, 'auto']
      })
      this.render()
    },
    render() {
      this.chart.source(this.data, {
        date: {
          alias: '日期',
          tickCount: Math.min(this.data.length / 2, 10)
        },
        score: {
          alias: '健康分',
          formatter(val) {
            return val + '分'
          }
        },
        count: {
          alias: `存储量`,
          formatter: val => {
            return val + this.unit
          }
        }
      })

      this.chart.axis('score', {
        grid: null
      })

      this.chart.axis('count', {
        grid: null
      })

      this.chart
        .line()
        .position('date*score')
        .color(this.colors[0])
        .size(3)
        .shape('smooth')

      this.chart
        .line()
        .position('date*count')
        .color(this.colors[1])
        .size(3)
        .shape('smooth')

      this.chart.legend({
        title: null,
        marker: 'square',
        attachLast: false,
        itemMarginBottom: 20,
        offsetX: 15,
        offsetY: -15,
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
