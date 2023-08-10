<template>
  <section class="fact-table-info">
    <el-form
      :model="filter"
      ref="form"
      :rules="rules"
      label-width="120px"
      label-position="right"
      label-suffix="："
    >
      <SimpleHead name="基本信息"></SimpleHead>
      <el-form-item label="业务板块" prop="business_field_name">{{filter.business_field_name}}</el-form-item>
      <el-form-item label="所属项目" prop="project_name">{{filter.project_name}}</el-form-item>
      <el-form-item label="空间类型" prop="space_type_name">{{filter.space_type_name}}</el-form-item>
      <el-form-item label="数据域" prop="data_field_id">
        <!-- <el-select v-model="filter.data_field_id" @change="changeMetadata">
          <el-option
            v-for="item in metadata"
            :key="item.data_field_id"
            :label="item.data_field_name"
            :value="item.data_field_id"
          ></el-option>
        </el-select> -->
        {{getDataFieldName}}
      </el-form-item>
      <el-form-item label="业务过程" prop="process_id">
        <!-- <el-select v-model="filter.process_id" @change="changeProcess">
          <el-option
            v-for="item in processList"
            :key="item.process_id"
            :label="`${item.process_name}(${item.process_code})`"
            :value="item.process_id"
          ></el-option>
        </el-select> -->
        {{getProcessListName}}
      </el-form-item>
      <!-- <el-form-item label="明细类型" prop="detail_type">
        <el-select v-model="filter.detail_type">
          <el-option
            v-for="item in detailTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="英文名" prop="logic_fact_code">
        <!-- <el-input
          v-model="filter.logic_fact_code"
          show-word-limit
          maxlength="32"
          placeholder="最多输入32个字符"
        >
          <template slot="prepend">
            <span
              class="text-ellipsis"
              style="width: 120px; display: inline-block;"
            >{{logic_fact_code_prefix}}</span>
          </template>
        </el-input> -->
        {{filter.logic_fact_code}}
      </el-form-item>
      <el-form-item label="名称" prop="logic_fact_name">
        <!-- <el-input
          v-model="filter.logic_fact_name"
          show-word-limit
          maxlength="32"
          placeholder="最多输入32个字符"
        ></el-input> -->
        {{filter.logic_fact_name}}
      </el-form-item>
      <el-form-item label="描述" prop="logic_fact_desc">
        <!-- <el-input
          v-model="filter.logic_fact_desc"
          type="textarea"
          show-word-limit
          maxlength="128"
          placeholder="最多输入128个字符"
        ></el-input> -->
        {{filter.logic_fact_desc}}
      </el-form-item>
      <el-divider></el-divider>
      <!-- <el-form-item label="来源主表" prop="cube_id">
        <el-select v-model="filter.cube_id" @change="changeCube" disabled>
          <el-option
            v-for="item in cubeList"
            :key="item.cube_id"
            :label="item.cube_code"
            :value="item.cube_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-divider></el-divider> -->
      <!-- <SimpleHead name="主键定义"></SimpleHead> -->
      <el-form-item label="来源表类型" prop="source_type">
        <!-- <el-radio-group v-model="filter.source_type" disabled>
          <el-radio label="0">引入字段</el-radio>
          <el-radio label="1">sql自定义</el-radio>
        </el-radio-group> -->
        {{filter.part_type === '1' ? 'sql自定义' : '引入字段'}}
      </el-form-item>
      <div v-if="filter.source_type === '0'">
        <!-- <el-form-item label="主键字段：" prop="primary_key">
          <el-select v-model="filter.primary_key" disabled>
            <el-option
              v-for="item in fieldList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <!-- <el-divider></el-divider> -->
        <!-- <div class="mb-10">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
        </div>-->
        <el-form-item label="来源主表" prop="cube_code">{{filter.cube_code}}</el-form-item>
        <el-form-item label="分区类型" prop="part_type">{{filter.part_type === '1' ? '自定义' : '非分区表'}}</el-form-item>
        <el-form-item label="天分区" prop="part_ds" v-if="filter.part_type === '1'">{{filter.part_ds}}</el-form-item>
        <el-form-item label="小时分区" prop="part_hour" v-if="filter.part_type === '1'">{{filter.part_hour}}</el-form-item>
        <el-form-item label="延迟" prop="part_hour_delay" v-if="filter.part_type === '1'">{{filter.part_hour_delay}}小时</el-form-item>
        <!-- <el-form-item label="字段计算逻辑">
          <MonacoEditor ref="monacoEditor" readonly :code="decrypt(filter.sql_context)" />
        </el-form-item> -->
      </div>
      <el-form-item label="筛选条件">
        <!-- has-top-tools
          tip-content="仅可基于来源主表字段，设定所需事务记录数据的筛选条件"
        has-bottom-tools-->
        <MonacoEditor ref="monacoEditor" readonly :code="decrypt(filter.sql_context)" />
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import editMixin from './edit-mixin'
export default {
  name: 'FactTableInfo',
  mixins: [editMixin],
  props: {
    data: Object
  },
  data() {
    return {
      filter: {
        business_field_name: '',
        project_name: '',
        space_type_name: '',
        data_field_name: '',
        data_field_id: '',
        process_id: '',
        // detail_type: '',
        logic_fact_code: '',
        logic_fact_name: '',
        logic_fact_desc: '',
        cube_id: '',
        source_type: '',
        pk_code: '',
        pk_name: '',
        pk_type: '',
        sql_content: '',
        sql_context: ''
      },
      rules: {
        process_id: [{required: true, message: '必填项'}],
        data_field_id: [{required: true, message: '必填项'}],
        // detail_type: [{required: true, message: '必填项'}],
        logic_fact_code: [
          {required: true, message: '必填项'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ],
        logic_fact_name: [{required: true, message: '必填项'}],
        cube_id: [{required: true, message: '必填项'}],
        pk_code: [
          {required: true, message: '必填项'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ],
        pk_name: [{required: true, message: '必填项'}],
        pk_type: [{required: true, message: '必填项'}],
        pk_logic: [{required: true, message: '必填项'}]
      },
      fieldList: []
    }
  },
  computed: {
    getDataFieldName() {
      const data = this.metadata.find(d => d.data_field_id === this.filter.data_field_id)
      return data ? data.data_field_name : ''
    },
    getProcessListName() {
      const data = this.processList.find(d => d.process_id === this.filter.process_id)
      return data ? `${item.process_name}(${item.process_code})` : ''
    }
  },
  created() {
    Object.assign(this.filter, this.data)
  },
  mounted() {
    this.$nextTick(_ => {
      this.$refs.monacoEditor.format()
    })
  },
  methods: {
    getData() {
      let data = false
      this.$refs.form.validate(valid => {
        if (valid) {
          data = this.filter
        }
      })
      return data
    },
    changeMetadata(val) {
      const obj = this.metadata.find(item => item.data_field_id === val)
      Object.assign(this.filter, obj)
    }
  }
}
</script>

<style lang="scss">
</style>
