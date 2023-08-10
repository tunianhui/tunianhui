// import { Handle } from '@antv/x6/lib/addon/common'
import * as echarts from 'echarts'
export default {
name: 'yarnMChart',
props: {
    data: Object,
},
data() {
    return {

    }
},
watch: {
    data: {
        handler(val) {
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
        const data = that.data.yarnTrendList
        let xAxisData = []
        let seriesData = []
        let seriesData3 = []
        if (this.data.type === 'm') {
            xAxisData = data.map(item => item.createdTime)
            seriesData = data.map(item => item.memoryUsed)
            seriesData3 = data.map(item => item.memoryTotal)
        } else {
            xAxisData = data.map(item => item.createdTime)
            seriesData = data.map(item => item.memoryUsedAvg)
            seriesData3 = data.map(item => item.memoryTotalMax)
        }
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
            //指示器
            // axisPointer: {
            //   type: 'cross'
            // },
            formatter: function(param) {
                that.data.yarnTrendList.forEach(item=> {
                    if (param[1].value === item.memoryUsed || param[1].value === item.memoryUsedAvg) {
                        that.add = item.memoryUsedPercent
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
                        // param[0].value
                    '</div>'
                }
                html += '<p>' 
                html += '<i style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; line-height: 10px; margin-right: 5px; background: #A18F14"></i>'
                html += '使用率' + that.add + '%' + '</p>'
              return html
              
            }
        },
        legend: {
            data: [{
                name: '已使用内存',
                icon: 'rect'
            },{
                name: '总内存',
                icon: 'rect'
            }],
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
                }
                // symbol: ['none', 'arrow'],
                // symbolSize: [7, 15],
                // symbolOffset: [0, 11]
            },
            axisLabel: {
                textStyle: {
                    color: '#7B7B7B'
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
                    return val + 'M'
                  } else if (base <= 1024 * 1024) {
                    return parseFloat((val * 1.024 / 1024).toFixed(1)) + 'G'
                  } else if (base <= 1024 * 1024 * 1024) {
                    return parseFloat((val / (1024 * 1024)).toFixed(1)) + 'T'
                  } else if (base <= 1024 * 1024 * 1024 * 1024) {
                    return parseFloat((val / (1024 * 1024 * 1024)).toFixed(1)) + 'P'
                  } 
                }
              },
            
        },
        series: [
            
            {
                data: seriesData3,
                type: 'line',
                smooth: true,
                name: '总内存',
                // symbol: 'none',
                itemStyle: {
                    color: '#99CC33'
                },
                showSymbol: false,
             },
             {
                name: '已使用内存',
                data: seriesData,
                type: 'line',
                // symbol: 'none',
                itemStyle: {
                    color: '#336699'
                },
                showSymbol: false,
                },
        ]
        }
        myChart.setOption(option)
        window.addEventListener('resize', function() {
            myChart.resize()
        })
    },
    storageConvert(value) {
        if (value < 1024) {
          return value + 'M'
        } else if (value < 1024 * 1024) {
          return parseFloat((value / 1024).toFixed(2)) + 'G'
        } else if (value < 1024 * 1024 * 1024) {
          return parseFloat((value / (1024 * 1024)).toFixed(2)) + 'T'
        } else if (value < 1024 * 1024 * 1024 * 1024) {
          return parseFloat((value / (1024 * 1024 * 1024)).toFixed(2)) + 'P'
        } 
    },
}
}