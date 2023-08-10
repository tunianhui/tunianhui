<template>
  <el-dialog
    custom-class="table-manage-export-dialog"
    title="批量导出"
    width="1100px"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="10vh"
    append-to-body
    @close="beforeClose"
    v-draggable="{
      trigger: '.table-manage-export-dialog .el-dialog__header',
      body: '.table-manage-export-dialog.el-dialog',
      recover: false,
    }"
  >
    <el-alert
      show-icon
      title="按树节点区域内，列表全量数据导出"
      type="warning"
      :closable="false"
    >
    </el-alert>
    <div slot="footer">
      <el-button @click.stop="beforeClose">取消</el-button>
      <el-button type="primary" @click.stop="exportAllListData">
        确认导出
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import {execlExport} from '@/api/rd/table-manage.js'
import {mapGetters} from 'vuex'

export default {
  name: 'TableManageExportDialog',
  mixins: [editDialog],
  data() {
    return {
      isVisible: false,
      filter: {
        business_field_name: '',
        project_name: '',
        space_type_name: '',
        name_en: '',
        name: '',
        desc: '',
        data_type: '',
        is_accumulate: true,
        sql_content: '',
      },
      rules: {
        name_en: [
          {required: true, message: '必填项'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母',
          },
        ],
        name: [{required: true, message: '必填项'}],
        data_type: [{required: true, message: '必填项'}],
        sql_content: [{required: true, message: '必填项'}],
      },
    }
  },
  computed: {
    ...mapGetters(['project']),
  },
  methods: {
    sqlVerification() {},
    beforeClose() {
      this.close()
    },
    async exportAllListData() {
      let params = {
        project_id: this.project.project_id,
      }
      const res = await execlExport(params)
      const url = window.URL.createObjectURL(new Blob([res]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', this.project.project_id + '.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
    validate() {
      let flag = false
      this.$refs.form.validate((valid) => {
        flag = valid
      })
      return flag
    },
    save() {},
    publish() {},
  },
}
</script>

<style lang="scss"></style>
