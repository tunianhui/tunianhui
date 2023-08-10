<template>
  <section class="platform-self">
    <div class="tips">
      <el-tooltip class="item" effect="dark" content="以下生产任务用到的部分输入表连续多天没有数据，这可能是非逾期的，请参看说明文档及时处理" placement="top">
        <span>该治理项扣分：<span class="count">20.11</span>分；以下生产任务用到的部分输入表连续多天没有数据，这可能是非逾期的，请参看<span class="link">说明文档</span>及时处理。</span>
      </el-tooltip>
    </div>
    <div class="mb-10">
      <div class="flex">
        <el-select v-model="form.type" placeholder="请选择项目">
          <el-option v-for="item in typeList1" :key="item.value" :label="item.value" :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="form.inputVal" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入搜索数据表名称" class="input-value ml-10 mr-10"></el-input>
        <el-select v-model="form.type" placeholder="请选择">
          <el-option v-for="item in typeList2" :key="item.value" :label="item.value" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>

    <el-card>
      <el-table ref="multipleTable" :data="tableData" style="width: 100%" v-loading="!!loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="45">
        </el-table-column>
        <el-table-column prop="field1" label="节点名称" min-width="200">
          <template slot-scope="{row}">
            <span class="icon iconfont icon-shougongbiaoqian"></span>
            <span class="ml-10">{{row.field1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="field2" label="节点ID" min-width="120">
        </el-table-column>
        <el-table-column prop="field3" label="节点类型" min-width="120">
        </el-table-column>
        <el-table-column prop="field4" label="项目名称" sortable min-width="120"></el-table-column>
        <el-table-column prop="field5" label="负责人" sortable width="100"></el-table-column>
        <el-table-column prop="field6" label="健康分" sortable width="100">
          <template slot-scope="{row}">
            <span>{{row.field6}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="field7" label="CPU消耗" sortable width="100">
          <template slot-scope="{row}">
            <span>{{row.field7}}</span>
            <span class="unit">CM</span>
          </template>
        </el-table-column>
        <el-table-column prop="field8" label="运行时长" sortable width="100">
          <template slot-scope="{row}">
            <span>{{row.field8}}</span>
            <span class="unit">s</span>
          </template>
        </el-table-column>
        <el-table-column prop="field9" label="处理状态">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="暂停" placement="top">
              <el-button type="text"><i class="iconfont icon-execute- font-14 color-btn" @click="handleSuspend(scope.row)"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="下线" placement="top">
              <el-button type="text"><i class="iconfont icon-xiaxian2 font-14 color-btn" @click="handleOffline(scope.row)"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>

    <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData" @batchRecover="handleOffline" @batchDel="handleSuspend"></SelectFooter>
  </section>
</template>

<script>
import SelectFooter from './footer-calculation.vue'
import pager from '@/mixins/pager'
export default {
  name: 'PlatformSelf',
  components: {
    SelectFooter
  },
  mixins: [pager],
  data () {
    return {
      typeList1: [
        { value: '全部' },
        { value: 'demo_dev' }
      ],
      typeList2: [
        { value: '全部' },
        { value: '未处理' },
        { value: '已处理' }
      ],
      form: {
        inputVal: ''
      },
      loading: 0,
      tableData: [
        {
          field1: 'fct_watches_df_odOOO_v1',
          field2: 'n_332461083',
          field3: 'ONE_SERVIC',
          field4: 'demo',
          field5: 'dataphin功能',
          field6: 98.01,
          field7: 3.33,
          field8: 31,
          field9: '未处理'
        },
        {
          field1: 'fct_watches_df_odOOO_v1',
          field2: 'n_332461083',
          field3: 'ONE_SERVIC',
          field4: 'demo',
          field5: 'dataphin功能',
          field6: 98.01,
          field7: 3.33,
          field8: 31,
          field9: '未处理'
        },
        {
          field1: 'fct_watches_df_odOOO_v1',
          field2: 'n_332461083',
          field3: 'ONE_SERVIC',
          field4: 'demo',
          field5: 'dataphin功能',
          field6: 98.01,
          field7: 2.33,
          field8: 31,
          field9: '已处理'
        }
      ],
      index: 0,
      multipleSelection: []
    }
  },
  mounted () { },
  methods: {
    searchChange (val) { },
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
    // 下线
    handleOffline (item) {
      this.$confirm('确认下线?', '提示', {
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
.platform-self {
  .search-wrapper {
    padding: 10px;
    background-color: #fff;
    margin-bottom: 10px;
    .title {
      display: inline-block;
      font-size: 14px;
      text-align: right;
      width: 80px;
      margin-right: 20px;
    }
    .line {
      height: 1px;
      background-color: #d9d9d9;
      margin-top: 10px;
      margin-left: 105px;
    }
  }
  .tips {
    font-size: 14px;
    padding: 5px 10px;
    background-color: #d7dcef;
    border: 1px solid #c5cbea;
    margin-bottom: 10px;
    .count {
      font-size: 18px;
      font-weight: bold;
      color: #000e7f;
      margin-left: 5px;
      margin-right: 5px;
    }
    .link {
      font-weight: bold;
      color: #000e7f;
      margin-left: 5px;
      margin-right: 5px;
    }
  }
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .count {
    color: #4783ff;
  }
  .unit {
    color: #999;
    margin-left: 5px;
  }
  .input-value {
    width: 200px;
  }
}
</style>
