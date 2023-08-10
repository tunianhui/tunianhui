<template>
  <div class="label-basic-edit">
    <div class="label-basic-edit-wrapper">
      <!-- <div class="header">
        <h1 class="font-16">修改标签基础信息</h1>
        <i class="el-icon-close"></i>
      </div> -->
      <div class="label-basic-edit-wrapper-content">
        <el-form :model="labelInfo" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm" label-suffix="：">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="label_code" label="标签英文名" style="color: rgba(0,0,0,0.6)">
                <!-- <el-input v-model="labelInfo.label_code" maxlength="32" show-word-limit disabled></el-input> -->
                {{labelInfo.label_code}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="label_name" label="标签名称" style="color: rgba(0,0,0,0.6)">
                <!-- <el-input
                  v-model="labelInfo.label_name"
                  maxlength="32"
                  show-word-limit
                  placeholder="请输入标签英文名" disabled></el-input> -->
                  {{labelInfo.label_name}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="描述" prop="label_desc" style="color: rgba(0,0,0,0.6)">
            <!-- <el-input type="textarea"
              v-model="labelInfo.label_desc"
              maxlength="128"
              show-word-limit
              :rows="5" disabled></el-input> -->
              {{labelInfo.label_desc}}
          </el-form-item>
          <el-form-item label="选择目录" style="color: rgba(0,0,0,0.6)">
            {{labelInfo.file_catalog}}
            <!-- <el-select
              v-model="labelInfo.category_id"
              placeholder="请选择"
              ref="treeSelect"
              popper-class="select-tree"
              disabled
            >
              <el-option
                :label="labelInfo.file_catalog"
                :value="labelInfo.category_id"
                style="max-height:auto;background-color:#fff"
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
            </el-select> -->
          </el-form-item>
          <el-form-item label="公开状态" prop="auth_status" style="color: rgba(0,0,0,0.6)">
            {{labelInfo.auth_status === '0' ? '公开' : '隐藏'}}
            <!-- <el-select v-model="labelInfo.auth_status" placeholder="请选择公开状态" disabled>
              <el-option label="公开" value="0"></el-option>
              <el-option label="隐藏" value="1"></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item prop="label_table" label="结果表名" style="color: rgba(0,0,0,0.6)">
            {{prefixTable}}{{labelInfo.label_table}}
            <!-- <div class="flex-layout">
              <span>
                {{ prefixTable }}
              </span>
              <el-input
                class="flex-1"
                v-model="labelInfo.label_table"
                maxlength="32"
                show-word-limit
                placeholder="请输入结果表名"
                disabled
              />
            </div> -->
          </el-form-item>
        </el-form>
      </div>
      <!-- <div class="drawer-footer">
        <el-button type="" @click="cancel('ruleForm')" :disabled="disabled">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="disabled">{{confirmText}}</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
import {getTabCategoryList, update} from '@/api/rd/exreact/tag-center'
import { mapGetters } from 'vuex'
export default {
  name: '',
  props: {
    data: Object
  },
  data() {
    return {
      labelInfo: {
        label_code: '',
        label_name: '',
        label_desc: '',
        category_id: '',
        auth_status: '',
        label_table: '',
        file_catalog: ''
      },
      rules: {
        label_code: [
          {required: true, message: '请输入英文名'},
          {
            pattern: /^[a-zA-Z][a-zA-Z_0-9]*$/,
            message: '英文名由字母、数字或下划线(_)组合组成'
          }
        ],
        label_name: [
          {required: true, message: '请输入名称'}
          // {
          //   pattern: /^[a-zA-Z][a-zA-Z_\-0-9]*$/,
          //   message:
          //     '名称由英文、数字、下划线(_)或短划线(-)组成，且开头必须是字母'
          // }
        ],
        label_table: {required: true}
      },
      treeData: [],
      currentNodeKey: '',
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      prefixTable: '',
      confirmText: '确定',
      disabled: false
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  async created() {
    await this.getTreeData()
    const data = this.data.data
    // const result = this.getCurrentPart(data.category_id, this.treeData)
    this.labelInfo.label_code = data.label_code
    this.labelInfo.label_name = data.label_name
    this.labelInfo.label_desc = data.label_desc
    this.labelInfo.auth_status = data.auth_status
    this.labelInfo.label_table = data.label_table
    this.labelInfo.category_id = data.category_id
    this.labelInfo.file_catalog = data.category_name
    this.currentNodeKey = data.category_id
    this.prefixTable = data.project_code + '_'
    this.labelInfo.label_table = this.labelInfo.label_table.substring(this.prefixTable.length)
  },
  methods: {
    getCurrentPart(id, items) {
      let result
      for (var i in items) {
        let item = items[i]
        if (item.id === id || item.id === id + '') {
          result = item
          break
        } else if (item.child) {
          result = this.getCurrentPart(id, item.child)
        }
      }
      return result
    },
    submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let params = {
            label_code: this.labelInfo.label_code,
            label_name: this.labelInfo.label_name,
            label_desc: this.labelInfo.label_desc,
            label_category: this.labelInfo.category_name,
            category_id: this.labelInfo.category_id,
            auth_status: this.labelInfo.auth_status,
            label_table: this.prefixTable + this.labelInfo.label_table,
            project_code: this.labelInfo.project_code,
            project_id: this.labelInfo.project_id,
            business_field_id: this.labelInfo.business_field_id,
            id: this.labelInfo.id
          }
          this.confirmText = '提交中...'
          this.disabled = true
          const res = await this.$simpleAsyncTo(update(params), '编辑失败')
          if (res) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$root.eventEmitter.emit('refresh')
          } else {
            this.confirmText = '确定'
            this.disabled = false
          }
        }
      })
    },
    cancel() {},
    handleNodeClick(data, node) {
      this.labelInfo.category_id = data.id
      this.labelInfo.file_catalog = data.name
      this.$refs.treeSelect.blur()
    },
    async getTreeData() {
      const params = {
        project_code: this.project.project_code
      }
      const res = await this.$simpleAsyncTo(getTabCategoryList(params), '获取失败')
      if (res) {
        this.treeData = []
        this.recursionTreeData(res.data.child, this.treeData)
      }
    },
    recursionTreeData(nodes, arr = []) {
      for (let item of nodes) {
        if (item.name === '工厂标签' || item.name === '手工标签') continue
        let obj = {...item, child: []}
        arr.push(obj)
        if (item.child && item.child.length) this.recursionTreeData(item.child, obj.child)
      }
      return arr
    }
  }
}
</script>

<style lang="scss">
.label-basic-edit {
  height: 100%;
  &-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    .header {
      display: flex;
      height: 56px;
      flex-shrink: 0;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      border-bottom: 1px solid rgba(0,0,0,.1);
      line-height: 36px;
      h1 {
        font-weight: 400;
      }
    }
    &-content {
      flex-grow: 1;
      padding: 20px;
    }
    .drawer-footer {
      display: flex;
      justify-content: flex-end;
      padding: 20px;
    }
  }
}
.select-tree {
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
}
</style>
