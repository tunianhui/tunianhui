<!--
 * @Author: 大炸鹅
 * @Date: 2023-06-14 09:47:37
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-14 14:26:31
 * @FilePath: \dataphin\src\views\rd\dev\data-process\source-manage\view-content.vue
-->
<template>
  <TableEditLayout class="code-task" :tabs="tabs" :buttons="btns" v-loading="!!loading" type="code-task" ref="tel">
    <SqlEditor
      :showBottomContent="false"
      :code.sync="code"
    ></SqlEditor>
  </TableEditLayout>
</template>

<script>
import SqlEditor from '@c/sql-editor'
import TableEditLayout from '@c/table-edit-layout'
import { queryMetaFileContent, updateMetaFileContent } from '@/api/rd/source-manage.js'
export default {
  name: 'ViewContent',
  components: {
    SqlEditor,
    TableEditLayout
  },
  props: {
    data: Object
  },
  watch: {
    'data.id': {
      handler(val) {
        if (val) {
          this.getContent()
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      tabs: [],
      btns: [
        {
          icon: 'icon iconfont icon-baocun',
          handler: this.saveHandle,
          disabled: false,
          // title: '保存',
          label: '保存'
        }
      ],
      loading: 0,
      code: ''
    }
  },
  created() {
    console.log(this.data)
  },
  methods: {
    async saveHandle() {
      const params = {
        id: this.data.id,
        content: this.code
      }
      const res = await this.$simpleAsyncTo(updateMetaFileContent(params), '保存失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      }
    },
    async getContent() {
      const params = {
        id: this.data.id
      }
      const res = await this.$simpleAsyncTo(queryMetaFileContent(params), '获取数据失败')
      if (res) {
        console.log(res)
        this.code = res.data.file_content
      }
    }
  }
}
</script>