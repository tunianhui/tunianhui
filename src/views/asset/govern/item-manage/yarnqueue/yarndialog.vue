<template>
    <section :visible="dialogFormVisible" @close="close">
        <div class="yarn-dialog">
            <div class="title">yarn队列详情页面</div>
            <div class="top">
                    <div class="top-content">
                        <i class="iconfont icon-wangluojiekou"></i>
                        <div class="content">
                            <el-form>
                                <el-form-item label="归属项目:" prop="projectName">
                                    <div>{{ projectName }}</div>
                                </el-form-item>
                                <el-form-item label="对象名称:" prop="objectName">
                                    {{ objectName }}
                                </el-form-item>
                                <el-form-item label="时间选择:" prop="timeRange">
                                    <el-select placeholder="请选择时间范围" v-model="timeRange" @change="selectTime">
                                    <el-option v-for="item in dictList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                    <el-date-picker v-if="visibleTime" class="pickTime" ref="datePicker" :clearable="false" v-model="trendDate" @change="pickerChange" 
                                    type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                                </el-form-item>
                                <!-- <el-form-item prop="trendDate" v-if="visibleTime">
                                    <el-date-picker class="pickTime" :clearable="false" v-model="trendDate"  
                                    type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                                </el-form-item> -->
                            </el-form>
                        </div>
                    </div>
                </div>
            <div>
                <!-- <el-form>
                    <el-form-item label="归属项目:" prop="projectName">
                        <div>{{ projectName }}</div>
                    </el-form-item>
                    <el-form-item label="对象名称:" prop="objectName">
                        {{ objectName }}
                    </el-form-item>
                    <el-form-item label="时间选择:" prop="timeRange">
                        <el-select placeholder="请选择时间范围" v-model="timeRange" @change="selectTime">
                        <el-option v-for="item in dictList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-date-picker v-if="visibleTime" class="pickTime" ref="datePicker" :clearable="false" v-model="trendDate" @change="pickerChange" 
                        type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item> -->
                    <!-- <el-form-item prop="trendDate" v-if="visibleTime">
                        <el-date-picker class="pickTime" :clearable="false" v-model="trendDate"  
                        type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item> -->
                <!-- </el-form> -->
            </div>
            <div>队列趋势图</div>
            <div class="chart" ref="chart" :style="{height: getheight + 'px', width: setWidth + 'px'}"></div>
            <!-- <div class="chart" ref="chart" :style="{height: `${getheight - 10}` + 'px'}"></div> -->
            <!-- <div>

            </div> -->
        </div>
    </section>
</template>
<script>
import {getDictList} from '@/api/govern/source-analyze'
import {getQueueDetail} from '@/api/govern/item-manage'
import {dateFormat2, dateFormat} from '@/libs/util'
import * as echarts from 'echarts'
export default {
    name: 'yarnDialog',
    components: {
    },
    props: {
        data: Object,
        getheight: Number,
        sendVal: Boolean,
    },
    data() {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
        // const start = setback(new Date())
        return {
            dialogFormVisible: true,
            visibleTime: false,
            timeRange: '24',
            dictList: [],
            projectName: '',
            objectName: '',
            trendDate: [start, end] || [],
            setWidth: 500,
            timer: 0,
        }
    },
    watch: {
       'data': {
        immediate: true,
        handler(val) {
            this.projectName = val.projectName
            this.objectName = val.objectName
            this.getQueueDetail(val)
        }
       },
       trendDate(val) {
       
        if (!val) {
            this.$refs.datePicker.showPicker()
            // this.$refs.datePicker.pickerVisible = true
            this.$message({
                showClose: true,
                message: '自定义时间不能为空，请继续选择时间',
                type: 'warning'
            })
            this.trendDate=[]
            return
        }
       },
       'sendVal' :{
        immediate: true,
        handler(val) {
            setTimeout(_ => {
                const yarnWidth = document.getElementsByClassName('yarn-dialog')
                this.setWidth = yarnWidth[0].offsetWidth
            }, 500)
        } 
        },
        setWidth: {
            immediate: true,
            handler(val) {
                this.$nextTick(_ => {
                    // this.initchart(this.trendList) 
                    this.debounceFun(this.trendList)
                })
            }
        },
            
    },
    created() {
    },
    mounted() {
    //    this.getQueueDetail()
       this.getDictList()
    },
    methods: {
        debounceFun(data){
            clearTimeout(this.timer)
            this.timer = setTimeout(_ => {
                this.initchart(data)
            }, 100)
        },
        selectTime(val) {
            if (val === '0') {
                this.visibleTime = true
            } else {
                this.visibleTime = false
            }
            this.getQueueDetail(this.data)
        },
        pickerChange(val) {
            if (val) {
                this.getQueueDetail(this.data)
            }
        },
        close() {

        },
        initchart(data) {
            let mycharts = echarts.getInstanceByDom(
                    this.$refs.chart
                )
            let that = this
            const xAxisData = []
            for (let i = 0; i < data.length; i++) {
                if (!xAxisData.includes(data[i].createdTime)) {
                xAxisData.push(data[i].createdTime)
                }
            }
            var seriesList = []
            let add = []
            let add2 = []
            for (const i in data) {
                if (this.typeQueue === 'm') {
                    add.push([data[i].createdTime, data[i].usedMemoryCapacityPercent, data[i].queueName])
                    add2.push([data[i].createdTime, data[i].usedCoresCapacityPercent, data[i].queueName])
                } else {
                    add.push([data[i].createdTime, data[i].avgMemoryPercent, data[i].queueName])
                    add2.push([data[i].createdTime, data[i].avgCpuPercent, data[i].queueName])
                }
            }
            seriesList.push(
                {
                name: '内存',
                type: 'line',
                data: add,
                showSymbol: false,
                }, 
                {
                name: 'cpu',
                type: 'line',
                data: add2,
                showSymbol: false,
                itemStyle: {
                    normal: {
                    lineStyle: {
                        type: 'dashed',
                    }
                    },
                },
            })
            if (mycharts) {
                mycharts.dispose()
            }
            mycharts = echarts.init(this.$refs.chart)
            let option = {
                visualMap: false,
                tooltip: {
                    trigger: 'axis',
                    formatter: function(param) {
                    let html = ''
                    let paramsData = _.sortBy(param, 'value[1]')
                    paramsData = _.reverse(paramsData)
                    html += '<div>' + paramsData[0].name + '</div>'
                    for(let k in paramsData ) {
                        html += '<div>'
                        html +=
                        '<i style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; line-height: 10px; margin-right: 5px; background: ' +
                        paramsData [k].color +
                        '"></i>'
                        html +=
                        '<span>' + 
                            paramsData [k].value[2] + ' ' +
                            '(' + paramsData [k].seriesName + ')' +
                        '</span>: ' +
                        (paramsData [k].value[1] + '%')
                        html += '</div>'
                    }
                        return html
                    }
                },
                backgroundColor: '#FFFFFF',
                legend: {
                    data: [{
                        name: '内存',
                        icon: 'path://M908.49 562.043H754.526c-23.01 114.216-123.222 200.183-243.363 200.183S290.81 676.259 267.8 562.043H113.836c-27.431 0-49.667-22.405-49.667-50.044 0-27.64 22.236-50.044 49.667-50.044H267.8c23.01-114.216 123.222-200.183 243.363-200.183s220.353 85.967 243.363 200.183H908.49c27.431 0 49.666 22.404 49.666 50.044 0 27.64-22.236 50.044-49.666 50.044zM511.163 361.865c-82.291 0-148.998 67.218-148.998 150.135s66.707 150.135 148.998 150.135S660.16 594.917 660.16 512s-66.706-150.135-148.997-150.135z',
                    },{
                        name: 'cpu',
                        icon: 'path://M304.43 532.76H221.4c-11.47 0-20.76-9.3-20.76-20.76s9.29-20.76 20.76-20.76h83.03c11.47 0 20.76 9.3 20.76 20.76s-9.29 20.76-20.76 20.76zM581.19 532.76H442.81c-11.47 0-20.76-9.3-20.76-20.76s9.29-20.76 20.76-20.76h138.38c11.47 0 20.76 9.3 20.76 20.76s-9.3 20.76-20.76 20.76zM802.59 532.76h-83.03c-11.47 0-20.76-9.3-20.76-20.76s9.29-20.76 20.76-20.76h83.03c11.47 0 20.76 9.3 20.76 20.76s-9.29 20.76-20.76 20.76z'
                    }],
                    top: 8,
                    left: 20,
                },
                grid: {
                    left: '60',
                    right: '4%',
                    top: '18%',
                    bottom: '10%'
                },
                xAxis: {
                type: 'category',
                name: '时间',
                boundaryGap: false
                },
                yAxis: {
                    show: true,
                    name: '队列使用率(%)',
                    type: 'value',
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: '#6E7079'
                        }
                    },
                    axisLabel: {
                    show: true,
                    formatter: '{value}%'
                    }
                    
                },
                series: seriesList
            }
            mycharts.setOption(option)
            window.addEventListener('resize', function() {
                mycharts.resize()
            })
        },
        command() {
        },
        async getQueueDetail(data) {
            this.loading++
            let paramObject = {}
            const [start, end] = this.trendDate
            if (this.timeRange === '0') {
                paramObject = {
                    timeRange: this.timeRange,
                    startDate: dateFormat(start) + ' ' + dateFormat2(start),
                    endDate : dateFormat(end) + ' ' + dateFormat2(end)
                }
            } else {
                paramObject = {
                    timeRange: this.timeRange
                }
            }
            const params = {
                ...paramObject,
                queueNameList: data.objectName,
                // projectName:  data.projectName,
                pageSize: -1,
                pageNo: -1
            }
            const res = await this.$simpleAsyncTo(getQueueDetail(params), '')
            if (res) {
                this.typeQueue = res.data.type
                this.trendList = res.data.pageInfo.totalList
                // this.initchart(this.trendList)
                this.debounceFun(this.trendList)
            }
            this.loading--
        },
        async getDictList() {
            const res = await this.$simpleAsyncTo(getDictList({type: 'yarn_resource_trend'}), '获取列表失败')
            if (res) {
                this.dictList = res.data
            }
        },

    },

}

</script>
<style lang="less" scoped>
.yarn-dialog {
    margin-left: 20px;
    padding-top: 10px;
    .title{
        font-size: 20px;
        // margin-top: 10px;
    }
    .el-form{
        margin-left: 20px;
        .el-form-item{
            margin-bottom: 0px;
            display: flex;
        }
    }
    .chart{
        // width: 99%;
        // height: 300px;
        background-color: #F5F5F5;
        // margin: 0 auto;
        // div {
        //   width: 50%;
        // }
        canvas {
        width: 50%;
        }
    }
    .top{
        margin-top: 10px;
        margin-bottom: 10px;
        height: 100px;
        background-color: #FFFFFF;
        width: 99%;
        min-width: 750px;
        .top-content{
            margin-left: 10px;
            height: 100px;
            display: flex;
            .iconfont{
                margin-top: 20px;
                font-size: 50px;
                // width: 50px;
                height: 50px;
                // background-color: rgb(122, 31, 241);
                background-color: #A8C8FD;
                color: white;
                // line-height: 100px;
            }
        }

    }
}



</style>