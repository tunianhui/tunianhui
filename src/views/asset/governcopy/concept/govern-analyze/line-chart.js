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
    }
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
        padding: [60, 'auto']
      })
      this.render()
    },
    render() {
      this.chart.source(this.data, {
        date: {
          alias: '日期'
        },
        score: {
          alias: '健康分',
          formatter(val) {
            return val + '分'
          }
        },
        consume: {
          alias: '存储消耗',
          formatter(val) {
            return val + 'GB'
          }
        }
      })

      this.chart.axis('score', {
        grid: null
      })
      this.chart.axis('consume', {
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
        .position('date*consume')
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
