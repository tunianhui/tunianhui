<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:44:16
 * @LastEditTime: 2023-08-07 13:50:32
 * @Description:
-->

<template>
  <section class="security-wrapper">
    <div class="dp-page-layout">
      <div class="dp-page-header-filters">
        <div class="head mb-10">
          <div class="flex">
            <div class="page-title mr-20">密钥管理</div>
          </div>
          <div>
            <div class="flex top-right">
              <el-input v-model="form.secretKeyName" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入密钥名或描述" class="ml-10 mr-10"></el-input>
              <el-button @click="handleFilter" icon="iconfont icon-filter">筛选</el-button>
              <el-button @click="showIntroduce" class="ml-10"><i class="el-icon-question"></i>{{showIntroduceBox ? '收起':'说明'}}</el-button>
              <el-button type="primary" @click="registerKey">注册密钥</el-button>
              <el-button class="ml-10" icon="el-icon-refresh-right" @click="getTableList()"></el-button>
            </div>
          </div>
        </div>

        <div v-if="showIntroduceBox" class="introduce-wrapper">
          <div class="title">
            <span>密钥使用说明</span>
            <i class="iconfont icon-shousuoshangjiantou" @click="showIntroduceBox = false"></i>
          </div>
          <el-divider></el-divider>
          <div class="introduce">
            <div class="list-wrapper" v-for="(item, index) in list" :key="index">
              <div style="width: 100%">
                <div class="type"><i class="iconfont icon-font icon-shousuo"></i>{{item.type}}</div>
                <div class="content">{{item.content}}</div>
              </div>
              <el-divider direction="vertical" v-if="index < list.length - 1"></el-divider>
            </div>
          </div>
        </div>

        <div v-show="showCondition" class="condition-wrapper mb-10">
          <el-form :model="form" inline class="form" label-width="90px">
            <el-form-item label="密钥类型" class="form-item">
              <el-checkbox-group v-model="form.secretKeyType">
                <el-checkbox v-for="(item, index) in secretTypeList" :label="item.value" :key="index">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="加解密算法" class="form-item">
              <el-select v-model="form.algoType" multiple placeholder="请选择密钥类型">
                <el-option v-for="item in algoTypeList" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生成方式" class="form-item">
              <el-checkbox-group v-model="form.generationType">
                <el-checkbox v-for="(item, index) in generationTypeList" :label="item.value" :key="index">
                  {{item.name}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="负责人" class="form-item">
              <el-select v-model="form.owner" multiple placeholder="请选择负责人">
                <el-option v-for="item in ownerList" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div v-if="form.secretKeyType.length || form.algoType.length || form.generationType.length || form.owner.length" class="select-wrapper">
            <el-tag v-if="form.secretKeyType.length" size="mini" class="mr-5" closable @close="handleClose('1')">密钥类型：{{form.secretKeyType.join('、')}}</el-tag>
            <el-tag v-if="form.algoType.length" size="mini" class="mr-5" closable @close="handleClose('2')">加解密算法：{{form.algoType.join('、')}}</el-tag>
            <el-tag v-if="form.generationType.length" size="mini" class="mr-5" closable @close="handleClose('3')">生成方式：{{form.generationType.join('、')}}</el-tag>
            <el-tag v-if="form.owner.length" size="mini" class="mr-5">负责人：{{form.owner.join('、')}}</el-tag>
          </div>
        </div>
      </div>
      <div class="dp-table-layout">
        <el-table ref="multipleTable" :data="tableData" height="100%" style="width: 100%;" v-loading="!!loading">
          <el-table-column prop="secretKeyName" label="密钥名称">
            <template slot-scope="{row}">
              <div class="keyName">
                <span class="icon iconfont icon-yuechi iconBg"></span>
                <span class="ml-10">{{ row.secretKeyName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="secretKeyTypeName" label="密钥类型"> </el-table-column>
          <el-table-column prop="algoType" label="加解密算法"> </el-table-column>
          <el-table-column prop="generationTypeName" label="生成方式"></el-table-column>
          <el-table-column prop="owner" label="负责人"></el-table-column>
          <el-table-column prop="createdDate" label="创建时间"></el-table-column>
          <el-table-column prop="remarks" label="密钥描述"> </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row}">
              <el-tooltip class="item" effect="dark" content="查看秘钥值" placement="top">
                <el-button type="text" @click="handleCheck(row)"><i class="el-icon-set-up font-14 color-btn"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="引用" placement="top">
                <el-button type="text" @click="handleCheck2(row)"><i class="iconfont icon-shujutancha font-16 color-btn"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="权限管理" placement="top">
                <el-button type="text" @click="handleAuthorize(row)"><i class="iconfont icon-shouquan1 font-14 color-btn"></i></el-button>
              </el-tooltip>
              <el-button type="text" icon="iconfont icon-gengduo font-14 color-btn" v-popover:morepopover slot="reference">
                <el-popover popper-class="more-popover" placement="bottom" trigger="hover" ref="morepopover">
                  <ul class="popper-list">
                    <li @click="handleEditKey(row.secretKeyId)">
                      <i class="el-icon-edit-outline font-14 color-btn mr-10"></i>
                      <span>编辑</span>
                    </li>
                    <li @click="changeOwner(row)">
                      <i class="iconfont icon-zhuanjiao font-14 color-btn mr-10"></i>
                      <span>转交</span>
                    </li>
                    <li @click="handleDelKey(row)">
                      <i class="el-icon-delete font-14 color-btn mr-10"></i>
                      <span>删除</span>
                    </li>
                  </ul>
                </el-popover>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <SelectFooter :tableData="tableData" :totalNum="total" @sendTableList="sendTableList"></SelectFooter>

    <!-- 注册密钥 -->
    <el-dialog :title="keyTitle" :visible.sync="keyDialogVisible" width="35%" :close-on-click-modal="false">
      <el-form :model="form2" ref="keyForm" label-width="100px" :rules="rules">
        <el-form-item label="密钥名称" prop="secretKeyName">
          <el-input v-model="form2.secretKeyName"></el-input>
        </el-form-item>
        <el-form-item label="密钥类型" prop="secretKeyType">
          <el-radio-group v-model="form2.secretKeyType">
            <el-radio v-for="(item, index) in secretTypeList" :label="item.value" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="加解密算法" prop="algoType">
          <el-select v-model="form2.algoType">
            <el-option v-for="item in algorithmList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密钥长度" prop="algoKeyLength">
          <el-select v-model="form2.algoKeyLength">
            <el-option v-for="(item, index) in keyLenList" :key="index" :label="`${item}字节`" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生成方式" prop="generationType">
          <el-radio-group v-model="form2.generationType">
            <el-radio v-for="(item, index) in generationTypeList" :key="index" :label="item.value">
              {{item.name}}
              <el-button v-if="index === 0 && form2.secretKeyId" type="text" icon="el-icon-refresh-right" @click="form2.refresh = 1">刷新秘钥值</el-button>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="form2.generationType === 'user_generation'">
          <template v-if="form2.secretKeyType === 'asymmetric'">
            <el-form-item label="公钥" prop="secretEntityPubKey">
              <el-input type="textarea" v-model="form2.secretEntityPubKey" placeholder="请输入公钥" :rows="3" maxlength="256" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="私钥" prop="secretEntityPrivKey">
              <el-input type="textarea" v-model="form2.secretEntityPrivKey" placeholder="请输入私钥" :rows="3" maxlength="256" show-word-limit></el-input>
            </el-form-item>
          </template>
          <template v-if="form2.secretKeyType === 'symmetric'">
            <el-form-item label="秘钥" prop="secretEntityPrivKey">
              <el-input type="textarea" v-model="form2.secretEntityPrivKey" placeholder="请输入密钥" :rows="3" maxlength="32" show-word-limit></el-input>
            </el-form-item>
          </template>
        </template>
        <el-form-item label="密钥描述" prop="remarks">
          <el-input type="textarea" v-model="form2.remarks" placeholder="请输入密钥描述" :rows="3" maxlength="128" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="keyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleKeySure">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 转交责任人 -->
    <el-dialog title="转交责任人" :visible.sync="ownerEditVisible" width="25%" :close-on-click-modal="false">
      <el-form :model="ownerForm" ref="ownerFormRef" label-width="100px" :rules="ownerRules">
        <el-form-item label="转交对象" prop="owner">
          <el-select v-model="ownerForm.owner" placeholder="请选择转交对象">
            <el-option v-for="item in ownerList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ownerEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOwnerSure">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看任务引用 -->
    <el-dialog :title="taskReferenceTitle" :visible.sync="taskReferenceVisible" width="1000px" :close-on-click-modal="false">
      <div class="task-title-wrapper">
        <div class="title">任务引用记录</div>
        <el-input v-model="taskForm.taskName" prefix-icon="el-icon-search" clearable placeholder="请输入任务名称" class="input"></el-input>
      </div>
      <div class="task-wrapper">
        <el-form :model="taskForm" inline class="form" label-width="90px">
          <el-form-item label="任务类型" class="form-item">
            <el-checkbox-group v-model="taskForm.taskType">
              <el-checkbox v-for="(item, index) in taskTypeList" :label="item.value" :key="index">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="操作类型" class="form-item">
            <el-checkbox-group v-model="taskForm.operationType">
              <el-checkbox v-for="(item, index) in operationTypeList" :label="item.value" :key="index">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData2" v-loading="!!loading2" style="width: 100%">
        <el-table-column prop="taskName" label="任务名称"> </el-table-column>
        <el-table-column prop="unitName" label="数据板块"> </el-table-column>
        <el-table-column prop="projectName" label="项目"></el-table-column>
        <el-table-column prop="taskTypeName" label="任务类型"></el-table-column>
        <el-table-column prop="operationTypeName" label="操作类型"></el-table-column>
        <el-table-column prop="owner" label="负责人"> </el-table-column>
      </el-table>
      <div class="flex-end">
        <el-pagination class="pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total2"></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="taskReferenceVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 查看密钥 -->
    <el-dialog :title="secretKeyTitle" :visible.sync="showSecretKeyVisible" width="420px" :close-on-click-modal="false">
      <div class="mb-10">
        <span class="mr-10">密钥</span>
        <el-input v-model="secretKey" show-password style="width: 300px"></el-input>
        <el-button type="text" @click="copySecretKey" class="ml-10"><i class="icon-fuzhi iconfont font-14"></i></el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSecretKeyVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getEncryptAlgorithmInfo,
  getGenerationType,
  getSecretTypeData,
  getSecretKeysData,
  saveSecretKey,
  watchSecretKey,
  getTaskReferences,
  updateSecretKeyOwner,
  delSecretKey,
  securityRoleUsers,
  getSecretParam,
  getSecretKeyById,
  getTaskTypeData,
  getOperationTypeData
} from '@/api/asset/security.js'
import pager from '@/mixins/pager'
import SelectFooter from '@c/footer-simple'
export default {
  name: 'KeyManage',
  components: {
    SelectFooter
  },
  mixins: [pager],
  data () {
    return {
      showIntroduceBox: false,
      showCondition: false,
      loading: 0,
      loading2: 0,
      tableData: [],
      tableData2: [],
      total2: '',
      ownerEditVisible: false,
      taskReferenceVisible: false,
      taskReferenceTitle: '',
      showSecretKeyVisible: false,
      secretKeyTitle: '查看密钥值',
      secretKey: '',
      form: {
        secretKeyName: '',
        secretKeyType: [],
        algoType: [],
        generationType: [],
        owner: []
      },
      taskForm: {
        taskType: [],
        operationType: []
      },
      keyTitle: '',
      form2: {},
      ownerForm: {},
      rules: {
        secretKeyName: [
          { required: true, message: '请输入密钥名称', trigger: 'blur' }
        ],
        secretKeyType: [
          { required: true, message: '请选择密钥类型', trigger: 'change' }
        ],
        algoType: [
          { required: true, message: '请选择加解密算法', trigger: 'change' }
        ],
        algoKeyLength: [
          { required: true, message: '请选择密钥长度', trigger: 'change' }
        ],
        generationType: [
          { required: true, message: '请选择生成方式', trigger: 'change' }
        ],
        secretEntityPubKey: [
          { required: true, message: '请输入公钥', trigger: 'blur' }
        ],
        secretEntityPrivKey: [
          { required: true, message: '请输入私钥', trigger: 'blur' }
        ],
        remarks: [
          { required: true, message: '请输入密钥描述', trigger: 'blur' }
        ]
      },
      ownerRules: {
        owner: [
          { required: true, message: '请选择转交对象', trigger: 'change' }
        ]
      },
      list: [
        {
          type: '概念说明',
          content: '密钥是特殊脱敏算法的必填参数，常用于加盐哈希脱敏和加解密算法。'
        },
        {
          type: '密钥类型 哈希脱敏密钥',
          content: '用于加盐哈希脱敏算法（如加盐md5），没有严格的格式要求，一般多种加盐哈希脱敏算法可以使用同一个密钥。'
        },
        {
          type: '密钥类型 加解密密钥',
          content: '用于加解密算法（如AES），有比较严格的格式要求（比如长度要求），一般不同的算法不可以混用。'
        },
        {
          type: '使用建议',
          content: '为了防止密钥的泄漏和管理的不可控性，除了公共层数据外，建议每个项目注册自己的密钥并使用，不建议密钥跨项目或者给过多用户使用。'
        }
      ],
      generationTypeList: [],
      algoTypeList: [],
      algorithmList: [],
      keyLenList: [],
      keyDialogVisible: false,
      secretTypeList: [],
      ownerList: [],
      taskTypeList: [],
      operationTypeList: []
    }
  },
  mounted () {
    this.getTableList()
    this.getSecretTypeList()
    this.getGenerationTypeList()
    this.getSecurityRoleUsers()
    this.getTaskTypeList()
    this.getOperationTypeList()
  },
  watch: {
    form: {
      deep: true,
      handler (val) {
        this.getTableList()
      }
    },
    taskForm: {
      deep: true,
      handler (val) {
        this.getTaskReferencesList()
      }
    },
    'form.secretKeyType': {
      handler (val) {
        if (val) {
          const secretKeyType = `${val}`
          this.getAlgoTypeList(secretKeyType)
        } else {
          this.algoTypeList = []
        }
      }
    },
    'form2.secretKeyType': {
      immediate: true,
      handler (val) {
        if (val) {
          this.getAlgorithmTypeList(val)
        }
      }
    },
    'form2.algoType': {
      immediate: true,
      handler (val) {
        if (val) {
          this.getKeyLength(val)
        }
      }
    }
  },
  methods: {
    searchChange (val) {
      this.getTableList()
    },

    sendTableList (val) {
      this.pageFilters = val
      this.getTableList()
    },

    handleClose (tag) {
      if (tag === '1') {
        this.form.secretKeyType = []
      } else if (tag === '2') {
        this.form.algoType = []
      } else {
        this.form.generationType = []
      }
    },

    async getTaskTypeList () {
      const res = await getTaskTypeData()
      if (res) {
        this.taskTypeList = res.data
      }
    },

    async getOperationTypeList () {
      const res = await getOperationTypeData()
      if (res) {
        this.operationTypeList = res.data
      }
    },

    async getTaskReferencesList () {
      const params = JSON.parse(JSON.stringify(this.taskForm))
      params.taskType = `${params.taskType}`
      params.operationType = `${params.operationType}`
      params.pageNo = this.pageFilters.pageNo
      params.pageSize = this.pageFilters.pageSize
      this.loading2++
      const res = await getTaskReferences(params)
      if (res) {
        this.tableData2 = res.data.totalList
        this.total2 = res.data.total
        this.loading2--
      }
    },

    async getSecurityRoleUsers () {
      const res = await securityRoleUsers()
      if (res) {
        this.ownerList = res.data
      }
    },

    async getKeyLength (algoType) {
      this.keyLenList = []
      const res = await getSecretParam({ algoType })
      if (res && res.data && res.data.algoKeyLength) {
        this.keyLenList = res.data.algoKeyLength.split(',')
      }
    },

    async getTableList () {
      this.loading++
      const params = JSON.parse(JSON.stringify(this.form))
      const { secretKeyType, algoType, generationType, owner } = this.form
      params.secretKeyType = `${secretKeyType}`
      params.algoType = `${algoType}`
      params.generationType = `${generationType}`
      params.owner = `${owner}`
      params.pageNo = this.pageFilters.pageNo
      params.pageSize = this.pageFilters.pageSize
      const res = await getSecretKeysData(params)
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
      this.loading--
    },

    async getSecretTypeList () {
      const res = await getSecretTypeData()
      if (res) {
        this.secretTypeList = res.data
      }
    },

    async getGenerationTypeList () {
      const res = await getGenerationType()
      if (res) {
        this.generationTypeList = res.data
      }
    },

    async getAlgoTypeList (secretKeyType) {
      const res = await getEncryptAlgorithmInfo({ secretKeyType })
      if (res) {
        this.algoTypeList = res.data
      }
    },

    async getAlgorithmTypeList (secretKeyType) {
      const res = await getEncryptAlgorithmInfo({ secretKeyType })
      if (res) {
        this.algorithmList = res.data
        if (res.data && res.data.length) {
          this.$set(this.form2, 'algoType', res.data[0].value)
        } else {
          this.$set(this.form2, 'algoType', '')
        }
      }
    },

    changeOwner (row) {
      this.ownerForm = {
        secretKeyId: row.secretKeyId
      }
      this.ownerEditVisible = true
      this.$nextTick(() => {
        this.$refs['ownerFormRef'].clearValidate()
      })
    },

    handleOwnerSure () {
      this.$refs.ownerFormRef.validate(valid => {
        if (valid) {
          this.updateOwner()
        }
      })
    },

    async updateOwner () {
      const res = await updateSecretKeyOwner(this.ownerForm)
      if (res) {
        this.$message({
          type: 'success',
          message: '转交成功!'
        })
        this.ownerEditVisible = false
        this.getTableList()
      }
    },

    // 传权限列表名称 --> 密钥权限
    handleAuthorize (row) {
      const { secretKeyId, secretKeyName } = row
      this.$router.push({ path: '/asset/safety-new/power-manage/key', query: { secretKeyId, secretKeyName } })
    },

    // 查看引用
    handleCheck2 (row) {
      this.taskReferenceVisible = true
      this.taskReferenceTitle = `查看任务引用：${row.secretKeyName}`
      this.taskForm.secretKeyId = row.secretKeyId
      this.getTaskReferencesList()
    },

    // 查看秘钥值
    handleCheck (row) {
      this.$confirm(`查看秘钥属于高度敏感行为！会生成审计日志, 确认查看吗?`, '确认查看秘钥值', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.showSecretKey(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },

    async showSecretKey (row) {
      const res = await watchSecretKey({ secretKeyId: row.secretKeyId, secretKeyName: row.secretKeyName })
      if (res) {
        this.secretKeyTitle = `查看密钥值：${row.secretKeyName}`
        this.secretKey = res.data.secretEntityPrivKey
        this.showSecretKeyVisible = true
      }
    },

    copySecretKey () {
      this.copyToClipboard(this.secretKey)
    },

    copyToClipboard (text) {
      let transfer = document.createElement('input')
      document.body.appendChild(transfer)
      transfer.value = text // 想要复制的内容
      transfer.focus()
      transfer.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
      }
      transfer.blur()
      this.$message({
        message: '已复制到剪切板',
        type: 'success'
      })
      document.body.removeChild(transfer)
    },

    handleDelKey (row) {
      this.$confirm(`确认删除密钥, ${row.secretKeyName} 吗?`, '删除密钥', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitDel(row.secretKeyId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    async submitDel (secretKeyId) {
      const res = await delSecretKey({ secretKeyId })
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getTableList()
      }
    },

    async handleEditKey (secretKeyId) {
      const res = await getSecretKeyById({ secretKeyId })
      if (res) {
        this.keyTitle = '编辑秘钥'
        this.form2 = res.data
        this.form2.refresh = 0
        this.keyDialogVisible = true
        this.$nextTick(() => {
          this.$refs['keyForm'].clearValidate()
        })
      }
    },

    registerKey () {
      this.form2 = {
        secretVersion: 0,
        secretKeyType: 'symmetric',
        generationType: 'system_generation'
      }
      this.keyTitle = '注册秘钥'
      this.keyDialogVisible = true
      this.$nextTick(() => {
        this.$refs['keyForm'].clearValidate()
      })
    },

    handleKeySure () {
      this.$refs.keyForm.validate(valid => {
        if (valid) {
          this.submitEdit()
        }
      })
    },

    async submitEdit () {
      const res = await saveSecretKey(this.form2)
      if (res) {
        const msg = this.form2.secretKeyId ? '修改成功' : '注册成功'
        this.$message({
          type: 'success',
          message: msg
        })
        this.keyDialogVisible = false
        this.getTableList()
      }
    },

    handleFilter () {
      this.showCondition = !this.showCondition
      this.showIntroduceBox = false
    },
    showIntroduce () {
      this.showIntroduceBox = !this.showIntroduceBox
      this.showCondition = false
    }
  }
}
</script>

<style lang="scss" scoped>
.select-wrapper {
  border-top: 1px solid #ebebeb;
  padding-top: 12px;
}
.condition-wrapper {
  background-color: #fff;
  padding: 20px 30px;
  :deep(.el-form) {
    .el-form-item__content {
      width: calc(100% - 90px);
      border-left: 1px solid #dcdfe6;
      padding-left: 10px;
      .el-select {
        width: 100%;
        .el-input__inner {
          border: none;
        }
      }
    }
  }
}

.task-wrapper {
  :deep(.el-form) {
    .el-form-item {
      width: 48.5%;
    }
    .el-form-item__content {
      width: calc(100% - 90px);
      border-left: 1px solid #dcdfe6;
      padding-left: 10px;
    }
  }
}

.task-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  .title {
    font-size: 18px;
    font-weight: bold;
  }
  .input {
    width: 200px;
  }
}

.security-wrapper {
  position: relative;
  height: 100%;
  .form-item {
    width: 49%;
    border: 1px solid #dcdfe6;
    padding: 0 10px;
    height: 34px;
    line-height: 28px;
  }
  .head {
    display: flex;
    justify-content: space-between;
    padding-bottom: 2px;
    border-bottom: 1px solid #d9d9d9;
    .top-right {
      align-items: center;
      .el-input {
        .el-input__inner {
          height: 32px !important;
          line-height: 32px !important;
        }
        .el-input__icon {
          line-height: 32px !important;
        }
      }
    }
  }
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .keyName {
    display: flex;
    align-items: center;
    .iconBg {
      background: #2358fe;
      color: #fff;
    }
  }
}
</style>
