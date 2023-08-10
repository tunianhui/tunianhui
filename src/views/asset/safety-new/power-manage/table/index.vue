<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-05-26 09:27:22
 * @LastEditTime: 2023-06-08 11:42:22
 * @Description:
-->
<template>
  <div class="table-apply">
    <div v-if="showHome">
      <Header :tabs="tabs" :active="activeTab" title="表权限管理" @tab-click="tab => activeTab = tab.name">
        <div class="actions">
          <template v-if="activeTab === '1'">
            <el-button type="primary" icon="iconfont icon-shenqingquanxian font-14 mr-5" @click="handleAuthorize">批量授权</el-button>
            <el-button type="plain" icon="iconfont icon-shenqingquanxian font-14 mr-5" @click="handleRecovery">批量回收</el-button>
          </template>
          <el-button><i class="el-icon-refresh-right"></i></el-button>
        </div>
      </Header>

      <Manage v-if="activeTab === '1'" @showDetail="showDetail"></Manage>

      <Record v-if="activeTab === '2'" @showDetail="showDetail"></Record>
    </div>

    <div v-else>
      <detail @close="jump"></detail>
    </div>

    <!-- 批量授权 -->
    <el-dialog title="批量授权" :visible.sync="showAuthorize">
      <el-form :model="formData" :rules="renewalRules" ref="formRef" label-width="120px">
        <el-form-item label="表类型" prop="tableType">
          <el-select v-model="formData.tableType" placeholder="请选择表类型">
            <el-option v-for="item in tableTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="环境" prop="environment">
          <el-select v-model="formData.environment" placeholder="请选择表类型">
            <el-option v-for="item in environmentList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表所在项目" prop="projectId">
          <el-select v-model="formData.projectId" placeholder="请搜索表所在的项目">
            <el-option v-for="item in projectList" :key="item.project_id" :label="item.project_name" :value="item.project_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请表名" prop="tableName">
          <el-select v-model="formData.tableName" multiple placeholder="请选择表" style="width:100%">
            <el-option v-for="item in tableNameList" :key="item.cube_id" :label="item.cube_code" :value="item.cube_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限类型" prop="auth_type">
          <el-checkbox-group v-model="formData.auth_type">
            <el-checkbox label="1">查表数据</el-checkbox>
            <el-checkbox label="2">改表数据</el-checkbox>
            <el-checkbox label="3">删除表</el-checkbox>
            <el-checkbox label="4">改表结构</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="授权原因" prop="reason">
          <el-input type="textarea" v-model="formData.reason" :rows="7" :maxlength="128" :minlength="5" resize="none" placeholder="请填写授权原因，不少于5个字" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAuthorize = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('formData')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 批量回收 -->
    <el-dialog title="批量回收" :visible.sync="showRecovery">
      <el-form :model="formData" :rules="renewalRules" ref="formRef" label-width="120px">
        <el-form-item label="表类型" prop="tableType">
          <el-select v-model="formData.tableType" placeholder="请选择表类型">
            <el-option v-for="item in tableTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="环境" prop="environment">
          <el-select v-model="formData.environment" placeholder="请选择表类型">
            <el-option v-for="item in environmentList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表所在项目" prop="projectId">
          <el-select v-model="formData.projectId" placeholder="请搜索表所在的项目">
            <el-option v-for="item in projectList" :key="item.project_id" :label="item.project_name" :value="item.project_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请表名" prop="tableName">
          <el-select v-model="formData.tableName" multiple placeholder="请选择表" style="width:100%">
            <el-option v-for="item in tableNameList" :key="item.cube_id" :label="item.cube_code" :value="item.cube_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回收原因" prop="reason">
          <el-input type="textarea" v-model="formData.reason" :rows="4" :maxlength="128" :minlength="5" resize="none" placeholder="请填写授权原因，不少于5个字" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRecovery = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('formData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from '../../mixins'
import Detail from './detail.vue'
import Manage from './manage.vue'
import Record from './record.vue'
import { getProjectList } from '@/api/rd/dev'
import { getTableTypeList, getLogicTables } from '@/api/asset/authority'
export default {
  name: 'TablePower',
  mixins: [mixin],
  components: {
    Detail,
    Manage,
    Record
  },
  data () {
    return {
      activeTab: '1',
      tabs: [
        {
          label: '管理权限',
          value: '1'
        },
        {
          label: '操作记录',
          value: '2'
        }
      ],
      showHome: true,
      showAuthorize: false,
      showRecovery: false,
      formData: {
        tableType: '物理表',
        environment: '生产环境',
        projectId: '',
        tableName: '',
        auth_type: [],
        field: '',
        applyReason: ''
      },
      renewalRules: {},
      // 表类型
      tableTypeList: [],
      // 环境
      environmentList: [
        {
          label: '生产环境',
          value: 'prod'
        },
        {
          label: '开发环境',
          value: 'dev'
        }
      ],
      projectList: [],
      // 表名
      tableNameList: []
    }
  },
  created () {
    this._getProjectList()
    this.getTableType()
    this.getTableNamesData()
  },
  methods: {
    // 表类型
    async getTableType () {
      const res = await getTableTypeList()
      if (res) {
        this.tableTypeList = res.data
      }
    },

    // 表名
    async getTableNamesData () {
      const res = await getLogicTables()
      if (res) {
        this.tableNameList = res.data
      }
    },

    // 所属项目
    async _getProjectList () {
      const params = {}
      const res = await getProjectList(params)
      if (res) {
        this.projectList = res.data
      }
    },

    handleAuthorize () {
      this.showAuthorize = true
    },

    handleRecovery () {
      this.showRecovery = true
    },

    submitForm (formData) {
      this.showAuthorize = false
      this.showRecovery = false
    },

    showDetail (row) {
      this.showHome = false
    },

    jump () {
      this.showHome = true
    }
  }
}
</script>

<style lang="scss" scoped>
.table-apply {
  height: 100%;
  position: relative;
  background: #ebeaef;
  > div {
    height: 100%;
    overflow-y: overlay;
    padding: 10px 15px 20px 15px;
  }
}
</style>
