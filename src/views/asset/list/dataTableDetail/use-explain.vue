<template>
  <div class="use-explain" :style="{height: `${widthHeightData}px`}">
    <div class="header-breadcrumb">
      <div class="left">
        <div>使用说明列表</div>
      </div>
      <div class="right">
        <el-button type="primary" @click="add" v-if="handler === 'add'">新增使用说明</el-button>
        <el-button type="primary" @click="edit" v-if="handler === 'edit'">编辑使用说明</el-button>
      </div>
    </div>
    <div v-show="active === 'list' && JSON.stringify(contentObj) !== '{}'" class="content-wrapper">
      <div class="header">
        <span>使用说明</span>
        <span>
          <i class="iconfont icon-zerenren"></i>
          <span class="create-user">{{contentObj.create_user}}</span>
          <span class="date">{{contentObj.oper_time}}</span>
          <span class="edit" @click="edit">
            <i class="el-icon-edit-outline"></i>
            <span>编辑</span>
          </span>
          <span class="delete" @click="deleteuse">
            <i class="el-icon-delete"></i>
            <span>删除</span>
          </span>
        </span>
      </div>
      <div class="body" v-html="contentObj.use_content">
      </div>
    </div>
    <div v-show="active === 'list' && JSON.stringify(contentObj) === '{}'" style="    text-align: center;-top: 50px;">
      <img :src="require('@/assets/images/TB1.png')" alt="">
      <p style="color:rgba(0,0,0,0.5)">暂无数据</p>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-show="active === 'form'" label-position="top">
      <el-form-item label="使用说明标题" prop="use_title">
        <el-input v-model="ruleForm.use_title"></el-input>
      </el-form-item>
      <el-form-item label="使用说明标题" prop="use_content" class="Editor">
        <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :defaultConfig="toolbarConfig"
            :mode="mode"
        />
        <Editor
            style="height: 200px; overflow-y: hidden;"
            v-model="ruleForm.use_content"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
        />
      </el-form-item>
      <el-form-item>
        <div class="custom">
          <el-button type="default" @click="active='list'">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { saveUseDesc, queryByCubeId, editUseDesc, deleteUseDesc } from '@/api/asset/map'
import '@wangeditor/editor/dist/css/style.css'
export default {
  name: 'UseExplain',
  props: {
    widthHeightData: Object,
    tableInfo: Object
  },
  components: {
    Editor,
    Toolbar,
  },
  watch: {
    widthHeightData: {
      handler(val) {
        this.$nextTick(_ => {
          this.tableHeight = parseInt(val.height) - 80
        })
      },
      immediate: true
    },
    active: {
      handler(val) {
        if (val === 'form') {
          this.$nextTick(_ => {
            
          })
        } else {
        }
      }
    },
  },
  data() {
    return {
      tableHeight: 0,
      tableData: [],
      active: 'list',
      ruleForm: {
        use_title: '',
        use_content: ''
      },
      rules: {
        use_title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        use_content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      editor: null,
      toolbarConfig: { },
      editorConfig: { placeholder: '请输入内容...' },
      mode: 'default',
      handler: '',
      contentObj: {}
    }
  },
  created() {
    this.getTableList()
  },
  mounted() {
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    add() {
      this.active = 'form'
      this.handler = 'add'
    },
    edit() {
      this.active = 'form'
      this.ruleForm.use_title = this.contentObj.use_title
      this.ruleForm.use_content = this.contentObj.use_content
    },
    save() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          const params = {
            cube_id: this.tableInfo.cube_id,
            ...this.ruleForm
          }
          let fn = null
          if (this.handler === 'add') {
            fn = saveUseDesc
          } else {
            fn = editUseDesc
          }
          const res = await this.$simpleAsyncTo(fn(params), '保存失败')
          if (res) {
            this.active = 'list'
            this.getTableList()
          }
        }
      })
    },
    async getTableList() {
      const res = await this.$simpleAsyncTo(queryByCubeId({cube_id: this.tableInfo.cube_id}), '获取数据失败')
      if (res) {
        this.contentObj = res.data
        if (JSON.stringify(this.contentObj) === '{}'){
          this.handler = 'add'
        } else {
          this.handler = 'edit'
        }
      }
    },
    deleteuse() {
      this.$confirm('此操作将永久删除该使用说明, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$simpleAsyncTo(deleteUseDesc({cube_id: this.tableInfo.cube_id}), '删除失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTableList()
          this.active = 'list'
        }
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })       
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  &.Editor .el-form-item__content {
    border: 1px solid #ccc;
    z-index: 100; /* 按需定义 */
  }
} 
#toolbar-container { border-bottom: 1px solid #ccc; }
#editor-container { height: 300px; }
.use-explain {
  .header-breadcrumb {
    height: 35px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    align-items: center;
  }
  .content-wrapper {
    margin-top: 5px;
    .header {
      display: flex;
      align-items: center;
      height: 28px;
      line-height: 28px;
      background: #f0f3f4;
      justify-content: space-between;
      color: rgba($color: #000000, $alpha: 0.7);
      font-size: 14px;
      .create-user {
        margin: 0 5px 0 0;
      }
      .date {
        margin: 0 5px
      }
      .edit,.delete {
        cursor: pointer;
        color: #6b87d4;
        margin: 0 5px;
        i {
          margin-right: 3px;
        }
      }
    }
    .body {
      background: #fafcfb;
      padding: 20px;
    }
  }
  .custom {
    text-align: end;
  }
}
</style>