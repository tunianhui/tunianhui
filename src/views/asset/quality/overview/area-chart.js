import G2 from '@antv/g2'
import DataSet from '@antv/data-set'

// const fields = {
//   'totalRuledTableCount': '应用规则表数',
//   'totalStrongRuledTableCount': '应用强规则表数'
// }
// const fieldType = ['actual', 'strong']

export default {
  name: 'AreaChart',
  props: {
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 240
    },
    data: Array,
    colors: {
      type: Array,
      default: _ => ['#4D5A95', '#8FD0A4']
    },
    fields: {
      type: Object
    }
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
    return <div class="g2-chart1" ref="chart"></div>
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
        padding: ['auto', 50, 'auto', 'auto']
      })
      this.render()
    },
    render() {
      console.log(this.data)
      const _this = this
      const ds = new DataSet()
      const dv = ds.createView().source(this.data)
      dv.transform({
        type: 'fold',
        fields: _this.fields.fields,
        key: 'type',
        value: 'value'
      }).transform({
        type: 'map',
        callback(row) {
          row.type = _this.fields.label[row.type]
          return row
        }
      })
      this.chart.source(dv.rows, {
        date: {
          tickCount: dv.rows.length / 2
        }
      })
      this.chart.legend('type', {
        position: 'top-left'
      })
      // this.chart.scale('date', {type: 'timeCat'})
      this.chart.areaStack().position('date*value').color('type', this.colors)
      this.chart.lineStack().position('date*value').color('type', this.colors).size(2).shape('circle')
      this.chart.render()
    }
  }
}
