<template>
  <div class="my-behavior-rules">
    <el-form
      :model="filter"
      ref="form"
      :rules="rules"
      label-width="140px"
      label-position="right"
      label-suffix="："
    >
      <SimpleHead name="基本信息"></SimpleHead>
      <el-form-item label="业务板块" prop>{{data.busiFieldName}}</el-form-item>
      <el-form-item label="空间类型" prop>{{data.spaceType}}</el-form-item>
      <el-form-item label="所属项目" prop>{{data.projectName}}</el-form-item>
      <el-row>
        <el-col :span="14">
          <el-form-item label="行为域&业务线" prop="bfId">
            <el-select v-model="data.bfId" placeholder="请选择" style="width:260px" :disabled="true">
              <el-option
                v-for="item in domainOptions"
                :key="item.id"
                :label="item.bfName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="" prop="busiId" label-width="1" class="my-form-item">
            <div slot="label" style="display: none">
            </div>
            <el-select v-model="data.busiId" placeholder="请选择" style="width:260px" :disabled="true">
              <el-option
                v-for="item in busListAll"
                :key="item.id"
                :label="item.busiName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="动作" prop="actName">
        <el-input v-model="data.actName" placeholder="请输入内容" :disabled="true" style="width:250px"></el-input>
        <!-- <el-select v-model="data.action" placeholder="请选择" style="width:260px">
          <el-option
            v-for="item in actionListAll"
            :key="item.id"
            :label="item.actName"
            :value="item.id">
          </el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="对象" prop="objectName">
        <el-input v-model="data.objectName" placeholder="请输入内容" :disabled="true" style="width:250px"></el-input>
        <!-- <el-select v-model="filter.object" placeholder="请选择" style="width:260px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
      </el-form-item>
      <SimpleHead name="来源表设置"></SimpleHead>
      <el-form-item label="来源表类型" prop="cubeObjectType">
        <el-radio-group v-model="data.cubeObjectType">
          <el-radio label="physics">物理表</el-radio>
          <el-radio label="logic">逻辑表</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="来源主表" prop="cubeId">
        <el-select v-model="filter.cubeId" placeholder="请选择" style="width:260px" :disabled="true">
          <el-option
            v-for="item in sourceTables"
            :key="item.cube_id"
            :label="item.cube_code"
            :value="item.cube_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="筛选条件">
        <MonacoEditor
          :style="{height: `${150}px`}"
          has-top-tools
          has-bottom-tools
          :readonly="true"
          :code.sync="activeEditFieldCode"
          @verification="sqlValidate"
          @save="saveFieldEditorCode"
        ></MonacoEditor>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDomainListAll, getBusListAll } from '@/api/rd/exreact/domain-bus'
import { getSourceCubes } from '@/api/rd/exreact/regular'
import { mapGetters } from 'vuex'
export default {
  name: 'BehaviorRules',
  props: {
    data: Object
  },
  data() {
    return {
      filter: {
        behavior: '',
        business: '',
        action: '',
        object: '',
        source_table_type: '',
        source_main_table: ''
      },
      rules: {
        behavior: [
          { required: true, message: '请选择行为域', trigger: 'change' }
        ],
        action: [
          { required: true, message: '请选择动作', trigger: 'change' }
        ],
        object: [
          { required: true, message: '请选择动作', trigger: 'change' }
        ],
        source_main_table: [
          { required: true, message: '请选择动作', trigger: 'change' }
        ]
      },
      options: [],
      activeEditFieldCode: '',
      domainOptions: [],
      busListAll: [],
      sourceTables: []
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  created() {
    this._getDomainListAll()
    this._getBusListAll()
    this._getsourceTables()
  },
  methods: {
    sqlValidate() {},
    saveFieldEditorCode() {},
    // 获取行为域
    async _getDomainListAll() {
      const res = await this.$simpleAsyncTo(getDomainListAll(), '获取数据失败')
      if (res) {
        this.domainOptions = res.data
      }
    },
    // 获取业务线
    async _getBusListAll() {
      const res = await this.$simpleAsyncTo(getBusListAll(), '获取数据失败')
      if (res) {
        this.busListAll = res.data
      }
    },
    async _getsourceTables() {
      const res = await this.$simpleAsyncTo(getSourceCubes({project_id: this.project.project_id}), '获取数据失败')
      if (res) {
        this.sourceTables = res.data
      }
    }
  }
}
</script>

<style lang="scss">
.my-behavior-rules {
  .my-form-item .el-form-item__label {
    display: none!important;
  }
}
</style>
