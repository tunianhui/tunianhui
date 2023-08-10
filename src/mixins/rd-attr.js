import {capitalize, loop} from '@/libs/util'
import {mapMutations} from 'vuex'
import '@/assets/css/attr.scss'

export default {
  inject: ['tabStore', 'editComponentsMap', 'attrStore'],
  props: {
    data: Object
  },
  data() {
    return {
      viewInfo: {},
      delFetch: loop,
      offLineFetch: loop,
      loading: 0
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        this.getData()
      }
    }
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    getData() {},
    handleEdit() {
      const {attrType} = this.data,
        {type, value, label} = this.editComponentsMap[attrType] || {},
        component = `${capitalize(value)}Edit`
      if (type === 'dialog') {
        this.setActiveRdEditDialog({
          title: `编辑${label}`,
          component
        })
      } else {
        this.tabStore.commit('add', {
          ...this.data,
          label: `编辑${label}：` + this.data.label,
          name: '编辑' + this.data.name,
          component,
          tabType: attrType
        })
      }
    },
    // 删除
    handleDelete() {
      this.$confirm('请确认是否删除？', '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$simpleAsyncTo(
            this.delFetch({id: this.data.data.id}),
            '删除失败'
          )
          if (res) {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.attrStore.commit('remove', this.attrStore.states.activeValue)
            this.attrStore.commit('setActive', null)
            this.$root.eventEmitter.emit('refresh')
          }
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    },
    async handleOffLine() {
      this.$confirm('请确认是否下线？', '下线', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const params = {
            id: this.data.data.id
          }
          const res = await this.$simpleAsyncTo(
            this.offLineFetch(params),
            '下线失败'
          )
          if (res) {
            this.$message({
              type: 'success',
              message: '下线成功！'
            })
            this.viewInfo = {...this.viewInfo, status: '1'}
            this.$root.eventEmitter.emit('refresh')
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
