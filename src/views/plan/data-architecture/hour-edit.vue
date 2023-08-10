<template>
  <div class="hour-edit-dialog">
    <el-dialog
      title="编辑-时间分区 · 小时"
      :visible.sync="NewBuildProjectVisible"
      width="30%"
      @close="closeHandle"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-draggable="{
        trigger: '.el-dialog__header',
        body: '.el-dialog',
        recover: false,
      }"
    >
      <el-form
        :model="ProjectForm"
        label-width="120px"
        :rules="ProjectFormRules"
        ref="ProjectForm"
        label-suffix="："
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="中文名" prop="partition_name" :label-width="formLabelWidth">
              <el-input
                v-model="ProjectForm.partition_name"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="英文名" prop="partition_code" :label-width="formLabelWidth">
              <el-input
                v-model="ProjectForm.partition_code"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="数据类型" prop="partition_data_type" :label-width="formLabelWidth">
              <el-select
                v-model="ProjectForm.partition_data_type"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in selectOptions"
                  :key="index"
                  :value="item.value"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="默认值" :label-width="formLabelWidth">
              <el-input
                v-model="ProjectForm.partition_default_value"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                v-model="ProjectForm.partition_desc"
                type="textarea"
                maxlength="200"
                show-word-limit
                placeholder="描述不能超过200个字"
              ></el-input>
            </el-form-item>
            <el-form-item label="默认格式" prop="partition_default_format">
              <span>{{ ProjectForm.partition_default_format }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeHandle">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
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
  getSpaceTypeList,
} from '@/api/plan/project-manage'
import {queryDataTypeList, editBizPartiton} from '@/api/plan/data-architecture'
// import {mapGetters} from 'vuex'
export default {
  name: 'HourEditDialog',
  props: {
    hourtData: {
      type: Object,
    },
    businId: {
      type: String,
      default: '',
    },
  },
  components: {
    // OverflowTooltip
  },
  computed: {
    // ...mapGetters(['project'])
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
      // engine_options: [], // 计算引擎列表
      // data_source_options: [], // 物理数据源
      // busin_options: [], // 业务板块列表
      // spaceType_options: [], // 空间类型类列表
      ProjectFormRules: {
        partition_code: [
          {required: true, message: '请输入英文名'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母',
          },
        ],
        partition_name: [
          {required: true, message: '请输入中文名称', trigger: 'blur'},
        ],
        partition_data_type: [
          {required: true, message: '请选择数据类型', trigger: 'change'},
        ],
        busin_id: [
          {required: true, message: '请选择业务模块', trigger: 'change'},
        ],
        space_type: [
          {required: true, message: '请选择空间类型', trigger: 'change'},
        ],
      },
      // is_disabled: false,
      title: null,
      busin_code: '',
      value: true,
      // field9: '1',
      formLabelWidth: '120px',
      selectOptions: [],
    }
  },
  created() {
    // this.getSourceList()
    // this.getBusinessList()
    // this.getDataSourceList()
    // this.getSpaceType()
    this.getDataTypeSelect()
    if (JSON.stringify(this.hourtData) === '{}') {
      this.ProjectForm = this.resetProjectForm()
      // this.is_disabled = false
      this.title = '新建项目'
    } else {
      this.ProjectForm.partition_code = this.hourtData.partition_code
      this.ProjectForm.partition_name = this.hourtData.partition_name
      this.ProjectForm.partition_data_type = this.hourtData.partition_data_type
      this.ProjectForm.partition_default_value =
        this.hourtData.partition_default_value
      this.ProjectForm.partition_desc = this.hourtData.partition_desc
      this.ProjectForm.partition_default_format =
        this.hourtData.partition_default_format
      this.ProjectForm.space_type = this.hourtData.space_type
      // this.is_disabled = true
      this.title = '编辑-时间分区 · 小时'
    }
  },
  methods: {
    // 提交表单
    async submitForm() {
      let params = {
        busin_id: this.businId,
        type: '2',
        ...this.ProjectForm,
      }
      const res = await this.$simpleAsyncTo(editBizPartiton(params))
      if (res) {
        this.NewBuildProjectVisible = false
        this.$message({
          type: 'success',
          message: res.msg,
        })
        this.$emit('close', 'refresh')
      }
    },
    // 获取数据类型
    async getDataTypeSelect() {
      const res = await this.$simpleAsyncTo(queryDataTypeList())
      if (res) {
        this.selectOptions = res.data
      }
    },
    // 新建项目表单初始化
    resetProjectForm() {
      return {
        partition_code: '',
        partition_name: '',
        partition_data_type: '',
        partition_default_value: '',
        partition_desc: '',
        partition_default_format: '',
        // space_type: ''
      }
    },
    // changeBusin(val) {
    //   // const obj = this.busin_options.find(item => item.busin_id === val)
    //   // this.busin_code = obj.busin_code + '_'
    // },
    // 初始化引擎源列表
    // async getSourceList() {
    //   const res = await this.$simpleAsyncTo(
    //     getSourceListType(),
    //     '获取计算引擎源失败'
    //   )
    //   if (res) {
    //     this.engine_options = res.data
    //   }
    // },
    // 获取物理数据源列表
    // async getDataSourceList() {
    //   const res = await this.$simpleAsyncTo(
    //     getDataSource(),
    //     '获取物理数据源失败'
    //   )
    //   if (res) {
    //     this.data_source_options = res.data
    //   }
    // },
    // 获取业务板块列表
    // async getBusinessList() {
    //   const res = await this.$simpleAsyncTo(
    //     getListBusiness(),
    //     '获取业务板块失败'
    //   )
    //   if (res) {
    //     this.busin_options = res.data
    //   }
    // },
    // 获取空间类型
    // async getSpaceType() {
    //   const res = await this.$simpleAsyncTo(
    //     getSpaceTypeList(),
    //     '获取空间类型列表失败'
    //   )
    //   if (res) {
    //     this.spaceType_options = res.data.space_type
    //   }
    // },
    // 新建项目/信息设置
    // NewBuildProject(formName) {
    //   this.$refs[formName].validate(async _ => {
    //     if (_) {
    //       this.globalLoading()
    //       if (JSON.stringify(this.hourtData) === '{}') {
    //         // this.ProjectForm.project_code = this.busin_code + this.ProjectForm.project_code
    //         const res = await this.$simpleAsyncTo(
    //           newBuildProject(this.ProjectForm),
    //           '新建项目失败'
    //         )
    //         if (res) {
    //           this.$message({
    //             type: res.flag ? 'success' : 'error',
    //             message: res.msg
    //           })
    //         }
    //       } else {
    //         const res = await this.$simpleAsyncTo(
    //           editProject({...this.ProjectForm, project_id: this.hourtData.id}),
    //           '项目信息设置失败'
    //         )
    //         if (res) {
    //           this.$message({
    //             type: res.flag ? 'success' : 'error',
    //             message: res.msg
    //           })
    //         }
    //       }
    //       this.closeHandle('refresh')
    //       this.globalLoading().close()
    //     } else {
    //       return false
    //     }
    //   })
    // },
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
    },
  },
}
</script>
<style lang="scss">
.hour-edit-dialog {
  .edit_text ul {
    display: flex;
    flex-direction: row;
    li {
      width: 25%;
      line-height: 20px;
    }
  }
  .edit_text1 ul {
    display: flex;
    flex-direction: row;
    li {
      width: 12%;
      font-weight: 400;
      color: #333;
    }
  }
  .edit_top p {
    line-height: 30px;
  }
  .l_text {
    height: 220px;
    border-right: 1px solid #d9d9d9;
    margin-right: 20px;
    p {
      line-height: 50px;
    }
  }
  .line {
    width: 100%;
    height: 0;
    border-top: 1px solid #d9d9d9;
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
