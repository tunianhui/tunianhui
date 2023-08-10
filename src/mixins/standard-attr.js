import '@/assets/css/attr.scss'
import {getAttrData} from '@/api/asset/standard/category.js'
import {mapMutations} from 'vuex'
import OverflowTooltip from '@c/overflow-tooltip'
import {types} from '@/config/asset-config'
export default {
  inject: ['tabStore', 'attrStore'],
  props: {
    data: Object
  },
  components: {
    OverflowTooltip
  },
  data() {
    return {
      viewInfo: {},
      types
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        this.getAttrDataInfo()
      }
    }
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    async getAttrDataInfo() {
      this.loading++
      const res = await this.$simpleAsyncTo(
        getAttrData({}),
        '查询数据失败'
      )
      if (res) {
        this.viewInfo = res.data
      }
      this.loading--
    },
    handleEdit(text) {},
    // 删除
    handleDelete() {
      // this.$confirm('请确认是否删除？', '删除', {
      //   comfirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(async () => {
      //     this.$root.eventEmitter.emit('refresh')
      //   })
      //   .catch(_ => {
      //     this.$message({
      //       type: 'info',
      //       message: '取消删除！'
      //     })
      //   })
      this.$confirm('请确认是否删除此文件吗？', '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$simpleAsyncTo(this.delFetch({[this.paramsKey]: this.data.data.id}))
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.attrStore.commit('remove', this.attrStore.states.activeValue)
            this.attrStore.commit('setActive', null)
            this.$root.eventEmitter.emit('refresh')
          }
        })
        .catch(async _ => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    }
  }
}
