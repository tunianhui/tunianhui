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
      default: 320
    },
    data: Array,
    colors: {
      type: Array,
      default: _ => ['#3A9EFF', '#4D5A95']
    },
    prefix: String
  },
  data() {
    return {
      chartData: []
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(data) {
        this.$nextTick(_ => {
          this.chartData = data
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
    return <div class="g2-chart" ref="chart"></div>
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
        padding: [40, 65, 20, 'auto']
      })
      this.render()
    },
    render() {
      const ds = new DataSet()
      const dv = ds.createView().source(this.chartData)
      dv.transform({
        type: 'rename',
        map: {
          num: `${this.prefix} `
        }
      }).transform({
        type: 'fold',
        fields: [`${this.prefix} `],
        key: 'label',
        value: 'score'
      })
      this.chart.source(dv, {
        date: {
          tickCount: Math.min(this.data.length / 2, 0),
          range: [0, 1]
        }
      })
      this.chart.scale('score', {
        type: 'linear',
        min: 0
        // range: [0, 1 - 1 / (dv.rows.length - 1)]
      })
      this.chart.legend({
        title: '',
        marker: 'square',
        itemMarginBottom: 20,
        offsetX: 15,
        offsetY: -10,
        dy: 10,
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
            return val
          }
        }
      })
      this.chart
        .line()
        .position('date*score')
        .color('label', this.colors)
        .shape('smooth')
      // .size(3)
      this.chart.render()
    }
  }
}
