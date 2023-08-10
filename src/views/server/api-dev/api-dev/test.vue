<template>
  <section class="api-test">
    <header class="space-between mb-10">
      <span>API测试</span>
      <el-button type="primary" class="mb-10" @click="toBackHandle">返 回</el-button>
    </header>
    <div class="api-test-body">
      <el-card class="box-card">
        <div class="title mb-10">基本信息</div>
        <div class="api-test-info">
          <div class="">
            <span class="api-test-color">API名称：</span><span>{{rowData.api_name}}</span>
          </div>
          <el-row class=" mt-15">
            <el-col :span="8">
              <span class="api-test-color">请求方式：</span><span>{{rowData.api_request_type}}</span>
            </el-col>
            <el-col :span="8">
              <span class="api-test-color">协议：</span><span>{{rowData.api_protocol.toString()}}</span>
            </el-col>
            <el-col :span="8">
              <span class="api-test-color">返回类型：</span><span>{{rowData.api_reponse_type}}</span>
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
          <el-table :data="rowData.select" style="width: 100%">
            <el-table-column prop="date" label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="param_name" label="参数名">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="param_type" label="类型">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="remark" label="描述">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="demo_value" label="示例值" width="250">
              <!-- <template slot-scope="scope">
                <el-input v-model="scope.row.test_value"></el-input>
              </template> -->
            </el-table-column>
          </el-table>
          <div class="more">
            <!-- <span>展开加载更多</span> -->
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
import { getTestApi } from '@/api/server/server.js'
export default {
  name: 'ApiTest',
  props: {
    rowData: {
      type: Object
    }
  },
  data () {
    return {
      params: {},
      httpProtocolOptions: ['http', 'https'],
      resOptions: ['1', '10'],
      httpProtocol: 'http',
      res_num: '1',
      curCode: '',
      whereList: [],
      resTime: 0,
      flag: false
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
  created () {
    this.whereList = this.rowData.where.map(e => {
      return { ...e, test_value: '' }
    })
  },
  mounted () {
  },
  updated () {
    this.$refs.testResultEditor.jsonformat()
  },
  methods: {
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
        id: this.rowData.id,
        httpProtocol: this.httpProtocol,
        limit: this.res_num,
        param: JSON.stringify(param)
      }
      const startTime = new Date().getTime()
      const res = await this.$simpleAsyncTo(getTestApi(params))
      this.resTime = new Date().getTime() - startTime
      if (res) {
        this.curCode = JSON.stringify(res.data)
      }
      this.flag = false
    },
    toBackHandle () {
      this.$emit('toBackHandle', 'apiHome')
    }
  }
}
</script>

<style lang="scss">
.api-test {
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
}
</style>
