import G2 from '@antv/g2'
import DataSet from '@antv/data-set'

export default {
  name: 'LineChart',
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
          // this.chartData = [data]
          this.chart.clear()
          this.render()
          // this.chart.changeData([data, inactiveData])
          // this.chart.repaint()
        })
      }
    }
  },
  render() {
    return <div class="g2-line-chart" ref="chart"></div>
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = new G2.Chart({
        container: this.$refs.chart,
        forceFit: true,
        width: this.width,
        height: this.height,
        padding: [30, 'auto']
      })
      this.render()
    },
    render() {
      const ds = new DataSet()
      const dv = ds.createView().source(this.data)
      dv.transform({
        type: 'rename',
        map: {
          actual: '存储健康分',
          mean: '存储健康分（均值）'
        }
      }).transform({
        type: 'fold',
        fields: ['存储健康分', '存储健康分（均值）'],
        key: 'label',
        value: 'score'
      })
      this.chart.source(dv, {
        date: {
          tickCount: this.data.length / 2
        }
      })
      this.chart.legend({
        title: null,
        marker: 'square',
        itemMarginBottom: 20,
        offsetX: 15,
        dy: 10,
        // itemWidth: 24,
        position: 'top-left'
      })

      this.chart.tooltip({
        crosshairs: {
          type: 'line'
        }
      })
      this.chart.axis('score', {
        label: {
          formatter(val) {
            return val + '分'
          }
        }
      })
      this.chart
        .line()
        .position('date*score')
        .color('label')
        .shape('smooth')
      this.chart.render()
    }
  }
}
