<template>
  <div class="batch-import height-100per flex-column">
    <div class="batch-import-content" v-if="!showMappingAnalysis">
      <div>
        <el-radio-group v-model="selectRadio">
          <el-radio :label="1" border style="height: auto">
            <span>
              <span>创建表工单模版</span>
              <div>
                仅用于创建表工单，不同分层的表存放在不同的表格中；目前仅支持Hive，单次支持上传10张表。
              </div>
              <div>
                <el-button type="text" @click="downloadTemplate"
                  >下载模版</el-button
                >
                <el-button type="text" @click="previewTemplate"
                  >预览模版</el-button
                >
              </div>
            </span>
          </el-radio>
          <el-radio :label="2" border style="height: auto">
            <span>
              <span>综合表工单模版</span>
              <div>
                支持根据表的实际情况创建表工单及修改表工单，一般用于模型迁移；目前仅支持Hive
              </div>
              <div>
                <el-button type="text" @click="previewTemplate"
                  >预览模版</el-button
                >
              </div>
            </span>
          </el-radio>
        </el-radio-group>
      </div>
      <div>
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">上传文件</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
        <el-alert
          title="解析成功N张表记录，请点击下一步"
          type="success"
          show-icon
          :closable="false"
        >
        </el-alert>
        <el-button type="primary" @click="analyticCompletionNext"
          >下一步</el-button
        >
      </div>
    </div>
    <div class="batch-import-content" v-else>
      <MappingAnalysis />
    </div>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import MappingAnalysis from './mapping-analysis.vue'

export default {
  name: 'BatchImport',
  mixins: [pager],
  components: {
    MappingAnalysis,
  },
  data() {
    return {
      showMappingAnalysis: false,
      selectRadio: 1,
      fileList: [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
        {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    analyticCompletionNext() {
      this.showMappingAnalysis = !this.showMappingAnalysis
    },
    downloadTemplate() {
      this.$message({
        type: 'error',
        message: '待对接接口',
      })
    },
    previewTemplate() {
      this.$message({
        type: 'error',
        message: '待对接接口',
      })
    },
  },
}
</script>
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  overflow: hidden;
  overflow-y: auto;
  padding-left: 10px;
}
.page-title {
  margin-bottom: 50px;
}
</style>
<style lang="scss">
.batch-import {
  .batch-import-content {
  }
}
</style>
