<template>
  <SimpleEditDialog
    class="create-function"
    width="650px"
    :title="title"
    :visible="isVisible"
    confirmText="提交"
    @close="close"
    @confirm="confirm"
    parentClass="create-function"
  >
    <el-form
      ref="form"
      :model="filter"
      :rules="rules"
      label-width="140px"
      label-position="right"
      label-suffix="："
    >
      <el-form-item label="编码" prop="catalog_code">
        <el-input
          v-model="filter.catalog_code"
          placeholder="请输入英文名，允许字母、数字或下划线"
          maxlength="32"
          show-word-limit
          :disabled="title.indexOf('编辑') > -1"
        ></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="catalog_name">
        <el-input
          v-model="filter.catalog_name"
          placeholder="请输入名称"
          maxlength="32"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="catalog_desc">
        <el-input
          type="textarea"
          v-model="filter.catalog_desc"
          :rows="3"
          maxlength="128"
          show-word-limit
          resize="none"
        ></el-input>
      </el-form-item>
      <el-form-item label="请选择上级目录" prop="parent_id">
        <el-select
          v-model="filter.parent_id"
          placeholder="请选择"
          ref="treeSelect"
          popper-class="select-tree"
        >
          <el-option
            :label="filter.parent_name"
            :value="filter.parent_id"
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
      <el-form-item label="涉密属性" prop="secret_level">
        <el-radio-group v-model="filter.secret_level">
          <el-radio label="涉密"></el-radio>
          <el-radio label="不涉密"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="共享方式" prop="share_attr">
        <el-radio-group v-model="filter.share_attr">
          <el-radio label="共享"></el-radio>
          <el-radio label="有条件共享"></el-radio>
          <el-radio label="不共享"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文件类型" prop="folder_type">
        <el-radio-group v-model="filter.folder_type">
          <el-radio label="0">目录类目</el-radio>
          <el-radio label="1">标准类目</el-radio>
          <el-radio label="2">地图类目</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图示" prop="icon_code">
        <el-radio-group v-model="filter.icon_code" class="img-radio">
          <el-radio :label="item.label" v-for="item in images" :key="item.label">
            <img :src="require(`@/assets/images/${item.label}`)" alt="">
          </el-radio>
          <!-- <el-radio label="1"></el-radio>
          <el-radio label="2">地图类目</el-radio> -->
        </el-radio-group>
      </el-form-item>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import StandardDialogMixin from '@/mixins/standard-dialog.js'
import {getTreeData, addCatalog, editCatalog} from '@/api/asset/standard/category.js'
export default {
  name: 'CategoryEditDialog',
  mixins: [StandardDialogMixin],
  data() {
    return {
      // form: {},
      filter: {
        parent_id: '',
        catalog_code: '',
        catalog_name: '',
        catalog_desc: '',
        secret_level: '',
        share_attr: '',
        folder_type: '',
        icon_code: ''
      },
      rules: {
        catalog_code: [{required: true, message: '请输入编码'}],
        catalog_name: [{required: true, message: '请输入名称'}],
        secret_level: [{required: true, message: '请选择涉密属性'}],
        share_attr: [{required: true, message: '请选择共享方式'}],
        parent_id: [{required: true, message: '请选择上级目录'}],
        folder_type: [{required: true, message: '请选择文件类型'}],
        icon_code: [{required: true, message: '请选择图示'}]
      },
      treeData: [],
      getTreeDataFetch: getTreeData,
      currentNodeKey: '',
      images: [
        {label: '1.png'},
        {label: '2.png'},
        {label: '3.png'},
        {label: '4.png'},
        {label: '5.png'},
        {label: '6.png'},
        {label: '7.png'},
        {label: '8.png'},
        {label: '9.png'}
      ]
    }
  },
  methods: {
    confirm() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let fn = null,
            params = {}
          if (this.title.indexOf('编辑') > -1) {
            fn = editCatalog
            params = {
              // ...this.filter
              catalog_name: this.filter.catalog_name,
              catalog_code: this.filter.catalog_code,
              catalog_desc: this.filter.catalog_desc,
              parent_id: this.filter.parent_id,
              secret_level: this.filter.secret_level,
              share_attr: this.filter.share_attr,
              icon_code: this.filter.icon_code,
              folder_type: this.filter.folder_type,
              level: this.filter.level,
              catalog_id: this.filter.catalog_id
            }
          } else {
            fn = addCatalog
            params = {
              ...this.filter
            }
          }
          const res = await this.$simpleAsyncTo(fn(params), '新增失败')
          if (res) {
            this.$message({
              type: 'success',
              message: '新增成功！'
            })
            this.$root.eventEmitter.emit('refresh')
            this.close()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.img-radio {
  .el-radio {
    margin-right: 5px;
    .el-radio__input {
      display: none;
    }
    .el-radio__label {
      display: flex;
      padding-left: 0;
      padding: 2px;
      border: 1px solid transparent;
      img {
        width: 40px;
      }
    }
    .el-radio__input.is-checked + .el-radio__label {
      border: 1px solid #409EFF;
    }
  }
}
</style>
