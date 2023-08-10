<template>
  <el-dialog
    :visible.sync="isVisible"
    :title="title"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="create-fact-table"
    top="10vh"
    @close="beforeClose"
  >
    <el-steps
      :space="250"
      :active="activeStep"
      process-status="finish"
      finish-status="success"
      align-center
    >
      <el-step title="基本信息"></el-step>
      <el-step title="数据字典"></el-step>
    </el-steps>
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-width="120px"
      label-position="right"
      label-suffix="："
      class="mt-10"
    >
      <template v-if="activeStep === 0">
        <el-form-item label="编码" prop="range_code" class="custom-item">
          <el-input
            v-model="formData.range_code"
            show-word-limit
            maxlength="32"
            placeholder="最多输入32个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="range_name" class="custom-item">
          <el-input
            v-model="formData.range_name"
            show-word-limit
            maxlength="32"
            placeholder="最多输入32个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="上级目录" prop="catalog_id">
          <el-select
            v-model="formData.catalog_id"
            placeholder="请选择"
            ref="treeSelect"
            popper-class="select-tree"
          >
            <el-option
              :label="formData.catalog_name"
              :value="formData.catalog_id"
              style="max-height:150px;background-color:#fff"
            >
              <el-tree
                :data="treeData"
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
        </el-form-item>
        <el-form-item label="别名" prop="range_alias" class="custom-item">
          <el-input
            v-model="formData.range_alias"
            show-word-limit
            maxlength="32"
            placeholder="最多输入32个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="range_desc">
          <el-input
            type="textarea"
            v-model="formData.range_desc"
            :rows="3"
            maxlength="128"
            show-word-limit
            resize="none"
          ></el-input>
        </el-form-item>
      </template>
      <template v-else>
        <el-button
          type="primary"
          title="新增"
          class="el-icon-plus mb-10"
          @click="add"
          size="mini"
        >新增</el-button>
        <el-table
          :data="formData.params"
          style="width: 100%"
          max-height="200px">
          <el-table-column
            prop="param_key"
            label="值编码">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.param_key"
                  maxlength="32"
                  placeholder="请输入值编码"
                ></el-input>
              </template>
          </el-table-column>
          <el-table-column
            prop="param_value"
            label="值名称">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.param_value"
                maxlength="32"
                placeholder="请输入值名称"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="param_desc"
            label="值描述">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.param_desc"
                maxlength="32"
                placeholder="请输入值描述"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80px" align="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                title="删除"
                class="el-icon-delete font-14"
                @click="delParamsHandle(scope.row, scope.$index)"
              ></el-button>
             </template>
          </el-table-column>
        </el-table>
      </template>
    </el-form>
    <div slot="footer">
      <el-button @click="beforeClose">取消</el-button>
      <el-button type="primary" @click="nextStep" v-if="activeStep === 0"
        >下一步</el-button
      >
      <el-button type="primary" @click="activeStep = 0" v-if="activeStep === 1"
        >上一步</el-button
      >
      <el-button type="primary" @click="confirm" v-if="activeStep === 1"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import StandardDialogMixin from '@/mixins/standard-dialog.js'
import {
  getTreeData,
  saveDict,
  editDict
} from '@/api/asset/standard/dict.js'
export default {
  name: 'DictEditDialog',
  props: {
    visible: Boolean
  },
  mixins: [StandardDialogMixin],
  data() {
    return {
      activeStep: 0,
      rules: {
        range_name: [{required: true, message: '请输入名称'}],
        range_code: [{required: true, message: '请输入编码'}],
        catalog_id: [{required: true, message: '请选择上级目录'}]
      },
      formData: {
        range_name: '',
        range_desc: '',
        catalog_id: '',
        range_code: '',
        range_alias: '',
        params: []
      },
      getTreeDataFetch: getTreeData,
      treeData: [],
      currentNodeKey: ''
    }
  },
  async created() {
    await this.getTreeData()
    if (this.title.indexOf('编辑') > -1) {
      this.formData.range_name = this.data.range_name
      this.formData.range_desc = this.data.range_desc
      this.formData.range_code = this.data.range_code
      this.formData.range_alias = this.data.range_alias
      this.formData.params = this.data.params
      this.formData.catalog_id = this.data.parentId
      this.formData.catalog_name = this.data.catalog_name
      this.currentNodeKey = this.data.parentId
    }
  },
  methods: {
    beforeClose() {
      this.activeStep = 0
      this.close()
    },
    async confirm() {
      let fn = null, msg = ''
      const params = {
        ...this.formData
      }
      if (this.title.indexOf('编辑') > -1) {
        fn = editDict
        msg = '修改'
        params.range_id = this.data.range_id
      } else {
        fn = saveDict
        msg = '保存'
      }
      const res = await this.$simpleAsyncTo(fn(params), `${msg}失败`)
      if (res) {
        this.$message({
          type: 'success',
          message: `${msg}成功`
        })
        this.$root.eventEmitter.emit('refresh')
        this.beforeClose()
      }
    },
    nextStep() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.activeStep = 1
        }
      })
    },
    add() {
      this.formData.params.push({param_key: '', param_value: '', param_desc: ''})
    },
    delParamsHandle(row, index) {
      this.formData.params.splice(index, 1)
    },
    recursionTreeData(data, target) {
      data.forEach(item => {
        const { catalog_id, catalog_name, children, catalog_code, type } = item
        const treeItem = {
          label: catalog_name,
          ...item,
          id: catalog_id,
          code: catalog_code
        }
        if (children && children.length) {
          treeItem.children = []
          this.recursionTreeData(children, treeItem.children)
        }
        if (type === 'folder') {
          target.push(treeItem)
        }
      })
    },
    handleNodeClick(data, node) {
      this.formData.catalog_id = data.id
      this.formData.catalog_name = data.label
      this.$refs.treeSelect.blur()
    }
  }
}
</script>
