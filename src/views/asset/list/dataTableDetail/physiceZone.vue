<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-10-18 10:37:53
 * @LastEditTime: 2022-10-21 10:54:41
 * @Description:
-->
<template>
  <section class="physics b-r animated fadeInRight">
    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column width="50"
                       type="index"></el-table-column>
      <el-table-column :show-overflow-tooltip="true"
                       prop="zone"
                       label="分区"></el-table-column>
      <el-table-column :show-overflow-tooltip="true"
                       prop="num"
                       label="记录数"></el-table-column>
      <el-table-column :show-overflow-tooltip="true"
                       prop="currentTime"
                       label="创建时间"></el-table-column>
      <el-table-column :show-overflow-tooltip="true"
                       prop="updateTime"
                       label="更新时间"></el-table-column>
    </el-table>
    <el-pagination class="fr pt-10 pb-10"
                   background
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
                   :page-size="pageFilters.pageSize"
                   :page-sizes="pageSizes"
                   :current-page.sync="pageFilters.pageNo"
                   layout="total, prev, pager, next"
                   :total="total"></el-pagination>
  </section>
</template>

<script>
import pager from '@/mixins/pager'
export default {
  name: 'PhysicsZone',
  mixins: [pager],
  data () {
    return {
      tableData: []
    }
  }
}
</script>
