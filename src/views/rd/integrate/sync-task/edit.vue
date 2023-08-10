<template>
  <TableEditLayout class="sync-task-edit" :tabs="tabs" :buttons="btns" v-loading="!!loading" ref="tel">
    <!-- 流程图 -->
    <DataSet ref="dataSet" :data="data"></DataSet>

    <!-- 运行日志 -->
    <DrawerCard v-if="showOperation" @hidden="showOperation = false"></DrawerCard>

    <!-- 侧边栏 -->
    <SideModal :visible.sync="sideModelOption.visible" :title="sideModelOption.title" @confirm="sideModelOption.confirm">
      <component ref="sideComponent" :is="sideModelOption.component" :field-list="editFieldList" :data="sideModelOption.data"></component>
    </SideModal>
  </TableEditLayout>
</template>

<script>
import TableEditLayout from '@c/table-edit-layout-2'
import SideModal from '@c/side-modal'

import DrawerCard from './components/drawer-card.vue'
import DataSet from '../dataSet/index.vue'
import { loop } from '@/libs/util'
import { mapGetters } from 'vuex'
// 画布顶部操作  ---- 保存 运行 提交
import { saveTask, runTask, submitTask } from '@/api/rd/data-collection'
export default {
  name: 'SyncTaskEdit',
  inject: ['tabStore'],
  props: {
    data: Object
  },
  components: {
    TableEditLayout,
    SideModal,
    DrawerCard,
    DataSet
  },
  data () {
    return {
      form: {},
      showOperation: false,
      loading: 0,
      tabs: [
        {
          preicon: 'iconfont icon-save color-btn',
          label: '保存',
          title: '保存',
          handler: this.handleSave,
          confirm: null,
          component: null,
          data: {}
        },
        {
          preicon: 'iconfont icon-zhihang color-btn',
          label: '运行',
          title: '运行',
          handler: this.handleOperation,
          confirm: null,
          component: null,
          data: {}
        },
        {
          preicon: 'icon iconfont icon-fabu color-btn',
          label: '提交',
          title: '提交',
          handler: this.handlePublish,
          confirm: null,
          component: null,
          data: {}
        }
      ],
      btns: [],
      sideModelOption: {
        title: '',
        visible: false,
        component: null,
        confirm: loop
      },
      editFieldList: []
    }
  },
  created () {

  },
  computed: {
    ...mapGetters(['project'])
  },
  methods: {
    // 配置提交参数
    getSubmitData () {
      this.form = this.$refs.dataSet.nodeInfo
      console.log('form', this.form)
      // 任务信息
      const task = {
        'id': '1a63c235-f98a-467f-992b-05047a713491',
        'name': '数据同步',
        'projectId': '1234567890',
        'taskType': 3,
        'taskDesc': '',
        'flowId': '',
        'flowNodeId': '',
        'runParams': [ // 任务运行参数变量
        ],
        'sysParams': { // 任务flink参数
          'yarnjobManager': '1024m',
          'yarntaskManager': '1024m',
          'yarntaskManagerNum': 10,
          'yarnslots': 3,
          'parallelism': 3,
          'yarnqueue': 'default'
        }
      }
      // 画布数据
      const graph = this.$refs.dataSet.graph
      const data = graph.toJSON({ deep: true })
      console.log('node-data', data)
      const flowData = JSON.stringify(data)
      const params = {
        task: task,
        flowData: flowData
      }
      return params
    },

    // 保存 ---> 画布信息 提交基本信息
    async handleSave () {
      const params = this.getSubmitData()
      const res = await saveTask(params)
      const messageType = res && res.code === '0' ? 'success' : 'warning'
      const message = res && res.code === '0' ? '保存成功' : res.msg
      this.$message({ type: messageType, message: message })
    },

    // 运行
    async handleOperation () {
      const params = this.getSubmitData()
      const res = await runTask(params)
      const messageType = res && res.code === '0' ? 'success' : 'warning'
      const message = res && res.code === '0' ? '运行成功' : res.msg
      this.$message({ type: messageType, message: message })
      this.showOperation = true
    },

    // 提交
    async handlePublish () {
      const params = this.getSubmitData()
      const res = await submitTask(params)
      const messageType = res && res.code === '0' ? 'success' : 'warning'
      const message = res && res.code === '0' ? '提交成功' : res.msg
      this.$message({ type: messageType, message: message })
    }
  }
}
</script>

<style lang="scss" scoped>
.sync-task-edit {
  background-color: #eae9ee;
}
</style>
