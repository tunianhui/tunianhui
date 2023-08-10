<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2023-06-05 10:54:59
 * @LastEditTime: 2023-07-27 11:14:20
 * @Description:
-->
<template>
  <div class="invalidate">
    <FilterFieldCard
      class="mb-10"
      ref="filterFieldCard"
      placeholder="请输入关键字"
      @confirm="getTableList"
      :filterData="filterData"
      v-resize="resizeDom"
    ></FilterFieldCard>

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
      <el-table-column prop="lastValidEndTime" label="字段最近到期日期">
      </el-table-column>
      <el-table-column prop="accountTypeCode" label="权限账号">
        <template slot-scope="{row}">
          <!-- <div class="first-line">{{row.accountType}}</div> -->
          <div class="second-line">{{row.accountTypeCode}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="accountType" label="权限类型">
      </el-table-column>
      <!-- <el-table-column prop="operation" label="操作" width="60">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="申请表权限" placement="top">
            <el-button type="text" @click="jumpApply(row)"><i class="iconfont icon-shenqingquanxian font-14 color-btn"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column> -->
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
import { getPermissionTableListInvalid } from '@/api/asset/authority'
export default {
  name: 'TableApply',
  mixins: [pageMixin, mixin, pager],
  props: {
    activeTab: String
  },
  data () {
    return {
      tableData: [],
      loading: 0,
      fixed: false,
      height:'0'
    }
  },
  watch: {
    activeTab (val) {
      if (val === '2') {
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
      await this.getBussinessList()
      await this.getProjectData()

      this.filterData = [
        {
          label: '表类型',
          id: '表类型',
          options: this.tableTypeList
        },
        {
          label: '表环境',
          id: '表环境',
          options: this.environmentList
        },
        {
          label: '数据板块',
          id: '数据板块',
          options: this.bussinessList
        },
        {
          label: '表所在项目',
          id: '表所在项目',
          options: this.projectList
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
        businId: '', // 数据板块ID
        accountType: '', // 权限账号类型
        environment: '', // 环境
        expiredDate: '', // 过期日期
        projectId: '', // 表所在项目id
        tableType: '', // 表类型
        ...this.pageFilters
      }

      curFilter.forEach(e => {
        switch (e.module) {
          case '表类型':
            params.tableType = e.value
            break
          case '表环境':
            params.environment = e.value
            break
          case '数据板块':
            params.businId = e.value
            break
          case '表所在项目':
            params.projectId = e.value
            break
          case '账号类型':
            params.accountType = e.value
            break
        }
      })

      const res = await this.$simpleAsyncTo(getPermissionTableListInvalid(params), '获取数据失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
        this.$emit('total', this.total)
      }
      this.loading--
    },

    jumpApply (row) {
      row.type = '已失效'
      this.$emit('jumpDetail', row)
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
.invalidate {
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
