<template>
  <section class="server-group">
    <header class="flex-layout mb-20 header">
      <span>分组</span>
      <el-button type="primary" @click="newBuildGroup">新建分组</el-button>
    </header>
    <CardTabs
      :tabs="tabs"
      headBorder
      v-model="activeName"
      @tab-click="tabClick"
      class="group-tab">
        <el-table
          :data="tableData"
          style="width: 100%"
          v-loading="!!loading">
          <el-table-column
            label="分组名称">
            <template slot-scope="scope">
              <div class="name">
                <OverflowTooltip class="width">{{scope.row.group_name}}</OverflowTooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="group_remark"
            label="描述">
            <template slot-scope="scope">
              <OverflowTooltip class="width">{{scope.row.group_remark}}</OverflowTooltip>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="create_time"
            label="创建时间">
            <template slot-scope="scope">
              <OverflowTooltip class="width">{{scope.row.create_time}}</OverflowTooltip>
            </template>
          </el-table-column> -->
          <el-table-column
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="editRow(scope.row)"
                type="text"
                size="small">
                <i class="el-icon-edit-outline mr-20" style="font-size:16px;"></i>
              </el-button>
              <SimpleConfirm @confirm="handleDeleteDatasource(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </CardTabs>
    <el-dialog
      :title="`${title}分组`"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}">
      <el-form :model="form" label-width="100px" :rules="formRules" ref="form">
        <el-form-item label="分组名称" prop="group_name">
          <el-input v-model="form.group_name" autocomplete="off" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="group_remark">
          <el-input type="textarea" v-model="form.group_remark"  maxlength="2000" show-word-limit rows="10"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitHandle">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import pager from '@/mixins/pager'
import {mapGetters} from 'vuex'
import {
  getApiGroup,
  getAppGroup,
  getSaveGroupp,
  getAddAppGroup,
  getEditGroupp,
  getEditAppGroup,
  getDelGroup,
  getDeleteAppGroup
} from '@/api/server/server.js'
import CardTabs from '@c/card-tabs'
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'ServerGroup',
  components: {
    CardTabs,
    OverflowTooltip
  },
  mixins: [pager],
  computed: {
    ...mapGetters(['project'])
  },
  data() {
    return {
      tableData: [],
      loading: 0,
      title: '新建',
      visible: false,
      id: '',
      form: {
        group_name: '',
        group_remark: ''
      },
      formRules: {
        group_name: [
          {required: true, message: '请输入分组名称'},
          {
            pattern: /^[\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z\d]+$/,
            message: '分组名称至多50个字符，允许中文、数字、字母, 不能以数字开头',
            trigger: ['blur', 'change']
          }
        ],
        group_remark: [
          {required: true, message: '请输入描述'}
        ]
      },
      activeName: 'service',
      tabs: [
        {label: '服务单元', key: 'service'},
        {label: '应用', key: 'app'}
      ]
    }
  },
  created() {
    this.getGroupList()
  },
  methods: {
    tabClick(tab) {
      this.activeName = tab.key
      this.getGroupList()
    },
    async getGroupList() {
      this.loading++
      let params = {}, fn = null
      if (this.activeName === 'service') {
        params.id = this.project.project_id
        fn = getApiGroup
      } else {
        fn = getAppGroup
      }
      const res = await this.$simpleAsyncTo(fn(params), '获取分组列表失败')
      if (res) {
        this.tableData = res.data
      }
      this.loading--
    },
    newBuildGroup() {
      if (this.activeName === 'service') {
        this.title = '新建服务单元'
      } else {
        this.title = '新建应用'
      }
      this.visible = true
    },
    editRow(row) {
      if (this.activeName === 'service') {
        this.title = '编辑服务单元'
      } else {
        this.title = '编辑应用'
      }
      this.visible = true
      this.$nextTick(_ => {
        this.form.group_name = row.group_name
        this.form.group_remark = row.group_remark
        this.id = row.id
      })
    },
    submitHandle() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.globalLoading()
          let params = {}, fn = null
          if (this.title.indexOf('新建') > -1) {
            if (this.activeName === 'service') {
              params = {...this.form, project_id: this.project.project_id}
              fn = getSaveGroupp
            } else {
              params = {...this.form}
              fn = getAddAppGroup
            }
          } else {
            if (this.activeName === 'service') {
              params = {...this.form, id: this.id}
              fn = getEditGroupp
            } else {
              params = {...this.form, id: this.id}
              fn = getEditAppGroup
            }
          }
          const res = await this.$simpleAsyncTo(fn(params), `${this.title}失败`)
          if (res) {
            this.$message({
              type: 'success',
              message: `${this.title}分组成功`
            })
          }
          this.close()
          this.getGroupList()
          this.globalLoading().close()
        }
      })
    },
    close() {
      this.$refs['form'].resetFields()
      // this.form.group_name = ''
      // this.form.group_remark = ''
      this.visible = false
    },
    async handleDeleteDatasource(row) {
      let fn
      if (this.activeName === 'service') {
        fn = getDelGroup
      } else {
        fn = getDeleteAppGroup
      }
      const res = await this.$simpleAsyncTo(fn({id: row.id}), '删除失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }
      this.getGroupList()
    }
  }
}
</script>

<style lang="scss">
.server-group {
  .header {
    justify-content: space-between;
  }
  .group-tab {
    background: $grey10;
    .el-tabs__nav-scroll {
      padding: 0 20px;
    }
    .el-tabs__content {
      // padding: 0 20px;
    }
  }
}
</style>
