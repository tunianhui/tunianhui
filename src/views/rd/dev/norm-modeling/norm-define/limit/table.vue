<template>
  <section class="pr-15 pb-10 pl-10" v-loading="!!loading">
    <div class="subtitle">
      <span>业务限定列表</span>
      <div class="fr">
        <el-button
          icon="el-icon-plus"
          type="primary"
          plain
          @click="handleAddLim"
          >新建业务限定</el-button
        >
        <el-button
          icon="el-icon-refresh"
          type="primary"
          plain
          @click="handleRefresh"
        ></el-button>
      </div>
    </div>
    <el-card class="mt-15 mb-10">
      <el-input
        style="width:200px;"
        v-model="keyword"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
      ></el-input>
    </el-card>
    <el-table
      :data="filterData(['name', 'code'])"
      class="object-table-list"
      :max-height="tableHeight"
    >
      <el-table-column label="业务限定">
        <template #default="scope">
          <CellContent
            @click="showAttr"
            :data="getCellContentData(scope.row, true)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="data_field"
        label="数据域"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="status" label="状态" show-overflow-tooltip>
        <template #default="scope">
          <Status :state="scope.row.status"></Status>
        </template>
      </el-table-column>
      <el-table-column
        prop="oper_user"
        label="最近更新人"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="oper_time"
        label="最近更新时间"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="project_name"
        label="所属项目"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            title="编辑"
            class="el-icon-edit-outline font-16"
            @click="handleEdit(scope.row, '编辑')"
          ></el-button>
          <el-button
            type="text"
            title="查看同源业务限定"
            class="iconfont icon-yewushili font-16"
            @click="handleSameSource(scope.row)"
          ></el-button>
          <el-button
            type="text"
            title="相关派生指标"
            :disabled="!['0', '6'].includes(scope.row.status)"
            icon="font-16 iconfont icon-guanlianweiduluojibiao"
            @click="handleRelatedDerive(scope.row)"
          ></el-button>
          <el-tooltip popper-class="more-popover">
            <ul class="popper-list" slot="content">
              <li>
                <el-button
                  type="text"
                  icon="font-16 el-icon-copy-document"
                  @click="handleEdit(scope.row, '克隆')"
                  >&nbsp;克隆</el-button
                >
              </li>
              <li @click.stop="handleOffLine(scope.row)">
                <el-button
                  type="text"
                  icon="font-16 iconfont icon-xiaxian2"
                  :disabled="!['0', '6'].includes(scope.row.status)"
                  >&nbsp;下线</el-button
                >
              </li>
              <li @click.stop="delTableCol(scope.row, scope.$index)">
                <el-button type="text" icon="font-16 el-icon-delete"
                  >&nbsp;删除</el-button
                >
              </li>
            </ul>
            <el-button
              type="text"
              icon="font-16 icon iconfont icon-diandian"
              title="更多"
            ></el-button>
          </el-tooltip>
          <!-- <SimpleConfirm @confirm="handleOffLine(scope.row)" content="请确认是否下线？">
            <el-button
              type="text"
              title="下线"
              :disabled="!['0', '6'].includes(scope.row.status)"
              class="iconfont icon-xiaxian2 mr-10 font-16"
            ></el-button>
          </SimpleConfirm>
          <SimpleConfirm @confirm="delTableCol(scope.row)" />-->
        </template>
      </el-table-column>
    </el-table>
    <!-- <Editdialog v-if="editdialog" @cancelDialog="closeModal" :limitId="rowId"></Editdialog> -->
  </section>
</template>

<script>
// import Editdialog from './edit-dialog'
import {delLimit, offLine} from '@/api/rd/limit'
import {types} from '@/config/rd-config'
import rdTableMixin from '@/mixins/rd-table'
import {mapGetters} from 'vuex'
export default {
  name: 'LimitObjectTable',
  mixins: [rdTableMixin],
  components: {
    // Editdialog
  },
  data() {
    return {
      offLineFetch: offLine,
      delTableColFetch: delLimit,
      editdialog: false,
      rowId: null
    }
  },
  inject: ['tabStore'],
  computed: {
    ...mapGetters(['project'])
  },
  methods: {
    showAttr(data) {
      const attr = {
        title: '业务限定',
        attrType: this.types.LIMIT,
        name: data.id + '',
        label: data.code,
        data
      }
      this.attrStore.commit('add', attr)
      this.attrStore.commit('setActiveToFirst', attr)
    },
    // 新建业务限定
    handleAddLim() {
      this.tabStore.commit('add', {
        label: '新建业务限定',
        tabType: types.LIMIT,
        name: 'new_limit',
        component: 'LimitEdit',
        data: {}
      })
    },
    // 编辑
    handleEdit(row, title) {
      this.setActiveRdEditDialog({
        title: `${title}业务过程`,
        component: 'LimitEditDialog',
        data: {...row}
      })
    },
    // 查看同源业务限定
    handleSameSource(row) {
      this.tabStore.commit('add', {
        label: '同源业务限定 ' + row.code,
        tabType: types.LIMIT,
        name: row.id + '',
        component: 'LimitEdit',
        data: {...row}
      })
    },
    // 相关派生指标
    handleRelatedDerive(row) {
      this.$store.commit(`dev/SET_ACTIVE`, types.DERIVE)
      this.tabStore.commit('add', {
        label: '对象页表页',
        tabType: types.OBJECTTABLE,
        name: `dev_${types.OBJECTTABLE}`, // tab页的标识
        component: `DevObjectTable`,
        data: {
          params: {
            key: 'condition_name',
            value: row.name,
            id: row.id
          }
        }
      })
    },
    closeModal() {
      this.editdialog = false
    }
  }
}
</script>
