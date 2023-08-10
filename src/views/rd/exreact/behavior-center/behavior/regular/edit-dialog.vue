<!--
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2020-08-19 15:49:17
 * @Description:
-->
<template>
  <SimpleEditDialog
    :title="title"
    :visible="isVisible"
    width="75%"
    top="10vh"
    @close="close"
    @confirm="confirm"
  >
    <el-form
      ref="form"
      label-position="right"
      label-width="140px"
      :model="filter"
      :rules="rules"
      label-suffix="："
    >
      <h4 class="mb-15">基本信息</h4>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="业务板块">{{project.business_field_name}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="空间类型">{{project.space_type_name}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属项目">{{project.project_name}}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="行为域" prop="domain">
            <el-select v-model="filter.domain" placeholder="请选择行为域" @change="changeDomain">
              <el-option
                v-for="item in domains"
                :key="item.id"
                :value="item.id"
                :label="item.bfName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务线" prop="bus">
            <el-select v-model="filter.bus" placeholder="请选择业务线" :disabled="!filter.domain">
              <el-option
                v-for="item in buses"
                :key="item.id"
                :value="item.id"
                :label="item.busiName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="动作" prop="action">
            <el-select v-model="filter.action" placeholder="请选择动作">
              <el-option
                v-for="item in actions"
                :key="item.id"
                :value="item.id"
                :label="item.actName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对象" prop="object">
            <el-select v-model="filter.object" placeholder="请选择对象">
              <el-option
                v-for="item in objects"
                :key="item.id"
                :value="item.id"
                :label="item.objectName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <h4 class="mb-15">来源表设置</h4>
      <el-form-item label="来源表类型" prop="sourceType">
        <el-radio-group v-model="filter.sourceType">
          <el-radio label="physics">物理表</el-radio>
          <el-radio label="logic">逻辑表</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="来源主表" prop="sourceTable">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-select v-model="filter.sourceTable" filterable>
              <el-option
                v-for="item in sourceTables"
                :key="item.cube_id"
                :value="item.cube_id"
                :label="item.cube_code"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <span class="label">
              <i class="el-icon-info"></i>
              缺少数据源？前往
              <el-button
                type="text"
                @click="$router.push('/rd/dev/data-process/sync-task')"
              >
                同步任务
              </el-button>
              或<el-button
                type="text"
                @click="$router.push('/rd/dev/data-process/code-task')"
              >
                代码任务
              </el-button>
              加工
            </span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="筛选条件" prop="sql_content">
        <MonacoEditor
          has-top-tools
          has-bottom-tools
          :code.sync="filter.sql_content"
          tip-content="仅可基于已发布原子指标，组合设定所需指标的统计计算方式"
          @verification="sqlVerification"
        ></MonacoEditor>
      </el-form-item>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import {getDomainListAll, getBusListAll} from '@/api/rd/exreact/domain-bus'
import {getListAll as getActionList} from '@/api/rd/exreact/action'
import {getListAll as getObjectList} from '@/api/rd/exreact/object'
import { add, getSourceCubes } from '@/api/rd/exreact/regular'
import { filterVerification } from '@/api/rd/limit'
import { mapGetters } from 'vuex'
// import {getListAll as getObjectAttrList} from '@/api/rd/exreact/object-attr'

export default {
  name: 'RegularEditDialog',
  mixins: [editDialog],
  data() {
    return {
      loading: 0,
      filter: {
        domain: '',
        bus: '',
        action: '',
        object: '',
        sourceType: 'physics',
        sourceTable: '',
        sql_content: "ds='${bizdate}'"
      },
      rules: {
        domain: [{required: true, message: '请选择行为域'}],
        bus: [{required: true, message: '请选择业务线'}],
        action: [{required: true, message: '请选择动作'}],
        object: [{required: true, message: '请选择对象'}]
      },
      domains: [],
      buses: [],
      actions: [],
      objects: [],
      sourceTables: [],
      isRules: false
    }
  },
  watch: {
    visible: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.getSelectList()
          this._getAction()
          this._getObjectList()
          this._getsourceTables()
        }
      }
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  methods: {
    async sqlVerification() {
      const res = await this.$simpleAsyncTo(filterVerification({filter: this.encrypt(this.filter.sql_content)}), '校验失败')
      if (res) {
        this.isRules = res.flag
        this.$message({
          type: 'success',
          message: '校验成功'
        })
      }
    },
    async getSelectList() {
      this.loading++
      let res = await this.$simpleAsyncTo(
        getDomainListAll(),
        '获取行为域列表失败'
      )
      if (res) {
        this.domains = res.data
      }
      this.loading--
    },
    async _getAction() {
      const res = await this.$simpleAsyncTo(getActionList(), '获取动作列表失败')
      if (res) {
        this.actions = res.data
      }
    },
    async _getObjectList() {
      const res = await this.$simpleAsyncTo(getObjectList(), '获取对象列表失败')
      if (res) {
        this.objects = res.data
      }
    },
    async changeDomain(val) {
      const res = await this.$simpleAsyncTo(getBusListAll({bfId: val}), '获取业务线列表失败')
      if (res) {
        this.buses = res.data
      }
    },
    async _getsourceTables() {
      const res = await this.$simpleAsyncTo(getSourceCubes({project_id: this.project.project_id}), '获取数据失败')
      if (res) {
        this.sourceTables = res.data
      }
    },
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (!this.isRules) {
            return this.$message({
              type: 'error',
              message: '请进行规范校验'
            })
          }
          const params = {
            bfId: this.filter.domain,
            busiId: this.filter.bus,
            actId: this.filter.action,
            objectId: this.filter.object,
            cubeId: this.filter.sourceTable,
            businFieldId: this.project.business_field_id,
            projectId: this.project.project_id,
            projectName: this.project.project_name,
            busiFieldName: this.project.business_field_name,
            cubeCode: this.filter.sourceTable,
            cubeObjectType: this.filter.sourceType,
            spaceType: this.project.space_type_id,
            sqlDisplayContext: this.filter.sql_content
          }
          const res = await this.$simpleAsyncTo(add(params), '添加失败')
          if (res) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.$root.eventEmitter.emit('refresh', this.getTreeData)
            this.isRules = false
          }
          this.close()
        }
      })
    }
  }
}
</script>

<style lang="scss"></style>
