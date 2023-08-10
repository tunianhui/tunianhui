
<!--
 * @Author: HONGXIA
 * @LastEditors: YONG
 * @Date: 2023-06-12 10:57:36
 * @LastEditTime: 2023-07-27 10:42:16
 * @Description:
-->
<template>
  <el-dialog title="字段识别记录" :visible.sync="dialogVisible" @close="close" width="55%" :close-on-click-modal="false">
    <div class="details">基本信息</div>
    <div class="label">
      <div>表名称 <span>{{ info.tableName }}（{{info.tblDesc || '-'}}）</span></div>
      <div class="child">字段名称 <span>{{ info.columnName }}</span></div>
      <!-- <div class="child">推荐原因 <span>{{ info.recommendReason }}</span></div> -->
    </div>
    <div class="common">
      <div class="flex1">识别规则详情</div>
      <el-input v-model="searchText" class="input-value ml-10" prefix-icon="el-icon-search" placeholder="请输入规则名称" @change="getTableList"></el-input>
    </div>
    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" v-loading="!!loading">
      <el-table-column prop="identifyRuleName" label="扫描规则">
        <template slot-scope="{row}">
          <span>{{row.identifyRuleName}}</span>
          <el-tooltip effect="dark" content="推荐的规则" placement="top">
            <el-button v-if="row.recommendFlag === '1'" type="text"><i class="iconfont icon-jinggao2"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="recognitionStatus" label="是否生效">
        <template slot-scope="{row}">
          <i v-if="row.recognitionStatus === '1'" class="el-icon-success"></i>
          <i v-if="row.recognitionStatus === '0'" class="el-icon-remove"></i>
          <span class="ml-10">{{ row.recognitionStatus === '1' ? '生效':'失效' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="recognitionMode" label="打标方式">
        <template slot-scope="{row}">
          <span>{{ row.recognitionMode === '1' ? '手动指定':'识别规则扫描' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级" width="100px">
        <template slot-scope="{row}">
          <span class="priority-tag"> <i class="iconfont icon-APIshouquan"></i> {{ row.priority }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="levelShortName" label="数据分级" width="100px">
        <template slot-scope="{row}">
          <span class="data-classify"> <i class="iconfont icon-APIshouquan"></i> {{ row.levelShortName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="configRate" label="设置/实际匹配度" width="120px">
        <template slot-scope="{row}">
          <div>{{row.configRate}}%/{{row.actualRate}}%</div>
        </template>
      </el-table-column>
      <el-table-column prop="ruleModifyDay" label="规则修改时间"></el-table-column>
      <el-table-column prop="businessDay" label="业务日期"></el-table-column>
    </el-table>
    <div style="display: flex;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getDetailsList } from '@/api/asset/security.js'
import pager from '@/mixins/pager'
export default {
  name: 'identification',
  props: {
    info: Object
  },
  mixins: [pager],
  data () {
    return {
      searchText: '',
      dialogVisible: true,
      tableData: [],
      loading: 0,
      total: 0,
      pageNo: 1
    }
  },
  watch: {

  },
  mounted () {
    this.getTableList()
  },
  methods: {
    close () {
      this.$emit('detailsClose')
    },
    async getTableList () {
      const params = {
        searchText: this.searchText,
        labelId: this.info.labelId,
        ...this.pageFilters
      }
      const res = await getDetailsList(params)
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
    }
  }
}
</script>
<style lang="scss">
.data-classify {
  display: block;
  width: fit-content;
  text-align: center;
  border: 1px solid #c6dcff;
  background-color: #d1e3fd;
  border-radius: 10px;
  padding: 0 20px;
}
.priority-tag {
  display: block;
  width: fit-content;
  text-align: center;
  border: 1px solid rgb(255, 199, 10);
  border-radius: 10px;
  color: rgb(255, 199, 10);
  background-color: rgba(255, 199, 10, 0.1);
  padding: 0 20px;
}
.el-pagination {
  margin-left: auto;
  margin-bottom: 20px;
}
.details {
  color: black;
}
.label {
  color: #696969;
  margin-top: 10px;
  display: flex;
  .child {
    margin-left: 30px;
  }
  span {
    margin-left: 5px;
    color: #8c8c8c;
  }
}
.common {
  margin-top: 20px;
  margin-bottom: 10px;
  display: flex;
  .flex1 {
    flex: 3;
    color: black;
  }
  .input-value {
    flex: 1;
  }
}
</style>
