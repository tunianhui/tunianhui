<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2022-10-18 10:37:53
 * @LastEditTime: 2023-04-13 15:33:48
 * @Description:
-->
<template>
  <section class="output-info animated fadeInRight">
    <el-table
      :data="tableData"
      :max-height="tableHeight"
      style="width: 100%"
      class="b-r animated fadeInRight"
    >
      <el-table-column
        show-overflow-tooltip
        label=""
        width="80"
        type="index"
      ></el-table-column>
      <!-- <el-table-column show-overflow-tooltip label="任务ID">
        <template slot-scope="{row}">
          <span>{{ row.task_id }}</span>
          <el-tooltip
            class="item"
            effect="dark"
            content="调度运维实例页面"
            placement="top"
          >
            <span class="mr-10 ml-10"
              ><i
                class="icon iconfont icon-oezuocedaohangtubiao- fz"
                @click="linkOpsHandle(row)"
              ></i
            ></span>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="调度运维代码页面"
            placement="top"
          >
            <span><i class="icon iconfont icon-code fz"></i></span>
          </el-tooltip>
        </template>
      </el-table-column> -->
      <el-table-column
        show-overflow-tooltip
        prop="name"
        label="任务名称"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="status"
        label="状态"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="duration"
        label="执行时长"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="start_time"
        label="起始时间"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="end_time"
        label="结束时间"
      ></el-table-column>
    </el-table>
    <div style="height: 40px; line-height: 40px; margin-top: 10px; text-align: end;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="pageNo"
        :page-size="pageSize"
        @current-change="currentPageChange"
      >
      </el-pagination>
    </div>
  </section>
</template>

<script>
import {mapGetters} from 'vuex'
import {getOutputInfo} from '@/api/asset/map'
export default {
  name: 'OutputInfo',
  props: {
    widthHeightData: Object,
    tableInfo: Object
  },
  data() {
    return {
      tableData: [],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      tableHeight: 0
    }
  },
  watch: {
    widthHeightData: {
      handler(val) {
        this.$nextTick((_) => {
          this.tableHeight = parseInt(val.height) - 80 - 45
        })
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(['cube_id']),
  },
  created() {
    this.getOutputInfo()
  },
  mounted() {},
  methods: {
    async getOutputInfo() {
      const params = {
        cube_id: this.cube_id,
        source_type: this.tableInfo.source_type,
        project_code: this.tableInfo.project_code,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      const res = await this.$simpleAsyncTo(getOutputInfo(params), '获取数据失败')
      if (res) {
        this.tableData = res.data.task_data
        this.total = res.data.total_records
      }
    },
    linkOpsHandle(row) {
      this.$router.push({
        // path: '/rd/ops/instance/period',
        name: 'instance-period',
        params: {
          id: this.cube_id,
          instance_id: row.id,
        },
      })
    },
    currentPageChange(currentPage) {
      this.pageNo = currentPage
      this.getOutputInfo()
    }
  },
}
</script>
