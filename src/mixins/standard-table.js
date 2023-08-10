import Head from '@c/head.vue'
import {types} from '@/config/asset-config'
import TableCell from '@c/table-cell'
import FilterFieldCard from '@c/filter-card'
import {mapMutations} from 'vuex'
import {
  getListBusiness
} from '@/api/plan/project-manage'

export default {
  components: {
    Head,
    TableCell,
    FilterFieldCard
  },
  inject: ['tabStore', 'attrStore'],
  data() {
    return {
      types,
      loading: 0,
      addVisible: false,
      businessList: [],
      factoryFilterData: [],
      tableData: [],
      allChecked: false,
      curLength: 0,
      disabled: false,
      curSelectData: [],
      visible: false,
      fileList: [],
      curFilter: [],
      keyword: '',
      brnLoading: false
    }
  },
  computed: {
    isAll() {
      return this.curSelectData.length === this.tableData.length && this.curSelectData.length !== 0
    }
  },
  watch: {
    isAll: {
      handler(val) {
        this.allChecked = val
      }
    }
  },
  created() {
    // this.getTreeData()
    // 新建/修改刷新树 在组件中调用 this.$root.eventEmitter.emit('refresh')
    // this.$root.eventEmitter.on('refreshTable', type => {
    //   this.refeshHandle()
    // })
  },
  // beforeRouteLeave(to, from, next) {
  //   // 销毁监听的事件
  //   this.$root.eventEmitter.off('refreshTable')
  //   next()
  // },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    refeshHandle() {
      this.getTableList()
      this.$refs.filterFieldCard.clear()
      this.curFilter = []
      this.keyword = ''
    },
    // 获取业务板块列表
    async _getListBusiness() {
      const res = await this.$simpleAsyncTo(getListBusiness(), '获取业务板块列表失败')
      if (res) {
        if (res.data && res.data.length) {
          this.businessList = res.data.map(item => {
            return {
              id: item.busin_id,
              label: item.busin_name
            }
          })
        }
      }
    },
    manualHandleSelectionChange(val) {
      this.curSelectData = val
    },
    getCellContentData(row, visibleSql = false) {
      // return {
      //   ...iconMap[this.objectTableType],
      //   ...row,
      //   visibleSql,
      //   name: this.$highlightKeyword(row.name, this.keyword),
      //   code: this.$highlightKeyword(row.code, this.keyword)
      // }
    },
    batchDel() {
      if (!this.curSelectData.length) {
        return this.$message({
          type: 'warning',
          message: '请选择删除项！'
        })
      }
      this.$confirm('请确认是否删除？', '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const params = {
            [this.paramsKey]: JSON.stringify(this.curSelectData.map(item => item[this.paramsKey]))
          }
          const res = await this.$simpleAsyncTo(this.batchDelFetch(params), '删除失败')
          this.$root.eventEmitter.emit('refresh')
          this.getTableList(this.curFilter, this.keyword)
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
          }
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    },
    batchExport(type) {
      if (!this.curSelectData.length) {
        return this.$message({
          type: 'warning',
          message: '请选择导出项！'
        })
      }
      this.$confirm('请确认是否导出？', '导出', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let url = '/standardManagement/exportFile'
          if (type === 'dict') {
            url = '/dataDictionary/exportFile'
          }
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = `${this.baseURL}${url}?${this.paramsKey}=[${this.curSelectData.map(item => item[this.paramsKey])}]`
          link.setAttribute('download', `标准--${new Date().getTime()}`)
          document.body.appendChild(link)
          link.click()
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '取消导出！'
          })
        })
    },
    batchUpdate() {
      this.visible = true
    },
    changeHandle(val) {
      if (val) {
        this.$refs.multipleTable.toggleAllSelection()
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    cancelBtn() {
      this.visible = false
      this.$refs.upload.clearFiles()
    },
    change(file, fileList) {
      this.fileList = fileList
      // this.fileList.push(file)
    },
    confirmBtn() {
      if (this.fileList.length) {
        this.brnLoading = true
        this.$refs.upload.submit()
      } else {
        this.$message({
          type: 'error',
          message: '请添加上传文件'
        })
      }
    },
    delHaandle(row) {
      this.$confirm('请确认是否删除此文件吗？', '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$simpleAsyncTo(this.delFetch({[this.paramsKey]: row[this.paramsKey]}))
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.getTableList(this.curFilter, this.keyword)
            this.$root.eventEmitter.emit('refresh')
          }
        })
        .catch(async _ => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    },
    releaselDel(row) {},
    confirm(curFilter = [], keyword = '') {
      this.curFilter = curFilter
      this.keyword = keyword
      this.getTableList(this.curFilter, this.keyword)
    },
    uploadSuccess (response, file, fileList) {
      if (response.flag) {
        this.$message({
          showClose: true,
          message: '导入成功',
          type: 'success'
        })
        this.refeshHandle()
        this.cancelBtn()
      } else {
        this.cancelBtn()
        const h = this.$createElement
        const infos = []
        response.data.forEach((item, index) => {
          infos.push(h('p', null, `${index + 1}--${item.errorInfos}`))
        })
        this.$msgbox({
          title: '错误信息',
          message: h('div', {style: 'padding-right:10px;overflow:auto;height:500px'}, infos),
          showCancelButton: false,
          showConfirmButton: false
        }).then(action => {
          this.$message({
            type: 'info',
            message: 'action: '
          })
        }).catch(() => {})
      }
      this.brnLoading = false
    },
    uploadError (response, file, fileList) {
      this.$message({
        showClose: true,
        message: '导入失败，请重试！',
        type: 'error'
      })
      this.$refs.upload.clearFiles()
      this.brnLoading = false
    }
  }
}
