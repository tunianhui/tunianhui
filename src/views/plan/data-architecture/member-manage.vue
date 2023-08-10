<template>
  <div class="already-add no-hover">
    <!-- 成员管理 -->
    <el-dialog
      :visible.sync="MemberManageVisible"
      @close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}">
      <div slot="title" class="header flex-layout">
        <div class="title flex-1">
          <span class="mr-15">成员管理：</span>
          <span>{{ project.project_name }}</span>
        </div>
        <div class="search-add flex-1">
          <el-input
            prefix-icon="el-icon-search"
            placeholder="请输入成员名"
            class="mr-15"
            style="width:50%"
            v-model="member_name"
            @input="filterHandle"
          ></el-input>
          <el-button icon="el-icon-plus" @click="addMemberClickHandle">添加成员</el-button>
        </div>
      </div>
      <el-table :data="MemberData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column property="user_name" label="成员名" sortable :show-overflow-tooltip="true"></el-table-column>
        <el-table-column property="role_name" label="角色" :show-overflow-tooltip="true">
          <template slot="header">
            <span>
              角色
              <i class="el-icon-info ml-10"></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column property="oper_time" label="操作日期" sortable></el-table-column>
        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <SimpleConfirm @confirm="deleteRow(scope.$index, scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <div class="operation">
        <!-- <el-checkbox class="mr-15 ml-15" @change="allSelectHandle" v-model="is_all_select">全选</el-checkbox> -->
        <span class="del ml-15" @click="batchDelMemberHandle">
          <i class="el-icon-delete"></i>
          <span>批量删除</span>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitHandle">完 成</el-button>
      </span>
      <!-- 添加成员 -->
      <el-dialog
        width="30%"
        title="添加成员"
        :visible.sync="AddMemberVisible"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="add-user"
        v-draggable="{trigger: '.add-user .el-dialog__header', body: '.add-user .el-dialog', recover: false}"
      >
        <el-table
          :data="member_info"
          v-loading="addMemberLoading"
          @selection-change="addMemberChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column property="user_name" label="成员名称"></el-table-column>
          <el-table-column property="login_code" label="登录名"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="AddMemberVisible=false">取消</el-button>
          <el-button type="primary" @click="submitAddMember">确认</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import {
  getMemberList,
  delMember,
  batchDelMember,
  getAllUsers,
  addUsers
} from '@/api/plan/project-manage'
export default {
  name: 'AlreadyAdd',
  mixins: [pager],
  props: {
    project: {
      type: Object
    }
  },
  data() {
    return {
      MemberManageVisible: true,
      AddMemberVisible: false,
      addMemberLoading: false,
      member_name: '',
      total: 0,
      MemberData: [], // 成员管理
      member_info: [],
      delSelectionList: [], // 选中删除的成员
      addSelectionList: [] // 选中添加的成员
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取成员管理列表
    async getUserList() {
      const params = {project_id: this.project.project_id}
      const res = await this.$simpleAsyncTo(
        getMemberList(params),
        '获取成员列表失败'
      )
      if (res) {
        this.MemberData = res.data
      }
    },
    // 删除成员
    async deleteRow(index, row) {
      const params = {user_id: row.user_id, project_id: row.project_id}
      const res = await this.$simpleAsyncTo(delMember(params), '删除成员失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成员成功！'
        })
        this.getUserList()
      }
    },
    // 搜索成员
    filterHandle(val) {
      if (val !== '' || null) {
        const filterData = this.MemberData.filter(e => {
          return e.user_name.indexOf(val) > -1
        })
        this.MemberData = filterData
      } else {
        this.getUserList()
      }
    },
    // 批量删除
    handleSelectionChange(v) {
      this.delSelectionList = v
    },
    async batchDel() {
      let ids = ''
      this.delSelectionList.forEach(e => {
        ids += e.user_id + ','
      })
      const params = {
        user_id: ids.substring(0, ids.length - 1),
        project_id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(
        batchDelMember(params),
        '批量删除失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '批量删除成功'
        })
        this.getUserList()
      }
    },
    batchDelMemberHandle() {
      if (this.delSelectionList.length === 0) {
        return this.$message({type: 'warning', message: '请选择删除的成员'})
      }
      this.$confirm('此操作将永久删除, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.batchDel()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加成员
    async addMemberClickHandle() {
      this.AddMemberVisible = true
      this.addMemberLoading = true
      const member_res = await this.$simpleAsyncTo(
        getAllUsers(),
        '获取所有成员失败'
      )
      if (member_res) {
        this.member_info = member_res.data
        this.addMemberLoading = false
      }
    },
    addMemberChange(v) {
      this.addSelectionList = v
    },
    async submitAddMember() {
      if (this.addSelectionList.length === 0) {
        return this.$message({type: 'warning', message: '请选择添加的成员'})
      }
      let add_ids = ''
      this.addSelectionList.forEach(e => {
        add_ids += e.id + ','
      })
      const params = {
        user_id: add_ids.substring(0, add_ids.length - 1),
        project_id: this.project.project_id
      }
      this.globalLoading()
      const res = await this.$simpleAsyncTo(addUsers(params), '添加成员失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '添加成员成功'
        })
        this.AddMemberVisible = false
        this.getUserList()
      }
      this.globalLoading().close()
    },
    submitHandle() {
      this.MemberManageVisible = false
      this.close('refresh')
    },
    close(fn) {
      this.$emit('closeMemberManage', fn)
    }
  }
}
</script>
<style lang="scss">
.already-add {
  .operation {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    margin-top: 2px;
    background-color: $grey10;
    box-shadow: 0 -1px 2px $grey6;
    .del {
      cursor: pointer;
      > span {
        margin-left: 5px;
      }
    }
  }
  .active {
    color: $grey5;
    cursor: no-drop;
  }
  .pointer {
    cursor: pointer;
  }
}
</style>
