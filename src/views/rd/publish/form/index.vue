<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-04-20 15:35:34
 * @Description: 表单编辑
-->
<template>
  <div class="dataform">
    <div class="tool-bar">
      <div>
        <span>表单名称：</span>
        <el-input v-model="formName"
                  class="name-input"></el-input>
      </div>
      <div>
        <!-- <el-button type="primary" size="mini" @click="printFieldWidgets">log</el-button> -->
        <el-button type="primary"
                   size="mini"
                   @click="previewForm">预览</el-button>
        <el-button type="primary"
                   size="mini"
                   @click="saveFormJson">保存</el-button>
      </div>
    </div>
    <v-form-designer ref="vfDesignerRef"
                     :designer-config="designerConfig">
    </v-form-designer>
  </div>
</template>

<script>
import {
  saveForm,
  editForm
} from '@/api/rd/publish/form.js'
export default {
  name: 'Dataform',
  inheritAttrs: false,
  data () {
    return {
      id: '',
      formName: '',
      // field-list-api
      // {
      //   URL: '字段列表接口请求地址',
      //   nameKey: '字段名称key',
      //   labelKey: '字段标签key',
      //   headers: {
      //     //后端需要token请设置请求头对象，后端如不需要可不设置
      //   }
      // }

      // 配置设计器初始化界面显示设置
      designerConfig: {
        languageMenu: false, // 是否显示语言切换菜单
        externalLink: false, // 是否显示GitHub、文档等外部链接
        formTemplates: true, // 是否显示表单模板
        eventCollapse: true, // 是否显示组件事件属性折叠面板
        widgetNameReadonly: false, // 禁止修改组件名称

        clearDesignerButton: true, // 是否显示清空设计器按钮
        previewFormButton: true, // 是否显示预览表单按钮
        importJsonButton: true, // 是否显示导入JSON按钮
        exportJsonButton: true, // 是否显示导出JSON器按钮
        exportCodeButton: true, // 是否显示导出代码按钮
        generateSFCButton: true, // 是否显示生成SFC按钮
        toolbarMaxWidth: 420, // 设计器工具按钮栏最大宽度（单位像素）
        toolbarMinWidth: 300, // 设计器工具按钮栏最小宽度（单位像素）

        presetCssCode: '', // 设计器预设CSS样式代码
        resetFormJson: false // 是否在设计器初始化时将表单内容重置为空
        // toolbarMaxWidth: 490,
      },

      // 配置禁止设计器显示的组件  banned-widgets
      bannedWidgets: []
      // 插槽 customToolButtons 用于定制表单设计器的自定义工具按钮，位于默认工具按钮的右侧。
    }
  },
  created () {

  },
  mounted () {
    // 清空设计器画布
    // this.$refs.vfDesignerRef.clearDesigner()
    // 判断是否编辑 编辑从服务加载FormJSON
    if (this.$route.query && this.$route.query.id) {
      this.id = this.$route.query.id
      this.formName = this.$route.query.formName
      this.formJson = sessionStorage.getItem(this.id)
      this.setFormJson()
    }
  },
  methods: {
    // setFormJson  设置表单JSON对象
    // getFormJson  获取表单JSON对象
    // clearDesigner 清空设计器画布
    // previewForm  打开--预览表单--弹窗
    // importJson   打开--导入表单JSON--弹窗
    // exportJson   打开--导出表单JSON--弹窗
    // exportCode   打开--导出Vue/HTML代码--弹窗
    // generateSFC  打开--生成SFC组件代码--弹窗
    // getFieldWidgets    获取表单JSON中的所有字段，返回对象数组
    // getContainerWidgets    获取表单JSON中的所有容器，返回对象数组

    setFormJson () {
      // 服务渲染
      this.$refs.vfDesignerRef.setFormJson(this.formJson)
    },

    printFormJson () {
      // 获取表单JSON对象
      console.log(this.$refs.vfDesignerRef.getFormJson())
    },

    printFieldWidgets () {
      console.log(this.$refs.vfDesignerRef.getFieldWidgets())
    },

    previewForm () {
      this.$refs.vfDesignerRef.previewForm()
    },

    // 保存
    saveFormJson () {
      if (!this.formName) {
        this.$message({
          message: '请输入表单名称',
          type: 'warning'
        })
        return
      }
      this.saveForm()
    },

    // 提交后端
    async saveForm () {
      const formJson = this.$refs.vfDesignerRef.getFormJson()
      // TODO: 将formJson提交给后端保存接口
      // console.log(this.formName, formJson)
      const params = {
        formName: this.formName,
        formJson: JSON.stringify(formJson)
      }
      console.log(666, JSON.stringify(formJson))

      if (this.id) {
        params.id = this.id
        const res = await this.$simpleAsyncTo(editForm(params))
        if (res.flag) {
          this.$message({
            message: '表单编辑成功',
            type: 'success'
          })
        }
      } else {
        const res = await this.$simpleAsyncTo(saveForm(params))
        if (res.flag) {
          this.$message({
            message: '表单已保存',
            type: 'success'
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dataform {
  background-color: #eeeeee;
  padding: 15px;
  overflow: auto;
  .tool-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .name-input {
      width: 200px;
    }
  }
  /deep/ .el-container {
    // background-color: aquamarine;
    .el-button-group {
      display: none;
    }
    .el-header {
      background-color: #fff;
    }
    .el-aside {
      background-color: #fff;
    }
  }

  /deep/ .main-container {
    .main-header {
      .main-title {
        // display: none;
        img {
          display: none;
        }
        .bold,
        .version-span {
          display: none;
        }
      }
    }
  }
}
</style>
