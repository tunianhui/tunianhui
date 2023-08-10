import G2 from '@antv/g2'
import DataSet from '@antv/data-set'

export default {
  name: 'PieChart',
  props: {
    width: {
      type: Number,
      default: 120
    },
    height: {
      type: Number,
      default: 120
    },
    data: Array,
    colors: {
      type: Array,
      default: _ => ['#8FD0A4', '#4D5A95']
    },
    fields: {
      type: Object
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
    return <div class="g2-pie-chart" ref="chart"></div>
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
        width: this.watch,
        padding: ['auto', 'auto', 'auto', 'auto']
      })
      this.render()
    },
    render() {
      const ds = new DataSet()
      const dv = ds.createView().source(this.data)
      dv.transform({
        type: 'percent',
        field: 'value',
        dimension: 'type',
        as: 'percent'
      })
      this.chart.source(dv)
      this.chart.legend(false)
      this.chart.coord('theta', {
        radius: 1,
        innerRadius: 0.6
      })
      this.chart.tooltip({
        showTitle: false
      })
      this.chart.intervalStack().position('value').color('type', this.colors)
        .opacity(1)
      this.chart.render()
    }
  }
}
