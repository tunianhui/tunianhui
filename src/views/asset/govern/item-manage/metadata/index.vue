<template>
  <section class="item-manage-metadata">
    <div class="space-between mb-10">
      <div class="page-title">元数据列表</div>
      <div>
        <div class="flex">
          <el-input v-model="inputVal" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入搜索元数据名称" class="mr-10"></el-input>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新建元数据</el-button>
        </div>
      </div>
    </div>

    <el-card>
      <el-table ref="multipleTable" :data="tableData" style="width: 100%" v-loading="!!loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="45">
        </el-table-column>
        <el-table-column prop="field1" label="元数据名称" min-width="240">
          <template slot-scope="{row}">
            <span class="icon iconfont icon-shougongbiaoqian"></span>
            <span class="ml-10">{{row.field1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="field2" label="存储类型">
        </el-table-column>
        <el-table-column prop="field3" label="数据对象"></el-table-column>
        <el-table-column prop="field4" label="负责人" min-width="80"></el-table-column>
        <el-table-column prop="field5" label="指示数" sortable width="80"></el-table-column>
        <el-table-column prop="field6" label="是否引用/引用次数" width="150" sortable>
          <template slot-scope="{row}">
            <div>{{row.field6}}</div>
            <div v-if="row.field6 === '是'" class="count">{{row.field8}}次</div>
          </template>
        </el-table-column>
        <el-table-column prop="field7" label="检测状态" width="100">
          <template slot-scope="{row}">
            <i :class=" row.field7 === '成功' ? 'el-icon-success':'el-icon-close' "></i>
            <span class="ml-5">{{row.field7}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="{row}">
            <el-tooltip class="item" effect="dark" content="检测元数据" placement="top">
              <el-button type="text"><i class="iconfont icon-xinzengyudingicon- font-14 color-btn" @click="handleCheck(row)"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="text"><i class="el-icon-edit-outline font-14 color-btn" @click="handleEdit(row)"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="转交负责人" placement="top">
              <el-button type="text"><i class="el-icon-user font-14 color-btn" @click="handleTransfer(row)"></i></el-button>
            </el-tooltip>
            <el-button type="text" icon="iconfont icon-gengduo font-14 color-btn" v-popover:morepopover>
              <el-popover popper-class="more-popover" placement="bottom" trigger="hover" ref="morepopover">
                <ul class="popper-list">
                  <li>
                    <el-button type="text"><i class="el-icon-delete font-14 color-btn" @click="handleDel(row)">删除</i></el-button>
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

    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}">
      <el-form ref="form" :model="formData" :rules="rules" label-width="120px" label-suffix="：">
        <div class="section-title">数据源配置</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="元数据名称" prop="name">
              <el-input v-model="formData.name" maxlength="50" placeholder="请输入元数据名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14"></el-col>
          <el-col :span="12">
            <el-form-item label="存储类型" prop="type">
              <el-select v-model="formData.type" placeholder="请选择">
                <el-option v-for="item in typeList1" :key="item.value" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="元数据连接" prop="connect">
              <el-select v-model="formData.connect" placeholder="请选择">
                <el-option v-for="item in typeList2" :key="item.value" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="section-title">指标配置</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="数据表名称" prop="dataName">
              <el-select v-model="formData.dataName" placeholder="请选择">
                <el-option v-for="item in typeList3" :key="item.value" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据对象" prop="dataObj">
              <el-select v-model="formData.dataObj" placeholder="请选择">
                <el-option v-for="item in typeList4" :key="item.value" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="space-between mb-10">
        <span>指标注册</span>
        <el-button icon="el-icon-plus" @click="addField">添加字段</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData2" style="width: 100%" class="mb-20">
        <el-table-column prop="field1" label="字段名称" min-width="200">
        </el-table-column>
        <el-table-column prop="field2" label="指标名称">
        </el-table-column>
        <el-table-column prop="field3" label="字段类型"></el-table-column>
        <el-table-column prop="field4" label="指标类型" width="100">
        </el-table-column>
        <el-table-column prop="field5" label="联通状态" width="100">
          <template slot-scope="{row}">
            <i :class=" row.field5 === '正常' ? 'el-icon-success':'el-icon-close' "></i>
            <span class="ml-5">{{row.field5}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60">
          <template slot-scope="{row}">
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="text"><i class="el-icon-delete font-14 color-btn" @click="handleDel(row)"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import SelectFooter from './footer'
import pager from '@/mixins/pager'
export default {
  name: 'ItemManageMetadata',
  components: {
    SelectFooter
  },
  mixins: [pager],
  data () {
    return {
      typeList1: [
        { value: '全部' },
        { value: 'MAX_COMPUTE' }
      ],
      typeList2: [
        { value: 'test_basic_0823' },
        { value: 'test_basic_0824' },
        { value: 'test_basic_0825' }
      ],
      typeList3: [
        { value: 'table_0012' },
        { value: 'table_8989' },
        { value: 'table_5757' }
      ],
      typeList4: [
        { value: '全部' },
        { value: '物理表' },
        { value: '逻辑表' },
        { value: '任务节点' }
      ],
      inputVal: '',
      loading: 0,
      tableData: [
        {
          field1: '元数据注册',
          field2: 'MAX_COMPUTE',
          field3: '任务节点',
          field4: '系统',
          field5: 2,
          field6: '是',
          field7: '成功',
          field8: 1
        },
        {
          field1: '元数据注册物理表',
          field2: 'MAX_COMPUTE',
          field3: '任务节点',
          field4: '系统',
          field5: 1,
          field6: '否',
          field7: '成功',
          field8: 3
        },
        {
          field1: '元数据注册物理表',
          field2: 'MAX_COMPUTE',
          field3: '任务节点',
          field4: '系统',
          field5: 5,
          field6: '是',
          field7: '成功',
          field8: 3
        }
      ],
      multipleSelection: [],
      // ---- 弹窗相关 ----
      dialogVisible: false,
      title: '',
      formData: {},
      rules: {
        name: [
          { required: true, message: '请输入元数据名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择存储类型', trigger: 'change' }
        ],
        connect: [
          { required: true, message: '请选择元数据连接', trigger: 'change' }
        ],
        dataName: [
          { required: true, message: '请选择数据表名称', trigger: 'change' }
        ],
        dataObj: [
          { required: true, message: '请选择数据对象', trigger: 'change' }
        ]
      },
      tableData2: [
        {
          field1: 'table_guid',
          field2: '物理表guid',
          field3: 'string',
          field4: '基础指标',
          field5: '正常'
        }
      ]
    }
  },
  mounted () { },
  methods: {
    searchChange (val) { },
    handleAdd () {
      this.title = '新建元数据'
      this.formData = {}
      this.dialogVisible = true
    },
    handleEdit (item) {
      this.title = '编辑元数据'
      this.formData = item
      this.dialogVisible = true
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
    // 检测元数据
    handleCheck (item) { },
    handleDel (item) { },

    // 转交负责人 批量转交
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
    },

    // ------------------------
    // 添加字段
    addField () { },

    // 新建元数据
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.item-manage-metadata {
  position: relative;
  height: 100%;
  .section-title {
    font-size: 14px;
    font-weight: bold;
    margin: 20px 0 10px 0;
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
