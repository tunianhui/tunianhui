<template>
   <div>
     <el-table
        ref="manualTable"
        :data="tableData"
        class="category-table-list"
        v-loading="!!loading"
      >
        <el-table-column label="名称" width="200px">
          <template slot-scope="scope">
            <TableCell :data="scope.row" icon="icon-shougongbiaoqian"></TableCell>
          </template>
        </el-table-column>
        <el-table-column
          prop="oper_time"
          label="最近更新时间"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="source_table"
          label="标签来源表"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="auth_status"
          label="公开状态"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{scope.row.auth_status === '1' ? '隐藏' : '公开'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="label_category"
          label="类目"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="100px" align="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              title="编辑"
              class="el-icon-edit-outline font-16"
              @click="manualHandleEdit(scope.row)"
            ></el-button>
            <el-button
              type="text"
              title="删除"
              class="icon el-icon-delete font-16"
              @click="manualDel(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <EditManual :visible="visible" @close="close" :data="curRow" @confirm="confirm"></EditManual>
   </div>
</template>

<script>
import {
  queryManualList,
  delManual
} from '@/api/rd/exreact/tag-center'
import TableCell from './table-cell'
import EditManual from './edit-manual'
import { mapGetters } from 'vuex'
export default {
  name: 'ManualTable',
  props: {
    id: [String, Number],
    filterData: Object
  },
  components: {
    TableCell,
    EditManual
  },
  data() {
    return {
      tableData: [],
      loading: 0,
      visible: false,
      curRow: {}
    }
  },
  watch: {
    filterData: {
      deep: true,
      handler(val) {
        this._queryManualList()
      }
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  created() {
    this.$root.eventEmitter.on('queryManualList', type => {
      this._queryManualList()
    })
  },
  beforeRouteLeave(to, from, next) {
    // 销毁监听的事件
    this.$root.eventEmitter.off('queryManualList')
    next()
  },
  mounted() {
    this._queryManualList()
  },
  methods: {
    async _queryManualList() {
      const {curManualFilter, manualKeyword} = this.filterData
      this.loading++
      const res = await this.$simpleAsyncTo(queryManualList({sum_id: this.id, project_id: this.project.project_id}), '获取失败')
      if (res) {
        this.tableData = res.data.filter(item => {
          return item.label_name.toLowerCase().indexOf(manualKeyword.toLowerCase()) > -1 ||
            item.label_id.toLowerCase().indexOf(manualKeyword.toLowerCase()) > -1
        })
        curManualFilter.forEach(item => {
          switch (item.module) {
            case '类目':
              this.tableData = this.tableData.filter(val => {
                return val.label_category === item.value
              })
              break
          }
        })
        this.tableData = this.tableData.map(item => {
          return {
            name: item.label_name,
            code: item.label_id,
            ...item,
            id: item.label_id
          }
        })
        this.$emit('getManualLength', this.tableData.length)
      }
      this.loading--
    },
    manualHandleEdit(row) {
      this.visible = true
      this.curRow = row
    },
    manualDel(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$simpleAsyncTo(delManual(
          {
            project_id: this.project.project_id,
            label_id: row.label_id,
            sum_id: this.id
          }
        ), '删除失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._queryManualList()
          this.$emit('getManualLength', this.tableData.length)
        }
      })
    },
    close() {
      this.visible = false
    },
    confirm() {
      this._queryManualList()
    }
  }
}
</script>
