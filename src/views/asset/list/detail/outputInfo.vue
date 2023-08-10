<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-10-18 10:37:53
 * @LastEditTime: 2023-01-03 09:57:11
 * @Description:
-->
<template>
  <section class="output-info animated fadeInRight">
    <el-table :data="tableData"
              :max-height="tableHeight"
              style="width: 100%"
              class="b-r animated fadeInRight">
      <el-table-column show-overflow-tooltip
                       label=""
                       width="80"
                       type="index"></el-table-column>
      <el-table-column show-overflow-tooltip
                       label="任务ID">
        <template slot-scope="{row}">
          <span>{{row.task_id}}</span>
          <el-tooltip class="item"
                      effect="dark"
                      content="调度运维实例页面"
                      placement="top">
            <span class="mr-10 ml-10"><i class="icon iconfont icon-oezuocedaohangtubiao- fz"
                 @click="linkOpsHandle(row)"></i></span>
          </el-tooltip>
          <el-tooltip class="item"
                      effect="dark"
                      content="调度运维代码页面"
                      placement="top">
            <span><i class="icon iconfont icon-code fz"></i></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="duration"
                       label="执行时长(秒)"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="start_time"
                       label="起始时间"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="end_time"
                       label="结束时间"></el-table-column>
    </el-table>
    <el-pagination class="fr pt-10"
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
                   :page-size="pageFilters.pageSize"
                   :page-sizes="pageSizes"
                   :current-page.sync="pageFilters.pageNo"
                   layout="total, prev, pager, next"
                   :total="total"></el-pagination>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getOutputInfo
} from '@/api/asset/list'
import pager from '@/mixins/pager'
export default {
  name: 'OutputInfo',
  mixins: [pager],
  data () {
    return {
      tableData: [],
      tableHeight: 100
    }
  },
  computed: {
    ...mapGetters(['cube_id'])
  },
  created () {
    this.getOutputInfo()
  },
  mounted () {
    this.$nextTick(_ => {
      this.tableHeight = window.innerHeight - 245
    })
  },
  methods: {
    async getOutputInfo () {
      const params = {
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo,
        id: this.cube_id
      }
      const res = await this.$simpleAsyncTo(getOutputInfo(params))
      if (res) {
        this.tableData = res.data.task_data
        this.total = res.data.total_records
      }
    },
    linkOpsHandle (row) {
      this.$router.push({
        // path: '/rd/ops/instance/period',
        name: 'instance-period',
        params: {
          id: this.cube_id,
          instance_id: row.id
        }
      })
    },
    handleCurrentChange (val) {
      this.pageFilters.pageNo = val
      this.getOutputInfo()
    }
  }
}
</script>
