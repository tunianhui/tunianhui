<template>
    <section class="longTailTask">
        <!-- <el-page-header @back="goBack" content="长尾任务分析"></el-page-header> -->
        <div>
            <div class="top">
                <el-form :inline="true">
                    <!-- <el-form-item label="application_attempt_id">
                        <el-select v-model="form.appAttemptIdValue" placeholder="请选择" @change="getsdf">
                            <el-option v-for="item in appAttemptIdList" :key="item.label" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="stage_id.stage_attempt_id" placeholder="请选择">
                        <el-select v-model="form.stagIdAndattId" @change="stageIdfun">
                            <el-option v-for="item in StageIdandAttemptIdList" :key="item.label" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class="center">
                <!-- <div>当前stage下各任务的耗时情况(MS)</div> -->
                <div class="chart" ref="chart" :style="{width: getWidth + 'px'}" style="height: 300px;"></div>
            </div>
            <div class="bottom" :style="{'max-height': height + 'px'}">
                <div class="bottom-left">
                    <div style="margin: 0 auto;" >分析结论
                    </div>
                </div>
                <div v-if="conclusList.length === 0" :style="{'max-height': height + 'px'}" style="border-left: 3px solid #E4E7ED;"></div>
                <div class="bottom-right">
                    <div class="box" v-if="conclusList.length !== 0" style="border-left: 3px solid #E4E7ED;">
                        <div class="box-1" >job[{{this.JobId}}] .stage[{{stageId}}({{stageAttemptId}})]检测到如下长尾任务。这些task运行耗时已经超过该stage下task平均运行耗时{{SparkStageMetrics}}的{{StageJudge}}%</div>
                        <div id="centent" v-for="item in conclusList" :key="item.key">
                            <!-- ({{stageAttemptId}}) -->
                            <p><span @click="jumpToJob(JobId)">job[{{JobId}}]</span><span @click="jumTostage(stageId,stageAttemptId)">.stage[{{stageId}}stageAttemptId > 0 ? ({{stageAttemptId}}) : '']</span><span @click="jumpToTask(item.taskId)">.task[{{ item.taskId }}]</span>的耗时为{{item.durationLabel}}</p>
                        </div>
                    </div>
                    <div class="box" v-else >
                        <div class="box-1">job[{{this.JobId}}] .stage[{{stageId}}({{stageAttemptId}})]未检测到长尾任务</div>
                        <!-- <div id="centent" v-for="item in conclusList" :key="item.key">
                            <p><span @click="jumpToJob(applicationAttemptId)">job[{{applicationAttemptId}}]</span><span @click="jumTostage(stageId,stageAttemptId)">.stage[{{stageId}}({{stageAttemptId}})]</span><span @click="jumpToTask(item.taskId)">.task[{{ item.taskId }}]</span>的耗时为{{item.durationLabel}}</p>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import {getAppAttemptIdList, getTaskDurationList, getJobId, getStageIdandAttemptIdList, getStageJudge,getSparkStageMetrics} from '@/api/govern/item-manage'
import {timeConversion} from '@/libs/util'
import * as echarts from 'echarts'
export default {
name: 'longTailTask',
props: {
    getWidth: Number,
    height: Number,
    data: Object,
    applicationAttemptId: {
        type: Number,
        // default: 0
    }
},
data() {
    return {
        appAttemptIdList: [],
        StageIdandAttemptIdList: [],
        taskDurationList: [],
        JobId: '',
        form:{
          appAttemptIdValue: ''  ,
          stagIdAndattId: '',
        },
        applicationId: '',
        stageId: '',
        stageAttemptId: '',
        computeId: '',
        conclusList:[],
        SparkStageMetrics: '',
        StageJudge: '',
        timer: 0,
    }
},
watch: {
    getWidth: {
        immediate: true,
        handler(val) {
            this.$nextTick(_ => {
                if (this.taskDurationList.length !== 0) {
                    this.initchart()  
                }
            })
        }
    },
    data: {
        immediate: true,
        handler(val) {
            this.applicationId = val.taskId
            this.computeId = val.id
            this.itemId = val.itemId
            this.getStageJudge()
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
},
methods: {
    debounceFun() {
        clearTimeout(this.timer)
        this.timer= setTimeout(_ => {
            this.getStageIdandAttemptIdList()
        }, 900)
    },
    jumpToJob(val) {
        if (val !== '') {
            this.$emit('toJob', val)
        }
    },
    jumpToTask(val) {
        this.$emit('toTask', val)
    },
    jumTostage(val,val1) {
        this.$emit('toStage', val, val1)
    },
    stageIdfun(val) {
        const data = val.split(',')
        this.stageId = data[0]
        this.stageAttemptId = data[1]
        this.getTaskDurationList()
        this.getSparkStageMetrics()
        this.getJobId()
    },
    setCommFun() {
        const param = {
            applicationAttemptId: this.applicationAttemptId,
            applicationId: this.applicationId,
            itemId: this.itemId
        }
        return param
    },
    conclusionFun() {
        const add = document.getElementById('centent')
        const data = this.taskDurationList
        const getList = []
        data.forEach(item => {
            if (item.durationState === 'toolong') {
                getList.push(item)
            }
        })
        this.conclusList = getList
        // getList.forEach(item => {
        //     const add = document.createElement('p')
        //     // add.innerText = 'job' + '[' + this.JobId + ']' + '.stage'+ '[' + this.form.stagIdAndattId + ']' + 'task' + '[' + item.taskId + ']' + '的耗时为' + item.durationLabel
        //     add.innerHTML = '<span >' + 'job' + '[' + this.JobId + ']' +'</span>' + '</span>' + '<span>' + '.stage'+ '[' + this.form.stagIdAndattId + ']' + '</span>'
        //     document.getElementById("centent").appendChild(add)
        // })
    },
    initchart() {
        const data = this.taskDurationList
        let myChart = echarts.getInstanceByDom(
            this.$refs.chart
        )
        if (myChart) {
            myChart.dispose()
        }
        let that = this
        var add = []
        let legenddata = ['耗时正常task','耗时超长task']
        data.forEach(item => {
            let itemObject = {}
            if (item.durationState === 'toolong') {
                itemObject = {
                    product: item.taskId,
                    data: ['', item.duration,]
                }
            } else {
                itemObject = {
                    product: item.taskId,
                    data: [item.duration, '']
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
            // console.log("xAxis",xAxis)
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
                            // barWidth: '10',
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
            title: {
                text: '当前stage下各任务的耗时情况(MS)',
                textStyle:{
                    fontSize: 14,
                    fontWeight: 'normal'
                }
            },
            color: ['#6CDDD6', 'red'],
            legend: {
                    data: [{name:'耗时正常task'}, {name:'耗时超长task'}],
                    right: 20
                },
            // legend: {
            //     right: 20
            // },
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
                    const data = that.taskDurationList
                    var html = '';
                    if (params.length != 0) {
                        var getName = params[0].name;
                        html +=  'task id ' + getName + '<br/>';
                        for (var i = 0; i < params.length; i++) {
                            let paramValue = ''
                            data.forEach(item => {
                                if (item.duration === params[i].value) {
                                    paramValue = item.durationLabel
                                }
                            })
                            if (
                                params[i].value != null &&
                                params[i].value != 0 &&
                                params[i].value != ''
                            ) {
                                html += params[i].marker;
                                html += params[i].seriesName + ':' + paramValue + '</br>'
                                // html += params[i].seriesName + ': ' + params[i].value + '<br/>';
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
                type: 'value'
                }
            ],
            series: series1
        }
        myChart.setOption(option)
        // window.addEventListener('resize', function() {
        //     myChart.resize()
        // })
    },
    // 接口
    // async getAppAttemptIdList() {
    //     const res = await this.$simpleAsyncTo(getAppAttemptIdList(), '获取spark长尾任务AppAttemptId列表失败')
    //     if (res) {
    //         this.appAttemptIdList = res.data
    //     }
    // },
    async getStageIdandAttemptIdList() {
        const param = {
            ...this.setCommFun()
        }
        const res = await this.$simpleAsyncTo(getStageIdandAttemptIdList(param), '获取stageId.stageAttemptId列表失败') 
        if (res) {

            this.StageIdandAttemptIdList = res.data
            if (res.data.length > 0) {
                this.form.stagIdAndattId =  res.data[0].label
                const data = res.data[0].value.split(',')
                this.stageId = data[0]
                this.stageAttemptId = data[1]
            }
            if (this.stageId !== '' && this.stageAttemptId !== '') {
                this.getTaskDurationList()
                this.getSparkStageMetrics()
                this.getJobId()
            }
        }
    },
    async getTaskDurationList() {
        const param = {
            applicationAttemptId: this.applicationAttemptId,
            applicationId: this.applicationId,
            stageId: this.stageId,
            stageAttemptId: this.stageAttemptId,
            computeId: this.computeId,
            // itemId: this.data.itemId,
        }
        const res = await this.$simpleAsyncTo(getTaskDurationList(param), '') 
        if (res) {
            this.taskDurationList = res.data
            this.initchart()
            this.conclusionFun()
        }
    },
    async getJobId() {
        const param = {
            ...this.setCommFun(),
            stageId: this.stageId,
            stageAttemptId: this.stageAttemptId
        }
        const res = await this.$simpleAsyncTo(getJobId(param), '')
        if (res) {
            this.JobId = res.data.jobId
        }
    },
    async getSparkStageMetrics() {
        const param = {
            applicationAttemptId: this.applicationAttemptId,
            applicationId: this.applicationId,
            stageId: this.stageId,
            stageAttemptId: this.stageAttemptId,
            propName: 'avg_task_duration'
        }
        const res = await this.$simpleAsyncTo(getSparkStageMetrics(param), '获取数据失败')
        if (res) {
            this.SparkStageMetrics = res.data[0].propValue
        }
    },
    async getStageJudge() {
        const param = {
            propName: 'multiple_duration',
            computeId: this.computeId,
        }
        const res = await this.$simpleAsyncTo(getStageJudge(param), '获取stage治理属性数据失败')
        if (res) {
            this.StageJudge = res.data.length > 0 ? (res.data[0].propValue*100).toFixed(2) : 0
        }
    }
}
}
</script>

<style lang="less" scoped>
.longTailTask{
    .el-form{
        .el-form-item{
            margin-bottom: 0px;
        }
    }
    .bottom{
        display: flex;
        border: 3px solid #E4E7ED;
        overflow: auto;
        .bottom-right{
            // border-left: 3px solid #E4E7ED;
            // width: 10%;
            .box{
                // border-left: 3px solid #E4E7ED;
                .box-1{
                    font-weight: 700;
                    margin-left: 30px;
                }
                #centent {
                    margin-left: 30px;
                }
            }
        }
        .bottom-left{
            display: flex;
            // align-items: center;
            min-width: 130px;
        }
    }
}
</style>