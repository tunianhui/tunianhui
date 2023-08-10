import G2 from '@antv/g2'
import DataSet from '@antv/data-set'
// const fields = {
//   'actual': '应用规则表数',
//   'strong': '应用强规则表数'
// }
const fieldType = ['actual', 'strong']
export default {
  name: 'BarChart',
  props: {
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 60
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
    return {
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
      const _this = this
      const ds = new DataSet()
      const dv = ds.createView().source(this.data)
      dv.transform({
        type: 'fold',
        fields: [fieldType[0], fieldType[1]],
        key: 'type',
        value: 'value'
      }).transform({
        type: 'map',
        callback(row) {
          row.type = _this.fields[row.type]
          return row
        }
      }).transform({
        type: 'sort-by',
        fields: ['value'],
        order: 'ASC'
      })
      const maxDv = ds.createView().source(dv.rows)
      maxDv.transform({
        type: 'aggregate',
        fields: ['value'],
        operations: ['max'],
        as: ['max']
      })
      this.chart.source(dv.rows, {
        value: {
          min: 0,
          max: maxDv.rows.length ? maxDv.rows[0].max : 0,
          nice: false
        }
      })
      this.chart.axis('type', {
        label: {
          textStyle: {
            fill: '#8d8d8d',
            fontSize: 12
          }
        },
        tickLine: {
          alignWithLabel: false,
          length: 0
        },
        line: {
          lineWidth: 0
        }
      })
      this.chart.axis('value', {
        label: null,
        grid: {
          lineStyle: {
            lineWidth: 0
          }
        }
      })
      this.chart.legend(false)
      this.chart.tooltip(false)
      this.chart.coord().transpose()
      this.chart.interval().position('type*value').size(8).color('type', this.colors)
        .opacity(1)
        .label('value', {
          textStyle: {
            fill: '#333'
          },
          offset: 10
        })
      this.chart.render()
    }
  }
}
