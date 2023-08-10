<template>
  <section class="output-info animated fadeInRight">
    <el-table
      :data="tableData"
      :max-height="tableHeight"
      style="width: 100%" class="b-r animated fadeInRight">
      <el-table-column show-overflow-tooltip label="" width="80" type="index"></el-table-column>
      <el-table-column show-overflow-tooltip label="任务ID">
        <template slot-scope="scope">
          <span>{{scope.row.task_id}}</span>
          <el-tooltip class="item" effect="dark" content="调度运维实例页面" placement="top">
            <span class="mr-10 ml-10"><i class="icon iconfont icon-oezuocedaohangtubiao- fz" @click="linkOpsHandle(scope.row)"></i></span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="调度运维代码页面" placement="top">
            <span><i class="icon iconfont icon-code fz"></i></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="run_Duration" label="执行时长(秒)"></el-table-column>
      <el-table-column show-overflow-tooltip prop="start_date" label="起始时间"></el-table-column>
      <el-table-column show-overflow-tooltip prop="end_date" label="结束时间"></el-table-column>
    </el-table>
  </section>
</template>

<script>
import {mapGetters} from 'vuex'
import {
  getOutputInfo
} from '@/api/asset/map'
export default {
  name: 'OutputInfo',
  data() {
    return {
      tableData: [],
      tableHeight: 100
    }
  },
  computed: {
    ...mapGetters(['cube_id'])
  },
  created() {
    this.getOutputInfo()
  },
  mounted() {
    this.$nextTick(_ => {
      this.tableHeight = window.innerHeight - 245
    })
  },
  methods: {
    async getOutputInfo() {
      const res = await this.$simpleAsyncTo(getOutputInfo({cube_id: this.cube_id}))
      if (res) {
        this.tableData = res.data
      }
    },
    linkOpsHandle(row) {
      this.$router.push({
        // path: '/rd/ops/instance/period',
        name: 'instance-period',
        params: {
          id: this.cube_id,
          instance_id: row.id
        }
      })
    }
  }
}
</script>
