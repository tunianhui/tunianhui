
<template>
  <section class="trashlist">
    <div class="head">
      <div class="flex">
        <div class="page-title mr-20">回收站列表</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="待处理列表(3)" name="first"></el-tab-pane>
          <el-tab-pane label="已处理列表(5)" name="second"></el-tab-pane>
          <el-tab-pane label="全部(8)" name="third"></el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="mb-10">
      <div class="flex">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option v-for="item in typeList" :key="item.value" :label="item.value" :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="form.field1" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入搜索数据表名称" class="input-value ml-10"></el-input>
      </div>
    </div>

    <el-card>
      <el-table ref="multipleTable" :data="tableData" style="width: 100%" v-loading="!!loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="45">
        </el-table-column>
        <el-table-column prop="field1" label="表名称" min-width="200">
          <template slot-scope="{row}">
            <span class="icon iconfont icon-shougongbiaoqian"></span>
            <span class="ml-10">{{row.field1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="field2" label="项目" min-width="150">
        </el-table-column>
        <el-table-column prop="field3" label="表类型" width="140">
        </el-table-column>
        <el-table-column prop="field4" label="回收日期" width="160"></el-table-column>
        <el-table-column prop="field5" label="操作日期" width="160"></el-table-column>
        <el-table-column prop="field6" label="回收状态" width="100">
          <template slot-scope="{row}">
            <span>{{row.field6}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="日志" placement="top">
              <el-button type="text"><i class="iconfont icon-tiaoduxiangqing font-14 color-btn" @click="handleEdit(scope.row)"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="清除" placement="top">
              <el-button type="text"><i class="el-icon-delete font-14 color-btn" @click="handleEdit(scope.row)"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="恢复" placement="top">
              <el-button type="text"><i class="el-icon-refresh-right font-14 color-btn" @click="batchRecover(scope.row)"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>

    <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData" @batchRecover="batchRecover" @batchDel="handleEdit"></SelectFooter>
  </section>
</template>

<script>
import SelectFooter from './footer'
import pager from '@/mixins/pager'
export default {
  name: 'Trashlist',
  components: {
    SelectFooter
  },
  mixins: [pager],
  data () {
    return {
      activeName: 'first',
      typeList: [
        { value: '全部' },
        { value: '物理表' },
        { value: '逻辑表' }
      ],
      form: {
      },
      loading: 0,
      tableData: [
        {
          field1: 'zhihong_quick_assets_test',
          field2: 'quick_assets_basic',
          field3: '物理表',
          field4: '20210803 19:90:13',
          field5: '20210803 19:90:13',
          field6: '已清除'
        },
        {
          field1: 'zhihong_quick_assets_test',
          field2: 'quick_assets_basic',
          field3: '物理表',
          field4: '20210803 19:90:13',
          field5: '20210803 19:90:13',
          field6: '已恢复'
        }
      ],
      multipleSelection: []
    }
  },
  mounted () { },
  methods: {
    handleClick (val) { },
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
    // 清除
    handleEdit (item) { },
    // 恢复
    batchRecover (item) { }
  }
}
</script>
z
<style lang="scss">
.trashlist {
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
  .input-value {
    width: 200px;
  }
}

</style>
