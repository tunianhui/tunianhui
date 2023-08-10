<template>
  <div class="data-server-powwer">
    <div class="" ref="quality">
      <Header :tabs="tabs" v-model="activeName" ref="head" @change="changeTab">
        <div class="actions">
          <el-button><i class="el-icon-refresh-right"></i></el-button>
        </div>
      </Header>
      <el-card>
        <el-form :model="form" :inline="true" class="formSearch">
          <el-form-item label="请选择服务项目" label-width="120px">
            <el-select v-model="form.project">
              <el-option v-for="item in projectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="search">
            <el-input v-model="form.keyWord" prefix-icon="el-icon-search" placeholder="请输入关键词">
            </el-input>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="table-record">
        <el-table :data="tableData" style="width: 100%" ref="table" v-loading="loading">
          <el-table-column prop="appName" v-if="activeName === '1'" label="APP名称">
            <template slot-scope="scope">
              <div class="color">
                <OverflowTooltip style="width:150px">
                  {{scope.row.appName}}
                </OverflowTooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="apiName" v-if="activeName === '2'" label="API名称">
            <template slot-scope="scope">
              <div class="color">
                <OverflowTooltip style="width:150px">
                  {{scope.row.apiName}}
                </OverflowTooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="unitName" v-if="activeName === '3'" label="服务单元名称">
            <template slot-scope="scope">
              <div class="color">
                <OverflowTooltip style="width:150px">
                  {{scope.row.unitName}}
                </OverflowTooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="dataSourceName" v-if="activeName === '4'" label="数据源名称">
            <template slot-scope="scope">
              <div class="color">
                <OverflowTooltip style="width:150px">
                  {{scope.row.dataSourceName}}
                </OverflowTooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="serverProject" label="所属服务项目" show-overflow-tooltip>
            <template slot-scope="scope">
              <OverflowTooltip>{{scope.row.serverProject}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="creator" label="创建人" show-overflow-tooltip>
            <template slot-scope="scope">
              <OverflowTooltip>{{scope.row.creator}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="role" label="角色" show-overflow-tooltip>
            <template slot-scope="scope">
              <OverflowTooltip>{{scope.row.role}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="authorizedSource" label="授权来源" show-overflow-tooltip>
            <template slot-scope="scope">
              <OverflowTooltip>{{scope.row.authorizedSource}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="ownership" label="权限归属" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <OverflowTooltip style="width:150px">{{scope.row.ownership}}</OverflowTooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button v-if="activeName === '1' || activeName === '3'" type="text" @click="empowerHandle(scope.row, '授权')">
                <i class="icon iconfont icon-shouquan1"></i>
              </el-button>
              <el-button type="text" @click="empowerHandle(scope.row, '回收')">
                <i class="icon iconfont icon-huishou"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div class="pagination-footer">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>
      </div>
    </div>
    <EmpowerDialog :user="user" :activeName="activeName" :title="title" :optType="optType" v-if="empowerVisible" @empowerClose="empowerClose"></EmpowerDialog>
  </div>
</template>

<script>
import mixin from '../../mixins'
import pager from '@/mixins/pager'
import NoData from '@c/no-data'
import EmpowerDialog from './empower-dialog'
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'DataserverPower',
  mixins: [mixin, pager],
  components: {
    NoData,
    EmpowerDialog,
    OverflowTooltip
  },
  data () {
    return {
      activeName: '1',
      tabs: [
        {
          label: '应用权限',
          value: '1',
          total: 14
        },
        {
          label: 'API权限',
          value: '2',
          total: 17
        },
        {
          label: '服务单元权限',
          value: '3',
          total: 1
        },
        {
          label: 'Dataphin数据源权限',
          value: '4',
          total: 1
        }
      ],
      form: {
        project: '',
        keyword: ''
      },
      projectList: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '项目一',
          value: '1'
        },
        {
          label: '项目二',
          value: '2'
        }
      ],
      loading: false,
      tableData: [
        {
          appName: 'dataphin_app_1213',
          apiName: 'huju001',
          unitName: 'test_es',
          dataSourceName: 'dataphin0926',
          serverProject: '[默认项目[300001903]]',
          creator: '',
          role: '负责人',
          authorizedSource: '负责人',
          ownership: ''
        }
      ],
      empowerVisible: false,
      user: '',
      title: '',
      optType: 1 // 1为授权，2为回收
    }
  },
  created () {
  },
  methods: {
    changeTab (val) {
      this.activeName = val
    },
    empowerHandle (row, type) {
      if (type == '授权') {
        this.optType = 1
        switch (this.activeName) {
          case '1':
            this.title = '应用授权'
            break
          case '3':
            this.title = '服务单元授权'
            break
        }
      } else {
        this.optType = 2
        switch (this.activeName) {
          case '1':
            this.title = '应用权限回收'
            break
          case '2':
            this.title = 'API权限回收'
            break
          case '3':
            this.title = '服务单元权限回收'
            break
          case '4':
            this.title = 'Dataphin数据源权限回收'
            break
        }
      }
      switch (this.activeName) {
        case '1':
          this.user = row.appName
          break
        case '2':
          this.user = row.apiName
          break
        case '3':
          this.user = row.unitName
          break
        case '4':
          this.user = row.dataSourceName
          break
      }
      this.empowerVisible = true
    },
    empowerClose () {
      this.empowerVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.data-server-powwer {
  height: 100%;
  position: relative;
  background: #ebeaef;
  > div {
    overflow-y: overlay;
    height: 100%;
    padding: 10px 15px 56px 15px;
  }
  .el-card {
    margin-bottom: 20px;
  }
  .formSearch {
    .el-form-item {
      margin-bottom: 0 !important;
    }
    .search {
      .el-input {
        width: 200px;
        ::v-deep .el-input__inner {
          border: none;
          border-bottom: 1px solid $grey6;
          border-radius: 0;
          background-color: #fff;
        }
      }
    }
  }
}
</style>
