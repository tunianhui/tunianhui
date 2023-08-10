<template>
  <div class="topic-domain-management height-100per flex-column">
    <div :class="['topic-domain-management-content', pageType == 'form' ? 'active' : '']" v-if="hasData">
      <div class="topic-domain-table-list" v-if="pageType == 'form'">
        <el-table
          ref="topicDomainTableListData"
          :data="topicDomainTableListData"
          style="width: 100%; margin-bottom: 20px"
          row-key="id"
          border
          :tree-props="{children: 'children'}"
          :select-on-indeterminate="true"
          @select="select"
          @select-all="selectAll"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="主题域名称/编码" width="200">
            <template slot-scope="scope">
              <span>
                <img
                  src="@/assets/images/topic/zty.png"
                  width="36"
                  height="36"
                  style="margin-right: 8px"
                  alt=""
                />
                <span style="display: inline-block">
                  {{ scope.row.data_name }} <br />
                  {{ scope.row.data_code }}
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="data_code_short" label="英文缩写" width="180">
          </el-table-column>
          <el-table-column prop="comments" label="描述"></el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                type="text"
                title="新建下级主题域"
                class="item-btn"
                icon="font-16 icon iconfont icon-xinjian2"
                @click="addTopicDomain('sub', scope.row)"
              ></el-button>
              <el-button
                type="text"
                title="新建业务实体"
                class="item-btn"
                icon="font-16 icon iconfont icon-xinjian1"
                @click="addBusinessEntity()"
              ></el-button>
              <el-button
                type="text"
                class="item-btn"
                title="编辑主题域"
                icon="font-16 icon iconfont icon-bianji2"
                @click="addTopicDomain('edit', scope.row)"
              ></el-button>
              <el-button
                type="text"
                class="item-btn"
                title="删除主题域"
                icon="font-16 icon iconfont icon-shanchu1"
                @click="handleRuleDel(scope.row)"
              ></el-button
            ></template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="fr pt-10"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-size="pageFilters.pageSize"
          :page-sizes="pageSizes"
          :current-page.sync="pageFilters.pageNo"
          layout="total, prev, pager, next"
          :total="total"
        ></el-pagination>
        <div class="fl pt-10">
          <el-checkbox
            v-model="allChecked"
            style="background-color: white"
            label="本页全选"
            border
            @change="handleAllChecked"
          ></el-checkbox>
          <el-button
            icon="el-icon-delete"
            size="mini"
            :disabled="delInBatchesStatus"
            @click="delInBatches($event)"
          >
            批量删除
          </el-button>
        </div>
      </div>
      <template v-else>
        <div style="height: 100%">
          <RelGraph :businId="businId"></RelGraph>
          <!-- <div class="taglist"> -->
            <!-- <div
              v-for="item in tagTreeData"
              :key="item.id"
              class="tagitem"
              @click="chhoseItem(item)"
            > -->
            <!-- <div v-for="item in tagTreeData" :key="item.id" class="tagitem">
              <div>
                <img :src="filterImgSrc(item)" alt="" srcset="" />
              </div>
              <div>{{ item.name }}</div>
            </div>
          </div>
          <zm-tree-org
            ref="tree"
            :data="treeData"
            :disabled="disaled"
            :horizontal="true"
            :collapsable="collapsable"
            :label-style="style"
            :node-draggable="false"
            :default-expand-level="1"
            :filterNodeMethod="filterNodeMethod"
            @on-contextmenu="onMenus"
            @on-expand="onExpand"
            @on-node-click="onNodeClick"
          > -->
            <!-- 自定义节点内容 -->
            <!-- <template slot-scope="{node}">
              <div class="node-block">
                <div>
                  <img :src="filterImgSrc2(node)" alt="" srcset="" />
                </div>
                <div class="tree-org-node__text node-label">
                  {{ node.label }} <br />
                  <span>{{ node.code }}</span>
                </div>
              </div>
            </template> -->
            <!-- 自定义展开按钮 -->
            <!-- <template v-slot:expand="{node}">
              <div>{{ node.children.length }}</div>
            </template> -->
          <!-- </zm-tree-org> -->
        </div>
      </template>
    </div>
    <div v-else>
      <el-empty description="暂无主题域">
        <div>
          <p class="emptpy-content">
            尝试新建主题域吧，以提供主题域管理空间，开始标准规范地建设。
          </p>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addTopicDomain('new')"
            >新建主题域</el-button
          >
        </div>
      </el-empty>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      width="40%"
      :before-close="handleCancel"
      custom-class="form-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-draggable="{
        trigger: '.el-dialog__header',
        body: '.el-dialog',
        recover: false,
      }"
    >
      <div v-if="dialogType == 'dataField'">
        <el-form
          :model="dataTopicDomainForm"
          ref="dataTopicDomainForm"
          :rules="rules"
        >
          <el-form-item
            label="主题域名称"
            prop="data_name"
            :label-width="formLabelWidth"
          >
            <el-input
              type="text"
              v-model="dataTopicDomainForm.data_name"
              placeholder="64位字符以内，仅允许汉字、字母、数字、下划线和中划线"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="编码"
            prop="data_code"
            :label-width="formLabelWidth"
          >
            <el-input
              type="text"
              v-model="dataTopicDomainForm.data_code"
              placeholder="请输入编码，64位字符以内，仅允许字母、数字和下划线"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="英文缩写"
            prop="data_code_short"
            :label-width="formLabelWidth"
          >
            <el-input
              type="text"
              v-model="dataTopicDomainForm.data_code_short"
              placeholder="请输入缩写，15位字符以内，仅允许字母、数字和下划线"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="上级主题域"
            prop="treeId"
            :label-width="formLabelWidth"
          >
            <el-select
              v-model="dataTopicDomainForm.treeId"
              placeholder="请选择"
              ref="treeSelect"
            >
              <el-option
                :label="dataTopicDomainForm.treeName"
                :value="dataTopicDomainForm.treeId"
                style="
                  max-height: auto;
                  background-color: #fff;
                  padding: 0;
                  font-weight: 400;
                "
              >
                <el-tree
                  :data="dataFieldList"
                  :props="{children: 'children', label: 'name'}"
                  accordion
                  :highlight-current="true"
                  :expand-on-click-node="false"
                  @node-click="handleNodeClick"
                >
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="描述"
            prop="comments"
            :label-width="formLabelWidth"
          >
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入描述"
              maxlength="128"
              show-word-limit
              v-model="dataTopicDomainForm.comments"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button-group>
          <el-button @click="handleCancel()">取消</el-button>
          <el-button @click="submitForm('dataTopicDomainForm')" type="primary"
            >确定</el-button
          >
        </el-button-group>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="treeDialogVisible" title="主题域管理" width="60%">
      <div>
        <div style="height: 400px; border: 1px solid #eee">
          <zm-tree-org
            ref="tree"
            :data="treeComponentData"
            :disabled="disaled"
            :horizontal="horizontal"
            :collapsable="collapsable"
            :label-style="style"
            :node-draggable="false"
            :default-expand-level="1"
            :filterNodeMethod="filterNodeMethod"
            @on-contextmenu="onMenus"
            @on-expand="onExpand"
            @on-node-click="onNodeClick"
          >
            <!-- 自定义节点内容 -->
            <template slot-scope="{node}">
              <div class="node-block">
                <div>
                  <img :src="filterImgSrc2(node)" alt="" srcset="" />
                </div>

                <div class="tree-org-node__text node-label">
                  {{ node.label }} <br />
                  {{ node.label }}
                </div>
              </div>
            </template>
            <!-- 自定义展开按钮 -->
            <template v-slot:expand="{node}">
              <div>{{ node.children.length }}</div>
            </template>
          </zm-tree-org>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import _ from 'lodash'
import {
  queryDataFieldList,
  queryDataFieldTreeInfo,
  queryDataFieldRelDiagram,
  deleteplanDataArchitecture, //删除
  getDataField, //上级域
  saveDataField, //新增
  editDataField, //编辑
  delBatchDataField, //批量删除
} from '@/api/plan/data-architecture'

import RelGraph from './rel-graph'

export default {
  name: 'topicDomainManagement',
  mixins: [pager],
  components: {
    RelGraph
  },
  props: {
    businId: {
      type: String,
      default: '',
    },
    dataBlock: {
      type: String,
      default: '',
    },
    dataSourceName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dataFieldList: [], //上级主题域
      dialogType: 'dataField',
      tagTreeData: [],
      treeDialogVisible: false,
      treeComponentData: {},
      keyword: '',
      horizontal: false,
      collapsable: false,
      // onlyOneNode: false,
      // cloneNodeDrag: false,
      // expandAll: false,
      disaled: false,
      style: {
        background: '#fff',
        color: '#5e6d82',
      },
      topicDomainTableListData: [],
      hasData: true,
      dialogVisible: false,
      dialogTitle: '',
      formLabelWidth: '100px',
      allChecked: false,
      isIndeterminate: true,
      checkedList: [],
      delInBatchesStatus: true,
      totalCount: 0,
      pageType: 'form',
      dataTopicDomainForm: {
        data_name: '',
        data_code: '',
        data_code_short: '',
        comments: '',
        treeId: '0',
        treeName: '根节点',
      },
      rules: {
        data_name: [
          {required: true, message: '请输入数据域名称'},
          {
            pattern: /^[\u4e00-\u9fa5\w-]{1,64}$/,
            message:
              '数据域名称至多64个字符，允许中文、数字、字母、下划线或连字符',
            trigger: ['blur', 'change'],
          },
        ],
        treeId: [{required: true, message: '请选择上级主题域'}],
        data_code: [
          {required: true, message: '请输入数据域英文名'},
          {
            pattern: /^\w{1,64}$/,
            message: '数据域英文名至多64个字符，允许数字、字母、下划线',
            trigger: ['blur', 'change'],
          },
        ],
        data_code_short: [
          {required: true, message: '请输入英文名缩写'},
          {
            pattern: /^\w{1,10}$/,
            message: '英文名缩写至多10个字符，允许数字、字母、下划线',
            trigger: ['blur', 'change'],
          },
        ],
      },
      treeData: {
        id: 0,
        label: '',
        code: '',
        children: [],
      },
      entityRelDrawerVisible: false,
    }
  },
  watch: {
    checkedList(val) {
      if (val.length > 1) {
        this.delInBatchesStatus = false
      } else {
        this.delInBatchesStatus = true
      }
    },
  },
  created() {
    this.getTableList()
  },
  methods: {
    // 关系图-选中数据
    chhoseItem(val) {
      this.treeDialogVisible = true
      this.treeComponentData = val
    },
    // 改变数据结构
    exchageData(arr) {
      arr.forEach((item) => {
        item.label = item.name
        if (item.children && item.children.length > 0) {
          this.exchageData(item.children)
        }
      })
      return arr
    },
    // 改变数据结构2
    exchageData2(arr) {
      arr.forEach((item) => {
        item.id = item.data_id
        item.pid = item.parent_id
        if (item.children && item.children.length > 0) {
          this.exchageData2(item.children)
        }
      })
      return arr
    },
    //
    setTreeData(parr, arr) {
      arr.forEach((children) => {
        children.pic = '@/assets/images/guanxi.png'
        children.label = children.name
        parr.push(children)
        if (children.children && children.children.length > 0) {
          this.setTreeData(parr, children.children)
        }
      })
      return parr
    },
    // 获取列表数据
    async getTableList() {
      const res = await this.$simpleAsyncTo(
        queryDataFieldList({
          keyword: this.dataSourceName ? this.dataSourceName : '',
          busin_id: this.businId,
          pageSize: 10,
          pageNo: 1,
        })
      )
      if (res) {
        this.hasData = res.data.if_has_data
        this.total = res.data.total_records
        this.topicDomainTableListData = this.exchageData2(res.data.data_fields)
      }
      const res2 = await this.$simpleAsyncTo(
        queryDataFieldRelDiagram({
          busin_id: this.businId,
        })
      )
      if (res2) {
        let arr = res2.data.children
        this.treeData.label = res2.data.name
        this.treeData.code = res2.data.code
        this.treeData.id = res2.data.id
        this.treeData.children = this.exchageData(arr)
        // this.treeData = this.exchageData(arr)
        // let val = this.setTreeData([], arr)
        // this.tagTreeData = val
        this.tagTreeData = [
          {
            type: 0,
            name: '数据板块',
          },
          {
            type: 1,
            name: '主题域',
          },
          {
            type: 2,
            name: '普通对象',
          },
          {
            type: 3,
            name: '层级对象',
          },
          {
            type: 4,
            name: '枚举对象',
          },
          {
            type: 5,
            name: '虚拟对象',
          },
          {
            type: 6,
            name: '业务事件',
          },
          {
            type: 7,
            name: '业务快照',
          },
          {
            type: 8,
            name: '业务流程',
          },
        ]
      }
    },
    // 改变显示结构
    exchagePage(val) {
      this.pageType = val
    },
    // tree插件事件
    onMenus({node, command}) {},
    // tree插件事件
    filter() {
      this.$refs.tree.filter(this.keyword)
    },
    // tree插件事件
    filterNodeMethod(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // tree插件事件
    onExpand(e, data) {},
    // tree插件事件
    onNodeClick(e, data) {
      if (!this.treeDialogVisible) {
        this.treeDialogVisible = true
        this.treeComponentData = data
      }
    },
    //
    toggleExpand(data, val) {
      if (Array.isArray(data)) {
        data.forEach((item) => {
          this.$set(item, 'expand', val)
          if (item.children) {
            this.toggleExpand(item.children, val)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.children) {
          this.toggleExpand(data.children, val)
        }
      }
    },
    // 操作-删除主题域
    handleRuleDel(row) {
      this.$confirm(`确定删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.submitRuleDel(row.data_id)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 删除 提交数据
    async submitRuleDel(data_id) {
      const res = await this.$simpleAsyncTo(
        deleteplanDataArchitecture({data_id})
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
        this.getTableList()
      }
    },
    // 批量删除
    async delInBatches(ev) {
      if ((ev.target.nodeName == 'SPAN') | (ev.target.nodeName == 'I')) {
        ev.target.parentNode.blur()
      } else {
        ev.target.blur()
      }
      let temp = this.checkedList.map((item) => item.data_id)
      let params = {
        data_id: JSON.stringify(temp),
      }
      const res = await this.$simpleAsyncTo(delBatchDataField(params))
      if (res) {
        this.$message({
          type: 'success',
          message: '批量删除数据成功',
        })
        this.getTableList()
      }
    },
    // 本页全选
    handleAllChecked(val) {
      this.checkedList = val ? this.topicDomainTableListData : []
      if (this.checkedList.length > 0) {
        this.selectAll(this.checkedList)
      } else {
        this.$refs.topicDomainTableListData.clearSelection()
      }
      this.isIndeterminate = false
    },
    // 多选change事件
    handleSelectionChange(val) {
      // this.checkedList = val
      // let checkedCount = val.length
      // this.totalCount = 0
      // this.topicDomainTableListData
      // this.allChecked = checkedCount === this.getDataLength(val)
      // this.isIndeterminate = checkedCount > 0 && checkedCount < this.totalCount

      // checkedCount > 0 && checkedCount < this.topicDomainTableListData.length
      this.checkedList = val
    },
    // 获取多选数据 数组长度
    getDataLength(val) {
      let temp = val.length
      for (let index = 0; index < val.length; index++) {
        const element = val[index]
        if (element.children) {
          this.getDataLength(element.children)
        }
      }
      this.totalCount += temp
    },
    // 获取主题域-树节点
    async getTopicNameList(type, val) {
      let params
      if (type == 'new') {
        params = {
          busin_id: this.businId,
        }
      } else if (type == 'sub') {
        params = {
          // busin_id: val.data_id,
          busin_id: this.businId,
        }
      } else if (type == 'edit') {
        params = {
          // busin_id: val.data_id,
          busin_id: this.businId,
        }
      }
      const res = await this.$simpleAsyncTo(getDataField(params))
      if (res) {
        this.dataFieldList = [res.data]
      }
    },
    // 新建/编辑 主题域
    addTopicDomain(type, val) {
      if (type == 'new') {
        this.dialogTitle = '新建主题域'
        this.getTopicNameList('new')
      } else if (type == 'sub') {
        this.dialogTitle = '新建主题域'
        this.getTopicNameList('sub', val)
        this.dataTopicDomainForm.treeId = val.data_id
        this.dataTopicDomainForm.treeName = val.data_name
      } else if (type == 'edit') {
        this.dialogTitle = '编辑主题域'
        this.getTopicNameList('edit', val)
        let temp1 = _.cloneDeep(val)
        let temp2 = {
          treeId: val.parent_id,
          treeName: val.name,
        }
        this.dataTopicDomainForm = Object.assign(
          this.dataTopicDomainForm,
          temp2,
          temp1
        )
      }
      this.dialogVisible = true
    },
    //上级主题域 点击事件
    handleNodeClick(data, node, e) {
      this.dataTopicDomainForm.treeId = data.id
      this.dataTopicDomainForm.treeName = data.name
      this.$refs.treeSelect.blur()
    },
    // 新建业务实体
    addBusinessEntity() {
      this.$emit('addBusinessEntity')
    },
    // 刷新列表数据
    refreshTopicDomain() {},
    // 弹框表单取消事件
    handleCancel() {
      this.$refs.dataTopicDomainForm.resetFields()
      this.dataTopicDomainForm = {
        data_name: '',
        data_code: '',
        data_code_short: '',
        comments: '',
        treeId: '0',
        treeName: '根节点',
      }
      this.dialogVisible = false
    },
    // 弹框提交 表单验证
    submitForm() {
      this.$refs['dataTopicDomainForm'].validate((valid) => {
        if (valid) {
          this.submit()
        } else {
          return false
        }
      })
    },
    // 表单数据 提交接口
    async submit() {
      if (this.dataTopicDomainForm.data_id) {
        this.dataTopicDomainForm.parent_id = this.dataTopicDomainForm.treeId
        this.dataTopicDomainForm.name = this.dataTopicDomainForm.treeName
        const res = await this.$simpleAsyncTo(
          editDataField(this.dataTopicDomainForm)
        )
        if (res) {
          this.$message({
            type: 'success',
            message: '编辑数据域成功!',
          })
          this.dialogVisible = false
          this.getTableList()
          this.dataTopicDomainForm = {
            data_name: '',
            data_code: '',
            data_code_short: '',
            comments: '',
            treeId: '0',
            treeName: '根节点',
          }
        }
      } else {
        this.dataTopicDomainForm.parent_id = this.dataTopicDomainForm.treeId
        this.dataTopicDomainForm.busin_id = this.businId
        const res = await this.$simpleAsyncTo(
          saveDataField(this.dataTopicDomainForm)
        )
        if (res) {
          this.$message({
            type: 'success',
            message: '新增数据域成功!',
          })
          this.dialogVisible = false
          this.getTableList()
          this.dataTopicDomainForm = {
            data_name: '',
            data_code: '',
            data_code_short: '',
            comments: '',
            treeId: '0',
            treeName: '根节点',
          }
          // this.$refs.dataTopicDomainForm.resetFields()
        }
      }
    },
    setChildren(children, type) {
      children.map((j) => {
        this.toggleRowSelection(j, type)
        if (j.children) {
          this.setChildren(j.children, type)
        }
      })
    },
    // 多选 select事件
    select(selection, row) {
      const hasSelect = selection.some((el) => {
        return row.id === el.id
      })
      if (hasSelect) {
        if (row.children) {
          this.setChildren(row.children, true)
        } else {
          this.topicDomainTableListData.forEach((item) => {
            if (row.id === item.id) {
              this.toggleRowSelection(item, true)
            }
          })
        }
      } else {
        if (row.children) {
          this.setChildren(row.children, false)
        }
      }
    },
    // 切换多选-选中状态
    toggleRowSelection(row, select) {
      if (row) {
        this.$nextTick(() => {
          this.$refs.topicDomainTableListData &&
            this.$refs.topicDomainTableListData.toggleRowSelection(row, select)
        })
      }
    },
    // 全选
    selectAll(selection) {
      const isSlect = selection.some((el) => {
        const tableDataIds = this.topicDomainTableListData.map((j) => j.id)
        return tableDataIds.includes(el.id)
      })
      const isCancel = !this.topicDomainTableListData.every((el) => {
        const selectIds = selection.map((j) => j.id)
        return selectIds.includes(el.id)
      })
      if (isSlect) {
        this.allChecked = true
        selection.map((el) => {
          this.$refs.topicDomainTableListData.toggleRowSelection(el, true)
          if (el.children) {
            this.setChildren(el.children, true)
          }
        })
      }
      if (isCancel) {
        this.allChecked = false
        this.topicDomainTableListData.map((el) => {
          if (el.children) {
            this.setChildren(el.children, false)
          }
        })
      }
    },
    // 过滤图片
    filterImgSrc(item) {
      if (!item.type || item.type == 0) {
        return require('@/assets/images/topic/sjbk.png')
      } else if (item.type == 1) {
        return require('@/assets/images/topic/zty-p.png')
      } else if (item.type == 2) {
        return require('@/assets/images/topic/ptdx-p.png')
      } else if (item.type == 3) {
        return require('@/assets/images/topic/cjdx-p.png')
      } else if (item.type == 4) {
        return require('@/assets/images/topic/mjdx-p.png')
      } else if (item.type == 5) {
        return require('@/assets/images/topic/xndx-p.png')
      } else if (item.type == 6) {
        return require('@/assets/images/topic/ywsj-p.png')
      } else if (item.type == 7) {
        return require('@/assets/images/topic/ywkz-p.png')
      } else if (item.type == 8) {
        return require('@/assets/images/topic/ywlc-p.png')
      }
    },
    // 过滤图片2
    filterImgSrc2(item) {
      if (item.type == 0) {
        return require('@/assets/images/topic/zty-p.png')
      } else if (item.type == 1) {
        return require('@/assets/images/topic/ptdx-p.png')
      } else if (item.type == 2) {
        return require('@/assets/images/topic/mjdx-p.png')
      } else if (item.type == 3) {
        return require('@/assets/images/topic/xndx-p.png')
      } else if (item.type == 4) {
        return require('@/assets/images/topic/cjdx-p.png')
      } else if (item.type == 5) {
        return require('@/assets/images/topic/ywsj-p.png')
      } else if (item.type == 6) {
        return require('@/assets/images/topic/ywkz-p.png')
      } else if (item.type == 7) {
        return require('@/assets/images/topic/ywlc-p.png')
      } else {
        return require('@/assets/images/topic/sjbk.png')
      }
    },

    viewRelGraph(row) {
      console.log(row)
      this.entityRelDrawerVisible = true
    },
  },
}
</script>
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  overflow: hidden;
  overflow-y: auto;
  padding-left: 10px;
}
</style>
<style lang="scss" scoped>
.taglist {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: white;
  flex-wrap: wrap;
  padding: 10px;
  .tagitem {
    margin-left: 6px;
    margin-top: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 120px;
    font-size: 14px;
    border-radius: 4px;
    height: 28px;
    border: 1px solid #eee;
    background-color: white;
    img {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
  }
}
.node-block {
  display: flex;
  align-items: center;
  padding: 8px;
  width: 200px;
  height: 60px;
  img {
    width: 20px;
    height: 20px;
    margin: 0 4px;
  }
  .node-label {
    font-weight: bold;
    font-size: 12px;
    padding: 0 0 0 8;
    text-align: left;
    span {
      font-weight: normal;
    }
  }
}
.topic-domain-management {
  height: 100%;
  .topic-domain-management-content {
    height: 100%;
    background-color: #f5f5f5;
    .active {
      padding: 15px 15px 10px;
    }
    ::v-deep .el-table__row:not([class*='el-table__row--level-']) {
      td:nth-of-type(2) {
        padding-left: 24px;
      }
    }
    ::v-deep .el-table__body-wrapper {
      .el-table__row td div.cell {
        display: flex;
        align-items: center;
      }
    }
    .item-btn {
      color: #606266;
    }
  }
  .emptpy-content {
    color: gray;
    margin-bottom: 10px;
  }
}
</style>
