<!--
 * @Author: cxm
 * @LastEditors: 大炸鹅
 * @Date: 2021-08-07 17:08:34
 * @LastEditTime: 2023-04-17 16:30:40
 * @Description:
-->
<template>
  <div class='criterion-table pb-40' v-loading="!!loading">
    <div class="pr-10 pl-10">
      <Head
      ref="head"
      title="标准列表"
      style="padding-top: 0"
      actionText="新建标准"
      @refesh="refeshHandle"
      @action="addCriterion"
      :batchUpdate="true"
      @batchUpdate="batchUpdate">
        <el-popover
          ref="tabControlsPopover"
          popper-class="no-gutter my-popper"
          trigger="click"
          placement="bottom-end"
          transition="el-zoom-in-top"
          :width="200"
          :visible-arrow="false"
        >
          <ul
            class=""
          >
            <li>请选择展现内容：{{checkList.length}}/7</li>
            <el-checkbox-group v-model="checkList" style="color: #000">
              <el-checkbox :label="item.label" v-for="item in filters" :key="item.label">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </ul>
          <el-button
            class="ml-5 action-refresh"
            icon="iconfont icon-sidebar-toggle-copy"
            slot="reference"
            type="primary"
            plain
          ></el-button>
        </el-popover>
    </Head>
    <FilterFieldCard
      :filterData="factoryFilterData" @confirm="confirm" ref="filterFieldCard"></FilterFieldCard>
    <el-table
      ref="multipleTable"
      :data="tableData"
      class="category-table-list"
      v-loading="!!loading"
      @selection-change="manualHandleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
      ></el-table-column>
      <el-table-column label="标准名称" width="200px" prop="std_name" v-if="checkList.includes('标准名称')">
      </el-table-column>
      <el-table-column
        :sortable="true"
        :sort-method="sortByVesselName"
        prop="std_code"
        label="英文名称"
        show-overflow-tooltip
        v-if="checkList.includes('英文名称')"
      ></el-table-column>
      <el-table-column
        prop="std_id"
        label="标准编号"
        show-overflow-tooltip
        v-if="checkList.includes('标准编号')"
      ></el-table-column>
      <el-table-column
        prop="busin_name"
        label="业务板块"
        show-overflow-tooltip
        v-if="checkList.includes('业务板块')"
      >
      </el-table-column>
      <el-table-column
        prop="busin_rule"
        label="业务规则"
        show-overflow-tooltip
        v-if="checkList.includes('业务规则')"
      ></el-table-column>
      <el-table-column
        sortable
        prop="oper_time"
        label="创建时间"
        show-overflow-tooltip
        v-if="checkList.includes('创建时间')"
      ></el-table-column>
      <el-table-column
        prop="label_category"
        label="发布状态"
        show-overflow-tooltip
        v-if="checkList.includes('发布状态')"
      >
        <template slot-scope="scope">
          {{getDicsValue('status_tag', scope.row.status)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            title="编辑"
            class="el-icon-edit-outline font-16"
            @click="editHandle(scope.row)"
          ></el-button>
          <el-button
            type="text"
            title="删除"
            class="icon el-icon-delete font-16"
            @click="delHaandle(scope.row)"
          ></el-button>
          <el-button
            type="text"
            title="发布"
            class="icon iconfont icon-fabu1 font-16"
            @click="batchRelease(scope.row, 'one')"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div class="my-filter-select">
      <div>
        <el-checkbox v-model="allChecked" @change="changeHandle">全选</el-checkbox>
        <el-button
          type="text"
          icon="el-icon-delete"
          class="ml-20"
          @click="batchDel"
          :disabled="disabled"
          >批量删除</el-button>
        <el-button
          type="text"
          icon="el-icon-download"
          class="ml-20"
          @click="batchExport"
          :disabled="disabled"
          >批量导出</el-button>
        <!-- <el-button type="text" icon="el-icon-upload2" class="ml-20" :disabled="disabled" @click="batchUpdate">批量导入</el-button> -->
      </div>
      <div>已选中<a href="javascript:;">{{curLength}}</a>个</div>
    </div>
    <el-dialog title="上传文件" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @close="cancelBtn" width="500px">
      <div class="mb-10 upload-file">
        <el-upload
          drag
          :action="uploadUrl"
          ref="upload"
          required
          :auto-upload="false"
          :file-list="fileList"
          :on-change="change"
          :onSuccess="uploadSuccess"
          :onError="uploadError"
          accept="xlsx,xls"
          style="width:100%"
          class="standard-upload"
          >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text" style="width:100%">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div style="text-align:end" class="mt-15">
          <a :href="downloadUrl" download>下载模板</a>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBtn">取 消</el-button>
        <el-button type="primary" @click="confirmBtn" :loading="brnLoading">导 入</el-button>
      </span>
    </el-dialog>
    <ReleaseCriterion v-if="visibleRelease" :releaseData="releaseData" @cancelRelease="cancelRelease" @refreshTable="refeshHandle"></ReleaseCriterion>
  </div>
</template>

<script>
import StandardTable from '@/mixins/standard-table'
import {getCriterionListPage, deleteStandard, batchDel} from '@/api/asset/standard/criterion.js'
import {
  getCatalogList
} from '@/api/asset/standard/edition'
import config from '@/config'
import ReleaseCriterion from './release.vue'
export default {
  name: 'CriterionTable',
  mixins: [StandardTable],
  components: {
    ReleaseCriterion
  },
  props: {},
  data() {
    return {
      checkList: ['标准名称', '英文名称', '标准编号', '业务板块', '业务规则', '创建时间', '发布状态'],
      filters: [
        {
          label: '标准名称',
          value: true
        },
        {
          label: '英文名称',
          value: true
        },
        {
          label: '标准编号',
          value: true
        },
        {
          label: '业务板块',
          value: true
        },
        {
          label: '业务规则',
          value: true
        },
        {
          label: '创建时间',
          value: true
        },
        {
          label: '发布状态',
          value: true
        }
      ],
      catalogList1: [],
      catalogList2: [],
      catalogList3: [],
      statusList: [],
      delFetch: deleteStandard,
      batchDelFetch: batchDel,
      paramsKey: 'std_id',
      downloadUrl: `${config.baseurl}/standardManagement/downTemplate`,
      uploadUrl: `${config.baseurl}/standardManagement/importFile`,
      visibleRelease: false,
      releaseData: [],
      tableDataFetch: getCriterionListPage
    }
  },
  computed: {},
  async created() {
    this.$root.eventEmitter.on('refreshTable', type => {
      this.getTableList()
    })
    this.loading++
    await this._getListBusiness()
    await this._getCatalogList1()
    await this._getCatalogList2()
    await this._getCatalogList3()
    this.statusList = this.dics.status_tag.map(item => {
      return {
        id: item.key,
        label: item.value
      }
    })
    this.factoryFilterData = [
      {
        label: '业务板块',
        id: '业务板块',
        options: this.businessList
      },
      {
        label: '状态',
        id: '状态',
        options: this.statusList
      },
      {
        label: '一级分类',
        id: '一级分类',
        options: this.catalogList1
      },
      {
        label: '二级分类',
        id: '二级分类',
        options: this.catalogList2
      },
      {
        label: '三级分类',
        id: '三级分类',
        options: this.catalogList3
      }
    ]
    this.getTableList()
    this.loading--
    // console.log(this.dics)
  },
  beforeRouteLeave(to, from, next) {
    // 销毁监听的事件
    this.$root.eventEmitter.off('refreshTable')
    next()
  },
  mounted() {},
  methods: {
    async getTableList(curFilter = [], keyword = '') {
      this.loading++
      const params = {
        pageSize: 9999,
        pageNo: 1,
        keyword,
        busi_id: '',
        status: '',
        one_catalog_id: '',
        two_catalog_id: '',
        three_catalog_id: '',
        oper_user: '',
        startDate: '',
        endDate: ''
      }
      curFilter.forEach(e => {
        switch (e.module) {
          case '业务板块':
            params.busi_id = e.value
            break
          case '一级分类':
            params.one_catalog_id = e.value
            break
          case '二级分类':
            params.two_catalog_id = e.value
            break
          case '三级分类':
            params.three_catalog_id = e.value
            break
          case '状态':
            params.status = e.value
            break
        }
      })
      const res = await this.$simpleAsyncTo(getCriterionListPage(params), '获取列表失败')
      if (res) {
        this.tableData = res.data
      }
      this.loading--
    },
    editHandle(row) {
      this.tabStore.commit('add', {
        label: '编辑标准',
        tabType: this.types.CRITERION,
        name: row.std_id,
        component: 'CriterionEdit',
        data: row
      })
    },
    addCriterion() {
      this.tabStore.commit('add', {
        label: '新建标准',
        tabType: this.types.CRITERION,
        name: Date.now() + '',
        component: 'CriterionEdit',
        data: {}
      })
    },
    // 一级分类
    async _getCatalogList1() {
      const params = {level: '1'}
      const res = await this.$simpleAsyncTo(getCatalogList(params), '获取失败')
      if (res) {
        this.catalogList1 = res.data.map(item => {
          return {
            id: item.catalog_id,
            label: item.catalog_name
          }
        })
      }
    },
    // 二级分类
    async _getCatalogList2() {
      const params = {level: '2'}
      const res = await this.$simpleAsyncTo(getCatalogList(params), '获取失败')
      if (res) {
        this.catalogList2 = res.data.map(item => {
          return {
            id: item.catalog_id,
            label: item.catalog_name
          }
        })
      }
    },
    // 三级分类
    async _getCatalogList3() {
      const params = {level: '3'}
      const res = await this.$simpleAsyncTo(getCatalogList(params), '获取失败')
      if (res) {
        this.catalogList3 = res.data.map(item => {
          return {
            id: item.catalog_id,
            label: item.catalog_name
          }
        })
      }
    },
    batchRelease(row, type) {
      this.releaseData = [row]
      this.visibleRelease = true
      // if (!this.curSelectData.length && type !== 'one') {
      //   return this.$message({
      //     type: 'warning',
      //     message: '请选择发布项！'
      //   })
      // }
      // this.$confirm('请确认是否发布？', '发布', {
      //   comfirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(async () => {
      //     const params = {
      //       [this.paramsKey]: type !== 'one' ? JSON.stringify(this.curSelectData.map(item => item[this.paramsKey])) : JSON.stringify([row[this.paramsKey]])
      //     }
      //     const res = await this.$simpleAsyncTo(batchRelease(params), '发布失败')
      //     this.$root.eventEmitter.emit('refresh')
      //     this.getTableList(this.curFilter, this.keyword)
      //     if (res) {
      //       this.$message({
      //         type: 'success',
      //         message: '发布成功！'
      //       })
      //     }
      //   })
      //   .catch(_ => {
      //     this.$message({
      //       type: 'info',
      //       message: '取消发布！'
      //     })
      //   })
    },
    cancelRelease() {
      this.visibleRelease = false
    },
    sortByVesselName(a, b) {
      let a1 = a.std_code.toLowerCase()
      let b1 = b.std_code.toLowerCase()
      if (a1 < b1) return -1
      if (a1 > b1) return 1
      return 0
    }
  }
}
</script>

<style lang="scss">
.my-popper.el-popper {
  background-color: $grey10;
  border-color: $grey10;
  ul {
    border-bottom: none!important;
    padding: 0 15px 20px 15px!important;
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
.criterion-table {
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
.standard-upload {
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
}
</style>
