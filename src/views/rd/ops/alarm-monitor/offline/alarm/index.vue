<template>
  <section class="alarm monitor-filter" ref="alarm">
    <div class="flex-layout header mb-20" ref="head">
      <span>任务报警记录</span>
      <div class="new-btn mr-20" @click="refeshHandle"> <i class="el-icon-refresh"></i></div>
    </div>
    <FilterFieldCard
      class="mb-10"
      ref="filterFieldCard"
      @confirm="getFilterField"
      :filterData="filterData"
      ></FilterFieldCard>
    <el-table ref="multipleTable" :class="{'fixed': fixed}" :data="tableData" style="width: 100%" v-loading="!!loading">
      <el-table-column prop="cube_code" label="任务名称&ID">
        <template slot-scope="scope">
          <div class="color">
            <OverflowTooltip class="width-1">{{scope.row.cube_code}}</OverflowTooltip>
          </div>
          <OverflowTooltip class="width-1">{{scope.row.cube_id}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="send_time" label="发送时间">
        <template slot-scope="scope">
          <OverflowTooltip class="width-1">{{scope.row.send_time}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="receive_person_name" label="接收人">
        <template slot-scope="scope">
          <OverflowTooltip class="width-1">{{scope.row.receive_person_name}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="alarm_reason_name" label="报警原因">
        <template slot-scope="scope">
          <OverflowTooltip class="width-1">{{scope.row.alarm_reason_name}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="receive_type_name" label="接受类型">
        <template slot-scope="scope">
           <OverflowTooltip class="width-1">{{scope.row.receive_type_name}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="send_status" label="发送状态">
        <template slot-scope="scope">
          <OverflowTooltip class="width-1">{{scope.row.send_status}}</OverflowTooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="fr pt-10 pb-10"
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-size="pageFilters.pageSize"
      :page-sizes="pageSizes"
      :current-page.sync="pageFilters.pageNo"
      layout="total, prev, pager, next"
      :total="total"
    ></el-pagination>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import FilterFieldCard from '@c/filter-card'
import { on, off } from '@/libs/dom'
import pager from '@/mixins/pager'
import { listReceivePerson, listHistoryPage } from '@/api/rd/alarm-monitor/offline'
export default {
  name: 'Alarm',
  components: {
    OverflowTooltip,
    FilterFieldCard
  },
  mixins: [pager],
  data() {
    return {
      loading: 0,
      fixed: false,
      filterData: [],
      tableData: [],
      receiverList: [],
      filterParams: {
        keyword: '',
        alarm_reason: '',
        status: '',
        receive_person: '',
        start_time: '',
        end_time: ''
      }
    }
  },
  computed: {
  },
  async created() {
    await this.listReceivePerson()
    this.filterData = [
      {
        label: '告警原因',
        id: '告警原因',
        options: this.dics.task_status.map(item => {
          return {
            ...item,
            id: item.key,
            label: item.value
          }
        })
      },
      {
        label: '发送状态',
        id: '发送状态',
        options: [
          {id: '0', label: '成功'},
          {id: '1', label: '失败'}
        ]
      },
      {
        label: '接收人',
        id: '接收人',
        options: this.receiverList
      },
      {
        label: '报警发送时间',
        id: '报警发送时间',
        type: 'date'
      }
    ]
    this.getTableList()
  },
  mounted() {
    on(this.$refs.alarm, 'scroll', this.handleScroll)
  },
  beforeDestroy() {
    off(this.$refs.alarm, 'scroll')
  },
  methods: {
    refeshHandle() {
      this.getTableList()
    },
    handleScroll(e) {
      const scrollTop = e.target.scrollTop,
        headHeight = this.$refs.head.clientHeight,
        filterFieldCardHeight = this.$refs.filterFieldCard.$el.clientHeight
      if (scrollTop > headHeight + filterFieldCardHeight) {
        this.fixed = true
      } else {
        this.fixed = false
      }
    },
    // 接收人
    async listReceivePerson() {
      this.loading++
      const res = await this.$simpleAsyncTo(listReceivePerson(), '获取接收人失败')
      if (res) {
        this.receiverList = res.data.map(item => {
          return {
            id: item.id,
            label: item.name
          }
        })
      }
      this.loading--
    },
    getFilterField(curFilter = [], keyword = '') {
      this.filterParams.keyword = keyword
      curFilter.forEach(e => {
        switch (e.module) {
          case '告警原因':
            this.filterParams.alarm_reason = e.value
            break
          case '发送状态':
            this.filterParams.status = e.value
            break
          case '接收人':
            this.filterParams.receive_person = e.value
            break
          case '报警发送时间':
            this.filterParams.start_time = e.value[0]
            this.filterParams.end_time = e.value[1]
            break
        }
      })
    },
    // 列表
    async getTableList() {
      this.loading++
      const params = {
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo,
        ...this.filterParams
      }
      const res = await this.$simpleAsyncTo(listHistoryPage(params), '获取任务报警失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/monitor.scss';
.alarm {
  padding: 10px;
  height: 100%;
  background: #ebeaef;
  overflow-y: auto;
  .header {
    justify-content: space-between;
    .new-btn {
      padding: 2px 12px;
      border: 1px solid $generalColor;
      box-sizing: border-box;
      color: $generalColor;
      cursor: pointer;
    }
  }
}
</style>
