<template>
  <section class="api-test-debug">
    <header class="space-between mb-10">
      <span>API调试</span>
      <el-button type="primary" class="mb-10" @click="toBackHandle">返 回</el-button>
    </header>
    <div class="api-test-body">
      <el-card class="box-card">
        <div class="title mb-10">基本信息</div>
        <div class="api-test-info">
          <!-- <div class="">
            <span class="api-test-color">API名称：</span><span></span>
          </div> -->
          <el-row class="basic-info">
            <el-col :span="6">
              <span>API名称：</span>
              <OverflowTooltip class="width1"><i>{{apiInfo.api_name}}</i></OverflowTooltip>
            </el-col>
            <el-col :span="6">
              <span>API_ID：</span>
              <OverflowTooltip class="width1"><i>{{apiInfo.id}}</i></OverflowTooltip>
            </el-col>
            <el-col :span="6">
              <span>API分组：</span>
              <OverflowTooltip class="width1"><i>{{apiInfo.api_group_name}}</i></OverflowTooltip>
            </el-col>
            <el-col :span="6">
              <span>API_Path：</span>
              <OverflowTooltip class="width1"><i>{{apiInfo.api_path}}</i></OverflowTooltip>
            </el-col>
            <el-col :span="6">
              <span>请求方式：</span>
              <OverflowTooltip class="width1"><i>{{apiInfo.api_request_type}}</i></OverflowTooltip>
            </el-col>
            <el-col :span="6">
              <span>协议：</span>
              <OverflowTooltip class="width1"><i>{{apiInfo.api_protocol}}</i></OverflowTooltip>
            </el-col>
            <el-col :span="6">
              <span>返回类型：</span>
              <OverflowTooltip class="width1"><i>{{apiInfo.api_reponse_type}}</i></OverflowTooltip>
            </el-col>
            <el-col :span="6">
              <span>接口描述：</span>
              <OverflowTooltip class="width1"><i>{{apiInfo.api_remark}}</i></OverflowTooltip>
            </el-col>
          </el-row>
        </div>
        <div class="mt-20 mb-20">业务请求模型</div>
        <div class="api-model">
          <el-table :data="whereList" style="width: 100%">
            <el-table-column prop="date" label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="param_name" label="参数名" width="180">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="param_type" label="类型">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="remark" label="描述">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="demo_value" label="示例值">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="is_require" label="必填">
              <template slot-scope="scope">
                {{scope.row.is_require ? '是' : '否'}}
              </template>
            </el-table-column>
            <el-table-column prop="test_value" label="测试输入值" width="250">
              <template slot-scope="scope">
                <el-input v-model="scope.row.test_value"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="mt-20 mb-20">返回参数列表</div>
        <div class="api-model">
          <el-table :data="apiInfo.select" style="width: 100%">
            <el-table-column prop="date" label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="param_name" label="参数名">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="param_type" label="类型">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="remark" label="描述">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="demo_value" label="示例值" width="250">
            </el-table-column>
          </el-table>
          <div class="more">
          </div>
        </div>
        <div class="mt-20 mb-20">
          <span class="api-test-color font-14 api-width">协议：</span>
          <el-select v-model="httpProtocol" placeholder="请选择">
            <el-option v-for="item in httpProtocolOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </div>
        <div class="">
          <span class="api-test-color font-14 api-width">返回条数：</span>
          <el-select v-model="res_num" placeholder="请选择">
            <el-option v-for="item in resOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <span class="test-btn" @click="testClickHandle">{{flag ? '响应中...' : '测 试'}}</span>
        </div>
        <div class="mt-20  mb-10 font-14">测试详情：
          <span class="api-test-color">API响应时间：
            <i style="color: #000">{{resTime | time}}</i>
          </span>
        </div>
        <div style="height:300px">
          <MonacoEditor ref="testResultEditor" :code.sync="curCode" language="json" :hasBottomTools="true"></MonacoEditor>
        </div>
      </el-card>
    </div>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import { getApiByIdInfo, getApiDebug } from '@/api/server/server.js'
export default {
  name: 'Debug',
  props: {
    id: [String, Number]
  },
  components: {
    OverflowTooltip
  },
  data () {
    return {
      rowData: [],
      curCode: '',
      apiInfo: {},
      httpProtocolOptions: ['http', 'https'],
      resOptions: ['1', '10'],
      httpProtocol: 'http',
      res_num: '1',
      whereList: [],
      flag: false,
      resTime: 0
    }
  },
  filters: {
    time (val) {
      if (val >= 0 && val < 1000) {
        return val + 'ms'
      }
      if (val >= 1000 && val < 60000) {
        return val / 1000 + 's'
      }
    }
  },
  async created () {
    await this.getApiByIdInfo()
    this.whereList = this.apiInfo.where.map(e => {
      return { ...e, test_value: '' }
    })
  },
  methods: {
    toBackHandle () {
      this.$emit('cancel', 'home')
    },
    async getApiByIdInfo () {
      const res = await this.$simpleAsyncTo(getApiByIdInfo({ id: this.id }), '获取数据失败')
      if (res) {
        this.apiInfo = res.data
      }
    },
    async testClickHandle () {
      if (!this.httpProtocol) return this.$message({ type: 'error', message: '请选择协议' })
      if (!this.res_num) return this.$message({ type: 'error', message: '请选择返回条数' })
      if (this.flag) return
      this.flag = true
      let param = {}
      this.whereList.forEach(e => {
        param[e.param_name] = e.test_value
      })
      const params = {
        id: this.id,
        httpProtocol: this.httpProtocol,
        limit: this.res_num,
        param: JSON.stringify(param)
      }
      const startTime = new Date().getTime()
      const res = await this.$simpleAsyncTo(getApiDebug(params))
      this.resTime = new Date().getTime() - startTime
      if (res) {
        this.curCode = JSON.stringify(res.data)
        this.flag = false
      }
    }
  }
}
</script>

<style lang="scss">
.api-test-debug {
  .api-test-body {
    .box-card {
      background-color: $grey8;
      box-shadow: none;
      border-radius: 0;
      .api-test-info {
        background: $grey10;
        font-size: 14px;
        padding: 20px;
        color: $grey1;
      }
      .api-test-color {
        color: $grey4;
      }
      .api-width {
        display: inline-block;
        width: 100px;
        text-align: end;
      }
      .test-btn {
        display: inline-block;
        height: 28px;
        line-height: 28px;
        padding: 0px 30px;
        border: 1px solid $generalColor;
        box-sizing: border-box;
        color: $generalColor;
        cursor: pointer;
        vertical-align: bottom;
        font-size: 14px;
        margin-left: 15px;
      }
      .more {
        text-align: center;
        font-size: 14px;
        color: $generalColor;
        line-height: 35px;
        background: $grey10;
        span {
          cursor: pointer;
          display: inline-block;
        }
      }
    }
  }
  .width1 {
    width: calc(100% - 100px);
  }
  .basic-info {
    .el-col {
      color: $grey3;
      margin-bottom: 5px;
      span {
        display: inline-block;
        width: 100px;
        text-align: end;
      }
      i {
        color: $grey1;
      }
    }
  }
}
</style>
