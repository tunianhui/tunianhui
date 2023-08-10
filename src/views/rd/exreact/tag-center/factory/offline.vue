<template>
  <SimpleEditDialog
    title="提示"
    :visible="isVisible"
    @close="myClose"
    @confirm="myConfirm"
    width="580px"
    top="25vh"
  >
    <div class="my-confirm-info-wrapper mb-15">
      <i class="el-icon-warning-outline"></i>
      确定{{title}}标签: &nbsp;{{data.name}}
    </div>
    <div class="mt-15 mb-15" v-if="title!=='删除'">
      <el-form ref="form" :model="delRemarksForm" label-width="50px" :rules="rules">
        <el-form-item label="备注" prop="desc">
          <el-input type="textarea" v-model="delRemarksForm.desc" :rows="7" resize="none"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div style="opacity: .5" class="mb-15" v-if="title!=='删除'">特殊说明：当前项目，提交成功后，即更新至生产环境，请谨慎操作!</div>
  </SimpleEditDialog>
</template>

<script>
export default {
  name: 'TagOfflineDialog',
  props: {
    visible: Boolean,
    title: String,
    data: [Object, null]
  },
  data() {
    return {
      isVisible: true,
      delRemarksForm: {
        desc: ''
      },
      rules: {
        desc: [
          { required: true, message: '必须填', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    myClose() {
      // this.$emit('update:visible', false)
      this.$emit('closeTag')
    },
    myConfirm() {
      if (this.title !== '删除') {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$message({
              type: 'success',
              message: `${this.title}成功`
            })
            this.$emit('closeTag')
          }
        })
      } else {
        this.$message({
          type: 'success',
          message: `${this.title}成功`
        })
        this.$emit('closeTag')
      }
    }
  }
}
</script>
