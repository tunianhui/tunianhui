<template>
  <div class="list-mode">
    <el-link class="mt-10 mb-10" type="primary" @click="$emit('back')">
      <i class="el-icon-d-arrow-left"></i>&nbsp; 返回模型编辑
    </el-link>
    <LogicTableHeader :data="headerData" class="mb-10"></LogicTableHeader>
    <div class="tabs-box">
      <div class="tabs-right">
        <!-- <span>
          创建时间
          <i class="icon iconfont icon-shousuoxiajiantou"></i>
        </span>-->
        <el-input
          v-model="keyword"
          placeholder="搜索字段英文名"
          clearable
          @input="filterByName(200)"
        >
          <i slot="suffix" class="el-icon-search"></i>
        </el-input>
        <el-button
          v-popover:addpopover
          type="primary"
          icon="el-icon-plus"
          :disabled="readonly"
        >
          新建字段
        </el-button>
        <el-button
          type="default"
          icon="iconfont icon-yewuliu"
          :disabled="readonly"
          @click="$emit('createCommonLogic')"
        >
          &nbsp;&nbsp;定义公用计算逻辑
        </el-button>
        <el-popover
          popper-class="more-popover"
          placement="bottom"
          trigger="hover"
          ref="addpopover"
        >
          <ul class="popper-list">
            <li v-for="item in createList" :key="item.label">
              <el-button @click="$emit('create', item.type)" type="text">{{
                item.label
              }}</el-button>
            </li>
            <!-- <li>
              <el-button @click="$emit('createRelation')" type="text">关联维度</el-button>
            </li>-->
          </ul>
        </el-popover>
        <!-- <el-button icon="el-icon-refresh" @click="$emit('refresh')"></el-button> -->
      </div>
      <el-tabs
        class="list-mode-tabs"
        @tab-click="$emit('changeMode', activeTabName)"
        v-model="activeTabName"
      >
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.label"
          :name="item.name"
        >
          <el-table
            class="group-table"
            :data="getTableData(tableData)"
            :border="false"
            :span-method="mergeColumn"
            :cell-class-name="setCellClass"
          >
            <el-table-column width="55">
              <template #default="scope">
                <el-tooltip
                  placement="top"
                  content="系统生成字段不可删除"
                  :disabled="scope.row.checkable"
                >
                  <el-checkbox
                    v-model="scope.row.checked"
                    :disabled="!scope.row.checkable || readonly"
                    v-if="!scope.row.head"
                    @change="$emit('selectChange', scope.row)"
                  ></el-checkbox>
                </el-tooltip>
                <span v-if="scope.row.head">{{ scope.row.element_name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="字段英文名"
              show-overflow-tooltip
              prop="element_code"
            >
              <template #default="scope">
                <div style="display: flex; align-items: center;">
                  <i class="iconfont icon-A pr-10"></i>
                  <span
                    v-html="$highlightKeyword(scope.row.element_code, keyword)"
                  ></span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="字段名称"
              show-overflow-tooltip
              prop="element_name"
            >
              <template #default="scope">
                <span
                  v-html="$highlightKeyword(scope.row.element_name, keyword)"
                ></span>
              </template>
            </el-table-column>
            <el-table-column label="数据类型" prop="element_type">
              <template #default="scope">{{
                scope.row.element_type.toUpperCase()
              }}</template>
            </el-table-column>
            <el-table-column label="模型关系" prop="relation" width="300px">
              <template #default="scope">
                <div v-if="scope.row.group_type === 'primarykey'">
                  <el-tag size="medium" type="info">主键</el-tag>
                </div>
                <div
                  v-if="
                    ['attr', 'measure', 'relation'].includes(
                      scope.row.group_type
                    )
                  "
                  class="relation-column"
                >
                  <p v-if="scope.row.group_type === 'relation'">
                    {{ scope.row.rel_dim_table }}&nbsp;{{
                      scope.row.rel_dim_name
                    }}
                    <span
                      class="el-icon-document"
                      @click.stop="goDimAttr(scope.row)"
                    ></span>
                  </p>
                  <div>
                    <el-tag class="mr-10" size="medium" type="info">{{
                      scope.row.group_name
                    }}</el-tag>
                    <el-button
                      type="primary"
                      plain
                      icon="el-icon-edit"
                      :disabled="readonly"
                      @click="$emit('editRelation', scope.row)"
                    >
                      编辑模型关系
                    </el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="120px">
              <template #header="scope">
                <el-dropdown
                  @command="sortByComputerLogic"
                  trigger="click"
                  style="padding: 0;"
                >
                  <el-link :underline="false">
                    计算逻辑
                    <i
                      v-if="activeDropdown.type !== 'All'"
                      :class="
                        `font-16 ${activeDropdown.type} ${activeDropdown.icon}`
                      "
                    ></i>
                    <span v-else>(All)</span>&nbsp;
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-link>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in dropdownList"
                      :key="item.type"
                      :command="item"
                    >
                      <p>
                        <i class="iconfont icon-yewuliu pr-5"></i>
                        <span class="pr-5">
                          <span
                            v-if="item.type !== 'All'"
                            :class="`${item.type} ${item.icon} font-16`"
                          ></span>
                          <span v-else>All</span>
                        </span>
                        {{ item.element_name }}
                      </p>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template #default="scope">
                <div>
                  <el-popover
                    width="400"
                    placement="left"
                    popper-class="dark-popper"
                    v-if="
                      ['system', 'primarykey'].includes(scope.row.group_type)
                    "
                  >
                    <el-button
                      type="text"
                      class="font-16 mr-10 uneditable"
                      icon="iconfont icon-yewuliu"
                      :disabled="readonly"
                      slot="reference"
                    ></el-button>
                    <MonacoEditor
                      style="height: 300px"
                      has-bottom-tools
                      :code="scope.row.sql_content"
                      readonly
                    ></MonacoEditor>
                  </el-popover>
                  <el-button
                    class="font-16"
                    type="text"
                    icon="iconfont icon-yewuliu"
                    :disabled="readonly"
                    @click="$emit('editFieldByEditor', scope.row)"
                    v-else
                  ></el-button>
                  <el-button
                    class="font-16"
                    type="text"
                    icon="el-icon-success"
                  ></el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
              <template #default="scope">
                <div v-if="!scope.row.head">
                  <el-tooltip placement="top" :disabled="!scope.row.editTip">
                    <!-- :content="scope.row.editTip" -->
                    <div slot="content">
                      <span v-if="scope.row.group_type === 'primarykey'">
                        主键请至
                        <a
                          style="text-decoration: underline; cursor: pointer;"
                          @click="$emit('goTableEdit', scope.row)"
                        >
                          {{ scope.row.editTip }}
                        </a>
                        编辑
                      </span>
                      <span v-else-if="scope.row.group_type === 'system'">{{
                        scope.row.editTip
                      }}</span>
                    </div>
                    <el-button
                      :disabled="!!scope.row.editTip || readonly"
                      type="text"
                      @click="$emit('editField', scope.row)"
                    >
                      <i class="el-icon-edit-outline font-16"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip
                    placement="top"
                    :content="scope.row.deleteTip"
                    v-if="!!scope.row.deleteTip"
                  >
                    <el-button disabled type="text" class="ml-10">
                      <i class="el-icon-delete font-16"></i>
                    </el-button>
                  </el-tooltip>
                  <SimpleConfirm
                    v-else
                    @confirm="$emit('remove', scope.row)"
                    :disabled="readonly"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <TableBottom
      :checkable="!!checkableCount && !readonly"
      :deleteable="!!selectedData.length"
      :selectAll.sync="selectAll"
      :checkedCount="selectedData.length"
      @delete="$emit('batchRemove', selectedData)"
      @selectChange="selectChange"
    ></TableBottom>
  </div>
</template>

<script>
import TableBottom from '@c/table-bottom'
import LogicTableHeader from '@c/logic-table-header'
import '@/assets/css/group-table.scss'
import cloneDeep from 'lodash/cloneDeep'
import {types} from '@/config/rd-config'

export default {
  name: 'ListMode',
  props: {
    headerData: Object,
    data: Array,
    createList: Array,
    readonly: Boolean
  },
  inject: ['tabStore', 'attrStore'],
  components: {
    TableBottom,
    LogicTableHeader
  },
  data() {
    const tabList = [
        {
          label: '按类型分组',
          name: 'type'
        },
        {
          label: '按来源分组',
          name: 'source'
        }
      ],
      dropdownList = [
        {name: '全部状态', type: 'All'},
        {name: '校验成功', type: 'success', icon: 'el-icon-success'},
        {name: '校验失败', type: 'error', icon: 'el-icon-error'},
        {
          name: '校验中',
          type: 'primary',
          icon: 'iconfont icon-wait'
        }
      ]
    return {
      tabList,
      tableData: [],
      activeTabName: tabList[0].name,
      activeTab: tabList[0],
      keyword: '',
      dropdownList,
      // selectedData: [],
      // selectAll: false,
      activeDropdown: dropdownList[0],
      activeEditField: {},
      activeEditFieldValue: '',
      allData: this.data,
      visibleCommonComputeLogic: false
    }
  },
  computed: {
    checkableCount() {
      return this.data.filter(
        item =>
          !item.head && !['primarykey', 'system'].includes(item.group_type)
      ).length
    },
    selectedData() {
      return this.tableData.filter(item => item.checked)
    },
    selectAll: {
      get() {
        return this.checkableCount === this.selectedData.length
      },
      set(val) {
        return val
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(val) {
        this.tableData = cloneDeep(val)
        this.filterByName(0)
      }
    }
  },
  methods: {
    getTableData(data) {
      return data.filter(item => item.visible)
    },
    mergeColumn({row, column, rowIndex, columnIndex}) {
      return row.head ? (columnIndex === 0 ? [1, 7] : [0, 0]) : [1, 1]
    },
    setCellClass({row, column, rowIndex, columnIndex}) {
      return row.head && columnIndex === 0 ? 'group-column-head' : ''
    },
    goDimAttr(row) {
      const attr = {
        title: '维度',
        attrType: types.DIMENSION,
        name: row.rel_dim_id,
        label: row.rel_dim_table,
        data: {
          id: row.rel_dim_id,
          dim_type: row.rel_dim_type,
          ...row
        }
      }
      this.attrStore.commit('add', attr)
      this.attrStore.commit('setActiveToFirst', attr)
    },
    filterByName(delay = 200) {
      delay ? this.$debounce(this.filter.bind(this), delay)() : this.filter()
    },
    filter() {
      const reg = new RegExp(this.keyword, 'i')
      this.tableData.forEach(item => {
        const {element_name, element_code} = item
        if (item.head) {
          item.visible = !!item.children.find(
            c => reg.test(c.element_name) || reg.test(c.element_code)
          )
        } else {
          item.visible = reg.test(element_name) || reg.test(element_code)
        }
      })
    },
    selectChange(val) {
      this.$emit('selectChange', val)
    },
    sortByComputerLogic(command) {
      this.activeDropdown = command
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/list-mode.scss';
</style>
