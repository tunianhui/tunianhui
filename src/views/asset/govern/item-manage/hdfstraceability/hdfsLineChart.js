import * as echarts from 'echarts'
export default {
name: 'hdfsLineChart',
props: {
    data: Array,
},
data() {
    return {

    }
},
render() {
    return <div class="chart" ref="chart" ></div>
},
mounted() {
    // setTimeout(() => {
        this.initcharts()
    // }, 1000)
},
methods: {
    initcharts() {
        const xAxisData = this.data.map(item => item.day)
        const seriesData = this.data.map(item => item.file_size)
        let myChart = echarts.init(this.$refs.chart)
        let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            name: '时间(天)',
            boundaryGap: false
        },
        yAxis: {
            show: true,
            name: '存储量(G)',
            type: 'value',
            min: 0,
            position: 'left',
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#6E7079'
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
        window.addEventListener('resize', function(){
            myChart.resize()
        })
    }
}
}