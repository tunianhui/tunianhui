<template>
  <section class="func-attr side-attr">
    <div class="subtitle mb-10">
      <div>
        <!-- <span class="mr-10">{{viewInfo.process_code}}</span> -->
        <!-- <span class="status-tag-right">{{getDicsValue('status_tag', viewInfo.status)}}</span> -->
      </div>
      <div class="attr-name">{{viewInfo.file_name}}</div>
    </div>
    <div class="operate-btn mb-20" style="border-bottom:1px solid #e8e8e8;padding-bottom:15px;">
      <el-button type="primary" icon="el-icon-edit-outline" @click="handleEdit">编辑</el-button>
      <!-- <el-button type="primary" v-clipboard="{value: viewInfo.name}">copy 引用</el-button> -->
    </div>
    <el-form class="view-form" label-width="110px" label-position="right" label-suffix="：" v-loading="loading" style="font-size: 12px;">
      <el-form-item label="名称">
        <div>{{viewInfo.file_name}}</div>
      </el-form-item>
      <el-form-item label="类型">
        <div>{{viewInfo.file_type}}</div>
      </el-form-item>
      <el-form-item label="大小">
        <div>{{viewInfo.file_size}}</div>
      </el-form-item>
      <el-form-item label="描述">
        <div>{{viewInfo.file_desc}}</div>
      </el-form-item>
      <el-form-item label="责任人">
        <div>{{viewInfo.create_user}}</div>
      </el-form-item>
      <el-form-item label="创建时间">
        <div>{{viewInfo.create_time}}</div>
      </el-form-item>
      <el-form-item label="更新人">
        <div>{{viewInfo.modify_user}}</div>
      </el-form-item>
      <el-form-item label="更新时间">
        <div>{{viewInfo.modify_time}}</div>
      </el-form-item>
      <el-form-item label="引用路径">
        <div>{{viewInfo.upload_file_path}}</div>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {queryMetaFileSourceInfo} from '@/api/rd/source-manage.js'
export default {
  name: 'SourceManageAttr',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  // watch: {
  //   data: {
  //     handler(val) {
  //       this.viewInfo = val.data
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // },
  computed: {
    ...mapGetters(['project', 'activeTreeId'])
  },
  // filters: {
  //   getFileSize(fileByte) {
  //     var fileSizeByte = fileByte
  //     var fileSizeMsg = ''
  //     if (fileSizeByte < 1024) fileSizeMsg = fileSizeByte + 'B'
  //     else if (fileSizeByte < 1048576 && fileSizeByte >= 1024) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + 'KB'
  //     else if (fileSizeByte === 1048576) fileSizeMsg = '1MB'
  //     else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + 'MB'
  //     else if (fileSizeByte > 1048576 && fileSizeByte === 1073741824) fileSizeMsg = '1GB'
  //     else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  //     else fileSizeMsg = '文件超过1TB'
  //     return fileSizeMsg
  //   }
  // },
  data() {
    return {
      viewInfo: {},
      loading: false
    }
  },
  created() {
    this._queryMetaFuncInfo()
  },
  methods: {
    ...mapMutations({
      setActiveTreeId: 'SET_ACTIVE_TREE_ID',
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    // 查询函数
    async _queryMetaFuncInfo() {
      this.loading++
      const res = await this.$simpleAsyncTo(queryMetaFileSourceInfo({id: this.data.data.id}), '获取资源信息失败')
      if (res) {
        this.viewInfo = res.data
      }
      this.loading--
    },
    handleEdit(data, node) {
      this.setActiveRdEditDialog({
        title: '编辑资源',
        component: 'SourceManageEdit',
        data: {...this.project, ...this.data.data}
      })
    }
  }
}
</script>

<style lang="scss">
.func-attr {
  .view-form {
    .el-form-item {
      margin-bottom: 5px;
      display: flex;
      align-items: center;
    }
    .el-form-item__label {
      color: $grey4;
      max-width: 150px;
      font-size: 12px;
    }
    .el-form-item__content {
      flex: 1;
      margin-left: 0!important;
      font-size: 12px;
    }
  }
}
</style>
