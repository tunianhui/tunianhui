<template>
  <section class="detail no-hover">
    <div class="detail-box" v-loading="!!loading">
      <div class="pt-10 pb-10 ml-10">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><a href="javascript:;" @click="jump">表权限</a></el-breadcrumb-item>
          <el-breadcrumb-item><a href="javascript:;">权限列表</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="content-box-detail">
        <header class="header mb-10 flex-layout">
          <div class="header-left">
            <i :class="['iconfont', logicTypeMapIcon['26']]"></i>
            <div class="mt-5">{{ infoData.tableType }}</div>
          </div>
          <div class="header-right">
            <div class="top">
              <div class='title mb-10'>
                <div class="info-value mb-5">{{infoData.name}}</div>
                <div class="info-value">{{infoData.desc}}</div>
              </div>
              <div class="options">
                <span class="mr-20">
                  <span class="info-title">数据板块：</span>
                  <span class="info-value">{{infoData.field3}}</span>
                </span>
                <span class="mr-20">
                  <span class="info-title">表环境：</span>
                  <span class="info-value">开发环境</span>
                </span>
                <span class="mr-20">
                  <span class="info-title">数据负责人：</span>
                  <span class="info-value">{{infoData.account}}</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        <div class="table-wrapper">
          <FilterFieldCard class="mb-10" ref="filterFieldCard" placeholder="请输入账号搜索" @confirm="getTableList" :filterData="filterData"></FilterFieldCard>

          <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading">
            <el-table-column prop="project" label="账号" min-width="240">
              <template slot-scope="{row}">
                <div class="first-line">{{row.accountType}}</div>
                <div class="second-line">{{row.account}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="powerType" label="权限类型" show-overflow-tooltip min-width="160">
            </el-table-column>
            <el-table-column prop="date" label="字段最近到期日期" show-overflow-tooltip min-width="160">
            </el-table-column>
            <el-table-column prop="powerCount" label="字段数" min-width="100">
            </el-table-column>
            <el-table-column prop="operation" label="操作" width="80">
              <template slot-scope="{row}">
                <el-tooltip class="item" effect="dark" content="回收" placement="top">
                  <el-button type="text" @click="handleCheck(row)"><i class="iconfont icon-huishou font-16 color-btn"></i></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-footer">
            <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import pager from '@/mixins/pager'
import { logicTypeMapIcon } from '@/config/rd-config.js'
export default {
  name: 'detail',
  mixins: [pager],
  components: {
  },
  data () {
    return {
      infoData: {
        name: 'dim_area_lvl1',
        desc: '1级区域层级维度',
        field3: 'Id_res_dev',
        field4: 'res_dev',
        field5: 'resource_dev',
        field6: 'resource_开发',
        accountType: '个人账号',
        account: 'lmz@aidata.onaliyun.com(303559921)',
        powerCount: 12,
        tableType: '维度逻辑表'
      },
      filterData: [
        {
          label: '权限账号',
          id: '权限账号',
          options: [
            {
              id: '0',
              label: '个人账号'
            },
            {
              id: '2',
              label: '生产账号'
            },
            {
              id: '3',
              label: '用户组'
            }
          ]
        }
      ],
      tableData: [
        {
          name: 'dim_area_lvl1',
          desc: '1级区域层级维度',
          field3: 'Id_res_dev',
          field4: 'res_dev',
          field5: 'resource_dev',
          field6: 'resource_开发',
          powerType: '查表数据',
          date: '长期',
          accountType: '个人账号',
          account: 'lmz@aidata.onaliyun.com(303559921)',
          powerCount: 12
        },
        {
          name: 'fct_sj1_1_mi',
          desc: '事实逻辑表',
          field3: 'Id_res_dev',
          field4: 'res_dev',
          field5: 'resource_dev',
          field6: 'resource_开发',
          powerType: '查表数据',
          date: '长期',
          accountType: '个人账号',
          account: 'lmz@aidata.onaliyun.com(303559921)',
          powerCount: 3
        }
      ],
      loading: 0,
      fixed: false,
      logicTypeMapIcon
    }
  },
  created () {
  },

  methods: {
    // 回收
    handleRecovery (row) {
      // this.info = row
      // this.recoveryVisible = true
    },

    jump () {
      this.$emit('close')
    }

  }
}
</script>
<style lang="scss">
.detail {
  .animated {
    animation-duration: 0.3s;
  }
  width: 100%;
  height: 100%;
  .detail-box {
    height: 100%;
    .header {
      height: 100px;
      background: $grey10;
      .header-left {
        display: flex;
        flex-basis: 80px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--success);
        font-size: 12px;
        color: $grey10;
        i {
          font-size: 22px;
        }
      }
      .header-right {
        padding: 10px 20px;
        .info-title {
          color: rgba(0, 0, 0, 0.5);
        }
        .info-value {
          color: rgba(0, 0, 0, 0.9);
        }
        .top {
          .title {
            font-size: 16px;
          }
          .options {
            font-size: 12px;
            color: $grey4;
            > span {
              cursor: pointer;
            }
          }
        }
      }
    }
    .content-box-detail {
      position: relative;
      height: calc(100% - 25px);
      .table-wrapper {
        height: calc(100% - 80px);
        background: #fff;
      }
    }
  }
}
</style>
