<template>
  <section class="custom-index-table">
    <el-table :data="visibleTableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column label="英文名" prop="name"></el-table-column>
      <el-table-column label="原始英文名" prop="initial_name"></el-table-column>
      <el-table-column label="指标描述" show-overflow-tooltip prop="desc"></el-table-column>
      <el-table-column label="数据类型" prop="data_type"></el-table-column>
      <el-table-column label="操作" width="125px">
        <template #default="scope">
          <!-- <el-button class="font-12 mr-10" type="text" @click="handleEdit(scope.row)">编辑</el-button> -->
          <el-button class="font-12" type="text" @click="handleDetail(scope.row)">详情</el-button>
          <el-button class="font-12 mr-10" type="text" @click="handleCart(scope.row)">分类</el-button>
          <SimpleConfirm @confirm="handleDelete(scope.row)">
            <el-button type="text">删除</el-button>
          </SimpleConfirm>
        </template>
      </el-table-column>
    </el-table>
    <CustomIndexCreate :visible.sync="visibleCustomIndex" :data="customIndexData" />
  </section>
</template>

<script>
import CustomIndexCreate from './custom-index-create'
import mixin from './mixin'
export default {
  name: 'CustomIndexTable',
  mixins: [mixin],
  components: {
    CustomIndexCreate
  },
  data() {
    return {
      tableData: [{}],
      visibleCustomIndex: false,
      customIndexData: {}
    }
  },
  methods: {
    create() {
      this.visibleCustomIndex = true
    },
    batchRemove() {
      this.selectedData.forEach(s => {
        const index = this.tableData.find(t => t.id === s.id)
        index > -1 && this.tableData.splice(index, 1)
      })
      this.selectedData = []
    },
    handleEdit(row) {},
    handleDetail(row) {},
    handleCart(row) {}
  }
}
</script>

<style lang="scss">
</style>
