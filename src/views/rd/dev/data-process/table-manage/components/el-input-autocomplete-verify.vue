<template>
  <span class="el-input-autocomplete-verify">
    <el-form
      :ref="`ElInputAutocompleteVerify${propIndexValue}`"
      :model="form"
      :rules="formRules"
      :label-width="propLabelWitdh"
    >
      <el-form-item :label="propLabel" :prop="propName">
        <el-autocomplete
          class="inline-input"
          style="width: 100%"
          v-model="form[propName]"
          :fetch-suggestions="propQuerySearch"
          :placeholder="propPlaceholder"
          :disabled="propDisabled"
          @change="isValid"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
    </el-form>
  </span>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'ElInputAutocompleteVerify',
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
    propQuerySearch: {
      type: Function,
      default: function () {},
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
    handleSelect(item) {
    },
    isValid() {
      let flag = null
      this.$refs[`ElInputAutocompleteVerify${this.propIndexValue}`].validate(
        (v, o) => {
          if (v) {
            flag = true
            this.$emit('update-data', {
              data: this.form,
              index: this.propIndexValue,
            })
          } else {
            flag = false
          }
        }
      )
      return flag
    },
  },
}
</script>
<style lang="scss" scoped>
.el-input-autocomplete-verify {
  margin-left: 10px;
}
</style>
