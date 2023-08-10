<template>
  <TableEditLayout class="ad-search" :tabs="tabs" :buttons="btns" v-loading="!!loading" type="ad-search" ref="tel">
    <SqlEditor
      ref="editor"
      :code.sync="code"
      :excutting.sync="excutting"
      visible-result
      :excuteFetch="excuteFetch"
      :compileFetch="compileFetch"
      :txt_type="txtType"></SqlEditor>
  </TableEditLayout>
</template>

<script>
import SqlEditor from '@c/sql-editor'
import TableEditLayout from '@c/table-edit-layout'
import {getExecute, getAdHocQueryCheck, getEditFileContent, getQueryFileContent} from '@/api/rd/ad-search'
import rdEdit from '@/mixins/rd-edit'

export default {
  name: 'AdSearchEdit',
  mixins: [rdEdit],
  components: {
    SqlEditor,
    TableEditLayout
  },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      excuteFetch: getExecute,
      compileFetch: getAdHocQueryCheck,
      saveFetch: getEditFileContent,
      saveParams: {},
      txtType: null,
      tabs: [
        {
          label: '代码编写',
          title: '维度逻辑表详情',
          handler: null,
          confirm: null,
          component: null,
          // key: 'dimensionDatas',
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
          icon: 'el-icon-tickets',
          handler: this.handleCompile,
          disabled: false,
          title: '预编译',
          label: '预编译'
        },
        {
          icon: 'icon iconfont icon-geshihua',
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
          icon: 'icon iconfont icon-iconfontzhizuobiaozhun023117',
          handler: this.locationHandle,
          disabled: false,
          title: '定位'
        }
      ],
      code: '',
      loading: 0,
      excutting: false
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
        btn.icon = 'icon iconfont icon-zhihang '
        btn.handler = this.handleExcute
      }
      this.btns.splice(0, 1, btn)
    }
  },
  created() {
    this.getSqlContent()
  },
  methods: {
    // 执行
    handleExcute() {
      this.$refs.editor.excute()
    },
    handlerStop() {
      this.excutting = false
      // this.$refs.editor.stop()
    },
    handleCompile() {
      this.$refs.editor.compile()
    },
    // 格式化
    handleFormat() {
      this.$refs.editor.format()
    },
    saveHandle() {
      if (!this.$refs.editor.validate()) return
      this.saveParams = {sql_context: this.encrypt(this.code), id: this.data.id, txt_type: this.txtType}
      this.handleSave()
    },
    locationHandle() {
      this.handleLocation(
        this.tabStore.states.activeValue,
        '/rd/dev/ad-search'
      )
    },
    // 获取sql内容
    async getSqlContent() {
      const params = {
        id: this.data.id
      }
      const res = await this.$simpleAsyncTo(getQueryFileContent(params), '查询内容失败')
      if (res) {
        this.code = this.decrypt(res.data.sql_context)
        this.txtType = res.data.txt_type
      }
    }
  }
}
</script>

<style lang="scss">
  .ad-search {
    .tel-head .tel-head-btns {
      .icon-zhongzhi {
        color: $error;
      }
    }
  }
</style>
