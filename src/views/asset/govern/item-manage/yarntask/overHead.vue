<template>
    <section>
        <div class="top">
                <el-form :inline="true">
                    <el-form-item label="stage_id.stage_attempt_id" placeholder="请选择">
                        <el-select v-model="stagIdAndattId" @change="stageIdfun">
                            <el-option v-for="item in StageIdandAttemptIdList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        <el-table border  stripe style="width: 100%" :data="tabledata">
            <template slot="empty">
            <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
            <img src="@/assets/images/nodata.png" alt="">
            <p>暂无数据</p>
        </template>
        <el-table-column prop="stageId" label="jobid.stageid">
            <template slot-scope="row">
                <div>{{row.jobId}}.{{row.stageId }}</div>
            </template>
        </el-table-column>
        <el-table-column prop="stageDurationLabel" label="stage耗时" min-width="180"></el-table-column>
        <el-table-column prop="taskCount" label="task个数"></el-table-column>
        <el-table-column prop="avgTaskDurationLabel" label="task平均耗时" min-width="180"></el-table-column>
        <el-table-column prop="sumTaskDurationLabel" label="task总体耗时" min-width="210"></el-table-column>
        <el-table-column prop="stageState " label="结果" min-width="180">
            <template slot-scope="row">
                <div>{{ row.stageState === 'broken' ? '过碎' : '正常' }}</div>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination 
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
    </section>
</template>

<script>
import {getSparkOverheadList, getStageIdandAttemptIdList, getJobId} from '@/api/govern/item-manage'
export default {
    name: 'overHead',
    props:{
        data: Object,
        applicationAttemptId: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            StageIdandAttemptIdList: [],
            tabledata: [],
            pageSize: 15,
            pageNo: 1,
            total: 0,
            timer: 0,
            stagIdAndattId: '',
            JobId: '',
        }
    },
    watch:{
        data: {
            immediate: true, // 只在数据加载后执行，即不要在数据加载时延迟执行。 这对
            handler(val) {
                this.debounceFun()
            }
        },
        applicationAttemptId: {
            immediate: true,
            handler() {
                this.debounceFun()
            }
        }
    },
    // mounted() {
    //     this.getSparkOverheadList()
    // },
    methods: {
        stageIdfun(val) {
            const data = val.split(',')
            this.stageId = data[0]
            this.stageAttemptId = data[1]
            this.getJobId()
        },
        debounceFun() {
            clearTimeout(this.timer) // 清除任务滚动条的处理器，防止多次调用。 这对于发出“请求”操作的频率有利。 不要在函数执行后再次调用。 这对于发出“请求”操作的频率无利。 如果在“@size-change”或“@current-change”事件发生时，也要在函数执行后再次调用。 这对于发出“页面滚动条”操
            this.timer = setTimeout(() => {this.getStageIdandAttemptIdList()}, 500) // 每次调用都重新计算。 这对

        },
        handleSizeChange(val) {
            this.pageSize = val
            this.handleCurrentChange(1)
        },
        handleCurrentChange(val) {
            this.pageNo = val
            this.getSparkOverheadList()
            // this.getTaskDetail()
        },
        async getStageIdandAttemptIdList() {
            const param = {
                applicationAttemptId: this.applicationAttemptId,
                applicationId: this.data.taskId,
                itemId: this.data.itemId
            }
            const res = await this.$simpleAsyncTo(getStageIdandAttemptIdList(param), '获取stageId.stageAttemptId列表失败') 
            if (res) {
                this.StageIdandAttemptIdList = res.data
                if (res.data.length > 0) {
                    this.stagIdAndattId =  res.data[0].label
                    const data = res.data[0].value.split(',')
                    this.stageId = data[0]
                    this.stageAttemptId = data[1]
                }
                if (this.stageId !== '' && this.stageAttemptId !== '') {
                    this.getJobId()
                }
            }
        },
        async getJobId() {
            const param = {
                applicationAttemptId: this.applicationAttemptId,
                applicationId: this.data.taskId,
                itemId: this.data.itemId,
                stageId: this.stageId,
                stageAttemptId: this.stageAttemptId
            }
            const res = await this.$simpleAsyncTo(getJobId(param), '')
            if (res) {
                this.JobId = res.data.jobId
                this.getSparkOverheadList() 
            }
    },
        async getSparkOverheadList() {
            const param = {
                applicationAttemptId: this.applicationAttemptId,
                applicationId: this.data.taskId,
                computeId: this.data.id,
                jobId: this.JobId,
                pageNo: this.pageNo,
                pageSize: this.pageSize
            }
            const res = await this.$simpleAsyncTo(getSparkOverheadList(param), '')
            if (res) {
                this.tabledata = res.data
                this.total = res.data.length
            }
        }
    }
}
</script>

<style>

</style>