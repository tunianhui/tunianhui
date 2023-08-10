<template>
  <section class="item-manage-task">
    <div class="tools space-between">
      <div class="left-item">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="inputVal" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入任务对象名称、节点名称或节点ID" class="mr-20 ml-10"></el-input>
          </el-col>
          <el-col :span="12">
            <el-checkbox-group v-model="checkList">
              <el-checkbox v-for="item in taskList" :label="item" :key="item">{{item}}</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </div>
      <div>
        <div class="flex mr-5">
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="text" @click="expandClick">{{allFilterVisible ? '收起':'展开' }}筛选 <i class="icon-font" :class="allFilterVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></el-button>
        </div>
      </div>
    </div>

    <div v-show="allFilterVisible" class="search-form-wrapper">
      <el-form ref="searchform" :model="searchData" label-width="140px" label-position="right" label-suffix="：">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="细分类型" prop="type">
              <el-select v-model="searchData.type" placeholder="请选择细分类型">
                <el-option v-for="item in optionList1" :key="item.value" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="最近操作人" prop="type">
              <el-select v-model="searchData.type" placeholder="请选择最近操作人">
                <el-option v-for="item in optionList2" :key="item.value" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="负责人" prop="type">
              <el-select v-model="searchData.type" placeholder="请选择负责人">
                <el-option v-for="item in optionList3" :key="item.value" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="引擎版本" prop="type">
              <el-select v-model="searchData.type" placeholder="请选择引擎版本">
                <el-option v-for="item in optionList4" :key="item.value" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否启动测试实例" prop="type">
              <el-select v-model="searchData.type" placeholder="是否启动测试实例">
                <el-option v-for="item in optionList5" :key="item.value" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-card>
      <el-table ref="multipleTable" :data="tableData" :default-sort="{prop: 'date', field5: 'descending'}" style="width: 100%" v-loading="!!loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="45">
        </el-table-column>
        <el-table-column prop="field1" label="任务对象" min-width="200">
          <template slot-scope="{row}">
            <span class="icon iconfont icon-shougongbiaoqian"></span>
            <span class="ml-10">{{row.field1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="field2" label="最近操作人" width="150">
        </el-table-column>
        <el-table-column prop="field3" label="负责人" width="150"></el-table-column>
        <el-table-column prop="field4" label="是否启动测试实例" width="150"></el-table-column>
        <el-table-column prop="field5" label="最近提交时间" width="150"></el-table-column>
        <el-table-column prop="field6" label="资源队列">
        </el-table-column>
        <el-table-column prop="field7" label="引擎版本" width="100">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button type="text"><i class="iconfont icon-chakanshili font-14 color-btn" @click="handleDel(scope.row)"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="暂停" placement="top">
              <el-button type="text"><i class="iconfont icon-execute- font-14 color-btn" @click="handleSuspend(scope.row)"></i></el-button>
            </el-tooltip>
            <el-button type="text" icon="iconfont icon-gengduo font-14 color-btn" v-popover:morepopover>
              <el-popover popper-class="more-popover" placement="bottom" trigger="hover" ref="morepopover">
                <ul class="popper-list">
                  <li>
                    <el-button @click="handleDel(scope.row)" type="text" icon="el-icon-delete">删除</el-button>
                  </li>
                </ul>
              </el-popover>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>

    <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData" @batchEdit="batchEdit"></SelectFooter>
  </section>
</template>

<script>
import SelectFooter from './footer'
import pager from '@/mixins/pager'
export default {
  name: 'ItemManageTask',
  components: {
    SelectFooter
  },
  mixins: [pager],
  data () {
    return {
      allFilterVisible: false,
      searchData: {},
      optionList1: [
        { value: '全部' },
        { value: 'MAX_COMPUTE' }
      ],
      optionList2: [
        { value: 'test001' },
        { value: 'test002' }
      ],
      optionList3: [
        { value: 'test001' },
        { value: 'test002' }
      ],
      optionList4: [
        { value: 'blink-3.3.0' },
        { value: 'blink-3.1.0' }
      ],
      optionList5: [
        { value: '是' },
        { value: '否' }
      ],
      checkList: [],
      taskList: ['我操作的任务', '我的已启动实例任务'],
      inputVal: '',
      loading: 0,
      tableData: [
        {
          field1: 'test sql 6',
          field2: 'test001',
          field3: 'test001',
          field4: '否',
          field5: '2020-07-24 17:16:05',
          field6: 'root_ky27_acddse',
          field7: 'blink-3.3.0'
        },
        {
          field1: 'test sql 6',
          field2: 'test001',
          field3: 'test001',
          field4: '否',
          field5: '2020-07-24 17:16:05',
          field6: 'root_ky27_acddse',
          field7: 'blink-3.3.0'
        },
        {
          field1: 'test sql 6',
          field2: 'test001',
          field3: 'test001',
          field4: '否',
          field5: '2020-07-24 17:16:05',
          field6: 'root_ky27_acddse',
          field7: 'blink-3.3.0'
        }
      ],
      multipleSelection: []
    }
  },
  mounted () { },
  methods: {
    searchChange (val) { },
    reset () { },
    expandClick () {
      this.allFilterVisible = !this.allFilterVisible
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

    // 修改负责人
    batchEdit () {
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
.item-manage-task {
  position: relative;
  height: 100%;
  .tools {
    padding: 10px 0;
    border-bottom: 1px solid #d9d9d9;
    background-color: #fff;
    .left-item {
      width: 700px;
    }
    .icon-font {
      font-size: 14px;
    }
  }
  .search-form-wrapper {
    background-color: #f8f8fa;
    padding: 10px 10px 0 10px;
    margin-bottom: 10px;
  }
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
}

</style>
