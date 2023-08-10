<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-07-26 10:01:48
 * @LastEditTime: 2021-08-09 14:31:13
 * @Description:
-->
<template>
  <el-dialog title="上传文件" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @close="cancelBtn">
    <div class="mb-10 upload-file">
      <el-upload drag action="" ref="upload" required :auto-upload="false" :file-list="fileList" :on-change="change">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">拖拽文件到这里一次只限1份,或<em>点击添加文件</em></div>
        <div class="el-upload__tip" slot="tip">文件大小不能超过50M</div>
      </el-upload>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelBtn">取 消</el-button>
      <el-button type="primary" @click="confirmBtn">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  importFile
} from '@/api/asset/catalogue'
export default {
  name: 'uploadFile',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    cancelBtn() {
      this.$emit('cancelBtn')
    },
    async confirmBtn() {
      if (this.fileList.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择要上传的文件！'
        })
      } else {
        let fd = new FormData()
        fd.append('file', this.fileList[0].raw)
        const res = await this.$simpleAsyncTo(importFile(fd), '上传文件失败!')
        if (res) {
          this.$message({
            type: 'success',
            message: '上传文件成功'
          })
          this.$emit('confirmBtn')
        }
      }
    },
    change(file) {
      this.fileList = []
      this.fileList.push(file)
    }
  }
}
</script>
<style lang="scss">
  .el-upload-list {
    width: 360px;
    margin: 0 auto;
  }
</style>
<style lang="scss" scoped>
.upload-file{
  text-align: center;
}
</style>
