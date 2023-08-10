<!--
 * @Author: 大炸鹅
 * @Date: 2023-02-07 16:51:53
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-02-09 18:56:51
 * @FilePath: \数据智能构建\src\views\rd\exreact\idsCenter\entity-id\table.vue
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
      <el-table-column label="ID名称" width="240">
        <template #default="scope">
          <CellContent
            :data="getCellContentData({name: scope.row.idName, code: scope.row.idType})"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="a"
        label="所属类目"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="operUser"
        label="最近更新人"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="operTime"
        label="最近更新时间"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作" width="170">
        <template slot-scope="scope">
          <el-button
            type="text"
            title="编辑"
            class="el-icon-edit-outline font-16 mr-10"
            @click="handleEdit(scope.row)"
          ></el-button>
          <el-button
            type="text"
            title="查看"
            class="iconfont icon-rizhi font-16 mr-10"
            @click.stop.native="handleView(scope.row)"
          ></el-button>
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
import { getListPage, deleteIdEntity } from '@/api/rd/exreact/entity-id'
export default {
  name: 'EntityTable',
  mixins: [rdTableMixin],
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 15,
      currentPage: 1
    }
  },
  created() {
    this.getTreeData()
  },
  methods: {
    getTreeData() {},
    handleEdit(row) {
      this.setActiveRdEditDialog({
        title: '编辑',
        component: `IdEditCreate`,
        data: {...row}
      })
    },
    handleView(data) {
      console.log(this.types.ENTITYID)
      const attr = {
        title: '实体ID',
        attrType: this.types.ENTITYID,
        name: data.id + '',
        label: data.idName,
        data,
        width: '500px'
      }
      this.attrStore.commit('add', attr)
    },
    del(row) {
      this.$confirm(`请确认是否删除【${row.idName}】文件？`, '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$simpleAsyncTo(deleteIdEntity({id: row.id}))
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
    // 列表
    async getTreeData() {
      const params = {
        pageSize: this.pageSize,
        pageNo: this.currentPage
      }
      const res = await this.$simpleAsyncTo(getListPage(params), '获取数据失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
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