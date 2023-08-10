<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2022-10-18 10:37:53
 * @LastEditTime: 2023-01-07 18:37:45
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
                       prop="name"
                       label="任务名称"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="status"
                       label="状态"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="duration"
                       label="执行时长"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="start_time"
                       label="起始时间"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="end_time"
                       label="结束时间"></el-table-column>
    </el-table>
    <el-pagination class="fr pt-10"
                    background
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
                   :page-size="pageFilters.pageSize"
                   :page-sizes="pageSizes"
                   :current-page.sync="pageFilters.pageNo"
                   layout="total, prev, pager, next, jumper"
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
      tableHeight: 100,
      pageFilters: {
        pageSize: 10,
        pageNo: 1 // 前台分页使用
      }
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
    handleCurrentChange (val) {
      this.pageFilters.pageNo = val
      this.getOutputInfo()
    }
  }
}
</script>
