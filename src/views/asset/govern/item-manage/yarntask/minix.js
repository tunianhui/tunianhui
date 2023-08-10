import {getSparkAttemptId} from '@/api/govern/item-manage'
export default {
    data() {
        return {
            sparkAttemptIdList: [],
            centerTopList: {
                'startTime' :'起止时间:',
                // 'endTime': '结束时间',
            },
            centerBottomList: {
                'sparkUser': '执行用户:',
                'queueName': '队列名称:',
                'sparkSubmitDeploymode': '提交模式:'
            },
            bottomContentList: {
                'completed': '是否已完成:',
            },
            endTime: '',
        }
    },
    // mounted() {
    //     this.getSparkAttemptId()
    // },
    methods: {
        toJobFun(val) {
            this.activeName = '0'
            this.jobId = val
            this.getSparkJobs(val)
        },
        toTaskFun(val) {
            this.activeName = '3'
            this.tasksId = val
            this.getSparkTasks()
        },
        toStageFun(val,val1) {
            this.activeName = '1'
            this.stageId = val
            this.attemptId = val1
            this.getSparkStages()
        },
        async getSparkAttemptId(data) {
            const param = {
                applicationId: data.appId || data.taskId
            }
            const res = await this.$simpleAsyncTo(getSparkAttemptId(param), '')
            if (res) {
             this.sparkAttemptIdList = res.data
             let maxadd = res.data[0]
             res.data.forEach(element => {
                if (maxadd < element) {
                    maxadd = element
                }
             })
             this.sparkAttemptId = maxadd
             if (this.sparkAttemptId !== undefined) {
                if (this.activeName === '0') {
                   this.getSparkJobs() 
                }
                this.getSparkOverview()
             } else {
                this.sparkJobsList = []
                this.sparkStageList = []
                this.sparkExexList = [],
                this.sparkTaskList=[]
                // this.sparkEnvironList=[]
                this.classpathEntries = []
                this.sparkProperties = []
                this.systemProperties = []
             }
            }
        }
    }
}