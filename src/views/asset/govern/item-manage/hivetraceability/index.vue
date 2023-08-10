<template>
  <section class="item-manage-hive">
    <div class="head">
      <div class="head-left">hive溯源数据查询</div>
    </div>
    <div class="head-bottom">
      <SearchForm ref="searchForm" @search="getTableTrace" @reset="getTableTrace" :formRef="$refs.formfilter">
          <el-form :model="form" :inline="true" label-width="auto" ref="formfilter">
              <el-form-item label="表名" prop="tblName">
                  <el-input v-model="form.tblName" placeholder="请输入目录"></el-input>
              </el-form-item>
              <el-form-item label="表负责人" prop="owner">
                  <el-input v-model="form.owner" placeholder="请输入目录负责人"></el-input>
              </el-form-item>
              <el-form-item label="表归属项目" prop="projectName">
                  <el-input v-model="form.projectName" placeholder="请输入归属项目"></el-input>
              </el-form-item>
              <el-form-item label="表类型" prop="isIceberg">
                <el-select v-model="form.isIceberg">
                  <el-option label="hive" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="库名" prop="dbName">
                <el-input v-model="form.dbName" placeholder="请输入库名"></el-input>
              </el-form-item>
          </el-form>
      </SearchForm>
    </div>
    <div class="flex">
        <el-table :data="tableData" border style="width: 98%; margin: 10px;">
            <el-table-column prop="tblName" label="表名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="owner" label="表负责人"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="projectName" label="项目名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="isIceberg" label="表类型" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dbName" label="库名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="numfiles" label="表文件数量" min-width="83px"></el-table-column>
            <el-table-column prop="totalsize" label="表总存储(G)" min-width="87px"></el-table-column>
            <el-table-column prop="partitioned" label="是否分区表" min-width="83px">
              <template slot-scope="scope">
                <span>{{ scope.row.partitioned === '1' ? '分区' : '非分区' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="lastAccessTime" label="表最后访问时间" min-width="105px"></el-table-column>
            <el-table-column prop="isCompression" label="表是否压缩" min-width="83px">
              <template slot-scope="scope">
                <span>{{ scope.row.isCompression === '1' ? '没压缩' : '压缩' }}</span>
            </template>
            </el-table-column>
            <el-table-column prop="lifeCycle" label="表生命周期(天)" min-width="105px"></el-table-column>
            <el-table-column prop="createComment" label="表创建时间" min-width="83px"></el-table-column>
            <el-table-column label="查看">
                <template slot-scope="scope">
                    <el-button @click="details(scope.row)" type="primary" size="small">详情</el-button>
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
        <el-dialog :close-on-click-modal="false" title="表详情页面" :visible.sync="dialogVisible" width="60%" @close="close">
            <div class="column">
                <el-form :model="form" :inline="true">
                    <el-form-item v-for="(value, key) in tableDetailsPage" :key="key" :label="value">
                      <div class="guild">{{ formList[key] }}</div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-body">
              <el-tabs type="border-card" v-model="activeName" @tab-click="tabCliackhandle">
                <el-tab-pane label="字段信息">
                  <span>非分区信息</span>
                  <el-table :data="colList" border>
                    <el-table-column label="序号" type="index"></el-table-column>
                    <el-table-column prop="columnName" label="字段名称"></el-table-column>
                    <el-table-column prop="typeName" label="字段描述"></el-table-column>
                    <el-table-column prop="comment" label="字段描述"></el-table-column>
                  </el-table>
                  <span>分区信息</span>
                  <el-table :data="partiColList" border>
                    <el-table-column label="序号" type="index"></el-table-column>
                    <el-table-column prop="columnName" label="字段名称"></el-table-column>
                    <el-table-column prop="typeName" label="字段描述"></el-table-column>
                    <el-table-column prop="comment" label="字段描述"></el-table-column>
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
                </el-tab-pane>
                <el-tab-pane label="存储趋势">
                  <div class="chart" ref="chart">
                    <!-- <hiveLineChart :data="Tabletrend"></hiveLineChart> -->
                  </div>
                  <div>
                    <hivecharts v-if="visiblechart" :data="Tabletrend" style="width: 100%;height: 400px;"></hivecharts>
                    <!-- <hivecharts :data="Tabletrend" style="width: 1000px;height: 400px;"></hivecharts> -->
                    <!-- <hivecharts :data="Tabletrend" style="width: 100%;height: 400px;"></hivecharts> -->
                  </div>
                </el-tab-pane>
              </el-tabs>
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
import {getTableTrace, getTableColumns, getTablePartitions, getTableTrend} from '@/api/govern/item-manage'
import hiveLineChart from './hiveLineChart'
import hivecharts from './hivecharts'
export default {
  name: 'hivetraceability',
  components: {
    SearchForm,
    hiveLineChart,
    hivecharts
  },
  data () {
    return {
      loading: 0,
      pageSize: 15,
      pageNo: 1,
      total: 0,
      form: {
        tblName: '',
        owner: '',
        projectName: '',
        isIceberg: 0,
        dbName: '',
      },
      tableData: [],
      dialogVisible: false,
      tableDetailsPage: {
        tblName: '表名:',
        tableComment: '表描述:',
        projectName: '表归属项目:',
        partitioned: '是否分区:'
      },
      formList: {
        tblName: '',
        tableComment: '',
        projectName: '',
        partitioned: '',
      },
      activeName: '0',
      colList: [],
      partiColList: [],
      partitionList: [],
      Tabletrend: [],
      visiblechart: false,
    }
  },
  watch: {
  },
  mounted () { 
    this.getTableTrace()
  },
  methods: {
    tabCliackhandle() {
      if (this.activeName === '2') {
        this.visiblechart = true
      }
    },
    details(row) {
      this.formList.tblName = row.tblName
      this.formList.tableComment = row.tableComment
      this.formList.projectName = row.projectName
      this.formList.partitioned = row.partitioned === '1' ? '分区' : '非分区'
      const data = {
        tblName: row.tblName,
        dbName: row.dbName,
        clusterName: row.clusterName,
      }
      this.getTableColumns(data)
      this.getTablePartitions(data)
      this.getTableTrend(data)
    },
    close() {
      this.dialogVisible = false
      this.activeName = '0'
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getTableTrace()
    },
    //接口
    async getTableTrace() {
      const params = {
        ...this.form,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      const res = await this.$simpleAsyncTo(getTableTrace(params), '获取hive溯源数据列表失败')
      if (res) {
        this.tableData = res.data.list
        this.total = res.data.total
      }
    },
    async getTableColumns(params) {
      const res = await this.$simpleAsyncTo(getTableColumns(params), '')
      if (res) {
        this.colList = res.colList
        this.partiColList = res.partiColList
      }
    },
    async getTablePartitions(params) {
      const res = await this.$simpleAsyncTo(getTablePartitions(params), '获取hive分区列表失败')
      if (res) {
        this.partitionList = res.list
      }
    },
    async getTableTrend(params) {
      this.loading++
      const res = await this.$simpleAsyncTo(getTableTrend(params), '获取表存储趋势图失败')
      if (res) {
        this.Tabletrend = res.list
        this.dialogVisible = true
      }
      this.loading--
    }
  }
}
</script>

<style lang="scss">
.item-manage-hive{
  overflow: auto;
    .head {
        .head-left {
            font-size: 16px;
        }
    }
    .head-bottom {
      display: flex;
      background-color: #F5F5F5;
      width: 99%;
      .el-form {
        margin-bottom: 15px;
        margin-left: 10px;
        .el-form-item {
          // border: 1px solid black;
          .el-form-item__content {
            .el-select {
              width: 177px ;
            }
          }
        }
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
                width: 20%;
            }
        }
        .dialog-footer {
          margin-top: 20px;
        }
    }
}

</style>
