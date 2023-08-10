<!--
 * @Author: 大炸鹅
 * @Date: 2023-02-17 16:09:35
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-13 15:29:24
 * @FilePath: \数据智能构建\src\views\asset\list\dataTableDetail\affect-table.vue
-->
<template>
  <section class="affect-table animated fadeInRight">
    <el-table
      :data="tableData"
      :max-height="tableHeight"
      style="width: 100%"
      class="b-r animated fadeInRight"
    >
      <el-table-column show-overflow-tooltip label="影响表名称" prop="cube_code"></el-table-column>
      <el-table-column show-overflow-tooltip label="影响表层级" prop="effect_level"></el-table-column>
      <el-table-column show-overflow-tooltip label="所属项目" prop="project_name"></el-table-column>
      <el-table-column show-overflow-tooltip label="所属业务板块" prop="business_field_name"></el-table-column>
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
import { queryTableEffectList } from '@/api/asset/map'
export default {
  name: 'AffectTable',
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
        this._queryTableEffectList()
      },
      immediate: true
    }
  },
  created() {
    
  },
  methods: {
    async _queryTableEffectList() {
      const params = {
        cube_id: this.tableInfo.cube_id,
        show_direct_down: this.checked,
        source_type: this.tableInfo.source_type,
        project_code: this.tableInfo.project_code,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      const res = await this.$simpleAsyncTo(queryTableEffectList(params), '获取数据失败')
      if (res) {
        this.tableData = res.data.table_effect_data
        this.total = res.data.total_records
      }
    },
    currentPageChange(page) {
      this.pageNo = page
      this._queryTableEffectList()
    }
  }
}
</script>

<style lang="scss" scoped>
.affect-table {
  
}
</style>

