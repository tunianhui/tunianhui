<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    width="600px"
    custom-class="wordsRoot-modal"
  >
    <el-form :model="form" :label-width="formLabelWidth" :rules="rules">
      <el-form-item label="词根名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="全称" prop="fullName">
        <el-input v-model="form.fullName" autocomplete="off" placeholder="请输入全称"></el-input>
      </el-form-item>
      <el-form-item label="缩写" prop="abbr">
        <el-input v-model="form.abbr" autocomplete="off" placeholder="请输入全称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="form.desc" autocomplete="off" placeholder="请输入描述" type="textarea" :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
    
  </el-dialog>
</template>

<script>
export default {
  name: 'WordsRootModal',
  props: {
    title: {
      type: String,
      default: '新增'
    },
  },
  data() {
    return {
      dialogFormVisible: true,
      form: {
        name: '',
        fullName: '',
        abbr: '',
        desc: ''
      },
      formLabelWidth: '90px',
      rules: {
        name: [
          { required: true, message: '请输入词根名称', trigger: 'blur' }
        ],
        fullName: [
          { required: true, message: '请输入全称', trigger: 'blur' }
        ],
        abbr: [
          { required: true, message: '请输入缩写', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('submit', this.form)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wordsRoot-modal {
}
</style>