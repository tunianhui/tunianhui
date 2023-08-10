<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-11 16:51:55
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-12 13:56:05
 * @FilePath: \数据智能构建\src\views\asset\standard-new\dataStandard\standardSet\edit.vue
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    width="650px"
    custom-class="form-standard-set"
    top="10vh"
  >
    
    <el-form :model="form" ref="form" :label-width="formLabelWidth" :rules="rules">
      <h5>基本信息</h5>
      <el-form-item label="标准集名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入标准集名称, 最多128个字符"></el-input>
      </el-form-item>
      <el-form-item label="标准集编码" prop="code">
        <el-input v-model="form.code" autocomplete="off" placeholder="请输入标准集名称, 最多12个字符，仅支持英文字母或数字"></el-input>
      </el-form-item>
      <el-form-item label="归属目录" prop="catalogue">
        <el-select v-model="form.catalogue" placeholder="请选择所属上级目录">
          <el-option label="目录一" value="1"></el-option>
          <el-option label="目录二" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="维护人员" prop="maintainUser">
        <el-select v-model="form.maintainUser" placeholder="请选择维护人员">
          <el-option label="人员1" value="1"></el-option>
          <el-option label="人员2" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="成员" prop="user">
        <el-select v-model="form.user" placeholder="请选择维护人员">
          <el-option label="人员1" value="1"></el-option>
          <el-option label="人员2" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input type="textarea" rows="4" v-model="form.desc" placeholder="请输入标准集描述"></el-input>
      </el-form-item>
      <el-form-item label="可见范围" prop="visibleRange">
        <el-radio-group v-model="form.visibleRange">
          <el-row>
            <el-col :span="24" class="mb-5">
              <el-radio label="1">公开: 非当前标准集人员仅可查看已发布过的标准（已生效，待生效，已失效）</el-radio>
            </el-col>
            <el-col :span="24" class="mb-5">
              <el-radio label="2">私有： 仅标准集人员可见（包括维护人员和成员）</el-radio>
            </el-col>
            <el-col :span="24" class="mb-5">
              <el-radio label="3">标准集人员&指定人可见</el-radio>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
      <h5>审批配置</h5>
      <el-form-item label="标准审批流程" prop="flowPath">
        <el-radio-group v-model="form.flowPath">
          <el-row>
            <el-col :span="24" class="mb-5">
              <el-radio label="1">超级管理员和数据标准管理员，任一通过通过，任一驳回即驳回</el-radio>
            </el-col>
            <el-col :span="24" class="mb-5">
              <el-radio label="2">指定审批模板</el-radio>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="next">下一步</el-button>
      <!-- <el-button type="primary" @click="save">确 定</el-button> -->
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogFormStandardSet',
  props: {
    title: {
      type: String,
      default: '新增标准集'
    }
  },
  data () {
    return {
      dialogFormVisible: true,
      form: {
        name: '',
        code: '',
        catalogue: '',
        maintainUser: '',
        user: '',
        desc: '',
        visibleRange: '1',
        flowPath: '1'
      },
      formLabelWidth: '110px',
      rules: {
        name: [
          { required: true, message: '请输入标准集名称', trigger: 'blur' },
          { max: 128, message: '请输入标准集名称, 最多128个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入标准集编码', trigger: 'blur' },
          { max: 12, message: '请输入标准集编码, 最多12个字符', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '请输入标准集编码, 仅支持英文字母或数字', trigger: 'blur' }
        ],
        visibleRange: [
          { required: true, message: '请选择可见范围', trigger: 'change' }
        ],
        flowPath: [
          { required: true, message: '请选择审批流程', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    next () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('next', this.form)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .form-standard-set {
   .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>