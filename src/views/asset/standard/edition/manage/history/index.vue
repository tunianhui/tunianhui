<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-08-07 16:49:41
 * @LastEditTime: 2021-08-20 17:23:10
 * @Description:
-->
<template>
  <section class='edition-tab'>
    <div class="manage-history" ref="editionBox">
      <section class="head" ref="head">
        <div class="head-title font-18">数据标准</div>
        <div class="head-action">
          <el-button type="primary"  icon="el-icon-refresh-right" class="action-refresh" @click="refeshHandle"></el-button>
        </div>
      </section>
      <FilterFieldCard
        class="mb-10"
        ref="filterFieldCard"
        @confirm="getTableList"
        :filterData="filterData"
        ></FilterFieldCard>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :class="{'fixed': fixed, 'tabel-cell-noe': true}"
        v-loading="!!loading"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="英文名称">
          <template slot-scope="scope">
            <TableCell :title="scope.row.std_code" :subTitle="scope.row.std_alias"></TableCell>
          </template>
        </el-table-column>
        <el-table-column prop="std_id" label="编码">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.std_id}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="std_name" label="中文名称">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.std_name}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本号">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.version}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column label="最近提交人时间">
          <template slot-scope="scope">
            <TableCell :title="scope.row.oper_user" :subTitle="scope.row.oper_time"></TableCell>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="启用" placement="top">
              <el-button type="text"><i class="el-icon-video-pause font-16 color-btn" title="启用" @click="restart(scope.row)"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="fr pt-10 pb-10"
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-size="pageFilters.pageSize"
        :page-sizes="pageSizes"
        :current-page.sync="pageFilters.pageNo"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
    <!-- <SelectFooter
      @checkAllChange="checkAllChange"
      :multipleSelection="multipleSelection"
      :tableData="tableData"
      :isIndeterminate="isIndeterminate"
      @batchOpen="batchPublish"></SelectFooter> -->
  </section>
</template>

<script>
import mixin from '../../mixin'
import pager from '@/mixins/pager'
// import SelectFooter from './footer'
import {
  getHistoryList,
  restart
} from '@/api/asset/standard/edition'
export default {
  name: 'ManageHistory',
  props: {},
  mixins: [mixin, pager],
  components: {
    // SelectFooter
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {
    refeshHandle() {
      this.getTableList()
    },
    async getTableList(curFilter = [], keyword = '') {
      this.loading++
      const params = {
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo,
        keyword: keyword,
        busi_id: '',
        one_catalog_id: '',
        two_catalog_id: '',
        three_catalog_id: '',
        oper_user: '',
        startDate: '',
        endDate: ''
      }
      curFilter.forEach(e => {
        switch (e.module) {
          case '最近提交人':
            params.oper_user = e.value
            break
          case '最近提交时间':
            params.startDate = e.value[0]
            params.endDate = e.value[1]
            break
          case '业务板块':
            params.busi_id = e.value
            break
          case '一级分类':
            params.one_catalog_id = e.value
            break
          case '二级分类':
            params.two_catalog_id = e.value
            break
          case '三级分类':
            params.three_catalog_id = e.value
            break
          case '状态':
            params.status = e.value
            break
        }
      })
      // await this.$sleep(2000)
      const res = await this.$simpleAsyncTo(getHistoryList(params), '获取数据失败')
      if (res) {
        this.showTip = true
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    restart(row) {
      this.$confirm(`确认要启用此条记录吗？`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: false
      }).then(() => {
        this._restart(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async _restart(row) {
      let params = {std_id: row.std_id}
      const res = await this.$simpleAsyncTo(restart(params), '获取数据失败')
      if (res) {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getTableList()
      }
    }
  }
}
</script>

<style lang="scss">
.manage-history {
  padding-right: 10px;
  overflow: auto;
  height: 100%;
}
</style>
