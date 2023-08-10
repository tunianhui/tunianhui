<template>
  <el-dialog
    :title="titleImportant"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    width="50%"
    custom-class="table-manage-import-dialog"
    top="10vh"
    @close="beforeClose"
    v-loading="!!loading"
    v-draggable="{
      trigger: '.table-manage-import-dialog .el-dialog__header',
      body: '.table-manage-import-dialog.el-dialog',
      recover: false,
    }"
  >
    <el-form
      :model="form"
      ref="form"
      :label-width="formLabelWidth"
      v-if="step === 1"
    >
      <h6 class="mb-10">STEP1 下载对应模版，按照模版要求填写文件</h6>
      <el-form-item label="" label-width="0" prop="importScene">
        <el-radio-group v-model="form.importScene" style="display: flex">
          <el-radio label="1" style="display:contents">
            <div style="color: #606266">
              <div>创建表工单模版</div>
              <div>
                仅用于创建表工单，不同分层的表存放在不同的表格中；目前仅支持Hive，单次支持上传10张表。
              </div>
              <div class="mt-5">
                <el-button type="text"><a :href="baseurl + '/developTask/developModelWorkOrder/downTemplate'" download="模版文件.xlsx" style="color:#409EFF">下载模版</a></el-button>
              </div>
            </div>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-divider></el-divider>
      <h6 class="mb-10">STEP2 选择文件上传目录，上传填写后的模版文件</h6>

      <el-form-item label="" label-width="0">
        <el-select
          v-model="formTemp.catalogid"
          placeholder="请选择文件上传后所指向的目录"
          ref="treeSelect"
          popper-class="select-tree"
          style="width: 30%"
        >
          <el-option
            :label="formTemp.file_catalog"
            :value="formTemp.catalogid"
            style="max-height: auto; background-color: #fff"
          >
            <el-tree
              :data="treeData"
              :props="defaultProps"
              :current-node-key="currentNodeKey"
              node-key="id"
              accordion
              :highlight-current="true"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
              ref="tree"
              style="font-weight: 400"
            >
            </el-tree>
          </el-option>
        </el-select>
        <el-upload
          class="upload-demo mt-10"
          style="width:30%"
          ref="batchImportUpload"
          :action="baseurl+'/developTask/developModelWorkOrder/execlImport'"
          accept=".xls,.xlsx"
          :data="extraParams"
          :auto-upload="false"
          :on-success="resUpload"
          :limit="1"
          :file-list="fileList"
        >
          <el-button type="primary" icon="el-icon-download2">
            上传文件
          </el-button>
        </el-upload>
        <span class="ml-10" style="color:rgba(0,0,0,0.5);font-size:12px">
            <i class="el-icon-warning-outline mr-5"></i>
            请上传填写好的模版文件，文件格式仅支持xls、xlsx类型，如上传错误，可点击列表文件右侧‘x’按钮删除，重新上传。
          </span>
      </el-form-item>
      <el-divider></el-divider>
      <h6 class="mb-10">
        STEP3
        点击“开始导入”按钮，等待文件解析导入，如解析成功，对话框关闭，手动刷新节点列表；如解析失败，下方展示失败结果，更正模版文件后，重新执行STEP2-3步骤。
      </h6>
      <el-empty
        v-if="!showAnalysisResult"
        :image-size="200"
        description="暂无解析结果"
      ></el-empty>
      <div v-else>
        <el-alert
          style="margin-bottom:0px"
          title="文件解析错误，详细信息如下："
          type="error"
          v-if="analysisResultInfo!=''"
          show-icon>
          <slot>
            <div v-for="(i,d) in analysisResultInfo" :key="d">{{ i }}</div>
          </slot>
        </el-alert>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="beforeClose">{{ uploadStatusText }}</el-button>
      <el-button type="primary" :disabled="uploadStatus" @click="saveImportant" v-if="step === 1"
        >开始导入</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import {mapGetters} from 'vuex'
import {getTreeDataList} from '@/api/rd/code-task.js'
import {list,downTemplate,execlImport} from '@/api/rd/table-manage.js'
import config from '@/config'

export default {
  name: 'TableManageImportDialog',
  mixins: [editDialog],
  computed: {
    ...mapGetters(['project']),
  },
  data() {
    return {
      baseurl:config.baseurl,
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
      titleImportant: '批量导入',
      form: {
        importScene: '1',
        processingStrategy: '1',
      },
      formLabelWidth: '120px',
      importVisible: false,
      step: 1,
      showErrorList: false,
      fileList: [],
      dataSourceMapRelation: [],
      targetDataSourceList: [],
      targetLibraryList: [],
      treeData: [],
      defaultProps: {
        children: 'child',
        label: 'name',
      },
      currentNodeKey: '',
      importResult:[],
      formTemp:{
        catalogid:"",
        file_catalog:"",
      },
      showAnalysisResult:false,
      extraParams:{
        project_id: this.$store.getters.project.project_id || "",
        project_code:this.$store.getters.project.project_code || "",
        parent_id:""
      },
      uploadStatus:false,
      uploadStatusText:'取 消',
      analysisResultInfo:'',
      loading:0,
    }
  },
  async created() {
    await this.getFolder()
  },
  methods: {
    async downloadTemplate(){
      const res = await this.$simpleAsyncTo(
        downTemplate(),
        '获取模版失败'
      )
      if(res) {

      }
    },
    async getFolder() {
      const params = {
        folder_type: '7',
        project_id: this.project.project_id,
      }
      const res = await this.$simpleAsyncTo(
        list(params),
        '获取树数据失败'
      )
      if (res) {
        let data = res.data.child
        this.doDelete(data)
        this.treeData = [
          {
            id: res.data.id,
            node_type: res.data.node_type,
            child: data,
            name: res.data.name,
          },
        ]
      }
    },
    doDelete(treeData) {
      for (let i = treeData.length; i > 0; i--) {
        if (treeData[i - 1].node_type === '1') {
          treeData.splice(i - 1, 1)
        } else {
          if (treeData[i - 1].child) {
            this.doDelete(treeData[i - 1].child)
          }
        }
      }
    },
    handleNodeClick(data, node) {
      this.extraParams.parent_id = data.id
      this.formTemp.catalogid = data.id
      this.formTemp.file_catalog = data.name
      this.$refs.treeSelect.blur()
    },
    sqlVerification() {},
    beforeClose() {
      this.close()
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
    saveImportant(res, file) {
      this.loading++
      this.analysisResultInfo = ''
      this.$refs.batchImportUpload.submit()
      this.$root.eventEmitter.emit('table-manage-refresh-treeData')
    },
    resUpload(response, file, fileList){
      if(response.flag) {
        this.loading--
        this.close()
        this.$message({
          type:'success',
          message:response.msg
        })
      }else {
        this.loading--
        this.analysisResultInfo = response.msg.split('\r\n')
        this.showAnalysisResult = true
        this.uploadStatusText = "关 闭"
      }
    }
  },
}
</script>

<style lang="scss"></style>
