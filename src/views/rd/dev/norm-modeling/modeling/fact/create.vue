<template>
  <el-dialog
    :visible.sync="isVisible"
    title="新建事实逻辑表"
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
      <el-step title="来源逻辑定义"></el-step>
    </el-steps>
    <el-form
      ref="form"
      :model="filter"
      :rules="rules"
      label-width="120px"
      label-position="right"
      label-suffix="："
    >
      <template v-if="activeStep === 0">
        <el-row>
          <el-col :span="10">
            <el-form-item label="业务板块" prop="business_field_name">{{
              filter.business_field_name
            }}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="空间类型" prop="space_type_name">{{
              filter.space_type_name
            }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="所属项目" prop="project_name">{{
              filter.project_name
            }}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="数据域" prop="data_field_id">
              <el-select
                v-model="filter.data_field_id"
                @change="changeMetadata"
              >
                <el-option
                  v-for="item in metadata"
                  :key="item.data_field_id"
                  :label="`${item.data_field_name}(${item.data_field_code})`"
                  :value="item.data_field_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="业务过程" prop="process_id" class="custom-item">
          <el-select v-model="filter.process_id" @change="changeProcess">
            <el-option
              v-for="item in processList"
              :key="item.process_id"
              :label="`${item.process_name}(${item.process_code})`"
              :value="item.process_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="英文名" prop="logic_fact_code">
          <el-input
            v-model="filter.logic_fact_code"
            style="width: 80%"
            show-word-limit
            maxlength="32"
            placeholder="最多输入32个字符"
          >
            <template slot="prepend">
              <span
                class="text-ellipsis"
                style="width: 120px; display: inline-block;"
                >{{ logic_fact_code_prefix }}</span
              >
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="名称" prop="logic_fact_name" class="custom-item">
          <el-input
            v-model="filter.logic_fact_name"
            show-word-limit
            maxlength="32"
            placeholder="最多输入32个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="logic_fact_desc">
          <el-input
            v-model="filter.logic_fact_desc"
            type="textarea"
            show-word-limit
            maxlength="128"
            placeholder="最多输入128个字符"
          ></el-input>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="来源表" prop="source_type">
          <el-radio-group
            v-model="filter.source_type"
            @change="changePrimaryKey"
          >
            <el-radio label="0">引入字段</el-radio>
            <el-radio label="1">sql自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="来源主表" prop="cube_id" class="custom-item" v-if="filter.source_type === '0'">
          <el-select v-model="filter.cube_id" @change="changeCube" filterable>
            <el-option
              v-for="item in cubeList"
              :key="item.cube_id"
              :label="item.cube_code"
              :value="item.cube_id"
            ></el-option>
          </el-select>
          <el-tooltip
            content="缺少数据源？前往同步或脚本加工"
            placement="right"
          >
            <i class="el-icon-info"></i>
          </el-tooltip>
          <el-button class="ml-10" type="primary" @click="previewDataclick" :disabled="!filter.cube_id">数据预览</el-button>
          <!-- <p class="tip">缺少数据源？前往同步或脚本加工</p> -->
        </el-form-item>
        <!-- <el-row v-if="filter.source_type === '0'">
          <el-col :span="10">
            <el-form-item
              label="分区类型"
              prop="part_type"
              :rules="[
                {required: true, message: '请选择分区类型'}
              ]"
            >
              <el-select v-model="filter.part_type" placeholder="请选择" @change="partTypeChange">
                <el-option
                  v-for="item in partTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="天分区"
              prop="part_ds"
              :rules="[
                {required: true, message: '请输入天分区'}
              ]"
              v-if="filter.part_type === '1'"
            >
              <el-input
                v-model="filter.part_ds"
                placeholder="请输入天分区"
                @change="partDsChange"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="filter.source_type === '0'">
          <el-col :span="10">
            <el-form-item
              label="小时分区"
              prop="part_hour"
              v-if="filter.part_type === '1'"
            >
              <el-input
                v-model="filter.part_hour"
                placeholder="请输入小时分区"
                @change="partHourChange"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="有延迟"
              prop="part_hour_delay"
              v-if="filter.part_type === '1' && filter.part_hour"
            >
              <el-select v-model="filter.part_hour_delay" placeholder="请选择" style="width: 80px" @change="partHourDelayChange">
                <el-option
                  v-for="item in partHourDelayOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>小时
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-form-item label="筛选条件" prop="sql_content" v-if="filter.source_type === '1'">
          <MonacoEditor
            ref="monacoEditor"
            style="height: 300px;"
            has-top-tools
            has-bottom-tools
            tip-content="仅可基于来源主表字段，设定所需事务记录数据的筛选条件"
            :code.sync="filter.sql_content"
            @verification="sqlVerification(filter.source_type)"
          />
        </el-form-item>
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
    <PreviewDataTuTu v-if="previewVisible" :previewLoading="previewLoading" @ok="ok" :previewData="previewData"></PreviewDataTuTu>
  </el-dialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import PreviewDataTuTu from './preview-data.vue'
import {
  saveNew,
  // sqlVerification
  sqlVerificationMulti,
  sqlVerificationMultiSql,
  dataPreview
} from '@/api/rd/fact-table'
import editMixin from './edit-mixin'
import {
  sqlBackFill
} from '@/api/rd/dimension'
export default {
  name: 'FactTableCreate',
  mixins: [editDialog, editMixin],
  props: {
    visible: Boolean
  },
  components: {
    PreviewDataTuTu
  },
  data() {
    return {
      isVisible: false,
      activeStep: 0,
      partTypeOptions: [
        {label: '非分区表', value: '0'},
        {label: '自定义', value: '1'}
      ],
      partHourDelayOptions: [
        {label: '0', value: '0'},
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5', value: '5'},
        {label: '6', value: '6'},
        {label: '7', value: '7'},
        {label: '8', value: '8'},
        {label: '9', value: '9'},
        {label: '10', value: '10'},
        {label: '11', value: '11'},
        {label: '12', value: '12'},
        {label: '13', value: '13'},
        {label: '14', value: '14'},
        {label: '15', value: '15'},
        {label: '16', value: '16'},
        {label: '17', value: '17'},
        {label: '18', value: '18'},
        {label: '19', value: '19'},
        {label: '20', value: '20'},
        {label: '21', value: '21'},
        {label: '22', value: '22'},
        {label: '23', value: '23'},
        {label: '24', value: '24'},
      ],
      isShow: true,
      filter: {
        business_field_name: '',
        project_name: '',
        space_type_name: '',
        data_field_id: '',
        process_id: '',
        logic_fact_code: '',
        logic_fact_name: '',
        logic_fact_desc: '',
        cube_id: '',
        cube_code: '',
        source_type: '0',
        sql_content: '',
        part_type: '1',
        part_ds: '',
        part_hour: '',
        part_hour_delay: '0'
      },
      col_info: [],
      previewVisible: false,
      previewLoading: false,
      previewData: []
    }
  },
  methods: {
    beforeClose() {
      this.activeStep = 0
      this.close()
    },
    changePrimaryKey() {
      this.filter.sql_content = ''
      this.filter.cube_code = ''
      this.filter.cube_id = ''
      this.filter.part_hour = ''
      this.filter.part_ds = ''
      this.filter.part_hour_delay = '0'
    },
    nextStep() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.activeStep = 1
        }
      })
    },
    async sqlVerification(type) {
      // this.loading++
      this.sqlValid = false
      const {sql_content, cube_code, project_id, source_type} = this.filter
      let fn = null, params = {}
      if (source_type === '0') {
        fn = sqlVerificationMulti
        params = {
          sql: this.encrypt(sql_content),
          cube_code,
          project_id
        }
      } else {
        fn = sqlVerificationMultiSql
        params = {
          sql: this.encrypt(sql_content),
          project_id
        }
      }
      const res = await this.$simpleAsyncTo(
        fn(params),
        '规范性校验失败'
      )
      if (res) {
        this.sqlValid = true
        const {cube_id} = res.data
        this.filter.cube_id = cube_id
        if (type === '1') {
          this.col_info = res.data.source_table_info
        } else {
          this.col_info = res.data.col_info
          this.filter.sql_content = res.data.sql_content
          this.filter.part_ds = res.data.part_ds
          this.filter.part_hour = res.data.part_hour
          this.filter.part_hour_delay = res.data.part_hour_delay
          this.filter.part_type = res.data.part_type
        }
        this.$message({
          type: 'success',
          message: res.msg
        })
      }
    },
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (
            this.filter.sql_content !== ''
          ) {
            await this.sqlVerification(this.filter.source_type)
            if (!this.sqlValid) return
          }
          const {
            business_field_id,
            business_field_name,
            cube_id,
            data_field_id,
            data_field_name,
            logic_fact_code,
            logic_fact_desc,
            logic_fact_name,
            process_id,
            project_id,
            project_name,
            space_type_id,
            space_type_name,
            sql_content,
            part_type,
            part_ds,
            part_hour,
            part_hour_delay,
            source_type
          } = this.filter
          const keys = {
            '0': 'col_info',
            '1': 'source_table_info'
          }
          const params = {
            process_id,
            cube_id,
            logic_fact_code: this.logic_fact_code_prefix + logic_fact_code,
            project_id,
            project_name,
            business_field_id,
            business_field_name,
            space_type_id,
            space_type_name,
            data_field_id,
            data_field_name,
            sql_content: this.encrypt(sql_content),
            logic_fact_name,
            logic_fact_desc,
            source_type,
            part_type,
            part_ds,
            part_hour,
            part_hour_delay,
            [keys[source_type]]: JSON.stringify(this.col_info)
          }
          const res = await this.$simpleAsyncTo(
            saveNew(params),
            '新建事实逻辑表失败'
          )
          if (res && res.flag) {
            this.$message({
              type: 'success',
              message: '新建事实逻辑表成功！'
            })
            this.beforeClose()
            this.$root.eventEmitter.emit('refresh')
          }
        }
      })
    },
    partTypeChange(val) {
      this.filter.part_type = val
      if (val === '0') {
        this.filter.part_ds = ''
        this.filter.part_hour = ''
        this.filter.part_hour_delay = '0'
      }
    },
    partDsChange(val) {
      if (this.filter.part_type === '1' && this.filter.part_ds) {
        this._sqlBackFill()
      }
    },
    partHourChange(val) {
      if (this.filter.part_type === '1' && this.filter.part_ds && this.filter.part_hour ) {
        this._sqlBackFill()
      }
    },
    partHourDelayChange(val) {
      if (this.filter.part_type === '1' && this.filter.part_ds && this.filter.part_hour && this.filter.part_hour_delay) {
        this._sqlBackFill()
      }
    },
    async _sqlBackFill() {
      const params = {
        sql: this.filter.sql_content,
        part_type: this.filter.part_type,
        part_ds: this.filter.part_ds,
        part_hour: this.filter.part_hour,
        part_hour_delay: this.filter.part_hour_delay
      }
      const res = await this.$simpleAsyncTo(sqlBackFill(params), '获取失败')
      if (res) {
        this.filter.sql_content = res.data.sql_content
      }
    },
    async previewDataclick() {
      this.previewVisible = true
      this.previewLoading = true
      const params = {
        sql: '',
        source_table: this.filter.cube_code,
        project_id: this.filter.project_id
      }
      const res = await this.$simpleAsyncTo(dataPreview(params), '数据获取失败')
      if (res) {
        this.previewData = res.data
      }
      this.previewLoading = false
    },
    ok() {
      this.previewVisible = false
    }
  }
}
</script>

<style lang="scss">
.create-fact-table {
  .el-steps {
    width: 500px;
    margin: 0 auto 10px auto;
  }

  .custom-item {
    // width: 50%;
    .el-form-item__content {
      > .el-select,
      > .el-input {
        width: 50%;
      }
    }
    .el-icon-info {
      cursor: pointer;
      margin-left: 5px;
      font-size: 16px;
    }
  }
}
</style>
