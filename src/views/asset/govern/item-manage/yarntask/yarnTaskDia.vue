<template>
    <section  class="yarnTask-dia">
        <div class="yarn-dialog1" :style="{height: getheight + 'px'}">
            <div style="display: flex;position: relative;">
                <div class="title">{{title}}详情</div>
                <div v-if="istitle === 'SPARK'" style="position: absolute;bottom: 0;right: 20px;">
                    <div>应用程序重试id:
                                    <el-select v-model="sparkAttemptId" @change="setTabSelect">
                                    <el-option v-for="item in sparkAttemptIdList" :key="item" :value="item" :label="item"></el-option>
                                </el-select>
                                </div> 
                </div>
            </div>
            <div class="yarn-spark" v-if="istitle === 'SPARK'" :style="{height: getheight + 'px'}">
                <div class="top">
                    <div class="top-content">
                        <i class="iconfont icon-wangluojiekou"></i>
                        <div class="content">
                            <!-- <div class="row-1">
                                <el-form>
                                    <el-form-item label="程序id:">
                                        <div  class="guild">{{ applicationId }}</div>
                                    </el-form-item>
                                    <el-form-item label="程序名称:">
                                        <div  class="guild">{{ applicationName }}</div>
                                    </el-form-item>
                                    <el-form-item v-for="(value, key) in bottomContentList" :key="key" :label="value">
                                        <div  class="guild">{{ sparkOverview[key] }}</div>
                                    </el-form-item>
                                    <el-form-item v-for="(value, key) in centerTopList" :key="key" :label="value">
                                        <div class="guild">{{ sparkOverview[key] }} - {{ endTime }}</div>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="row-2">
                                <el-form>
                                    <el-form-item v-for="(value, key) in centerBottomList" :key="key" :label="value">
                                        <div class="guild">{{ sparkOverview[key] }}</div>
                                    </el-form-item>
                                </el-form>
                            </div> -->

                            <div>
                                <div class="tbl-name">
                                {{ applicationId }}
                                </div>
                                <el-form>
                                    <el-form-item label="程序名称:">
                                        <div  class="guild">{{ applicationName }}</div>
                                    </el-form-item>
                                    <el-form-item v-for="(value, key) in centerTopList" :key="key" :label="value">
                                        <div class="guild">{{ sparkOverview[key] }} - {{ endTime }}</div>
                                    </el-form-item>
                                </el-form>
                                <el-form :inline="true">
                                    <!-- style="width: 150px;" -->
                                    <el-form-item v-for="(value, key) in centerBottomList" :key="key" :label="value">
                                        <div  class="guild">{{ sparkOverview[key] }}</div>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </div>
                <el-tabs  v-model="activeName" @tab-click="tabClickhandle" :style="{height: `${getheight - 166}` + 'px'}">
                <!-- <el-tabs  v-model="activeName" @tab-click="tabClickhandle" style="height: 700px;"> -->
                    <el-tab-pane label="Jobs">
                        <el-form label-width="50px">
                            <el-form-item label="JobId:">
                                <el-input prefix-icon="el-icon-search" clearable v-model="jobId" @change="jobIdChange" placeholder="请输入JobId"></el-input>
                            </el-form-item>
                        </el-form>
                        <div class="tabpan"  v-if="activeName === '0'">
                            <el-table v-loading="!!loading" :data="sparkJobsList" stripe  border @current-change="selectJobs">
                                <template slot="empty">
                                    <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
                                    <div class="slot-empty">
                                        <img src="@/assets/images/nodata.png" alt="">
                                        <p>暂无数据</p>
                                    </div>
                                    
                                </template>
                                <el-table-column min-width="117px" v-for="(value, key) in sparkJobslabel" :key="key" :label="value" :prop="key" :width="flexColumnWidth(key,sparkJobsList, value)">
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="Stages">
                        <div class="tabStages">
                            <el-form  :inline="true" label-width="50px">
                                <el-form-item label="JobId:">
                                    <el-input prefix-icon="el-icon-search" clearable v-model="JobId" @change="getSparkStages" placeholder="请输入JobId"></el-input>
                                </el-form-item>
                                <el-form-item label="StageId:">
                                    <el-input prefix-icon="el-icon-search" clearable v-model="stageId" @change="getSparkStages" placeholder="请输入StageId"></el-input>
                                </el-form-item>
                                <el-form-item label-width="110px" label="stages重试次数">
                                    <el-input prefix-icon="el-icon-search" v-model="attemptId" @change="getSparkStages" placeholder="请输入重试次数"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="tabpan" >
                            <!-- <div class="tabpan"> -->
                                <Stages :data="sparkStageList" @sendClick="rowClick"></Stages>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="Executors" >
                        <div class="tabpan"  v-if="activeName === '2'">
                            <el-table :data="sparkExexList" border @row-click="rowClick">
                                <template slot="empty">
                                    <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
                                    <div class="slot-empty">
                                        <img src="@/assets/images/nodata.png" alt="">
                                        <p>暂无数据</p>
                                    </div>
                                </template>
                                <el-table-column min-width="146px" v-for="(value, key) in sparkExexlabel" :key="key" :label="value" :prop="key" :width="columnWidth(key)">
                                    <template slot-scope="{row}">
                                        <div v-if="key === 'isActive'"> {{ row.isActive === true ? '是' : '否' }}</div>
                                        <div v-else-if="key === 'isBlacklisted'"> {{ row.isBlacklisted === true ? '是' : '否' }}</div>
                                        <div v-else-if="key === 'operate'">
                                            <el-button @click.native.stop="openNewPage(row)" type="primary">log</el-button>
                                        </div>
                                        <div v-else>{{ row[key] }}</div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="Tasks">
                        <el-form :inline="true" label-width="100px">
                        <el-form-item label="TasksId:">
                            <el-input prefix-icon="el-icon-search" clearable v-model="tasksId" @change="getSparkTasks" placeholder="请输入TasksId"></el-input>
                        </el-form-item>
                        <el-form-item label="StageId:">
                            <el-input prefix-icon="el-icon-search" clearable v-model="stageId" @change="getSparkTasks" placeholder="请输入StageId"></el-input>
                        </el-form-item>
                        <el-form-item label="ExecutorId:">
                            <el-input prefix-icon="el-icon-search" clearable v-model="executorId" @change="getSparkTasks" placeholder="请输入ExecutorId"></el-input>
                        </el-form-item>
                        </el-form>
                        <div class="tabpan">
                           <Tasks :data="sparkTaskList"></Tasks> 
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="Environment">
                        <div class="tabpan1">
                            <div>spark属性信息</div>
                            <el-table :data="classpathEntries" border  stripe>
                                <el-table-column label="Name" prop="0"></el-table-column>
                                <el-table-column label="Value" prop="1" ></el-table-column>
                            </el-table>
                            <div>system属性信息</div>
                            <el-table :data="sparkProperties" border  stripe>
                                <el-table-column label="Name" prop="0"></el-table-column>
                                <el-table-column label="Value" prop="1" ></el-table-column>
                            </el-table >
                            <div>classpath_entries信息</div>
                            <el-table :data="systemProperties" border  stripe>
                                <el-table-column label="Name" prop="0"></el-table-column>
                                <el-table-column label="Value" prop="1" ></el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="labelValue">
                        <component :is="currentPage" :applicationAttemptId="sparkAttemptId" :data="data" :getWidth="setWidth" :height="getheight - 550" @toJob="toJobFun" @toTask="toTaskFun" @toStage="toStageFun" @jumpJobId="toJobFun" @jumpTask="toTaskFun" @jumpStage="toStageFun"></component>
                    </el-tab-pane>
                    <!-- <el-tab-pane v-if="this.data.islongTail === 'longTail'" label="长尾任务分析">
                        <longTailTask :getWidth="setWidth" :applicationAttemptId="sparkAttemptId" :height="getheight - 550" :data="data" @toJob="toJobFun" @toTask="toTaskFun" @toStage="toStageFun"></longTailTask>
                    </el-tab-pane>
                    <el-tab-pane v-if="this.data.islongTail === 'taskSkew'" label="数据倾斜分析">
                        <TaskSkew :applicationAttemptId="sparkAttemptId" :data="data" :getWidth="setWidth" @jumpJobId="toJobFun" @jumpTask="toTaskFun" @jumpStage="toStageFun"></TaskSkew>
                    </el-tab-pane>
                    <el-tab-pane v-if="this.data.islongTail === 'HdfsKartonAnalysis'"  label="Hdfs卡顿分析">
                        <HdfsKartonAnalysis :applicationAttemptId="sparkAttemptId" :data="data" :getWidth="setWidth"></HdfsKartonAnalysis>
                    </el-tab-pane>
                    <el-tab-pane v-if="this.data.buttonAction === 'I202003'" label="任务调度overHead过大">
                        <OverHead :applicationAttemptId="sparkAttemptId" :data="data"></OverHead>
                    </el-tab-pane> -->
                    <el-pagination v-if="visible"
                        class="fr pt-10 pb-10"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="pageNo"
                        :page-sizes="[15, 25, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next"
                        :total="total">
                    </el-pagination>
                </el-tabs>
                
            </div>
            <!-- <div v-if="istitle === 'long'" :style="{height: getheight + 'px'}">
                <longTailTask @back="goBack" :getWidth="setWidth"></longTailTask>
            </div> -->
            <div v-if="istitle === 'operate'" :style="{height: getheight + 'px'}">
                <operatePageVue  @back="goBack" :getSparkData="getSpark" :getheight="getheight - 140"></operatePageVue>
            </div>
            <div v-if="istitle === ''" class="nospark"  :style="{height: getheight + 'px'}">
                <div class="center">
                    <img src="@/assets/images/nodata.png" alt="">
                    <h2>暂无数据</h2>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
// import {getDictList} from '@/api/govern/source-analyze'
import {getSparkJobs, getSparkStages, getSparkExecutors, getSparkTasks, getSparkEnvironment, getSparkOverview, getSparkLog} from '@/api/govern/item-manage'
import Tasks from './tasks'
import Stages from './stages'
import operatePageVue from './operatePage'
import minix from './minix.js'
import longTailTask from './longTailTask'
import TaskSkew from './taskSkew.vue'
import HdfsKartonAnalysis from './HdfsKartonAnalysis.vue' 		// HDFS-Karton 平台数据分析页面展示
import OverHead from './overHead.vue'
// import {dateFormat2, dateFormat} from '@/libs/util'
// import * as echarts from 'echarts'
export default {
    name: 'yarnTaskDia',
    mixins: [minix],
    components: {
        Tasks,
        Stages,
        operatePageVue,
        longTailTask,
        TaskSkew,
        HdfsKartonAnalysis,
        OverHead
    },
    props: {
        data: Object,
        getheight: Number,
        // sparkAttempt: Array,
        sendVal:Boolean
    },
    data() {
        return {
            applicationId: '',
            pageSize: 15,
            pageNo: 1,
            total: 0,
            activeName: '0',
            dialogFormVisible: true,
            sparkJobsList: [],
            sparkStageList: [],
            sparkExexList: [],
            sparkTaskList: [],
            sparkEnvironList: [],
            currentPage: '',
            sparkJobslabel: {
                // "applicationId": 'spark应用程序id',
                "jobId": 'job id',
                "jobName": 'job名称',
                "status": "job状态",
                "submissionTime": 'job提交时间',
                "completionTime": 'job完成时间',
                "tasksNum": '任务数',
                "completedTasksNum": '已完成任务数',
                "skippedTasksNum": '跳过的任务数',
                "failedTasksNum": '失败的任务数',
                "completedStagesNum": '已完成的stage数',
                "skippedStagesNum": '跳过的stage数',
                "failedStagesNum": '失败的stage数'
            },
            sparkExexlabel: {
                // "applicationId": 'spark应用程序id',
                "id": 'executor id',
                "hostPort": 'host:端口',
                "isActive": '是否活着',
                "rddBlocks": 'rdd block数量',
                "memoryUsed": '内存已使用',
                "diskUsed": '磁盘已使用',
                "totalCores": '最大核数',
                "maxTasks": '最大任务数',
                "failedTasks": '失败的任务数',
                "completedTasks": '已完成的任务数',
                "totalTasks": '任务总数',
                "totalDuration": '运行时间总数',
                "totalGcTime": 'gc时间总数(单位毫秒)',
                "totalInputBytes": '输入字节数总数',
                "totalShuffleRead": 'shuffle读取字节数总数',
                "totalShuffleWrite": 'shuffle写入字节总数',
                "isBlacklisted": '是否已是黑名单',
                "maxMemory": '最大内存总数',
                "operate": '日志'
            },
            jobId: '',
            JobId: '',
            stageId: '',
            attemptId: '',
            executorId: '',
            tasksId: '',
            setheight: 400,
            title: '',
            classpathEntries: [],
            sparkProperties: [],
            systemProperties: [],
            istitle: '',
            loading: 0,
            getSpark: '',
            sparkAttemptId: 0,
            sparkOverview: {},
            applicationName: '',
            bodyHeight: 0,
            visible: true,
            setWidth: 0,
            islongTail: '',
            actionList: ['I101001', 'I102001', 'I103001', 'I201001', 'I0012', 'I202001', 'I202002', 'I202003', 'I202004'],
            labelValue: ''
            // sparkUser: '',
            // queueName: ''
        }
    },
    watch: {
        data: {
            immediate: true,
            handler(val) {
                this.islongTail === val.islongTail
                this.applicationId = val.appId || val.taskId
                this.title = val.applicaitonType
                if (val.applicaitonType === 'SPARK') {
                    this.istitle = val.applicaitonType
                } else {
                    this.istitle = ''
                }
                if (this.actionList.includes(val.buttonAction)) {
                    this.activeName = '5'
                    if (val.buttonAction === 'I202001') {
                        this.labelValue = '长尾任务分析'
                        this.currentPage = longTailTask
                        this.visible = false
                    } else if (val.buttonAction === 'I202002') {
                        this.currentPage = TaskSkew
                        this.labelValue = '数据倾斜分析'
                        this.visible = false
                    } else if (val.buttonAction === 'I202004') {
                        this.labelValue = 'Hdfs卡顿分析'
                        this.currentPage = HdfsKartonAnalysis
                        this.visible = false
                    } else if (val.buttonAction === 'I202003') {
                        this.currentPage = OverHead
                        this.labelValue = '任务调度overHead过大'
                        // this.visible = false
                    }
                } else {
                    this.activeName = '0'
                }
                // if (val.islongTail === 'longTail' || 
                //    val.islongTail === 'taskSkew' || 
                //    val.islongTail === 'HdfsKartonAnalysis') {
                //     this.activeName = '5'
                //     this.visible = false
                // } else {
                //     this.activeName = '0'
                // }
                this.getSparkAttemptId(val)
            }
        },
        // sparkAttempt: {
        //     immediate: true,
        //     handler(val) {
        //         let maxadd = val[0]
        //         val.forEach(element => {
        //             if (maxadd < element) {
        //                 maxadd = element
        //             }
        //         })
        //         this.sparkAttemptId = maxadd
        //         if (this.sparkAttemptId) {
        //             setTimeout(_=> {
        //                 this.getSparkJobs()
        //                 this.getSparkOverview()
        //             }, 500)
        //         } else {
        //             this.sparkJobsList = []
        //             this.sparkStageList = []
        //             this.sparkExexList = [],
        //             this.sparkTaskList=[]
        //             this.sparkEnvironList=[]
        //         }
        //     }
        // },
        sendVal: {
            immediate: true,
            handler(val) {
                setTimeout(_ => {
                    const yarnWidth = document.getElementsByClassName('yarn-dialog1')
                    this.setWidth = yarnWidth[0].offsetWidth
                }, 500)
            }
        },
        activeName: {
            immediate: true, 	// for animation only.  Not for user input.  (i.e. if user clicks on a button, it will
            handler(val) { 	
                if (val === '4' || val === '5') {
                    this.visible = false
                } else {
                    this.visible = true
                }
            }// change the active class on the button, not the entire dialog box.  This is a work in progress.
        }
    },
    created() {
    },
    mounted() {
       
    },
    methods: {
        openNewPage(val) {
            this.getSparkLog(val)
            // this.istitle = ''
        },
        goBack() {
            this.istitle = 'SPARK'
        },
        jobIdChange() {
            this.getSparkJobs(this.jobId)
            // this.getSparkStages(this.jobId)
        },
        taskIdChange() {

        },
        handleSizeChange(val) {
            this.pageSize = val
            this.handleCurrentChange(1)
        },
        handleCurrentChange(val) {
            this.pageNo = val
            this.setTabSelect()
            // this.getTaskDetail()
        },
        selectJobs(val) {
            this.activeName = '1'
            this.pageSize = 15
            this.pageNo = 1
            this.JobId = val.jobId
            this.getSparkStages()
        },
        setTabSelect() {
            if (this.activeName === '1') {
                this.getSparkStages()
            } else if (this.activeName === '2') {
                this.getSparkExecutors()
            } else if (this.activeName === '3') {
                this.getSparkTasks()
            } else if (this.activeName === '4') {
                this.getSparkEnvironment()
            } else if (this.activeName === '0') {
                this.getSparkJobs(this.jobId)
            }
        },
        // 自适应表格列宽
        flexColumnWidth(str, tableData, val, flag = 'max') {
            // str为该列的字段名(传字符串);tableData为该表格的数据源(传变量);
            // flag为可选值，可不传该参数,传参时可选'max'或'equal',默认为'max'
            // flag为'max'则设置列宽适配该列中最长的内容,flag为'equal'则设置列宽适配该列中第一行内容的长度。
            str = str + ''
            let columnContent = ''
            if (!tableData || !tableData.length || tableData.length === 0 || tableData === undefined) {
                return
            }
            if (!str || !str.length || str.length === 0 || str === undefined) {
                return
            }
            if (flag === 'equal') {
                // 获取该列中第一个不为空的数据(内容)
                for (let i = 0; i < tableData.length; i++) {
                if (tableData[i][str].length > 0) {
                    // console.log('该列数据[0]:', tableData[0][str])
                    columnContent = tableData[i][str]
                    break
                }
                }
            } else {
                // 获取该列中最长的数据(内容)
                let index = 0
                for (let i = 0; i < tableData.length; i++) {
                if (tableData[i][str] === null) {
                    return
                }
                const now_temp = tableData[i][str] + ''
                const max_temp = tableData[index][str] + ''
                if (now_temp.length > max_temp.length) {
                    index = i
                }
                }
                columnContent = tableData[index][str]
            }
            // console.log(columnContent, str, typeof columnContent === 'number', '下班下班烧烤烧烤')
            // 以下分配的单位长度可根据实际需求进行调整
            let flexWidth = 0
            // columnContent = toString(columnContent)
            if (typeof columnContent === 'number') {
                for (const char of val) {
                    if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
                    // 如果是英文字符，为字符分配8个单位宽度
                    flexWidth += 8
                    } else if (char >= '\u4e00' && char <= '\u9fa5') {
                    // 如果是中文字符，为字符分配15个单位宽度
                    flexWidth += 15
                    } else {
                    // 其他种类字符，为字符分配8个单位宽度
                    flexWidth += 8
                    }
                }
                flexWidth+=13
            } else {
                for (const char of columnContent) {
                    if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
                    // 如果是英文字符，为字符分配8个单位宽度
                    flexWidth += 8
                    } else if (char >= '\u4e00' && char <= '\u9fa5') {
                    // 如果是中文字符，为字符分配15个单位宽度
                    flexWidth += 15
                    } else {
                    // 其他种类字符，为字符分配8个单位宽度
                    flexWidth += 7
                    }
                }
            }
            if (str === 'status') {
                flexWidth += 20
            }
            return flexWidth + 'px'
        },
        columnWidth(val) {
            let width = 144
            if (val === 'applicationId') {
                width = 204
            }
            return width + 'px'
        },
        tabClickhandle() {
            this.pageSize = 15
            this.pageNo = 1
            this.jobId = ''
            this.stageId= '',
            this.executorId= '',
            this.tasksId = ''
            this.JobId = ''
            this.attemptId = ''
            if (this.sparkAttemptId || this.sparkAttemptId === 0) {
                this.setTabSelect()
            }
            // this.setTabSelect()
            // if (this.activeName === '5') {
            //     this.istitle = 'long'
            // }
            // if (this.activeName === '4' || this.activeName === '5') {
            //     this.visible = false
            // } else {
            //     this.visible = true
            // }
        },
        rowClick(val) {
            this.pageSize = 15
            this.pageNo = 1
            this.activeName = '3'
            this.stageId = val.stageId 
            this.executorId = val.id
            this.getSparkTasks()
        },
        setCommFun() {
            const param = {
                applicationId: this.applicationId,
                applicationAttemptId: this.sparkAttemptId,
                pageSize: this.pageSize,
                pageNo: this.pageNo
            }
            return param
        },
        async getSparkJobs(data) {
            this.loading++
            console.log(data)
            const param = {
                ...this.setCommFun(),
                jobId: data,
            }
            const res = await this.$simpleAsyncTo(getSparkJobs(param), '获取spark-job数据失败')
            if (res) {
                this.sparkJobsList= res.data.totalList
                this.total = res.data.total
            }
            this.loading--
        },
        async getSparkStages() {
            this.loading++
            const param = {
                ...this.setCommFun(),
                jobId: this.JobId !== '' ? this.JobId : undefined,
                stageId: this.stageId !== '' ? this.stageId :  undefined,
                attemptId: this.attemptId !== '' ? this.attemptId : undefined
            }
            const res = await this.$simpleAsyncTo(getSparkStages(param), '获取spark-Stages数据失败')
            if (res) {
                this.sparkStageList = res.data.totalList
                this.total = res.data.total
            }
            this.loading--
        },
        async getSparkExecutors() {
            this.loading++
            const res = await this.$simpleAsyncTo(getSparkExecutors(this.setCommFun()), '获取spark-executors数据失败')
            if (res) {
                this.sparkExexList = res.data.totalList
                this.total = res.data.total
            }
            this.loading--
        },
        async getSparkTasks() {
            this.loading++
            const param = {
                ...this.setCommFun(),
                stageId: this.stageId !== '' ? this.stageId : undefined,
                executorId: this.executorId !== '' ? this.executorId : undefined,
                taskId: this.tasksId !== '' ? this.tasksId : undefined
            }
            const res = await this.$simpleAsyncTo(getSparkTasks(param), '获取spark-tasks数据失败')
            if (res) {
                this.sparkTaskList = res.data.totalList
                this.total = res.data.total
            }
            this.loading--
        },
        async getSparkEnvironment() {
            this.loading++
            const res = await this.$simpleAsyncTo(getSparkEnvironment({applicationId: this.applicationId, applicationAttemptId: this.sparkAttemptId,}), '获取spark-environment数据失败')
            if (res) {
                // this.sparkEnvironList = res.data.totalList
                this.classpathEntries = JSON.parse(res.data[0].classpathEntries)
                this.sparkProperties = JSON.parse(res.data[0].sparkProperties)
                this.systemProperties = JSON.parse(res.data[0].systemProperties)
            }
            this.loading--
        },
        async getSparkOverview() {
            this.loading++
            const param = {
                applicationId: this.applicationId,
                applicationAttemptId: this.sparkAttemptId,
            }
            const res = await this.$simpleAsyncTo(getSparkOverview(param), '获取spark概览数据失败')
            if (res) {
                this.sparkOverview = res.data[0]
                this.applicationName = res.data[0].applicationName
                this.endTime = res.data[0].endTime
                console.log(res.data.length)
                if (res.data.length === 0) {
                    this.endTime = ''
                    this.applicationName = ''
                    this.sparkOverview.startTime= ''
                    this.sparkOverview.endTime= ''
                    this.sparkOverview.sparkUser= ''
                    this.sparkOverview.queueName=''
                    this.sparkOverview.completed=''
                    this.sparkOverview.sparkSubmitDeploymode=''
                }
            }
            this.loading--
        },
        async getSparkLog(data) {
            console.log(data, data.executorLogsStdout)
            const getUser = JSON.parse(window.sessionStorage.getItem('act_key_login_DATA'))
            const param = {
                applicationId: this.applicationId,
                logUrl: data.executorLogsStdout,
                loginUser: getUser.login_name,
                appUser: this.sparkOverview.sparkUser,
            }
            const res = await this.$simpleAsyncTo(getSparkLog(param), '获取spark日志失败')
            if (res) {
                this.istitle = 'operate'
                this.getSpark = res.data
            }
        }
    },

}

</script>
<style lang="less">
.yarnTask-dia{
    background-color: #F8F8FA;
    overflow: auto;
    .yarn-spark{
        // overflow: auto;

    }
    .yarn-dialog1 {
    overflow: auto;
    // height: 100%;
    margin-left: 20px;
    padding-top: 10px;
    .el-form{
        margin-left: 5px;
        align-items: center;
        .el-input {
            width: 180px;
        }
    }
    .title{
        // font-size: 16px;
        padding-bottom: 10px;
        // margin-bottom: 10px;
    }
    .tabpan{
        overflow: auto;
        width: 98%;
        height: 600px;
    }
    .tabpan1{
        overflow: auto;
        .el-table {
            margin-bottom: 10px;
            .has-gutter{
                color: black;
            }
        }
    }
    .nospark{
        position: relative;
        .center{
            position: absolute;
            left: 40%;
            top: 40%;
            h2 {
                margin-left: 75px;
            }
        }
    }
    .top{
        // height: 200px;
        // background-color: white;
        display: flex;
        margin-bottom: 10px;
        width: 99%;
        min-width: 800px;
        flex-wrap: wrap;
        .iconfont{
            margin-left:15px;
            color: white;
            // background-color: rgb(104, 161, 250);
            background-color: #67B6B0;
            font-size: 50px;
            height: 50px;
        }
        .content{
            margin-left: 10px;
            // font-size: 14px;
            // color: #606266;
            width: 99%;
            display: flex;
            // background-color: palevioletred;
            // display: flex;
            .tbl-name{
                font-weight: 600;
                margin-left: 5px;
            }
            .el-form {
                .el-form-item__label {
                    color: black;
                    // font-weight: 500;
                }
                .el-form-item{
                    margin-bottom: 0px;
                    div{
                        color: #9E9E9E;
                    }
                }
            }
            // .el-form {
            //     .el-form-item{
            //         margin-bottom: 0px;
            //     }
            // }
            .content-id{
                margin-top: 5px;
                color: #9B8C9B;
            }
            .row-1{
                margin-left: 10px;
                min-width: 400px;
                .el-form {
                    .el-form-item{
                        margin-bottom: 0px;
                    }
                }
            }
            .row-2{
                margin-left: 10px;
                min-width: 350px;
            }
        }
        // .content{
        //     display: flex;
        //     margin-left: 20px;
        //     // float: left;
        //     // margin-bottom: 10px;
        //     .content-id{
        //         margin-top: 5px;
        //         color: #9B8C9B;
        //     }
        //     .el-form{
        //         border: 1px solid black;
        //     }
        // }
        .top-content {
            width: 100%;
            margin-top: 5px;
            margin-left: 5px;
            height: 120px;
            background-color: white;
            align-items: center;
            display: flex;
            // width: 50%;
            min-width: 350px;
        }
        .bottom-content{
            margin-top: 5px;
            margin-left: 5px;
            width: 22%;
            height: 120px;
            // margin-top: 10px;
            display: flex;
            background-color: white;
            align-items: center;
            min-width: 350px;
        }
        
        .center-top{
            margin-top: 5px;
            width: 22%;
            margin-left: 5px;
            height: 120px;
            background-color: white;
            align-items: center;
            display: flex;
            min-width: 350px;
        }
        .center-bottom{
            margin-top: 5px;
            width: 22%;
            margin-left: 5px;
            height: 120px;
            background-color: white;
            align-items: center;
            display: flex;
            min-width: 350px;
        }
    }
}
}
// .slot-empty{
//     margin-left: -510px;
// }




</style>