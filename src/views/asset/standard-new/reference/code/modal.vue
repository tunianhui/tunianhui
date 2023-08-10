<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-06 15:18:50
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-06 16:13:37
 * @FilePath: \数据智能构建\src\views\asset\standard-new\reference\code\modal.vue
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    custom-class="codeTable-modal"
  >
    <h4 class="mb-5">基本信息</h4>
    <el-form :model="form" :rules="rules" ref="form" label-width="90px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="编码名称" prop="name">
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入名称" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编码编码" prop="code">
            <el-input v-model="form.code" autocomplete="off" placeholder="请输入编码" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="负责人" prop="user">
        <el-select v-model="form.user" placeholder="请选择负责人" :disabled="disabled">
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="form.desc" autocomplete="off" placeholder="请输入描述" type="textarea" :rows="4" :disabled="disabled"></el-input>
      </el-form-item>
    </el-form>
    <h4 class="mb-10">代码信息</h4>
    <el-table
      :data="list"
      style="width: 100%;"
      max-height="200px"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="value"
        label="代码值"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.value" autocomplete="off" placeholder="请输入代码值"  v-if="scope.row.isEdit" :disabled="disabled"></el-input>
          <span v-else>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="代码名称"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" autocomplete="off" placeholder="请输入代码名称" v-if="scope.row.isEdit" :disabled="disabled"></el-input>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        label="代码英文名"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.code" autocomplete="off" placeholder="请输入代码英文名" v-if="scope.row.isEdit" :disabled="disabled"></el-input>
          <span v-else>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="desc"
        label="代码描述"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.desc" autocomplete="off" placeholder="请输入代码描述" v-if="scope.row.isEdit" :disabled="disabled"></el-input>
          <span v-else>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="70"
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="edit(scope.row)"><i class="el-icon-edit-outline font-14 color-btn" v-if="!scope.row.isEdit"></i></el-button>
          <el-button type="text" size="mini"><i class="el-icon-delete font-14 color-btn" @click="handleDelete(scope.row)" v-if="!disabled"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-button type="primary" class="mt-10 mb-10" icon="el-icon-plus" size="mini" @click="add" :disabled="disabled">新增码值</el-button>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
    
  </el-dialog>
</template>

<script>
export default {
  name: 'CodeTableModal',
  props: {
    title: {
      type: String,
      default: '新增'
    },
    viewType: {
      type: String,
      default: 'add'
    },
  },
  created() {
    if (this.viewType === 'add') {
      this.list = [
        {
          value: '',
          name: '',
          code: '',
          desc: '',
          isEdit: true
        }
      ]
    } else if (this.viewType === 'view') {
      this.disabled = true
    }
  },
  data() {
    return {
      disabled: false,
      dialogFormVisible: true,
      userList: [],
      form: {
        name: '',
        code: '',
        user: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入编码表名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编码表编码', trigger: 'blur' }
        ],
        user: [
          { required: true, message: '请选择负责人', trigger: 'change' }
        ]
      },
      list: []
    }
  },
  methods: {
    close() {
      this.dialogFormVisible = false
      this.$emit('close')
    },
    submit() {
      if (this.viewType === 'view') {
        this.$emit('close')
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$emit('submit', this.form)
          }
        })
      }
    },
    handleDelete(row) {
      this.list.splice(this.list.indexOf(row), 1)
    },
    // 添加
    add() {
      this.list.forEach(item => {
        item.isEdit = false
      })
      this.list.push({
        code: '',
        name: '',
        value: '',
        desc: '',
        isEdit: true
      })
    },
    // 编辑
    edit(item) {
      this.list.forEach(item => {
        item.isEdit = false
      })
      item.isEdit = true
    }
  }
}
</script>