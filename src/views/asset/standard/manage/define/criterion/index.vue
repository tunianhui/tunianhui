<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-08-07 16:50:50
 * @LastEditTime: 2021-08-07 16:52:45
 * @Description:
-->
<template>
  <div class='define-criterion side-view'>
    <div class="sv-head">
      <strong>{{ $route.meta.name }}</strong>
      <span>
        <i class="icon el-icon-refresh" title="刷新" @click="getTreeData"></i>
        <i class="icon el-icon-document-add" @click="addCriterion"></i>
        <i class="el-icon-upload2" @click="batchUpdate"></i>
      </span>
    </div>
    <NodePopper v-model="visibleFileBrief" popper-class="dark-popper" :node="popperNode">
      <div class="tree-node-brief">
        <div class="brief-tag" :type="fileBrief.status">
          {{ getDicsValue('status_tag', fileBrief.status) || '测试' }}
        </div>
        <div class="brief-head">
          <p class="value">{{ fileBrief.std_code }}</p>
          <p class="value">{{ fileBrief.std_name }}</p>
        </div>
        <div class="brief-body">
          <p>
            <span class="label">操作人：</span>
            <span class="value">{{ fileBrief.oper_user }}</span>
          </p>
          <p>
            <span class="label">操作时间：</span>
            <span class="value">{{ fileBrief.oper_time }}</span>
          </p>
        </div>
      </div>
    </NodePopper>
    <el-tree class="sv-tree" ref="tree" v-loading="!!loading" highlight-current :node-key="nodeKey" :data="treeData" :current-node-key="curNodeKey" :default-expanded-keys="expandedKeys" :auto-expand-parent="true" :filter-node-method="filterNode" :render-content="renderContent" :current-change="currentChange" @node-click="nodeClick" @mouseover.native="nodeMouseover" @mouseout.native="nodeMouseout"></el-tree>
    <div class="sv-bottom" @click="openObjectTable('CRITERION')">
      <span>标准查询列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>

    <el-dialog title="上传文件" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @close="cancelBtn" width="500px">
      <div class="mb-10 upload-file">
        <el-upload drag :action="uploadUrl" ref="upload" required :auto-upload="false" :file-list="fileList" :on-change="change" :onSuccess="uploadSuccess" :onError="uploadError" accept="xlsx,xls" style="width:100%" class="standard-upload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text" style="width:100%">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div style="text-align:end" class="mt-15">
          <a :href="downloadUrl" download>下载模板</a>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBtn">取 消</el-button>
        <el-button type="primary" @click="confirmBtn">导 入</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTreeData, deleteStandard } from '@/api/asset/standard/criterion.js'
// import {delCatalog} from '@/api/asset/standard/category.js'
import StandardMixin from '@/mixins/standard-tree.js'
import { types } from '@/config/asset-config'
import StandardTable from '@/mixins/standard-table'
import config from '@/config'

export default {
  name: 'Criterion',
  mixins: [StandardMixin, StandardTable],
  props: {},
  components: {},
  data () {
    return {
      getTreeDataFetch: getTreeData,
      loading: 0,
      treeData: [],
      nodeKey: '',
      curNodeKey: '',
      expandedKeys: [],
      currentChange: [],
      delFetch: deleteStandard,
      paramsKey: 'std_id',
      downloadUrl: `${config.baseurl}/standardManagement/downTemplate`,
      uploadUrl: `${config.baseurl}/standardManagement/importFile`
    }
  },
  computed: {},
  created () {
    this.getTreeData()
  },
  mounted () { },
  methods: {
    addCriterion () {
      this.tabStore.commit('add', {
        label: '新建标准',
        tabType: types.CRITERION,
        name: Date.now() + '',
        component: 'CriterionEdit',
        data: {}
      })
    },
    modifyFile (data, node) {
      this.tabStore.commit('add', {
        label: '编辑标准',
        tabType: types.CRITERION,
        name: data.id,
        component: 'CriterionEdit',
        data
      })
    },
    recursionTreeData (source, target) {
      source.forEach(item => {
        const { catalog_id, catalog_name, children, icon_code, catalog_code, type, std_name, std_id, std_code } = item
        const treeItem = {
          label: type === 'folder' ? catalog_name : std_name,
          total: children && children.length,
          img: icon_code,
          icon: type === 'folder' ? '' : this.$route.meta && this.$route.meta.icon,
          ...item,
          id: type === 'folder' ? catalog_id : std_id,
          code: type === 'folder' ? catalog_code : std_code,
          type
        }
        this.briefMap[type === 'folder' ? catalog_id : std_id] = item
        if (children && children.length) {
          treeItem.children = []
          this.recursionTreeData(children, treeItem.children)
        }
        target.push(treeItem)
      })
    },
    nodeClick (data, node) {
      if (data.type === 'node') {
        const attr = {
          title: this.$route.meta.name,
          attrType: this.$route.name,
          name: data.id,
          label: data.label,
          data
        }
        this.attrStore.commit('add', attr)
        this.attrStore.commit('setActiveToFirst', attr)
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
.standard-upload {
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
}
</style>
