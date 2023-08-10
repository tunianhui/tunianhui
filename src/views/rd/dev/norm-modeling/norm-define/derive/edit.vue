<template>
  <section class="derive-edit">
    <el-form
      ref="form"
      :model="filter"
      :rules="rules"
      label-width="100px"
      label-suffix="："
    >
      <div class="third-title">归属信息选择</div>
      <el-row class="first-section edit-content">
        <el-col :md="8" :sm="24" :xs="24">
          <el-form-item label="业务板块">
            <div>{{ project.business_field_name }}</div>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="24" :xs="24">
          <el-form-item label="所属项目">
            <div>{{ project.project_name }}</div>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="24" :xs="24">
          <el-form-item label="项目空间类型" label-width="120px">
            <div>{{ project.space_type_name }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="third-title">创建派生指标</div>
      <div class="edit-content">
        <el-steps
          :space="250"
          :active="activeStep"
          process-status="finish"
          finish-status="success"
          align-center
        >
          <el-step title="确定原子指标"></el-step>
          <el-step title="派生指标定义"></el-step>
        </el-steps>
        <div v-if="activeStep === 0" class="step1">
          <el-form-item label="原子指标" prop="atom">
            <el-select
              v-model="filter.atomic_id"
              @change="changeAtom"
              v-loading="!!loading"
            >
              <el-option
                v-for="item in atoms"
                :key="item.atomic_id"
                :label="item.atomic"
                :value="item.atomic_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源逻辑表" v-if="filter.atomic_id">{{
            filter.logic_fact_code
          }}</el-form-item>
          <div class="text-center">
            <el-button
              type="primary"
              plain
              :disabled="!filter.atomic_id"
              @click="activeStep = 1"
              >下一步</el-button
            >
          </div>
        </div>
        <div class="step2" v-else v-loading="fetchCount === 0">
          <div class="inline-item">
            <el-form-item label="原子指标">{{
              filter.atomic_code + ' ' + filter.atomic_name
            }}</el-form-item>
            <el-form-item label="来源逻辑表">{{
              filter.logic_fact_code
            }}</el-form-item>
          </div>

          <h5><span class="order">1</span>确定统计粒度</h5>
          <el-form-item
            v-for="(item, index) in filter.gras"
            :key="item._key"
            :label="index === 0 ? '统计粒度' : ''"
            :prop="`gras.${index}.value`"
            :rules="[
              {required: index === 0, message: '必填项'},
              {validator: validateDimRepeat}
            ]"
          >
            <el-select
              v-model="item.value"
              filterable
              clearable
              multiple
              :multiple-limit="3"
              value-key="dim_id"
            >
              <el-option
                v-for="temp in gras"
                :key="temp.dim_id"
                :label="`${temp.dim_code}(${temp.dim_name})`"
                :value="temp"
              ></el-option>
            </el-select>
            <SimpleConfirm
              @confirm="remove('gras', index)"
              v-if="filter.gras.length > 1"
            ></SimpleConfirm>
          </el-form-item>
          <el-form-item v-if="filter.gras.length <= 2">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              @click="add('gras')"
              >新建统计粒度</el-button
            >
            <span class="limit-tip">{{ `${filter.gras.length}/3` }}</span>
          </el-form-item>

          <h5><span class="order">2</span>确定统计周期</h5>
          <el-form-item
            v-for="(item, index) in filter.cycles"
            :key="item._key"
            :label="index === 0 ? '统计周期' : ''"
            :prop="`cycles.${index}.value`"
            :rules="{required: index === 0, message: '必填项'}"
          >
            <el-select
              v-model="item.value"
              filterable
              clearable
              value-key="cycle_id"
            >
              <el-option
                v-for="temp in setSelectedListState('cycles', 'cycle_id')"
                :key="temp.cycle_id"
                :label="temp.cycle_name"
                :disabled="temp.disabled"
                :value="temp"
              ></el-option>
            </el-select>
            <SimpleConfirm
              @confirm="remove('cycles', index)"
              v-if="filter.cycles.length > 1"
            ></SimpleConfirm>
          </el-form-item>
          <el-form-item v-if="filter.cycles.length <= 2">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              @click="add('cycles')"
              >新建统计周期</el-button
            >
            <span class="limit-tip">{{ `${filter.cycles.length}/3` }}</span>
          </el-form-item>

          <h5><span class="order">3</span>确定业务限定</h5>
          <el-form-item
            v-for="(item, index) in filter.limits"
            :key="item._key"
            :label="index === 0 ? '业务限定' : ''"
            :prop="`limits.${index}.value`"
          >
            <el-select v-model="item.value" filterable clearable value-key="id">
              <!-- setSelectedListState('limits', 'id') | limits-->
              <el-option
                v-for="temp in setSelectedListState('limits', 'id')"
                :key="temp.id"
                :label="temp.condition_name"
                :disabled="temp.disabled"
                :value="temp"
              ></el-option>
            </el-select>
            <SimpleConfirm
              @confirm="remove('limits', index)"
              v-if="filter.limits.length > 1"
            ></SimpleConfirm>
          </el-form-item>
          <el-form-item v-if="filter.limits.length <= 2">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              @click="add('limits')"
              >新建业务限定</el-button
            >
            <span class="limit-tip">{{ `${filter.limits.length}/3` }}</span>
          </el-form-item>

          <div class="text-center mb-15">
            <el-button type="primary" plain v-if="!hasPreview" @click="backStep"
              >返回上一步</el-button
            >
            <el-button
              type="primary"
              :disabled="previewBtnDisabled"
              @click="getPrevAndCreatedData"
              >预生成派生指标</el-button
            >
          </div>
          <div v-if="hasPreview">
            <h5>
              <span class="order">4</span>确定业务限定
              <span class="grey">新生成({{ filter.previewData.length }})</span>
              <span class="grey">已生成({{ createdData.length }})</span>
            </h5>
            <el-form-item label="原子指标">{{
              filter.atomic_code + ' ' + filter.atomic_name
            }}</el-form-item>
            <template v-if="showUnionAttrFlag">
              <h5 class="sub-title">联合属性({{ filter.unionData.length }})</h5>
              <el-table :data="filter.unionData" stripe>
                <el-table-column
                  label="统计粒度"
                  prop="dim_info"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="联合属性内容" prop="union_attr">
                  <template #default="scope">
                    <el-row
                      v-for="(attr, index) in scope.row.union_attr"
                      :key="attr.id"
                    >
                      <el-form-item
                        label-width="0"
                        :prop="
                          `unionData.${scope.$index}.union_attr.${index}.element_code`
                        "
                        :rules="[
                          {
                            validator: (rule, value, callback) =>
                              validateUnionAttrRepeate(
                                scope.row,
                                attr,
                                value,
                                callback
                              ),
                            trigger: 'change'
                          }
                        ]"
                      >
                        <!-- enRules, -->
                        <el-input
                          v-model="attr.element_code"
                          maxlength="32"
                          show-word-limit
                        >
                          <template slot="prepend">
                            <OverflowTooltip :max-width="120"
                              >{{ attr.dim_code }}.</OverflowTooltip
                            >
                          </template>
                        </el-input>
                      </el-form-item>
                    </el-row>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="操作" width="80">
                  <template #default="scope">
                    <el-popover placement="left">
                      <p>描述：</p>
                      <el-input
                        type="textarea"
                        v-model="scope.row.desc"
                        show-limit-word
                        maxlength="128"
                      ></el-input>
                      <el-button
                        slot="reference"
                        type="text"
                        icon="font-16 el-icon-edit-outline mr-10"
                      ></el-button>
                    </el-popover>
                    <SimpleConfirm
                      @confirm="removeColumn(scope.row, scope.$index)"
                    ></SimpleConfirm>
                  </template>
                </el-table-column> -->
              </el-table>
            </template>
            <h5 class="sub-title">
              新生成派生指标({{ filter.previewData.length }})
            </h5>
            <el-table :data="filter.previewData" stripe>
              <el-table-column label="派生指标英文名" prop="derivative_code">
                <template #default="scope">
                  <p>{{ scope.row.prefix }}</p>
                  <el-form-item
                    label-width="0"
                    :prop="`previewData.${scope.$index}.derivative_code`"
                    :rules="[
                      {
                        validator: (rule, value, callback) =>
                          validateCodeRepeate(scope.row, value, callback),
                        trigger: 'change'
                      }
                    ]"
                  >
                    <!-- enRules, -->
                    <el-input
                      v-model="scope.row.derivative_code"
                      maxlength="32"
                      show-word-limit
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="派生指标名称" prop="derivative_name">
                <template #default="scope">
                  <el-form-item
                    label-width="0"
                    :prop="`previewData.${scope.$index}.derivative_name`"
                    :rules="{
                      validator: (rule, value, callback) =>
                        validateNameRepeate(scope.row, value, callback),
                      trigger: 'change'
                    }"
                  >
                    <el-input
                      type="textarea"
                      v-model="scope.row.derivative_name"
                      maxlength="32"
                      show-word-limit
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="统计粒度"
                prop="dim_name"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                label="统计周期"
                prop="cycle_name"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                label="业务限定"
                prop="condition_name"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="数据类型" prop="data_type">
                <template #default="scope">
                  <el-form-item
                    label-width="0"
                    :prop="`previewData.${scope.$index}.data_type`"
                  >
                    <el-select v-model="scope.row.data_type" disabled>
                      <el-option
                        v-for="item in dics.data_type"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="scope">
                  <el-popover placement="left">
                    <p>描述：</p>
                    <el-input
                      type="textarea"
                      v-model="scope.row.desc"
                      show-limit-word
                      maxlength="128"
                    ></el-input>
                    <el-button
                      slot="reference"
                      type="text"
                      icon="font-16 el-icon-edit-outline mr-10"
                    ></el-button>
                  </el-popover>
                  <SimpleConfirm
                    @confirm="removeColumn(scope.row, scope.$index)"
                  ></SimpleConfirm>
                </template>
              </el-table-column>
            </el-table>

            <div class="text-center mt-20 mb-20">
              <!-- v-if="hasPreview" -->
              <el-button type="primary" plain @click="backStep"
                >返回上一步</el-button
              >
              <el-button type="primary" @click="saveHandle">保存</el-button>
              <el-button type="primary" @click="publishHandle">发布</el-button>
            </div>
            <h5 class="sub-title">已生成派生指标({{ createdData.length }})</h5>
            <el-table :data="createdData" stripe>
              <el-table-column label="派生指标">
                <template #default="scope">
                  <CellContent
                    @click="showAttr(scope.row)"
                    :data="getCellContentData(scope.row, true)"
                    :clickable="false"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="统计粒度"
                prop="dim_name"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                label="统计周期"
                prop="cycle_name"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                label="业务限定"
                prop="condition_name"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                label="数据类型"
                prop="data_type"
              ></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-form>
  </section>
</template>

<script>
import {
  queryAtomicIndex,
  queryDimension,
  queryCycle,
  queryCondition,
  save,
  deriveIndexBatchPublish,
  delDerivative,
  // edit,
  queryDeriveIndex,
  queryUnionAttrInfoByDimIds
} from '@/api/rd/derive'

import {types, iconMap} from '@/config/rd-config'
import {mapGetters} from 'vuex'
import OverflowTooltip from '@c/overflow-tooltip'

let now = Date.now()

export default {
  name: 'DeriveEdit',
  props: {
    data: Object
  },
  components: {OverflowTooltip},
  data() {
    return {
      filter: {
        // ...this.project,
        atomic: '',
        atomic_id: '',
        logic_fact_code: '',
        gras: [{value: [], _key: now++}],
        cycles: [{value: '', _key: now++}],
        limits: [{value: '', _key: now++}],
        previewData: [],
        unionData: []
      },
      rules: {
        atomic_id: {required: true, message: '必填项'}
      },
      enRules: {
        pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
        message: '只能用英文、数字、下划线组成，且开头必须是字母'
      },
      createdData: [],
      atoms: [],
      gras: [],
      cycles: [],
      limits: [],
      activeStep: 0,
      hasPreview: false,
      fetchCount: 2,
      loading: 0,
      union_dim_info: '',
      showUnionAttrFlag: false
    }
  },
  computed: {
    ...mapGetters(['project']),
    previewBtnDisabled() {
      const hasGras = this.filter.gras.find(item => item.value.length)
      const hasCycle = this.filter.cycles.find(item => item.value)
      return !hasGras || !hasCycle
    }
  },
  created() {
    this.fetchAtoms()
    this.fetchCycles()
  },
  methods: {
    getDimIds(data) {
      return this.sortArray(data)
        .map(d => d.dim_id)
        .join('&')
    },
    validateDimRepeat(rule, value, callback) {
      const ids = this.getDimIds(value)
      const res = this.filter.gras.filter(g => this.getDimIds(g.value) === ids)
      if (res.length >= 2) {
        callback(new Error('统计粒度重复'))
      }
      callback()
    },
    validateUnionAttrRepeate(row, attr, value, callback) {
      const rows = row.union_attr.filter(
        item => item.dim_code + item.element_code === attr.dim_code + value
      )
      if (rows.length >= 2) {
        callback(new Error('联合属性重复'))
      }
      callback()
    },
    validateCodeRepeate(row, value, callback) {
      const rows = this.filter.previewData.filter(
        item =>
          item.prefix === row.prefix &&
          item.derivative_code === value &&
          item.dim_id_1 !== row.dim_id_1
      )
      if (rows.length >= 2) {
        callback(new Error('派生指标英文名重复'))
      }
      callback()
    },
    validateNameRepeate(row, value, callback) {
      const rows = this.filter.previewData.filter(
        item => item.derivative_name === value && item.dim_id_1 !== row.dim_id_1
      )
      if (rows.length >= 2) {
        callback(new Error('派生指标中文名重复'))
      }
      callback()
    },
    setSelectedListState(dataKey, compareKey) {
      return this[dataKey].map(d => {
        d.disabled = !!this.filter[dataKey].find(
          c => c.value[compareKey] === d[compareKey]
        )
        return d
      })
    },
    getCellContentData(row) {
      return {
        ...iconMap[types.DERIVE],
        ...row,
        code: row.derivative_code,
        name: row.derivative_name
      }
    },
    showAttr(row) {},
    changeAtom(value) {
      Object.assign(
        this.filter,
        this.atoms.find(item => item.atomic_id === value)
      )
      this.fetchSelectData()
    },
    backStep() {
      this.activeStep = 0
    },
    add(key) {
      this.filter[key].push({value: '', _key: now++})
    },
    remove(key, index) {
      // const index = this.filter[key].find(item => item._id === id)
      this.filter[key].splice(index, 1)
    },
    getCreatedParams() {
      const {atomic_id, gras, cycles, limits} = this.filter
      const params = {
        dim_id_1: gras.map(c => c.value.map(d => d.dim_id).join('&')).join('-'),
        condition_id: limits.map(c => c.value.id).join('-'),
        cycle_id: cycles.map(c => c.value.cycle_id).join('-'),
        atomic_id
      }
      return params
    },
    async getPrevAndCreatedData() {
      this.globalLoading()
      this.getUnionData()
      const res = await this.$simpleAsyncTo(
        queryDeriveIndex(this.getCreatedParams()),
        '获取已生成派生指标数据失败'
      )
      if (res) {
        this.createdData = res.data
        this.getPreviewData()
      }
      this.isSaved = false
      this.globalLoading().close()
    },
    async getUnionData() {
      const {atomic_id} = this.filter
      this.showUnionAttrFlag = false
      this.filter.unionData = []
      this.globalLoading()
      // this.union_dim_info = ''
      const res = await this.$simpleAsyncTo(
        queryUnionAttrInfoByDimIds({
          dim_id_1: this.filter.gras
            .map(c => c.value.map(d => d.dim_id).join('&'))
            .join('-'),
          atomic_id
        }),
        '获取联合属性数据失败'
      )
      if (res) {
        const {unionAttrData, whetherShowUnionAttrFlag} = res.data
        this.filter.unionData = unionAttrData
        this.showUnionAttrFlag = whetherShowUnionAttrFlag
      }
      this.globalLoading().close()
    },
    getPreviewData() {
      if (!this.validateForm()) return
      this.hasPreview = true
      const {
        gras,
        cycles,
        limits,
        atomic_name,
        atomic_code,
        source_id,
        atomic_id,
        data_field_id,
        data_field_name,
        data_type
      } = this.filter

      const previewData = []
      cycles.forEach(cycle => {
        if (!cycle.value) return
        gras.forEach(gra => {
          if (!gra.value.length) return
          limits.forEach(limit => {
            // if (!limit.value) return
            const {
                id: condition_id = null,
                condition_name = '',
                condition_alias = ''
              } = limit.value,
              dims = this.sortArray(gra.value),
              {cycle_id, cycle_code, cycle_name} = cycle.value,
              prefix = `${atomic_code}_${cycle_code}_`,
              derivative_code = condition_alias,
              derivative_name = `${cycle_name}_${condition_name ||
                ''}_${atomic_name}`,
              dim_name = dims
                .map(g => g.dim_name)
                .sort()
                .join('&'),
              dim_id_1 = dims
                .map(g => g.dim_id)
                .sort()
                .join('&')
            const i = previewData.findIndex(
              item =>
                item.prefix === prefix &&
                item.derivative_code === derivative_code &&
                item.derivative_name === derivative_name &&
                item.cycle_id === cycle_id &&
                  item.condition_id === condition_id &&
                  item.dim_id_1 === dim_id_1
            )

            const j = this.createdData.findIndex(
              item =>
                item.dim_id === dim_id_1 &&
                item.cycle_id === cycle_id &&
                item.condition_id === condition_id
              // item.derivative_code === prefix + derivative_code
            )

            i === -1 &&
              j === -1 &&
              previewData.push({
                prefix,
                derivative_code,
                derivative_name,
                dim_name,
                dim_id_1,
                source_id,
                atomic_id,
                cycle_code,
                cycle_name,
                cycle_id,
                condition_alias,
                condition_name,
                condition_id,
                // data_type: 'bigint',
                data_type,
                data_field_id,
                data_field_name,
                dims,
                desc: ''
              })
          })
        })
      })
      this.filter.previewData = previewData
    },
    async removeColumn(row, index) {
      if (this.isSaved) {
        const {atomic_id, condition_id, cycle_id, dim_id_1} = row
        const res = await this.$simpleAsyncTo(
          delDerivative({
            dim_id: dim_id_1,
            atomic_id,
            condition_id,
            cycle_id
          }),
          '删除失败'
        )
        if (res) {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.filter.previewData.splice(index, 1)
        }
      } else {
        this.filter.previewData.splice(index, 1)
      }
    },
    validateForm() {
      let flag
      this.$refs.form.validate(valid => {
        flag = valid
      })
      return flag
    },
    getSaveParams() {
      const params = [],
        attr = [],
        {previewData, unionData} = this.filter
      previewData.forEach(item => {
        const {
          derivative_code,
          derivative_name,
          prefix,
          atomic_id,
          source_id,
          dim_id_1,
          condition_id,
          cycle_id,
          data_type,
          data_field_name,
          data_field_id,
          desc
        } = item
        params.push({
          ...this.project,
          data_field_name,
          data_field_id,
          derivative_code: prefix + derivative_code,
          derivative_name,
          atomic_id,
          source_id,
          dim_id_1,
          condition_id,
          cycle_id,
          data_type,
          desc
        })
      })
      unionData.forEach(item => {
        attr.push({
          union_attr: item.union_attr
            .map(
              d => `${d.dim_code}.${d.element_code}@${d.id}@${d.rel_element_id}`
            )
            .join('&'),
          dim_id: item.dim_id
        })
      })
      this.isSaved = true
      return {
        data: JSON.stringify(params),
        attr: JSON.stringify(attr)
      }
    },
    async saveHandle() {
      if (!this.validateForm()) return
      this.globalLoading()
      const res = await this.$simpleAsyncTo(
        save(this.getSaveParams()),
        '保存失败'
      )
      if (res) {
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
        this.getUnionData()
        this.$root.eventEmitter.emit('refresh')
      }
      this.globalLoading().close()
    },
    async publishHandle() {
      if (!this.validateForm()) return
      this.globalLoading()
      const res = await this.$simpleAsyncTo(
        deriveIndexBatchPublish(this.getSaveParams()),
        '发布失败'
      )
      if (res) {
        this.$message({
          showClose: true,
          message: '发布成功',
          type: 'success'
        })
        // this.getUnionData()
        this.getPrevAndCreatedData()
        this.$root.eventEmitter.emit('refresh')
      }
      this.globalLoading().close()
    },
    fetchSelectData() {
      this.fetchCount = 2
      this.fetchGras()
      this.fetchLimits()
    },
    async fetchAtoms() {
      this.loading++
      const res = await this.$simpleAsyncTo(
        queryAtomicIndex({project_id: this.project.project_id}),
        '获取原子指标列表失败'
      )
      if (res) {
        this.atoms = res.data
        if (this.data) {
          this.filter.atomic_id = this.data.id
          this.changeAtom(this.data.id)
        }
      }
      this.loading--
    },
    async fetchGras() {
      const res = await this.$simpleAsyncTo(
        queryDimension({
          fact_logic_base_id: this.filter.source_id
        }),
        '获取统计粒度列表失败'
      )
      if (res) {
        this.gras = res.data
      }
      this.fetch--
    },
    async fetchCycles() {
      const res = await this.$simpleAsyncTo(
        queryCycle(),
        '获取统计周期列表失败'
      )
      if (res) {
        this.cycles = res.data
      }
      this.fetch--
    },
    async fetchLimits() {
      const res = await this.$simpleAsyncTo(
        queryCondition({
          fact_logic_base_id: this.filter.source_id
        }),
        '获取业务限定列表失败'
      )
      if (res) {
        this.limits = res.data
      }
      this.fetch--
    },
    sortArray(arr, key = 'dim_id') {
      return [...arr].sort((a, b) => a[key] - b[key])
    }
  }
}
</script>

<style lang="scss">
.derive-edit {
  background-color: $grey8;
  height: 100%;
  overflow: hidden;

  .el-form {
    height: 100%;
    padding: 0 20px 10px 20px;
    overflow: auto;
  }
  .first-section {
    .el-form-item {
      margin-bottom: 0px;
    }
  }
  .inline-item {
    @include clearfix;
    .el-form-item {
      float: left;
      margin-right: 25px;
    }
  }
  .el-steps {
    width: 500px;
    margin: 0 auto 20px;
  }
  .edit-content {
    padding: 10px;
    background-color: $grey10;
  }
  .step1 {
    width: 300px;
    margin: 0 auto;
  }
  .step2 {
    .el-form-item {
      .el-select {
        width: 80%;
      }
    }
  }

  h5 {
    // font-size: 13px;
    margin: 10px 0;
    font-size: 14px;

    &.sub-title {
      color: $grey2;
      font-size: 13px;
    }
    .order {
      display: inline-block;
      width: 14px;
      height: 14px;
      line-height: 14px;
      font-size: 12px;
      text-align: center;
      background-color: $--color-primary;
      color: $grey10;
      margin-right: 5px;
    }

    .grey {
      color: $grey4;
      font-size: 12px;
      margin-left: 20px;
    }
  }
  .limit-tip {
    color: $grey5;
    margin-left: 5px;
  }
  .align-center {
    display: inline-block;
  }

  .el-form-item {
    .el-icon-delete {
      margin-left: 5px;
      color: $grey5;

      &:hover {
        color: $grey3;
        cursor: pointer;
      }
    }
  }
}
</style>
