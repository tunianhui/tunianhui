<template>
  <div class="search-wrapper">
    <section class="search-result flex-layout">
      <div class="left-condition">
        <div class="condition-box">
          <div class="screen">
            <span class="filter-text">条件筛选</span>
            <span class="refresh-opt" @click="resetHandle"><i class="el-icon-refresh-right"></i> 重置</span>
          </div>
          <div class="label-title">数据板块</div>
          <el-select v-model="searchFormLeft.business_field_id" clearable placeholder="请选择业务板块" filterable @change="changeBusin">
            <el-option v-for="item in businInfoList" :key="item.busin_id" :label="item.busin_name" :value="item.busin_id"></el-option>
          </el-select>
          <div class="label-title">项目</div>
          <el-select v-model="searchFormLeft.project_id" clearable placeholder="请选择项目" filterable @change="changeProject">
            <el-option v-for="item in projectInfoList" :key="item.project_id" :label="`${item.project_code}(${item.project_name})`" :value="item.project_id"></el-option>
          </el-select>
          <div class="label-title">表类型</div>
          <el-select v-model="searchFormLeft.table_type" clearable placeholder="请选择项目" filterable @change="changeTableType">
            <el-option v-for="item in tableInfoList" :key="item.code" :label="item.value" :value="item.code"></el-option>
          </el-select>
          <div class="label-title">存储类型</div>
           <el-select v-model="searchFormLeft.source_type" clearable placeholder="请选择项目" filterable @change="changeStorageType">
            <el-option v-for="item in storageList" :key="item.source_type" :label="item.source_type_name" :value="item.source_type"></el-option>
          </el-select>
        </div>
      </div>
      <div class="right-result flex-1">
        <div class="list-title flex-layout">
          <div class="flex-1">
            结果列表
          </div>
          <i class="el-icon-refresh-left" @click="refreshVisible = true" title="刷新"></i>
        </div>
        <div class="table-list">
          <el-table :data="tableList" style="width: 100%">
            <el-table-column show-overflow-tooltip label="表名称" width="400">
              <template slot-scope="{row}">
                <div class="flex-layout" @click="detailsCheckHandle(row)">
                  <div class="icons mr-10">
                    <i :class="['iconfont icon-guize']"></i>
                  </div>
                  <div class="name">
                    <div>
                      <OverflowTooltip v-if="row.cube_code">{{row.cube_code}}</OverflowTooltip>
                    </div>
                    <div>
                      <OverflowTooltip class="item-detail" v-if="row.cube_code">({{row.cube_name}})</OverflowTooltip>
                      <OverflowTooltip class="item-detail" v-else>{{row.cube_name}}</OverflowTooltip>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="project_name" label="所属项目">
              <template slot-scope="{row}">
                <span class="project">{{ row.project_name }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="object_name" label="表类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="source_type" label="存储类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="num_rows" label="存储条数"></el-table-column>
            <el-table-column show-overflow-tooltip prop="raw_size" label="存储量"></el-table-column>
            <el-table-column show-overflow-tooltip prop="oper_user" label="创建人"></el-table-column>
          </el-table>
        </div>
        <el-pagination
          class="fr pt-10"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-size="pageFilters.pageSize"
          :page-sizes="pageSizes"
          :current-page.sync="pageFilters.pageNo"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </section>

    <!-- 元数据刷新 -->
    <el-dialog title="元数据刷新" :visible.sync="refreshVisible" width="500px" :close-on-click-modal="false">
      <el-form :model="refreshForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="表类型" prop="table_type">
          <el-select v-model="refreshForm.table_type" placeholder="请选择表类型">
            <el-option v-for="item in tableTypeList" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="project_name">
          <el-select v-model="refreshForm.project_id" placeholder="请选择项目名称" @change="changeProjectName" filterable>
            <el-option v-for="item in projectInfoList" :key="item.project_id" :label="`${item.project_code}(${item.project_name})`" :value="item.project_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表名称" prop="table_name">
          <el-select v-model="refreshForm.cube_id" placeholder="请选择表名称" filterable>
            <el-option v-for="item in tableNameList" :key="item.cube_id" :label="item.cube_code" :value="item.cube_id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refreshVisible = false">取 消</el-button>
        <el-button type="primary" @click="asyncSave" :loading="asyncSaveLoading">确 定</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { iconMapColor } from '@/config/rd-config.js'
import pager from '@/mixins/pager'
import {
  getSearchParams,
  getSearchResult,
  getSourceType,
  queryObjectType,
  queryMetaTable,
  saveMetaSync
} from '@/api/asset/map'
import {
  getBusinessFieldInfo,
  getProjectInfo
} from '@/api/asset/list'
export default {
  name: 'DataTable',
  mixins: [pager],
  props: {
    keyword: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      refreshVisible: false,
      searchFormLeft: this.initParams(),
      rules: {
        table_type: [
          { required: true, message: '请选择表类型', trigger: 'change' }
        ],
        project_id: [
          { required: true, message: '请至少选择项目名称', trigger: 'change' }
        ]
      },
      tableTypeList: [
        {
          id: '1',
          label: '物理表'
        },
        {
          id: '2',
          label: '逻辑表'
        }
      ],
      storageList: [],
      projectList: [
        {
          id: '1',
          label: '项目2022'
        },
        {
          id: '2',
          label: '项目2023'
        }
      ],
      tableNameList: [],
      attrItemList: [],
      currentList: [],
      tableList: [],
      sortClass: 0,
      sortId: 1,
      type: {
        businessPart: '业务属性',
        developPart: '开发属性',
        dataPart: '数据属性',
        environment: '环境',
        // dataField: '数据域',
        // businessField: '业务板块',
        // businessProcess: '业务过程',
        // dimension: '维度',
        // project: '所属项目',
        // tableObjType: '表实体类型',
        tableType: '表类型'
      },
      iconMapColor,
      businInfoList: [],
      projectInfoList: [],
      tableInfoList: [],
      refreshForm: {
        table_type: '',
        project_id: '',
        cube_id: ''
      },
      asyncSaveLoading: false
    }
  },
  created () {
    this._getSourceType()
    this._queryObjectType()
    this.updateData()
  },
  methods: {
    ...mapMutations({
      setCubeId: 'SET_CUBE_ID'
    }),

    updateData () {
      this.getProjectList()
      this.getBusinessList()
      this.getTableList()
    },

    // 左侧项目下拉
    async getProjectList () {
      const res = await this.$simpleAsyncTo(getProjectInfo({ keyword: this.keyword }), '获取项目失败')
      if (res) {
        this.projectInfoList = res.data
      }
    },
    // 左侧数据板块下拉
    async getBusinessList () {
      const res = await this.$simpleAsyncTo(getBusinessFieldInfo({ keyword: this.keyword }), '获取业务板块失败')
      if (res) {
        this.businInfoList = res.data
      }
    },
    changeBusin () {
      this.getTableList()
    },
    changeProject () {
      this.getTableList()
    },
    changeTableType () {
      this.getTableList()
    },
    changeFieldSearch () {
      this.getTableList()
    },
    changeStorageType() {
      this.getTableList()
    },

    initParams () {
      return {
        orderBy: '',
        business_field_id: '',
        data_field_id: '',
        process_id: '',
        dim_id: '',
        table_type: '',
        project_id: '',
        table_object_type: '',
        source_type: ''
      }
    },

    resetHandle () {
      this.searchFormLeft = this.initParams()
      this.getTableList()
    },

    // 获取结果列表
    async getTableList () {
      const params = {
        pageNo: this.pageFilters.pageNo,
        pageSize: this.pageFilters.pageSize,
        keyword: this.keyword,
        ...this.searchFormLeft
      }
      const res = await this.$simpleAsyncTo(getSearchResult(params), '获取列表失败')
      if (res) {
        this.total = res.totalRecords
        this.tableList = res.data
      }
    },

    detailsCheckHandle (val) {
      localStorage.setItem('keyword', this.keyword)
      this.$router.push({ name: 'dataTable-detail', query: {source_type: val.source_type, project_code: val.project_code} })
      this.setCubeId(val.cube_id)
    },

    async handleCurrentChange (val) {
      // await this.getSearchParams(this.keyword)
      let params = this.initParams()
      params.keyword = this.keyword || ''
      this.pageFilters.pageNo = val
      // this.getParams(params)
      this.getTableList(params)
    },
    async _getSourceType() {
      const res = await this.$simpleAsyncTo(getSourceType(), '获取数据失败')
      if (res) {
        this.storageList = res.data
      }
    },
    async _queryObjectType() {
      const res = await this.$simpleAsyncTo(queryObjectType(), '获取数据失败')
      if (res) {
        this.tableInfoList = res.data.map(d => {
          return {
            code: d.object_type,
            value: d.object_type_name
          }
        })
      }
    },
    async _queryMetaTable(project_code) {
      const res = await this.$simpleAsyncTo(queryMetaTable({project_code: project_code}), '获取数据失败')
      if (res) {
        this.tableNameList = res.data
      }
    },
    changeProjectName(val) {
      const data = this.projectInfoList.find(d => d.project_id === val)
      if (data) {
        this._queryMetaTable(data.project_code)
      }
    },
    asyncSave() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          this.asyncSaveLoading = true
          console.log(this.projectInfoList, this.refreshForm.project_id)
          const data1 = this.projectInfoList.find(d => d.project_id === this.refreshForm.project_id)
          const data2 = this.tableNameList.find(d => d.cube_id === this.refreshForm.cube_id)
          console.log(data1)
          const params = {
            table_type: this.refreshForm.table_type,
            project_code: data1 ? data1.project_code : '',
            cube_code: data2 ? data2.cube_code : ''
          }
          const res = await this.$simpleAsyncTo(saveMetaSync(params), '同步失败')
          if (res) {
            this.$message({
              type: 'success',
              message: '同步成功'
            })
            this.refreshVisible = false
          }
          this.asyncSaveLoading = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
$leftWidth: 360px;
.project {
  color: #4266dd;
}
.search-wrapper {
  height: 100%;
}
.item-detail {
  font-size: 12px;
  color: #666;
}
.search-result {
  padding: 0 10px 10px 10px;
  min-height: calc(100% - 100px);
  background-color: $grey8;
  height: 100%;
  .iconfont {
    margin-right: 5px;
    color: #39c254;
  }
  .left-condition {
    width: $leftWidth;
    background: #fff;
    padding: 20px;
    .screen {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      font-size: 14px;
      .refresh-opt {
        cursor: pointer;
      }
    }
  }
  .right-result {
    padding: 0 0 0 10px;
    .list-title {
      height: 28px;
      line-height: 28px;
      display: flex;
      align-items: center;
      margin: 10px 0;
      i {
        font-size: 16px;
        cursor: pointer;
      }
    }
    .table-list {
      background: $grey10;
      padding: 20px 20px 0 20px;
      margin-bottom: 10px;
      height: calc(100% - 160px);
      overflow: auto;
      .icons {
        display: flex;
        align-items: center;
        i {
          font-size: 28px;
          color: '#dec28f';
        }
      }
      .name {
        font-size: 14px;
        cursor: pointer;
        width: calc(100% - 20px);
        > h4 {
          span {
            width: calc(100% - 20px);
          }
        }
      }
      .info {
        font-size: 12px;
        > div {
          width: 33.33333%;
          span {
            width: calc(100% - 80px);
            color: $grey2;
          }
        }
      }
    }
    .color {
      color: $grey4;
    }
  }
}

</style>
