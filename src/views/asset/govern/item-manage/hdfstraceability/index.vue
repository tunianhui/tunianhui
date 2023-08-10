<template>
    <section class="item-manage-hdfstraceability">
        <div class="head">
            <div class="head-left">hdfs溯源数据查询</div>
        </div>
        <div class="head-bottom">
            <SearchForm ref="searchForm" @search="getHdfsDetail" @reset="getHdfsDetail" :formRef="$refs.formfilter">
                <el-form :model="form" :inline="true" label-width="90px" ref="formfilter">
                    <el-form-item label="目录" prop="path">
                        <el-input v-model="form.path" placeholder="请输入目录"></el-input>
                    </el-form-item>
                    <el-form-item label="目录负责人" prop="user_name">
                        <el-input v-model="form.user_name" placeholder="请输入目录负责人"></el-input>
                    </el-form-item>
                    <el-form-item label="归属项目" prop="projectName">
                        <el-input v-model="form.projectName" placeholder="请输入归属项目"></el-input>
                    </el-form-item>
                </el-form>
            </SearchForm>
        </div>
        <div class="flex">
            <el-table :data="tableData" border style="width: 98%; margin: 10px;">
                <el-table-column prop="path" label="目录" width="180"></el-table-column>
                <el-table-column prop="user_name" label="目录负责人" width="180"></el-table-column>
                <el-table-column prop="projectName" label="项目名"></el-table-column>
                <el-table-column prop="file_count_desc" label="目录文件数量" min-width="100px"></el-table-column>
                <el-table-column prop="file_size" label="目录大小(G)" min-width="100px"></el-table-column>
                <el-table-column prop="modification_time" label="目录最后访问时间" min-width="118px"></el-table-column>
                <el-table-column prop="access_time" label="目录最后修改时间" min-width="118px"></el-table-column>
                <el-table-column label="存储趋势">
                    <template slot-scope="scope">
                        <el-button @click="StorageTrend(scope.row)" type="primary" size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
        <div class="dialog">
            <el-dialog :close-on-click-modal="false" title="hdfs存储页面" :visible.sync="dialogVisible" width="60%">
                <div class="column">
                    <el-form :model="form" :inline="true">
                        <el-form-item v-for="(value, key) in hdfsSaveList" :key="key" :label="value">
                            <div class="guild">{{ formList[key] }}</div>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="chart">
                    <hdfsLineChart :data="HdfsTrendlist" style="width: 100%;height: 400px;"></hdfsLineChart>
                </div>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>
        </div>
    </section>
</template>
<script>
import SearchForm from '@/components/searchform.vue'
import hdfsLineChart from './hdfsLineChart'
import {getHdfsDetail, getHdfsTrend} from '@/api/govern/item-manage'
export default {
    name: 'hdfstraceability',
    components: {
        SearchForm,
        hdfsLineChart
    },
    data() {
        return  {
            pageSize: 15,
            pageNo: 1,
            total: 0,
            dialogVisible: false,
            form: {
                path: '',
                user_name: '',
                projectName: '',
            },
            tableData: [],
            hdfsSaveList: {
                path: '目录名:',
                projectName: '目录归属项目:',
                user_name: '负责人:'
            },
            formList: {},
            HdfsTrendlist :[]
        }
    },
    mounted() {
        this.getHdfsDetail()
    },
    methods: {
        StorageTrend(row) {
            // this.dialogVisible = true
            console.log(row)
            this.formList.path = row.path
            this.formList.projectName = row.projectName
            this.formList.user_name = row.user_name
            this.getHdfsTrend(row.path)
        },
        handleSizeChange(val) {
        this.pageSize = val
        this.handleCurrentChange(1)
        },
        handleCurrentChange(val) {
        this.pageNo = val
        this.getHdfsDetail()
        },
        async getHdfsDetail() {
            const params = {
                ...this.form,
                pageSize: this.pageSize,
                pageNo: this.pageNo
            }
            const res = await this.$simpleAsyncTo(getHdfsDetail(params), '获取hdfs溯源列表失败')
            if (res) {
                this.tableData = res.list
                this.total = res.count
            }
        },
        async getHdfsTrend(path) {
            const res= await this.$simpleAsyncTo(getHdfsTrend({path: path}), '')
            if (res) {
                this.HdfsTrendlist = res.list
                this.dialogVisible = true
            }
        }
    }

}
</script>
<style lang="less">
.item-manage-hdfstraceability{
    .head {
        .head-left {
            font-size: 16px;
        }
    }
    .head-bottom {
        display: flex;
        background-color: #F5F5F5;
        width: 99%;
        .el-form{
            min-width: 400px;
            // display: flex;
            // flex-wrap: wrap;
            // border: 1px solid black;
            // margin-left: 10px;
            // float: left;
        }
        .el-form-item {
            // margin-left: 10px;
            // float: left;
        }
    }
    .flex {
        margin-top: 10px;
        background-color: #F5F5F5;
        width: 99%;
    }
    .dialog {
        .column {
            width: 900px;
            .el-form-item {
                width: 30%;
            }
        }
    }
}

</style>