<template>
  <el-dialog :title="`${rowData.en_name} 数据探查(${rowData.data_type})`" :visible.sync="dataSearchVisible" width="40%" :close-on-click-modal="false" @close="closeHandle">
    <el-row>
      <el-col :span="12">数值分布</el-col>
      <el-col :span="12">数值区间分布（单位： 万）</el-col>
      <el-col :span="12" class="mt-20 mb-20">暂无数据</el-col>
      <el-col :span="12" class="mt-20 mb-20">暂无数据</el-col>
    </el-row>
    <el-table
      v-loading="!!loading"
      :data="tableData.tableData"
      style="width: 100%"
      header-cell-class-name="color">
      <el-table-column prop="index" width="200" label="No"></el-table-column>
      <el-table-column prop="primaryKey" label="PrimaryKey"></el-table-column>
      <el-table-column prop="value" label="Value"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { getDataSearch } from '@/api/asset/map-detail'
export default {
  name: 'DataSearchDialog',
  props: {
    rowData: {
      type: Object
    }
  },
  data() {
    return {
      tableData: [],
      dataSearchVisible: true,
      loading: 0
    }
  },
  created() {
    this.getDataSearch()
  },
  methods: {
    async getDataSearch() {
      this.loading++
      const params = {id: this.rowData.id}
      const res = await this.$simpleAsyncTo(getDataSearch(params), '获取数据探查失败')
      if (res) {
        this.tableData = res.data
        this.loading--
      }
    },
    closeHandle() {
      this.$emit('close', 'dataSearch')
    }
  }
}
</script>

<style lang="scss">
.has-gutter {
    >tr {
      th:first-child {
        >div {
          display: block!important;
        }
      }
    }
  }
</style>
