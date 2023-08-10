<template>
  <section class="pending-all page-wrapper">
    <PageTableLayout :showDag="showDag" @leftClickHange="showDag = false">
      <template v-slot:left>
        <el-table ref="tableData" :data="tableData" v-loading="!!loading" style="width: 100%;height:100%">
          <el-table-column prop="title" label="任务名称" show-overflow-tooltip min-width="240">
            <template slot-scope="scope">
              <i class="icon-shenqingjilu iconfont font-14 mr-5"></i>
              <span class="title" v-if="scope.row.flow_type == 'api' || scope.row.flow_type == 'table'" @click="approveHandle(scope.row)">{{ scope.row.title
              }}</span>
              <span class="title" v-if="scope.row.flow_type == 'tablemanage'" @click="orderapproveHandle(scope.row)">{{
                scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="subUser" label="创建人" show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column prop="status" label="任务状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <i :class="scope.row.status === 'pass' ? 'el-icon-success':'el-icon-warning' "></i>
              {{ scope.row.status === 'pass' ? '已通过' : '已驳回' }}
            </template>
          </el-table-column> -->
          <el-table-column prop="source" label="来源系统" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="flow_type" label="任务类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="start_time" label="创建时间" show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column prop="end_time" label="完成时间" show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column prop="" label="操作" width="80">
            <template slot-scope="{row}">
              <el-tooltip class="item" effect="dark" content="详情" placement="top">
                <el-button v-if="row.flow_type == 'api' || row.flow_type == 'table'" type="text"><i class="iconfont icon-xiangqing font-14"
                    @click="approveHandle(row)"></i></el-button>
                <el-button v-if="row.flow_type == 'tablemanage'" type="text"><i class="iconfont icon-xiangqing font-14"
                    @click="orderapproveHandle(row)"></i></el-button>
              </el-tooltip>
            </template>

          </el-table-column>
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
            :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo"
            layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>
      </template>
      <template v-slot:right>
        <!-- api -->
        <div v-if="isShow === 'info'" class="detail">
          <header class="font-14 mb-10">对象信息</header>
          <div class="mb-20 notice-center-card">
            <el-form class="demo-form-inline" label-width="120px" label-suffix="：">
              <el-row type="flex">
                <el-col :span="8">
                  <el-form-item label="应用名称">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.app_name
                    }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="应用分组">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.app_group_name
                    }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex">
                <el-col :span="8">
                  <el-form-item label="API名称">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.api_name
                    }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="API分组">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.servunit_group_name
                    }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="mb-20 font-14">权限字段</div>
          <el-table ref="returnFields" :data="baseinfo.returnFields" tooltip-effect="dark" style="width: 100%;"
            max-height="170">
            <el-table-column label="序号" type="index"> </el-table-column>
            <el-table-column prop="param_name" label="返回参数名" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="param_type" label="参数类型" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="remark" label="返回参数描述" show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <div class="mb-20 mt-20 font-14">权限配置</div>
          <div class="notice-center-card mb-20">
            <el-form ref="form" :model="grantConfig" label-width="100px" label-suffix="：">
              <el-row class="mb-10">
                <el-col :span="6">
                  <el-form-item label="权限类型">
                    {{ auth_type }}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="账号类型">
                    {{ number_type }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="mb-10">
                <el-col :span="6">
                  <el-form-item label="有效期至" prop="expire_type">
                    <el-select v-model="grantConfig.expire_type" placeholder="" @change="expireTypeChange" disabled>
                      <el-option :label="item.label" :value="item.value" v-for="item in untils"
                        :key="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="" label-width="30px">
                    <el-date-picker v-model="grantConfig.expire_time" type="date" placeholder="选择日期"
                      :picker-options="pickerOptions" :disabled="disabled">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="申请原因" prop="reason">
                <el-input type="textarea" :rows="4" resize="none" :show-word-limit="true" :maxlength="128"
                  placeholder="请输入内容" v-model="grantConfig.reason" disabled>
                </el-input>
              </el-form-item>
            </el-form>
          </div>

          <div class="mb-20 mt-20 font-14">审批信息</div>
          <div class="notice-center-card mb-20">
            <el-form ref="form" :model="approvalInfo" label-width="100px" label-suffix="：" :rules="approvalInfoRules">
              <el-row class="mb-10">
                <el-col>
                  <el-form-item label="审批结果" prop="reject">
                    <el-radio-group v-model="approvalInfo.reject">
                      <el-radio :label="false">通过</el-radio>
                      <el-radio :label="true">驳回</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="mb-10">
                <el-col>
                  <el-form-item label="审批说明" prop="message">
                    <el-input type="textarea" :rows="4" resize="none" :show-word-limit="true" :maxlength="128"
                      placeholder="请输入内容" v-model="approvalInfo.message">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="flex-center">
            <el-button type="primary" class="mr-20" @click="confirm">提 交</el-button>
            <el-button type="primary" @click="cancel">返 回</el-button>
          </div>
        </div>
        <!-- 工单 -->
        <div v-if="isShow === 'infoWork'" class="detail">
          <header class="font-14 mb-10">申请表名</header>
          <div class="mb-20 notice-center-card">
            <el-form class="demo-form-inline" label-width="120px" label-suffix="：">
              <el-row type="flex">
                <el-col :span="8">
                  <el-form-item label="表名">
                    <el-select placeholder="全部" v-model="value" @change="chooseModel">
                      <el-option v-for="item in tableOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

              </el-row>
            </el-form>
          </div>
          <header class="font-14 mb-10">选择字段</header>
          <div class="mb-20 notice-center-card">
            <el-form class="demo-form-inline" label-width="120px" label-suffix="：">
              <el-row type="flex">
                <el-col :span="8">
                  <el-form-item label="表分层">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.table_layer
                    }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="主题归属">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.data_name
                    }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="数据源类型">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.datasource_type
                    }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="数据源">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.data_source_name
                    }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex">
                <el-col :span="8">
                  <el-form-item label="库">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.datasource_db
                    }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="核心表">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.is_core_table == 0?'是':"否"
                    }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="表描述">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.table_name
                    }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="表生命周期">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.table_lifecycle 
                    }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex">
                <el-col :span="8">
                  <el-form-item label="分区生命周期">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.part_lifecycle
                    }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                
                <el-col :span="8">

                </el-col>
                <el-col :span="8">

                </el-col>
              </el-row>
            </el-form>
          </div>

          <div class="mb-20 font-14">字段列表</div>
          <el-table ref="table_info" :data="baseinfo.table_info" tooltip-effect="dark" style="width: 100%;"
            max-height="170">
            <el-table-column label="序号" type="index"> </el-table-column>
            <el-table-column prop="column_code" label="字段名" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="column_name" label="字段描述" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="column_type" label="数据类型" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="remark" label="数据分类" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="remark" label="数据分级" show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <div class="mb-20 mt-20 font-14">审批信息</div>
          <div class="notice-center-card mb-20">
            <el-form ref="form" :model="approvalInfo" label-width="100px" label-suffix="：" :rules="approvalInfoRules">
              <el-row class="mb-10">
                <el-col>
                  <el-form-item label="审批结果" prop="reject">
                    <el-radio-group v-model="approvalInfo.reject">
                      <el-radio :label="false">通过</el-radio>
                      <el-radio :label="true">驳回</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="mb-10">
                <el-col>
                  <el-form-item label="审批说明" prop="message">
                    <el-input type="textarea" :rows="4" resize="none" :show-word-limit="true" :maxlength="128"
                      placeholder="请输入内容" v-model="approvalInfo.message">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="flex-center">
            <el-button type="primary" class="mr-20" @click="confirm">提 交</el-button>
            <el-button type="primary" @click="cancel">返 回</el-button>
          </div>
        </div>
        <Standard v-if="isShow === 'standard'" :baseinfo="baseinfo" :proc_inst_id="proc_inst_id" @cancel="cancel">
        </Standard>

        <!-- 权限 -->
        <Auth v-if="isShow === 'auth'" :baseinfo="baseinfo" :flow_type="flow_type" :proc_inst_id="proc_inst_id"
          @cancel="cancel"></Auth>
        <AuthLogic v-if="isShow === 'authLogic'" :baseinfo="baseinfo" :flow_type="flow_type" :proc_inst_id="proc_inst_id"
          @cancel="cancel"></AuthLogic>
        <AuthDs v-if="isShow === 'authDs'" :baseinfo="baseinfo" :flow_type="flow_type" :proc_inst_id="proc_inst_id"
          @cancel="cancel"></AuthDs>

          <AuthTable v-if="isShow === 'table'" :data="baseinfoTable" :proc_inst_id="proc_inst_id" @close="cancel" v-loading="loadingTable"></AuthTable>
      </template>

    </PageTableLayout>

  </section>
</template>

<script>
import {
  getPendingList
} from '@/api/notice/task-center/index.js'
import mixin from '../mixin'
import Standard from './standard'
import Auth from '../comps/auth-submit.vue'
import AuthLogic from '../comps/auth-logic.vue'
import AuthDs from '../comps/auth-ds.vue'
import PageTableLayout from '@c/page-table-layout'
import AuthTable from '../comps/table.vue'
export default {
  name: 'PendingAll',
  mixins: [mixin],
  components: {
    PageTableLayout,
    Standard,
    Auth,
    AuthLogic,
    AuthDs,
    AuthTable
  },
  data() {
    return {
      showDag: false,
      tableData: [],
      loading: 0,
      filterData: [],
      keywords: '',
      flow_type: '',

      // options: [{
      //   value: '1',
      //   label: '表1'
      // }, {
      //   value: '2',
      //   label: '表2'
      // }, {
      //   value: '3',
      //   label: '表3'
      // }, {
      //   value: '4',
      //   label: '表4'
      // }, {
      //   value: '5',
      //   label: '表5'
      // }],
      value: ''
    }
  },
  watch: {
    '$route': {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.query.keyword) {
          this.keywords = val.query.keyword
        }
        if (val.path.indexOf('pending') > -1) {
          this.filterData = [{
            label: '任务类型',
            id: '任务类型',
            options: this.dics.task_type.map(item => {
              return {
                ...item,
                id: item.key,
                label: item.value
              }
            })
          }]
          this.getTableList([], this.keywords)
        }
      }
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    // 选择表名称
    chooseModel() {
      let data = this.baseinfo1.find(item => item.table_code == this.value)
      this.baseinfo = data.table_info
      this.baseinfo.table_info = data.column_info
    },
    async getTableList(curFilter = [], keyword = '') {
      this.loading++
      const params = {
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo,
        keyword: keyword,
        flow_type: ''
      }
      curFilter.forEach(e => {
        switch (e.module) {
          case '任务类型':
            params.flow_type = e.value
            break
        }
      })
      const res = await this.$simpleAsyncTo(
        getPendingList(params),
        '获取列表失败'
      )
      if (res) {
        // console.log('ddddddddddddddd')
        // console.log(params)

        this.tableData = res.data
        this.total = res.totalRecords

      }
      this.loading--
    },

    handleEdit() {
      this.showDag = true
      this.isShow = 'info'
    },

    handleWork() {
      this.showDag = true
      this.isShow = 'infoWork'
    },
    /**
     * 点击任务名称到审批界面时，根据不同的flow_type获取表单模板，
     * 然后调用/taskCenter/getToDoDetail获取表单数据，填充到模板中，表单数据与审批提交时传给后台的json格式一致
     * 审批界面的审批信息和提交、返回按钮为公共组件，每种类型的审批流程一致，上面的信息为不同流程的表单信息
     */
    approveHandle(row) {
      this.showDag = true
      if (row.flow_type === 'api') {
        this.isShow = 'info'
      }
      if (row.flow_type === 'standard') {
        this.isShow = 'standard'
      }
      const types = ['table_logic_auth_flow', 'table_physical_auth_flow', 'service_ds_auth_flow', 'service_api_auth_flow', 'service_func_auth_flow']
      if (types.includes(row.flow_type)) {
        this.isShow = 'auth'
        if (row.flow_type === 'table_logic_auth_flow' || row.flow_type === 'table_physical_auth_flow') {
          this.isShow = 'authLogic'
        }
        if (row.flow_type === 'service_ds_auth_flow') {
          this.isShow = 'authDs'
        }
        this.flow_type = row.flow_type
      }
      if (row.flow_type === 'table') {
        this.isShow = 'table'
      }
      this.proc_inst_id = row.proc_inst_id
      console.log(row.flow_type)
      this.getToDoDetail(row.proc_inst_id, 'wait', row.flow_type)
    },

    orderapproveHandle(row) {
      this.showDag = true
      if (row.flow_type === 'tablemanage') {
        this.isShow = 'infoWork'
      }
      if (row.flow_type === 'standard') {
        this.isShow = 'standard'
      }

      const types = ['table_logic_auth_flow', 'table_physical_auth_flow', 'service_ds_auth_flow', 'service_api_auth_flow', 'service_func_auth_flow']
      if (types.includes(row.flow_type)) {
        this.isShow = 'auth'
        if (row.flow_type === 'table_logic_auth_flow' || row.flow_type === 'table_physical_auth_flow') {
          this.isShow = 'authLogic'
        }
        if (row.flow_type === 'service_ds_auth_flow') {
          this.isShow = 'authDs'
        }
        this.flow_type = row.flow_type
      }

      this.proc_inst_id = row.proc_inst_id

      this.getToDoDetail1(row.proc_inst_id, 'wait')
      // console.log('ddddddddd2222');
      // console.log(this.baseinfo1);
    }
  }
}
</script>
<style scoped>
.title {
  cursor: pointer;
}

.icon-shenqingjilu {
  color: #0c4cff;
  opacity: 0.9;
}

.el-icon-warning {
  color: rgb(255, 116, 116);
}

.detail {
  background-color: #fff;
  padding: 15px;
  height: 100%;
  overflow-y: auto;
}
</style>