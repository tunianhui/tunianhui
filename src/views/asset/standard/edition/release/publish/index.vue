<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-08-07 16:49:41
 * @LastEditTime: 2021-08-20 17:22:20
 * @Description:
-->
<template>
  <section class='edition-tab'>
    <div class="release-publish" ref="editionBox">
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
        <el-table-column label="发布人时间">
          <template slot-scope="scope">
            <TableCell :title="scope.row.oper_user" :subTitle="scope.row.oper_time"></TableCell>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="发布状态">
          <template slot-scope="scope">
            <el-tag size="mini" :type="scope.row.status === '4' ? 'danger' : scope.row.status === '0' ? 'success' : 'warning'">{{dics.status_tag.find(item => item.key === scope.row.status).value}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="text" v-if="scope.row.status === '0' || scope.row.status === '4'"><i class="el-icon-edit-outline font-16 color-btn" title="调整编辑" @click="_editHandle(scope.row)"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="审批" placement="top">
              <el-button type="text" v-if="scope.row.status === '3'"><i class="el-icon-document font-16 color-btn" title="调整审批" @click="_approveHandle(scope.row)"></i></el-button>
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
      @batchOpen="batchOpen"
      @batchDel="batchDel"></SelectFooter> -->
  </section>
</template>

<script>
import mixin from '../../mixin'
import pager from '@/mixins/pager'
// import SelectFooter from './footer'
import {
  getPublishList
} from '@/api/asset/standard/edition'
export default {
  name: 'ReleasePublish',
  props: {
    data: [Object, null]
  },
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
      const res = await this.$simpleAsyncTo(getPublishList(params), '获取数据失败')
      if (res) {
        this.showTip = true
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    _editHandle(row) {
      this.tabStore.commit('add', {
        label: '编辑标准',
        tabType: this.types.CRITERION,
        name: row.std_id,
        component: 'CriterionEdit',
        data: {...row, myFlag: this.data.name}
      })
    },
    _approveHandle(row) {
      this.$router.push({
        path: '/notice-center/task-center/pending',
        query: {
          keyword: row.std_code
        }
      })
    }
  }
}
</script>

<style lang="scss">
.release-publish {
  padding-right: 10px;
  overflow: auto;
  height: 100%;
}
</style>
