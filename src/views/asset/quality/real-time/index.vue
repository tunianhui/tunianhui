<template>
  <section class="real-time">
    <div ref="quality">
      <Head
        ref="head"
        title="实时元表规则列表"
        actionText="创建质量规则"
        @action="ruleVisible=true"></Head>
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
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="表名称">
          <template slot-scope="scope">
            <TableCell :data="scope.row" icon="iconfont icon-yuanbiao-xianxing"></TableCell>
          </template>
        </el-table-column>
        <el-table-column
          prop="tableType"
          label="表类型">
          <template>
            <OverflowTooltip class="width">实时元表</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="ownerName"
          label="负责人">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.ownerName}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="business"
          label="业务板块">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.business}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="projectName"
          label="所属项目">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.projectName}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="规则更新时间">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.date}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="ruleCount"
          label="质量规则数">
        </el-table-column>
        <el-table-column
          prop="enabled"
          label="校验状态"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.enabled">
              <i class="iconfont icon-weikaiqi" style="color:#bfbfbf"></i> 未开启
            </span>
            <span v-if="!scope.row.enabled">
              <i class="iconfont icon-yikaiqi" style="color:#2BC048"></i> 已开启
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="开启校验" placement="top">
              <el-button
                type="text"
                v-if="scope.row.enabled">
                <i class="iconfont icon-zhihang font-16 color-btn" title="开启校验" @click="_openCheckRule(scope.row)"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="关闭校验" placement="top">
              <el-button
                type="text" v-if="!scope.row.enabled">
                <i class="iconfont icon-execute- font-16 color-btn" title="关闭校验" @click="_closeCheckRule(scope.row)"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="规则配置" placement="top">
              <el-button type="text"><i class="iconfont icon-guizepeizhi font-14 color-btn" title="规则配置"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="text"><i class="el-icon-delete font-16 color-btn" title="删除" @click="_delCheckRule(scope.row)"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <SelectFooter
        @checkAllChange="checkAllChange"
        :multipleSelection="multipleSelection"
        :tableData="tableData"
        :isIndeterminate="isIndeterminate"
        @batchOpen="batchOpen"
        @batchDel="batchDel"></SelectFooter>
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
    <AddRuleDialog :visible="ruleVisible" @close="close" tableType="real"></AddRuleDialog>
  </section>
</template>

<script>
import mixin from '../mixin'
import {
  // getDataRulesList,
  getOwnerNameList,
  getBusinessList,
  getProjectList,
  getTableTypeList,
  getRealTimeList,
  openCheckRule, closeCheckRule, delCheckRule
} from '@/api/asset/quality'
export default {
  name: 'RealTime',
  mixins: [mixin],
  data() {
    return {
      filterData: [],
      ownerNameList: [],
      businessList: [],
      projectList: [],
      tableTypeList: [],
      tableData: [],
      loading: 0,
      fixed: false,
      delCheckRule: delCheckRule,
      batchOpenCheckRule: delCheckRule,
      batchDelCheckRule: delCheckRule
    }
  },
  async created() {
    await this._getOwnerNameList()
    await this._getBusinessList()
    await this._getProjectList()
    await this._getTableTypeList()
    this.filterData = [
      {
        label: '负责人',
        id: '负责人',
        options: this.ownerNameList
      },
      {
        label: '业务板块',
        id: '业务板块',
        options: this.businessList
      },
      {
        label: '所属项目',
        id: '所属项目',
        options: this.projectList
      },
      {
        label: '表类型',
        id: '表类型',
        options: this.tableTypeList
      }
    ]
    this.getTableList()
  },
  methods: {
    async getTableList(data) {
      this.loading++
      await this.$sleep(2000)
      const res = await this.$simpleAsyncTo(getRealTimeList(), '获取失败')
      if (res) {
        this.tableData = res.data
      }
      this.loading--
    },
    // 负责人
    async _getOwnerNameList() {
      const params = {}
      const res = await this.$simpleAsyncTo(getOwnerNameList(params), '获取失败')
      if (res) {
        this.ownerNameList = res.data
      }
    },
    // 业务板块
    async _getBusinessList() {
      const params = {}
      const res = await this.$simpleAsyncTo(getBusinessList(params), '获取失败')
      if (res) {
        this.businessList = res.data
      }
    },
    // 所属项目
    async _getProjectList() {
      const params = {}
      const res = await this.$simpleAsyncTo(getProjectList(params), '获取失败')
      if (res) {
        this.projectList = res.data
      }
    },
    // 表类型
    async _getTableTypeList() {
      // const params = {}
      const res = await this.$simpleAsyncTo(getTableTypeList(['实时元表']), '获取失败')
      if (res) {
        this.tableTypeList = res.data
      }
    },
    _openCheckRule(row) {
      this.visible = true
      this.title = '开启校验'
      this.curData = row
      this.textTitle = '是否确认开启校验？'
      this.textDes = '开启后，后台自动进行数据校验'
      this.fn = openCheckRule
    },
    _closeCheckRule(row) {
      this.visible = true
      this.title = '关闭校验'
      this.curData = row
      this.textTitle = '是否确认关闭校验？'
      this.textDes = '关闭后，后台停止数据校验'
      this.fn = closeCheckRule
    }
  }
}
</script>

<style lang="less" scoped>
.real-time {
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
