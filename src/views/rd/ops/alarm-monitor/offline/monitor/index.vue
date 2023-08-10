<template>
  <section class="monitor monitor-filter" ref="monitor">
    <div class="flex-layout header mb-20" ref="head">
      <span>任务监控配置</span>
      <div class="new-btn" @click="newBuildHandle"> <i class="el-icon-plus"></i> 新建任务监控</div>
    </div>
    <FilterFieldCard
      class="mb-10"
      ref="filterFieldCard"
      @confirm="getTableList"
      :filterData="filterData"
      ></FilterFieldCard>
    <el-table ref="multipleTable" :class="{'fixed': fixed}"
      :data="tableData"
      style="width: 100%"
      v-loading="!!loading"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="cube_code" label="监控项">
        <template slot-scope="scope">
          <div class="color">
            <OverflowTooltip class="width-1">{{scope.row.cube_code}}</OverflowTooltip>
          </div>
          <OverflowTooltip class="width-1">{{scope.row.cube_id}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="alarm_reason_name" label="报警原因">
        <template slot-scope="scope">
          <OverflowTooltip class="width-1">{{scope.row.alarm_reason_name}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="oper_user" label="创建人">
        <template slot-scope="scope">
           <OverflowTooltip class="width-1">{{scope.row.oper_user}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="receive_type_name" label="接收方式">
        <template slot-scope="scope">
          <OverflowTooltip class="width-1">{{scope.row.receive_type_name}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="receive_person_name" label="接收人">
        <template slot-scope="scope">
          <OverflowTooltip class="width-1">{{scope.row.receive_person_name}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column label="监控开关">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#dcdfe6"
          active-value="0" inactive-value="1" @change="changeHandle(scope.row)"></el-switch>
      </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small"><i class="el-icon-edit-outline" title="编辑" @click="editHandle(scope.row)"></i></el-button>
          <el-button type="text" size="small"><i class="el-icon-delete" title="删除" @click="delHandle(scope.row)"></i></el-button>
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
    <SelectFooter
      @checkAllChange="checkAllChange"
      :multipleSelection="multipleSelection"
      :tableData="tableData"
      :isIndeterminate="isIndeterminate"
      @batchOpen="batchOpen"
      @batchClose="batchClose"
      @batchDel="batchDel"
    ></SelectFooter>
    <NewDialog v-if="dialogVisible" @close="closeDialog" :data="curRow" :title="title" :receiverList="receiverList"></NewDialog>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import FilterFieldCard from '@c/filter-card'
import NewDialog from './new-dialog'
import { listCreateUser, listReceivePerson, listPage, del, monitorSwitch, batchDelete, batchSwitch } from '@/api/rd/alarm-monitor/offline'
import { on, off } from '@/libs/dom'
import SelectFooter from './footer'
import pager from '@/mixins/pager'
export default {
  name: 'Monitor',
  components: {
    OverflowTooltip,
    SelectFooter,
    NewDialog,
    FilterFieldCard
  },
  mixins: [pager],
  data() {
    return {
      loading: 0,
      fixed: false,
      multipleSelection: [],
      isIndeterminate: false,
      tableData: [],
      dialogVisible: false,
      title: '新建',
      curRow: {},
      filterData: [],
      creatorList: [],
      receiverList: [],
      status: ''
    }
  },
  watch: {
    multipleSelection: {
      deep: true,
      handler(val) {
        if (val.length === 0 || val.length === this.tableData.length) {
          this.isIndeterminate = false
        } else if (val.length < this.tableData.length) {
          this.isIndeterminate = true
        }
      }
    }
  },
  async created() {
    await this.listCreateUser()
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
        label: '创建人',
        id: '创建人',
        options: this.creatorList
      },
      {
        label: '接收人',
        id: '接收人',
        options: this.receiverList
      },
      {
        label: '接收方式',
        id: '接收方式',
        options: this.dics.receive_type.map(item => {
          return {
            ...item,
            id: item.key,
            label: item.value
          }
        })
      }
    ]
    this.getTableList()
  },
  mounted() {
    on(this.$refs.monitor, 'scroll', this.handleScroll)
  },
  beforeDestroy() {
    off(this.$refs.monitor, 'scroll')
  },
  methods: {
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
    // 创建人
    async listCreateUser() {
      this.loading++
      const res = await this.$simpleAsyncTo(listCreateUser(), '获取创建人失败')
      if (res) {
        this.creatorList = res.data.map(item => {
          return {
            id: item.create_user,
            label: item.create_user
          }
        })
      }
      this.loading--
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
    // 列表
    async getTableList(curFilter = [], keyword = '') {
      this.loading++
      const params = {
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo,
        keyword: keyword,
        alarm_reason: '',
        oper_user: '',
        receive_person: '',
        receive_type: ''
      }
      curFilter.forEach(e => {
        switch (e.module) {
          case '告警原因':
            params.alarm_reason = e.value
            break
          case '创建人':
            params.oper_user = e.value
            break
          case '接收人':
            params.receive_person = e.value
            break
          case '接收方式':
            params.receive_type = e.value
            break
        }
      })
      const res = await this.$simpleAsyncTo(listPage(params), '获取任务失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    newBuildHandle() {
      this.dialogVisible = true
      this.curRow = {}
      this.title = '新建'
    },
    closeDialog(v) {
      this.dialogVisible = false
      if (v === 'refresh') {
        this.getTableList()
      }
    },
    searchFilterTable() {},
    editHandle(row) {
      this.dialogVisible = true
      this.curRow = row
      this.title = '编辑'
    },
    delHandle(row) {
      this.$confirm(`确认删除此记录吗？`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: false
      }).then(() => {
        const params = {id: row.id}
        this.del(params)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 单个删除
    async del(row) {
      this.loading++
      const res = await this.$simpleAsyncTo(del(row), '监控开关失败')
      if (res) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getTableList()
      }
      this.loading--
    },
    changeHandle(row) {
      this.monitorSwitch({id: row.id, status: row.status})
    },
    // 监控开关
    async monitorSwitch(params) {
      this.loading++
      const res = await this.$simpleAsyncTo(monitorSwitch(params), '监控开关失败')
      if (res) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getTableList()
      }
      this.loading--
    },
    checkAllChange(boolean) {
      if (boolean) {
        this.tableData.forEach(item => {
          this.$refs.multipleTable.toggleAllSelection(item)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchOpen() {
      this.$confirm(`确认批量开启吗？`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: false
      }).then(() => {
        this.status = '0'
        this.batchSwitch()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    batchClose() {
      this.$confirm(`确认批量关闭吗？`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: false
      }).then(() => {
        this.status = '1'
        this.batchSwitch()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 批量开关
    async batchSwitch() {
      this.loading++
      const params = {
        ids: JSON.stringify(this.multipleSelection.map(item => {
          return item.id
        })),
        status: this.status
      }
      const res = await this.$simpleAsyncTo(batchSwitch(params), '批量开关')
      if (res) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getTableList()
      }
      this.loading--
    },
    batchDel() {
      this.$confirm(`确认批量删除吗？`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: false
      }).then(() => {
        this.batchDelete()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 批量删除
    async batchDelete() {
      this.loading++
      const params = {
        id: JSON.stringify(this.multipleSelection.map(item => {
          return item.id
        }))
      }
      const res = await this.$simpleAsyncTo(batchDelete(params), '批量删除')
      if (res) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getTableList()
      }
      this.loading--
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/monitor.scss';
.monitor {
  padding: 10px 20px;
  height: 100%;
  overflow-y: auto;
  background: #ebeaef;
  .header{
    justify-content: space-between;
    .new-btn {
      padding: 5px 15px;
      border: 1px solid $generalColor;
      font-size: 12px;
      color: $generalColor;
      cursor: pointer;
    }
  }
  .width-1 {
    width:calc(100% - 1px);
  }
}
</style>
