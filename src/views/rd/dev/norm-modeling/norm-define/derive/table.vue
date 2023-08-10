<template>
  <section class="pr-15 pb-10 pl-10" v-loading="!!loading">
    <div class="subtitle">
      <span>派生指标列表</span>
      <div class="fr">
        <el-button icon="el-icon-plus" type="primary" plain @click="handleAdd">
          新建派生指标
        </el-button>
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
      <el-table-column label="派生指标">
        <template #default="scope">
          <CellContent
            @click="showAttr"
            :data="getCellContentData(scope.row, true)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="atomic_name"
        label="原子指标"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="dim_name"
        label="统计粒度"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="cycle_name"
        label="统计周期"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="oper_user"
        label="最近更新人"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column prop="oper_time" label="最近更新时间" show-overflow-tooltip></el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            title="编辑"
            class="el-icon-edit-outline font-16"
            @click="handleEdit(scope.row)"
          />
          <el-button
            type="text"
            title="查看汇总表"
            class="el-icon-view font-16 mr-10"
            @click="showPolymer(scope.row, scope.$index)"
          />
          <SimpleConfirm
            @confirm="handleOffLine(scope.row)"
            content="请确认是否下线？"
          >
            <el-button
              type="text"
              title="下线"
              :disabled="!['0', '6'].includes(scope.row.status)"
              class="iconfont icon-xiaxian2 mr-10 font-16"
            ></el-button>
          </SimpleConfirm>
          <SimpleConfirm @confirm="delTableCol(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import {del, offLine} from '@/api/rd/derive'
import {types} from '@/config/rd-config'
import rdTableMixin from '@/mixins/rd-table'
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: 'DeriveObjectTable',
  mixins: [rdTableMixin],
  data() {
    return {
      offLineFetch: offLine,
      delTableColFetch: del
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  mounted() {
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    showAttr(data) {
      const attr = {
        title: '派生指标',
        attrType: this.types.DERIVE,
        name: data.id + '',
        label: data.code,
        data
      }
      this.attrStore.commit('add', attr)
      this.attrStore.commit('setActiveToFirst', attr)
    },
    handleAdd() {
      this.tabStore.commit('add', {
        label: '新建派生指标',
        tabType: types.DERIVE,
        name: Date.now() + '',
        component: 'DeriveEdit',
        data: {}
      })
    },
    // 编辑
    handleEdit(data) {
      this.setActiveRdEditDialog({
        // title: '编辑派生指标',
        component: 'DeriveEditDialog',
        data
      })
    },
    closeModal() {
      this.editdialog = false
    },
    showPolymer(data, index) {
      this.tabStore.commit('add', {
        label: data.name,
        tabType: types.POLYMER,
        name: data.id,
        component: 'PolymerTableEdit',
        data
      })
    }
  }
}
</script>
