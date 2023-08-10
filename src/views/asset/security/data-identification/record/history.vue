<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-06-29 16:49:54
 * @LastEditTime: 2023-08-03 10:18:34
 * @Description:
-->
<template>
  <section>
    <el-drawer @close="close" title="上传历史" :visible.sync="historyVisible" direction="rtl" size="50%">
      <el-table :data="tableData">
        <el-table-column property="num" label="序号" width="80px" align="center"></el-table-column>
        <el-table-column property="createdBy" label="创建人"></el-table-column>
        <el-table-column property="startDate" label="创建时间"></el-table-column>
        <el-table-column property="endDate" label="结束时间"></el-table-column>
        <el-table-column property="status" label="状态">
          <template slot-scope="{row}">
            <i v-if="row.status === '1'" class="el-icon-success"></i>
            <i v-if="row.status === '0'" class="el-icon-error"></i>
            <span>{{ row.status === '1' ? '上传成功' : '上传失败' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 25, 50, 75, 100]" :page-size="pageFilters.pageSize" :current-page="pageFilters.pageNo" layout="total, prev, pager, next,sizes, jumper" :total="total">
        </el-pagination>
      </div>
    </el-drawer>
  </section>
</template>

<script>
import { getuploadHistory } from '@/api/asset/security.js'
import pager from '@/mixins/pager'
export default {
  name: 'history',
  mixins: [pager],
  data () {
    return {
      historyVisible: true,
      tableData: []
    }
  },
  mounted () {
    this.getuploadHistory()
  },
  methods: {
    getTableList () {
      this.getuploadHistory()
    },
    close () {
      this.historyVisible = false
      this.$emit('closehistory')
    },
    async getuploadHistory () {
      const params = {
        loginUser: '',
        ...this.pageFilters
      }
      const res = await getuploadHistory(params)
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-drawer__header {
  margin-bottom: 22px;
}
.el-drawer__body {
  position: relative;
}
.footer {
  position: absolute;
  display: flex;
  margin-right: 0px;
  margin-bottom: 0px;
  bottom: 0px;
  right: 0px;
}

.icon1 {
  padding: 3px;
  font-size: 12px;
  color: #fff;
  border-radius: 50%;
  background-color: #23be42;
  margin-right: 5px;
}
.icon2 {
  padding: 3px;
  font-size: 12px;
  color: #fff;
  border-radius: 50%;
  background-color: red;
  margin-right: 5px;
}
</style>
