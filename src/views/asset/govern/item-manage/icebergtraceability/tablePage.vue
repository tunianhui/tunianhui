<template>
    <section>
        <el-page-header @back="goBack" content="表详情页面"></el-page-header>
        <div class="column">
            <el-descriptions>
                <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
                <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
                <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
                <el-descriptions-item label="备注">
                <el-tag size="small">学校</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
            </el-descriptions>
            <!-- <el-tag>表名:{{ formList.partitioned === 0 ? '非分区' : '分区' }}</el-tag> -->
            <!-- :model="form"  -->
            <el-form :inline="true">
                <el-form-item v-for="(value, key) in tableDetailsPage" :key="key" :label="value">
                    <div v-if="key === 'partitioned'" class="guild"> {{ formList.partitioned === 0 ? '非分区' : '分区' }}</div>
                    <div v-else class="guild">{{ formList[key] }}</div>
                </el-form-item>
            </el-form>
            <el-form v-if="this.formList.sourceType === 'iceberg'">
                <el-form-item label="数据存储路径：">
                    <div>{{ writeDataPath }}</div>
                </el-form-item>
                <el-form-item label="元数据存储路径:">
                    <div > {{ metadataLocation }}</div>
                </el-form-item>
            </el-form>
        </div>
        <h3>字段信息</h3>
        <div class="fieldinfo">
            <div class="left-fieldionfo">
                <span>非分区信息</span>
                <el-table :data="colList" border>
                    <el-table-column label="序号" type="index"></el-table-column>
                    <el-table-column prop="fieldPath" label="字段名称"></el-table-column>
                    <el-table-column prop="nativeDataType" label="字段类型"></el-table-column>
                    <el-table-column prop="description" label="字段描述"></el-table-column>
                </el-table>
            </div>
            <div class="right-fieldionfo">
                <span>分区信息</span>
                <el-table :data="partiColList" border>
                    <el-table-column label="序号" type="index"></el-table-column>
                    <el-table-column prop="fieldPath" label="字段名称"></el-table-column>
                    <el-table-column prop="nativeDataType" label="字段类型"></el-table-column>
                    <el-table-column prop="description" label="字段描述">
                        <template slot-scope="scope">
                            <div>{{ scope.row.description ? scope.row.description : '无字段描述' }}</div>
                        </template>
                    </el-table-column>
            </el-table>
            </div>
        </div>
        <div class="dialog-body">
        <!-- <el-tabs type="border-card" v-model="activeName" @tab-click="tabClickhandle"> -->
        <el-tabs :tab-position="tabPosition" v-model="activeName" @tab-click="tabClickhandle">
            <el-tab-pane label="字段信息">
            <span>非分区信息</span>
            <el-table :data="colList" border>
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column prop="fieldPath" label="字段名称"></el-table-column>
                <el-table-column prop="nativeDataType" label="字段类型"></el-table-column>
                <el-table-column prop="description" label="字段描述"></el-table-column>
            </el-table>
            <span>分区信息</span>
            <el-table :data="partiColList" border>
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column prop="fieldPath" label="字段名称"></el-table-column>
                <el-table-column prop="nativeDataType" label="字段类型"></el-table-column>
                <el-table-column prop="description" label="字段描述">
                    <template slot-scope="scope">
                        <div>{{ scope.row.description ? scope.row.description : '无字段描述' }}</div>
                    </template>
                </el-table-column>
            </el-table>
            </el-tab-pane>
            <el-tab-pane label="分区信息">
                <el-table border :data="partitionList">
                    <el-table-column prop="partName" label="分区名称"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间"></el-table-column>
                    <el-table-column prop="totalsize" label="存储量"></el-table-column>
                    <el-table-column prop="numfiles" label="文件数量"></el-table-column>
                    <el-table-column prop="updateTime" label="最后修改时间"></el-table-column>
                </el-table>
                <el-pagination
                class="fr pt-10 pb-10"
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pageNo"
                :page-sizes="[15, 25, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next"
                :total="total">
                </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="存储趋势">
                <span>开始时间:</span><el-date-picker type="date"  v-model="startTime" placeholder="选择日期时间" placement="bottom-start"></el-date-picker>
                <span>结束时间:</span><el-date-picker type="date"  v-model="endTime" placeholder="选择日期时间" placement="bottom-start" ></el-date-picker>
            <div style="width: 100%;height: 400px;">
                <hivecharts v-if="visablechart1" :data="Tabletrend" style="width: 100%;height: 400px;"></hivecharts>
            </div>
            </el-tab-pane>
            <el-tab-pane v-if="this.formList.sourceType === 'iceberg'" label="快照、manifest文件数趋势">
                <div style="width: 100%;height: 400px;">
                    <snapshotManifest v-if="visablesnaps" :data="snapshotList" style="width: 100%;height: 400px;"></snapshotManifest>
                </div>
            </el-tab-pane>
        </el-tabs>
        </div>
    </section>
</template>
<script>
// import * as echarts from 'echarts'
import {getTableColumns, getTablePartitions, getTableTrend, getIcebergMetaTrend} from '@/api/govern/item-manage'
import hivecharts from '@/views/asset/govern/item-manage/hivetraceability/hivecharts'
import {dateFormat, setback} from '@/libs/util'
// import { threadId } from 'worker_threads'
import snapshotManifest from './snapshotManifest'
export default {
    name: 'detailsPage',
    components: {
        hivecharts,
        snapshotManifest
    },
    props: {
        // formList: Object,
        // Tabletrend: Array,
        // snapshotList: Array,
    },
    data() {
        return {
            formList: [],
            tabPosition: "left",
            activeName: '0',
            dialogVisible: false,
            dialogFormVisible: true,
            tableDetailsPage: {
                tblName: '表名:',
                // tableComment: '表描述:',
                deployName: '归属项目:',
                partitioned: '是否分区:'
            },
            colList: [],
            partiColList: [],
            partitionList: [],
            Tabletrend1: [],
            metadataLocation: '',
            writeDataPath: '',
            snapshotList: [],
            Tabletrend: [],
            // chart: 
            option: {},
            visablechart1: false,
            visablesnaps: false,
            pageSize: 15,
            pageNo: 1,
            total: 0,
            startTime:setback(new Date()) ,
            endTime: new Date()
        }
    },
    watch: {
        'formList': {
            immediate: true,
            handler(val) {
                this.metadataLocation = val.metadataLocation
                this.writeDataPath = val.writeDataPath
                
                const data = {
                    tblName: val.tblName,
                    dbName: val.dbName,
                    sourceType: val.sourceType,
                    datasourceId: val.datasourceId,
                }
                
                this.getTableColumns({...data, tabParams: val.tabParams})
                this.getTablePartitions(data)
                this.getTableTrend(data)
                if (val.sourceType === 'iceberg') {
                    this.getIcebergMetaTrend(data) 
                }
                
            }
        }
    },
    created() {
       
        // this.getTablePartitions()
    },
    mounted() {
    },
  
    methods: {
        goBack() {

        },
        handleSizeChange(val) {
            this.pageSize = val
            this.handleCurrentChange(1)
        },
        handleCurrentChange(val) {
            this.pageNo = val
            const data = {
                tblName: this.formList.tblName,
                dbName: this.formList.dbName,
                sourceType: this.formList.sourceType,
                datasourceId: this.formList.datasourceId,
            }
            this.getTablePartitions(data)
        },
        tabClickhandle() {
            if (this.activeName === '2') {
                this.visablechart1 = true
            } else if (this.activeName === '3') {
                this.visablesnaps = true
            }
        },
        handleClose() {},
        close() {
            // this.$refs.form.resetFields()
            this.dialogFormVisible = false
            this.$emit('close')
        },
        async getTableColumns(params) {
            const res = await this.$simpleAsyncTo(getTableColumns(params), '')
            if (res) {
                this.colList = res.data.colList
                this.partiColList = res.data.partColList
            }
        },
        async getTablePartitions(data) {
            const params = {
                ...data,
                pageSize: this.pageSize,
                pageNo: this.pageNo
            }
            const res = await this.$simpleAsyncTo(getTablePartitions(params), '获取hive分区列表失败')
            if (res) {
                this.partitionList = res.data.totalList
                this.total = res.data.total
            }
        },
        async getTableTrend(data) {
            this.loading++
            const params = {
                ...data,
                startTime: this.startTime,
                endTime: dateFormat(this.endTime)
            }
            const res = await this.$simpleAsyncTo(getTableTrend(params), '获取表存储趋势图失败')
            if (res) {
                this.Tabletrend = res.list
                // this.visible = true
            }
            this.loading--
        },
        async getIcebergMetaTrend(param) {
            const res = await this.$simpleAsyncTo(getIcebergMetaTrend(param), '获取列表失败')
            if (res) {
                this.snapshotList = res.data
            }
        }
    },

}

</script>
<style lang="less">
.fieldinfo{
    display: flex;
    .el-table{
        margin: 10px;
        width: 98%;
        height: 200px;
        overflow: auto;
    }
    .left-fieldionfo{
        margin-left: 10px;
        width: 49%;
        background-color: #F5F5F5;
    }
    .right-fieldionfo{
        margin-left: 10px;
        background-color: #F5F5F5;
        width: 49%;
    }
}
// .chart {
//     width: 100%;
//     height: 400px;
// }
.el-tabs{
    margin-bottom: 10px;
    .el-tab-pane{
        width: 100%;
    }
    .el-table {
        height: 230px;
        overflow: auto;
    }
}


</style>