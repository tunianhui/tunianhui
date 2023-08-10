<template>
  <el-dialog title="" :visible.sync="curVisible" width="52%" class="manage-user-dialog" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}">
    <div slot="title" class="space-between">
      <span>应用成员管理</span>
      <div class="title-search">
        <el-input v-model="input" placeholder="请输入成员名称" @input="changeInputHandle">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" class="ml-20 del-btn" @click="batchDelete">
          批量删除({{multipleSelection.length}})
        </el-button>
        <el-button type="primary" class="ml-20" @click="addUser">
          <i class="el-icon-plus"></i>
          添加成员
        </el-button>
      </div>
    </div>
    <el-table :data="userData" @selection-change="handleSelectionChange" v-loading="!!loading" max-height="280px">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column property="user_name" label="成员名" show-overflow-tooltip></el-table-column>
      <el-table-column property="login_code" label="账号" show-overflow-tooltip></el-table-column>
      <el-table-column property="role_name" label="角色" show-overflow-tooltip></el-table-column>
      <el-table-column property="token" label="token" show-overflow-tooltip></el-table-column>
      <el-table-column property="create_time" label="添加日期" show-overflow-tooltip></el-table-column>
      <el-table-column property="update_time" label="修改日期" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small" class="font-14" title="编辑">
            <i class="el-icon-edit-outline"></i>
          </el-button>
          <el-button type="text" size="small" class="font-14" title="删除" @click="deleteUser(scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>
          <el-button type="text" class="font-14" title="复制">
            <i class="icon iconfont icon-ziyuan2" v-clipboard="{ value: scope.row.token }"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" type="primary">关 闭</el-button>
    </div>
    <el-dialog :title="`${subDialogTitle}成员`" :visible.sync="userVisible" :append-to-body="true" width="28%">
      <el-form :model="form" :label-width="formLabelWidth" :rules="rules" label-suffix="：" ref="form">
        <el-form-item label="成员名" prop="login_code">
          <el-select v-model="form.login_code" placeholder="请选择成员">
            <el-option :label="item.login_code" :value="item.login_code" v-for="item in allRoleList" :key="item.login_code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role_code">
          <el-select v-model="form.role_code" placeholder="请选择角色">
            <el-option label="责任人" value="1"></el-option>
            <el-option label="管理员" value="2"></el-option>
            <el-option label="应用成员" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSub">取 消</el-button>
        <el-button type="primary" @click="confirmHandle">确 定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import {
  getUserList,
  deleteBatchUser,
  deleteUser,
  addUser,
  editUser,
  getAllRole
} from '@/api/server/server.js'
export default {
  name: 'ManageUser',
  props: {
    visible: Boolean,
    curRow: {
      type: Object
    }
  },
  watch: {
    curRow: {
      deep: true,
      immediate: true,
      handler (val) {
        this.getUserList()
      }
    }
  },
  data () {
    return {
      userData: [],
      curVisible: true,
      multipleSelection: [],
      input: '',
      loading: 0,
      userVisible: false,
      form: {
        login_code: '',
        role_code: '1'
      },
      formLabelWidth: '100px',
      rules: {
        login_code: [
          { required: true, message: '请输入账户名', trigger: 'blur' }
        ],
        user_name: [
          { required: true, message: '请输入成员名', trigger: 'blur' }
        ],
        role_code: [
          { required: true, message: '请输入角色', trigger: 'change' }
        ]
      },
      roles: {
        '1': '责任人',
        '2': '管理员',
        '3': '应用成员'
      },
      subDialogTitle: '',
      allRoleList: []
    }
  },
  created () {
    this.getAllRole()
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    changeInputHandle (val) {
      this.input = val
      this.getUserList()
    },
    async getUserList () {
      this.loading++
      const params = {
        user_name: this.input,
        app_id: this.curRow.app_id
      }
      const res = await this.$simpleAsyncTo(getUserList(params), '成员列表获取失败')
      if (res) {
        this.userData = res.data
      }
      this.loading--
    },
    batchDelete () {
      if (!this.multipleSelection.length) return this.$message({ type: 'warning', message: '请选删除的成员' })
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async _ => {
        let id_arr = []
        this.multipleSelection.forEach(e => {
          id_arr.push(e.id)
        })
        const res = await this.$simpleAsyncTo(deleteBatchUser({ id: id_arr.join() }), '删除失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getUserList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteUser (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async _ => {
        const res = await this.$simpleAsyncTo(deleteUser({ id: row.id }), '删除失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getUserList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addUser () {
      this.userVisible = true
      this.subDialogTitle = '添加'
    },
    confirmHandle () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let params = {}, fn
          if (this.subDialogTitle === '添加') {
            let userName = this.allRoleList.filter(e => {
              return e.login_code === this.form.login_code
            })
            params = {
              ...this.form,
              app_id: this.curRow.app_id,
              app_group_id: this.curRow.app_group_id,
              user_name: userName[0].user_name
            }
            fn = addUser
          } else {
            params = {
              role_code: this.form.role_code,
              role_name: this.roles[this.form.role_code],
              id: this.curUserId
            }
            fn = editUser
          }
          const res = await this.$simpleAsyncTo(fn(params), `${this.subDialogTitle}失败`)
          if (res) {
            this.$message({
              type: 'success',
              message: `${this.subDialogTitle}成功`
            })
          }
          this.input = ''
          this.getUserList()
          this.closeSub()
        }
      })
    },
    handleClick (row) {
      this.subDialogTitle = '修改'
      this.userVisible = true
      this.form.login_code = row.login_code
      this.form.role_code = row.role_code
      this.curUserId = row.id
    },
    close () {
      this.$emit('close')
    },
    closeSub () {
      this.userVisible = false
      this.$refs['form'].resetFields()
    },
    async getAllRole () {
      const res = await this.$simpleAsyncTo(getAllRole(), '获取所有业务成员失败')
      if (res) {
        this.allRoleList = res.data
      }
    }
  }
}
</script>

<style lang="scss">
.manage-user-dialog {
  .el-dialog__body {
    padding: 0;
  }
  .title-search {
    .el-input {
      width: 200px;
      .el-input__inner {
        background: $grey9;
        border-radius: 0;
        border: none;
        border-bottom: 1px solid $grey6;
      }
    }
  }
  .del-btn {
    background: #e9eefb;
    border-color: #a7baee;
    color: #2253d4;
    &:hover {
      // background: #e9eefb;
      // border-color: #a7baee;
      // color: #2253D4;
    }
  }
}
</style>
