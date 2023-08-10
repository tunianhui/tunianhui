<template>
  <TableEditLayout class="code-task" :tabs="tabs" :buttons="btns" v-loading="!!loading" type="code-task" ref="tel">
    <SqlEditor
      ref="editor"
      :code.sync="code"
      :excutting.sync="excutting"
      visible-result
      :excuteFetch="excuteFetch"
      :compileFetch="compileFetch"
      :txt_type="txtType"></SqlEditor>
      <SideModal
      :visible.sync="sideModelOption.visible"
      :title="sideModelOption.title"
      @confirm="sideModelOption.confirm"
    >
      <component
        ref="sideComponent"
        :is="sideModelOption.component"
        :field-list="editFieldList"
        :data="sideModelOption.data"
      ></component>
    </SideModal>
  </TableEditLayout>
</template>
<script>
import SqlEditor from '@c/sql-editor'
import TableEditLayout from '@c/table-edit-layout'
import SideModal from '@c/side-modal'
import rdEdit from '@/mixins/rd-edit'
import {SQL} from '@/config/dics'
import {loop} from '@/libs/util'
import {
  getFileInfo,
  getCodeExecute,
  getCodeCheck,
  getEditFile,
  getDispatchEdit,
  getSubmit
} from '@/api/rd/code-task'
const DispatchConfig = _ =>
  import(/* webpackChunkName: "DispatchConfig" */ './dispatch-config')
const VersionInfo = _ =>
  import(/* webpackChunkName: "VersionInfo" */ './version-info')
export default {
  name: 'CodeTask',
  mixins: [rdEdit],
  components: {
    SqlEditor,
    TableEditLayout,
    SideModal
  },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      excuteFetch: getCodeExecute,
      compileFetch: getCodeCheck,
      saveFetch: getEditFile,
      submitFetch: getSubmit,
      saveParams: {},
      submitParams: {},
      txtType: null,
      tabs: [
        {
          label: '代码编写',
          title: '维度逻辑表详情',
          handler: this.tabClick,
          confirm: null,
          component: null,
          data: {}
        },
        {
          label: '调度配置',
          title: '调度配置',
          handler: this.tabClick,
          confirm: this.saveConfig,
          component: DispatchConfig,
          data: {}
        },
        {
          label: '版本信息',
          title: '版本信息',
          handler: this.tabClick,
          confirm: this.submit,
          component: VersionInfo,
          data: {}
        }
      ],
      btns: [
        {
          icon: 'icon iconfont icon-zhihang',
          handler: this.handleExcute,
          disabled: false,
          title: '执行',
          label: '执行'
        },
        {
          icon: this.data.object_type === SQL ? 'el-icon-tickets' : '',
          handler: this.handleCompile,
          disabled: false,
          title: '预编译',
          label: '预编译'
        },
        {
          icon: 'el-icon-refresh-right',
          handler: this.handleRefresh,
          disabled: false,
          title: '刷新',
          label: '刷新'
        },
        {
          icon: this.data.object_type === SQL ? 'icon iconfont icon-geshihua' : '',
          handler: this.handleFormat,
          disabled: false,
          title: '格式化',
          label: '格式化'
        },
        // {
        //   icon: 'el-icon-lock',
        //   handler: this.locationHandle,
        //   disabled: false,
        //   title: ''
        // },
        {
          icon: 'icon iconfont icon-baocun',
          handler: this.saveHandle,
          disabled: false,
          title: '保存'
        },
        {
          icon: 'icon iconfont icon-fabu',
          handler: this.submitHandle,
          disabled: false,
          title: '发布'
        },
        {
          icon: 'icon iconfont icon-iconfontzhizuobiaozhun023117',
          handler: this.locationHandle,
          disabled: false,
          title: '定位'
        }
      ],
      code: '',
      loading: 0,
      excutting: false,
      sideModelOption: {
        title: '',
        visible: false,
        component: null,
        confirm: loop
      },
      editFieldList: [],
      fileDataInfo: {}
    }
  },
  watch: {
    excutting(val) {
      const btn = this.btns[0]
      if (val) {
        btn.label = '终止'
        btn.icon = 'icon iconfont icon-zhongzhi'
        btn.handler = this.handlerStop
      } else {
        btn.label = '执行'
        btn.icon = 'icon iconfont icon-zhihang'
        btn.handler = this.handleExcute
      }
      this.btns.splice(0, 1, btn)
    }
  },
  created() {
    this.getFileInfo()
  },
  methods: {
    // 执行
    handleExcute() {
      this.$refs.editor.excute('code-task', this.data.label)
    },
    handlerStop() {
      this.excutting = false
      // this.$refs.editor.stop()
    },
    // 预编译
    handleCompile() {
      this.$refs.editor.compile('code-task')
    },
    // 格式化
    handleFormat() {
      this.$refs.editor.format()
    },
    // 刷新
    handleRefresh() {
      this.getFileInfo()
    },
    // 保存
    saveHandle() {
      if (!this.$refs.editor.validate()) return
      this.saveParams = {code_context: this.encrypt(this.code), id: this.data.id}
      this.handleSave()
    },
    // 发布
    async submitHandle() {
      if (!this.$refs.editor.validate()) return
      this.submitParams = {id: this.data.id}
      this.$confirm('请确认是否发布？', '发布', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.globalLoading()
          const res = await this.$simpleAsyncTo(
            this.submitFetch(this.submitParams),
            '提交失败'
          )
          if (res) {
            this.$message({
              type: 'success',
              message: '发布成功！'
            })
            this.$root.eventEmitter.emit('refresh')
          }
          this.globalLoading().close()
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '发布失败！'
          })
          this.globalLoading().close()
        })
    },
    locationHandle(e) {
      this.handleLocation(
        this.tabStore.states.activeValue,
        '/rd/dev/data-process/code-task'
      )
    },
    // 获取sql内容
    async getFileInfo() {
      const params = {
        id: this.data.id
      }
      const res = await this.$simpleAsyncTo(getFileInfo(params), '查询内容失败')
      if (res) {
        this.code = this.decrypt(res.data.codeTaskData.code_context)
        this.txtType = res.data.codeTaskData.object_type
        this.fileDataInfo = res.data
      }
    },
    async tabClick(tab) {
      if (tab.title === '维度逻辑表详情') {
        this.sideModelOption.visible = false
        return
      }
      // if (tab.title === this.sideModelOption.title) {
      //   this.sideModelOption.visible = !this.sideModelOption.visible
      //   return
      // }
      await this.getFileInfo()
      this.tabs[1].data = this.fileDataInfo
      if (tab.title === '调度配置') {
      }
      Object.assign(this.sideModelOption, tab, {visible: true})
    },
    async saveConfig() {
      this.globalLoading()
      let data = this.$refs.sideComponent.getData()
      // if (data.upstream_rely === '') {
      //   return this.$message({
      //     type: 'error',
      //     message: '上游依赖不能为空'
      //   })
      // }
      const res = await this.$simpleAsyncTo(getDispatchEdit(data), '保存失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '保存配置成功'
        })
        this.sideModelOption.visible = false
      }
      this.globalLoading().close()
    },
    submit() {}
  }
}
</script>

<style lang="scss">
  .code-task {
    .tel-head {
      .icon-zhongzhi {
        color: $error;
      }
    }
  }
</style>
