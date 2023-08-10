// import { Handle } from '@antv/x6/lib/addon/common'
import * as echarts from 'echarts'
export default {
name: 'hivecharts',
props: {
    data: Array,
},
data() {
    return {

    }
},
watch: {
  data: {
    handler(data) {
      this.$nextTick(_ => {
        this.initcharts()
      })
    }
  }
},
render() {
    return <div class="chart" ref="chart" ></div>
},
mounted() {
    this.initcharts()
// setTimeout(() => {
//     this.initcharts()
// }, 1500)
},
beforeDestory() {
  window.removeEventListener('resize', function() {
    myChart.resize()
  })
},
methods: {
    initcharts() {
        let that = this
        let myChart = echarts.getInstanceByDom(
          this.$refs.chart
        )
        const xAxisData = this.data.map(item => item.recordTime)
        const seriesData = this.data.map(item => item.totalsize)
        var base = Math.max(...seriesData)
        if (myChart) {
          myChart.dispose(this.$refs.chart)
        }
        myChart = echarts.init(this.$refs.chart)
        let option = {
        // tooltip: {
        //     trigger: 'axis',
        //     axisPointer: {
        //       type: 'cross'
        //     },
        // },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            formatter: function(param) {
              let html = ''
              html += '<div>' + param[0].name + '</div>'
              html += '<div>'
              html +=
                '<i style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; line-height: 10px; margin-right: 5px; background: ' +
                param[0].color +
                '"></i>'
              html +=
                '<span>' +
                param[0].seriesName +
                '</span> ' +
                that.storageConvert(param[0].value)
              html += '</div>'
              return html
            }
          },
        xAxis: {
            type: 'category',
            data: xAxisData,
            name: '时间(天)',
            boundaryGap: false,
            axisLine: {
                symbol: ['none', 'arrow'],
                symbolSize: [7, 15],
                symbolOffset: [0, 11]
            }
        },
        yAxis: {
            show: true,
            name: '存储量',
            type: 'value',
            min: 0,
            position: 'left',
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#6E7079'
                },
                symbol: ['none', 'arrow'],
                symbolSize: [7, 15],
                symbolOffset: [0, 13]
            },
            axisLabel: {
                formatter: function (val) {
                  if (base <= 1024) {
                    return val + 'B'
                  } else if (base <= 1024 * 1024) {
                    return parseFloat((val * 1.024 / 1024).toFixed(1)) + 'K'
                  } else if (base <= 1024 * 1024 * 1024) {
                    return parseFloat((val / (1024 * 1024)).toFixed(1)) + 'M'
                  } else if (base <= 1024 * 1024 * 1024 * 1024) {
                    return parseFloat((val / (1024 * 1024 * 1024)).toFixed(1)) + 'G'
                  } else if (base <= 1024 * 1024 * 1024 * 1024 * 1024) {
                    return parseFloat((val / (1024 * 1024 * 1024 * 1024)).toFixed(1)) + 'T'
                  } else if (base <= 1024 * 1024 * 1024 * 1024 * 1024 * 1024) {
                    return parseFloat((val / (1024 * 1024 * 1024 * 1024 * 1024)).toFixed(1)) + 'P'
                  }
                }
              },
            
        },
        series: [
            {
            name: '存储量',
            data: seriesData,
            type: 'line',
            },
        ]
        }
        myChart.setOption(option)
        // myChart.resize()
        window.addEventListener('resize', function() {
            myChart.resize()
        })
    },
    storageConvert(value) {
        if (value < 1024) {
          return value + 'B'
        } else if (value < 1024 * 1024) {
          return parseFloat((value / 1024).toFixed(2)) + 'K'
        } else if (value < 1024 * 1024 * 1024) {
          return parseFloat((value / (1024 * 1024)).toFixed(2)) + 'M'
        } else if (value < 1024 * 1024 * 1024 * 1024) {
          return parseFloat((value / (1024 * 1024 * 1024)).toFixed(2)) + 'G'
        } else if (value < 1024 * 1024 * 1024 * 1024 * 1024) {
          return (
            parseFloat((value / (1024 * 1024 * 1024 * 1024)).toFixed(2)) + 'T'
          )
        } else if (value < 1024 * 1024 * 1024 * 1024 * 1024 * 1024) {
          return (
            parseFloat((value / (1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2)) +
            'P'
          )
        }
      },
}
}