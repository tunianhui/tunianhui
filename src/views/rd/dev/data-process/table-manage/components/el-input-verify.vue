<template>
  <span class="el-input-verify">
    <el-form
      :ref="`elInputVerify${propIndexValue}`"
      :model="form"
      :rules="formRules"
      :label-width="propLabelWitdh"
    >
      <el-form-item :label="propLabel" :prop="propName">
        <el-input
          v-model="form[propName]"
          :placeholder="propPlaceholder"
          autocomplete="off"
          :disabled="propDisabled"
          @change="isValid"
        >
        </el-input>
      </el-form-item>
    </el-form>
  </span>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'ElInputVerify',
  components: {},
  props: {
    propLabelWitdh: {
      type: String,
      default: '0px',
    },
    propLabel: {
      type: String,
      default: '',
    },
    propName: {
      type: String,
      default: 'verify',
    },
    propPlaceholder: {
      type: String,
      default: '请输入内容!',
    },
    propDisabled: {
      type: Boolean,
      default: false,
    },
    propIndexValue: {
      type: String,
      default: () => {
        return Math.random().toString()
      },
    },
    propInputValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      form: {},
      formRules: {},
    }
  },
  computed: {},
  watch: {},
  created() {
    this.$set(this.form, this.propName, this.propInputValue)
    this.$set(this.formRules, this.propName, [
      {required: true, message: '必填项，内容不能为空！', trigger: 'blur'},
    ])
  },
  methods: {
    isValid() {
      let flag = null
      this.$refs[`elInputVerify${this.propIndexValue}`].validate((v, o) => {
        if (v) {
          flag = true
          this.$emit('update-data', {
            data: this.form,
            index: this.propIndexValue,
          })
        } else {
          flag = false
        }
      })
      return flag
    },
  },
}
</script>
<style lang="scss" scoped>
.el-input-verify {
  margin-left: 10px;
}
</style>
