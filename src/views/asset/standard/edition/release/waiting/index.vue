<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-08-07 16:49:41
 * @LastEditTime: 2021-08-20 17:22:03
 * @Description:
-->
<template>
  <section class='edition-tab'>
    <div ref="editionBox" class="release-waiting">
      <section class="head" ref="head">
        <div class="head-title font-18">数据标准</div>
        <div class="head-action">
          <div class="el-button action-refresh tip el-button--text el-button--mini" v-if="showTip">
            列表中有<span class="blue">28</span>条1个月前提交待发布对象, 请筛选确认是否提交！<span class="el-icon-close" @click="closeTip"></span>
          </div>
          <el-button type="primary"  icon="el-icon-refresh-right" class="action-refresh" @click="refeshHandle"></el-button>
          <!-- <el-button type="primary" class="action-refresh" @click="actionClick">特殊说明</el-button> -->
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
        @select="handleSelectChange"
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
            <el-tooltip class="item" effect="dark" content="发布" placement="top">
              <el-button
                type="text">
                <i class="el-icon-s-promotion font-16 color-btn" title="发布" @click="batchRelease(scope.row)"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="text"><i class="el-icon-edit-outline font-16 color-btn" title="编辑" @click="_editHandle(scope.row)"></i></el-button>
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
    <ReleaseCriterion
      v-if="visibleRelease"
      :releaseData="releaseData"
      @cancelRelease="cancelRelease"
      @refresh="refeshHandle"
      source="waiting"
      :record="record"
    ></ReleaseCriterion>
    <el-dialog title="缺失版本号列表" :visible.sync="noVerVisible" :close-on-click-modal="false" :close-on-press-escape="false" @close="closeNoVerDialog" width="400px">
      <div class="defect-dialog" style="padding-bottom: 20px;">
        <i class="el-icon-warning-outline"></i>
        <span>发布标准，需补充版本号</span>
        <div class="list">
          <div class="item" v-for="item in noVerList" :key="item.std_id">
            <label for="">英文名称:</label>
            <div class="value">{{item.std_code}}</div>
          </div>
        </div>
      </div>
    </el-dialog>
    <SelectFooter
      @checkAllChange="checkAllChange"
      :multipleSelection="multipleSelection"
      :tableData="tableData"
      :isIndeterminate="isIndeterminate"
      @batchPublish="batchPublish"></SelectFooter>
  </section>
</template>

<script>
import mixin from '../../mixin'
import pager from '@/mixins/pager'
import SelectFooter from './footer'
import ReleaseCriterion from '../../../manage/define/criterion/release.vue'
import {
  getWaitingList,
  release
} from '@/api/asset/standard/edition'
export default {
  name: 'ReleaseWaiting',
  props: {
    data: [Object, null]
  },
  mixins: [mixin, pager],
  components: {
    SelectFooter,
    ReleaseCriterion
  },
  data() {
    return {
      loading: 0,
      fixed: false,
      tableData: [],
      showTip: true,
      filterData: [],
      visibleRelease: false,
      releaseData: [],
      record: '',
      noVerList: [],
      noVerVisible: false
    }
  },
  computed: {},
  mounted() {},
  methods: {
    refeshHandle() {
      this.getTableList()
    },
    actionClick() {},
    closeTip() {
      this.showTip = false
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
      const res = await this.$simpleAsyncTo(getWaitingList(params), '获取数据失败')
      if (res) {
        this.showTip = true
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    handleSelectChange(list, row) {
      if (list.length) {
        list.forEach(item => {
          if (row.std_id === item.std_id) {
            if (!(row.version && row.version !== '')) {
              this.releaseData = [row]
              this.visibleRelease = true
              this.record = 'multiple'
            }
          }
        })
      }
    },
    checkAllChange(boolean) {
      this.noVerList = []
      if (boolean) {
        this.noVerList = this.tableData.filter(item => (item.version === '' || item.version === null))
        console.log(this.noVerList)
        if (this.noVerList.length) {
          this.$refs.multipleTable.toggleAllSelection()
          this.$refs.multipleTable.clearSelection()
          this.noVerVisible = true
        } else {
          this.$refs.multipleTable.toggleAllSelection()
        }
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    closeNoVerDialog() {
      this.noVerVisible = false
      this.$refs.multipleTable.clearSelection()
    },
    batchPublish() {
      this.$confirm(`确认要发布吗？`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: false
      }).then(() => {
        const ids = this.multipleSelection.map(item => {
          return {
            std_id: item.std_id,
            version: item.version
          }
        })
        this._release(JSON.stringify(ids))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    release(row) {
      this.$confirm(`确认要发布此条记录吗？`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: false
      }).then(() => {
        this._release(JSON.stringify(
          [{
            std_id: row.std_id,
            version: row.version
          }])
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    async _release(ids) {
      let params = {std_id: ids}
      const res = await this.$simpleAsyncTo(release(params), '获取数据失败')
      if (res) {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getTableList()
      }
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
    // 发布
    batchRelease(row) {
      if (!(row.version && row.version !== '')) {
        this.releaseData = [row]
        this.visibleRelease = true
        this.record = ''
      } else {
        this.release(row)
      }
    },
    cancelRelease() {
      this.visibleRelease = false
    }
  }
}
</script>

<style lang="scss">
.release-waiting {
  height: calc(100% - 40px);
  padding-right: 10px;
  overflow: auto;
}
.defect-dialog {
  padding-bottom: 20px;
  i {
    font-size: 16px;
    color: #ff7474;
    margin-right: 5px;
  }
  .list {
    padding-left: 10px;
    margin-top: 10px;
    .item {
      line-height: 30px;
      display:flex;
      .value {
        padding-left: 10px;
      }
    }
  }
}
</style>
