<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-08-07 17:00:32
 * @LastEditTime: 2021-08-07 17:21:41
 * @Description:
-->
<template>
  <TableEditLayout class="criterion-edit" :tabs="JSON.stringify(data) === '{}' ? [] : tabs" :buttons="btns" v-loading="!!loading" ref="tel">
    <el-form
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="120px"
        label-position="right"
        label-suffix="："
        class="basic-info-box"
        style="overflow:auto;height:100%"
      >
      <div class="edit-content">
        <div class="third-title">基本信息</div>
        <el-row>
          <el-col :md="24" :sm="24" :xs="24">
            <el-form-item label="标准名称" prop="std_name" style="width: 100%">
              <el-input
                v-model="editForm.std_name"
                placeholder="请输入标准名称"
                style="width: 100%;"
                maxlength="32"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="24" :xs="24">
            <el-form-item label="标准别名" prop="std_alias">
              <el-input
                v-model="editForm.std_alias"
                placeholder="请输入标准名称"
                style="width: 100%;"
                maxlength="32"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="24" :xs="24">
            <el-form-item label="英文名称" prop="std_code">
              <el-input
                v-model="editForm.std_code"
                placeholder="请输入维度英文名"
                maxlength="32"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="24" :xs="24">
            <el-form-item label="业务板块" prop="busin_id">
              <el-select
                v-model="editForm.busin_id"
                placeholder="请选择业务板块"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in businessOptions"
                  :key="item.busin_id"
                  :label="item.busin_name"
                  :value="item.busin_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="24" :xs="24">
            <el-form-item label="一级分类" prop="one_catalog_id">
              <el-select
                v-model="editForm.one_catalog_id"
                placeholder="请选择一级分类"
                style="width: 100%;"
                @visible-change="(val) => visibleChange(val, 'one')"
                @change="(val) => changeSelectHandle(val, 'one')"
              >
                <el-option
                  v-for="item in firstClassifyOptions"
                  :key="item.catalog_id"
                  :label="item.catalog_name"
                  :value="item.catalog_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="24" :xs="24">
            <el-form-item label="二级分类" prop="two_catalog_id">
              <el-select
                v-model="editForm.two_catalog_id"
                placeholder="请选择二级分类"
                style="width: 100%;"
                @visible-change="(val) => visibleChange(val, 'two')"
                @change="(val) => changeSelectHandle(val, 'two')"
                :disabled="!editForm.one_catalog_id"
              >
                <el-option
                  v-for="item in twoClassifyOptions"
                  :key="item.catalog_id"
                  :label="item.catalog_name"
                  :value="item.catalog_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="24" :xs="24">
            <el-form-item label="三级分类" prop="three_catalog_id">
              <el-select
                v-model="editForm.three_catalog_id"
                placeholder="请选择三级分类"
                style="width: 100%;"
                :disabled="!editForm.two_catalog_id"
                @visible-change="(val) => visibleChange(val, 'three')"
              >
                <el-option
                  v-for="item in threeClassifyOptions"
                  :key="item.catalog_id"
                  :label="item.catalog_name"
                  :value="item.catalog_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="third-title">业务属性</div>
        <el-row>
          <el-col :md="12" :sm="24" :xs="24">
            <el-form-item label="业务规则" prop="busin_rule">
              <el-input
                v-model="editForm.busin_rule"
                placeholder="请输入业务规则"
                maxlength="32"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
           <el-col :md="12" :sm="24" :xs="24">
            <el-form-item label="值域" prop="range_id">
              <el-select
                v-model="editForm.range_id"
                placeholder="请选择标准依据"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in rangeOptions"
                  :key="item.range_id"
                  :label="item.range_name"
                  :value="item.range_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="24" :xs="24">
            <el-form-item label="标准依据" prop="busin_quote">
              <el-select
                v-model="editForm.busin_quote"
                placeholder="请选择标准依据"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in tstandardBasisOptions"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :sm="24" :xs="24">
            <el-form-item label="业务定义" prop="busin_desc">
              <el-input
                type="textarea"
                v-model="editForm.busin_desc"
                :rows="4"
                maxlength="128"
                show-word-limit
                resize="none"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="third-title">技术属性</div>
        <el-row>
          <el-col :md="12" :sm="24" :xs="24">
            <el-form-item label="数据类别" prop="std_type">
              <el-select
                v-model="editForm.std_type"
                placeholder="请选择标准依据"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in dics.data_type"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="24" :xs="24">
            <el-form-item label="数据格式" prop="std_accuracy">
              <el-input
                v-model="editForm.std_accuracy"
                placeholder="请输入业务规则"
                maxlength="32"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="24" :xs="24">
            <el-form-item label="代码编码规则" prop="code_rule">
              <el-select
                v-model="editForm.code_rule"
                placeholder="请选择代码编码规则"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in codeRuleOptions"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="24" :xs="24">
            <el-form-item label="引用代码" prop="code_quote">
              <el-select
                v-model="editForm.code_quote"
                placeholder="请选择引用代码"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in quoteCodeOptions"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="third-title">管理属性</div>
        <el-row>
          <el-col :md="12" :sm="24" :xs="24">
            <el-form-item label="标准归属部门" prop="department">
              <el-select
                v-model="editForm.department"
                placeholder="请选择引用代码"
                style="width: 100%;"
                popper-class="select-tree"
                ref="treeSelect"
              >
                 <el-option
                  :label="editForm.department_name"
                  :value="editForm.department"
                  style="height:150px;background-color:#fff"
                >
                  <el-tree
                    :data="departmentOptions"
                    :current-node-key="currentNodeKey"
                    node-key="id"
                    accordion
                    :highlight-current="true"
                    :expand-on-click-node="false"
                    @node-click="handleNodeClick"
                    ref="tree"
                    style="font-weight: 400"
                    :props="defaultProps"
                    :default-expand-all="true"
                  >
                  </el-tree>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <SideModal
      :visible.sync="sideModelOption.visible"
      :title="sideModelOption.title"
      @confirm="sideModelOption.confirm"
    >
      <component
        ref="sideComponent"
        :is="sideModelOption.component"
        :data="sideModelOption.data"
      ></component>
    </SideModal>
  </TableEditLayout>
</template>

<script>
import TableEditLayout from '@c/table-edit-layout'
import SideModal from '@c/side-modal'
import {loop, capitalize} from '@/libs/util'
import {types} from '@/config/asset-config'
import {
  getListBusiness,
  getListBasis,
  getListCodeRule,
  getListCodeQuote,
  getListdepartment,
  saveStandard,
  editStandard,
  getValidVersion,
  getRangeList
} from '@/api/asset/standard/criterion.js'
import {getAllCatalog} from '@/api/asset/standard/category.js'
const VersionInfo = _ =>
  import(/* webpackChunkName: "VersionInfo" */ './version-info')
export default {
  name: 'CriterionEdit',
  props: {
    data: [Object, null]
  },
  inject: ['tabStore', 'attrStore'],
  components: {
    TableEditLayout,
    SideModal
  },
  data() {
    return {
      loading: 0,
      editForm: {
        std_name: '',
        std_alias: '',
        std_code: '',
        busin_rule: '',
        range_id: '',
        busin_quote: '',
        busin_desc: '',
        std_type: '',
        std_accuracy: '',
        code_rule: '',
        code_quote: '',
        department: '',
        one_catalog_id: '',
        two_catalog_id: '',
        three_catalog_id: '',
        busin_id: ''
      },
      editFormRules: {
        std_name: [{required: true, message: '请输入维度名称'}],
        std_code: [{required: true, message: '请输入英文名称'}],
        one_catalog_id: [{required: true, message: '请选择一级分类'}],
        busin_id: [{required: true, message: '请选择业务板块'}],
        busin_rule: [{required: true, message: '请选择业务规则'}],
        busin_desc: [{required: true, message: '请输入业务定义'}],
        std_type: [{required: true, message: '请输入数据类别'}],
        std_accuracy: [{required: true, message: '请输入数据格式'}],
        department: [{required: true, message: '请输入标准归属部门'}]
      },
      firstClassifyOptions: [],
      twoClassifyOptions: [],
      threeClassifyOptions: [],
      tstandardBasisOptions: [],
      codeRuleOptions: [],
      quoteCodeOptions: [],
      businessOptions: [],
      departmentOptions: [],
      rangeOptions: [],
      tabs: [
        {
          label: '版本信息',
          title: '版本信息',
          handler: this.tabClick,
          confirm: this.tableConfirm,
          component: VersionInfo,
          data: {}
        }
      ],
      btns: [
        {
          icon: 'icon iconfont icon-baocun',
          handler: this.saveHandle,
          disabled: false,
          title: '保存'
        },
        // {
        //   icon: 'icon iconfont icon-fabu',
        //   handler: this.submitHandle,
        //   disabled: false,
        //   title: '发布'
        // },
        {
          icon: 'icon iconfont icon-iconfontzhizuobiaozhun023117',
          handler: this.locationHandle,
          disabled: false,
          title: '定位'
        }
      ],
      sideModelOption: {
        title: '',
        visible: false,
        component: null,
        confirm: loop
      },
      currentNodeKey: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {},
  async created() {
    this.loading++
    await this._getListBusiness()
    await this._getListBasis()
    await this._getListCodeRule()
    await this._getListCodeQuote()
    await this._getListdepartment()
    await this._getRangeList()
    if (JSON.stringify(this.data) !== '{}') {
      this.editForm.std_name = this.data.std_name
      this.editForm.std_alias = this.data.std_alias
      this.editForm.std_code = this.data.std_code
      this.editForm.busin_rule = this.data.busin_rule
      this.editForm.range_id = this.data.range_id
      this.editForm.busin_quote = this.data.busin_quote
      this.editForm.busin_desc = this.data.busin_desc
      this.editForm.std_type = this.data.std_type
      this.editForm.std_accuracy = this.data.std_accuracy
      this.editForm.code_rule = this.data.code_rule
      this.editForm.code_quote = this.data.code_quote
      this.editForm.department = this.data.department
      this.editForm.one_catalog_id = this.data.one_catalog_id
      this.editForm.two_catalog_id = this.data.two_catalog_id
      this.editForm.three_catalog_id = this.data.three_catalog_id
      this.editForm.busin_id = this.data.busin_id
      this.editForm.version = this.data.version
      if (this.editForm.one_catalog_id) {
        await this.visibleChange(true, 'one')
        if (this.editForm.two_catalog_id) {
          await this.visibleChange(true, 'two')
          if (this.editForm.three_catalog_id) {
            await this.visibleChange(true, 'three')
          }
        }
      }
      console.log(this.data.department, this.departmentOptions)
      const result = this.getCurrentPart(this.data.department, this.departmentOptions)
      console.log(result)
      if (result) {
        this.editForm.department_name = result.name
        this.editForm.department = result.id
      } else {
        this.editForm.department_name = ''
        this.editForm.department = ''
      }
    }
    this.loading--
  },
  mounted() {},
  methods: {
    getCurrentPart(id, items) {
      let result
      for (var i in items) {
        let item = items[i]
        if (item.id === id || item.id === id + '') {
          result = item
          console.log(result)
          break
        }
        if (item.children && item.children.length) {
          const text = this.getCurrentPart(id, item.children)
          if (text) {
            return text
          }
        }
      }
      return result
    },
    handleSaveDim() {},
    handlePublishDim() {},
    async tabClick(tab) {
      if (tab.title === this.sideModelOption.title) {
        this.sideModelOption.visible = !this.sideModelOption.visible
        return
      }
      if (this.sideModelOption.visible) {
        this.sideModelOption.visible = false
        await this.$sleep(200)
      }
      Object.assign(this.sideModelOption, tab, {visible: true, data: this.data})
    },
    tableConfirm() {
      const data = this.$refs.sideComponent.getData()
      this.editForm.version = data
      this.sideModelOption.visible = false
    },
    async _getListBusiness() {
      const res = await this.$simpleAsyncTo(getListBusiness(), '获取业务板块失败')
      if (res) {
        this.businessOptions = res.data
      }
    },
    async _getAllCatalog(params, key) {
      const res = await this.$simpleAsyncTo(getAllCatalog(params), '获取分类失败')
      if (res) {
        this[key] = res.data
      }
    },
    async visibleChange(val, type) {
      // console.log(val, type)
      if (val) {
        if (type === 'one') {
          await this._getAllCatalog({parent_id: '', level: 1, type: 1}, 'firstClassifyOptions')
        } else if (type === 'two') {
          await this._getAllCatalog({parent_id: this.editForm.one_catalog_id, level: 2, type: 1}, 'twoClassifyOptions')
        } else if (type === 'three') {
          await this._getAllCatalog({parent_id: this.editForm.two_catalog_id, level: 3, type: 1}, 'threeClassifyOptions')
        }
      }
    },
    changeSelectHandle(val, type) {
      // if (type === 'one') {
      //   this.editForm.two_catalog_id = ''
      //   this.editForm.three_catalog_id = ''
      // } else if (type === 'two') {
      //   this.editForm.three_catalog_id = ''
      // }
    },
    // 标准依据
    async _getListBasis() {
      const res = await this.$simpleAsyncTo(getListBasis(), '获取标准依据失败')
      if (res) {
        this.tstandardBasisOptions = res.data
      }
    },
    // 编码规则
    async _getListCodeRule() {
      const res = await this.$simpleAsyncTo(getListCodeRule(), '获取编码规则失败')
      if (res) {
        this.codeRuleOptions = res.data
      }
    },
    // 引用代码
    async _getListCodeQuote() {
      const res = await this.$simpleAsyncTo(getListCodeQuote(), '获取引用代码失败')
      if (res) {
        this.quoteCodeOptions = res.data
      }
    },
    // 所属部门
    async _getListdepartment() {
      const res = await this.$simpleAsyncTo(getListdepartment(), '获取标准所属部门失败')
      if (res) {
        this.departmentOptions = res.data
      }
    },
    // 值域
    async _getRangeList() {
      const res = await this.$simpleAsyncTo(getRangeList(), '获取值域失败')
      if (res) {
        this.rangeOptions = res.data
      }
    },
    handleNodeClick(data, node) {
      this.editForm.department_name = data.name
      this.editForm.department = data.id
      this.$refs.treeSelect.blur()
    },
    saveHandle() {
      this.$refs['editForm'].validate(async (valid) => {
        if (valid) {
          let params = {}, fn = null, msg = ''
          if (this.editForm.version) {
            const versionRule = await this._getValidVersion(this.editForm.version)
            if (!versionRule) {
              return this.$message({
                type: 'error',
                message: '版本号校验失败'
              })
            }
          }
          if (JSON.stringify(this.data) === '{}') {
            params = {
              ...this.editForm
            }
            fn = saveStandard
            msg = '保存'
          } else {
            params = {
              ...this.editForm,
              std_id: this.data.std_id,
              status: this.data.status
            }
            fn = editStandard
            msg = '修改'
          }
          const res = await this.$simpleAsyncTo(fn(params), `${msg}失败`)
          if (res) {
            this.$message({
              type: 'success',
              message: `${msg}成功`
            })
            this.tabStore.commit('remove', this.tabStore.states.active.name)
            if (this.data.myFlag) {
              this.tabStore.commit('setActive', this.data.myFlag)
            }
            this.openObjectTable('CRITERION')
            this.$root.eventEmitter.emit('refresh')
            this.$root.eventEmitter.emit('refreshTable')
          }
        }
      })
    },
    openObjectTable(type) {
      const key = 'standard'
      this.$store.commit(`${key}/SET_ACTIVE`, types[type])
      this.tabStore.commit('add', {
        label: `标准查询列表`,
        tabType: types.OBJECTTABLE,
        name: `${key}_${types.OBJECTTABLE}`, // tab页的标识
        component: `${capitalize(key)}ObjectTable`
      })
    },
    async _getValidVersion(data) {
      const res = await this.$simpleAsyncTo(getValidVersion({version: data}), '校验失败')
      if (res) {
        return res.data
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss">
.criterion-edit {
  height: 100%;
  background-color: $grey7;
  // .edit-content {
  //   padding: 0px 15px 10px;
  //   .basic-info-box {
  //     background-color: $grey10;
  //     padding: 10px;
  //   }
  // }
  .basic-info-box {
    // background-color: $grey10;
    padding: 10px;
    .edit-content {
      .el-row {
        background-color: $grey10;
        padding: 20px 15px 0px;
      }
    }
  }
}
</style>
