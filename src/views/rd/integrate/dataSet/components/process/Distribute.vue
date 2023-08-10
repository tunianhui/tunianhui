
<template>
  <div class="comp-option-three">
    <el-form ref="form" label-width="100px" :model="form" :rules="rules" label-suffix="：">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入步骤名称" :maxlength="64" style="width: 200px;"></el-input>
      </el-form-item>
    </el-form>
    <el-row :gutter="20" style="height: calc(100% - 50px);">
      <el-col :span="8" class="left-col h100">
        <div class="header">
          <span>输入字段</span>
        </div>
        <el-input v-model="keyword" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入关键词" class="mb-10"></el-input>
        <el-table :data="form.inputColumn" style="width: 100%; max-height: 330px; overflow: auto;" class="mb-20">
          <el-table-column prop="name" label="字段" />
        </el-table>
      </el-col>
      <el-col :span="8" class="center-col h100">
        <div class="header">
          <span>合并逻辑配置</span>
        </div>
        <div>
          <div class="mb-10">分发的条件</div>
          <MonacoEditor :code.sync="form.json" style="height: 200px;" />
          <div class="mb-10 mt-10">分发的目标步骤</div>
          <div class="mb-10">条件结果为 true 的步骤：</div>
          <div class="mb-10">条件结果为 false 的步骤：</div>
        </div>
      </el-col>
      <el-col :span="8" class="right-col h100">
        <div class="header">
          <div>
            <span class="mr-10">输出字段</span>
            <el-select v-model="form.schemaId" placeholder="请选择" style="width: 120px;">
              <el-option v-for="(item, index) in schemaList" :key="index" :label="item.schemaName" :value="item.schemaId"></el-option>
            </el-select>
          </div>
          <el-button type="primary" class="iconfont icon-filter font-14" @click="manageField">字段管理</el-button>
        </div>
        <el-input v-model="keyword" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入关键词" class="mb-10"></el-input>
        <el-table :data="form.outputColumn" style="width: 100%; max-height: 330px; overflow: auto;" class="mb-20">
          <el-table-column type="index" label="序号" width="55" />
          <el-table-column prop="name" label="字段" />
          <el-table-column prop="type" label="类型" />
          <el-table-column label="操作" width="50">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="text" @click="handdleDel(scope.row, scope.$index)"><i class="el-icon-delete font-14 color-btn"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 字段管理 -->
    <el-dialog title="字段管理" append-to-body :visible.sync="dialogVisible" width="765px">
      <el-transfer :titles="['未选的输入字段', '已选的输入字段']" filterable filter-placeholder="请输入搜索关键词" v-model="fieldData" :data="form.inputColumn" :props="{ key: 'name', label: 'type' }">
        <template slot-scope="{ option }">
          <div class="space-between">
            <span>{{option.name}}</span>
            <span>{{option.type}}</span>
          </div>
        </template>
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handdleSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import comMixins from './mixins'

export default {
  mixins: [comMixins],
  data () {
    return {
      form: {
        type: '', // 组件类型
        name: '', // 步骤名称
        inputColumn: [], // 根据上游的输入，为您展示输入字段
        outputColumn: [] // 输出字段
      },
      rules: {
        name: [
          { required: true, message: '请输入步骤名称', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '只能包含汉字、字母、下划线（_）、数字', trigger: 'blur' }
        ]
      },
      // 是否显示字段管理
      dialogVisible: false,
      // 选择的字段 绑定值
      fieldData: [],
      schemaList: []
    }
  },
  created () {

  },
  methods: {
    configForm () {
      this.form = {
        type: '', // 组件类型
        name: '', // 步骤名称
        inputColumn: [], // 输出字段
        outputColumn: [] // 输入字段
      }
    },

    // 字段管理
    manageField () {
      this.dialogVisible = true
    },

    handdleDel (item, index) {
      this.form.outputColumn.splice(index, 1)
    },

    handdleSure () {
      this.form.outputColumn = this.fieldData.map(ele1 => {
        const item = this.form.inputColumn.find(ele2 => ele2.name === ele1)
        return { name: item.name, type: item.type }
      })
      this.dialogVisible = false
    }
  }
}
</script>
