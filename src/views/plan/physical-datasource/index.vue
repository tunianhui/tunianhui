<template>
  <div class="physical-datasource height-100per">
    <div class="page-title">
      <span>
        物理数据源&nbsp;
        <i class="el-icon-warning-outline"></i>
      </span>
      <div class="fr flex-layout">
        <el-input
          v-model="data_source_name"
          placeholder="请搜索数据源"
          prefix-icon="el-icon-search"
          class="mr-15"
          clearable
        ></el-input>
        <el-button type="primary" @click="handleAddDatasource" icon="el-icon-plus">添加数据源</el-button>
        <el-button
          type="primary"
          :disabled="selectedIds.length>0?false:true"
          @click="handleBatchDel"
        >批量删除</el-button>
      </div>
    </div>
    <div class="content-box">
      <div class="table-content">
        <el-table :data="tableList" class="table-list" @selection-change="handleSelectionChange" v-loading="!!loading">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="data_source_name" label="数据源名称" show-overflow-tooltip></el-table-column>
          <el-table-column label="创建信息" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>创建用户：{{scope.row.oper_user}}</div>
              <!-- <div>创建时间：{{scope.row.created_date}}</div> -->
              <div>更新时间：{{scope.row.oper_time}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="data_source_type" label="数据源类型" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="deploy_name" label="所属项目名称" show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="data_source_code" label="数据源编码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="connect_info" label="连接信息" show-overflow-tooltip>
            <!-- <template slot-scope="scope">
              <div>URL：{{scope.row.connect_info.url||'-'}}</div>
              <div>用户名：{{scope.row.connect_info.username||'-'}}</div>
            </template>-->
            <template slot-scope="scope">
              <ul v-if="scope.row.connect_info">
                <li
                  v-for="(value, key, index) in scope.row.connect_info"
                  :key="scope.$index + index"
                >
                  <div v-if="key !== 'password'">
                    <strong>{{key}}：</strong>
                    <span>{{value}}</span>
                  </div>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                title="测试连接"
                icon="font-16 el-icon-link"
                @click="handleTestConnection(scope.row)"
              ></el-button>
              <el-button
                type="text"
                class="mr-10"
                title="编辑"
                icon="font-16 el-icon-edit-outline"
                @click="handleEditDatasource(scope.row)"
              ></el-button>
              <SimpleConfirm @confirm="handleDeleteDatasource(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="fr pt-10"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-size="pageFilters.pageSize"
          :page-sizes="pageSizes"
          :current-page.sync="pageFilters.pageNo"
          layout="total, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <dialog-form
      :data="formData"
      :title="dialogTitle"
      v-if="dialogVisible"
      @testConnection="handleTestConnection"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    ></dialog-form>
  </div>
</template>

<script>
import dialogForm from './dialog-form'
import pager from '@/mixins/pager'
import {
  getTableList,
  batchDelDataSource,
  delDataSource,
  getTestConnection
} from '@/api/plan/physical-datasource'
export default {
  name: 'PhysicalDatasource',
  components: {
    dialogForm
  },
  mixins: [pager],
  data() {
    return {
      data_source_name: '',
      tableList: [],
      selectedIds: [],
      selectedDeploys: [],
      dialogVisible: false,
      formData: {},
      dialogTitle: '',
      loading: 0
    }
  },
  created() {
    this.getTableList()
  },
  watch: {
    data_source_name(newVal, oldVal) {
      this.getTableList()
    }
  },
  methods: {
    // 获取数据域列表
    async getTableList() {
      this.loading++
      const params = {
        data_source_name: this.data_source_name,
        pageNo: this.pageFilters.pageNo,
        pageSize: this.pageFilters.pageSize
      }
      const res = await this.$simpleAsyncTo(
        getTableList(params),
        '获取数据源列表失败'
      )
      if (res) {
        this.tableList = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    // 选中表格项
    handleSelectionChange(rows) {
      this.selectedIds = []
      this.selectedDeploys = []
      rows.forEach(item => {
        this.selectedIds.push(item.id)
        this.selectedDeploys.push(item.deploy_name)
      })
    },
    handleBatchDel() {
      this.$confirm('确认删除选中的数据源吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.batchDelDataSource()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 批量删除
    async batchDelDataSource() {
      const params = {
        data_source_id: this.selectedIds.join(','),
        deploy_name: this.selectedDeploys.join(',')
      }
      const res = await this.$simpleAsyncTo(
        batchDelDataSource(params),
        '批量删除失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '批量删除成功!'
        })
        this.getTableList()
      }
    },
    // 添加数据源
    handleAddDatasource() {
      this.formData = {}
      this.dialogTitle = '新增数据源'
      this.dialogVisible = true
    },
    // 编辑数据源
    handleEditDatasource(row) {
      const {
        id,
        data_source_name,
        data_source_desc,
        data_source_code,
        connect_info,
        data_source_type,
        deploy_name
      } = row
      // const data = connect_info && JSON.stringify(connect_info) !== '{}' ? JSON.parse(connect_info) : {}
      this.formData = {
        deploy_name,
        data_source_id: id,
        data_source_name,
        data_source_desc,
        data_source_type,
        data_source_code,
        // ...data
        ...connect_info
      }
      this.dialogTitle = '编辑数据源'
      this.dialogVisible = true
    },
    // 删除数据源
    async handleDeleteDatasource(row) {
      const res = await this.$simpleAsyncTo(
        delDataSource({
          data_source_id: row.id,
          deploy_name: row.deploy_name
        }),
        '删除数据源失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getTableList()
      }
    },
    // 测试连接
    async handleTestConnection(row) {
      const res = await this.$simpleAsyncTo(getTestConnection({connectInfo: row.connect_info, dataSrcType: row.data_source_type}), '测试连接失败')
      if (res) {
        this.$message({
          type: 'success',
          message: res.is_connect ? '测试连接成功' : '测试连接失败'
        })
      }
    },
    // 确认新增、编辑
    handleConfirm() {
      this.dialogVisible = false
      this.getTableList()
    },
    // 取消新增、编辑
    handleCancel() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.physical-datasource {
  .content-box {
    height: calc(100% - 40px);
  }
}
</style>
