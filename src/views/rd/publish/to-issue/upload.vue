<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-03-14 15:40:46
 * @LastEditTime: 2022-03-14 18:03:49
 * @Description:
-->
<template>
  <SimpleEditDialog :visible="visible"
                    title="发布"
                    @close="close"
                    @confirm="confirm"
                    width="30%">
    <el-form :model="form"
             :rules="rules"
             ref="ruleForm"
             label-width="100px"
             class="demo-ruleForm"
             label-suffix="：">
      <div class="tips">确认发布对象?</div>
      <el-form-item label="发布名称"
                    prop="cube_name">
        <el-input type="textarea"
                  :rows="4"
                  maxlength="64"
                  show-word-limit
                  v-model="form.cube_name"></el-input>
      </el-form-item>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
export default {
  name: 'upload',
  props: {
    visible: Boolean,
    row: Object
  },
  components: {},
  data () {
    return {
      rules: {
        cube_name: [{ required: true, message: '请输入发布名称', trigger: 'blur' }]
      },
      form: {
        cube_name: ''
      }
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () {
  },
  methods: {
    close () {
      this.$emit('close')
    },
    confirm () {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$emit('close')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.demo-ruleForm {
  height: 100%;
  width: 100%;
  padding-bottom: 30px;
  .tips {
    margin-bottom: 20px;
  }
}
</style>
