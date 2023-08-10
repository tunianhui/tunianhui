<template>
  <section class="limit-atom-edit">
    <div class="edit-content" ref="container">
      <div class="third-title" ref="title">选择来源信息</div>
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="120px"
        label-position="right"
        label-suffix="："
        class="basic-info-box cus-form"
      >
        <el-row>
          <el-col :md="8" :sm="24" :xs="24">
            <el-form-item label="业务板块">
              <div>{{editForm.business_field_name}}</div>
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24" :xs="24">
            <el-form-item label="所属项目">
              <div>{{editForm.project_name}}</div>
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24" :xs="24">
            <el-form-item label="项目空间类型">
              <div>{{editForm.space_type_name}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="数据域" prop="data_field_id">
              <el-select
                v-model="editForm.data_field_id"
                @change="changeDataFieldId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in metadata"
                  :key="item.data_field_id"
                  :label="item.data_field_name"
                  :value="item.data_field_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源表" prop="fact_logic_base_id">
              <el-select
                v-model="editForm.fact_logic_base_id"
                placeholder="请选择来源表"
                :disabled="!!data.fact_logic_base_id"
                :loading="!!loading"
                @change="changeSourceTable"
              >
                <el-option
                  v-for="(item,index) in sourceTableList"
                  :key="index"
                  :label="item.logic_fact_code"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="20" ref="tab" type="flex" class="mt-10 mb-10">
        <el-col :span="14">
          <div class="third-title">原子指标所在来源</div>
          <template v-if="!!editForm.fact_logic_base_id">
            <ul class="tab-title">
              <li
                v-for="tab in tabList"
                :key="tab.type"
                :class="{active: activeTab === tab.type}"
                @click="tabClick(tab)"
              >{{tab.label}}</li>
            </ul>
            <el-button
              type="primary"
              plain
              class="refresh-button"
              icon="el-icon-refresh-right"
              @click="getData(true)"
            ></el-button>
            <div class="tab-line"></div>
            <div class="sub-title">
              <div class="title">
                <span v-if="activeTab === 'whole'">全局原子指标列表({{tableData.length}})</span>
                <template v-else>
                  <span>
                    <span v-if="!!activeField.element_code">
                      <a href="javascript:;" @click="changeModalTable">{{activeModal.code}}</a>
                      <span>>{{activeField.element_code}}</span>
                    </span>
                    <span v-else>{{activeModal.code}}</span>
                    原子指标列表({{tableData.length}})
                  </span>
                </template>
              </div>
              <el-button
                type="primary"
                plain
                class="fr"
                icon="el-icon-plus"
                @click="handleCreate"
              >新建原子指标</el-button>
            </div>
          </template>
        </el-col>
        <el-col :span="10" v-if="!!editForm.fact_logic_base_id">
          <MiniFlow :data="flowData" @click="changeActiveModal" :activeNode="activeModal"></MiniFlow>
        </el-col>
      </el-row>
      <div class="empty-content text-center" v-if="tableData.length === 0">
        <img src="@/assets/images/nodata.png" />
        <p class="empty-text">{{editForm.fact_logic_base_id ? '暂时还没有任何原子指标文件哦' : '请先选择原子指标来源表哦'}}</p>
        <el-button
          v-if="!!editForm.fact_logic_base_id"
          type="primary"
          plain
          class="mt-10"
          icon="el-icon-plus"
          @click="handleCreate"
        >新建原子指标</el-button>
      </div>
      <el-row :gutter="20" v-else>
        <el-col :span="activeTab === 'whole' ? 24 : 14">
          <el-table
            :data="tableData"
            class="object-table-list"
            v-loading="tableLoading"
            :max-height="height"
          >
            <el-table-column label="原子指标">
              <template #default="scope">
                <div class="flex-layout" style="align-items: center;">
                  <div style="max-width: calc(100% - 34px);">
                    <p
                      class="text text-ellipsis"
                      :title="scope.row.atomic_code"
                    >{{scope.row.atomic_code}}</p>
                    <p
                      class="text text-ellipsis"
                      :title="scope.row.atomic_name"
                    >{{scope.row.atomic_name}}</p>
                  </div>
                  <el-popover
                    popper-class="dark-popper"
                    placement="right-start"
                    width="400"
                    trigger="click"
                  >
                    <MonacoEditor style="height:250px;" readonly :code="decrypt(scope.row.sql_content)" />
                    <el-tooltip
                      slot="reference"
                      popper-class="dark-popper"
                      effect="dark"
                      content="计算逻辑"
                      placement="top"
                    >
                      <el-button type="text" class="ml-10 iconfont icon-wangluoxitong font-16"></el-button>
                    </el-tooltip>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="atomic_desc" label="来源详情" show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="状态" show-overflow-tooltip>
              <template #default="scope">
                <Status :state="scope.row.status"></Status>
              </template>
            </el-table-column>
            <el-table-column prop="oper_user" label="最近更新人" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="text"
                  title="编辑"
                  icon="font-16 el-icon-edit-outline"
                  @click="handleEdit(scope.row, '编辑')"
                ></el-button>
                <el-button
                  type="text"
                  title="查看同源原子指标"
                  icon="font-16 iconfont icon-yewushili"
                  @click="handleSameSource(scope.row)"
                ></el-button>
                <el-button
                  type="text"
                  title="创建派生指标"
                  icon="font-16 iconfont icon-chuangjianpaishengzhibiao"
                  @click="handleCreateDerive(scope.row)"
                ></el-button>
                <el-tooltip popper-class="more-popover">
                  <ul class="popper-list" slot="content">
                    <li>
                      <el-button
                        type="text"
                        icon="font-16 el-icon-copy-document"
                        @click="handleEdit(scope.row, '克隆')"
                      >&nbsp;克隆</el-button>
                    </li>
                    <li>
                      <el-button
                        type="text"
                        :disabled="!['0', '6'].includes(scope.row.status)"
                        icon="font-16 iconfont icon-guanlianweiduluojibiao"
                        @click="handleRelatedDerive(scope.row, {
                          key: 'atomic_name',
                          value: scope.row.atomic_name,
                          id: scope.row.id
                        })"
                      >&nbsp;&nbsp;相关派生指标</el-button>
                    </li>
                    <li>
                      <el-button
                        type="text"
                        icon="font-16 iconfont icon-xiaxian2"
                        @click.stop="handleOffLine(scope.row, '原子指标')"
                        :disabled="!['0', '6'].includes(scope.row.status)"
                      >&nbsp;&nbsp;下线</el-button>
                    </li>
                    <li @click.stop="handleDelete(scope.row,scope.$index)">
                      <el-button type="text" icon="font-16 el-icon-delete">&nbsp;删除</el-button>
                    </li>
                  </ul>
                  <el-button type="text" icon="font-16 icon iconfont icon-diandian" title="更多"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="activeTab === 'whole' ? 0 : 10">
          <SimplePanel :data="activeModal" @item-click="showFieldTable" :max-height="height"></SimplePanel>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import {
  del,
  offLine,
  queryAtomicIndexInfo,
  getSourceTableModelInfoDim,
  getSourceTableModelInfoFact
} from '@/api/rd/atom'
import {types} from '@/config/rd-config'
import mixin from '../limit-atom-edit.mixin'
export default {
  name: 'AtomEdit',
  mixins: [mixin],
  data() {
    return {
      delFetch: del,
      offlineFetch: offLine
    }
  },
  methods: {
    handleEdit(row, title) {
      this.setActiveRdEditDialog({
        title: `${title}原子指标`,
        component: 'AtomEditDialog',
        data: {...row}
      })
    },
    handleCreate() {
      const {fact_logic_base_id, data_field_id, data_field_name} = this.editForm
      this.setActiveRdEditDialog({
        title: `新增原子指标`,
        component: 'AtomEditDialog',
        data: {
          fact_logic_base_id,
          data_field_id,
          data_field_name
        }
      })
    },
    handleSameSource(row) {
      this.tabStore.commit('add', {
        label: '同源原子指标 ' + row.condition_name,
        tabType: types.ATOM,
        name: row.id + '',
        component: 'AtomEdit',
        data: {
          ...row
        }
      })
    },
    handleCreateDerive(row) {
      this.tabStore.commit('add', {
        label: '新建派生指标',
        name: `new_derive`,
        tabType: types.DERIVE,
        component: 'DeriveEdit',
        data: {
          ...row
        }
      })
    },
    // 获取原子指标列表数据
    async getWholeTableData() {
      if (!this.editForm.fact_logic_base_id) return
      this.tableLoading = true
      const res = await this.$simpleAsyncTo(
        queryAtomicIndexInfo({
          project_name: this.editForm.project_name,
          data_field_name: this.editForm.data_field_name,
          fact_logic_base_id: this.editForm.fact_logic_base_id
        }),
        '获取原子指标列表失败'
      )
      if (res) {
        this.wholeData = res.data
      }
      this.tableLoading = false
    },
    async getFactList() {
      const {fact_logic_base_id, data_field_name, project_name} = this.editForm
      this.tableLoading = true
      const res = await this.$simpleAsyncTo(
        getSourceTableModelInfoFact({
          fact_logic_base_id,
          data_field_name,
          project_name,
          atomic_code: this.activeField.element_code
        }),
        fact_logic_base_id,
        data_field_name,
        project_name,
        '获取列表数据失败'
      )
      if (res) {
        this.modalData = res.data
      }
      this.tableLoading = false
    },
    async getDimList() {
      const {fact_logic_base_id, data_field_name, project_name} = this.editForm
      this.tableLoading = true

      const res = await this.$simpleAsyncTo(
        getSourceTableModelInfoDim({
          fact_logic_base_id,
          data_field_name,
          project_name,
          atomic_code: this.activeField.element_code,
          dim_code: this.activeModal.rel_dim_table
        }),
        '获取列表数据失败'
      )
      if (res) {
        this.modalData = res.data
      }
      this.tableLoading = false
    }
  }
}
</script>
