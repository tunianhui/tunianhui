<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    width="600px"
    custom-class="catelogue-modal"
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="上级级目录名称" prop="parentName" v-if="viewType !== 'first'">
        {{form.parentName}}
      </el-form-item>
      <el-form-item prop="name">
        <span slot="label" v-if="viewType === 'first'">一级目录名称</span>
        <span slot="label" v-else>子目录名称</span>
        <el-input v-model="form.name" placeholder="请输入目录名称"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <span slot="label" v-if="viewType === 'first'">一级目录编码</span>
        <span slot="label" v-else>子目录编码</span>
        <el-input v-model="form.code" placeholder="请输入目录编码"></el-input>
      </el-form-item>
    </el-form>
    <div class="tip mb-15">
      <div class="tip-icon">
        <i class="iconfont icon-tip"></i>
      </div>
      <div class="tip-text">
        <span>提示：目录编码可能会被应用到标准编码的自动生成规则，创建标准集或标准后不可修改，请评估后填写</span>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'CatelogueModal',
  props: {
    title: String,
    viewType: String,
  },
  data () {
    return {
      dialogFormVisible: true,
      form: {
        name: '',
        code: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入目录名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入目录编码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('submitForm', this.form)
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.catelogue-modal {
  .tip {
    display: flex;
    font-size: 12px;
    background: RGB(230,242,255);
    padding: 10px;
    .tip-icon {
      margin-right: 8px;
      i {
        font-size: 16px;
        color: #409eff;
      }
    }
    .tip-text {
      display: flex;
      flex-direction: column;
      color: rgba(0,0,0,.75);
      span {
        line-height: 1.8
      }
    }
  }
}
</style>