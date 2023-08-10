<template>
  <section class="apply-logic-table">
    <el-card>
      <v-form-render :form-json="formJson" :form-data="formData" :option-data="optionData" ref="vFormRef">
      </v-form-render>
      <div class="btn-wrapper">
        <el-button v-if="step === 0" type="primary" size="mini" @click="nextStep">下一步</el-button>
        <el-button v-if="step === 1" type="plain" size="mini" @click="cancel">取消</el-button>
        <el-button v-if="step === 1" type="primary" size="mini" @click="submitForm">提交</el-button>
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
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'ApplyLogicTable',
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
      // 默认申请步骤 0
      step: 0,
      modelKey: ''
    }
  },
  mounted () {
    this.modelKey = this.data.modelKey
    this.setFormJson()
  },

  methods: {
    async setFormJson () {
      // 逻辑表权限：table_logic_auth_flow
      // 物理表权限：table_physical_auth_flow
      // 数据源权限：service_ds_auth_flow
      // API权限：service_api_auth_flow
      // 功能权限：service_func_auth_flow
      let formJson = {}
      if (this.modelKey === 'table_logic_auth_flow') {
        formJson = require('./logic_01.json')
      } else if (this.modelKey === 'table_physical_auth_flow') {
        formJson = require('./phy_01.json')
      }
      this.$refs.vFormRef.setFormJson(formJson)
      const res = await this.$simpleAsyncTo(getFormAll({ modelKey: this.modelKey }))
      if (res.flag) {
        // const formJson = res.data.formJson
        // this.$refs.vFormRef.setFormJson(formJson)
      }
    },

    // 下一步
    nextStep () {
      this.$refs.vFormRef.getFormData().then(formData => {
        // 深拷贝 切换表单 formData 会变化
        const data = cloneDeep(formData)
        this.step = 1
        // 更新表单
        let formJson = {}
        if (this.modelKey === 'table_logic_auth_flow') {
          formJson = require('./logic_02.json')
        } else if (this.modelKey === 'table_physical_auth_flow') {
          formJson = require('./phy_02.json')
        }
        this.$refs.vFormRef.setFormJson(formJson)
        setTimeout(() => {
          data.businessSegment = data.businessSegment1
          data.logicTable = data.logicTable1
          this.$refs.vFormRef.setFormData(data)
        }, 1000)
      })
    },

    // 提交请求不一样 axios 动态配置
    submitForm () {
      // 表单提交
      this.$refs.vFormRef.getFormData().then(formData => {
        // 权限字段 ---> sessionStorage
        const fieldList = JSON.parse(sessionStorage.getItem('filedList'))
        console.log('formData-list', formData, fieldList)
        const codes = fieldList.map(ele => ele.element_code)
        // 拼装数据 ---> 选择的权限字段
        let data = cloneDeep(formData)
        data.codes = codes
        const params = {
          modelKey: this.modelKey,
          formData: JSON.stringify(data)
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
.apply-logic-table {
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
    margin-top: 20px;
  }
}

body {
  margin: 0; /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
}
</style>
