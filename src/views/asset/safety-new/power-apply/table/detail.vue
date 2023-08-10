<template>
  <section class="detail no-hover">
    <div class="detail-box" v-loading="!!loading">
      <div class="pt-10 pb-10 ml-10">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><a href="javascript:;" @click="jump">表权限</a></el-breadcrumb-item>
          <el-breadcrumb-item><a href="javascript:;">表权限详情</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="content-box-detail">
        <header class="header mb-10 flex-layout">
          <div class="header-left">
            <i :class="[logicTypeMapIcon[infoData.objectType]]"></i>
            <div class="mt-5">{{ infoData.objectTypeCode }}</div>
          </div>
          <div class="header-right">
            <div class="top">
              <div class='title mb-10'>
                <div class="info-value mb-5 flex-layout">
                  <div>{{infoData.cubeCode}}</div>
                  <div class="table-header-tag">{{active == '1' ? '已生效' : '已失效'}}</div>
                </div>
                <div class="info-value" style="color: rgba(0,0,0,0.45)">{{infoData.cubeName}}</div>
              </div>
              <div class="options">
                <span class="mr-20">
                  <span class="info-title">数据板块：</span>
                  <span class="info-value">{{infoData.businessFieldName}}</span>
                </span>
                <span class="mr-20">
                  <span class="info-title">表环境：</span>
                  <span class="info-value">{{infoData.environment}}</span>
                </span>
                <span class="mr-20">
                  <span class="info-title">权限账号：</span>
                  <span class="info-value">{{infoData.accountTypeCode}}</span>
                </span>
                <!-- <span class="mr-20">
                  <span class="info-title">是否负责人：</span>
                  <span class="info-value">是</span>
                </span> -->
              </div>
            </div>
          </div>
          <div class="table-header-operation">
            <el-button type="primary" @click="handleReturn()" icon="iconfont icon-jiaohuan mr-10">交还表权限</el-button>
          </div>
        </header>

        <div class="table-wrapper">
          <div style="padding:10px;height:80px">
            <div>
              <span>表级权限</span>
            </div>
            <div style="margin-top: 10px;font-size: 14px;color: rgba(0,0,0,0.75);">
              <span>权限类型：</span>
              <span>{{infoData.authTypeCode}}</span>
            </div>
          </div>
          <div class="flex-between search-wrapper">
            <div>
              <span>字段级权限</span>
            </div>
            <!-- <div>
              <el-input prefix-icon="el-icon-search" placeholder='请输入关键字' style="width:200px" v-model="keywork"></el-input>
            </div> -->
          </div>

          <el-table
            :data="tableData.filter(item => item.elementCode.indexOf(keywork) > -1)"
            tooltip-effect="dark"
            height="calc(100% - 128px)"
            style="width: 100%"
            :class="{'fixed': fixed, 'tabel-cell-noe': false}"
            v-loading="!!loading"
          >
            <el-table-column type="index" label="序号" width="55" align="center">
            </el-table-column>
            <el-table-column prop="elementCode" label="字段名">
            </el-table-column>
            <el-table-column prop="elementCode" label="字段描述">
            </el-table-column>
            <el-table-column prop="validEndTime" label="有效期至" show-overflow-tooltip>
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
import { returnTable, getPermissionTableDetail } from '@/api/asset/authority'
export default {
  name: 'table-detail',
  mixins: [pager],
  components: {
  },
  props: {
    info: {
      type: Object,
      default: () => { }
    },
    active: {
      type: String,
      default: '1'
    }
  },
  data () {
    return {
      infoData: {},
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
            }
          ]
        }
      ],
      tableData: [],
      loading: 0,
      fixed: false,
      logicTypeMapIcon,
      keywork: ''
    }
  },
  watch: {
    info: {
      handler (val) {
        if (!val && JSON.stringify(val) === '{}') return
        this.getTableDetail()
      },
      deep: true,
      immediate: true
    }
  },
  created () {
  },
  methods: {
    // 回收
    handleRecovery (row) {

    },

    // 交还权限
    handleReturn () {
      this.$confirm(`确定交还 ${this.infoData.cubeCode} 的权限吗`, '交还权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          cubeId: this.info.cubeId,
          projectId: this.info.projectId,
          accountType: this.info.accountType,
          accountTypeCode: this.info.accountTypeCode,
        }
        const res = await this.$simpleAsyncTo(returnTable(params), '交还失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '交还成功!'
          })
          this.$emit('close')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消!'
        })
      })
    },

    jump () {
      this.$emit('close')
    },

    async getTableDetail () {
      this.loading++
      const params = {
        cubeId: this.info.cubeId,
        projectId: this.info.projectId,
        accountType: this.info.accountType,
        accountTypeCode: this.info.accountTypeCode,
      }
      const res = await this.$simpleAsyncTo(getPermissionTableDetail(params), '获取数据失败')
      if (res) {
        this.infoData = res.data
        this.tableData = res.data.elements
      }
      this.loading--
    },
  }
}
</script>
<style lang="scss">
.detail {
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
        flex: 1;
        padding: 10px 20px;
        .table-header-tag {
          background: rgba(108, 160, 245, 0.2);
          border: 1px solid #6ca0f5;
          height: 20px;
          padding: 0 12px;
          line-height: 20px;
          font-size: 10px;
          color: #6ca0f5;
          margin-left: 8px;
        }
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
      .table-header-operation {
        padding: 12px;
      }
    }
    .content-box-detail {
      position: relative;
      height: calc(100% - 25px);
      .search-wrapper {
        padding: 10px 10px;
      }
      .table-wrapper {
        background-color: #fff;
        height: calc(100% - 145px);
      }
    }
  }
}
</style>
