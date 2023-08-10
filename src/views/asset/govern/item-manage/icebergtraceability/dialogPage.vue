<template>
    <section :visible="dialogFormVisible" @close="close">
        <div class="table-dialog">
            <div>表详情页面</div>
            <div class="column">
            <div class="wrapper">
                <i style="color: white;" class="iconfont icon-shujuwenjian1"></i>
                <div class="summary">
                    <div class="tbl-name">
                        {{ formList.tblName }}
                    </div>
                    <el-form :inline="true">
                        <el-form-item label="归属项目">
                            <div>{{ formList.deployName }}</div>
                        </el-form-item>
                        <el-form-item label="是否分区" style="margin-left: 50px;">
                            <div> {{ formList.partitioned === 0 ? '非分区' : '分区' }}</div>
                        </el-form-item>
                    </el-form>
                    <el-form v-if="this.formList.sourceType === 'iceberg'">
                        <div class="m1-20">
                            <div class="m1-10">数据存储路径</div>
                            <div class="m1-5">{{ formList.writeDataPath }}<wbr></div>
                        </div>
                        <div class="m1-20" >
                            <div class="m1-10">元数据存储路径</div>
                            <div class="m1-5">{{ formList.metadataLocation }}<wbr></div>
                        </div>
                        <!-- <el-form-item label="数据存储路径">
                            <div>{{ formList.writeDataPath }}</div>
                        </el-form-item> -->
                        <!-- <el-form-item label="元数据存储路径" >
                            <div style="display: inline-flex;word-break: break-all;"> {{ metadataLocation }}<wbr></div>
                        </el-form-item> -->
                    </el-form>
                </div>
            </div>
            </div>
            <div class="dialog-body">
            <el-tabs type="border-card" v-model="activeName" @tab-click="tabClickhandle" :style="{height: tabheight + 'px'}">
                <template slot="empty">
                    <img src="@/assets/images/govern/govern.png" alt="">
                </template>
            <!-- <el-tabs :tab-position="tabPosition" v-model="activeName" @tab-click="tabClickhandle"> -->
                <el-tab-pane label="字段信息" name="first">
                    <div v-if="formList.partitioned === 0">
                        <span>非分区信息</span>
                        <!-- <div class="tabpan2" :style="{height: `${tabheight - 80 }` + 'px'}"> -->
                            <el-table :data="colList" border :height="tabheight - 80">
                                <template slot="empty">
                                <!-- <el-emty :image-size="100" description="暂无数据"></el-emty> -->
                                <img src="@/assets/images/nodata.png" alt="">
                                <p>暂无数据</p>
                            </template>
                            <el-table-column label="序号" type="index"></el-table-column>
                            <el-table-column prop="fieldPath" label="字段名称"></el-table-column>
                            <el-table-column prop="nativeDataType" label="字段类型"></el-table-column>
                            <el-table-column prop="description" label="字段描述">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.description ? scope.row.description : '无' }}</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- </div> -->
                    </div>
                    <div v-if="formList.partitioned === 1">
                        <span>非分区信息</span>
                        <!-- <div class="tabpan" :style="{height: `${tabheight/2 - 50}` + 'px'}"> -->
                            <el-table :data="colList" border :height="tabheight/2 - 50">
                                <template slot="empty">
                                    <!-- <el-emty :image-size="100" description="暂无数据"></el-emty> -->
                                    <img src="@/assets/images/nodata.png" alt="">
                                    <p>暂无数据</p>
                                </template>
                            <el-table-column label="序号" type="index"></el-table-column>
                            <el-table-column prop="fieldPath" label="字段名称"></el-table-column>
                            <el-table-column prop="nativeDataType" label="字段类型"></el-table-column>
                            <el-table-column prop="description" label="字段描述">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.description ? scope.row.description : '无' }}</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- </div> -->
                        <span>分区信息</span>
                        <!-- <div class="tabpan" :style="{height: `${tabheight/2 - 50}` + 'px'}"> -->
                            <el-table :data="partiColList" border :height="tabheight/2 - 50">
                            <el-table-column label="序号" type="index"></el-table-column>
                            <el-table-column prop="fieldPath" label="字段名称"></el-table-column>
                            <el-table-column prop="nativeDataType" label="字段类型"></el-table-column>
                            <el-table-column prop="description" label="字段描述">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.description ? scope.row.description : '无' }}</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- </div> -->
                    </div>
                </el-tab-pane>
                <el-tab-pane v-if="formList.partitioned === 1" label="分区信息" name="second">
                    <!-- <div class="tableTab" :style="{height: `${tabheight - 100 }` + 'px'}"> -->
                        <el-table border :data="partitionList" :height="tabheight - 100">
                            <template slot="empty">
                                <!-- <el-emty :image-size="100" description="暂无数据"></el-emty> -->
                                <img src="@/assets/images/nodata.png" alt="">
                                <p>暂无数据</p>
                            </template>
                        <el-table-column prop="partName" label="分区名称" min-width="130"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" min-width="130"></el-table-column>
                        <el-table-column prop="parTotalsize" label="存储量" min-width="100">
                            <template slot-scope="scope">
                                <Byte :value="scope.row.parTotalsize"></Byte>
                            </template>
                        </el-table-column>
                        <el-table-column prop="parNumfiles" label="文件数量"></el-table-column>
                        <el-table-column prop="updateTime" label="最后修改时间" min-width="130"></el-table-column>
                    </el-table>
                    <!-- </div> -->
                    
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
                <el-tab-pane label="存储趋势" name="third">
                    <el-date-picker :clearable="false"  v-model="trendDate" type="daterange" @change="dateChange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                    <!-- <span>开始时间:</span><el-date-picker type="date"  v-model="startTime" placeholder="选择日期时间" placement="bottom-start"></el-date-picker>
                    <span style="margin-left: 20px;">结束时间:</span><el-date-picker type="date"  v-model="endTime" placeholder="选择日期时间" placement="bottom-start" @change="dateChange1"></el-date-picker> -->
                <!-- <div style="width: 100%;height: 400px;">
                    <hivecharts v-if="visablechart1" :data="Tabletrend" style="width: 100%;height: 400px;"></hivecharts>
                </div> -->
                <div style="width: 100%;">
                    <hivecharts v-if="visablechart1" :data="Tabletrend" :style="{height: `${tabheight - 80}` + 'px'}"></hivecharts>
                </div>
                </el-tab-pane>
                <el-tab-pane v-if="this.formList.sourceType === 'iceberg'" label="快照、manifest文件数趋势" name="fourth">
                    <div style="width: 100%;">
                        <!-- <snapshotManifest v-if="visablesnaps" :data="snapshotList" :style="{height: `${tabheight - 70}` + 'px'}"></snapshotManifest> -->
                    </div>
                </el-tab-pane>
                <el-tab-pane v-if="formList.tabType === 'TablePartitions'" label="小文件分区" name="fifth">
                    <!-- <div class="tableTab" :style="{height: `${tabheight - 100 }` + 'px'}"> -->
                        <el-table border :data="TablePartitionsList" :height="tabheight - 100">
                            <template slot="empty">
                                <!-- <el-emty :image-size="100" description="暂无数据"></el-emty> -->
                                <img src="@/assets/images/nodata.png" alt="">
                                <p>暂无数据</p>
                            </template>
                        <el-table-column prop="partName" label="分区名称"></el-table-column>
                        <el-table-column prop="parTotalsize" label="分区数据量">
                            <template slot-scope="scope">
                                <Byte :value="scope.row.parTotalsize"></Byte>
                            </template>
                        </el-table-column>
                        <el-table-column prop="parNumfiles" label="分区文件数"></el-table-column>
                    </el-table>
                    <!-- </div> -->
                    <el-pagination
                    class="fr pt-10 pb-10"
                    background
                    @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1"
                    :current-page.sync="pageNo1"
                    :page-sizes="[15, 25, 50, 100]"
                    :page-size="pageSize1"
                    layout="total, sizes, prev, pager, next"
                    :total="count">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
            </div>
        </div>
    </section>
</template>
<script>
import Byte from '@c/byte'
// import * as echarts from 'echarts'
import {getTableColumns, getTablePartitions, getTableTrend, getIcebergMetaTrend, hiveGetTablePartitions} from '@/api/govern/item-manage'
import hivecharts from '@/views/asset/govern/item-manage/hivetraceability/hivecharts'
import {dateFormat, setback} from '@/libs/util'
// import { threadId } from 'worker_threads'
import snapshotManifest from './snapshotManifest'
export default {
    name: 'detailsPage',
    components: {
        hivecharts,
        snapshotManifest,
        Byte
    },
    props: {
        formList: Object,
        getheight: Number,
        // Tabletrend: Array,
        // snapshotList: Array,
    },
    data() {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
        // const start = setback(new Date())
        return {
            tabheight: 0,
            trendDate: [start, end] || [],
            trendDateCopy: [start, end] || [],
            tabPosition: "left",
            activeName: '0',
            dialogVisible: false,
            dialogFormVisible: true,
            tableDetailsPage: {
                // tblName: '表名:',
                // tableComment: '表描述:',
                deployName: '归属项目',
                partitioned: '是否分区'
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
            pageSize1: 15,
            pageNo1: 1,
            total: 0,
            startTime:setback(new Date()) ,
            endTime: new Date(),
            formListCopy: {},
            loading: 0,
            TablePartitionsList: [],
            count: 0,
        }
    },
    watch: {
        'formList': {
            immediate: true,
            handler(val) {
                if (val.tabType === 'TablePartitions') {
                    this.activeName = 'fifth'
                } else {
                    this.activeName = 'first'
                }
                this.visablechart1 = false
                this.visablesnaps = false
                // this.metadataLocation = val.metadataLocation
                // this.writeDataPath = val.writeDataPath
                this.trendDate = this.trendDateCopy
                this.formListCopy = {
                    tblName: val.tblName ? val.tblName : val.objectName,
                    dbName: val.dbName,
                    sourceType: val.sourceType,
                    datasourceId: val.datasourceId,
                }
                if (Object.keys(this.formList).length ===1 && val.tabType === 'TablePartitions') {
                } else if (Object.keys(this.formList).length !== 0) {
                    if (Object.keys(this.formList).length !== 0) {
                        this.getTableColumns({...this.formListCopy, tabParams: val.tabParams})
                        if (val.partitioned === 1) {
                            this.getTablePartitions(this.formListCopy)
                        }
                        if (val.tabType === 'TablePartitions') {
                            this.hiveGetTablePartitions(this.formListCopy)
                        }
                        if (val.sourceType === 'iceberg') {
                            // this.getIcebergMetaTrend(this.formListCopy)
                        }
                        // this.getTableTrend(this.formListCopy)
                    }
                }
                // if (Object.keys(this.formList).length !== 0) {
                //     this.getTableColumns({...data, tabParams: val.tabParams})
                //     if (val.partitioned === 1) {
                //         this.getTablePartitions(data)
                //     }
                //     if (val.tabType === 'TablePartitions') {
                //         this.hiveGetTablePartitions(data)
                //     }
                //     this.getTableTrend(data)
                // }
                // this.tabheight = this.getheight - 180

            }
        }
    },
    created() {
    },
    mounted() {
        this.$nextTick(_ => {
            this.setHeight()
        })
        window.addEventListener('resize', ()=>{
            this.setHeight()
        })
    },
    destroyed() {
        window.removeEventListener('resize', this.setHeight, false)
    },
    methods: {
        setHeight() {
            const add = document.getElementsByClassName('wrapper')
            this.tabheight = this.getheight - add[0].offsetHeight -60
        },
        dateChange() {
            this.getTableTrend(this.formListCopy)
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
        handleSizeChange1(val) {
            this.pageSize1 = val
            this.handleCurrentChange1(1)
        },
        handleCurrentChange1(val) {
            this.pageNo1 = val
            this.hiveGetTablePartitions(this.formListCopy)
        },
        tabClickhandle() {
            if (this.activeName === 'third') {
                this.visablechart1 = true
                if (this.formListCopy.datasourceId !== undefined) {
                    this.getTableTrend(this.formListCopy) 
                }
                // this.dateChange()
            } else if (this.activeName === 'fourth') {
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
            this.loading++
            const res = await this.$simpleAsyncTo(getTableColumns(params), '')
            if (res) {
                this.colList = res.data.colList
                this.partiColList = res.data.partColList
            }
            this.loading--
        },
        async getTablePartitions(data) {
            this.loading++
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
            this.loading--
        },
        async getTableTrend(data) {
            this.loading++
            const [startDate, endDate] = this.trendDate
            // if (typeof startDate !== 'string' ) {
            //     startDate = dateFormat(startDate)
            // }
            const params = {
                ...data,
                // startTime: startDate,
                startDate: typeof startDate === 'string' ? startDate : dateFormat(startDate),
                endDate: dateFormat(endDate),
            }
            const res = await this.$simpleAsyncTo(getTableTrend(params), '获取表存储趋势图失败')
            if (res) {
                this.Tabletrend = res.data.tblsList
                // this.visible = true
            }
            this.loading--
        },
        async getIcebergMetaTrend(param) {
            this.loading++
            const res = await this.$simpleAsyncTo(getIcebergMetaTrend(param), '获取列表失败')
            if (res) {
                this.snapshotList = res.data
            }
            this.loading--
        },
        async hiveGetTablePartitions(data) {
            const param = {
                ...data,
                pageNo: this.pageNo1,
                pageSize: this.pageSize1
            }
            const res = await this.$simpleAsyncTo(hiveGetTablePartitions(param), '')
            if (res) {
                this.TablePartitionsList = res.data.totalList
                this.count = res.data.total
            }
        }
    },

}

</script>
<style lang="less">
// .chart {
//     width: 100%;
//     height: 400px;
// }
.table-dialog{
    .column{
        display: flex;
        min-height: 120px;
        background-color: white;
        margin-bottom: 10px;
        margin-top: 10px;
        .iconfont{
            font-size: 50px;
            margin-left: 15px;
            background-color: #A186FF;
            color: white;
        }
        .wrapper{
            display: flex;
            align-items: center;
            .summary{
                margin-left: 30px;
                .tbl-name{
                    font-weight: 600;
                    // font-size: 20px;
                    // margin-bottom: 10px;
                }
            }
        }
    }
    // margin: 20px;
    padding: 20px;
    .el-form {
        // width: 98%;
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
}
.el-tabs{
    // height: 500px;
    margin-bottom: 10px;
    // height: 400px;
    .el-tab-pane{
        // height: 100%;
        // max-height: 400px;
        width: 100%;
    }
    .tabpan2{
        // max-height: 50%;
        // height: 500px;
        // height: calc(100% - 500px);
        overflow: auto;
    }
    .tabpan {
        // max-height:250px;
        overflow: auto;
    }
    .tableTab{
        // height: 500px;
        overflow: auto;
        // height: 400px;
    }
}
.m1-20{
    display: flex;
    font-size: 14px;
    .m1-10{
        white-space: nowrap;
    }
    .m1-5{
        margin-left: 15px; 
        color:#9E9E9E ; 
        display: inline-flex;
        word-break: break-all;
    }
}



</style>