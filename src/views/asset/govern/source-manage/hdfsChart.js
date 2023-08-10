// import { Handle } from '@antv/x6/lib/addon/common'
import * as echarts from 'echarts'
export default {
name: 'hdfsChart',
props: {
    data: Object,
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
    // this.initcharts()
// setTimeout(() => {
//     this.initcharts()
// }, 500)
},
methods: {
    initcharts() {
      let myChart = echarts.getInstanceByDom(
        this.$refs.chart
      )
      let that = this
      const data = this.data.hdfsClusterList
      const xAxisData = data.map(item => item.recordTime)
      const seriesData = data.map(item => item.capacityUsed)
      const seriesData3 = data.map(item => item.capacityTotal)
      // var base = Math.max(...seriesData)
      var base = Math.max(...seriesData3)
      if (myChart) {
        myChart.dispose()
      }
      myChart = echarts.init(this.$refs.chart)
      let option = {
        dataZoom: [{
          type: 'inside'
        }],
        backgroundColor: '#FFFFFF',
        tooltip: {
            trigger: 'axis',
            // axisPointer: {
            //   type: 'cross'
            // },
            formatter: function(param) {
                that.data.hdfsClusterList.forEach(item=> {
                    if (param[1].value === item.capacityUsed) {
                        that.add = item.capacityUsedPercent
                    }
                })
                let html = ''
                html += '<div>' + param[0].name + '</div>'
                for(let k in param) {
                html += '<div>'
                html +=
                    '<i style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; line-height: 10px; margin-right: 5px; background: ' +
                    param[k].color +
                    '"></i>'
                html +=
                    '<span>' +
                    param[k].seriesName +
                    '</span> ' +
                    that.storageConvert(param[k].value)
                html += '</div>'
              }
              html += '<p>' 
              html += '<i style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; line-height: 10px; margin-right: 5px; background: #A18F14"></i>'
              html += '使用率' + that.add + '%' + '</p>'
              return html
            }
        },
        legend: {
            data: [{
                name: '总存储量',
                icon: 'rect'
            },
            {
              name: '已使用存储量',
              icon: 'rect'
          }
          ],
            top: 8,
            left: 20,
            itemWidth: 10,
            itemHeight:10,
        },
        // title: {
        //     left: 'center',
        //     text: '存储量'
        // },
        grid: {
            left: '4%',
            right: '4%',
            top: '18%',
            bottom: '10%'
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            name: '时间',
            nameTextStyle: {
              color: '#7B7B7B'
            },
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#DEDEDE',
                width: 2,
              },
              // symbol: ['none', 'arrow'],
                // symbolSize: [7, 15],
                // symbolOffset: [0, 11]
            },
            axisLabel: {
              textStyle: {
                  color: '#7B7B7B',//坐标值得具体的颜色
              }
            },
            axisTick: {
              lineStyle: {
                width: 2,
              }
            }
        },
        yAxis: {
            show: true,
            // name: '存储量',
            type: 'value',
            min: 0,
            position: 'left',
            // axisLine: {
            //     show: true,
            //     lineStyle: {
            //         color: '#6E7079'
            //     },
            //     symbol: ['none', 'arrow'],
            //     symbolSize: [7, 15],
            //     symbolOffset: [0, 13]
            // },
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
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
                data: seriesData3,
                type: 'line',
                smooth: true,
                name: '总存储量',
                showSymbol: false,
                itemStyle: {
                  color: '#91CC75'
                },
                // symbol: 'none'
              },
              {
                name: '已使用存储量',
                data: seriesData,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  // color: '#99CC33'
                },
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