<template>
  <section class="derive-index-table">
    <el-table :data="visibleTableData" @selection-change="handleSelectionChange" v-loading="!!loading">
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column label="派生指标">
        <template #default="scope">
          <div class="cell-field" @click.stop="handleDetail(scope.row)">
            <div>
              <i class="iconfont icon-shezhi3"></i>
            </div>
            <div>
              <p v-html="$highlightKeyword(scope.row.derivative_code, keyword)"></p>
              <p class="grey" v-html="$highlightKeyword(scope.row.derivative_name, keyword)"></p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="原子指标" show-overflow-tooltip prop="atomic_name"></el-table-column>
      <el-table-column label="统计粒度" show-overflow-tooltip prop="dim_name"></el-table-column>
      <el-table-column label="统计周期" show-overflow-tooltip prop="cycle_name"></el-table-column>
      <el-table-column label="发布状态" show-overflow-tooltip>
        <template #default="scope">
          <Status :state="scope.row.status"></Status>
        </template>
      </el-table-column>
      <el-table-column label="最近更新人" show-overflow-tooltip prop="oper_user"></el-table-column>
      <el-table-column label="操作" width="165px">
        <template #default="scope">
          <el-button class="font-12" type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <!-- <el-button class="font-12" type="text" @click.stop="handleDetail(scope.row)">详情</el-button> -->
          <el-button class="font-12 mr-10" type="text" @click="handleCart(scope.row)">分类</el-button>
          <SimpleConfirm @confirm="handleDelete(scope.$index, scope.row)">
            <el-button type="text">删除</el-button>
          </SimpleConfirm>
        </template>
      </el-table-column>
    </el-table>
    <CateDialog :visible.sync="visibleCateDialog" :data="cateData" @confirm="saveCate"></CateDialog>
  </section>
</template>

<script>
import CateDialog from './cate-dialog'
import {types} from '@/config/rd-config'
import {queryById, delBatchDeriveIndex} from '@/api/rd/polymer-table'
import {del} from '@/api/rd/derive'
import mixin from './mixin'
import {mapMutations} from 'vuex'

export default {
  name: 'DeriveIndexTable',
  mixins: [mixin],
  components: {
    CateDialog
  },
  props: {
    data: Object
  },
  inject: ['attrStore'],
  data() {
    return {
      tableData: [{}],
      visibleCustomIndex: false,
      rules: {
        code: {required: true, message: '请输入派生指标英文名'},
        name: {required: true, message: '请输入派生指标名称'}
      },
      visibleCateDialog: false,
      editData: {},
      cateData: {},
      loading: 0
    }
  },
  created() {
    this.getData()
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    async getData() {
      this.loading++
      const res = await this.$simpleAsyncTo(
        queryById({id: this.data.id}),
        '获取数据失败'
      )
      if (res) {
        this.tableData = res.data.map(item => ({
          ...item,
          visible: true
        }))
      }
      this.loading--
    },
    filterByKeyword(val) {
      const reg = new RegExp(val, 'i')
      this.tableData.forEach(item => {
        const {derivative_name, derivative_code} = item
        item.visible = reg.test(derivative_name) || reg.test(derivative_code)
      })
    },
    handleEdit(row) {
      this.setActiveRdEditDialog({
        title: '编辑派生指标',
        component: 'DeriveEditDialog',
        data: {...row, name: row.derivative_name, code: row.derivative_code}
      })
    },
    handleDetail(row) {
      const attr = {
        title: '派生指标',
        attrType: types.DERIVE,
        name: row.derivative_code,
        label: row.derivative_code + row.id,
        data: {
          // id: row.element_id,
          ...row,
          name: row.derivative_name,
          code: row.derivative_code
        }
      }
      this.attrStore.commit('add', attr)
      this.attrStore.commit('setActiveToFirst', attr)
    },
    async handleDelete(index, row) {
      this.loading++
      const res = await this.$simpleAsyncTo(del({id: row.id}), '删除失败')
      if (res) {
        this.$message({
          showClose: true,
          type: 'success',
          message: '删除成功'
        })
        this.getData()
      }
      this.loading--
      // const i = this.selectedData.findIndex(item => item.id === row.id)
      // this.tableData.splice(index, 1)
      // i > -1 && this.selectedData.splice(i, 1)
    },
    async batchRemove() {
      const ids = this.selectedData.map(item => item.id).join('&')
      this.loading++
      const res = await this.$simpleAsyncTo(
        delBatchDeriveIndex({ids}),
        '批量删除失败'
      )
      if (res) {
        this.$message({
          showClose: true,
          type: 'success',
          message: '批量删除成功'
        })
        this.getData()
      }
      this.loading--
      // this.selectedData.forEach(s => {
      //   const index = this.tableData.findIndex(t => t.id === s.id)
      //   index > -1 && this.tableData.splice(index, 1)
      // })
      // this.selectedData = []
    },
    handleCart(row) {
      this.cateData = {...row}
      this.visibleCateDialog = true
    },
    publish() {},
    saveCate(data) {}
  }
}
</script>

<style lang="scss">
.derive-index-table {
  .el-table {
    .cell-field {
      display: flex;
      align-items: center;
      cursor: pointer;

      .iconfont {
        font-size: 32px;
        margin-right: 10px;
        color: lighten($--color-primary, 15%);
      }
      p {
        color: $grey2;

        &.grey {
          color: $grey4;
        }
      }
    }
  }
}
</style>
