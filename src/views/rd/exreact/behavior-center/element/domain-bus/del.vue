<template>
  <SimpleEditDialog
    :title="`删除${title}`"
    :visible="isVisible"
    @close="myClose"
    @confirm="myConfirm"
    width="580px"
    top="25vh"
  >
    <div class="my-confirm-info-wrapper">
      <i class="el-icon-warning-outline"></i>
      {{data.dialogFlag ? data.dialogText : '确定删除吗？'}}
    </div>
    <div v-if="!data.dialogFlag" class="mt-15">
      <el-form ref="form" :model="delRemarksForm" label-width="50px" :rules="rules">
        <el-form-item label="备注" prop="desc">
          <el-input type="textarea" v-model="delRemarksForm.desc" :rows="7" resize="none"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div style="opacity: .5" class="mt-10 mb-15">特殊说明：当前项目，提交成功后，即更新至生产环境，请谨慎操作!</div>
  </SimpleEditDialog>
</template>

<script>
export default {
  name: 'DelDialog',
  props: {
    visible: Boolean,
    title: String,
    data: [Object, null]
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.isVisible = val
      }
    }
  },
  data() {
    return {
      isVisible: false,
      dialogFlag: false,
      isRule: false,
      dialogText: '',
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
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    myConfirm() {
      if (this.dialogFlag) {
        this.isgVisible = false
      } else {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.isVisible = false
          }
        })
      }
    }
  }
}
</script>
