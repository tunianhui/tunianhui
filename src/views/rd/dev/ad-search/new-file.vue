<template>
  <el-dialog :title="`${title}文件`" :visible.sync="isVisible" append-to-body width="35%" :close-on-click-modal="false" :close-on-press-escape="false" custom-class="create-fact-table" @close="beforeClose" v-draggable="{
      trigger: `.create-fact-table .el-dialog__header`,
      body: `.create-fact-table.el-dialog`,
      recover: false
    }">
    <el-form :model="formFile" label-suffix="：" :rules="formFileRules" ref="form">
      <el-form-item label="名称" :label-width="formLabelWidth" prop="file_name">
        <el-input v-model="formFile.file_name" autocomplete="off" maxlength="32" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="formFile.desc" maxlength="128" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
        <el-select type="type" v-model="formFile.type">
          <el-option label="DDL(create/drop/alter)" value="DDL"></el-option>
          <el-option label="DML(select/desc)" value="DML"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择目录" :label-width="formLabelWidth" prop="catalogid">
        <el-select v-model="formFile.catalogid" placeholder="请选择" ref="treeSelect">
          <el-option :label="formFile.file_catalog" :value="formFile.catalogid" style="max-height:auto;background-color:#fff;padding: 0;font-weight:400">
            <el-tree :data="treeData" :props="defaultProps" accordion :highlight-current="true" :expand-on-click-node="false" @node-click="handleNodeClick">
            </el-tree>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submitNewFile">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
// import {types} from '@/config/rd-config'
import { getNewBuildFile, getTreeData } from '@/api/rd/ad-search'
import { mapGetters } from 'vuex'
import { types, treeTypes } from '@/config/rd-config'
export default {
  name: 'NewFile',
  mixins: [editDialog],
  inject: ['tabStore'],
  components: {
    // TreeSelect
  },
  props: {
    visible: Boolean,
    title: {
      type: String
    },
    data: {
      type: Object
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  data () {
    return {
      isVisible: false,
      formLabelWidth: '100px',
      formFile: {
        file_name: '',
        desc: '',
        catalogid: '',
        file_catalog: '',
        type: 'DDL'
      },
      folders: [],
      formFileRules: {
        file_name: [
          { required: true, message: '请输入文件名称', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/,
            trigger: ['blur', 'change'],
            message: '只能输入汉字，英文或数字，不能数字开头'
          }
        ],
        catalogid: [
          { required: true, message: '请选择文件目录', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择文件类型', trigger: 'change' }
        ]
      },
      treeData: [],
      catalogId: '',
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      treeShow: false,
      file_catalog: ''
    }
  },
  async created () {
    await this.getTreeData()
    if (this.treeData && this.treeData.length) {
      this.formFile.catalogid = this.treeData[0].id
      this.formFile.file_catalog = this.treeData[0].name
    }
  },
  methods: {
    beforeClose () {
      this.close()
    },
    // 获取文件所有目录
    async getTreeData () {
      this.loading++
      const params = {
        folder_type: treeTypes[types.ADSEARCH],
        project_id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(getTreeData(params), '获取树列表失败')
      if (res) {
        let data = res.data.child
        this.doDelete(data)
        this.treeData = [
          {
            id: res.data.id,
            node_type: res.data.node_type,
            name: res.data.name,
            child: data
          }
        ]
      }
      this.loading--
    },
    submitNewFile () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.globalLoading()
          const params = {
            project_id: this.project.project_id,
            folder_name: this.formFile.file_name,
            folder_desc: this.formFile.desc,
            parent_id: this.formFile.catalogid,
            txt_type: this.formFile.type
          }
          const res = await this.$simpleAsyncTo(getNewBuildFile(params), '新建文件失败')
          if (res) {
            this.$message({
              type: 'success',
              message: '新建成功'
            })
          }
          this.$root.eventEmitter.emit('refresh')
          this.beforeClose()
          this.globalLoading().close()
        }
      })
    },
    doDelete (treeData) {
      for (let i = treeData.length; i > 0; i--) {
        if (treeData[i - 1].node_type === '1' || treeData[i - 1].node_type === 1) {
          treeData.splice(i - 1, 1)
        } else {
          if (treeData[i - 1].child) {
            this.doDelete(treeData[i - 1].child)
          }
        }
      }
    },
    handleNodeClick (data, node, e) {
      this.formFile.file_catalog = data.name
      this.formFile.catalogid = data.id
      this.$refs.treeSelect.blur()
    }
  }
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
</style>
