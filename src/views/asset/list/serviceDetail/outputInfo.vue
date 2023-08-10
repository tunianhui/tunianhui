<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2022-10-18 10:37:53
 * @LastEditTime: 2023-01-11 16:41:41
 * @Description:
-->
<template>
  <section class="output-info animated fadeInRight">
    <div class="item-title">请求参数</div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="item-detail">业务请求参数</div>
        <el-table :data="requestList"
                  :max-height="tableHeight"
                  style="width: 100%"
                  class="b-r animated fadeInRight">
          <el-table-column show-overflow-tooltip
                           prop="param_name"
                           label="参数名">
          </el-table-column>
          <el-table-column show-overflow-tooltip
                           prop="param_type"
                           label="类型"></el-table-column>
          <el-table-column show-overflow-tooltip
                           prop="remark"
                           label="描述"></el-table-column>
          <el-table-column show-overflow-tooltip
                           prop="demo_value"
                           label="示例值"></el-table-column>
          <el-table-column show-overflow-tooltip
                           prop="is_require"
                           label="是否必填"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <div class="item-detail">公共请求参数</div>
        <el-table :data="commonList"
                  :max-height="tableHeight"
                  style="width: 100%"
                  class="b-r animated fadeInRight">
          <el-table-column show-overflow-tooltip
                           prop="param_name"
                           label="参数名">
          </el-table-column>
          <el-table-column show-overflow-tooltip
                           prop="param_type"
                           label="类型"></el-table-column>
          <el-table-column show-overflow-tooltip
                           prop="remark"
                           label="描述"></el-table-column>
          <el-table-column show-overflow-tooltip
                           prop="demo_value"
                           label="示例值"></el-table-column>
          <el-table-column show-overflow-tooltip
                           prop="is_require"
                           label="是否必填"></el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <div class="item-title mt-20">返回参数</div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="item-detail">返回参数列表</div>
        <el-table :data="responeList"
                  :max-height="tableHeight"
                  style="width: 100%"
                  class="b-r animated fadeInRight">
          <el-table-column show-overflow-tooltip
                           prop="param_name"
                           label="参数名">
          </el-table-column>
          <el-table-column show-overflow-tooltip
                           prop="param_type"
                           label="类型"></el-table-column>
          <el-table-column show-overflow-tooltip
                           prop="remark"
                           label="描述"></el-table-column>
          <el-table-column show-overflow-tooltip
                           prop="demo_value"
                           label="示例值"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <div class="item-detail">返回参数示例</div>
        <MonacoEditor readonly
                      :code.sync="sql_templateNew" />
      </el-col>
    </el-row>

  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getServerDetail
} from '@/api/asset/list'
import pager from '@/mixins/pager'
export default {
  name: 'OutputInfo',
  mixins: [pager],
  props: {
    sql_template: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      requestList: [],
      responeList: [],
      commonList: [],
      tableData: [],
      tableHeight: 100,
      sql_templateNew: ''
    }
  },
  computed: {
    ...mapGetters(['cube_id'])
  },
  watch: {
    sql_template: {
      handler(val) {
        if (val) {
          this.sql_templateNew = this.decrypt(val)
        }
      }
    }
  },
  created () {
    this.getOutputInfo()
  },
  mounted () {
    this.$nextTick(_ => {
      this.tableHeight = window.innerHeight - 245
    })
  },
  methods: {
    async getOutputInfo () {
      const params = {
        id: this.cube_id
      }
      const res = await this.$simpleAsyncTo(getServerDetail(params))
      if (res) {
        this.requestList = res.data.request_param
        this.responeList = res.data.respone_param
        this.commonList = res.data.common_param
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.item-title {
  font-size: 14px;
  font-weight: bold;
  margin-left: 10px;
  padding: 3px;
}
.item-detail {
  color: #666;
  margin: 10px;
}
.output-info {
  background-color: #f8f6fa;
  .right-search {
    .el-input {
      width: 180px !important;
    }
  }
  .icons {
    display: flex;
    align-items: center;
    i {
      font-size: 28px;
      // color: $warning;
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
}
</style>
