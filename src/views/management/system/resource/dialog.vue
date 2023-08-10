<!--
 * @Author: 大炸鹅
 * @Date: 2023-07-05 20:21:06
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-24 15:28:22
 * @FilePath: \智能数据构建\src\views\management\resource\dialog.vue
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="65%"
    @close="close"
    v-loading="loading"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm" label-suffix="：">
      <el-form-item label="资源组名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入资源组名称"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="ownerUserId">
        <el-select v-model="ruleForm.ownerUserId" placeholder="请选择负责人">
          <el-option :label="item.label" :value="item.value" v-for="item in operUserOptions" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="调度资源" required>
        <el-col :span="11">
          <el-form-item prop="cpuVcores">
            <div>
              <span class="mr-5">CPU</span>
              <span class="mr-5">
                <el-input-number
                  style="width:85px;"
                  v-model="ruleForm.cpuVcores"
                  controls-position="right"
                  placeholder=" "
                  :min="1"
                  :max="defaultCpuAndMemory.cpuAssignablePercent"
                ></el-input-number>
              </span>
              <span>%{{defaultCpuAndMemory.cpuAssignableDesc}}</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="memoryMb">
            <div>
              <span class="mr-5">内存</span>
              <span class="mr-5">
                <el-input-number
                  style="width:85px;"
                  v-model="ruleForm.memoryMb"
                  controls-position="right"
                  placeholder=" "
                  :min="1"
                  :max="defaultCpuAndMemory.memoryAssignablePercent"
                ></el-input-number>
              </span>
              <span>%{{defaultCpuAndMemory.memoryAssignableDesc}}</span>
            </div>
          </el-form-item>
        </el-col>
      </el-form-item>
      
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="应用场景" required>
        <el-col :span="24">
          <el-form-item prop="applyFor">
            <el-radio-group v-model="ruleForm.applyFor" style="width:100%">
              <el-col :span="24" class="mb-10" style="display:flex;align-items:center">
                <el-radio label="DAILY_TASK_RUN">任务日常调度</el-radio>
                <el-select v-model="project" placeholder="请选择可使用当前资源组的关联项目" :disabled="ruleForm.applyFor !== 'DAILY_TASK_RUN'" multiple>
                  <el-option :label="item.label" :value="item.value" v-for="item in projectrOptions" :key="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="24">
                <el-radio label="BATCH_OMO">批量运维操作</el-radio>
                <span style="color: rgba(0,0,0,0.4);font-size:12px">可在临时运维操作时切换为此类型资源组，如批量补数据</span>
              </el-col>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24"></el-col>
      </el-form-item>
      <div class="tips">
        <div>
          <i class="iconfont icon-tip"></i>
        </div>
        <div>
          <p>1. 指定使用当前资源组的任务，如果下发时当前资源组已经被停用或删除，将自动切换为租户默认资源组</p>
          <p>2. 修改后的配置生效可能需要一段时间 (预计5分钟)，请耐心等待。</p>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  addResourceGroup,
  getTenantDefaultResource,
  getProjectList,
  getEditResourceGroup,
  saveEditResourceGroup
} from '@/api/management/resource'
export default {
  name: 'ResourceDialog',
  props: {
    title: String,
    operUserOptions: Array,
    defaultData: Object,
    type: String,
    id: [String, Number]
  },
  data() {
    return {
      dialogVisible: true,
      ruleForm: {
        name: '',
        ownerUserId: '',
        cpuVcores: '',
        memoryMb: '',
        description: '',
        applyFor: '1'
      },
      project: '',
      projectrOptions: [],
      // ownerUserOptions: [],
      rules: {
        name: [
          { required: true, message: '请输入资源组名称', trigger: 'blur' }
        ],
        ownerUserId: [
          { required: true, message: '请选择负责人', trigger: 'change' }
        ],
        cpuVcores: [
          { required: true, message: '请输入调度资源', trigger: 'blur' }
        ],
        memoryMb: [
          { required: true, message: '请输入调度资源', trigger: 'blur' }
        ],
      },
      loading: false,
      defaultCpuAndMemory: {},
      oninput: null,
      oninputMemory: null
    }
  },
  async created() {
    this._getProjectList()
    await this._getTenantDefaultResource()
    if (this.type === 'edit') {
      this._getEditResourceGroup()
    }
    // this.oninput = (e) => {
    //   if (e.target.value > this.defaultCpuAndMemory.cpuAssignablePercent) {
    //     e.target.value = this.defaultCpuAndMemory.cpuAssignablePercent
    //   }
    //   if (e.target.value < 1) {
    //     e.target.value = 1
    //   }
    // }
    this.oninput = `if(value){value=value.replace(/[^\d||/.]/g,'')} if(value > 100) {value=100}`
    this.oninputMemory = (e) => {
      if (e.target.value > this.defaultCpuAndMemory.memoryAssignablePercent) {
        e.target.value = this.defaultCpuAndMemory.memoryAssignablePercent
      }
      if (e.target.value < 1) {
        e.target.value = 1
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    save() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.type === 'add') {
            this._addResourceGroup()
          } else {
            this._saveEditResourceGroup()
          }
        }
      })
    },

    // 新增资源组
    async _addResourceGroup() {
      const params = {
        name: this.ruleForm.name,
        ownerUserId: this.ruleForm.ownerUserId,
        cpuPercent: this.ruleForm.cpuVcores,
        memoryPercent: this.ruleForm.memoryMb,
        description: this.ruleForm.description,
        applyFor: this.ruleForm.applyFor,
        projects: this.project,
        resId: this.defaultData.id
      }
      if (this.ruleForm.applyFor === 'BATCH_OMO') {
        delete params.projects
      }
      const res = await this.$simpleAsyncTo(addResourceGroup(params), '保存失败')
      if (res) {
        this.$message.success('保存成功')
        this.$emit('close', 'refresh')
        this.close()
      }
    },
    // 获取租户资源组剩余cpu和内存
    async _getTenantDefaultResource() {
      this.loading = true
      const params = {
        tenantId: 'admin'
      }
      if (this.id) {
        params.id = this.id
      }
      const res = await this.$simpleAsyncTo(getTenantDefaultResource(params), '获取租户资源组剩余cpu和内存失败')
      if (res) {
        this.defaultCpuAndMemory = res.data
      }
      this.loading = false
    },
    // 获取项目列表
    async _getProjectList() {
      const res = await this.$simpleAsyncTo(getProjectList(), '获取项目列表失败')
      if (res) {
        this.projectrOptions = res.data.map(item => {
          return {
            label: item.project_name,
            value: item.project_id
          }
        })
      }
    },
    // 获取编辑信息
    async _getEditResourceGroup() {
      const res = await this.$simpleAsyncTo(getEditResourceGroup({id: this.id}), '获取编辑信息失败')
      if (res) {
        this.ruleForm.name = res.data.name
        this.ruleForm.ownerUserId = res.data.ownerUserId
        this.ruleForm.cpuVcores = res.data.cpuPercent
        this.ruleForm.memoryMb = res.data.memoryPercent
        this.ruleForm.description = res.data.description
        this.ruleForm.applyFor = res.data.applyFor
        this.project = res.data.projects
        this.ruleForm.id = res.data.id
        this.ruleForm.resId = res.data.resId
      }
    },
    // 保存编辑信息
    async _saveEditResourceGroup() {
      const params = {
        name: this.ruleForm.name,
        ownerUserId: this.ruleForm.ownerUserId,
        cpuPercent: this.ruleForm.cpuVcores,
        memoryPercent: this.ruleForm.memoryMb,
        description: this.ruleForm.description,
        applyFor: this.ruleForm.applyFor,
        projects: this.project,
        resId: this.ruleForm.resId,
        id: this.ruleForm.id
      }
      if (this.ruleForm.applyFor === 'BATCH_OMO') {
        delete params.projects
      }
      const res = await this.$simpleAsyncTo(saveEditResourceGroup(params), '保存失败')
      if (res) {
        this.$message.success('保存成功')
        this.$emit('close', 'refresh')
        this.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
  display: flex;
  align-items: center;
  margin-top: 20px;
  background: #E7F0FD;
  margin-bottom: 20px;
  padding: 10px 20px;
  user-select: none;
  .icon-tip {
    font-size: 20px;
    color: #ff9900;
    margin-right: 10px;
  }
  p {
    font-size: 12px;
    color: rgba(0,0,0,0.65);
    margin-bottom: 5px;
  }
}
</style>