/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-02-03 09:59:05
 * @LastEditTime: 2023-08-07 18:38:43
 * @Description:
 */
import { mapGetters } from 'vuex'
import { getTask } from '@/api/rd/integrate'
import { getTaskinfo } from '@/api/rd/data-collection'

export default {
  inject: ['attrStore', 'tabStore'],
  props: {
    id: String,
    nodeData: Object
  },
  data() {
    return {
    }
  },
  created () {

  },
  mounted () {
    // mixins 混用 每个类型属性配置都不一样 ----> 多个SQL呢 还是存在重复
    const updateNode = `updateNode-${this.nodeType}`
    this.$root.eventEmitter.on(updateNode, form => {
      console.log(updateNode, form)
      const { sql, rawScript, json, hiveSqlScript, method, ...fromData } = JSON.parse(JSON.stringify(form))

      this.form = {
        ...this.form,
        ...fromData
      }
    })
  },
  computed: {
    active () {
      return (this.tabStore && this.tabStore.states.active) || ''
    },
    ...mapGetters(['project'])
  },
  watch: {
    active: {
      deep: true,
      handler (val) {
        if (val && val.data) {
          // ---- 多次触发
          console.log('form-data-3', val)
          this.getTaskData2(val.data)
          this.updateData(val.label)
        }
      }
    },
    // 激活节点
    nodeData: {
      immediate: true, // 初始化 必须
      deep: true,
      handler (val) {
        if (val) {
          console.log('form-data-激活节点', val)
          this.configForm() // 初始化
          const { flowId, catalogid, code, file_catalog, id, name, object_type, type, preTaskList, preList, branchList } = val
          this.form = {
            ...this.form,
            catalogid,
            flowId,
            code,
            file_catalog,
            id,
            name,
            object_type,
            type,
            preTaskList, // 前置任务
            preList, // 前置条件
            branchList // 分支节点
          }
          // --------------->
          if (type === 'integration') {
            // 集成展示画布信息
            this.getTaskData2(this.form)
          } else {
            // 取保存节点信息
            this.getTaskData(val.id)
          }
        }
      }
    }
  },
  methods: {
    configForm () { },
    async getTaskData2 (data) {
      this.data = data
    },

    // 获取节点信息 ---> 刷新页面也会触发
    async getTaskData (id, label) {
      // 重名怎么办 唯一标识
      if (label && label !== this.form.name) {
        return
      }
      const res = await getTask({ id })
      if (res) {
        const { config } = res.data
        let formData = config ? JSON.parse(config) : {}
        this.form = {
          ...this.form,
          ...formData // config
        }
        this.updateData(label)
      }
    },

    // 更新属性配置 ---> 传值
    updateData (label) {
      // 重名怎么办 唯一标识
      if (label && label !== this.form.name) {
        return
      }
      const { name, object_type } = this.form
      const attr = {
        title: name,
        attrType: object_type,
        name,
        label: 'node',
        data: this.form // 传给配置面板
      }
      // 一定会触发的
      localStorage.setItem('taskId', this.form.id)
      console.log('integration-id-3', this.form.id)
      console.log('form-data-4-配置面板属性配置', attr)
      this.attrStore.commit('add', attr)
      this.attrStore.commit('setActiveToFirst', attr)
    }
  }
}
