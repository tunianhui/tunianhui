<template>
  <div class="category-detail" style="height:100%">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pl-20 pr-20">
      <el-breadcrumb-item><a href="javascript:;" @click="setTagFlag({flag: 'home'})">{{'标签类目'}}</a></el-breadcrumb-item>
      <el-breadcrumb-item>{{tagFlag.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="my-cateory-content" ref="my_cateory_content">
      <div class="my-btn">
        <el-button
          icon="el-icon-refresh"
          type="primary"
          plain
          @click="_queryLabelByCategoryId()"
        ></el-button>
        <el-popover
          ref="tabControlsPopover"
          popper-class="dark-popper no-gutter my-popper"
          trigger="click"
          placement="bottom-end"
          transition="el-zoom-in-top"
          :width="200"
          :visible-arrow="false"
          v-if="activeName==='factory'"
        >
          <ul
            class=""
          >
            <li>请选择展现内容：{{checkList.length}}/8</li>
            <el-checkbox-group v-model="checkList" style="color: #000" :max="5">
              <el-checkbox :label="item.label" v-for="item in filters" :key="item.label">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </ul>
          <el-button
            icon="iconfont icon-sidebar-toggle-copy"
            class="ml-5"
            slot="reference"
            type="primary"
            plain
          ></el-button>
        </el-popover>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="my-el-tabs-category">
        <el-tab-pane label="工厂标签" name="factory">
          <!-- <FilterGroup></FilterGroup> -->
          <FilterFieldCard
            class="mb-10 mt-10"
            :filterData="factoryFilterData"
            @confirm="filterFactoryTableData"></FilterFieldCard>
          <el-table
            :data="factoryLabel"
            class="category-table-list"
            v-loading="!!loading"
            @selection-change="handleSelectionChange"
            ref="factortTable"
          >
            <el-table-column
              type="selection"
              width="50"
            ></el-table-column>
            <el-table-column label="名称">
              <template #default="scope">
                <CellContent
                  @click="showAttr"
                  :data="getCellContentData(scope.row, false)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="开发状态"
              show-overflow-tooltip
              v-if="checkList.includes('开发状态')"
            >
              <template slot-scope="scope">
                <div style="display:flex;align-items:center">
                  <i class="el-icon-success font-16" style="color: #67C23A" v-if="scope.row.status==='6'"></i>
                  <i class="iconfont icon-kaifazhong" style="color: #EABA19;vertical-align: bottom;font-size:18px" v-if="scope.row.status==='5'"></i>
                  <i class="iconfont icon-code font-16" style="color: #A186FF;vertical-align: bottom" v-if="scope.row.status==='7'"></i>
                  <span>{{getDicsValue('status_tag', scope.row.status)}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="label_category"
              label="类目"
              show-overflow-tooltip
              v-if="checkList.includes('类目')"
            >
            </el-table-column>
            <el-table-column
              prop="run_status"
              label="测试运行状态"
              show-overflow-tooltip
              v-if="checkList.includes('测试运行状态')"
            >
            </el-table-column>
            <el-table-column
              prop="oper_time"
              label="更新时间"
              show-overflow-tooltip
              v-if="checkList.includes('更新时间')"
            ></el-table-column>
            <el-table-column
              prop="repair_status"
              label="最近补数据"
              show-overflow-tooltip
              v-if="checkList.includes('最近补数据')"
            >
            <template slot-scope="scope">
              <div style="display:flex;align-items:center">
                <i class="el-icon-success font-16 mr-5" style="color: #67C23A" v-if="scope.row.repair_status==='成功'"></i>
                <span v-if="scope.row.repair_status === '成功'" class="mr-5">成功</span>
                <span v-if="scope.row.repair_status === '未执行'" class="mr-5">未补数据</span>
                <el-popover
                  v-if="scope.row.repair_status==='成功'"
                  placement="right"
                  width="680"
                  trigger="click">
                  <div>补数据记录</div>
                  <el-table :data="gridData">
                    <el-table-column property="date" label="操作时间"></el-table-column>
                    <el-table-column property="name" label="操作人"></el-table-column>
                    <el-table-column property="address" label="补数据结束日期"></el-table-column>
                    <el-table-column width="80" property="address" label="结果"></el-table-column>
                  </el-table>
                  <i class="el-icon-document-add font-14" slot="reference"></i>
                </el-popover>
              </div>
            </template>
            </el-table-column>
            <el-table-column
              prop="auth_status"
              label="公开状态"
              show-overflow-tooltip
              v-if="checkList.includes('公开状态')"
            >
              <template slot-scope="scope">
                {{scope.row.auth_status === '1' ? '隐藏' : '公开'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="label_table"
              label="标签结果表"
              show-overflow-tooltip
              v-if="checkList.includes('标签结果表')"
            >
            </el-table-column>
            <el-table-column
              prop="id"
              label="标签ID"
              show-overflow-tooltip
              v-if="checkList.includes('标签ID')"
            >
            </el-table-column>
            <el-table-column label="操作" width="200px" align="right">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  title="编辑"
                  class="el-icon-edit-outline font-16"
                  @click="handleEdit(scope.row)"
                ></el-button>
                <el-button
                  type="text"
                  title="补数据"
                  class="iconfont icon-bushuju font-16"
                  @click="addData(scope.row)"
                ></el-button>
                <el-button
                  type="text"
                  title="标签任务"
                  class="iconfont icon-biaodanliebiao font-16"
                ></el-button>
                <el-popover
                  placement="bottom"
                  popper-class="more-popover"
                  trigger="click">
                  <ul class="popper-list">
                    <li>
                      <el-button
                        type="text"
                        icon="iconfont icon-biaodanliebiao"
                        @click.stop="seeReport(scope.row)"
                        >标签报告</el-button
                      >
                    </li>
                    <!-- <li>
                      <el-button
                        type="text"
                        icon="icon el-icon-copy-document"
                        @click="copyhandle(scope.row)"
                        >克隆</el-button
                      >
                    </li> -->
                    <li v-if="scope.row.status === '6' || scope.row.status === '7'">
                      <el-button @click="offline(scope.row)" type="text" icon="iconfont icon-xiaxian"
                        >下线</el-button
                      >
                    </li>
                    <li v-if="scope.row.status === '6' || scope.row.status === '7'">
                      <el-button @click="offlineAndDel(scope.row)" type="text" icon="el-icon-delete"
                        >下线并删除</el-button
                      >
                    </li>
                  </ul>
                  <el-button
                    type="text"
                    slot="reference"
                    class="iconfont icon-gengduo font-16"></el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="手工标签" name="manual">
          <!-- <FilterGroup :isShow="false"></FilterGroup> -->
          <FilterFieldCard
            class="mb-10 mt-10"
            :filterData="[]"
            :isArrow="false"
            @confirm="filterManualTableData"></FilterFieldCard>
          <el-table
            ref="manualTable"
            :data="manualLabel"
            class="category-table-list"
            v-loading="!!loading"
            @selection-change="manualHandleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="50"
            ></el-table-column>
            <el-table-column label="名称" width="200px">
              <template #default="scope">
                <CellContent
                  :data="getCellContentData(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="oper_time"
              label="最近更新时间"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="source_table"
              label="标签来源表"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="auth_status"
              label="公开状态"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="scope.row.auth_status === '1'">隐藏</span>
                <span v-if="scope.row.auth_status === '0'">公开</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="label_category"
              label="类目"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="操作" width="100px" align="right">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  title="编辑"
                  class="el-icon-edit-outline font-16"
                  @click="manualHandleEdit(scope.row)"
                ></el-button>
                <el-button
                  type="text"
                  title="删除"
                  class="icon el-icon-delete font-16"
                  @click="manualDel(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div class="my-filter-select">
        <div>
          <el-checkbox v-model="factoryChecked" @change="changeHandle" v-if="activeName==='factory'">全选</el-checkbox>
          <el-checkbox v-model="manualChecked" @change="changeHandle" v-if="activeName==='manual'">全选</el-checkbox>
          <el-button
            type="text"
            icon="icon iconfont icon-yincang"
            class="ml-20"
            @click="hideOpenhandle('hide')"
            :disabled="disabled"
            >批量隐藏</el-button>
          <el-button
            type="text"
            icon="icon iconfont icon-chakan1"
            class="ml-20"
            @click="hideOpenhandle('open')"
            :disabled="disabled"
            >批量公开</el-button>
          <el-button type="text" icon="icon iconfont icon-sidebar-toggle-copy" class="ml-20" :disabled="disabled" @click="sortHandle">分类</el-button>
        </div>
        <div>已选中<a href="javascript:;">{{curLength}}</a>个</div>
      </div>
    </div>
    <SimpleEditDialog
      :title="title"
      :visible="hideAndOpenVisible"
      @close="hideAndOpenClose"
      @confirm="hideAndOpenConfirm"
      width="560px"
      top="25vh"
    >
      <div class="my-confirm-info-wrapper">
        <i class="el-icon-warning-outline"></i>
        <span>
          确定将以下标签状态设为
          <span v-if="title.indexOf('隐藏') > -1">隐藏</span>
          <span v-if="title.indexOf('公开') > -1">公开</span> 吗？
        </span>
      </div>
      <div  class="mt-15">
        <el-form ref="form" label-width="50px">
          <el-form-item label="" prop="desc">
            <OverflowTooltip style="width:calc(100% - 20px)">{{curHideAndOpenName}}</OverflowTooltip>
          </el-form-item>
        </el-form>
      </div>
    </SimpleEditDialog>
    <CategroySort v-if="sortVisible" :data="curSoryData" @closeSort="closeSort" @delSort="delSort" :type="activeName"></CategroySort>
    <EditManual :visible="visible" @close="close" :data="curRow" @confirm="confirm"></EditManual>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {types} from '@/config/rd-config'
import rdTableMixin from '@/mixins/rd-table'
import OverflowTooltip from '@c/overflow-tooltip'
import CategroySort from './sort'
import FilterFieldCard from '@c/filter-card'
import {
  offLine,
  deleteTag,
  queryLabelByCategoryId,
  delManual,
  authStatusOper
} from '@/api/rd/exreact/tag-center'
import EditManual from '../logic/edit-manual'
export default {
  name: 'CategoryDetail',
  mixins: [rdTableMixin],
  components: {
    OverflowTooltip,
    CategroySort,
    FilterFieldCard,
    EditManual
  },
  computed: {
    ...mapGetters(['project', 'tagFlag']),
    disabled() {
      let disabled = null
      if (this.activeName === 'factory') {
        if (this.curFactoryData.length) {
          disabled = false
        } else {
          disabled = true
        }
      } else {
        if (this.curManualData.length) {
          disabled = false
        } else {
          disabled = true
        }
      }
      return disabled
    }
  },
  watch: {
    curLength: {
      handler(val) {
        if (this.activeName === 'factory') {
          if (val === this.factoryLabel.length) {
            this.factoryChecked = true
          } else {
            this.factoryChecked = false
          }
        } else {
          if (val === this.manualLabel.length) {
            this.manualChecked = true
          } else {
            this.manualChecked = false
          }
        }
      }
    }
  },
  data() {
    return {
      activeName: 'factory',
      filters: [
        {
          label: '开发状态',
          value: true
        },
        {
          label: '类目',
          value: true
        },
        {
          label: '测试运行状态',
          value: true
        },
        {
          label: '更新时间',
          value: true
        },
        {
          label: '最近补数据',
          value: true
        },
        {
          label: '公开状态',
          value: true
        },
        {
          label: '标签结果表',
          value: true
        },
        {
          label: '标签ID',
          value: true
        }
      ],
      checkList: ['开发状态', '类目', '测试运行状态', '更新时间', '最近补数据'],
      hideAndOpenVisible: false,
      factoryChecked: false,
      manualChecked: false,
      curFactoryData: [],
      curManualData: [],
      curLength: 0,
      title: '',
      curHideAndOpenName: '',
      sortVisible: false,
      curSoryData: [],
      gridData: [],
      factoryLabel: [],
      manualLabel: [],
      factoryFilterData: [],
      curFactoryFilter: [],
      curManualFilter: [],
      factoryKeyword: '',
      manualKeyword: '',
      visible: false,
      curRow: {}
    }
  },
  created() {
    this.factoryFilterData = [
      {
        label: '开发状态',
        id: '开发状态',
        options: [
          {
            id: '6',
            label: '已提交'
          },
          {
            id: '7',
            label: '开发中'
          }
        ]
      },
      {
        label: '测试运行状态',
        id: '测试运行状态',
        options: [
          {
            id: '未测试运行',
            label: '未测试运行'
          },
          {
            id: '测试运行中',
            label: '测试运行中'
          },
          {
            id: '测试运行成功',
            label: '测试运行成功'
          },
          {
            id: '测试运行失败',
            label: '测试运行失败'
          }
        ]
      },
      {
        label: '最近补数据状态',
        id: '最近补数据状态',
        options: [
          {
            id: '失败',
            label: '失败'
          },
          {
            id: '成功',
            label: '成功'
          },
          {
            id: '未执行',
            label: '未执行'
          },
          {
            id: '运行中',
            label: '运行中'
          }
        ]
      }
    ]
  },
  mounted() {
    this._queryLabelByCategoryId()
  },
  methods: {
    ...mapMutations({
      setTagFlag: 'SET_TAGFLAG'
    }),
    async _queryLabelByCategoryId() {
      this.loading++
      const res = await this.$simpleAsyncTo(queryLabelByCategoryId({category_id: this.tagFlag.id}), '获取失败')
      if (res) {
        this.factoryLabel = res.data.factoryLabel.map(item => {
          return {
            ...item,
            label_category: this.tagFlag.name,
            name: item.name,
            code: item.label_code,
            id: item.id
          }
        })
        this.factoryLabel = this.factoryLabel.filter(item => {
          return item.name.toLowerCase().indexOf(this.factoryKeyword.toLowerCase()) > -1 ||
            item.label_code.toLowerCase().indexOf(this.factoryKeyword.toLowerCase()) > -1
        })
        this.curFactoryFilter.forEach(item => {
          switch (item.module) {
            case '开发状态':
              this.factoryLabel = this.factoryLabel.filter(val => {
                return val.status === item.value
              })
              break
            case '测试运行状态':
              this.factoryLabel = this.factoryLabel.filter(val => {
                return val.run_status === item.value
              })
              break
            case '最近补数据状态':
              this.factoryLabel = this.factoryLabel.filter(val => {
                return val.repair_status === item.value
              })
              break
          }
        })
        this.manualLabel = res.data.manualLabel.map(item => {
          return {
            ...item,
            label_category: this.tagFlag.name,
            label_name: item.name,
            label_id: item.id,
            code: item.label_code
          }
        })
        this.manualLabel = this.manualLabel.filter(item => {
          return item.name.toLowerCase().indexOf(this.manualKeyword.toLowerCase()) > -1 ||
            item.label_code.toLowerCase().indexOf(this.manualKeyword.toLowerCase()) > -1
        })
      }
      this.loading--
    },
    filterFactoryTableData(curFilter = [], keyword = '') {
      this.curFactoryFilter = curFilter
      this.factoryKeyword = keyword
      this._queryLabelByCategoryId()
    },
    filterManualTableData(curFilter = [], keyword = '') {
      this.curManualFilter = curFilter
      this.manualKeyword = keyword
      this._queryLabelByCategoryId()
    },
    handleClick(tab) {
      if (tab.name === 'factory') {
        this.curLength = this.curFactoryData.length
      } else {
        this.curLength = this.curManualData.length
      }
    },
    handleEdit(data) {
      const attr = {
        label: `编辑标签：${data.name}`,
        tabType: types.FACTORY,
        name: data.id + '编辑',
        data,
        component: 'TagConfig'
      }
      this.tabStore.commit('add', attr)
    },
    showAttr(data) {
      const attr = {
        title: '工厂标签',
        attrType: this.types.FACTORY,
        name: data.id + '',
        label: data.code,
        data,
        width: '500px'
      }
      this.attrStore.commit('add', attr)
    },
    addData(data) {
      this.setActiveRdEditDialog({
        title: '标签补数据',
        component: `TagAddData`,
        data: {...this.project}
      })
    },
    copyhandle(data) {
      const attr = {
        label: `克隆标签: ${data.name}`,
        tabType: 'regular',
        name: data.id + '克隆',
        data,
        component: 'TagConfig'
      }
      this.tabStore.commit('add', attr)
    },
    // 下线
    offline(data) {
      this.$confirm('此操作将下线该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$simpleAsyncTo(offLine({id: data.id}), '下线失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '下线成功!'
          })
          this._queryLabelByCategoryId()
          this.$root.eventEmitter.emit('refresh')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下线'
        })
      })
    },
    offlineAndDel(data) {
      this.$confirm('此操作将下线并删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$simpleAsyncTo(deleteTag({id: data.id}), '下线并删除失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '下线并删除成功!'
          })
          this._queryLabelByCategoryId()
          this.$root.eventEmitter.emit('refresh')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    manualHandleEdit(row) {
      this.visible = true
      this.curRow = row
    },
    manualDel(row) {
      this.$confirm('此操作删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$simpleAsyncTo(delManual({label_id: row.id, project_id: this.project.project_id, sum_id: row.sum_id}), '删除失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._queryLabelByCategoryId()
          // this.$root.eventEmitter.emit('refresh')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    hideOpenhandle(type) {
      if (type === 'hide') {
        this.hideAndOpenVisible = true
        this.title = '隐藏标签'
        if (this.activeName === 'factory') {
          this.curHideAndOpenName = this.filterName(this.curFactoryData)
        } else {
          this.curHideAndOpenName = this.filterName(this.curManualData)
        }
      } else {
        this.hideAndOpenVisible = true
        this.title = '公开标签'
        if (this.activeName === 'factory') {
          this.curHideAndOpenName = this.filterName(this.curFactoryData)
        } else {
          this.curHideAndOpenName = this.filterName(this.curManualData)
        }
      }
    },
    hideAndOpenClose() {
      this.hideAndOpenVisible = false
    },
    async hideAndOpenConfirm() {
      const params = {}
      const curFactoryIds = this.curFactoryData.map(item => item.id)
      const curManualIds = this.curManualData.map(item => item.id)
      if (this.title.indexOf('公开') > -1) {
        params.auth_status = '0'
      } else {
        params.auth_status = '1'
      }
      if (this.activeName === 'factory') {
        params.type = 'factoryLabel'
        params.ids = JSON.stringify(curFactoryIds)
      } else {
        params.type = 'manualLabel'
        params.ids = JSON.stringify(curManualIds)
      }
      const res = await this.$simpleAsyncTo(authStatusOper(params), '操作失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this._queryLabelByCategoryId()
        this.hideAndOpenClose()
        this.factoryChecked = false
        this.manualChecked = false
      }
    },
    filterName(data) {
      let str = ''
      data.forEach(e => {
        str = str + e.name + '\xa0\xa0\xa0\xa0'
      })
      return str
    },
    sortHandle() {
      this.sortVisible = true
      if (this.activeName === 'factory') {
        this.curSoryData = this.curFactoryData
      } else {
        this.curSoryData = this.curManualData
      }
    },
    closeSort(data) {
      this.sortVisible = false
      if (data) {
        this._queryLabelByCategoryId()
      }
    },
    delSort(data) {
      if (this.activeName === 'factory') {
        data.forEach(row => {
          this.$refs.factortTable.toggleRowSelection(row)
        })
      } else {
        data.forEach(row => {
          this.$refs.manualTable.toggleRowSelection(row)
        })
      }
    },
    close() {
      this.visible = false
    },
    confirm() {
      this._queryLabelByCategoryId()
    },
    handleSelectionChange(val) {
      this.curFactoryData = val
      this.curLength = this.curFactoryData.length
    },
    manualHandleSelectionChange(val) {
      this.curManualData = val
      this.curLength = this.curManualData.length
    },
    changeHandle(val) {
      if (this.activeName === 'factory') {
        if (val) {
          this.$refs.factortTable.toggleAllSelection()
        } else {
          this.$refs.factortTable.clearSelection()
        }
      } else {
        if (val) {
          this.$refs.manualTable.toggleAllSelection()
        } else {
          this.$refs.manualTable.clearSelection()
        }
      }
    },
    getTreeData() {}
  }
}
</script>

<style lang="scss">
.category-detail {
  height: 100%;
  .my-el-tabs-category {
    padding: 0 10px 0 15px;
    .el-tabs__header {
      background-color: transparent;
      margin-bottom: 0;
      // width: calc(100% - 70px);
      padding: 0;
      .el-tabs__nav-wrap::after {
        background-color: $grey6;
        height: 1px;
      }
      .el-tabs__nav-wrap {
        .el-tabs__nav-scroll {
          width: calc(100% - 170px);
        }
      }
    }
  }
  .my-cateory-content {
    position: relative;
    height: calc(100% - 37px);
    >div:first-child {
      position: absolute;
      right: 20px;
      top: 5px;
      z-index: 9;
    }
    .my-filter-select {
      display: flex;
      justify-content: space-between;
      position: fixed;
      bottom: 0;
      line-height: 40px;
      background-color: $grey10;
      width: calc(100% - 280px);
      z-index: 9;
      padding: 0 50px 0 20px;
      box-sizing: border-box;
      >div:last-child {
        font-size: 14px;
      }
    }
  }
  .category-table-list {
    .el-table__header-wrapper {
      .el-table__header {
        .has-gutter{
          tr {
            th:first-child {
              .cell {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
.my-popper.el-popper {
  background-color: $grey10;
  border-color: $grey10;
  ul {
    border-bottom: none!important;
    padding: 15px 15px 20px 15px!important;
  }
  li:hover {
    background-color: $grey10!important;
  }
  .el-checkbox {
    line-height: 30px;
    margin-right: 40px;
    .el-checkbox__label {
      font-size: 12px;
    }
  }
}
</style>
