<template>
  <el-dialog
    custom-class="limit-edit-dialog"
    :title="title"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
    v-loading="loading"
    v-draggable="{
      trigger: '.limit-edit-dialog .el-dialog__header',
      body: '.limit-edit-dialog.el-dialog',
      recover: false
    }"
  >
    <el-popover width="450" placement="bottom-end" trigger="hover" :open-delay="100" v-if="data.id">
      <el-form class="form-info" label-suffix="：" label-width="120px" label-position="right">
        <el-form-item label="业务板块">{{content_data.business_field_name}}</el-form-item>
        <el-form-item label="所属项目">{{content_data.project_name}}</el-form-item>
        <el-form-item label="项目空间类">{{content_data.space_type_name}}</el-form-item>
        <el-form-item label="数据域">{{content_data.data_field_name}}</el-form-item>
        <el-form-item label="英文名">{{content_data.condition_alias}}</el-form-item>
        <el-form-item label="名称">{{content_data.condition_name}}</el-form-item>
        <el-form-item label="计算逻辑">
          <MonacoEditor ref="monacoEditor" readonly :code="decrypt(content_data.sql_content)" />
        </el-form-item>
        <el-form-item label="描述">{{content_data.condition_desc}}</el-form-item>
      </el-form>
      <el-button type="primary" plain slot="reference" class="publish_content">
        已发布内容
        <i class="el-icon-arrow-down"></i>
      </el-button>
    </el-popover>
    <el-form
      ref="form"
      :model="editForm"
      :rules="editFormRules"
      label-width="120px"
      label-position="right"
      label-suffix="："
    >
      <!-- class="cus-form" -->
      <el-row>
        <el-col :span="18">
          <el-form-item label="主要来源字段" prop="selValue">
            <el-select
              v-model="editForm.selValue"
              :disabled="isEdit"
              placeholder="请选择主要来源字段"
              @change="changeFactLogic"
            >
              <el-option
                v-for="item in dataFieldList"
                :key="item.id"
                :label="item.element_code"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-tooltip
            content="至少基于一个当前所选逻辑表模型字段新建原子指标，指定为核心关联的字段，初始默认填入计算逻辑并校验是否存在"
            placement="top"
          >
            <i class="el-icon-info font-16 ml-10" style="margin-top: 6px;"></i>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="英文名" prop="condition_alias">
            <el-input
              v-model="editForm.condition_alias"
              placeholder="请输入名称"
              maxlength="32"
              show-word-limit
              :disabled="editForm.isUsed === '1'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="condition_name">
            <el-input
              v-model="editForm.condition_name"
              placeholder="请输入名称"
              maxlength="32"
              show-word-limit
              :disabled="editForm.isUsed === '1'"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="描述">
        <el-input
          type="textarea"
          maxlength="128"
          rows="4"
          show-word-limit
          v-model="editForm.condition_desc"
        ></el-input>
      </el-form-item>
      <el-form-item label="计算逻辑" prop="sql_content">
        <MonacoEditor
          ref="monacoEditor"
          has-top-tools
          has-bottom-tools
          :code.sync="editForm.sql_content"
          @verification="verification"
        />
        <span class="error_tip" v-show="showTip">请输入计算逻辑</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click.stop="close">取消</el-button>
      <el-button type="primary" @click.stop="saveClick('1')">保存</el-button>
      <el-button type="primary" @click.stop="saveClick('2')">发布</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  // busConditionPublish,
  queryLimit,
  queryFactLogicAndRelatonInfo,
  save,
  edit,
  filterVerification
} from '@/api/rd/limit'
import {mapGetters} from 'vuex'
import editDialog from '@/mixins/edit-dialog'

export default {
  mixins: [editDialog],
  data() {
    return {
      showTip: false,
      dataFieldList: [],
      content_data: {},
      editForm: {
        selValue: '',
        sql_content: '',
        business_field_name: '',
        condition_desc: '',
        dim_logic_id: '',
        condition_name: '',
        project_name: '',
        condition_code: '',
        condition_alias: '',
        data_field_name: ''
      },
      editFormRules: {
        selValue: [
          {required: true, message: '请选择主要来源字段', trigger: 'change'}
        ],
        condition_alias: [
          {required: true, message: '请输入英文名', trigger: 'blur'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ],
        condition_name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        sql_content: [{required: true, message: '请输入计算逻辑'}]
      },
      loading: 0
    }
  },
  computed: {
    ...mapGetters(['project']),
    isEdit() {
      return this.title.indexOf('编辑') > -1
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(value) {
        if (!this.visible) return
        if (value.id) {
          this.getFormData()
        } else {
          Object.assign(this.editForm, this.project, value)
          this.editForm.sql_content = this.editForm.sql_content ? this.decrypt(this.editForm.sql_content) : ''
          this.getDataFieldList(value.fact_logic_base_id)
        }
      }
    }
  },
  methods: {
    changeFactLogic(id) {
      const obj = this.dataFieldList.find(item => item.id === id)
      if (obj) {
        const {dim_logic_id, fact_logic_id, element_code} = obj,
          name = element_code.split('.').slice(-1)[0]
        this.editForm.condition_code = name
        this.editForm.sql_content = element_code
        if (!this.isEdit) {
          this.editForm.condition_alias = name
        }
        this.editForm.dim_logic_id = dim_logic_id
        this.editForm.fact_logic_id = fact_logic_id
      }
    },
    async getDataFieldList(id) {
      this.loading++
      const res = await this.$simpleAsyncTo(
        queryFactLogicAndRelatonInfo({
          fact_logic_base_id: id
        }),
        '获取主要来源字段失败'
      )
      if (res) {
        this.dataFieldList = res.data
        // this.changeFactLogic(this.editForm.selValue)
      }
      this.loading--
    },
    async getFormData() {
      this.loading++
      const res = await this.$simpleAsyncTo(
        queryLimit({id: this.data.id}),
        '获取数据失败'
      )
      if (res) {
        const {data} = res
        Object.assign(this.editForm, data)
        Object.assign(this.content_data, data)
        // this.editForm.id = data.selValue
        this.editForm.sql_content = this.editForm.sql_content ? this.decrypt(this.editForm.sql_content) : ''
        this.getDataFieldList(this.editForm.fact_logic_base_id)
      }
      this.loading--
    },
    validateHandler() {
      let flag
      this.$refs.form.validate(valid => {
        flag = valid && !!this.editForm.sql_content.trim()
      })
      return flag
    },
    async saveClick(flag) {
      this.globalLoading()
      const valid = this.validateHandler(),
        bool = await this.verification(),
        params = {
          ...this.editForm,
          flag
        }
      let handler
      if (this.isEdit) {
        handler = edit
      } else {
        handler = save
        delete params.id
      }
      params.sql_content = this.encrypt(params.sql_content)
      if (valid && bool) {
        const res = await this.$simpleAsyncTo(handler(params), '保存失败')
        if (res) {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
          this.$emit('confirm')
          this.close()
          this.editForm = {}
          this.$root.eventEmitter.emit('refresh')
        }
      }
      this.globalLoading().close()
    },
    async verification() {
      // this.loading++
      const sql = this.editForm.sql_content.trim()

      const res = await this.$simpleAsyncTo(
        filterVerification({filter: this.encrypt(sql)}),
        'SQL校验失败'
      )
      if (res) {
        this.$message({
          showClose: true,
          message: `SQL校验成功`,
          type: 'success'
        })
      }
      // flag = !!sql
      // if (showMsg) {
      //   this.$message({
      //     showClose: true,
      //     message: `SQL校验${flag ? '成功' : '失败'}`,
      //     type: flag ? 'success' : 'error'
      //   })
      // }

      // this.loading--
      return !!res
    }
  }
}
</script>

<style lang="scss" scoped>
.publish_content {
  position: absolute;
  top: 14px;
  right: 50px;
}
</style>
