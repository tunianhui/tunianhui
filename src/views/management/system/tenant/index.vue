<template>
  <section class="tenant" ref="tenant">
    <div class="head">
      <div class="flex-center">租户设置</div>
      <div class="flex-end">
        <div class="total-desc">
          数据处理单元已分配<span class="value">{{totalList.num1}}</span>/购买总量<span class="value">{{totalList.total1}}</span>，域内质量规则已分配<span class="value">{{totalList.num2}}</span>/购买总量<span class="value">{{totalList.total2}}</span>，全域质量规则已分配<span class="value">{{totalList.num3}}</span>/购买总量<span class="value">{{totalList.total3}}</span>
        </div>
        <el-button type="primary" size="mini" class="ml-20" icon="el-icon-plus" @click="addTenantVisible=true">添加租户</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" ref="table" v-loading="!!loading">
      <!-- <el-table-column :show-overflow-tooltip="true" width="180" type="selection"></el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" label="租户名称/ID">
        <template slot-scope="scope">
          <div>
            <div>{{scope.row.field1}}</div>
            <div>{{scope.row.field2}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="field3" label="超级管理员">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" width="400">
        <template slot="header">
          <div>
            <div>已使用配额</div>
            <div>数据处理单元/域内质量规则/全域质量规则</div>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="usedQuota">
            <div class="item">
              <div class="left">{{scope.row.field4}}</div>
              <div class="right">
                <el-progress :percentage="scope.row.field7" :format="usedQuotaFormat"></el-progress>
              </div>
            </div>
            <div class="item">
              <div class="left">{{scope.row.field5}}</div>
              <div class="right">
                <el-progress :percentage="scope.row.field8" :format="usedQuotaFormat"></el-progress>
              </div>
            </div>
            <div class="item">
              <div class="left">{{scope.row.field6}}</div>
              <div class="right">
                <el-progress :percentage="scope.row.field9" :format="usedQuotaFormat"></el-progress>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="总配额" width="120">
        <template slot-scope="scope">
          <div>
            <div>{{scope.row.field10}}</div>
            <div>{{scope.row.field11}}</div>
            <div>{{scope.row.field12}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="field13" label="功能模块">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="操作" width="120">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text"><i class="el-icon-edit-outline font-14 color-btn"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="text"><i class="el-icon-delete font-14 color-btn"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="撤销" placement="top">
            <el-button type="text"><i class="el-icon-refresh-left font-14 color-btn"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- </div> -->
    <el-pagination class="fr pt-10" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>
  </section>
</template>

<script>
import pager from '@/mixins/pager'
import { mapGetters } from 'vuex'
export default {
  name: 'Tenant',
  mixins: [pager],
  data () {
    return {
      tableData: [
        {
          field1: 'Dataphin元仓租户',
          field2: '300000803',
          field3: 'SuperOps(SuperOps@dataphin)',
          field4: '5',
          field5: '9',
          field6: '10',
          field7: 50,
          field8: 20,
          field9: 70,
          field10: '不占用',
          field11: '未开通',
          field12: '未开通',
          field13: '基础研发'
        },
        {
          field1: 'Dataphin元仓租户',
          field2: '300000803',
          field3: 'SuperOps(SuperOps@dataphin)',
          field4: '5',
          field5: '9',
          field6: '10',
          field7: 0,
          field8: 26,
          field9: 78,
          field10: '不占用',
          field11: '未开通',
          field12: '未开通',
          field13: '基础研发'
        },
        {
          field1: 'Dataphin元仓租户',
          field2: '300000803',
          field3: 'SuperOps(SuperOps@dataphin)',
          field4: '5',
          field5: '9',
          field6: '10',
          field7: 50,
          field8: 20,
          field9: 100,
          field10: '不占用',
          field11: '未开通',
          field12: '未开通',
          field13: '基础研发'
        }
      ],
      loading: 0,
      pages: {
        page: 1,
        rows: 5
      },
      addTenantVisible: false,
      totalList: {
        num1: 3788,
        total1: 5000,
        num2: 2903,
        total2: 5000,
        num3: 2895,
        total3: 5000
      }
    }
  },
  computed: {
    ...mapGetters(['dics'])
  },
  created () {
    this.getTableList()
  },
  mounted () {
  },
  methods: {
    usedQuotaFormat (percentage) {
      return ''
    },
    // 获取租户列表
    async getTableList () {
      // this.loading++
      // const params = {
      //   user_name: this.searchKey,
      //   pageNo: this.pageFilters.pageNo,
      //   pageSize: this.pageFilters.pageSize
      // }
      // const res = await this.$simpleAsyncTo(
      //   getUserList(params),
      //   '获取成员列表失败'
      // )
      // if (res) {
      //   this.tableData = res.data
      //   this.total = res.totalRecords
      //   this.loading--
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.tenant {
  padding: 15px 15px 0 15px;
  .head {
    .total-desc {
      position: relative;
      padding-left: 40px;
      padding-right: 20px;
      box-sizing: border-box;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      background: #e3efff;
      border: 1px solid #abc1ec;
      border-radius: 4px;
      &::before {
        display: inline-block;
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        content: 'i';
        width: 12px;
        height: 12px;
        line-height: 12px;
        text-align: center;
        border-radius: 50%;
        background: #0738f7;
        color: #fff;
      }
      .value {
        font-weight: bold;
      }
    }
  }
  .usedQuota {
    .item {
      display: flex;
      .left {
        width: 20%;
      }
      .right {
        width: 80%;
        .el-progress {
          line-height: 18px;
        }
      }
    }
  }
}

</style>
