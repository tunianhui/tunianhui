<template>
  <section class="full">
    <div v-if="tagFlag.flag==='home'" class="pl-20 pr-20">
      <div class="mb-10 clearfix">
        <span>标签类目列表</span>
        <div class="fr my-btn">
          <el-input
            style="width:200px;"
            v-model="keyword"
            placeholder="请输入关键字"
            prefix-icon="el-icon-search"
            @input="inputHanlde"
          ></el-input>
          <el-button
            icon="el-icon-plus"
            type="primary"
            plain
            v-popover:create-popper
            @click="add()"
          >
            新建类目
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
        :data="categoryList"
        class="object-table-list"
        :max-height="tableHeight"
        v-loading="!!loading"
      >
        <el-table-column label="名称" width="250px">
          <template #default="scope">
            <CellContent
              @click="showAttr"
              :data="getCellContentData(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="oper_time"
          label="创建时间"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="oper_user"
          label="创建者"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="subCount"
          label="下属标签数"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="category_desc"
          label="描述"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="170px" align="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              title="编辑"
              class="el-icon-edit-outline font-16"
              @click="handleEdit(scope.row)"
            ></el-button>
            <el-button
              type="text"
              title="删除"
              class="el-icon-delete font-16"
              @click="delHandle(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="tagFlag.flag==='detail'" style="height:100%">
      <CategoryDetail></CategoryDetail>
    </div>
  </section>
</template>

<script>
// import {types} from '@/config/rd-config'
import rdTableMixin from '@/mixins/rd-table'
import CategoryDetail from './detail'
import {mapGetters, mapMutations} from 'vuex'
import {
  // queryCategory,
  getTabCategoryList,
  deleteCategory
} from '@/api/rd/exreact/tag-center'
export default {
  name: 'AtomObjectTable',
  mixins: [rdTableMixin],
  components: {
    CategoryDetail
  },
  data() {
    return {
      visibleCreatePopper: false,
      categoryList: []
    }
  },
  inject: ['tabStore'],
  computed: {
    ...mapGetters(['project', 'tagFlag'])
  },
  created() {
    // this._queryCategory()
  },
  methods: {
    ...mapMutations({
      setTagFlag: 'SET_TAGFLAG'
    }),
    // async _queryCategory() {
    //   this.loading++
    //   const params = {
    //     project_code: this.project.project_code
    //   }
    //   const res = await this.$simpleAsyncTo(queryCategory(params), '获取失败')
    //   if (res) {
    //     this.categoryList = res.data
    //     this.categoryList = this.categoryList.filter(item => {
    //       item.name = item.category_name
    //       item.code = item.category_code
    //       return item.name.toLowerCase().indexOf(this.keyword.toLowerCase()) > -1 ||
    //         item.code.toLowerCase().indexOf(this.keyword.toLowerCase()) > -1
    //     })
    //   }
    //   this.loading--
    // },
    async getTreeData() {
      this.loading++
      const params = {
        project_code: this.project.project_code
      }
      const res = await this.$simpleAsyncTo(getTabCategoryList(params), '获取失败')
      if (res) {
        this.categoryList = this.flat(res.data.child)
        this.categoryList = this.categoryList.filter(item => {
          if (item) {
            item.child = item.child.filter(i => i.name === '手工标签' || i.name === '工厂标签')
            item.subCount = 0
            item.child.forEach(e => {
              item.subCount += e.child.length
            })
            return item
          }
        })
        this.categoryList = this.categoryList.filter(item => {
          return item.name.toLowerCase().indexOf(this.keyword.toLowerCase()) > -1 ||
            item.code.toLowerCase().indexOf(this.keyword.toLowerCase()) > -1
        })
      }
      this.loading--
    },
    // recursionTreeData(nodes, arr = []) {
    //   for (let item of nodes) {
    //     if (item.name === '工厂标签' || item.name === '手工标签') continue
    //     let obj = {...item, child: []}
    //     arr.push(obj)
    //     if (item.child && item.child.length) this.recursionTreeData(item.child, obj.child)
    //   }
    //   return arr
    // },
    flat(arr) {
      return [].concat(...arr.map(item => item.name !== '工厂标签' && item.name !== '手工标签' && [].concat(item, ...this.flat(item.child))))
    },
    showAttr(data) {
      // data.factoryList.forEach(item => {
      //   item.category_name = data.name
      // })
      // data.manaulList.forEach(item => {
      //   item.category_name = data.name
      // })
      this.setTagFlag({flag: 'detail', ...data})
    },
    add() {
      this.setActiveRdEditDialog({
        title: '新建标签类目',
        component: `CategoryEdit`,
        data: {...this.project}
      })
    },
    handleRefresh() {},
    handleEdit(row) {
      this.setActiveRdEditDialog({
        title: '编辑标签类目',
        component: `CategoryEdit`,
        data: {...this.project, ...row}
      })
    },
    delHandle(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {id} = row
        const res = await this.$simpleAsyncTo(deleteCategory({id}), '删除失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$root.eventEmitter.emit('refresh')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    closeModal() {
      this.editdialog = false
    },
    inputHanlde(val) {
      this.getTreeData()
    }
  }
}
</script>
