import {mapMutations} from 'vuex'
export default {
  inject: ['tabStore'],
  data() {
    return {
      submitFetch: () => {},
      submitParams: {},
      saveFetch: () => {},
      saveParams: {}
    }
  },
  methods: {
    ...mapMutations({
      setActiveTreeId: 'SET_ACTIVE_TREE_ID'
    }),
    // 定位
    handleLocation(treeId, path) {
      this.setActiveTreeId(treeId)
      if (this.$route.name !== this.tabStore.states.active.tabType) {
        this.$router.push({path})
      }
    },
    // 保存
    async handleSave() {
      this.globalLoading()
      const res = await this.$simpleAsyncTo(
        this.saveFetch(this.saveParams),
        '保存失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '保存成功！'
        })
        this.$root.eventEmitter.emit('refresh')
      }
      this.globalLoading().close()
    },
    // 提交
    async handleSubmit() {
      this.$confirm('请确认是否提交？', '提交', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.globalLoading()
          const res = await this.$simpleAsyncTo(
            this.submitFetch(this.submitParams),
            '提交失败'
          )
          if (res) {
            this.$message({
              type: 'success',
              message: '提交成功！'
            })
            this.$root.eventEmitter.emit('refresh')
          }
          this.globalLoading().close()
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '取消提交！'
          })
        })
    }
  }
}
