<template>
  <section class="compute">
    <el-row ref="search" class="mb-10">
      <el-col :xs="18" :sm="12" :md="12" :lg="15" :xl="18">计算设置</el-col>
      <el-col :xs="6" :sm="12" :md="12" :lg="9" :xl="6" style="text-align:end">
        <el-button type="primary" size="mini" class="ml-20" @click="addCompute">＋  添加计算设置</el-button>
      </el-col>
    </el-row>
      <el-table
        :data="tableData"
        style="width: 100%;" max-height="800"
        v-loading="!!loading">
        <el-table-column prop="engine_name" label="计算引擎名称"></el-table-column>
        <el-table-column prop="engine_type" label="计算引擎类型"></el-table-column>
        <el-table-column prop="engine_code" label="计算引擎编码"></el-table-column>
        <el-table-column prop="endpoind" label="endpoint"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <i class="el-icon-paperclip mr-20 color" @click="testConnection(scope.row)" title="测试连接"></i> -->
            <!-- <i class="el-icon-delete color" @click="deleteEngine"></i> -->
            <SimpleConfirm @confirm="delClick(scope.row)" />
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
  </section>
</template>

<script>
import pager from '@/mixins/pager'
import { getComputList, deleteEngine } from '@/api/management/comput'
export default {
  name: 'Compute',
  mixins: [pager],
  data() {
    return {
      tableData: [],
      loading: 0
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    // 获取计算设置列表
    async getTableList() {
      this.loading++
      const params = {
        pageNo: this.pageFilters.pageNo,
        pageSize: this.pageFilters.pageSize
      }
      const res = await this.$simpleAsyncTo(getComputList(params), '获取列表失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
        // this.$message({
        //   type: 'success',
        //   message: res.msg
        // })
        this.loading--
      }
    },
    addCompute() {
      this.$router.push({path: '/management/system/add-compute'})
    },
    // 测试连接
    testConnection(row) {},
    // 删除引擎
    async delClick(row) {
      const params = {id: row.id}
      const res = await this.$simpleAsyncTo(deleteEngine(params), '删除失败')
      if (res) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getTableList()
      }
    }
  }
}
</script>

<style lang="scss">
.compute {
  padding: 15px 15px 0 15px;
  .color {
    font-size: 16px;
    color: $--color-primary;
  }
}
</style>
