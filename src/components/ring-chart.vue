<template>
  <div class="ring-chart" ref="chart"></div>
</template>

<script>
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
    activeColor: {
      type: String,
      default: '#eceef1'
    },
    inactiveColor: {
      type: String,
      default: '#0a9afe'
    },
    html: String
  },
  data () {
    return {}
  },
  mounted () {
    this.initChart()
  },
  methods: {
    initChart () {
      this.chart = new G2.Chart({
        container: this.$refs.chart,
        // forceFit: true,
        width: this.width,
        height: this.height
        // padding: 'auto'
      })
      const inactiveData = { type: '其他', value: 100 - this.data.value }
      this.chart.legend(false)
      this.chart.source([this.data, inactiveData])
      this.chart.facet('rect', {
        fields: ['label'],
        padding: 20,
        showTitle: false
      })
      this.chart
        .intervalStack()
        .position('value')
        .color('type', [this.activeColor, this.inactiveColor])
        .opacity(1)
      this.chart.guide().html({
        position: ['50%', '50%'],
        html: `
          <div class="g2-ring-chart-inner">
            <p class="title">${this.data.label}</p>
            <p class="value">${this.data.value}%</p>
          </div>
        `
      })
      this.chart.render()
      insertCss(`
        .g2-ring-chart-inner {
          width: 100px;
          height: 80px;
          vertical-align: middle;
          text-align: center;
          line-height: 0.2;
        }
        .g2-ring-chart-inner .title {
          font-size: 12px;
          color: #8c8c8c;
          font-weight: 300;
        }
        .g2-ring-chart-inner .value {
          font-size: 32px;
          color: #000;
          font-weight: bold;
        }
      `)
    }
  }
}
</script>
