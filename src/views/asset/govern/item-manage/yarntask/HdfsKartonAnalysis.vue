<template>
    <section>
        <div class="chart"  style="min-width: 670px;  height: 300px;" ref="chart"></div>
        <div class="chart1" ref="chart1" style="min-width: 670px;  height: 300px;"></div>
    </section>
</template>

<script>
import * as echarts from 'echarts'
import {getTasksDataAndTimeRatio, getSparkStageMetrics, getStageJudge} from '@/api/govern/item-manage'
export default {
    name: 'HdfsKartonAnalysis',
    props: {
        data: Object,
        getWidth: Number,
        applicationAttemptId: {
            type: Number,
            // default: 0
        }
    },
    data() {
        return {
            sparkStageMetricsList: [],
            StageJudge: '',
            medianValue: '',
            taskReadRatio: [],
            StageId: '',
            attemptId: '',
            timer: 0,
            JobId: '',
            propVal: '',
        }
    },
    watch:{
        getWidth: {
            immediate: true,
            handler(val) {
                this.$nextTick(_ => {
                    if (this.sparkStageMetricsList.length) {
                        this.initchart()  
                        this.initchart1()
                    }
                })
            }
        },
        data: {
            immediate: true, // 只在数据加载后执行，即不要在数据加载时延迟执行。 这对
            handler(val) {
                if (this.data && this.applicationAttemptId) {
                    this.debounceFun()
                }
                this.propVal = ''
            }
        },
        applicationAttemptId: {
            immediate: true,
            handler() {
                if (this.applicationAttemptId) {
                  this.debounceFun()  
                }
                this.propVal = ''
            }
        }
    },
    mounted() {
        // this.getStageJudge()
        // this.getSparkStageMetrics('task_read_rate_median_min_ratio')
        // this.getTasksDataAndTimeRatio()
    },
    methods: { 
        debounceFun() {
            clearTimeout(this.timer)
            this.timer = setTimeout(_ => {
                this.getStageJudge()
                this.getSparkStageMetrics('task_read_rate_median_min_ratio')
            }, 900)
        },
        initchart() {
            const data = this.sparkStageMetricsList
            let myChart = echarts.getInstanceByDom(
                this.$refs.chart
            )
            if (myChart) {
                myChart.dispose()
            }
            let that = this
            var add = []
            let legenddata = ['数据正常Stage', '数据卡顿Stage']
            data.forEach(item => {
                let itemObject = {}
                if (Number(item.propValue) > Number(this.StageJudge)) {
                    itemObject = {
                        product: item.stageAndAttempt,
                        data: ['', item.propValue]
                    }
                } else {
                    itemObject = {
                        product: item.stageAndAttempt,
                        data: [item.propValue, '']
                    }
                }
                add.push(itemObject)
            })
            myChart = echarts.init(this.$refs.chart)
            let xAxis=[]
                let xAxisitem={
                    type: 'category',
                    data: '',
                    position: 'bottom',
                    name: 'Stage id',
                    // nameTextStyle: {
                    //     color: '#7B7B7B'
                    // },
                }
                let xAxisitemdata=[]
                for (let i = 0; i < add.length ; i++) {
                    xAxisitemdata=[]
                    for (let i = 0; i < add.length ; i++) {
                        xAxisitemdata.push('')
                    }
                    xAxisitemdata[i]=add[i].product
                    xAxisitem.data=JSON.parse(JSON.stringify(xAxisitemdata))
                    xAxis.push(JSON.parse(JSON.stringify(xAxisitem)))
                }
                let series=[]
                const colorsList = ['#6CDDD6', 'red']
                for (let j = 0; j < add.length; j++) {
                    for (let i = 0; i < add[j].data.length; i++) {
                        let newArrList = [];
                        for (let a = 0; a < j; a++) {
                            newArrList.push("");
                        }
                        newArrList[j] = add[j].data[i];
                        for (let k = 0; k < legenddata.length; k++) {
                            let seriesitem={
                                type: 'bar',
                                name:legenddata[i],
                                barWidth: '20',
                                xAxisIndex: j,
                                data: newArrList,
                                color: colorsList[i]
                            }
                            let a = j % legenddata.length;
                            if(add[j].data[i] && k===a){
                                series.push(JSON.parse(JSON.stringify(seriesitem)))
                            }
                        }
                    }
                }
                let series1= JSON.parse(JSON.stringify(series))
            let option = {
                dataZoom: [{
                    type: 'inside'
                }],
                title: {
                    text: '每个Stage中任务处理数据速率的中位值和最小值的比值的分布图',
                    textStyle:{
                        fontSize: 14,
                        fontWeight: 'normal'
                    }
                },
                legend: {
                    data: [{name:'数据正常Stage'}, {name:'数据卡顿Stage'}],
                    right: 20
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow',
                    z: 0,
                    axisPointer:{
                        shadowStyle: {
                            shadowColor: ''
                        },
                        shadowStyle:{
                            opacity: 0.2
                        }
                    }
                    },
                    formatter: function (params) {
                        var html = '';
                        if (params.length != 0) {
                            var getName = params[0].name;
                            // html +=  'task id ' + getName + '<br/>';
                            for (var i = 0; i < params.length; i++) {
                                if (
                                    params[i].value != null &&
                                    // params[i].value != 0 &&
                                    params[i].value != ''
                                ) {
                                    html += params[i].marker;
                                    // html += params[i].seriesName + ':' + paramValue + '</br>'
                                    html += params[i].seriesName + ': ' + params[i].value + '<br/>';
                                }
                            }
                        }
                        return html;
                    }
                },
                grid: {
                    // left: '3%',
                    // right: '4%',
                    bottom: '8%',
                    // containLabel: true
                },
                xAxis: xAxis,
                yAxis: [
                    {
                    type: 'value',
                    name: 'median/min'
                    }
                ],
                series: series1
            }
            myChart.setOption(option)
            myChart.getZr().on('click', params => {
                let pointInPixel = [params.offsetX, params.offsetY]
                if (myChart.containPixel('grid', pointInPixel)) {
                    let pointInGrid = myChart.convertFromPixel({ seriesIndex: 0 }, pointInPixel)
                    let xIndex = pointInGrid[0]
                    this.StageId = data[xIndex].stageId
                    this.attemptId = data[xIndex].attemptId
                    this.JobId = data[xIndex].jobId 
                    this.propVal = data[xIndex].propValue	
                    this.getTasksDataAndTimeRatio()
                }
            })
           
            // window.addEventListener('resize', function() {
            //     myChart.resize()
            // })
        },
        initchart1() {
            const data = this.taskReadRatio
            let myChart = echarts.getInstanceByDom(
                this.$refs.chart1
            )
            if (myChart) {
                myChart.dispose()
            }
            let that = this
            var add = []
            let legenddata = ['正常值', '最小值']
            if (this.propVal === '' || Number(this.propVal) > Number(this.StageJudge)) {
                let minValue = data[0].dataAndTimeRatio
                data.forEach(item => {
                    if (minValue > item.dataAndTimeRatio) {
                        minValue = item.dataAndTimeRatio
                    } 
                })
                data.forEach(item => {
                    let itemObject = {}
                    if (item.dataAndTimeRatio > minValue) {
                        itemObject = {
                            product: item.taskId,
                            data: [item.dataAndTimeRatio, '']
                        }
                    } else {
                        itemObject = {
                            product: item.taskId,
                            data: ['', item.dataAndTimeRatio]
                        }
                    }
                    add.push(itemObject)
                })
            } else {
                data.forEach(item => {
                    let itemObject = {}
                    itemObject = {
                        product: item.taskId,
                        data: [item.dataAndTimeRatio, '']
                    }
                    add.push(itemObject)
                })
            }
            
            myChart = echarts.init(this.$refs.chart1)
            let xAxis=[]
                let xAxisitem={
                    type: 'category',
                    data: '',
                    position: 'bottom',
                    name: 'task id',
                    // nameTextStyle: {
                    //     color: '#7B7B7B'
                    // },
                }
                let xAxisitemdata=[]
                for (let i = 0; i < add.length ; i++) {
                    xAxisitemdata=[]
                    for (let i = 0; i < add.length ; i++) {
                        xAxisitemdata.push('')
                    }
                    xAxisitemdata[i]=add[i].product
                    xAxisitem.data=JSON.parse(JSON.stringify(xAxisitemdata))
                    xAxis.push(JSON.parse(JSON.stringify(xAxisitem)))
                }
                let series=[]
                const colorsList = ['#6CDDD6', 'red']
                for (let j = 0; j < add.length; j++) {
                    for (let i = 0; i < add[j].data.length; i++) {
                        let newArrList = [];
                        for (let a = 0; a < j; a++) {
                            newArrList.push("");
                        }
                        newArrList[j] = add[j].data[i];
                        for (let k = 0; k < legenddata.length; k++) {
                            let seriesitem={
                                type: 'bar',
                                name:legenddata[i],
                                barWidth: '20',
                                xAxisIndex: j,
                                data: newArrList,
                                color: colorsList[i]
                            }
                            let a = j % legenddata.length;
                            if(add[j].data[i] && k===a){
                                series.push(JSON.parse(JSON.stringify(seriesitem)))
                            } else if (add[j].data[i] === 0 && k===a) {
                                series.push(JSON.parse(JSON.stringify(seriesitem)))
                            }
                        }
                    }
                }
                let series1= JSON.parse(JSON.stringify(series))
            let option = {
                dataZoom: [{
                    type: 'inside'
                }],
                title: {
                    text: `job[${that.JobId}] Stage[${that.StageId}]每个task读取数据量与耗时比值的分布情况(MB/s)`,
                    textStyle:{
                        fontSize: 14,
                        fontWeight: 'normal'
                    }
                },
                legend: {
                    data: [{name:'正常值'}, {name:'最小值'}],
                    right: 20
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow',
                    z: 0,
                    axisPointer:{
                        shadowStyle: {
                            shadowColor: ''
                        },
                        shadowStyle:{
                            opacity: 0.2
                        }
                    }
                    },
                    formatter: function (params) {
                        var html = '';
                        if (params.length != 0) {
                            var getName = params[0].name;
                            // html +=  'task id ' + getName + '<br/>';
                            for (var i = 0; i < params.length; i++) {
                                if (
                                    params[i].value != null &&
                                    params[i].value != 0 &&
                                    params[i].value != ''
                                ) {
                                    
                                    html += params[i].marker;
                                    // html += params[i].seriesName + ':' + paramValue + '</br>'
                                    html += params[i].seriesName + ': ' + params[i].value + '<br/>';
                                } else if (params[i].value === 0) {
                                    html += params[i].marker;
                                    // html += params[i].seriesName + ':' + paramValue + '</br>'
                                    html += params[i].seriesName + ': ' + params[i].value + '<br/>';
                                }
                            }
                        }
                        return html;
                    }
                },
                grid: {
                    // left: '3%',
                    // right: '4%',
                    bottom: '8%',
                    // containLabel: true
                },
                xAxis: xAxis,
                yAxis: [
                    {
                    type: 'value',
                    name: 'inputSize/duration'
                    }
                ],
                series: series1
            }
            myChart.setOption(option)
        },
        async getTasksDataAndTimeRatio() {
            // this.getSparkStageMetrics('task_read_median_rate')
            const param = {
                applicationId: this.data.taskId,
                applicationAttemptId: this.applicationAttemptId,
                stageId: this.StageId,
                attemptId: this.attemptId
            }
            const res = await this.$simpleAsyncTo(getTasksDataAndTimeRatio(param), '获取tasks读取数据量与耗时比值查询数据失败')
            if (res) {
                this.taskReadRatio = res.data
                this.$nextTick(_=> {
                 this.initchart1()   
                })
            }
        },
        async getSparkStageMetrics(data) {
            const param = {
                applicationId: this.data.taskId,
                applicationAttemptId: this.applicationAttemptId,
                propName: data,
                stageId: data === 'task_read_median_rate' ? this.StageId : undefined,
                attemptId: data === 'task_read_median_rate' ? this.attemptId : undefined
            }
            const res = await this.$simpleAsyncTo(getSparkStageMetrics(param), '获取stage任务属性查询数据失败') 
            if(res) {
                if (data === 'task_read_rate_median_min_ratio') {
                    this.sparkStageMetricsList = res.data
                    const StageData = []
                    res.data.forEach(item => {
                        if (Number(item.propValue) > Number(this.StageJudge)) {
                            StageData.push(item)
                        }
                    })
                    if (StageData.length) {
                        this.StageId = StageData[0].stageId
                        this.attemptId = StageData[0].attemptId
                        this.JobId = StageData[0].jobId
                    }
                    this.getTasksDataAndTimeRatio()
                    this.initchart()
                }
                //  else {
                //     this.medianValue = res.data[0].propValue
                // }
                
            }
        },
        async getStageJudge() {
            const param = {
                computeId: this.data.id,
                propName: 'task_read_rate_median_min_ratio'
            }
            const res = await this.$simpleAsyncTo(getStageJudge(param), '获取stage治理属性查询数据失败')
            if (res) {
                this.StageJudge = res.data[0].propValue
            }
        }


    }   // methods are functions that can be called on an object.  methods can also be chained.  methods can also be async

}
</script>

<style>

</style>