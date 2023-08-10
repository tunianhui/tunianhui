<template>
  <section class="dispatch">
    <div class="head">
      <div class="flex">
        <div class="page-title mr-20">推送管理</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="我的(10)" name="first"></el-tab-pane>
          <el-tab-pane label="全部(16)" name="second"></el-tab-pane>
        </el-tabs>
      </div>
      <div>
        <div class="flex">
          <el-input v-model="inputVal" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入专题推送名称" class="mr-10"></el-input>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">发起推送</el-button>
        </div>
      </div>
    </div>

    <el-card>
      <el-table ref="multipleTable" :data="tableData" style="width: 100%" v-loading="!!loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="45">
        </el-table-column>
        <el-table-column prop="field1" label="推送名称" min-width="200">
          <template slot-scope="{row}">
            <span class="icon iconfont icon-shougongbiaoqian"></span>
            <span class="ml-10">{{row.field1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="field2" label="负责人" width="160">
        </el-table-column>
        <el-table-column prop="field3" label="开始日期" sortable width="140"></el-table-column>
        <el-table-column prop="field4" label="结束日期" sortable width="140"></el-table-column>
        <el-table-column prop="field5" label="推送状态" width="90">
          <template slot-scope="{row}">
            <i :class=" row.field5 === '上线' ? 'el-icon-success':'el-icon-close' "></i>
            <span class="ml-5">{{row.field5}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button type="text"><i class="iconfont icon-chakanshili font-14 color-btn" @click="handleDel(scope.row)"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="暂停" placement="top">
              <el-button type="text"><i class="iconfont icon-execute- font-14 color-btn" @click="handleSuspend(scope.row)"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="text"><i class="el-icon-edit-outline font-14 color-btn" @click="handleEdit(scope.row)"></i></el-button>
            </el-tooltip>
            <el-button type="text" icon="iconfont icon-gengduo font-14 color-btn" v-popover:morepopover>
              <el-popover popper-class="more-popover" placement="bottom" trigger="hover" ref="morepopover">
                <ul class="popper-list">
                  <li>
                    <el-button type="text"><i class="el-icon-user font-14 color-btn" @click="handleTransfer(row)"></i>转交负责人</el-button>
                  </li>
                  <li>
                    <el-button type="text"><i class="el-icon-delete font-14 color-btn" @click="handleDel(scope.row)">删除</i></el-button>
                  </li>
                </ul>
              </el-popover>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>

    <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData" @batchEdit="handleTransfer"></SelectFooter>
  </section>
</template>

<script>
import SelectFooter from './footer'
import pager from '@/mixins/pager'
export default {
  name: 'Dispatch',
  components: {
    SelectFooter
  },
  mixins: [pager],
  data () {
    return {
      activeName: 'first',
      inputVal: '',
      loading: 0,
      tableData: [
        {
          field1: '测试推送',
          field2: 'dataphin功能',
          field3: '2021-08-04',
          field4: '2022-02-03',
          field5: '上线'
        },
        {
          field1: '测试推送',
          field2: 'dataphin功能',
          field3: '2021-08-04',
          field4: '2022-02-03',
          field5: '下线'
        }
      ],
      multipleSelection: []
    }
  },
  mounted () { },
  methods: {
    handleClick (val) { },
    searchChange (val) { },
    // 发起推送
    handleAdd () {
      this.$router.push({ path: '/asset/govern/item-manage/launchPush' })
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
    },

    // 暂停
    handleSuspend (item) {
      this.$confirm('系统不支持恢复已暂停的表，请您谨慎操作，确认暂停?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },

    // 批量转交
    handleTransfer (item) {
      this.$confirm('转交后原负责人将无法对该元数据配置进行变更操作，确认转交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.dispatch {
  position: relative;
  height: 100%;
  .head {
    padding-bottom: 2px;
    border-bottom: 1px solid #d9d9d9;
  }
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .count {
    color: #4783ff;
  }
}

</style>
