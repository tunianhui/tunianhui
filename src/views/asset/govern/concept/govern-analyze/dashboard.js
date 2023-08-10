import G2 from '@antv/g2'
// import DataSet from '@antv/data-set'

// const isEqual = (v1, v2) => Math.abs(v1 - v2) < 0.5

export default {
  name: 'LineChart2',
  props: {
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 130
    },
    data: Number,
    color: {
      type: String,
      default: '#FC6E6E'
    }
  },
  data() {
    return {
      startAngle: (-10 / 8) * Math.PI,
      endAngle: (2 / 8) * Math.PI,
      size: 6,
      inactiveColor: '#E2E6F0'
    }
  },
  computed: {
    outter() {
      const data = []
      for (let i = 0; i < 100; i++) {
        const item = {}
        item.type = i + ''
        item.value = (i + 1) % 20 === 0 ? 6 : 4
        data.push(item)
      }

      return data
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
        padding: 'auto'
      })
      this.chart.scale({
        type: {
          range: [0, 1]
        },
        value: {
          sync: true
        }
      })
      this.chart.legend(false)
      this.chart.tooltip(false)
      this.render()
    },
    getActiveData() {
      return this.outter.map((d, i) => {
        const obj = {}
        obj.type = d.type
        if (this.data > i) {
          obj.value = this.size
        } else {
          obj.value = 0
        }
        return obj
      })
    },
    render() {
      const activeData = this.getActiveData(this.outter)
      const view1 = this.chart.view()
      view1.source(this.outter)
      view1.axis(false)
      view1.coord('polar', {
        startAngle: this.startAngle,
        endAngle: this.endAngle,
        innerRadius: 0.9,
        radius: 0.95
      })
      view1
        .interval()
        .position('type*value')
        .color(this.inactiveColor)
        .size(2)

      const view2 = this.chart.view()
      view2.source(activeData)
      view2.axis(false)
      view2.coord('polar', {
        startAngle: this.startAngle,
        endAngle: this.endAngle,
        innerRadius: 0.9,
        radius: 0.95
      })
      view2
        .interval()
        .position('type*value')
        .color('value', this.color)
        .opacity(1)
        .size(2)
      view2.guide().html({
        position: ['50%', '56%'],
        html: `<div style="width: 100px; text-align: center;">
          <div style="font-size: 14px; color: #555555;">健康分</div>
          <div style="font-size: 28px; color: #000000;">${this.data}</div>
        </div>
        `
      })

      const view3 = this.chart.view()
      view3.axis(false)
      view3.coord('polar', {
        startAngle: this.startAngle,
        endAngle: this.endAngle,
        innerRadius: 0.8,
        radius: 0.7
      })
      view3.scale('value', {
        min: 0,
        max: 100,
        tickInterval: 1,
        nice: false
      })

      view3.axis(false)

      view3
        .point()
        .position('value*1')
        .shape('pointer')

      // 绘制仪表盘背景
      view3.guide().arc({
        zIndex: 0,
        top: false,
        start: [0, 0.945],
        end: [100, 0.945],
        style: {
          // 底灰色
          stroke: this.inactiveColor,
          lineWidth: 12
        }
      })
      // 绘制指标
      view3.guide().arc({
        zIndex: 1,
        start: [0, 0.945],
        end: [this.data, 0.945],
        style: {
          stroke: this.color,
          lineWidth: 12
        }
      })

      this.chart.render()
    }
  }
}
