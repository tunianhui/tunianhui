import * as echarts from 'echarts'
export default {
name: 'snapshotManifest',
props: {
    data: Array,
},
data() {
    return {

    }
},
render() {
    return <div class="chart1" ref="chart" ></div>
},
mounted() {
  this.initchart()
  // setTimeout(() => {
  //   this.initchart()
  // }, 1500)
},
methods: {
    initchart() {
        const data = this.data
        const xAxisData = data.map(item => item.day)
        const seriesData1 = data.map(item => parseFloat(item.snapNumFiles))
        const seriesData2 = data.map(item => parseFloat(item.maniNumfiles))
        let mycharts = echarts.init(this.$refs.chart)
        let option = {
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              },
            //   formatter: function(param) {
            //     let html = ''
            //     html += '<div>' + param[0].name + '</div>'
            //     for(let k in param) {
            //       html += '<div>'
            //       html +=
            //         '<i style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; line-height: 10px; margin-right: 5px; background: ' +
            //         param[k].color +
            //         '"></i>'
            //       html +=
            //         '<span>' +
            //         param[k].seriesName +
            //         '</span>: ' +
            //        (param[k].value + '%')
            //       html += '</div>'
            //     }
            //       return html
            //   }
          },
          xAxis: {
            type: 'category',
            data: xAxisData,
            name: '时间(天)',
            boundaryGap: false
          },
          yAxis: {
              show: true,
              name: '文件数(天)',
              type: 'value',
              // boundaryGap: [0, '100%'],
              // min: 0,
              position: 'left',
              axisLine: {
                  show: true,
                  lineStyle: {
                      color: '#6E7079'
                  }
              },
              axisLabel: {
                show: true,
                // formatter: '{value}%'
              }
              
          },
          series: [
            {
              data: seriesData1,
              type: 'line',
              smooth: true,
              name: '快照'
            },
            {
              data: seriesData2,
              type: 'line',
              smooth: true,
              name: 'manifest'
            },
          ]
        }
        mycharts.setOption(option)
        window.addEventListener('resize', function() {
          mycharts.resize()
        })
      },
}
}