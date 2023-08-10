<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    width="600px"
    custom-class="add-edit-view-modal"
  >
    <div class="tip mb-15">
      <div class="tip-icon">
        <i class="iconfont icon-tip"></i>
      </div>
      <div class="tip-text">
        <span>1.页面多个审批节点，上一节点通过才会进入下一审批节点，所有审批节点均通过任务才审批通过，任一节点驳回任务即审批失败</span>
        <span>2.如果单个节点设置了多个审批人，则任一审批人通过当前节点即通过，任一审批人驳回当前节点即驳回</span>
      </div>
    </div>
    <el-form :model="form" :label-width="formLabelWidth" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="模板名称" prop="name">
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入模板名称" v-if="viewType !== 'view'"></el-input>
            <span v-else>{{form.name}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用场景" prop="use">
            <el-select v-model="form.use" placeholder="请选择使用场景" v-if="viewType !== 'view'">
              <el-option label="场景一" value="1"></el-option>
              <el-option label="场景二" value="2"></el-option>
            </el-select>
            <span v-else>{{form.use}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="form.desc" placeholder="请输入模板描述" v-if="viewType !== 'view'"></el-input>
        <span v-else>{{form.desc}}</span>
      </el-form-item>
      <el-row>
        <el-col :style="{width: formLabelWidth, 'text-align': 'right', 'padding-right': '12px'}" class="mb-15">
          <span style="content: '*';color: #F56C6C;margin-right: 4px;">*</span>
          审批节点
        </el-col>
        <el-col :style="{flex: 1}" class="mb-10">
          <el-table
            :data="nodeList"
            style="width: 100%"
            row-key="id"
            max-height="230"
            >
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column prop="username" label="审批人">
              <template slot-scope="scope">
                <MultipleSelectCheckBox v-model="scope.row.username" :options="userNameList" style="width:100%" v-if="viewType !== 'view'"></MultipleSelectCheckBox>
                <span v-else>{{scope.row.username}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="审批节点描述(选填)"
              width="180"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.username.desc" placeholder="请输入模板描述" v-if="viewType !== 'view'"></el-input>
                <span v-else>{{scope.row.username.desc}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="action" width="50" v-if="viewType !== 'view'">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="medium"
                  @click="handleDelete(scope.$index)">
                    <i class="el-icon-delete"></i>
                  </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
    <el-divider v-if="viewType !== 'view'"></el-divider>
    <div class="mb-10" v-if="viewType !== 'view'">
      <el-button type="primary" @click="addTemplate">添加审批节点</el-button>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import MultipleSelectCheckBox from '@/components/multipleSelectCheckBox.vue'
import { uuid } from '@/libs/util.js'
export default {
  name: 'AddEditViewModal',
  props: {
    title: String,
    viewType: String,
  },
  components: {
    MultipleSelectCheckBox
  },
  data () {
    return {
      dialogFormVisible: true,
      form: {
        name: '',
        use: '',
        desc: ''
      },
      formLabelWidth: '90px',
      rules: {
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        use: [
          { required: true, message: '请选择使用场景', trigger: 'change' }
        ]
      },
      userNameList: [
        {
          label: '选项1',
          value: '1'
        },
        {
          label: '选项2',
          value: '2'
        }
      ],
      nodeList: [
        {
          username: [],
          desc: '',
          id: uuid(16)
        }
      ]
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    submit () {
      this.$emit('submit', {...this.form, nodeList: this.nodeList})
    },
    reset () {
      this.form = {
        name: '',
        use: '',
        desc: '',
        nodeList: []
      }
    },
    addTemplate() {
      this.nodeList.push({
        username: [],
        desc: '',
        id: uuid(16)
      })
    },
    handleDelete(index) {
      this.nodeList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-edit-view-modal {
  .tip {
    display: flex;
    font-size: 12px;
    background: RGB(230,242,255);
    padding: 10px;
    .tip-icon {
      margin-right: 8px;
      i {
        font-size: 16px;
        color: #409eff;
      }
    }
    .tip-text {
      display: flex;
      flex-direction: column;
      color: rgba(0,0,0,.75);
      span {
        line-height: 1.8
      }
    }
  }
  .el-form-item--mini.el-form-item {
    margin-bottom: 12px;
  }
  .el-divider--horizontal {
    margin: 15px 0!important;
  }
}
</style>