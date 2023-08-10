<template>
  <div class="check-real-table quality">
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
                    <span class="mr-50"><i class="iconfont icon-jinggao1 font-16 mr-5"></i>强规则异常：0</span>
                    <span class="mr-50"><i class="iconfont icon-jinggao2 font-16 mr-5" style="color:#FFC20F"></i>弱规则异常：4</span>
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
        label="最新校验时间">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.date}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="ruleCount"
        label="引用数">
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template>
          <el-tooltip class="item" effect="dark" content="规则配置" placement="top">
            <el-button type="text"><i class="iconfont icon-guizepeizhi font-14 color-btn"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import mixin from './mixin'
import {
  getOwnerNameList,
  getBusinessList,
  getProjectList,
  getTableTypeList,
  getRealCheckList
} from '@/api/asset/quality'
export default {
  name: 'CheckRealTable',
  mixins: [mixin],
  data() {
    return {
      ownerNameList: [],
      businessList: [],
      projectList: [],
      tableTypeList: []
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
        label: '状态',
        id: '状态',
        options: [
          {
            label: '通过',
            id: '1'
          },
          {
            label: '异常',
            id: '0'
          }
        ]
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
      const res = await this.$simpleAsyncTo(getRealCheckList(), '获取失败')
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
    }
  }
}
</script>
