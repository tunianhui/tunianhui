<template>
  <section class="app-center-app">
    <header class="flex-layout mb-20">
      <span>我的应用</span>
      <div class="flex-layout search-app">
        <el-select v-model="select" placeholder="请选择应用分组" @change="changeAppGroup" clearable class="mr-5">
          <el-option :label="item.group_name" :value="item.id" v-for="item in appGroupList" :key="item.id"></el-option>
        </el-select>
        <el-input
          v-model="input"
          placeholder="请输入应用名称"
          @input="changeInputHandle"
          style="width: 200px"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" class="ml-20" @click="newCreatApp">
          <i class="el-icon-plus"></i>
          新建应用
        </el-button>
      </div>
    </header>
    <el-table
      :data="tableData"
      v-loading="!!loading"
      style="width: 100%">
      <el-table-column
        prop="app_name"
        label="应用名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="app_group_name"
        label="应用分组"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="fz_person"
        label="负责人"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cy_person_num"
        label="参与人数"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="band_api_num"
        label="绑定API个数"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="editHandle(scope.row)" type="text" size="small" title="编辑">
            <i class="el-icon-edit-outline font-16"></i>
          </el-button>
          <el-button @click="userHandle(scope.row)" type="text" size="small" title="成员管理">
            <i class="el-icon-user font-16"></i>
          </el-button>
          <!-- <el-button @click="seeHandle(scope.row)" type="text" size="small" title="查看">
            <i class="iconfont icon-sanwei1 font-16"></i>
          </el-button> -->
          <el-button @click="delHandle(scope.row)" type="text" size="small" title="删除">
            <i class="el-icon-delete font-16"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="`${title}应用`"
      :visible.sync="dialogFormVisible"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      >
      <el-form :model="form" label-width="120px" :rules="rules" label-suffix="：" ref="form">
        <el-form-item label="应用名称" prop="app_name">
          <el-input v-model="form.app_name" autocomplete="off" placeholder="请输入应用名称" maxlength="30" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="应用分组" prop="app_group_id">
          <el-select v-model="form.app_group_id" placeholder="请选择应用分组">
            <el-option :label="item.group_name" :value="item.id" v-for="item in appGroupList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="app_remark">
          <el-input v-model="form.app_remark" placeholder="请输入应用描述" type="textarea" rows="3" maxlength="120" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close('form')">取 消</el-button>
        <el-button type="primary" @click="submitConfirm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <ManageUserDialog v-if="visible" @close="closeUserDialog" :curRow="curRow"></ManageUserDialog>
  </section>
</template>

<script>
import {
  getAppList,
  editApp,
  newCreatedApp,
  delApp,
  getAppGroup
} from '@/api/server/server.js'
// import {
//   getAppGroup
// } from '@/api/server/api'
import {mapGetters} from 'vuex'
import ManageUserDialog from './user'
export default {
  name: 'AppCenterApp',
  components: {
    ManageUserDialog
  },
  data() {
    return {
      title: '',
      input: '',
      tableData: [],
      dialogFormVisible: false,
      visible: false,
      form: {
        app_name: '',
        app_remark: '',
        app_group_id: ''
      },
      rules: {
        app_name: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        app_group_id: [
          { required: true, message: '请选择应用分组', trigger: 'change' }
        ]
      },
      loading: 0,
      curRow: {},
      appGroupList: [],
      select: ''
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  created() {
    this.getAppList()
    this.getAppGroupList()
  },
  methods: {
    newCreatApp() {
      this.title = '新建'
      this.dialogFormVisible = true
    },
    editHandle(row) {
      this.title = '编辑'
      this.dialogFormVisible = true
      this.form.app_name = row.app_name
      this.form.app_group_id = row.app_group_id
      this.form.app_remark = row.app_remark
      this.curAppid = row.app_id
    },
    submitConfirm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let fn, params
          if (this.title === '编辑') {
            params = {
              ...this.form,
              id: this.curAppid
            }
            fn = editApp
          } else {
            params = {
              ...this.form
            }
            fn = newCreatedApp
          }
          const res = await this.$simpleAsyncTo(fn(params), `${this.title}失败`)
          if (res) {
            this.$message(
              {
                type: 'success',
                message: `${this.title}成功`
              }
            )
          }
          this.select = ''
          this.input = ''
          this.close('form')
          this.getAppList()
        }
      })
    },
    async getAppList() {
      this.loading++
      const params = {
        app_name: this.input,
        app_group_id: this.select
      }
      const res = await this.$simpleAsyncTo(getAppList(params), '获取应用列表失败')
      if (res) {
        this.tableData = res.data
      }
      this.loading--
    },
    changeInputHandle(val) {
      this.input = val
      this.getAppList()
    },
    changeAppGroup(val) {
      this.select = val
      this.getAppList()
    },
    delHandle(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$simpleAsyncTo(delApp({id: row.app_id}), '删除失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        this.select = ''
        this.input = ''
        this.getAppList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    userHandle(row) {
      this.visible = true
      this.curRow = row
    },
    seeHandle(row) {},
    close(formName) {
      this.$refs[formName].resetFields()
      this.form.app_name = ''
      this.form.app_remark = ''
      this.form.app_group_id = ''
      this.dialogFormVisible = false
    },
    closeUserDialog() {
      this.visible = false
    },
    async getAppGroupList() {
      const res = await this.$simpleAsyncTo(getAppGroup(), '应用分组获取失败')
      if (res) {
        this.appGroupList = res.data
      }
    }
  }
}
</script>

<style lang="scss">
.app-center-app {
  header {
    justify-content: space-between;
    .search-app {
      .el-input {
        // width: 280px;
        // .el-input__inner {
        //   background: $grey7;
        //   border-radius: 0;
        //   border: none;
        //   border-bottom: 1px solid $grey6;
        // }
      }
    }
  }
}
</style>
