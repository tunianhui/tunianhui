<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-06-05 15:31:15
 * @LastEditTime: 2023-06-08 14:51:33
 * @Description:
-->
<template>
  <div>
    <FilterFieldCard class="mb-10" ref="filterFieldCard" placeholder="请输入表名搜索" @confirm="getTableList" :filterData="filterData"></FilterFieldCard>

    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading">
      <el-table-column prop="cube_code" label="数据对象" min-width="240">
        <template slot-scope="{row}">
          <div class="icon-two-text" @click="handleCheck(row)">
            <span class="iconfont icon-weiduluojibiao1"></span>
            <div class="ml-10">
              <div class="first-text">{{ row.cube_code }}</div>
              <div class="second-text">{{ row.cube_name }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="busin_name" label="数据板块" min-width="120">
        <template slot-scope="{row}">
          <div class="first-line">{{row.busin_name}}</div>
          <div class="second-line">{{row.field4}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="project_name" label="表所在项目" min-width="120">
        <template slot-scope="{row}">
          <div class="first-line">{{row.project_name}}</div>
          <div class="second-line">{{row.field6}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="accountType" label="数据负责人" show-overflow-tooltip min-width="160">
        <template slot-scope="{row}">
          <div class="first-line">{{row.accountType}}</div>
          <div class="second-line">{{row.account}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="powerCount" label="权限个数" min-width="100">
      </el-table-column>
      <el-table-column prop="operation" label="操作" width="80">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="授权" placement="top">
            <el-button type="text" @click="handleCheck(row)"><i class="iconfont icon-shouquan1 font-16 color-btn"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看权限列表" placement="top">
            <el-button type="text" @click="handleCheck(row)"><i class="iconfont icon-dingdanyitijiao font-18 color-btn"></i></el-button>
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
import mixin from '../../mixins'
import pager from '@/mixins/pager'
import { getPermissionTableList } from '@/api/asset/authority'

export default {
  name: 'TablePower',
  mixins: [mixin, pager],
  data () {
    return {
      filterData: [
        {
          label: '表类型',
          id: '表类型',
          options: [
            {
              id: 'LOGICAL_TABLE',
              label: '建模逻辑表'
            },
            {
              id: 'LABEL_TABLE',
              label: '标签逻辑表'
            },
            {
              id: 'PHYSICAL_TABLE',
              label: '物理表'
            },
            {
              id: 'REALTIME_LOGICAL_TABLE',
              label: '元表'
            },
            {
              id: 'REALTIME_MIRROR_TABLE',
              label: '镜像表'
            },
            {
              id: 'PHYSICAL_VIEW',
              label: '物理视图'
            },
            {
              id: 'LOGICAL_VIEW',
              label: '逻辑视图'
            }
          ]
        },
        {
          label: '表环境',
          id: '表环境',
          options: [
            {
              id: 'PROD',
              label: '生产环境'
            },
            {
              id: 'DEV',
              label: '开发环境'
            }
          ]
        },
        {
          label: '数据板块',
          id: '数据板块',
          options: [
            {
              id: 'res',
              label: 'LD_res'
            },
            {
              id: 'basic',
              label: 'LD_basic'
            }
          ]
        },
        {
          label: '表所在项目',
          id: '表所在项目',
          options: [
            {
              id: 'demo',
              label: 'demo'
            }
          ]
        },
        {
          label: '账号类型',
          id: '账号类型',
          options: [
            {
              id: 'PROD',
              label: '个人账号'
            },
            {
              id: 'DEV',
              label: '生产账号'
            }
          ]
        }
      ],
      tableData: [
        {
          cube_code: 'dim_area_lvl1',
          cube_name: '1级区域层级维度',
          busin_name: 'Id_res_dev',
          field4: 'res_dev',
          project_name: 'resource_dev',
          field6: 'resource_开发',
          accountType: '个人账号',
          account: 'lmz@aidata.onaliyun.com(303559921)',
          powerCount: 12
        }
      ],
      loading: 0,
      fixed: false
    }
  },
  created () {
    this.getTableList()
  },
  methods: {
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
          case '到期日期':
            params.expiredDate = e.value
            break
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

      const res = await getPermissionTableList(params)
      this.loading--
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
    },

    handleCheck (row) {
      this.$emit('showDetail', row)
    }

  }
}
</script>

<style lang="scss" scoped>
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
  .iconBg {
    background: #2358fe;
    color: #fff;
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
