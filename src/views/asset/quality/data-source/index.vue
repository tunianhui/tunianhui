<template>
  <section class="quality-watches quality">
    <div ref="quality" v-if="!rulesListVisible">
      <Head
        ref="head"
        title="数据源规则列表"
        actionText="创建质量规则"
        @action="ruleVisible=true;isFilterTableData=false"></Head>
      <FilterFieldCard
        class="mb-10"
        ref="filterFieldCard"
        @confirm="_getDataRulesList"
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
          label="数据源名称">
          <template slot-scope="scope">
            <TableCell :data="scope.row" icon="iconfont icon-shujuyuanquanxianguanli"></TableCell>
          </template>
        </el-table-column>
        <el-table-column
          prop="storageType"
          label="存储类型">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.storageType}}</OverflowTooltip>
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
          prop="use"
          label="用途">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.use}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="ruleCount"
          label="质量规则数">
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
              <el-button type="text"  @click="toRulesConfigHandle(scope.row)"><i class="iconfont icon-guizepeizhi font-14 color-btn" title="规则配置"></i></el-button>
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
    <div v-if="rulesListVisible">
      <RulesConfigDatasource @goBack="goBack" :data="curRulesListData"></RulesConfigDatasource>
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
    <AddRuleDialog :visible="ruleVisible" @close="close" :isFilterTableData="isFilterTableData"></AddRuleDialog>
  </section>
</template>

<script>
import mixin from '../mixin'
import RulesConfigDatasource from './rules-config'
import storage from '@/libs/storage'
import {
  getDataRulesList,
  getUseList,
  getStorageTypeList,
  getOwnerNameList,
  // getBusinessList,
  // getProjectList,
  // getTableTypeList
  openCheckRule, closeCheckRule, delCheckRule
} from '@/api/asset/quality'
export default {
  name: 'QualityWatches',
  mixins: [mixin],
  components: {
    RulesConfigDatasource
  },
  data() {
    return {
      tableData: [],
      useList: [],
      storageTypeList: [],
      ownerNameList: [],
      filterData: [],
      loading: 0,
      fixed: false,
      key: 'rulesConfigDatasource',
      delCheckRule: delCheckRule,
      batchOpenCheckRule: delCheckRule,
      batchDelCheckRule: delCheckRule
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler(val) {
        if (val === '/asset/quality/quality-manage/data-source') {
          storage.set(this.key, {visible: false, data: {}})
        }
      }
    }
  },
  async created() {
    await this._getOwnerNameList()
    await this._getUseList()
    await this._getStorageTypeList()
    this.filterData = [
      {
        label: '负责人',
        id: '负责人',
        isArrow: false,
        open: false,
        options: this.ownerNameList
      },
      {
        label: '用途',
        id: '用途',
        isArrow: false,
        open: false,
        options: this.useList
      },
      {
        label: '存储类型',
        id: '存储类型',
        isArrow: false,
        open: false,
        options: this.storageTypeList
      }
    ]
    this._getDataRulesList()
  },
  methods: {
    async _getDataRulesList(curFilter = [], keyword = '') {
      this.loading++
      const params = {}
      await this.$sleep(2000)
      const res = await this.$simpleAsyncTo(getDataRulesList(params), '获取数据失败')
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
        res.data.forEach(item => {
          item.checked = false
        })
        this.ownerNameList = res.data
      }
    },
    // 用途
    async _getUseList() {
      const params = {}
      const res = await this.$simpleAsyncTo(getUseList(params), '获取失败')
      if (res) {
        res.data.forEach(item => {
          item.checked = false
        })
        this.useList = res.data
      }
    },
    // 存储类型
    async _getStorageTypeList() {
      const params = {}
      const res = await this.$simpleAsyncTo(getStorageTypeList(params), '获取失败')
      if (res) {
        res.data.forEach(item => {
          item.checked = false
        })
        this.storageTypeList = res.data
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
.quality-watches {
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
