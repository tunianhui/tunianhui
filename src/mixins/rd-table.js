import { loop } from '@/libs/util'
import { on, off } from '@/libs/dom'
import { types, iconMap, treeTypes } from '@/config/rd-config'
import { getTreeData } from '@/api/rd/dev'
import { mapMutations } from 'vuex'

export default {
  inject: ['tabStore', 'attrStore'],
  props: {
    module: String,
    params: Object
  },
  data() {
    return {
      keyword: '',
      tableData: [],
      loading: 0,
      delTableColFetch: loop,
      queryFetch: getTreeData,
      offLineFetch: loop,
      gap: 130,
      tableHeight: 500,
      types
    }
  },
  computed: {
    objectTableType() {
      return this.$store.getters[`${this.module}/active`]
    }
  },
  mounted() {
    this.resize()
    this.getTreeData()
    on(window, 'resize', this.resize)
    this.$root.eventEmitter.on('refresh', this.getTreeData)
  },
  beforeDestroy() {
    off(window, 'resize', this.resize)
    this.$root.eventEmitter.off('refresh', this.getTreeData)
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    async resize() {
      await this.$nextTick()
      const parent = this.$parent.$el.clientHeight
      this.tableHeight = parent - this.gap
    },
    filterData(keys) {
      const reg = new RegExp(this.keyword, 'i'),
        test = obj => keys.some(k => reg.test(obj[k]))
      return this.tableData.filter(item => test(item))
    },
    getCellContentData(row, visibleSql = false) {
      return {
        ...iconMap[this.objectTableType],
        ...row,
        visibleSql,
        name: this.$highlightKeyword(row.name, this.keyword),
        code: this.$highlightKeyword(row.code, this.keyword)
      }
    },
    async getTreeData() {
      const {
        business_field_name,
        business_field_id,
        project_name,
        project_id
      } = this.project
      const params = {
        business_field_name,
        business_field_id,
        project_name,
        project_id,
        type: treeTypes[this.objectTableType]
      }
      this.loading++
      const res = await this.$simpleAsyncTo(
        this.queryFetch(params),
        '获取列表数据失败'
      )
      if (res) {
        this.tableData = []
        res.data.forEach(item => {
          item.children.forEach(item => {
            if (params.type !== 14) {
              item.id += ''
            }
            this.tableData.push(item)
          })
        })
        this.resize()
      }
      this.loading--
    },
    delTableCol(row) {
      this.$confirm('请确认是否删除此文件吗？', '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const params = {
            id: row.id
          }
          this.loading++
          const res = await this.$simpleAsyncTo(
            this.delTableColFetch(params),
            '删除失败'
          )
          if (res) {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            // this.tableData.splice(index, 1)
            this.$root.eventEmitter.emit('refresh')
          }

          this.loading--
        })
        .catch(_ => {
          this.loading--
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    },
    // 刷新当前列表
    handleRefresh() {
      this.getTreeData()
    },
    // 下线
    handleOffLine(row) {
      this.$confirm('请确认是否下线？', '下线', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$simpleAsyncTo(
            this.offLineFetch({ id: row.id }),
            '下线失败'
          )
          if (res) {
            this.$message({
              type: 'success',
              message: '下线成功！'
            })
            this.getTreeData()
          }
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '取消下线！'
          })
        })
    }
  }
}
