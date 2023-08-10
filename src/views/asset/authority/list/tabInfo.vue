<template>
  <div class="tabInfo">
    <div class="animated fadeInRight">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="类型">
          <el-select v-model="formInline.type">
            <el-option :label="item.label" :value="item.value" v-for="item in typeList" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流程状态">
          <el-select v-model="formInline.status">
            <el-option :label="item.label" :value="item.value" v-for="item in statusList" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker v-model="formInline.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <div class="input-class">
          <el-input v-model="formInline.search" prefix-icon="el-icon-search" placeholder="请搜索申请内容名称"></el-input>
        </div>
      </el-form>
      <el-table :data="tableData" v-loading="!!loading">
        <el-table-column show-overflow-tooltip prop="number" label="申请编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="content" label="申请内容"></el-table-column>
        <el-table-column show-overflow-tooltip prop="type" label="类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="permissionType" label="权限类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="permissionBelong" label="权限归属"></el-table-column>
        <el-table-column show-overflow-tooltip prop="validTime" label="有效期"></el-table-column>
        <el-table-column show-overflow-tooltip prop="explain" label="申请说明"></el-table-column>
        <el-table-column show-overflow-tooltip prop="time" label="申请时间"></el-table-column>
        <el-table-column show-overflow-tooltip prop="status" label="审批状态"></el-table-column>
        <el-table-column show-overflow-tooltip prop="person" label="审批人"></el-table-column>
        <el-table-column prop="btn" label="操作">
          <template slot-scope="scope">
            <el-button @click="detailClick(scope.row)" type="text" size="small">详情</el-button>
            <el-button v-if="scope.row.actionType == 2" @click="reapplyClick(scope.row)" type="text" size="small">重新申请</el-button>
            <el-button v-if="scope.row.actionType == 1" @click="recallClick(scope.row)" type="text" size="small">撤回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="详情" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <div class="dialog-class">
        <div>
          <span>
            申请编号：
            <span>{{detailInfo.number}}</span>
          </span>
          <span>
            申请内容：
            <span>{{detailInfo.content}}</span>
          </span>
          <span>
            类型：
            <span>{{detailInfo.type}}</span>
          </span>
          <span>
            所属项目：
            <span>{{detailInfo.project}}</span>
          </span>
        </div>
        <div>
          <span>
            权限类型：
            <span>{{detailInfo.permissionType}}</span>
          </span>
          <span>
            账号归属：
            <span>{{detailInfo.belong}}</span>
          </span>
          <span>
            有效期：
            <span>{{detailInfo.validTime}}</span>
          </span>
          <span>
            申请时间：
            <span>{{detailInfo.time}}</span>
          </span>
        </div>
        <div>
          <span>
            申请说明：
            <span>{{detailInfo.explain}}</span>
          </span>
        </div>
        <div v-show="!isShow">
          <span>
            申请详情：
            <span>{{detailInfo.detail}}</span>
          </span>
        </div>
        <div>
          <span>
            申请人：
            <span>{{detailInfo.person}}</span>
          </span>
          <span>
            审批人：
            <span>{{detailInfo.examinePerson}}</span>
          </span>
          <span>
            审批状态：
            <span>{{detailInfo.status}}</span>
          </span>
        </div>
        <div>
          <span>
            审批时间：
            <span>{{detailInfo.examineTime}}</span>
          </span>
          <span>
            审批意见：
            <span>{{detailInfo.suggestion}}</span>
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'animate.css'
import { getRecall } from '@/api/asset/authority'
export default {
  props: {
    typeList: {
      type: Array,
      default: () => [
        { label: '全部', value: '0' },
        { label: '逻辑表', value: '1' },
        { label: '物理表', value: '2' },
        { label: '数据源', value: '3' }
      ]
    },
    statusList: {
      type: Array,
      default: () => [
        { label: '全部', value: '0' },
        { label: '审批中', value: '1' },
        { label: '审批通过', value: '2' },
        { label: '审批拒绝', value: '3' },
        { label: '已撤回', value: '4' }
      ]
    },
    tableData: {
      type: Array,
      default: () => []
    },
    formInline: {
      type: Object,
      default: function () {
        return {
          type: '0',
          status: '0',
          time: '',
          search: ''
        }
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      detailInfo: {},
      visible: false,
      loading: 0,
      isShow: true
    }
  },
  mounted () { },
  methods: {
    detailClick (row) {
      this.dialogVisible = true
      this.detailInfo = {
        number: '30481564',
        content: 't_ods_i_houseinfo',
        type: '物理表',
        project: 'cus_test_003',
        permissionType: '查询',
        belong: '统一生产账号',
        validTime: '永久',
        time: '2019-06-24 16:40:33',
        explain: '测试',
        detail: 't_ods_i_houseinfo',
        person: 'cus_test_003@dataphin',
        examinePerson: 'hdl_super_user@dataphin',
        status: '审批通过',
        examineTime: '2019-06-24 16:51:28',
        suggestion: '请谨慎使用权限！'
      }
      this.isShow = row.actionType === 1
    },
    recallClick (row) {
      this.$confirm('您确定退出吗?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getrecall(row.id)
      })
    },
    async getrecall (id) {
      const res = await this.$simpleAsyncTo(getRecall({ id: id }), '获取接口失败')
      if (res) {
        this.$message({
          message: res.msg,
          type: res.flag ? 'success' : 'error',
          showClose: true
        })
        this.$emit('getTable')
      }
    },
    reapplyClick (row) {
      this.$router.push({ name: 'authority-apply', params: row })
    }
  }
}
</script>

<style lang="scss">
.tabInfo {
  .animated {
    animation-duration: 0.3s;
  }
  .input-class {
    width: 200px;
    float: right;
  }
  .el-dialog .el-dialog__body {
    padding-bottom: 30px;
  }
  .dialog-class {
    div {
      padding: 10px 0;
      & > span {
        padding: 0 10px;
        color: #999;
        span {
          color: #000;
        }
      }
    }
  }
}
</style>
