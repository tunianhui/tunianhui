<template>
  <el-dialog title="API文档" :visible.sync="curvisible" top="10vh" @close="close" width="70%">
    <div class="api-document-info">
      <div class="mb-10">对象信息</div>
      <el-card class="mb-20">
        <el-form class="demo-form-inline" label-width="120px" label-suffix="：">
          <el-row type="flex">
            <el-col :span="6">
              <el-form-item label="API名称">
                <OverflowTooltip class="font-12 width">{{baseinfo.api_name}}</OverflowTooltip>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="API_ID">
                <OverflowTooltip class="font-12 width">{{baseinfo.id}}</OverflowTooltip>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="API分组">
                <OverflowTooltip class="font-12 width">{{baseinfo.api_group_name}}</OverflowTooltip>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="API_Path">
                <OverflowTooltip class="font-12 width">{{baseinfo.api_path}}</OverflowTooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="6">
              <el-form-item label="请求方式">
                <OverflowTooltip class="font-12 width">{{baseinfo.api_request_type}}</OverflowTooltip>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="协议">
                <OverflowTooltip class="font-12 width">{{baseinfo.api_protocol}}</OverflowTooltip>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="返回类型">
                <OverflowTooltip class="font-12 width">{{baseinfo.api_reponse_type}}</OverflowTooltip>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="接口描述">
                <OverflowTooltip class="font-12 width">{{baseinfo.api_remark}}</OverflowTooltip>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div class="mb-10">业务请求参数列表</div>
      <el-table :data="requestParam" style="width: 100%" max-height="200px">
        <el-table-column type="index" label="序号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="param_name" label="参数名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="param_type" label="类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="remark" label="描述" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="demo_value" label="示例值" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="is_require" label="必填" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div class="mb-10 mt-10">公共请求参数列表</div>
      <el-table :data="commonParam" style="width: 100%" max-height="200px">
        <el-table-column type="index" label="序号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="param_name" label="参数名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="param_type" label="类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="remark" label="描述" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="demo_value" label="示例值" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="is_require" label="必填" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div class="mb-10 mt-10">返回参数列表</div>
      <el-table :data="returnParam" style="width: 100%" max-height="200px">
        <el-table-column type="index" label="序号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="param_name" label="参数名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="param_type" label="类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="remark" label="描述" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="demo_value" label="示例值" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div class="mb-10 mt-10">异常码</div>
      <el-table :data="errorCode" style="width: 100%" max-height="200px">
        <el-table-column type="index" label="序号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="code" label="异常码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="msg" label="异常信息" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
    </span>
  </el-dialog>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import { getApiDocumentInfo } from '@/api/server/server'
export default {
  name: 'APIDocuMent',
  props: {
    visible: Boolean,
    id: [String, Number]
  },
  components: {
    OverflowTooltip
  },
  data () {
    return {
      curvisible: true,
      baseinfo: {},
      requestParam: [], // 业务请求参数
      commonParam: [], // 公共请求参数
      returnParam: [], // 返回参数列表
      errorCode: [] // 异常说明
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler (val) {
        // this.curvisible = val
      }
    }
  },
  mounted () {
    this.getApiDocumentInfo()
  },
  methods: {
    async getApiDocumentInfo () {
      const res = await this.$simpleAsyncTo(getApiDocumentInfo({ id: this.id }), '获取信息失败')
      if (res) {
        this.baseinfo = res.data.baseinfo
        this.requestParam = res.data.request_param
        this.commonParam = res.data.common_param
        this.returnParam = res.data.return_param
        this.errorCode = res.data.error_code
      }
    },
    close () {
      this.curvisible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.api-document-info {
  .el-card {
    border-radius: 0;
    box-shadow: none;
    background-color: $grey10;
    border: none;
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .width {
    width: calc(100% - 10px);
  }
}
</style>
