<template>
  <section class="pr-15 pb-10 pl-10" v-loading="!!loading">
    <div class="subtitle">
      <span>业务过程列表</span>
      <div class="fr">
        <el-button
          icon="el-icon-plus"
          type="primary"
          plain
          @click="handleAddFact"
          >新建业务过程</el-button
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
      <el-table-column prop="name" label="业务过程" show-overflow-tooltip>
        <template #default="scope">
          <CellContent
            @click="showAttr"
            :data="getCellContentData(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="data_field"
        label="数据域"
        show-overflow-tooltip
      ></el-table-column>
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
      <el-table-column
        prop="oper_user"
        label="创建人"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            title="编辑"
            type="text"
            class="el-icon-edit-outline font-16"
            @click="handleEdit(scope.row, '编辑')"
          ></el-button>
          <el-button
            type="text"
            class="iconfont icon-luojibiao font-16"
            title="事实逻辑表"
            disabled
            @click="handleToFactLogic(scope.row)"
          ></el-button>
          <el-button
            type="text"
            class="iconfont icon-chuangjianluojibiao font-16"
            title="创建事实逻辑表"
            @click="handleCreateFactLogic(scope.row)"
          ></el-button>
          <el-tooltip popper-class="more-popover">
            <ul class="popper-list" slot="content">
              <li @click.stop="handleEdit(scope.row, '克隆')">
                <el-button type="text" icon="font-16 el-icon-copy-document"
                  >&nbsp;克隆</el-button
                >
              </li>
              <!-- <li @click.stop="handleOffLine(scope.row)">
                <el-button
                  type="text"
                  icon="font-16 iconfont icon-xiaxian2"
                  :disabled="!['0', '6'].includes(scope.row.status)"
                >&nbsp;&nbsp;下线</el-button>
              </li>-->
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
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import {mapGetters} from 'vuex'
import {delBusProcess, offLineBusProcess} from '@/api/rd/fact'
import rdTableMinix from '@/mixins/rd-table'
export default {
  name: 'FactObjectTable',
  mixins: [rdTableMinix],
  inject: ['fileStore'],
  data() {
    return {
      tableData: [],
      loading: 0,
      delTableColFetch: delBusProcess,
      offLineFetch: offLineBusProcess,
      allTableData: []
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  methods: {
    showAttr(data) {
      const attr = {
        title: '业务过程',
        attrType: this.types.FACT,
        name: data.id + '',
        label: data.code,
        data
      }
      this.attrStore.commit('add', attr)
      this.attrStore.commit('setActiveToFirst', attr)
    },
    // 新建业务过程
    handleAddFact() {
      this.setActiveRdEditDialog({
        title: '新建业务过程',
        component: 'FactEdit',
        data: {...this.project}
      })
    },
    handleToFactLogic(row) {
      const opt = {
        label: row.code,
        data: row,
        tabType: this.types.FACTTABLE,
        name: row.id,
        component: 'FactTableEdit'
      }
      this.tabStore.commit('add', opt)
      this.fileStore.commit('add', opt)
      this.fileStore.commit('setActiveToFirst', opt)
    },
    handleCreateFactLogic(row) {
      this.setActiveRdEditDialog({
        title: '新建事实逻辑表',
        component: 'FactTableCreate',
        data: {...this.project, ...row, process_id: row.id}
      })
    },
    // 编辑业务过程
    async handleEdit(row, title) {
      this.setActiveRdEditDialog({
        title: `${title}业务过程`,
        component: 'FactEdit',
        data: {...row}
      })
    }
  }
}
</script>
