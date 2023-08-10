<!--
 * @Author: 大炸鹅
 * @Date: 2023-02-17 16:20:05
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-13 15:30:07
 * @FilePath: \数据智能构建\src\views\asset\list\dataTableDetail\affect-sync-table.vue
-->
<template>
  <section class="affect-sync-table animated fadeInRight">
    <el-table
      :data="tableData"
      :max-height="tableHeight"
      style="width: 100%"
      class="b-r animated fadeInRight"
    >
      <el-table-column show-overflow-tooltip label="影响表名称" prop="cube_code"></el-table-column>
      <el-table-column show-overflow-tooltip label="影响表层级" prop="effect_level"></el-table-column>
      <el-table-column show-overflow-tooltip label="影响集成任务" prop="effect_task"></el-table-column>
      <el-table-column show-overflow-tooltip label="影响的目标表" prop="dest_cube_code"></el-table-column>
      <el-table-column show-overflow-tooltip label="目标的数据源/项目" prop="dest_ds_project"></el-table-column>
      <el-table-column show-overflow-tooltip label="创建人" prop="create_user"></el-table-column>
    </el-table>
    <div style="height: 40px; line-height: 40px; margin-top: 10px; text-align: end;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="pageNo"
        :page-size="pageSize"
        @current-change="currentPageChange"
      >
      </el-pagination>
    </div>
  </section>
</template>

<script>
import { queryCorpusSyncEffectList } from '@/api/asset/map'
export default {
  name: 'AffectSyncTable',
  props: {
    widthHeightData: Object,
    tableInfo: Object,
    checked: Number
  },
  data() {
    return {
      tableData: [],
      tableHeight: 0,
      total: 0,
      pageNo: 1,
      pageSize: 10
    }
  },
  watch: {
    widthHeightData: {
      handler(val) {
        this.$nextTick(_ => {
          this.tableHeight = parseInt(val.height) - 80 - 50
        })
      },
      immediate: true
    },
    checked: {
      handler(val) {
        this._queryCorpusSyncEffectList()
      },
      immediate: true
    }
  },
  methods: {
    async _queryCorpusSyncEffectList() {
      const params = {
        cube_id: this.tableInfo.cube_id,
        show_direct_down: this.checked,
        source_type: this.tableInfo.source_type,
        project_code: this.tableInfo.project_code,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      const res = await this.$simpleAsyncTo(queryCorpusSyncEffectList(params), '获取数据失败')
      if (res) {
        this.tableData = res.data.table_effect_data
        this.total = res.data.total_records
      }
    },
    currentPageChange(page) {
      this.pageNo = page
      this._queryCorpusSyncEffectList()
    }
  }
}
</script>

<style lang="scss" scoped>
.affect-table {
  
}
</style>