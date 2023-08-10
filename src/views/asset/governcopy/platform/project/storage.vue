<template>
  <section class="platform-self">
    <div class="tips">
      <el-tooltip class="item" effect="dark" content="以下表内容为空，物理存储为0，请参看说明文档及时处理" placement="top">
        <span>该治理项扣分：<span class="count">0.02</span>分；以下表内容为空，物理存储为0，请参看<span class="link">说明文档</span>及时处理。</span>
      </el-tooltip>
    </div>
    <div class="mb-10">
      <div class="flex">
        <el-select v-model="form.project" placeholder="请选择项目">
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
        <el-table-column prop="field1" label="表名" min-width="200">
          <template slot-scope="{row}">
            <span class="icon iconfont icon-shougongbiaoqian"></span>
            <span class="ml-10">{{row.field1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="field2" label="项目名称" min-width="120">
        </el-table-column>
        <el-table-column prop="field3" label="业务板块" min-width="120">
        </el-table-column>
        <el-table-column prop="field4" label="负责人" sortable min-width="120"></el-table-column>
        <el-table-column prop="field5" label="健康分" sortable width="90"></el-table-column>
        <el-table-column prop="field6" label="存储大小" sortable min-width="100">
          <template slot-scope="{row}">
            <span>{{row.field6}}</span>
            <span class="unit">B</span>
          </template>
        </el-table-column>
        <el-table-column prop="field7" label="生命周期" sortable width="100">
          <template slot-scope="{row}">
            <span>{{row.field6}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="field8" label="33天访问跨度" sortable width="140">
        </el-table-column>
        <el-table-column prop="field9" label="处理状态">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="移入回收站" placement="top">
              <el-button type="text"><i class="el-icon-delete font-14 color-btn" @click="handleDelete(scope.row)"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="生命周期" placement="top">
              <el-button type="text"><i class="el-icon-refresh-right font-14 color-btn" @click="handleLifeCycle(scope.row)"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="暂停" placement="top">
              <el-button type="text"><i class="iconfont icon-execute- font-14 color-btn" @click="handleSuspend(scope.row)"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>

    <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData" @batchRecover="handleLifeCycle" @batchDel="handleDelete"></SelectFooter>

    <el-dialog title="生命周期设置" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}">
      <el-form ref="lifeCycleform" :model="formData" :rules="rules" label-width="100px" label-suffix="：">
        <el-form-item label="生命周期" prop="lifeCycle">
          <el-radio-group v-model="formData.lifeCycle">
            <el-radio :label="1">1天</el-radio>
            <el-radio :label="2">7天</el-radio>
            <el-radio :label="3">32天</el-radio>
            <el-radio :label="4">365天</el-radio>
            <el-radio :label="5">其他</el-radio>
          </el-radio-group>
          <el-input v-model="formData.num" maxlength="10" placeholder="请输入数字" class="num-input"></el-input>
          <span>天</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">设 置</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import SelectFooter from './footer'
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
      formData: {
        lifeCycle: '',
        num: ''
      },
      rules: {
        lifeCycle: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      loading: 0,
      tableData: [
        {
          field1: 's_order_bak',
          field2: 'cathy_basic',
          field3: 'LD_test',
          field4: 'dataphin功能',
          field5: 90,
          field6: 0,
          field7: '-',
          field8: 1,
          field9: '已处理'
        },
        {
          field1: 's_order_bak',
          field2: 'cathy_basic',
          field3: 'LD_test',
          field4: 'dataphin功能',
          field5: 90,
          field6: 0,
          field7: '-',
          field8: 1,
          field9: '已处理'
        },
        {
          field1: 's_order_bak',
          field2: 'cathy_basic',
          field3: 'LD_test',
          field4: 'dataphin功能',
          field5: 90,
          field6: 0,
          field7: '-',
          field8: 1,
          field9: '已处理'
        }
      ],
      index: 0,
      multipleSelection: [],
      dialogVisible: false
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
    handleDelete (item) {
      this.$confirm('确认移入回收站?', '提示', {
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

    // 生命周期
    handleLifeCycle (item) {
      this.dialogVisible = true
    },

    submitForm () {
      this.$refs.lifeCycleform.validate(async valid => {
        if (valid) {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '设置成功！'
          })
        }
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
  .num-input {
    width: 100px;
    margin-left: 5px;
    margin-right: 5px;
  }
}
</style>
