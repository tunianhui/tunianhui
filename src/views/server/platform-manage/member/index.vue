
<template>
  <section class="platform-manage-member">
    <header class="flex-layout mb-20">
      <span>应用成员管理</span>
      <div class="flex-layout search-app">
        <el-input v-model="input" placeholder="请输入成员名" @input="changeInputHandle">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button plain class="ml-20">
          批量移除
        </el-button>
        <el-button type="primary" class="ml-20" @click="addUsername">
          <i class="el-icon-plus"></i>
          添加成员
        </el-button>
      </div>
    </header>
    <el-table :data="tableData" v-loading="!!loading" style="width: 100%">
      <el-table-column prop="user_name" label="成员名" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="role_name" label="角色" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="create_time" label="添加日期" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="update_time" label="修改日期" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editHandle(scope.row)" type="text" size="small" title="编辑">
            <i class="el-icon-edit-outline font-16"></i>
          </el-button>
          <el-button @click="delHandle(scope.row)" type="text" size="small" title="删除">
            <i class="el-icon-delete font-16"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="`${title}成员`" :visible.sync="dialogFormVisible" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="form" label-width="120px" :rules="rules" label-suffix="：" ref="form">
        <el-form-item label="新增用户" prop="user_name">
          <el-select v-model="form.user_name" placeholder="请选择">
            <el-option v-for="item in userListOptions" :key="item.id" :label="item.user_name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型" prop="role">
          <el-select v-model="form.role" placeholder="请选择">
            <el-option v-for="item in roleListOptions" :key="item.id" :label="item.user_name" :value="item.user_name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close('form')">取 消</el-button>
        <el-button type="primary" @click="submitConfirm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getUserList,
  delUser,
  getAllUserList,
  getAllRole
} from '@/api/server/server.js'
import { mapGetters } from 'vuex'
export default {
  name: 'Member',
  data () {
    return {
      input: '',
      tableData: [],
      loading: 0,
      title: '',
      dialogFormVisible: false,
      form: {
        user_name: '',
        role: ''
      },
      userListOptions: [],
      roleListOptions: [],
      rules: {
        user_name: [
          { required: true, message: '请选择用户', trigger: 'change' }
        ],
        role: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  created () {
    if (this.$route.params.duty_person) {
      this.input = this.$route.params.duty_person
    } else {
      this.input = ''
    }
    this.getUserList()
    this.getAllUserList()
    this.getAllRole()
  },
  methods: {
    async getUserList () {
      this.loading++
      const params = {
        project_id: this.project.project_id,
        user_name: this.input
      }
      const res = await this.$simpleAsyncTo(getUserList(params), '成员列表获取失败')
      if (res) {
        this.tableData = res.data
      }
      this.loading--
    },
    changeInputHandle (val) {
      this.input = val
      this.getUserList()
    },
    delHandle (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          id: row.id,
          project_id: row.project_id
        }
        const res = await this.$simpleAsyncTo(delUser(params), '删除失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addUsername () {
      this.dialogFormVisible = true
      this.title = '添加'
    },
    editHandle (row) {
      this.dialogFormVisible = true
      this.title = '编辑'
      this.form.user_name = row.id
      this.form.role = row.role
    },
    submitConfirm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // let fn, params
          // if (this.title === '编辑') {
          //   params = {
          //     ...this.form
          //   }
          //   fn = editApp
          // } else {
          //   params = {
          //     ...this.form,
          //     project_id: this.project.project_id
          //   }
          //   fn = newCreatedApp
          // }
          // const res = await this.$simpleAsyncTo(fn(params), `${this.title}失败`)
          // if (res) {
          //   this.$message(
          //     {
          //       type: 'success',
          //       message: `${this.title}成功`
          //     }
          //   )
          // }
          // this.close('form')
          // this.getAppList()
        }
      })
    },
    async getAllUserList () {
      const res = await this.$simpleAsyncTo(getAllUserList({ project_id: this.project.project_id }), '所有成员获取失败')
      if (res) {
        this.userListOptions = res.data
      }
    },
    async getAllRole () {
      const res = await this.$simpleAsyncTo(getAllRole({ project_id: this.project.project_id }), '成员角色获取失败')
      if (res) {
        this.roleListOptions = res.data
      }
    },
    close (formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss">
.platform-manage-member {
  header {
    justify-content: space-between;
    .search-app {
      .el-input {
        width: 280px;
        .el-input__inner {
          background: $grey7;
          border-radius: 0;
          border: none;
          border-bottom: 1px solid $grey6;
        }
      }
    }
  }
}
</style>
