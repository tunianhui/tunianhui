<template>
  <div class="check-datadsource quality">
    <FilterFieldCard
      class="mb-10"
      ref="filterFieldCard"
      @confirm="getTableList"
      :filterData="filterData"></FilterFieldCard>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="!!loading"
      :default-expand-all="true">
      <el-table-column type="expand" width="1px">
        <template slot-scope="scope">
          <div class="rules-header">
            <div class="header-middle">
              <div>
                <el-button type="primary" class="mr-10" @click.stop="isSubTableHandle(scope.row)" v-if="curRow === scope.row.id">规则详情 <i class="el-icon-arrow-down ml-5"></i></el-button>
                <el-button type="primary" class="mr-10" @click.stop="isSubTableHandle(scope.row)" v-else>规则详情 <i class="el-icon-arrow-up ml-5"></i></el-button>
                <div>
                  <div class="mr-50">
                    校验结果：
                  </div>
                  <div class="mr-50">
                    规则树：1
                  </div>
                  <div class="mr-50">
                    已校验规则数：1
                  </div>
                  <div class="mr-50">
                    校验异常：
                    <span class="mr-50"><i class="iconfont icon-jinggao1 font-16 mr-5"></i>强规则累计异常：0</span>
                    <span class="mr-50"><i class="iconfont icon-jinggao2 font-16 mr-5" style="color:#FFC20F"></i>弱规则累计异常：4</span>
                  </div>
                </div>
              </div>
              <div style="cursor: pointer;" @click.stop="$emit('qualityReportHandle', scope.row)">质量报告 <i class="el-icon-arrow-right"></i></div>
            </div>
          </div>
          <div v-if="curRow === scope.row.id">
            <el-table
              :data="tableData"
              style="width: 100%"
              max-height="100px" class="sub-table">
              <el-table-column
                prop="partitionId"
                label="规则序号">
                <template slot-scope="scope">
                  <div class="partition-num">{{scope.row.partitionId}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="rulesName"
                label="规则名称">
              </el-table-column>
              <el-table-column
                prop="date"
                label="运行时间">
              </el-table-column>
              <el-table-column
                prop="rulesAttr"
                label="规则属性">
              </el-table-column>
              <el-table-column
                prop="ruleCount"
                label="累计异常数">
              </el-table-column>
              <el-table-column
                prop="checkResult"
                label="最新校验结果"
                width="100px">
                <template slot-scope="scope">
                  <span v-if="!scope.row.checkResult">
                    <i class="iconfont icon-jinggao2 font-14" style="color: #FFC20F"></i> 异常
                  </span>
                  <span v-if="scope.row.checkResult">
                    <i class="iconfont icon-yikaiqi" style="color:#2BC048"></i> 通过
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="数据名称">
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
        label="读写次数">
        <template slot="header">
          <span class="mr-5">读写次数</span>
          <el-tooltip class="item" effect="dark" content="最近30天数据源被读写次数，按照读写实例计数" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="50">
        <template>
          <el-tooltip class="item" effect="dark" content="规则配置" placement="top">
            <el-button type="text"><i class="iconfont icon-guizepeizhi font-14 color-btn" title=""></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import mixin from './mixin'
import {
  getDataSourceCheckList,
  getUseList,
  getStorageTypeList,
  getOwnerNameList
} from '@/api/asset/quality'
export default {
  name: 'CheckDatasource',
  mixins: [mixin],
  data() {
    return {
      ownerNameList: [],
      useList: [],
      storageTypeList: []
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
        options: this.ownerNameList
      },
      {
        label: '用途',
        id: '用途',
        options: this.useList
      },
      {
        label: '存储类型',
        id: '存储类型',
        options: this.storageTypeList
      }
    ]
    this.getTableList()
  },
  methods: {
    async getTableList() {
      this.loading++
      const res = await this.$simpleAsyncTo(getDataSourceCheckList(), '获取失败')
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
    // 用途
    async _getUseList() {
      // const params = {}
      const res = await this.$simpleAsyncTo(getUseList(['仅实时', '仅离线', '实时和离线']), '获取失败')
      if (res) {
        this.useList = res.data
      }
    },
    // 存储类型
    async _getStorageTypeList() {
      const params = {}
      const res = await this.$simpleAsyncTo(getStorageTypeList(params), '获取失败')
      if (res) {
        this.storageTypeList = res.data
      }
    }
  }
}
</script>
