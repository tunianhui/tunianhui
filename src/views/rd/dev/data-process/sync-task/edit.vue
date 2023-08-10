<template>
  <TableEditLayout class="sync-task-edit" :tabs="tabs" :buttons="btns" v-loading="!!loading" ref="tel">
    <AsyncTable ref="AsyncTable" :data="data"></AsyncTable>
    <SideModal
      :visible.sync="sideModelOption.visible"
      :title="sideModelOption.title"
      @confirm="sideModelOption.confirm"
    >
      <component
        ref="sideComponent"
        :is="sideModelOption.component"
        :field-list="editFieldList"
        :data="sideModelOption.data"
      ></component>
    </SideModal>
  </TableEditLayout>
</template>

<script>
import TableEditLayout from '@c/table-edit-layout'
import SideModal from '@c/side-modal'
import AsyncTable from './async-table.vue'
import {loop} from '@/libs/util'
import {
  queryDispatchById
} from '@/api/rd/dimension-table'
import {mapGetters, mapMutations} from 'vuex'
import {
  editTask
} from '@/api/rd/sync-task.js'
const ScheduleConfig = _ =>
  import(/* webpackChunkName: "ScheduleConfig" */ '../../norm-modeling/modeling/schedule-config')
export default {
  name: 'SyncTaskEdit',
  props: {
    data: Object
  },
  components: {
    TableEditLayout,
    SideModal,
    AsyncTable
  },
  computed: {
    ...mapGetters(['project'])
  },
  data() {
    return {
      loading: 0,
      tabs: [
        {
          label: '同步管理',
          title: '同步管理',
          handler: this.tabClick,
          confirm: null,
          component: null,
          data: {}
        },
        {
          label: '调度配置',
          title: '调度配置',
          handler: this.tabClick,
          confirm: this.saveScheduleConfig,
          component: ScheduleConfig,
          data: {}
        }
      ],
      btns: [
        {
          icon: 'icon iconfont icon-baocun',
          handler: this.saveHandle,
          disabled: false,
          title: '保存'
        },
        // {
        //   icon: 'icon iconfont icon-fabu',
        //   handler: this.submitHandle,
        //   disabled: false,
        //   title: '发布'
        // },
        {
          icon: 'icon iconfont icon-iconfontzhizuobiaozhun023117',
          handler: this.locationHandle,
          disabled: false,
          title: '定位'
        }
      ],
      sideModelOption: {
        title: '',
        visible: false,
        component: null,
        confirm: loop
      },
      editFieldList: []
    }
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    async tabClick(tab) {
      if (tab.title === '同步管理') {
        this.sideModelOption.visible = false
        return
      }
      await this.getScheduleData()
      Object.assign(this.sideModelOption, tab, {visible: true})
    },
    // 保存
    async saveHandle() {
      const data = this.$refs.AsyncTable.getData()
      if (typeof data === 'boolean' && !data) return this.$message({type: 'error', message: 'hive表映射策略，来源目标字段及类型需保持一致，请修改后提交'})
      if (data === 'flag') return this.$message({type: 'error', message: '目标字段多于来源字段，请修改后提交'})
      if (!data.src_ds_type && !data.dest_ds_type) return this.$message({type: 'error', message: '请选择数据源'})
      if (!data.dest_tab_code && !data.src_tab_code) return this.$message({type: 'error', message: '请选择字段表'})
      if (this.data.id) {
        const params = {
          id: this.data.id,
          ...data
        }
        const res = await this.$simpleAsyncTo(editTask(params), '编辑失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
        }
      } else {
        this.setActiveRdEditDialog({
          title: '新建任务',
          component: 'CreateFolderManage',
          data: {...this.project, treeData: this.data.treeData, folder_type: '5', data, flag: 'addTask'}
        })
      }
    },
    // 发布
    submitHandle() {},
    // 定位
    locationHandle() {},
    // 调度配置
    saveScheduleConfig() {},
    async getScheduleData() {
      const res = await this.$simpleAsyncTo(
        queryDispatchById(),
        '获取调度数据失败'
      )
      if (res) {
        this.tabs[1].data = res.data
      }
    }
  }
}
</script>

<style lang="scss">
.sync-task-edit {
  background-color: #EAE9EE;
  .tel-body {
    overflow-y: auto;
  }
}
</style>
