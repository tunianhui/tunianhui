<template>
  <SimpleEditDialog
    title="补数据"
    :visible.sync="isVisible"
    @close="close"
    @confirm="confirm"
    ref="dialog"
  >
    <el-form
      ref="form"
      label-width="120px"
      label-position="right"
      label-suffix="："
      :model="form"
      :rules="rules"
    >
      <el-form-item label="实例名称" prop="jobName">
        <el-input
          v-model="form.jobName"
          show-word-limit
          maxlength="128"
        ></el-input>
      </el-form-item>
      <el-form-item label="业务日期" prop="date">
        <el-date-picker
          v-model="form.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <div class="flex-layout">
        <el-form-item label="选择下游" prop="downstream">
          <el-radio-group v-model="form.downstream" @change="changeDownstream">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="展开层数" prop="loop" v-if="form.downstream">
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
    <div class="pl-20 pr-20">
      <el-table
        v-show="form.downstream"
        :data="tableData"
        row-key="cube_id"
        default-expand-all
        :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
        class="mb-20"
        ref="table"
        :height="height"
        v-loading="!!loading"
      >
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
          prop="cube_id"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="节点名"
          prop="cube_code"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="所属项目"
          prop="project_name"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="层级" width="70" prop="level"></el-table-column>
      </el-table>
    </div>
  </SimpleEditDialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import {compensateData, getDownstream} from '@/api/rd/ops'
import {dateFormat} from '@/libs/util'
import {mapMutations, mapGetters} from 'vuex'
import {optimizeElTableTreeSeletion} from '@/libs/el-table.plugin.js'
import {on, off} from '@/libs/dom'
import mixin from './mixin'

export default {
  name: 'AddData',
  mixins: [editDialog, mixin],
  prop: {
    data: Object,
    isVisible: false
  },
  data() {
    return {
      form: {
        cube_id: '',
        jobName: '',
        date: [new Date(), new Date()],
        downstream: false,
        loop: 0
      },
      rules: {
        jobName: [
          {required: true, message: '请输入英文名'},
          {
            pattern: /^[a-zA-Z_\-][a-zA-Z_0-9\-]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      loopList: [{label: '全部', value: 0}].concat(
        Array.from({length: 6}, (a, i) => ({name: i + 1, value: i + 1}))
      ),
      loading: 0,
      tableData: [],
      height: 200
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  mounted() {
    this.form.jobName = this.data.name
    this.form.cube_id = this.data.cube_id
    this.form.jobName += `_${dateFormat(new Date())}_${Date.now()}`
    this.$nextTick(_ => {
      const table = this.$refs.table
      table && optimizeElTableTreeSeletion(table)

      this.setHeight()
    })
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
    changeDownstream(val) {
      if (val) {
        this.getDownstream()
      }
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
      const {date, jobName, cube_id} = this.form,
        // selection = downstream ? this.$refs.table.selection : []
        data = this.deepFilterId(this.filter1(this.tableData))
      const params = {
        jobName,
        cube_id,
        beginDate: date[0],
        endDate: date[1],
        project_name: this.project.project_name,
        seed_cube_ids: JSON.stringify(data)
      }
      // this.loading++
      this.globalLoading()
      const res = await this.$simpleAsyncTo(
        compensateData(params),
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
