// import { Handle } from '@antv/x6/lib/addon/common'
import * as echarts from 'echarts'
export default {
name: 'yarnChart',
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
            seriesData = data.map(item => item.vcoresUsed)
            seriesData3 = data.map(item => item.vcoresTotal)
        } else {
            xAxisData = data.map(item => item.createdTime)
            seriesData = data.map(item => item.vcoresUsedAvg)
            seriesData3 = data.map(item => item.vcoresTotalMax)
        }
        if (myChart) {
            myChart.dispose()
        }
        myChart = echarts.init(this.$refs.chart)
        let option = {
            dataZoom: [{
                type: 'inside'
              }],
        // tooltip: {
        //     trigger: 'axis',
        //     axisPointer: {
        //       type: 'cross'
        //     },
        // },
        backgroundColor: '#FFFFFF',
        tooltip: {
            trigger: 'axis',
            // axisPointer: {
            //   type: 'cross'
            // },
            formatter: function(param) {
                console.log(param)
                that.data.yarnTrendList.forEach(item=> {
                    if (param[1].value === item.vcoresUsed || param[1].value === item.vcoresUsedAvg) {
                        that.add = item.vcoresUsedPercent
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
                    param[k].value
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
                name: '总CPU',
                icon: 'rect'
            },{
                name: '已使用CPU',
                icon: 'rect'
            }
        ],
            top: 8,
            left: 20,
            itemWidth: 10,
            itemHeight:10,
        },
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
                    width: 2,
                    color: '#DEDEDE'
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
                    // color: '#DEDEDE'
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
            }      
        },
        series: [
            {
                data: seriesData3,
                type: 'line',
                smooth: true,
                name: '总CPU',
                // symbol: 'none',
                itemStyle: {
                    color: '#CCCC33'
                },
                showSymbol: false,
             },
             {
                name: '已使用CPU',
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
    }
}
}