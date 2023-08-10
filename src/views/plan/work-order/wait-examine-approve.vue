<template>
  <div class="wait-examine-approve height-100per flex-column">
    <div class="wait-examine-approve-content">
      <div class="table-wrapper">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="工单编号" sortable width="120">
          </el-table-column>
          <el-table-column prop="name" label="工单类型"> </el-table-column>
          <el-table-column prop="province" label="工单操作对象">
          </el-table-column>
          <el-table-column prop="city" label="对象配置模式"> </el-table-column>
          <el-table-column prop="address" label="工单状态"> </el-table-column>
          <el-table-column prop="zip" label="工单信息"> </el-table-column>
          <el-table-column prop="zip2" label="创建时间" sortable>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row)"
                type="text"
                size="small"
                >查看DDL</el-button
              >
              <el-button type="text" size="small">更多</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import pager from '@/mixins/pager'

export default {
  name: 'waitExamineApprove',
  mixins: [pager],
  components: {},
  data() {
    return {
      tableData: [
        {
          date: '0001',
          name: '类型一',
          province: '对象一',
          city: '模式一',
          address: '已提交',
          zip: '信息一',
          zip2: '2022-01-01',
        },
        {
          date: '0002',
          name: '类型二',
          province: '对象二',
          city: '模式二',
          address: '已提交',
          zip: '信息二',
          zip2: '2022-01-02',
        },
        {
          date: '0003',
          name: '类型三',
          province: '对象三',
          city: '模式三',
          address: '已提交',
          zip: '信息三',
          zip2: '2022-01-03',
        },
        {
          date: '0004',
          name: '类型四',
          province: '对象四',
          city: '模式四',
          address: '已提交',
          zip: '信息四',
          zip2: '2022-01-04',
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {},
}
</script>
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  overflow: hidden;
  overflow-y: auto;
  padding-left: 10px;
}
.page-title {
  margin-bottom: 50px;
}
</style>
<style lang="scss">
.wait-examine-approve {
  .wait-examine-approve-content {
  }
}
</style>
