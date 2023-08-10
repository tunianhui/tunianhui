<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-06-05 15:31:15
 * @LastEditTime: 2023-06-08 14:46:25
 * @Description:
-->
<template>
  <div>
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
      <el-table-column prop="busin_name" label="被操作对象" min-width="120">
        <template slot-scope="{row}">
          <div class="first-line">{{row.busin_name}}</div>
          <div class="second-line">{{row.field4}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="accountType" label="操作人" show-overflow-tooltip min-width="160">
        <template slot-scope="{row}">
          <div class="first-line">{{row.accountType}}</div>
          <div class="second-line">{{row.account}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="operationTime" label="操作时间" min-width="120">
      </el-table-column>
      <el-table-column prop="project_name" label="权限类型" min-width="120">
      </el-table-column>
      <el-table-column prop="operationType" label="操作类型" min-width="100">
      </el-table-column>
      <el-table-column prop="reason" label="原因" min-width="100">
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
import { getPermissionTableList, getTableTypeList } from '@/api/asset/authority'

export default {
  name: 'TablePower',
  mixins: [mixin, pager],
  data () {
    return {
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
          powerCount: 12,
          operationTime: '2023-02-13 18:14:291',
          operationType: '授权',
          reason: '测试使用'
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
    async getTableList () {
      this.loading++
      let params = {
        ...this.pageFilters
      }
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
