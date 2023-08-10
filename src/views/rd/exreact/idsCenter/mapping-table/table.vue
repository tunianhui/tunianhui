<!--
 * @Author: 大炸鹅
 * @Date: 2023-02-07 16:51:53
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-02-09 14:02:32
 * @FilePath: \数据智能构建\src\views\rd\exreact\idsCenter\mapping-table\table.vue
-->
<template>
  <div class="mapping-id-table">
    <div class="mapping-id-table-header mb-10">
      <div>ID映射表</div>
      <!-- <div class="fr my-btn">
        <el-input
          style="width:200px;"
          v-model="keyword"
          placeholder="请输入关键字"
          prefix-icon="el-icon-search"
        ></el-input>
        <el-button
          icon="el-icon-plus"
          type="primary"
          plain
        >
          引入ID映射表
        </el-button>
        <el-button
          icon="el-icon-refresh"
          type="primary"
          plain
        ></el-button>
      </div> -->
    </div>
    <el-table
      :data="filterData(['name', 'code'])"
      class="object-table-list"
      :max-height="tableHeight"
    >
      <el-table-column label="映射表名称" width="240">
        <template #default="scope">
          <CellContent
            :data="getCellContentData({name: scope.row.sourceMappingName, code: scope.row.sourceMappingCode})"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="是否区分表"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{scope.row.sqlDisplayContext ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="operUser"
        label="负责人"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="openStatus"
        label="开启OneId归一化"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.openStatus"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ccc"
            @change="val => changeOpenStatus(val, scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170">
        <template slot-scope="scope">
          <el-button
            type="text"
            title="编辑"
            class="el-icon-edit-outline font-16 mr-10"
            @click="handleEdit(scope.row)"
          ></el-button>
          <!-- <el-button
            type="text"
            title="查看"
            class="iconfont icon-rizhi font-16 mr-10"
            @click="handleEdit(scope.row)"
          ></el-button> -->
            <el-button type="text" class="font-16 el-icon-delete" @click="del(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:10px;text-align: end">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import rdTableMixin from '@/mixins/rd-table'
import { getJobsListPage, delJobs, getJobsOpen } from '@/api/rd/exreact/mapping-id'
import { mapGetters } from 'vuex'
export default {
  name: 'MappingTable',
  mixins: [rdTableMixin],
  computed: {
    ...mapGetters(['project']),
  },
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 15,
      currentPage: 1
    }
  },
  methods: {
    // 列表
    async getTreeData() {
      const params = {
        pageSize: this.pageSize,
        pageNo: this.currentPage
      }
      const res = await this.$simpleAsyncTo(getJobsListPage(params), '获取数据失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
    },
    handleEdit(row) {
      this.setActiveRdEditDialog({
        title: 'ID映射表配置',
        component: `MappingTableId`,
        data: {...this.project, ...row, isEdit: true}
      })
    },
    del(row) {
      this.$confirm(`请确认是否删除【${row.sourceMappingName}】文件？`, '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$simpleAsyncTo(delJobs({id: row.id}))
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.getTreeData()
            this.$root.eventEmitter.emit('refresh')
          }
        })
        .catch(async _ => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    },
    async changeOpenStatus(val, row) {
      const res = await this.$simpleAsyncTo(getJobsOpen({id: row.id, openStatus: val}), '操作失败')
      if (res) {
        this.getTreeData()
        this.$root.eventEmitter.emit('refresh')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mapping-id-table {
  padding: 0 15px;
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    >div:first-child {
      font-weight: 500;
      font-size: 16px;
    }
  }
}
</style>