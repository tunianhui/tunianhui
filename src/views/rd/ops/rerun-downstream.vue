<template>
  <SimpleEditDialog
    title="重跑下游数据"
    :visible.sync="isVisible"
    @close="close"
    @confirm="confirm"
    ref="dialog"
    v-loading="!!loading"
  >
    <el-form
      ref="form"
      label-width="120px"
      label-position="right"
      label-suffix="："
      :model="form"
    >
      <div class="flex-layout">
        <!-- <el-form-item
          label="选择下游类型"
          prop="downstreamType"
        >
          <el-select
            v-model="form.downstreamType"
            @change="getDownstream"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="展开层数" prop="loop">
          <el-select v-model="form.loop" @change="getDownstream">
            <el-option
              v-for="item in loopList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <!-- row-key="job_id" -->
    <el-table
      :data="tableData"
      row-key="cube_id"
      default-expand-all
      :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
      class="mb-20"
      ref="table"
      :height="height"
    >
      <!-- <el-table-column type="selection" width="45"></el-table-column> -->
      <el-table-column align="">
        <template slot="header" slot-scope="scope">
          <el-checkbox v-model="checkedAll"
            @change="handleCheckedAll(scope)"/>
        </template>
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checked"
            @change="handleCheckedOne(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column
        label="节点ID（实例ID）"
        prop="instance_id"
        show-overflow-tooltip
      ></el-table-column>
      <!-- prop="job_id" -->
      <el-table-column
        label="节点名"
        prop="cube_code"
        show-overflow-tooltip
      ></el-table-column>
      <!-- prop="job_name" -->
      <el-table-column
        label="所属项目"
        prop="project_name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="层级" width="70" prop="level"></el-table-column>
    </el-table>
  </SimpleEditDialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import {getDownstream, reRunDownstream} from '@/api/rd/ops'
// import {dateFormat} from '@/libs/util'
import {mapMutations, mapGetters} from 'vuex'
import {optimizeElTableTreeSeletion} from '@/libs/el-table.plugin.js'
import {on, off} from '@/libs/dom'
import mixin from './mixin'

export default {
  name: 'RerunDownstream',
  mixins: [editDialog, mixin],
  prop: {
    data: Object,
    isVisible: false
  },
  data() {
    return {
      form: {
        cube_id: '',
        downstreamType: '',
        loop: 0
      },
      loopList: [{label: '全部', value: 0}].concat(
        Array.from({length: 6}, (a, i) => ({name: i + 1, value: i + 1}))
      ),
      typeList: [],
      loading: 0,
      tableData: [],
      height: 200
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  mounted() {
    this.$nextTick(_ => {
      const table = this.$refs.table
      table && optimizeElTableTreeSeletion(table)
      this.setHeight()
    })
    this.getDownstream()
    on(window, 'resize', this.setHeight)
  },
  beforeDestroy() {
    off(window, 'resize', this.setHeight)
  },
  methods: {
    ...mapMutations({
      setActvieDialogComp: 'ops/SET_ACTIVE_DIALOG_COMP'
    }),
    setHeight() {
      const bodyHeight = this.$refs.dialog.dialogBodyHeight,
        formHeight = this.$refs.form.$el.clientHeight
      this.height = bodyHeight - formHeight - 22
    },
    async getDownstream() {
      this.loading++
      const {loop} = this.form
      const {instance_type, cube_id, instance_id} = this.data
      const res = await this.$simpleAsyncTo(
        getDownstream({loop, cube_id, instance_type, instance_id}),
        '获取下游数据失败'
      )
      if (res) {
        this.tableData = [res.data]
        this.formatData(this.tableData)
      }
      this.loading--
    },
    async confirm() {
      const {instance_id} = this.data,
        // selection = this.$refs.table.selection
        data = this.deepFilterId(this.filter1(this.tableData))
      const params = {
        instance_id,
        // seed_cube_ids: this.$refs.table.selection.map(item => item.cube_id)
        // seed_cube_ids: selection
        //   // .filter(item => item.cube_id !== cube_id)
        //   .map(item => item.instance_id)
        seed_cube_ids: JSON.stringify(data),
        skd_prj_id: this.project.skd_prj_id
      }
      // this.loading++
      this.globalLoading()
      const res = await this.$simpleAsyncTo(
        reRunDownstream(params),
        '保存补数据失败'
      )
      if (res) {
        this.close()
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
      }
      // this.loading--
      this.globalLoading().close()
    },
    close() {
      this.setActvieDialogComp(null)
    }
  }
}
</script>

<style lang="scss"></style>
