<template>
  <section class="task-center-my page-wrapper">
    <PageTableLayout :showDag="showDag" @leftClickHange="showDag = false">
      <template v-slot:left>
        <el-table ref="tableData" :data="tableData" v-loading="!!loading" style="width: 100%;height:100%">
          <el-table-column prop="title" label="任务名称" show-overflow-tooltip min-width="240">
            <template slot-scope="scope">
              <i class="icon-shenqingjilu iconfont font-14 mr-5"></i>
              <span class="title" @click="approveHandle(scope.row)">{{ scope.row.title }}</span>
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
                <el-button type="text"><i class="iconfont icon-xiangqing font-14" @click="handleEdit(row)"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>
      </template>
      <template v-slot:right>
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
          <el-table ref="returnFields" :data="baseinfo.returnFields" tooltip-effect="dark" style="width: 100%;" max-height="170">
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
                    <el-select v-model="grantConfig.expire_type" placeholder="" disabled>
                      <el-option :label="item.label" :value="item.value" v-for="item in untils" :key="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="" label-width="30px">
                    <el-date-picker v-model="grantConfig.expire_time" type="date" placeholder="选择日期" :picker-options="pickerOptions" :disabled="disabled">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="申请原因" prop="reason">
                <el-input type="textarea" :rows="4" resize="none" :show-word-limit="true" :maxlength="128" placeholder="请输入内容" v-model="grantConfig.reason" disabled>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="mb-20 mt-20 font-14" v-if="isBlock">审批信息</div>
          <div class="notice-center-card mb-20" v-if="isBlock">
            <el-form ref="form" :model="approvalInfo" label-width="100px" label-suffix="：">
              <el-row class="mb-10">
                <el-col>
                  <el-form-item label="审批结果">
                    <el-radio-group v-model="approvalInfo.reject" disabled>
                      <el-radio :label="false">通过</el-radio>
                      <el-radio :label="true">驳回</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="mb-10">
                <el-col>
                  <el-form-item label="审批说明" prop="message">
                    <el-input type="textarea" :rows="4" resize="none" :show-word-limit="true" :maxlength="128" placeholder="请输入内容" v-model="approvalInfo.message" disabled>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="flex-center">
            <el-button type="primary" @click="cancel">返 回</el-button>
          </div>
        </div>

        <div v-if="isShow === 'infoWork'" class="detail">
          <header class="font-14 mb-10">申请表名</header>
          <div class="mb-20 notice-center-card">
            <el-form class="demo-form-inline" label-width="120px" label-suffix="：">
              <el-row type="flex">
                <el-col :span="8">
                  <el-form-item label="表名">
                    <el-select placeholder="全部">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
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
                      baseinfo.app_name
                      }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="主题归属">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.app_group_name
                      }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="数据源类型">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.app_group_name
                      }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="数据源">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.app_group_name
                      }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex">
                <el-col :span="8">
                  <el-form-item label="库">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.api_name
                      }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="核心表">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.servunit_group_name
                      }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="表描述">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.servunit_group_name
                      }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="表生命周期">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.servunit_group_name
                      }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex">
                <el-col :span="8">
                  <el-form-item label="分区生命周期">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.api_name
                      }}</OverflowTooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="表详细字段">
                    <OverflowTooltip class="font-12 width">{{
                      baseinfo.servunit_group_name
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
          <el-table ref="returnFields" :data="baseinfo.returnFields" tooltip-effect="dark" style="width: 100%;"
            max-height="170">
            <el-table-column label="序号" type="index"> </el-table-column>
            <el-table-column prop="param_name" label="字段名" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="param_type" label="字段描述" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="remark" label="数据类型" show-overflow-tooltip>
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
                  <el-form-item label="审批结果" prop="reject" >
                    <el-radio-group v-model="approvalInfo.reject" disabled>
                      <el-radio :label="false">通过</el-radio>
                      <el-radio :label="true">驳回</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="mb-10">
                <el-col>
                  <el-form-item label="审批说明" prop="message">
                    <el-input type="textarea" disabled :rows="4" resize="none" :show-word-limit="true" :maxlength="128"
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
        <!-- 权限 -->
        <Auth v-if="isShow === 'auth'" :flow_type="flow_type" :baseinfo="baseinfo" :approvalInfo="approvalInfo" @cancel="cancel"></Auth>
        <AuthLogic v-if="isShow === 'authLogic'" :baseinfo="baseinfo" :flow_type="flow_type" :proc_inst_id="proc_inst_id" @cancel="cancel"></AuthLogic>
        <AuthDs v-if="isShow === 'authDs'" :baseinfo="baseinfo" :flow_type="flow_type" :proc_inst_id="proc_inst_id" @cancel="cancel"></AuthDs>
      </template>
    </PageTableLayout>
  </section>
</template>

<script>
import { getMyList } from '@/api/notice/task-center/index.js'
import mixin from '../mixin'
import Auth from '../comps/auth.vue'
import AuthLogic from '../comps/auth-logic.vue'
import AuthDs from '../comps/auth-ds.vue'
import PageTableLayout from '@c/page-table-layout'
export default {
  name: 'TaskCenterMy',
  mixins: [mixin],
  components: {
    PageTableLayout,
    Auth,
    AuthLogic,
    AuthDs
  },
  data () {
    return {
      showDag: false,
      tableData: [],
      loading: 0,
      status: {
        pass: '审批通过',
        reject: '审批驳回',
        wait: '待审批'
      },
      isBlock: '',
      flow_type: '',
      options: [{
          value: '1',
          label: '表1'
        }, {
          value: '2',
          label: '表2'
        }, {
          value: '3',
          label: '表3'
        }, {
          value: '4',
          label: '表4'
        }, {
          value: '5',
          label: '表5'
        }],
        value:''
    }
  },
  created () {
    this.getTableList()
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler (val) {
        if (val.indexOf('launch') > -1) {
          this.getTableList()
        }
      }
    }
  },
  methods: {
    async getTableList () {
      this.loading++
      const params = {
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo,
        keyword: this.inputName
      }
      const res = await this.$simpleAsyncTo(getMyList(params), '获取列表失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },

    handleEdit () {
      this.showDag = true
      this.isShow = 'info'
    },

    approveHandle (row) {
      this.showDag = true
      if (row.status === 'wait') {
        this.isBlock = false
      } else {
        this.isBlock = true
      }

      // 权限
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
      } else {
        this.isShow = 'info'
      }

      this.proc_inst_id = row.proc_inst_id
      this.getToDoDetail(row.proc_inst_id, 'my')
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
