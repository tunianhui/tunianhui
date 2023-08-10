<template>
  <SimpleEditDialog
    class="create-source"
    width="550px"
    :title="title"
    :visible="isVisible"
    confirmText="提交"
    @close="close"
    @confirm="confirm"
  >
    <el-form
      v-loading="!!loading"
      ref="form"
      :model="editForm"
      :rules="rules"
      label-width="100px"
      label-position="right"
      label-suffix="："
    >
      <!-- <el-form-item label="类型" prop="file_type">
        <el-select v-model="editForm.file_type" clearable placeholder="请选择资源">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="名称" prop="file_name">
        <el-input v-model="editForm.file_name" disabled></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="file_desc">
        <el-input
          v-model="editForm.file_desc"
          type="textarea"
          :rows="5"
          placeholder="请输入128字符内描述"
          maxlength="128"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="上传文件" prop="file_upload_path">
        <el-upload
          ref="upload"
          class="upload-file"
          :data="editForm"
          :action="uploadUrl"
          :auto-upload="false"
          :before-upload="beforeUploadHandle"
          :file-list="fileList"
          v-model="editForm.file_upload_path"
          :on-success="uploadSuccess"
          :onError="uploadError"
          :onChange="uploadChange"
          :onRemove="uploadRemove"
          :limit="1"
          accept=".xlsx,.xls">
          <el-button size="mini" icon="el-icon-upload">请点击选择文件上传</el-button><span class="ml-5 font-12" style="opacity:0.5">(每次只允许上传一个文件){{fileList.length}}</span>
          <p v-if="title.indexOf('编辑') > -1 && fileList.length === 0" style="text-align:start">已上传文件：{{metaFileSourceInfo.file_code}}</p>
        </el-upload>
      </el-form-item>
       <!-- <el-form-item label="计算类型" prop="engine_type">
        <el-select v-model="editForm.engine_type" clearable placeholder="请选择计算类型">
          <el-option
            v-for="item in engineTypeList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="选择目录">
        <SelectTree
          :data="treeData"
          :field="{
            id: 'id',
            label: 'name',
            type: 'node_type',
            parent_id: 'parent_id',
            children: 'child'
          }"
          :defaultProps="{
            children: 'child',
            label: 'label'
          }"
          :curNode="editForm.parent_id"
          :isDirClick="true"
          @nodeClick="selectTreeNodeClick1"
          :disabled="title.indexOf('编辑')> -1"
          ></SelectTree>
      </el-form-item>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import {getFileType, getEngineType, getTreeData, queryMetaFileSourceInfo, editFile} from '@/api/rd/source-manage.js'
import SelectTree from '../func-manage/select-tree.vue'
import config from '@/config'
export default {
  name: 'CreateSource',
  mixins: [editDialog],
  components: {
    SelectTree
  },
  data() {
    return {
      editForm: {
        file_name: '',
        // file_type: '',
        file_desc: '',
        // engine_type: '',
        parent_id: '',
        file_upload_path: ''
      },
      uploadUrl: `${config.baseurl}/developTask/developModelResManage/saveFile`,
      fileList: [],
      rules: {
        // file_type: [
        //   {required: true, message: '请选择文件类型', trigger: 'change'}
        // ],
        file_name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
          // {
          //   pattern: /^[a-zA-Z_]([a-zA-Z_0-9]+)?$/,
          //   trigger: ['blur', 'change'],
          //   message: '函数名称只能以字母或者下划线开头，包含数字，字母，下划线'
          // }
        ],
        file_upload_path: [
          {required: true, message: '请选择上传文件', trigger: 'change'}
        ]
        // file_desc: [
        //   {required: true, message: '请输入描述信息', trigger: 'blur'}
        // ],
        // engine_type: [
        //   {required: true, message: '请选择计算类型', trigger: 'change'}
        // ]
      },
      typeList: [],
      engineTypeList: [],
      treeData: [],
      loading: 0,
      metaFileSourceInfo: {}
    }
  },
  async created() {
    this.loading++
    await this._getFileType()
    await this._getEngineType()
    await this._getTreeData()
    // console.log(this.$refs['upload'].$refs['upload-inner'])
    this.editForm.project_id = this.project.project_id
    if (this.title.indexOf('编辑') > -1) {
      this.uploadUrl = `${config.baseurl}/developTask/developModelResManage/editFile`
      await this._queryMetaFileSourceInfo()
      this.editForm.file_name = this.metaFileSourceInfo.file_name
      // this.editForm.file_type = this.metaFileSourceInfo.file_type
      this.editForm.file_desc = this.metaFileSourceInfo.file_desc
      // this.editForm.engine_type = this.metaFileSourceInfo.engine_type
      this.editForm.parent_id = this.metaFileSourceInfo.parent_id
      this.editForm.file_upload_path = this.metaFileSourceInfo.upload_file_path
      this.editForm.id = this.metaFileSourceInfo.id
      // this.$refs['upload'].$refs['upload-inner'].handleClick()
    }
    this.loading--
  },
  methods: {
    async confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.$refs.upload.uploadFiles.length === 0 && this.title.indexOf('新建') > -1) {
            this.$message.warning('请选择上传的文件')
            return
          }
          if (!this.editForm.parent_id) return this.$message.warning('请选择目录')
          if (this.$refs.upload.uploadFiles.length) {
            if (this.title.indexOf('编辑') > -1) {
              this.editForm.upload_file_type = '2'
            }
            this.loading++
            this.$refs.upload.submit()
          } else {
            this.loading++
            this.editForm.upload_file_type = '1'
            this.editForm.file_upload_path = this.editForm.file_upload_path === 'file' ? '' : this.editForm.file_upload_path
            const res = await this.$simpleAsyncTo(editFile({...this.editForm}), '编辑失败')
            if (res) {
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
              this.close()
              this.$root.eventEmitter.emit('refresh')
            }
            this.loading--
          }
        }
      })
    },
    // 类型
    async _getFileType() {
      const res = await this.$simpleAsyncTo(getFileType(), '获取类型失败')
      if (res) {
        this.typeList = res.data
      }
    },
    // 计算类型
    async _getEngineType() {
      const res = await this.$simpleAsyncTo(getEngineType(), '获取计算类型失败')
      if (res) {
        this.engineTypeList = res.data
      }
    },
    selectTreeNodeClick1(data) {
      this.editForm.parent_id = data.id
    },
    // 获取目录列表
    async _getTreeData() {
      const {
        project_id
      } = this.project
      const res = await this.$simpleAsyncTo(
        getTreeData({
          project_id,
          folder_type: '4'
        }),
        '获取列表失败'
      )
      if (res) {
        this.treeData = []
        this.recursionTreeData([res.data], this.treeData)
      }
    },
    recursionTreeData(source, target) {
      source.forEach(item => {
        const {node_type, child} = item
        const treeItem = {
          ...item
        }
        if (child && child.length) {
          treeItem.child = []
          this.recursionTreeData(child, treeItem.child)
        }
        if (node_type === '0') {
          target.push(treeItem)
        }
      })
    },
    beforeUploadHandle(file) {
      console.log(file)
    },
    uploadSuccess(response, file, fileList) {
      if (response.flag) {
        this.$message({type: 'success', message: response.msg})
        this.$refs.upload.clearFiles()
        this.$root.eventEmitter.emit('refresh')
        this.close()
      } else {
        this.$refs.upload.clearFiles()
        this.$message({type: 'error', message: response.msg})
      }
      this.loading--
    },
    uploadError() {
      this.$message({
        type: 'error',
        message: `${this.title}失败`
      })
      this.$refs.upload.clearFiles()
      this.close()
      this.loading--
    },
    // 查询资源
    async _queryMetaFileSourceInfo() {
      const res = await this.$simpleAsyncTo(queryMetaFileSourceInfo({id: this.filter.id}), '获取失败')
      if (res) {
        this.metaFileSourceInfo = res.data
      }
    },
    uploadChange(file, fileList) {
      this.fileList = fileList
      if (this.fileList.length) {
        this.editForm.file_upload_path = 'file'
        this.editForm.file_name = file.name
      } else {
        this.editForm.file_upload_path = ''
      }
    },
    uploadRemove(file, fileList) {
      this.fileList = fileList
      if (this.fileList.length) {
        this.editForm.file_upload_path = 'file'
      } else {
        this.editForm.file_upload_path = ''
      }
    }
  }
}
</script>

<style lang="scss">
.create-source {
  .upload-file {
    .el-button {
      background: #fff;
      border-color: $--color-primary;
      border-radius: 0;
      color: $--color-primary;
    }
  }
}
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
    height: auto;
    max-height: 274px;
    padding-left: 10px;
    overflow: hidden;
    overflow-y: auto;
  }
</style>
