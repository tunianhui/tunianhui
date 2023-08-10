<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-06-29 16:49:54
 * @LastEditTime: 2023-08-08 14:21:29
 * @Description:
-->
<template>
  <section class="pd-20" :style="{height: `${height}px`}">
    <div class="flex mb-10">
      <div>{{ tablRow.tblName }}</div>
      <div class="flex" style="margin-left: auto;">
        <el-input prefix-icon="el-icon-search" clearable v-model="columnName" placeholder="请输入字段名称或规则名" @change="changeHandle"></el-input>
        <el-button icon="el-icon-refresh-right" @click="changeHandle" class="ml-10"></el-button>
      </div>
    </div>
    <el-table v-loading="!!loading" :data="tableData" height="calc(100% - 50px)">
      <el-table-column prop="columnName" label="字段名称"></el-table-column>
      <el-table-column prop="identifyRuleName" label="识别规则"></el-table-column>
      <el-table-column prop="classifyShortName" label="数据分类" width="100">
        <template slot-scope="{row}">
          <span class="data-classify">{{row.classifyShortName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级" width="100px">
        <template slot-scope="{row}">
          <span class="priority-tag"> <i class="iconfont icon-APIshouquan"></i> {{ row.priority }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="levelShortName" label="数据分级" width="100px">
        <template slot-scope="{row}">
          <span class="data-classify"> <i class="iconfont icon-APIshouquan"></i> {{row.levelShortName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="configRate" label="设置/实际匹配度">
        <template slot-scope="{row}">
          <div>{{row.configRate}}%/{{row.actualRate}}%</div>
        </template>
      </el-table-column>
      <el-table-column prop="ruleModifyDay" label="规则修改时间"></el-table-column>
      <el-table-column prop="businessDay" label="业务日期"></el-table-column>
      <el-table-column prop="passFlagName" label="通过标识" width="100px"></el-table-column>
    </el-table>
    <div class="select-footer select-footer2">
      <el-pagination class="pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
    </div>
  </section>
</template>

<script>
import pager from '@/mixins/pager'
export default {
  name: 'tableDetail',
  props: ['height', 'tablRow', 'tableData', 'totalCount'],
  mixins: [pager],
  data () {
    return {
      columnName: '',
      loading: 0
    }
  },
  methods: {
    getTableList () {
      this.$emit('sendTableList', this.pageFilters)
    },

    changeHandle () {
      this.$emit('sendColumn', this.columnName)
    }
  }
}
</script>

<style lang="scss" scoped>
.select-footer2 {
  display: flex;
  justify-content: flex-end;
}
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
.pd-20 {
  padding: 20px;
  overflow: auto;
  .data-classify {
    display: block;
    width: fit-content;
    text-align: center;
    border: 1px solid #c6dcff;
    background-color: #d1e3fd;
    border-radius: 10px;
    padding: 0 20px;
  }
}
</style>
