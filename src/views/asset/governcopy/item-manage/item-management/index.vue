<template>
  <section class="item-manage-dispatch">
    <div class="head">
      <div class="flex">
        <div class="page-title mr-20">治理项管理</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="我的(8)" name="first"></el-tab-pane>
          <el-tab-pane label="全部(32)" name="second"></el-tab-pane>
        </el-tabs>
      </div>
      <div>
        <div class="flex">
          <el-input v-model="inputVal" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入搜索数据名称" class="mr-10"></el-input>
          <el-button type="primary" @click="jumpMetaData">元数据管理</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新建治理项</el-button>
        </div>
      </div>
    </div>

    <el-card>
      <el-table ref="multipleTable" :data="tableData" style="width: 100%" v-loading="!!loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="45"></el-table-column>
        <el-table-column prop="field1" label="治理项名称" min-width="200">
          <template slot-scope="{row}">
            <span class="icon iconfont icon-shougongbiaoqian"></span>
            <span class="ml-10">{{row.field1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="field2" label="类型" width="160">
        </el-table-column>
        <el-table-column prop="field3" label="治理领域" width="160"></el-table-column>
        <el-table-column prop="field4" label="治理对象" width="160"></el-table-column>
        <el-table-column prop="field5" label="负责人" width="140"></el-table-column>
        <el-table-column prop="field6" label="应用推送数" sortable width="120">
          <template slot-scope="{row}">
            <div v-if="row.field6 > 0" class="count">{{row.field6}}次</div>
            <div v-else>{{row.field6}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="field7" label="状态" width="80">
          <template slot-scope="{row}">
            <i :class=" row.field7 === '开启' ? 'el-icon-success':'el-icon-close' "></i>
            <span class="ml-5">{{row.field7}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="text"><i class="el-icon-edit-outline font-14 color-btn" @click="handleEdit(scope.row)"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="转交负责人" placement="top">
              <el-button type="text"><i class="el-icon-user font-14 color-btn" @click="handleTransfer(row)"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="text"><i class="el-icon-delete font-14 color-btn" @click="handleDel(scope.row)"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>

    <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData" @batchEdit="handleTransfer"></SelectFooter>

    <!-- 设置弹窗 -->
    <el-dialog title="治理项基础配置" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}" width="70%">
      <el-form ref="form" :model="formData" :rules="rules" label-width="140px" label-suffix="：">
        <el-form-item label="治理项名称" prop="field1">
          <el-input v-model="formData.field1" maxlength="50" placeholder="请输入治理项名称" class="name-input"></el-input>
        </el-form-item>
        <el-form-item label="治理对象" prop="field2">
          <el-radio-group v-model="formData.field2">
            <el-radio :label="1">物理表</el-radio>
            <el-radio :label="2">逻辑表</el-radio>
            <el-radio :label="3">任务节点</el-radio>
          </el-radio-group>
          <div class="detail">
            <el-row>
              <el-col :span="20">
                <div>展示字段<i class="el-icon-info ml-5"></i></div>
                <el-checkbox-group v-model="formData.fields">
                  <el-checkbox v-for="(item,index) in fieldlist" :key="index" :label="item.name">{{item.name}}({{item.nameCn}})</el-checkbox>
                </el-checkbox-group>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" plain @click="editField">编辑已有字段</el-button>
              </el-col>
            </el-row>
            <div class="line"></div>
            <div>治理项操作<i class="el-icon-info ml-5"></i></div>
            <el-checkbox-group v-model="formData.opertaion">
              <el-checkbox label="移入回收站"></el-checkbox>
              <el-checkbox label="生命周期修改"></el-checkbox>
              <el-checkbox label="暂停表节点"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="治理领域" prop="field3">
          <el-radio-group v-model="formData.field3">
            <el-radio :label="1">存储</el-radio>
            <el-radio :label="2">计算</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="治理项说明" prop="field4">
          <el-input v-model="formData.field4" type="textarea" maxlength="256" placeholder="请输入治理项说明" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import SelectFooter from './footer'
import pager from '@/mixins/pager'
export default {
  name: 'ItemManageDispatch',
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
          field1: 'alang_test',
          field2: '自定义治理项',
          field3: '存储',
          field4: '物理表',
          field5: '张三',
          field6: 0,
          field7: '开启'
        },
        {
          field1: 'alang_test',
          field2: '自定义治理项',
          field3: '存储',
          field4: '物理表',
          field5: '张三',
          field6: 2,
          field7: '开启'
        }
      ],
      multipleSelection: [],

      // 弹窗相关
      dialogVisible: false,
      formData: {
        fields: [],
        opertaion: []
      },
      rules: {
        field1: [
          { required: true, message: '请输入治理项名称', trigger: 'blur' }
        ],
        field2: [
          { required: true, message: '请选择治理对象', trigger: 'blur' }
        ],
        field3: [
          { required: true, message: '请选择治理领域', trigger: 'blur' }
        ],
        field4: [
          { required: true, message: '请输入治理项说明', trigger: 'blur' }
        ]
      },
      fieldlist: [
        { name: 'table_name', nameCn: '表名' },
        { name: 'owner_name', nameCn: '负责人' },
        { name: 'health_score', nameCn: '健康分' },
        { name: 'pangu_file_size', nameCn: '存储大小' },
        { name: 'life_cycle', nameCn: '生命周期' },
        { name: 'max_bizdata_33', nameCn: '33天访问跨度' },
        { name: 'logical_project_name', nameCn: '项目名称' }
      ]
    }
  },
  mounted () { },
  methods: {
    searchChange (val) { },
    handleClick (val) { },
    // 跳转到元数据注册
    jumpMetaData () {
      this.$router.push({ path: '/asset/govern/item-manage/metadata' })
    },
    // 新增治理项
    handleAdd () {
      this.dialogVisible = true
    },
    // 编辑治理项
    handleEdit (item) {
      this.$router.push({ path: '/asset/govern/item-manage/edit' })
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

    // 批量转交
    handleTransfer () {
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
    },

    // 弹窗相关
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.item-manage-dispatch {
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
  .line {
    height: 1px;
    border-bottom: 1px solid #d9d9d9;
  }
  .detail {
    padding: 5px 10px;
    background-color: #fff;
  }
  .name-input {
    width: 200px;
  }
}

</style>
