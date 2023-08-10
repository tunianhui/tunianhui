/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-02-03 09:59:05
 * @LastEditTime: 2023-07-31 14:33:54
 * @Description:
 */
import { getencryptionAlgorithmlist, getsecretkeylist, getdatamaskrulelist } from '@/api/rd/data-collection'
import { mapGetters } from 'vuex'
import Sortable from 'sortablejs'

export default {
  props: {
    id: String,
    nodeData: Object
  },
  data() {
    return {
      form: {},
      keyword: '',
      keyword1: '',
      keyword2: '',
      encryptionAlgorithmList: [],
      secretkeylist: [],
      ruleList: []
    }
  },
  created () {},
  mounted() {},
  computed: {
    ...mapGetters(['project'])
  },
  watch: {
    nodeData: {
      immediate: true, // 初始化 必须
      deep: true,
      handler (val) {
        console.log('nodeData-com', val)
        this.getencryptionAlgorithmlist()
        this.getdatamaskruleData()
        if (Object.keys(val).length > 1) {
          this.form = val
          if (!val.outputColumn) {
            this.form.outputColumn = JSON.parse(JSON.stringify(val.inputColumn))
          }
        } else {
          this.configForm()
          this.form.name = val.name
          if (val.inputColumn) {
            this.form.outputColumn = JSON.parse(JSON.stringify(val.inputColumn))
          }
          this.$refs.form && this.$refs.form.resetFields()
        }
      }
    },
    'project.skd_prj_id': {
      handler (val) {

      },
      immediate: true
    },
    'form.outputColumn': {
      immediate: true,
      handler (val) {
        if (val) {
          this.fieldData = val.map(item => item.name)
          // if (this.fieldList && this.fieldList.length) {
          //   let arr = []
          //   this.fieldData.forEach(name => {
          //     let obj = this.fieldList.find(ele => ele.fieldName === name)
          //     this.fieldList = this.fieldList.filter(ele => ele.fieldName !== name)
          //     arr.push(obj)
          //   })
          //   this.fieldList = [...this.fieldList, ...arr]
          // }
        }
      }
    },
    'form.encryptionAlgorithm': {
      immediate: true,
      handler (val) {
        if (val) {
          this.getsecretkeyData(val)
        }
      }
    }
  },
  methods: {
    configForm () {
      this.form = {}
    },

    searchChange () {

    },

    dragSort () {
      const el = this.$refs.singleTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: e => {
          // onEnd是结束拖拽时触发，onUpdate是列表内元素顺序更新的时候触发
          // e.oldIndex为拖动一行原来的位置，e.newIndex为拖动后新的位置
          const targetRow = this.form.outputColumn.splice(e.oldIndex, 1)[0]
          this.form.outputColumn.splice(e.newIndex, 0, targetRow)
        }
      })
    },

    async getencryptionAlgorithmlist () {
      const res = await getencryptionAlgorithmlist()
      if (res) {
        this.encryptionAlgorithmList = res.data
      }
    },

    async getsecretkeyData (algorithm) {
      const res = await getsecretkeylist({ algorithm })
      if (res) {
        this.secretkeylist = res.data.secretKey
      }
    },

    async getdatamaskruleData () {
      const { project_id } = this.project
      const res = await getdatamaskrulelist({ projectId: project_id })
      if (res && res.data) {
        this.ruleList = res.data.dataMaskRule
      }
    }

    // ---------------- 事件 ----------------------

  }
}
