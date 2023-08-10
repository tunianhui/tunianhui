<template>
  <section class="quality-records quality">
    <div ref="quality" v-if="!rulesListVisible">
      <Head
        ref="head"
        title="数据表规则列表"
        actionText="创建质量规则"
        @refesh="getTableList"
        @action="addVisible = true"></Head>
      <FilterFieldCard
        class="mb-10"
        ref="filterFieldCard"
        placeholder="请输入表名"
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
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="表名称" prop="table_code">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.table_code}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="oper_user"
          label="负责人">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.oper_user}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="project_code"
          label="所属项目">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.project_code}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="audit_time"
          label="规则更新时间">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.audit_time}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="rule_num"
          label="质量规则数">
        </el-table-column>
        <el-table-column
          prop="status"
          label="校验状态"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status === '1'">
              <i class="iconfont icon-weikaiqi" style="color:#bfbfbf"></i> 关闭
            </span>
            <span v-if="scope.row.status === '0'">
              <i class="iconfont icon-yikaiqi" style="color:#2BC048"></i> 开启
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="开启校验" placement="top">
              <el-button
                type="text"
                v-if="scope.row.status === '1'">
                <i class="iconfont icon-zhihang font-16 color-btn" title="开启校验" @click="checkHandle(scope.row)"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="关闭校验" placement="top">
              <el-button
                type="text" v-if="scope.row.status === '0'">
                <i class="iconfont icon-execute- font-16 color-btn" title="关闭校验" @click="checkHandle(scope.row)"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="规则配置" placement="top">
              <el-button type="text" @click="toRulesConfigHandle(scope.row)"><i class="iconfont icon-guizepeizhi font-14 color-btn" title="规则配置"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="text"><i class="el-icon-delete font-16 color-btn" title="删除" @click="_delCheckRule(scope.row)"></i></el-button>
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
      <SelectFooter
        @checkAllChange="checkAllChange"
        :multipleSelection="multipleSelection"
        :tableData="tableData"
        :isIndeterminate="isIndeterminate"
        @batchOpen="batchOpen"
        @batchDel="batchDel"></SelectFooter>
    </div>
    <div v-if="rulesListVisible">
      <RulesConfigTable @goBack="goBack" :data="curRulesListData"></RulesConfigTable>
    </div>
    <Dialog
      :visible="visible"
      :title="title"
      :data="curData"
      @close="close"
      :textTitle="textTitle"
      :textDes="textDes"
      :fn="fn">
    </Dialog>
    <AddRuleDialog v-if="addVisible" :visible="addVisible" @close="addClose" @refresh="refresh"></AddRuleDialog>
  </section>
</template>

<script>
import mixin from '../mixin'
import pager from '@/mixins/pager'
import AddRuleDialog from './add-rule'
import RulesConfigTable from './rules-config'
import storage from '@/libs/storage'
// import { on, off } from '@/libs/dom'
import {
  getAuditTableBaseList,
  deleteAuditTableBase,
  auditTableBaseVerification,
  deleteAuditTableBaseBatch,
  auditTableBaseVerificationBatch
} from '@/api/asset/quality/tableRules'
export default {
  name: 'QualityRecords',
  props: {},
  mixins: [mixin, pager],
  components: {
    RulesConfigTable,
    AddRuleDialog
  },
  data() {
    return {
      loading: 0,
      tableData: [],
      fixed: false,
      ownerNameList: [],
      projectList: [],
      filterData: [],
      addVisible: false,
      key: 'rulesConfigTable',
      delCheckRule: deleteAuditTableBase,
      batchOpenCheckRule: auditTableBaseVerificationBatch,
      batchDelCheckRule: deleteAuditTableBaseBatch
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler(val) {
        if (val === '/asset/quality/quality-manage/data-table') {
          storage.set(this.key, {visible: false, data: {}})
        }
      }
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    async getTableList(curFilter = [], keyword = '') {
      this.loading++
      const params = {
        table_code: keyword,
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo
      }
      // await this.$sleep(2000)
      const res = await this.$simpleAsyncTo(getAuditTableBaseList(params), '获取数据失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    checkHandle(row) {
      this._auditTableBaseVerification(row)
    },
    async _auditTableBaseVerification(row) {
      this.loading++
      const params = {
        id: row.id,
        cube_id: row.cube_id,
        status: row.status
      }
      const res = await this.$simpleAsyncTo(auditTableBaseVerification(params), '修改失败')
      if (res) {
        this.getTableList()
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      }
      this.loading--
    },
    addClose() {
      this.addVisible = false
    },
    refresh(params) {
      this.addVisible = false
      // this.getTableList()
      this.rulesListVisible = true
      storage.set(this.key, {
        visible: true,
        data: params
      })
      this.curRulesListData = params
    }
  }
}
</script>

<style lang="less" scoped>
.quality-records {
  height: 100%;
  position: relative;
  >div {
    overflow-y: overlay;
    height: 100%;
    padding: 10px 15px 56px 15px;
  }
  .width {
    width: calc(100% - 1px);
  }
}
</style>
