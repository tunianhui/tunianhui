<template>
  <section class="apply-data-table">
    <el-card>
      <v-form-render :form-json="formJson" :form-data="formData" :option-data="optionData" ref="vFormRef">
      </v-form-render>
      <div class="btn-wrapper">
        <el-button type="plain" size="mini" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" @click="submitForm">提交</el-button>
      </div>
    </el-card>
  </section>
</template>

<script>
import {
  getFormAll
} from '@/api/rd/publish/form.js'
import {
  authoritySubmit
} from '@/api/asset/authority.js'
export default {
  name: 'ApplyDataTable',
  inject: ['tabStore'],
  props: {
    data: Object
  },
  data () {
    return {
      // form-json 表单对象JSON
      // 注意：如表单Json是从后端接口异步获取到的，请使用下述的API方法——setFormJson()赋值，使用form-json属性传值则会导致表单校验异常或表单渲染不成功。
      formJson: {},
      // form-data 表单数据对象
      // 注意：form-data属性通常用于表单初始化时给表单传递回显数据，如需多次修改表单数据或发现表单部分数据失去响应式更新，请调用下述的setFormData(formData)方法。
      formData: {},
      // option-data  表单radio、checkbox、select、cascader组件的选择项集合
      optionData: {},
      modelKey: ''
    }
  },
  mounted () {
    this.modelKey = this.data.modelKey
    this.setFormJson()
  },
  methods: {
    async setFormJson () {
      if (this.modelKey === 'service_ds_auth_flow') {
        this.formJson = require('./datasource.json')
      } else if (this.modelKey === 'service_api_auth_flow') {
        this.formJson = require('./api.json')
      }
      this.$refs.vFormRef.setFormJson(this.formJson)
      const res = await this.$simpleAsyncTo(getFormAll({ modelKey: this.modelKey }))
      if (res.flag) {
        // const formJson = res.data.formJson
        // this.$refs.vFormRef.setFormJson(formJson)
      }
    },

    // 提交请求不一样 axios 动态配置
    submitForm () {
      // 表单提交
      this.$refs.vFormRef.getFormData().then(formData => {
        console.log(666, formData)
        const params = {
          modelKey: this.modelKey,
          formData: JSON.stringify(formData)
        }
        this.submit(params)
      }).catch(error => {
        this.$message.error(error)
      })
    },

    async submit (formData) {
      const res = await this.$simpleAsyncTo(authoritySubmit(formData))
      if (res) {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        // 关闭弹窗
        this.tabStore.commit('remove', this.data.name)
      }
    },

    cancel () {
      // 关闭弹窗
      this.tabStore.commit('remove', this.data.name)
    }
  }
}
</script>

<style lang="scss">
.apply-data-table {
  padding: 20px 20px;
  background: $grey7;
  height: 100%;
  .el-card__header {
    padding: 0;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .btn-wrapper {
    text-align: center;
  }
}

body {
  margin: 0; /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
}
</style>
