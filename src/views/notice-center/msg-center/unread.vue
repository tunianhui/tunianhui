<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-19 09:53:44
 * @LastEditTime: 2023-06-06 10:50:39
 * @Description:
-->
<template>
  <div class="page-wrapper">
    <PageTableLayout :showDag="showDag" @leftClickHange="showDag = false">
      <template v-slot:left>
        <el-table ref="tableData" :data="tableData" v-loading="!!loading" style="width: 100%;height:100%">
          <el-table-column prop="title" label="消息内容" show-overflow-tooltip min-width="240">
            <template slot-scope="scope">
              <i class="icon-duanxin iconfont font-14 mr-5"></i>
              <span class="title" @click="approveHandle(scope.row)">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="start_time" label="发送时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="end_time" label="消息类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="end_time" label="消息来源" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="" label="操作" width="80">
            <template slot-scope="{row}">
              <el-tooltip class="item" effect="dark" content="详情" placement="top">
                <el-button type="text"><i class="iconfont icon-xiangqing font-14" @click="handleEdit(row)"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>
      </template>
      <template v-slot:right>
        <Detail></Detail>
      </template>
    </PageTableLayout>
  </div>
</template>

<script>
import {
  getPendingList
} from '@/api/notice/task-center/index.js'
import pager from '@/mixins/pager'
import PageTableLayout from '@c/page-table-layout'
import Detail from './detail.vue'

export default {
  name: 'Unread',
  mixins: [pager],
  components: {
    PageTableLayout,
    Detail
  },
  data () {
    return {
      showDag: false,
      tableData: [],
      loading: 0
    }
  },
  created () {
    this.getTableList()
  },
  methods: {
    async getTableList () {
      this.loading++
      const params = {
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo
      }
      const res = await this.$simpleAsyncTo(
        getPendingList(params),
        '获取列表失败'
      )
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },

    handleEdit (row) {
      this.showDag = true
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  cursor: pointer;
}
.icon-shenqingjilu {
  color: #0c4cff;
  opacity: 0.9;
}
.el-icon-warning {
  color: rgb(255, 116, 116);
}
</style>
