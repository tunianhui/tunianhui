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
    },
    prefix: String
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
          if (this.prefix === '存储') {
            this.render()
          } else {
            this.renderC()
          }
          // this.render()
        })
      }
    },
    prefix: {
      handler() {
        this.chart.clear()
        if (this.prefix === '存储') {
          this.render()
        } else {
          this.renderC()
        }
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
      if (this.prefix === '存储') {
        this.render()
      } else {
        this.renderC()
      }
    },

    render() {
      this.chart.source(this.data, {
        day: {
          alias: '日期',
          // tickCount: Math.min(this.data.length / 2, 10)
        },
        stoSave: {
          alias: '治理率',
          formatter(val) {
            return val + '%'
          }
        },
        stoDealRate: {
          alias: `${this.prefix}优化量`,
          formatter(val) {
            // if (val < 1024) {
            //   return val + 'B'
            // } else if (val < 1024 * 1024) {
            //   return parseFloat((val / 1024).toFixed(2)) + 'K'
            // } else if (val < 1024 * 1024 * 1024) {
            //   return parseFloat((val / (1024 * 1024)).toFixed(2)) + 'M'
            // } else if (val < 1024 * 1024 * 1024 * 1024) {
            //   return parseFloat((val / (1024 * 1024 * 1024)).toFixed(2)) + 'G'
            // } else if (val < 1024 * 1024 * 1024 * 1024 * 1024) {
            //   return (
            //     parseFloat((val / (1024 * 1024 * 1024 * 1024)).toFixed(2)) + 'T'
            //   )
            // } else if (val < 1024 * 1024 * 1024 * 1024 * 1024 * 1024) {
            //   return (
            //     parseFloat((val / (1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2)) +
            //     'P'
            //   )
            // }
            return val + 'GB'
          }
        }
      })
      this.chart.axis('stoDealRate', {
        grid: null,
        // label: {
        //   formatter(val) {
        //     if (val < 1024) {
        //       return val + 'B'
        //     } else if (val < 1024 * 1024) {
        //       return parseFloat((val / 1024).toFixed(2)) + 'K'
        //     } else if (val < 1024 * 1024 * 1024) {
        //       return parseFloat((val / (1024 * 1024)).toFixed(2)) + 'M'
        //     } else if (val < 1024 * 1024 * 1024 * 1024) {
        //       return parseFloat((val / (1024 * 1024 * 1024)).toFixed(2)) + 'G'
        //     } else if (val < 1024 * 1024 * 1024 * 1024 * 1024) {
        //       return (
        //         parseFloat((val / (1024 * 1024 * 1024 * 1024)).toFixed(2)) + 'T'
        //       )
        //     } else if (val < 1024 * 1024 * 1024 * 1024 * 1024 * 1024) {
        //       return (
        //         parseFloat((val / (1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2)) +
        //         'P'
        //       )
        //     }
        //    
        //     // return val + 'MB'
        //   }
        // }
      })

      this.chart.axis('stoSave', {
        grid: null
      })

      this.chart
        .line()
        .position('day*stoDealRate')
        .color(this.colors[0])
        .size(3)
        .shape('smooth')

      this.chart
        .line()
        .position('day*stoSave')
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
    },
    renderC() {
     
      this.chart.source(this.data, {
        day: {
          alias: '日期',
          // tickCount: Math.min(this.data.length / 2, 10)
        },
        comSave: {
          alias: '治理率',
          formatter(val) {
            return val + '%'
          }
        },
        comDealRate: {
          alias: `${this.prefix}优化量`,
          formatter(val) {
            return val + 'CU'
          }
        }
      })
      this.chart.axis('comDealRate', {
        grid: null
      })

      this.chart.axis('comSave', {
        grid: null
      })

      this.chart
        .line()
        .position('day*comDealRate')
        .color(this.colors[0])
        .size(3)
        .shape('smooth')

      this.chart
        .line()
        .position('day*comSave')
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
