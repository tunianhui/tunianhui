<template>
  <el-table
      :data="tableData"
      class="object-table-list"
      v-loading="!!loading"
    >
      <el-table-column label="名称">
        <template slot-scope="scope">
          <TableCell :data="scope.row" icon="icon-gongchangbiaoqian1"></TableCell>
        </template>
      </el-table-column>
      <el-table-column
        prop="oper_user"
        label="开发状态"
        show-overflow-tooltip
        v-if="checkField.includes('开发状态')"
      >
        <template slot-scope="scope">
          <div style="display:flex;align-items:center">
            <i class="el-icon-success font-16" style="color: #67C23A" v-if="scope.row.status==='6'"></i>
            <i class="iconfont icon-kaifazhong" style="color: #EABA19;vertical-align: bottom;font-size:18px" v-if="scope.row.status==='5'"></i>
            <i class="iconfont icon-code font-16" style="color: #A186FF;vertical-align: bottom" v-if="scope.row.status==='7'"></i>
            <span>{{getDicsValue('status_tag', scope.row.status)}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="label_category"
        label="类目"
        show-overflow-tooltip
        v-if="checkField.includes('类目')"
      >
        <!-- <template slot-scope="scope"></template> -->
      </el-table-column>
      <el-table-column
        label="测试运行状态"
        show-overflow-tooltip
        prop="run_status"
        v-if="checkField.includes('测试运行状态')"
      >
      </el-table-column>
      <el-table-column
        prop="oper_time"
        label="更新时间"
        show-overflow-tooltip
        v-if="checkField.includes('更新时间')"
      ></el-table-column>
      <el-table-column
        prop="repair_status"
        label="最近补数据"
        show-overflow-tooltip
        v-if="checkField.includes('最近补数据')"
      >
      <template slot-scope="scope">
        <div style="display:flex;align-items:center">
          <i class="el-icon-success font-16 mr-5" style="color: #67C23A" v-if="scope.row.repair_status==='成功'"></i>
          <span v-if="scope.row.repair_status === '成功'" class="mr-5">成功</span>
          <span v-if="scope.row.repair_status === '未执行'" class="mr-5">未补数据</span>
          <el-popover
            v-if="scope.row.repair_status==='成功'"
            placement="right"
            width="680"
            trigger="click">
            <div>补数据记录</div>
            <el-table :data="gridData">
              <el-table-column property="date" label="操作时间"></el-table-column>
              <el-table-column property="name" label="操作人"></el-table-column>
              <el-table-column property="address" label="补数据结束日期"></el-table-column>
              <el-table-column width="80" property="address" label="结果"></el-table-column>
            </el-table>
            <i class="el-icon-document-add font-14" slot="reference"></i>
          </el-popover>
        </div>
      </template>
      </el-table-column>
      <el-table-column
        prop="auth_status"
        label="公开状态"
        show-overflow-tooltip
        v-if="checkField.includes('公开状态')"
      >
        <template slot-scope="scope">
          {{scope.row.auth_status === '1' ? '隐藏' : '公开'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="label_table"
        label="标签结果表"
        show-overflow-tooltip
        v-if="checkField.includes('标签结果表')"
      >
      </el-table-column>
      <el-table-column
        prop="label_id"
        label="标签ID"
        show-overflow-tooltip
        v-if="checkField.includes('标签ID')"
      >
      </el-table-column>
      <el-table-column label="操作" width="200px" align="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            title="编辑"
            class="el-icon-edit-outline font-16"
            @click="handleEdit(scope.row)"
          ></el-button>
          <el-button
            type="text"
            title="补数据"
            class="iconfont icon-bushuju font-16"
            @click="addData(scope.row)"
          ></el-button>
          <el-button
            type="text"
            title="标签任务"
            class="iconfont icon-biaodanliebiao font-16"
          ></el-button>
          <el-popover
            popper-class="more-popover"
            placement="bottom"
            trigger="hover">
            <ul class="popper-list">
                <li>
                  <el-button
                    type="text"
                    icon="iconfont icon-biaodanliebiao"
                    @click.stop="seeReport(scope.row)"
                    >标签报告</el-button
                  >
                </li>
                <!-- <li>
                  <el-button
                    type="text"
                    icon="icon el-icon-copy-document"
                    @click="copyhandle(scope.row)"
                    >克隆</el-button
                  >
                </li> -->
                <li>
                  <el-button @click="offline(scope.row)" type="text" icon="iconfont icon-xiaxian"
                    >下线</el-button
                  >
                </li>
                <li>
                  <el-button @click="offlineAndDel(scope.row)" type="text" icon="el-icon-delete"
                    >下线并删除</el-button
                  >
                </li>
              </ul>
            <el-button slot="reference" class="iconfont icon-gengduo font-16" type="text" style="margin-left:2px"></el-button>
          </el-popover>
        </template>
      </el-table-column>
  </el-table>
</template>

<script>
import {
  queryFactoryList,
  offLine,
  deleteTag
} from '@/api/rd/exreact/tag-center'
import TableCell from './table-cell'
import {types} from '@/config/rd-config'
import {mapMutations, mapGetters} from 'vuex'
export default {
  name: 'FactoryTable',
  inject: ['tabStore', 'attrStore'],
  props: {
    id: [String, Number],
    checkField: {
      type: Array,
      default: () => []
    },
    filterData: Object
  },
  components: {
    TableCell
  },
  computed: {
    ...mapGetters(['project'])
  },
  data() {
    return {
      tableData: [],
      loading: 0,
      gridData: [],
      showField: []
    }
  },
  watch: {
    filterData: {
      deep: true,
      handler(val) {
        this._queryFactoryList()
      }
    }
  },
  mounted() {
    this._queryFactoryList()
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    async _queryFactoryList() {
      const {curFactoryFilter, factoryKeyword} = this.filterData
      this.loading++
      const res = await this.$simpleAsyncTo(queryFactoryList({sumId: this.id || ''}), '获取失败')
      if (res) {
        this.tableData = res.data.filter(item => {
          return item.label_name.toLowerCase().indexOf(factoryKeyword.toLowerCase()) > -1 ||
            item.label_code.toLowerCase().indexOf(factoryKeyword.toLowerCase()) > -1
        })
        curFactoryFilter.forEach(item => {
          switch (item.module) {
            case '类目':
              this.tableData = this.tableData.filter(val => {
                return val.label_category === item.value
              })
              break
            case '开发状态':
              this.tableData = this.tableData.filter(val => {
                return val.status === item.value
              })
              break
            case '测试运行状态':
              this.tableData = this.tableData.filter(val => {
                return val.run_status === item.value
              })
              break
            case '最近补数据状态':
              this.tableData = this.tableData.filter(val => {
                return val.repair_status === item.value
              })
              break
          }
        })
        this.tableData = this.tableData.map(item => {
          return {
            name: item.label_name,
            code: item.label_code,
            ...item,
            id: item.label_id
          }
        })
        this.$emit('getFactoryLength', this.tableData.length)
      }
      this.loading--
    },
    showAttr(row) {},
    handleEdit(row) {
      const attr = {
        label: `编辑标签：${row.name}`,
        tabType: types.FACTORY,
        name: row.id + '编辑',
        data: row,
        component: 'TagConfig'
      }
      this.tabStore.commit('add', attr)
    },
    seeReport(row) {
      const attr = {
        title: '标签报告',
        attrType: 'report',
        name: row.id + 'report',
        label: '标签报告',
        data: row,
        width: '700px'
      }
      this.attrStore.commit('add', attr)
    },
    copyhandle(row) {
      const attr = {
        label: `克隆标签: ${row.name}`,
        tabType: 'regular',
        name: row.id + '克隆',
        data: row,
        component: 'TagConfig'
      }
      this.tabStore.commit('add', attr)
    },
    addData(data) {
      this.setActiveRdEditDialog({
        title: '标签补数据',
        component: `TagAddData`,
        data: {...this.project}
      })
    },
    offline(row) {
      this.$confirm('此操作将下线该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$simpleAsyncTo(offLine({id: row.id}), '下线失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '下线成功!'
          })
          this._queryFactoryList()
          this.$root.eventEmitter.emit('refresh')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下线'
        })
      })
    },
    offlineAndDel(row) {
      this.$confirm('此操作将下线并删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$simpleAsyncTo(deleteTag({id: row.id}), '下线并删除失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '下线并删除成功!'
          })
          this._queryFactoryList()
          this.$root.eventEmitter.emit('refresh')
          this.$emit('getFactoryLength', this.tableData.length)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  }
}
</script>
