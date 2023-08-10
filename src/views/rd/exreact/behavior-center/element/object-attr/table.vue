<template>
  <section class="pr-15 pb-10 pl-10" v-loading="!!loading">
    <div class="subtitle mb-20">
      <span>对象属性列表</span>
      <div class="fr my-btn">
        <el-input
          style="width:200px;"
          v-model="keyword"
          placeholder="请输入关键字"
          prefix-icon="el-icon-search"
        ></el-input>
        <el-button
          icon="el-icon-plus"
          type="primary"
          plain
          v-popover:create-popper
          @click="add()"
        >
          新建对象属性
        </el-button>
        <el-button
          icon="el-icon-refresh"
          type="primary"
          plain
          @click="handleRefresh"
        ></el-button>
      </div>
    </div>
    <el-table
      :data="filterData(['name', 'code'])"
      class="object-table-list"
      :max-height="tableHeight"
    >
      <el-table-column label="对象属性" width="240">
        <template #default="scope">
          <CellContent
            @click="showAttr"
            :data="getCellContentData(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="描述"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="170">
        <template slot-scope="scope">
          <el-button
            type="text"
            title="编辑"
            class="el-icon-edit-outline font-16 mr-10"
            @click="handleEdit(scope.row)"
          ></el-button>
          <el-button type="text" class="font-16 el-icon-delete" @click="remove(scope.row)"> </el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
// import {types} from '@/config/rd-config'
import rdTableMixin from '@/mixins/rd-table'
import {mapGetters} from 'vuex'
import {getListAll, del} from '@/api/rd/exreact/object-attr'
import {treeTypes} from '@/config/rd-config'

export default {
  name: 'ObjectTable',
  mixins: [rdTableMixin],
  data() {
    return {
      visibleCreatePopper: false,
      tableData: []
    }
  },
  inject: ['tabStore'],
  computed: {
    ...mapGetters(['project'])
  },
  methods: {
    async getTreeData() {
      const params = {
        type: treeTypes[this.objectTableType]
      }
      this.loading++
      const res = await this.$simpleAsyncTo(
        getListAll(params),
        '获取列表数据失败'
      )
      if (res) {
        this.tableData = []
        res.data.forEach(item => {
          item.code = item.objectAttrCode
          item.name = item.objectAttrName
          this.tableData.push(item)
        })
        this.resize()
      }
      this.loading--
    },
    showAttr(data) {
      const attr = {
        title: '对象属性',
        attrType: this.types.OBJECTATTR,
        name: data.id + '',
        label: data.code,
        data
      }
      this.attrStore.commit('add', attr)
      this.attrStore.commit('setActiveToFirst', attr)
    },
    async remove(row) {
      // this.loading++
      // const res = await this.$simpleAsyncTo(del({id: row.id}), '删除失败')
      // if (res) {
      //   this.$message({
      //     message: '删除成功',
      //     type: 'success'
      //   })
      //   this.$root.eventEmitter.emit('refresh')
      // }
      // this.loading--
      this.setActiveRdEditDialog({
        title: '删除对象属性',
        component: `DelDialog`,
        data: {...this.project, ...row, isDel: false, fn: del}
      })
    },
    add() {
      this.setActiveRdEditDialog({
        title: '新建对象属性',
        component: `ObjectAttrEdit`,
        data: {...this.project}
      })
    },
    handleRefresh() {
      this.getTreeData()
    },
    handleEdit(row) {
      this.setActiveRdEditDialog({
        title: '编辑对象属性',
        component: `ObjectAttrEdit`,
        data: {...this.project, ...row}
      })
    },
    closeModal() {
      this.editdialog = false
    }
  }
}
</script>
