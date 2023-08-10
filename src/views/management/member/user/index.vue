<template>
  <section class="user" ref="user">
    <!-- <div ref="box"> -->
    <el-row ref="search" class="mb-10">
      <el-col :xs="18" :sm="12" :md="12" :lg="15" :xl="18">成员管理</el-col>
      <el-col :xs="6" :sm="12" :md="12" :lg="9" :xl="6">
        <el-input
          placeholder="请输入关键词"
          prefix-icon="el-icon-search"
          v-model="searchKey"
          size="mini"
          style="width:50%"
          @keyup.enter.native="submitSearch"
        ></el-input>
        <el-button type="primary" size="mini" class="ml-20" @click="addUserVisible=true">添加成员</el-button>
        <el-popover placement="top" width="160" v-model="batchDelVisible">
          <i class="el-icon-warning mr-10" style="color:#E6A23C"></i>
          <span>确定删除吗？</span>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="batchDelVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="batchDel">确定</el-button>
          </div>
          <el-button slot="reference" type="primary" size="mini" class="ml-10">批量删除</el-button>
        </el-popover>
        <!-- <el-button type="primary" size="mini">批量删除</el-button> -->
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%"
      ref="table"
      @selection-change="handleSelectionChange"
      v-loading="!!loading"
    >
      <el-table-column :show-overflow-tooltip="true" width="180" type="selection"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="login_code" label="登录名"></el-table-column>
      <!-- <el-table-column :show-overflow-tooltip="true" prop="role_name" label="角色名称"></el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" prop="user_name" label="成员名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="oper_time" label="操作时间"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="操作" width="80">
        <template slot-scope="scope">
          <SimpleConfirm @confirm="delClick(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- </div> -->
    <el-pagination
      class="fr pt-10"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-size="pageFilters.pageSize"
      :page-sizes="pageSizes"
      :current-page.sync="pageFilters.pageNo"
      layout="total, prev, pager, next"
      :total="total"
    ></el-pagination>
    <!-- 新增成员 -->
    <el-dialog
      title="添加成员"
      :visible.sync="addUserVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}">
      <el-form :model="addUser" label-width="100px" ref="addUser" hide-required-asterisk>
        <el-form-item>
          <el-input v-model="userSearchKey" placeholder="请输入关键字" @input="inputHandle"></el-input>
        </el-form-item>
        <el-table
          :data="member_info.slice((this.pages.page - 1) * this.pages.rows, this.pages.page * this.pages.rows)"
          @selection-change="addMemberChange"
          ref="multipleTable"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column property="name" label="成员名称"></el-table-column>
          <el-table-column property="login_name" label="登录名"></el-table-column>
        </el-table>
        <el-pagination
          class="text-right"
          @current-change="currentPageHandle"
          :page-size="pages.rows"
          :current-page.sync="pages.page"
          layout="total, prev, pager, next"
          :total="member_info.length"
          :pager-count="5"
        ></el-pagination>
        <el-form-item label="角色名称：">
          <!-- <el-radio
            v-model="addUser.role_code"
            :label="item.key"
            v-for="item in dics.user_role"
            :key="item.key"
          >{{item.value}}</el-radio> -->
          <!-- <el-radio-group v-model="addUser.role_code">
            <el-radio
              class="mt-10"
              :label="item.value"
              v-for="item in dics.user_role"
              :key="item.key"
            >
            </el-radio>
          </el-radio-group> -->
          <el-checkbox-group v-model="addUser.role_code">
            <el-checkbox class=""
              :label="item.value"
              v-for="item in dics.user_role"
              :key="item.key"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addUser')">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import pager from '@/mixins/pager'
import { mapGetters } from 'vuex'
import {
  getUserList,
  getAddUser,
  getDeleteuser,
  getBatchDel,
  getAllUser
} from '@/api/management/user'
export default {
  name: 'User',
  mixins: [pager],
  data() {
    return {
      searchKey: '',
      userSearchKey: '',
      tableData: [],
      addUser: {
        role_code: [],
        role_name: '',
        login_code: '',
        user_name: ''
      },
      height: null,
      multipleSelection: [],
      addUserVisible: false,
      loading: 0,
      batchDelVisible: false,
      member_info: [],
      role_code: '',
      // memberNameList: [],
      // loginCodeList: [],
      currentMember: [],
      pages: {
        page: 1,
        rows: 5
      }
    }
  },
  computed: {
    ...mapGetters(['dics'])
  },
  created() {
    this.getTableList()
    this.getAllUser()
  },
  mounted() {
    // this.height = window.innerHeight - this.$refs.table.$el.offsetTop
  },
  methods: {
    // 获取成员列表
    async getTableList() {
      this.loading++
      const params = {
        user_name: this.searchKey,
        pageNo: this.pageFilters.pageNo,
        pageSize: this.pageFilters.pageSize
      }
      const res = await this.$simpleAsyncTo(
        getUserList(params),
        '获取成员列表失败'
      )
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
        this.loading--
      }
    },
    // 确认添加成员
    submitAdd(formName) {
      if (this.currentMember.length === 0 && this.currentMember) {
        this.$message({
          type: 'warning',
          message: '请选择成员'
        })
        return
      }
      if (!this.addUser.role_code.length) {
        this.$message({
          type: 'warning',
          message: '请选择成员角色'
        })
        return
      }
      let role_code = [], role_name = []
      this.addUser.role_code.forEach(e => {
        this.dics.user_role.forEach(i => {
          if (e === i.value) {
            role_code.push(i.key)
            role_name.push(i.value)
          }
        })
      })
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let loginCodeList = [],
            memberNameList = []
          this.currentMember.forEach(e => {
            memberNameList.push(e.name)
            loginCodeList.push(e.login_name)
          })
          const params = {
            role_code,
            role_name,
            login_code: [...loginCodeList],
            user_name: [...memberNameList]
          }
          this.globalLoading()
          const res = await this.$simpleAsyncTo(
            getAddUser(params),
            '添加成员失败'
          )
          if (res) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.addUserVisible = false
            // this.addUser = {}
            this.getTableList()
            this.$refs.multipleTable.clearSelection()
            this.role_code = ''
          }
          this.pages.page = 1
          this.globalLoading().close()
        }
      })
    },
    inputHandle(val) {
      this.userSearchKey = val
      if (val) {
        this.member_info = this.member_info.filter(e => {
          return e.name.indexOf(val) > -1
        })
      } else {
        this.getAllUser()
      }
      this.pages.page = 1
    },
    // 删除成员
    async delClick(row) {
      const params = {id: row.id}
      const res = await this.$simpleAsyncTo(getDeleteuser(params))
      if (res) {
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'success'
        })
        this.getTableList()
      }
    },
    // 批量删除成员
    async batchDel() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择删除的成员！'
        })
        this.batchDelVisible = false
        return
      }
      let id = ''
      this.multipleSelection.forEach(e => {
        id += `${e.id},`
      })
      const params = {id: id.substring(0, id.length - 1)}
      const res = await this.$simpleAsyncTo(getBatchDel(params), '删除失败')
      if (res) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getTableList()
      }
      this.batchDelVisible = false
    },
    // 获取所有用户
    async getAllUser() {
      const res = await this.$simpleAsyncTo(getAllUser({keyword: this.userSearchKey}), '获取用户失败')
      if (res) {
        this.member_info = res.data
      }
    },
    addMemberChange(val) {
      this.currentMember = val
      // val.forEach(e => {
      //   this.memberNameList.push(e.name)
      //   this.loginCodeList.push(e.login_name)
      // })
    },
    // 搜索
    submitSearch() {
      this.getTableList()
    },
    // 选中项
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    currentPageHandle(page) {
      this.pages.page = page
    },
    closeAdd() {
      this.addUserVisible = false
      this.pages.page = 1
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  height: 100%;
  padding: 15px 15px 0 15px;
}
</style>
