<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-04-23 10:51:04
 * @LastEditTime: 2023-08-08 15:09:18
 * @Description:
-->
<template>
  <section class="security-wrapper">
    <el-table :height="bodyHeight" :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading">
      <el-table-column prop="taskName" label="任务名">
        <template slot-scope="{row}">
          <div class="flex">
            <span class="icon iconfont icon-yuanbiao-xianxing"></span>
            <span class="cube_name">{{row.taskName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="taskTypeName" label="任务分类">
      </el-table-column>
      <el-table-column prop="taskStatusName" label="任务状态">
        <template slot-scope="{row}">
          <i :class="row.taskStatusName === '成功' ? 'el-icon-success':'el-icon-close'"></i>
          <span>{{row.taskStatusName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="successCount" label="成功/失败表数">
        <template slot-scope="{row}">
          <div>{{row.successCount}}/{{row.errorCount}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="开始结束时间">
        <template slot-scope="{row}">
          <div>{{row.scanStartDate}}</div>
          <div>{{row.scanEndDate}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="取消" placement="top">
            <el-button type="text" @click="handleCancel(row)"><i class="iconfont icon-zhongzhi font-16 color-btn"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button type="text" @click="handleCheck(row)"><i class="iconfont icon-shujutancha font-16 color-btn"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <div class="select-footer">
      <el-pagination class="fr pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>

  </section>
</template>

<script>
import SelectFooter from './footer'
import pager from '@/mixins/pager'
import {
  getPagedScanTasks,
  taskCancel
} from '@/api/asset/security.js'
export default {
  name: 'Task',
  components: {
    SelectFooter
  },
  mixins: [pager],
  data () {
    return {
      fixed: false,
      loading: 0,
      rules: {},
      tableData: [],
      multipleSelection: [],
      bodyHeight: 100
    }
  },
  created () {
    this.getTableList()
  },
  mounted () {
    this.$nextTick(_ => {
      // 使用 flex 1
      this.bodyHeight = document.getElementsByClassName('security-wrapper')[0].offsetHeight - 95
    })
  },
  methods: {
    async getTableList () {
      this.loading++
      const params = {
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo
      }
      const res = await getPagedScanTasks(params)
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
      this.loading--
    },

    // 查看
    handleCheck (row) {
      this.$router.push({ name: 'identification-task-detail', query: { id: row.scanTaskId }, params: { ...row } })
    },

    // 编辑
    handleCancel (row) {
      this.$confirm('确定取消任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cancelTask(row.scanTaskId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消!'
        })
      })
    },

    async cancelTask (scanTaskId) {
      const res = await taskCancel({ scanTaskId })
      if (res) {
        this.$message({
          type: 'success',
          message: '取消成功!'
        })
        this.getTableList()
      }
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    checkAllChange (boolean) {
      if (boolean) {
        this.tableData.forEach(item => {
          this.$refs.multipleTable.toggleAllSelection(item)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.security-wrapper {
  position: relative;
  // overflow: auto;
  height: 95%;
  background-color: #fff;
  .line {
    position: absolute;
    bottom: 40px;
    width: 100%;
    height: 6px;
    background-image: linear-gradient(#fff, #e0e0e0);
    // border: 1px solid black;
  }
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .data-classify {
    display: block;
    width: fit-content;
    text-align: center;
    border: 1px solid #c6dcff;
    background-color: #d1e3fd;
    border-radius: 10px;
    padding: 0 20px;
  }
  .flex-wrapper {
    display: flex;
    gap: 20px;
    .item {
      text-align: center;
      padding: 10px 20px 10px;
      border: 1px solid #999;
      cursor: pointer;
      &:hover {
        border: 1px solid #2e65ff;
      }
      .title {
        font-size: 16px;
        margin-bottom: 10px;
      }
      .desc {
        font-size: 14px;
        color: #999;
        line-height: 20px;
      }
    }
    .select {
      border: 1px solid #2e65ff;
    }
  }
  .tips {
    font-size: 14px;
    color: #999;
    line-height: 20px;
    margin: 20px 0;
  }
}
</style>
