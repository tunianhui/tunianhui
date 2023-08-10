import fetch from '@/libs/fetch'

//提供给hdfs溯源查询页面查询详细情况。
export function getHdfsDetail(data ={}) {
    return fetch({
        url: '/resGovern/trace/getHdfsDetail',
        method: 'post', 	
        need: true,
        data
    })
}

export function getHdfsTrend(data = {}) {
    return fetch({
        url: '/resGovern/trace/getHdfsTrend',
        method: 'post', 	
        need: true,
        data
    })
}

//hive溯源数据列表查询
export function getTableTrace(data = {}) {
    return fetch({
        url: '/resGover/trace/getTableTrace',
        method: 'get',
        params: data
    })
}

//hive等其他表溯源查询页面查询表字段信息
export function getTableColumns(data = {}) {
    return fetch({
        url: '/resGover/trace/getTableColumns',
        method: 'get',
        params: data
    })
}

// hive分区信息查询
export function getTablePartitions(data = {}) {
    return fetch({
        url: '/resGover/trace/getTablePartitions',
        method: 'get',
        params: data
    })
}

//hive表存储趋势
export function getTableTrend(data = {}) {
    return fetch({
        url: '/resGover/trace/getTableTrend',
        method: 'get',
        params: data
    })
}

//提供给队列溯源查询页面查询队列最近的使用情况
export function getQueueDetail(data = {}) {
    return fetch({
        url: '/resGover/trace/getQueueDetail',
        method: 'get',
        params: data
    })
}


export function getTaskDetail(data = {}) {
    return fetch({
        // url: '/resGover/trace/getTaskDetail',
        url: '/resGover/trace/getAppDetail',
        method: 'get',
        params: data
    })
}
 
//快照、manifest文件数趋势
export function getIcebergMetaTrend(data = {}) {
    return fetch({
        url: '/resGover/trace/getIcebergMetaTrend',
        method: 'get',
        params: data
    })
}

//指定项目下数据源列表查询接口
export function getProjectSource(data = {}) {
    return fetch({
        url: '/resGover/workTable/getProjectSource',
        method: 'get',
        params: data
    })
}

//
export function getDictList(data = {}) {
    return fetch({
        url: '/resGover/dict/getDictList',
        method: 'get',
        params: data
    })
}

//
export function getProjectQueue(data = {}) {
    return fetch({
        url: '/resGover/workTable/getProjectQueue',
        method: 'get',
        params: data
    })
}

//
export function getProjectMen(data = {}) {
    return fetch({
        url: '/resGover/workTable/getProjectMenList',
        method: 'get',
        params: data
    })
}

//spark-jobs查询接口
export function getSparkJobs(data = {}) {
    return fetch({
        url: '/resGover/trace/getSparkJobs',
        method: 'get',
        params: data
    })
}

//spark-stages查询接口
export function getSparkStages(data = {}) {
    return fetch({
        url: '/resGover/trace/getSparkStages',
        method: 'get',
        params: data
    })
}

//spark-Executors查询接口
export function getSparkExecutors(data = {}) {
    return fetch({
        url: '/resGover/trace/getSparkExecutors',
        method: 'get',
        params: data
    })
}

//spark-tasks查询接口
export function getSparkTasks(data = {}) {
    return fetch({
        url: '/resGover/trace/getSparkTasks',
        method: 'get',
        params: data
    })
}

//spark-Environment查询接口
export function getSparkEnvironment(data = {}) {
    return fetch({
        url: '/resGover/trace/getSparkEnvironment',
        method: 'get',
        params: data
    })
}

//spark概览查询接口
export function getSparkOverview(data = {}) {
    return fetch({
        url: '/resGover/trace/getSparkOverview',
        method: 'get',
        params: data
    })
}

//spark日志查询接口
export function getSparkLog(data = {}) {
    return fetch({
        url: '/resGover/trace/getSparkLog',
        method: 'get',
        params: data
    })
}

//spark任务重试次数
export function getSparkAttemptId(data = {}) {
    return fetch({
        url: '/resGover/trace/getSparkAttemptId',
        method: 'get',
        params: data
    })
}

//spark长尾任务
// 1、AppAttemptId列表
export function getAppAttemptIdList(data = {}) {
    return fetch({
        url: '/resGover/cmTaskMgr/getAppAttemptIdList',
        method: 'get',
        params: data
    })
}

// 2、stageId.stageAttemptId列表查询接口
export function getStageIdandAttemptIdList(data = {}) {
    return fetch({
        // url: '/resGover/cmTaskMgr/getStageIdandAttemptIdList',
        url: '/resGover/sparkCommonMgr/getStageIdandAttemptIdList',
        method: 'get',
        params: data
    })
}

//任务耗时情况
export function getTaskDurationList(data = {}) {
    return fetch({
        url: '/resGover/sparkTaskMgr/getSparkTaskDurationList',
        method: 'get',
        params: data
    })
}


//jobId查询接口
export function getJobId(data = {}) {
    return fetch({
        url: '/resGover/sparkCommonMgr/getJobId',
        method: 'get',
        params: data
    })
}

//stage任务属性查询接口
export function getSparkStageMetrics(data = {}) {
    return fetch({
        url: '/resGover/sparkCommonMgr/getSparkStageMetrics',
        method: 'get',
        params: data
    })
}

//stage治理属性查询接口
export function getStageJudge(data = {}) {
    return fetch({
        url: '/resGover/sparkCommonMgr/getStageJudge',
        method: 'get',
        params: data
    })
}

//tasks读取数据量与耗时比值查询接口
export function getTasksDataAndTimeRatio(data = {}) {
    return fetch({
        url: '/resGover/sparkTaskMgr/getTasksDataAndTimeRatio',
        method: 'get',
        params: data
    })
} 

//任务调度overhead过大
export function getSparkOverheadList(data = {}) {
    return fetch({
        url: '/resGover/sparkTaskMgr/getSparkOverheadList',
        method: 'get',
        params: data
    })
}

//小文件分区
export function hiveGetTablePartitions(data = {}) {
    return fetch({
        url: '/resGover/stoGovernMod/getTablePartitions',
        method: 'get',
        params: data
    })
}