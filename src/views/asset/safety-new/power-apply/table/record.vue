<template>
  <div class="record">
    <FilterFieldCard class="mb-10" ref="filterFieldCard" placeholder="请输入关键字" @confirm="getTableList" :filterData="filterData" v-resize="resizeDom"></FilterFieldCard>

    <el-table
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :class="{'fixed': fixed, 'tabel-cell-noe': false}"
      v-loading="!!loading"
      :height="height"
    >
      <el-table-column prop="cube_code" label="数据对象" min-width="240">
        <template slot-scope="{row}">
          <div class="icon-two-text" @click="jumpDetail(row)">
            <span class="iconfont icon-weiduluojibiao1"></span>
            <div class="ml-10">
              <div class="first-text">{{ row.cubeCode }}</div>
              <div class="second-text">{{ row.cubeId }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="businessFieldName" label="数据板块">
        <template slot-scope="{row}">
          <div class="first-line">{{row.businessFieldName}}</div>
          <!-- <div class="second-line">{{row.field4}}</div> -->
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="表所在项目">
        <template slot-scope="{row}">
          <div class="first-line">{{row.projectName}}</div>
          <!-- <div class="second-line">{{row.field6}}</div> -->
        </template>
      </el-table-column>
      <!-- <el-table-column prop="authTypeCode" label="权限账号">
        <template slot-scope="{row}">
          <div class="first-line">{{row.authType}}</div>
          <div class="second-line">{{row.authTypeCode}}</div>
        </template>
      </el-table-column> -->
      <el-table-column prop="subTime" label="提交时间">
      </el-table-column>
      <el-table-column prop="status" label="申请状态">
        <template slot-scope="scope">
          {{scope.row.status === 'wait' ? '审批中' : scope.row.status === 'pass' ? '已通过' : '已驳回'}}
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" width="60">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="审批流程" placement="top">
            <el-button type="text" @click="handleRecord(row)"><i class="iconfont icon-shenpi font-14 color-btn"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-footer">
      <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import pageMixin from './mixins'
import mixin from '../../mixins'
import pager from '@/mixins/pager'
import { getPermissionTableListRecord } from '@/api/asset/authority'
export default {
  name: 'TableApplyRecord',
  mixins: [pageMixin, mixin, pager],
  props: {
    activeTab: String
  },
  data () {
    return {
      filterData: [],
      tableData: [],
      loading: 0,
      fixed: false,
      totalFlag: false,
      height: '0'
    }
  },
  watch: {
    activeTab (val) {
      if (val === '3') {
        this.getTableList()
      }
    }
  },
  created () {
    this.configData()
    this.getTableList()
  },
  methods: {
    async configData () {
      await this.getTableType()
      this.filterData = [
        {
          label: '表类型',
          id: '表类型',
          options: this.tableTypeList
        },
        {
          label: '账号类型',
          id: '账号类型',
          options: this.accountTypeList
        }
      ]
    },
    async getTableList (curFilter = [], keyword = '') {
      this.loading++
      let params = {
        keyword,
        accountType: '', // 权限账号类型
        tableType: '', // 表类型
        ...this.pageFilters
      }

      curFilter.forEach(e => {
        switch (e.module) {
          case '表类型':
            params.tableType = e.value
            break
          case '账号类型':
            params.accountType = e.value
            break
        }
      })

      const res = await this.$simpleAsyncTo(getPermissionTableListRecord(params), '获取数据失败')
      
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
        if (!this.totalFlag) {
          this.totalFlag = true
          this.$emit('total', this.total)
        }
      }
      this.loading--
    },

    // 审批流程
    handleRecord (row) {
      this.$router.push({
        path: '/notice-center/task-center',
        query: {
          id: '233'
        }
      })
    },

    jumpDetail (row) {
      this.$emit('jumpDetail', row)
    },
    resizeDom(data) {
      this.$nextTick(() => {
        this.height = `calc(100% - ${parseInt(data.height) + 36}px)`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.record {
  height: calc(100% - 40px);
}
.icon {
  font-size: 24px;
  color: #4783ff;
}

.icon-two-text {
  display: flex;
  align-items: center;
  cursor: pointer;
  .icon-weiduluojibiao1 {
    font-size: 30px;
    color: var(--success);
  }
  .first-text {
    font-size: 12px;
    height: 14px;
    line-height: 14px;
    margin-bottom: 4px;
    color: #2153d4;
  }
  .second-text {
    font-size: 12px;
    height: 14px;
    color: var(--black45);
    line-height: 14px;
  }
}

.first-line {
  font-size: 12px;
  height: 14px;
  color: rgba(0, 0, 0, 0.9);
  line-height: 14px;
  margin-bottom: 4px;
}

.second-line {
  font-size: 12px;
  height: 14px;
  color: var(--black45);
  line-height: 14px;
}
</style>
