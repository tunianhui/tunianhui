<template>
    <section>
        <div style="min-width: 700px;">
            <!-- <div class="chart" style=" height: 300px; width: 100%;" ref="chart"></div>
            <div class="chart1"  ref="chart1" style="height: 300px;"></div> -->
            <div class="chart" :style="{width: getWidth + 'px'}" style="min-width: 660px; height: 300px;" ref="chart"></div>
            <div class="chart1" :style="{width: getWidth + 'px'}"  ref="chart1" style="height: 300px;"></div>
        </div>
        <div>
            <div class="bottom">
                <div class="bottom-left">
                    <div style="margin: 0 auto;" >分析结论
                    </div>
                </div>
                <div class="bottom-right">
                    <div class="box">
                        <div v-if="taskList.length !== 0">
                          <div id="centent"   v-for="item in taskList" :key="item.key">
                            <p>
                                <span @click="jumpToJobId(JobId)">job[{{ JobId}}]</span>
                                <span @click="jumpToStage(item.stageId)">.stage[{{ item.stageId }}]</span>
                                <span @click="jumpToTask(item.taskId)">.task[{{ item.taskId }}]</span>
                                shuffle_read的数据量为<span style="color: #E99CB3;">{{item.taskMetricsInputMetricsRecordsRead}}</span>中位值为{{mediaLine}}，读取的数据量严重超过Stage下的中位值，发生数据倾斜。</p>
                         </div>  
                        </div>
                        
                        <div v-else  id="centent">
                            <p>
                                <!-- <span @click="jumpToJobId(JobId)">job[{{ JobId }}]</span> -->
                                <!-- <span @click="jumpToStage(item.stageId)">.stage[{{ item.stageId }}]</span>
                                <span @click="jumpToTask(item.taskId)">.task[{{ item.taskId }}]</span> -->
                                此阶段未检测到数据倾斜任务。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import {getSparkStageMetrics, getStageJudge,getSparkTasks, getJobId} from '@/api/govern/item-manage'
import * as echarts from 'echarts'
export default {
    name: 'taskSkew',
    props: {
        data: Object,
        getWidth: Number,
        applicationAttemptId: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            SparkStageMetrics: [],
            mediaLine: 0,
            sparkTasksList: [],
            taskList: [],
            JobId: '',
            timer: 0,
            attemptId: '',
            stageIdData: '',
            computeId:'',
            jobIdData: '',
        }
    },
    watch:{
        getWidth: {
            immediate: true,
            handler(val) {
                this.$nextTick(_ => {
                    if (this.SparkStageMetrics.length !== 0) {
                        this.initchart() 
                    }
                    if (this.sparkTasksList.length !== 0) {
                        this.initchart1()
                    }
                })
            }
        },
        data: {
            immediate: true,
            handler(val) {
                this.computeId = val.id
                this.debounceFun()
            }
        },
        applicationAttemptId: {
            immediate: true,
            handler(val) {
                this.debounceFun()
            }
        }
    },
    mounted() {
        // this.getStageJudge()
        // this.getJobId()
        // this.getSparkTasks()
        // this.initchart()
    },
    methods: {
        jumpToJobId(val) {
            this.$emit('jumpJobId', val)
        },
        jumpToStage(val) {
            this.$emit('jumpStage', val)
        },
        jumpToTask(val) {
            this.$emit('jumpTask', val)
        },
        debounceFun() {
            clearTimeout(this.timer)
            this.timer = setTimeout(_ => {
                this.getStageJudge()
            }, 900)
        },
        initchart() {
            const data = this.SparkStageMetrics
            let myChart = echarts.getInstanceByDom(
                this.$refs.chart
            )
            if (myChart) {
                myChart.dispose()
            }
            let that = this
            var add = []
            let legenddata = ['数据正常Stage', '数据倾斜Stage']
            data.forEach(item => {
                let itemObject = {}
                if (item.propValue > this.StageJudge) {
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
                    text: 'Stage中任务Shuffle Read Records最大值与中位值比值的分布图',
                    textStyle:{
                        fontSize: 14,
                        fontWeight: 'normal'
                    }
                },
                legend: {
                    data: [{name:'数据正常Stage'}, {name:'数据倾斜Stage'}],
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
                        const data = that.SparkStageMetrics
                        var html = '';
                        if (params.length != 0) {
                            var getName = params[0].name;
                            // html +=  'task id ' + getName + '<br/>';
                            for (var i = 0; i < params.length; i++) {
                                // let paramValue = ''
                                data.forEach(item => {
                                    // if (item.duration === params[i].value) {
                                    //     paramValue = item.durationLabel
                                    // }
                                })
                                if (
                                    params[i].value != null &&
                                    params[i].value != 0 &&
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
                    name: 'max/median'
                    }
                ],
                series: series1
            }
            myChart.setOption(option)
            myChart.getZr().on('click', params => {
                let pointInPixel = [params.offsetX, params.offsetY]
                if (myChart.containPixel('grid', pointInPixel)) {
                    //点击第几个柱子
                    let pointInGrid = myChart.convertFromPixel({ seriesIndex: 0 }, pointInPixel)
                    // 也可以通过params.offsetY 来判断鼠标点击的位置是否是图表展示区里面的位置
                    // 也可以通过name[xIndex] != undefined，name是x轴的坐标名称来判断是否还是点击的图表里面的内容
                    // x轴数据的索引
                    let xIndex = pointInGrid[0]
                    this.StageId = data[xIndex].stageId
                    this.attemptId = data[xIndex].attemptId
                    this.JobId = data[xIndex].jobId
                    // this.jobIdData = data[xIndex].jobId 	// 记得要把数据加载到这里面去，否则页面会报错
                    // this.getJobId()
                    this.getSparkTasks()
                }
            })
           
            // window.addEventListener('resize', function() {
            //     myChart.resize()
            // })
        },
        initchart1() {
            const data = this.sparkTasksList
            let myChart = echarts.getInstanceByDom(
                this.$refs.chart1
            )
            if (myChart) {
                myChart.dispose()
            }
            let that = this
            var add = []
            let legenddata = ['正常值','异常值']
            data.forEach(item => {
                let itemObject = {}
                if (item.taskMetricsInputMetricsRecordsRead > this.mediaLine) {
                    itemObject = {
                        product: item.taskId,
                        data: ['', item.taskMetricsInputMetricsRecordsRead]
                    }
                } else {
                    itemObject = {
                        product: item.taskId,
                        data: [item.taskMetricsInputMetricsRecordsRead, '']
                    }
                }
                add.push(itemObject)
            })
            myChart = echarts.init(this.$refs.chart1)
            let xAxis=[]
                let xAxisitem={
                    type: 'category',
                    data: '',
                    position: 'bottom',
                    name: 'task id',
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
    
                for (let j = 0; j < add.length; j++) {
                    for (let i = 0; i < add[j].data.length; i++) {
                        let newArrList = [];
                        for (let a = 0; a < j; a++) {
                            newArrList.push("")
                        }
                        newArrList[j] = add[j].data[i]
                        for (let k = 0; k < legenddata.length; k++) {
                            let seriesitem={
                                type: 'bar',
                                name:legenddata[i],
                                barWidth: '20',
                                xAxisIndex: j,
                                data: newArrList,
                            }
                            let a = j % legenddata.length
                            if(add[j].data[i] && k===a){
                                series.push(JSON.parse(JSON.stringify(seriesitem)))
                            } 
                            else if (add[j].data[i] === 0 && k===a) {
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
                    text: `Stage[${that.StageId}]Reduce任务Shuffle Read Records`,
                    textStyle:{
                        fontSize: 14,
                        fontWeight: 'normal'
                    }
                },
                color: ['#6CDDD6', 'red'],
                legend: {
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
                        const data = that.sparkTasksList
                        var html = '';
                        if (params.length != 0) {
                            // var getName = params[0].name;
                            // html +=  'task id ' + getName + '<br/>';
                            for (var i = 0; i < params.length; i++) {
                                // let paramValue = ''
                                data.forEach(item => {
                                    if (item.taskId === params[i].axisValue) {
                                        // paramValue = item.taskMetricsInputMetricsRecordsRead
                                    }
                                })
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
                    name: 'shuffle_read'
                    }
                ],
                series: series1
            }
            myChart.setOption(option)
            // window.addEventListener('resize', function() {
            //     myChart.resize()
            // })
        },
        async getSparkStageMetrics(data) {
            const param = {
                applicationId: this.data.taskId,
                applicationAttemptId: this.applicationAttemptId,
                propName: data,
                attemptId: data === 'shuffle_read_median_record' ? this.attemptId : null,
                stageId: data ==='shuffle_read_median_record'? this.StageId : null,
            }
            const res = await this.$simpleAsyncTo(getSparkStageMetrics(param), '获取数据失败')
            if (res) {
                if (data === 'shuffle_read_record_max_median_ratio') {
                    this.SparkStageMetrics = res.data
                    this.attemptId = res.data[0].attemptId
                    // this.stageIdData = res.data[0].stageId
                    const StageData = []
                    res.data.forEach(item => {
                        if (item.propValue > this.StageJudge) {
                            StageData.push(item)
                        }
                    })
                    this.StageId = StageData[0].stageId
                    this.attemptId = StageData[0].attemptId
                    this.JobId = StageData[0].jobId
                    this.initchart()
                    this.getSparkTasks()
                    // this.getJobId()
                } else {
                    this.mediaLine = res.data[0].propValue
                    this.initchart1()
                    const ids = [] 
                    this.sparkTasksList.forEach(item => {
                        if (item.taskMetricsInputMetricsRecordsRead > this.mediaLine) {
                            ids.push(item)
                        }
                    })
                    this.taskList = ids
                }
            }
        },
        async getStageJudge() {
            const param = {
                computeId: this.computeId,
                propName: 'shuffle_read_record_max_median_ratio'
            }
            const res = await this.$simpleAsyncTo(getStageJudge(param))
            if (res) {
                this.StageJudge = res.data[0].propValue
                this.getSparkStageMetrics('shuffle_read_record_max_median_ratio')
            }
        },
        async getSparkTasks() {
            const param = {
                applicationId: this.data.taskId,
                pageSize: -1,
                pageNo: -1,
                stageId: this.StageId,
                applicationAttemptId: this.applicationAttemptId, 	// 这里写死applicationAttemptId, 可以获取到任务的执行计划
            }
            const res = await this.$simpleAsyncTo(getSparkTasks(param), '')
            if (res) {
                this.sparkTasksList = res.data.totalList
                this.getSparkStageMetrics('shuffle_read_median_record')
            }
        },
        // async getJobId() {
        //     const param = {
        //         applicationId: this.data.taskId, 
        //         applicationAttemptId: this.applicationAttemptId,	
        //         itemId: this.data.itemId,
        //         stageId: this.StageId,
        //         stageAttemptId: this.attemptId
        //      }
        //     const res = await this.$simpleAsyncTo(getJobId(param), '')	
        //     if (res) {
        //         this.JobId= res.data.jobId
        //     }

        // }
    }
    }

</script>

<style lang="less" scoped>
.bottom{
    display: flex;
    border: 3px solid #E4E7ED;
    overflow: auto;
    .bottom-left{
        display: flex;
        // flex: 1;
        min-width: 130px;
        border-right: 3px solid #E4E7ED;;
    }
    .bottom-right{
        margin-left: 30px;
        // flex: 5;
    }
}
</style>