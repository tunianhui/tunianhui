<template>
  <div class="add-edit-dialog">
    <el-dialog
      :title="title"
      :visible.sync="NewBuildProjectVisible"
      width="47%"
      @close="closeHandle"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}"
    >
      <el-form
        :model="ProjectForm"
        label-width="120px"
        :rules="ProjectFormRules"
        ref="ProjectForm"
        label-suffix="："
      >
        <div class="third-title">基本设置</div>
        <el-form-item label="英文名" prop="project_code">
          <el-input
            v-model="ProjectForm.project_code"
            autocomplete="off"
            maxlength="32"
            show-word-limit
            :disabled="is_disabled"
          >
            <!-- <template slot="prepend">
              <OverflowTooltip style="width:80px" :class="[busin_code?'':'text-right']">{{`${busin_code}`}}
              </OverflowTooltip>
            </template> -->
          </el-input>
        </el-form-item>
        <el-form-item label="名称" prop="project_name">
          <el-input
            v-model="ProjectForm.project_name"
            maxlength="32"
            show-word-limit
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="英文名" prop="project_code">
              <el-input
                v-model="ProjectForm.project_code"
                autocomplete="off"
                maxlength="32"
                show-word-limit
                :disabled="is_disabled"
                style="width: 80%"
              >
                <template slot="prepend">
                  <OverflowTooltip style="width:80px">{{`${busin_code}`}}</OverflowTooltip>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="project_name">
              <el-input
                v-model="ProjectForm.project_name"
                maxlength="32"
                show-word-limit
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述" prop="project_desc">
              <el-input
                v-model="ProjectForm.project_desc"
                type="textarea"
                :rows="2"
                placeholder="请输入项目描述，128字符以内"
                show-word-limit
                maxlength="128"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="计算引擎源" prop="engine_id">
              <el-select v-model="ProjectForm.engine_id" placeholder=" " :disabled="is_disabled">
                <el-option
                  v-for="item in engine_options"
                  :key="item.id"
                  :label="item.engine_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="物理数据源" prop="data_source_id">
              <el-select
                v-model="ProjectForm.data_source_id"
                placeholder="缺省数据库名与项目英文名相同"
                multiple
              >
                <el-option
                  v-for="item in data_source_options"
                  :key="item.id"
                  :label="item.data_source_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="line"></div>
        <div class="third-title">命名空间</div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="业务板块" prop="busin_id">
              <el-select v-model="ProjectForm.busin_id" placeholder=" " @change="changeBusin">
                <el-option
                  v-for="item in busin_options"
                  :key="item.busin_id"
                  :label="item.busin_name"
                  :value="item.busin_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="空间类型" prop="space_type">
              <el-select v-model="ProjectForm.space_type" placeholder=" ">
                <el-option
                  v-for="item in spaceType_options"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeHandle">取 消</el-button>
        <el-button type="primary" @click="NewBuildProject('ProjectForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import OverflowTooltip from '@c/overflow-tooltip'
import {
  getSourceListType,
  getListBusiness,
  getDataSource,
  newBuildProject,
  editProject,
  getSpaceTypeList
} from '@/api/plan/project-manage'
import {mapGetters} from 'vuex'
export default {
  name: 'AddEditDialog',
  props: {
    projectData: {
      type: Object
    }
  },
  components: {
    // OverflowTooltip
  },
  computed: {
    ...mapGetters(['project'])
  },
  // watch: {
  //   'ProjectForm.busin_id': {
  //     immediate: true,
  //     handler(val) {
  //       let a = this.busin_options.filter(e => {
  //         return val === e.busin_id
  //       })
  //       if (a.length) {
  //         this.busin_code = a[0].busin_code + '_'
  //         // this.ProjectForm.project_code = a[0].busin_code + '_'
  //       }
  //     }
  //   }
  // },
  data() {
    return {
      NewBuildProjectVisible: true,
      ProjectForm: this.resetProjectForm(),
      engine_options: [], // 计算引擎列表
      data_source_options: [], // 物理数据源
      busin_options: [], // 业务板块列表
      spaceType_options: [], // 空间类型类列表
      ProjectFormRules: {
        project_code: [
          {required: true, message: '请输入英文名'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ],
        project_name: [
          {required: true, message: '请输入中文名称', trigger: 'blur'}
        ],
        engine_id: [
          {required: true, message: '请选择计算引擎源', trigger: 'change'}
        ],
        busin_id: [
          {required: true, message: '请选择业务模块', trigger: 'change'}
        ],
        space_type: [
          {required: true, message: '请选择空间类型', trigger: 'change'}
        ]
      },
      is_disabled: false,
      title: null,
      busin_code: ''
    }
  },
  created() {
    this.getSourceList()
    this.getBusinessList()
    this.getDataSourceList()
    this.getSpaceType()
    if (JSON.stringify(this.projectData) === '{}') {
      this.ProjectForm = this.resetProjectForm()
      this.is_disabled = false
      this.title = '新建项目'
    } else {
      this.ProjectForm.project_code = this.projectData.project_code
      this.ProjectForm.project_name = this.projectData.project_name
      this.ProjectForm.project_desc = this.projectData.project_desc
      this.ProjectForm.engine_id = this.projectData.engine_id
      this.ProjectForm.busin_id = this.projectData.busin_id
      this.ProjectForm.data_source_id = this.projectData.data_source_id
      this.ProjectForm.space_type = this.projectData.space_type
      this.is_disabled = true
      this.title = '编辑项目'
    }
  },
  methods: {
    // 新建项目表单初始化
    resetProjectForm() {
      return {
        project_code: '',
        project_name: '',
        project_desc: '',
        engine_id: '',
        busin_id: '',
        data_source_id: [],
        space_type: ''
      }
    },
    changeBusin(val) {
      // const obj = this.busin_options.find(item => item.busin_id === val)
      // this.busin_code = obj.busin_code + '_'
    },
    // 初始化引擎源列表
    async getSourceList() {
      const res = await this.$simpleAsyncTo(
        getSourceListType(),
        '获取计算引擎源失败'
      )
      if (res) {
        this.engine_options = res.data
      }
    },
    // 获取物理数据源列表
    async getDataSourceList() {
      const res = await this.$simpleAsyncTo(
        getDataSource(),
        '获取物理数据源失败'
      )
      if (res) {
        this.data_source_options = res.data
      }
    },
    // 获取业务板块列表
    async getBusinessList() {
      const res = await this.$simpleAsyncTo(
        getListBusiness(),
        '获取业务板块失败'
      )
      if (res) {
        this.busin_options = res.data
      }
    },
    // 获取空间类型
    async getSpaceType() {
      const res = await this.$simpleAsyncTo(
        getSpaceTypeList(),
        '获取空间类型列表失败'
      )
      if (res) {
        this.spaceType_options = res.data.space_type
      }
    },
    // 新建项目/信息设置
    NewBuildProject(formName) {
      this.$refs[formName].validate(async _ => {
        if (_) {
          this.globalLoading()
          if (JSON.stringify(this.projectData) === '{}') {
            // this.ProjectForm.project_code = this.busin_code + this.ProjectForm.project_code
            const res = await this.$simpleAsyncTo(
              newBuildProject(this.ProjectForm),
              '新建项目失败'
            )
            if (res) {
              this.$message({
                type: res.flag ? 'success' : 'error',
                message: res.msg
              })
            }
          } else {
            const res = await this.$simpleAsyncTo(
              editProject({...this.ProjectForm, project_id: this.projectData.id}),
              '项目信息设置失败'
            )
            if (res) {
              this.$message({
                type: res.flag ? 'success' : 'error',
                message: res.msg
              })
            }
          }
          this.closeHandle('refresh')
          this.globalLoading().close()
        } else {
          return false
        }
      })
    },
    // 关闭弹窗
    closeHandle(fn) {
      this.NewBuildProjectVisible = false
      if (fn !== 'refresh') {
        if (this.title === '新建项目') {
          this.$message('取消新建项目')
        } else {
          this.$message('取消编辑项目')
        }
      }
      this.$emit('close', fn)
    }
  }
}
</script>
<style lang="scss">
.add-edit-dialog {
  .line {
    width: 100%;
    height: 0;
    border-top: 1px solid #d9d9d9;
  }
}
</style>
