import insertCss from 'insert-css'
import G2 from '@antv/g2'

export default {
  name: 'RingChart',
  props: {
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    data: Object,
    inactiveColor: {
      type: String,
      default: '#E6EAF2'
    },
    activeColor: {
      type: String,
      default: '#0a9afe'
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
          const inactiveData = {title: '其他', value: 100 - data.value}
          this.chartData = [data, inactiveData]
          this.chart.clear()
          this.render()
        })
      }
    }
  },
  render() {
    return <div class="g2-chart-ring" ref="chart"></div>
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      insertCss(`
        .g2-chart-inner {
          vertical-align: middle;
          text-align: center;
        }
        .g2-chart-inner .title {
          font-size: 12px;
          color: #8c8c8c;
          font-weight: 300;
        }
        .g2-chart-inner .value {
          color: #000;
          font-size: 18px;
          font-weight: bold;
        }
      `)
      this.chart = new G2.Chart({
        container: this.$refs.chart,
        forceFit: true,
        height: this.height,
        padding: 'auto'
      })
      this.chart.legend(false)
      this.chart.tooltip(false)
      this.chartData = [this.data]
      this.render()
    },
    render() {
      this.chart.source(this.chartData)
      this.chart.coord('theta', {
        radius: 1,
        innerRadius: 0.75
      })
      this.chart
        .intervalStack()
        .position('value')
        .color('title', [this.activeColor, this.inactiveColor])
        .opacity(1)
      this.renderHtml(this.data.title, this.data.level)
      this.chart.render()
    },
    renderHtml(title, level) {
      this.chart.guide().html({
        position: ['50%', '50%'],
        html: `
          <div class="g2-chart-inner">
            <p class="value">${level || ''}</p>
            <p class="title">${title}</p>
          </div>
        `
      })
    }
  }
}
