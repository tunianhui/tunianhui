import {
  getLock,
  getUnLock
} from '@/api/asset/security.js'
export default {
  data() {
    return {
      screenRuleIdList: '',
      screenProId: '',
      screenunitIdList: [],
      screenStatusList: [],
      screenlockList: [],
      screenProIdList: [],
      info: {}
    }
  },
  methods: {
    detailsClose() {
      this.identVisible = false
    },

    clickhandle(row) {
      this.info = row
      this.identVisible = true
    },

    selectHandle() {
      const screenRuleIdList = this.identRuleList
        .filter(item => this.form.identifyRuleId.includes(item.identifyRuleId))
        .map(item => item.identifyRuleName)
      this.screenRuleIdList = screenRuleIdList

      this.getTableList()
    },

    selectHandle5 () {
      const screenProIdList = this.projectList
        .filter(item => this.form.projectId.includes(item.value))
        .map(item => item.name)
      this.screenProIdList = screenProIdList

      this.getTableList()
    },

    selectHandle2() {
      const unitIdList = []
      this.form.unitId.forEach(index => {
        this.businList.forEach(item => {
          if (index === item.value) {
            unitIdList.push(item.name)
          }
        })
      })
      this.screenunitIdList = unitIdList
      this.getTableList()
    },

    selectHandle3() {
      this.screenStatusList = []
      this.form.status.forEach(index => {
        this.statusList.forEach(item => {
          if (index === item.value) {
            this.screenStatusList.push(item.name)
          }
        })
      })
      this.getTableList()
    },

    selectHandle4() {
      this.screenlockList = []
      this.lockStatusList.forEach(item => {
        this.form.lockStatus.forEach(index => { if (index === item.value) { this.screenlockList.push(item.name) } })
      })
      this.getTableList()
    },

    lockClick(row) {
      this.$confirm('确定锁定当前识别规则? 锁定之后所选字段将不受自动识别模式的结果影响?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const labelId = row.map(item => item.labelId)
        this.getLock(labelId + '')
        this.getTableList()
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消已经操作'
          })
        })
    },

    unlockClick(row) {
      this.$confirm('确定解锁当前识别规则? 解锁之后所选字段将按照自动识别模式进行打标，如果没有满足条件的识别规则，则当前识别结果会消失?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const labelId = row.map(item => item.labelId)
        this.getUnLock(labelId + '')
        this.getTableList()
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消已经操作'
          })
        })
    },

    async getLock(data) {
      const res = await getLock(data)
      if (res && res.code === 0) {
        this.$message({
          type: 'success',
          message: '锁定成功!'
        })
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
    },

    async getUnLock(data) {
      const res = await getUnLock(data)
      if (res && res.code === 0) {
        this.$message({
          type: 'success',
          message: '解锁成功!'
        })
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
    }
  }
}
