<template>
  <section class="pr-15 pb-10 pl-10" v-loading="!!loading">
    <div class="subtitle">
      <span>原子指标列表</span>
      <div class="fr">
        <el-button
          icon="el-icon-plus"
          type="primary"
          plain
          v-popover:create-popper
        >
          新建原子指标
        </el-button>
        <el-button
          icon="el-icon-refresh"
          type="primary"
          plain
          @click="handleRefresh"
        ></el-button>
        <el-popover
          ref="create-popper"
          placement="bottom-start"
          popper-class="more-popover"
          trigger="click"
          v-model="visibleCreatePopper"
        >
          <ul class="popper-list">
            <li @click="handleCreate('atom')">
              <touch-ripple>新建原子指标</touch-ripple>
            </li>
            <li @click="handleCreate('deriveAtom')">
              <touch-ripple>新建衍生原子指标</touch-ripple>
            </li>
          </ul>
        </el-popover>
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
      <el-table-column label="原子指标">
        <template #default="scope">
          <CellContent
            @click="showAttr"
            :data="getCellContentData(scope.row, true)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="原子指标类型"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="data_field"
        label="数据域"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="status" label="发布状态" show-overflow-tooltip>
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
      <!-- <el-table-column label="所属项目" show-overflow-tooltip>
        <template>{{project.project_name}}</template>
      </el-table-column>-->
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
            title="查看同源原子指标"
            class="iconfont icon-yewushili font-16"
            @click="handleSameSource(scope.row)"
          ></el-button>
          <el-button
            type="text"
            title="创建派生指标"
            icon="font-16 iconfont icon-chuangjianpaishengzhibiao"
            @click="handleCreateDerive(scope.row)"
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
              <li>
                <el-button
                  type="text"
                  :disabled="!['0', '6'].includes(scope.row.status)"
                  icon="font-16 iconfont icon-guanlianweiduluojibiao"
                  @click="handleRelatedDerive(scope.row)"
                  >&nbsp;&nbsp;相关派生指标</el-button
                >
              </li>
              <li>
                <el-button
                  type="text"
                  icon="font-16 iconfont icon-xiaxian2"
                  @click.stop="handleOffLine(scope.row)"
                  :disabled="!['0', '6'].includes(scope.row.status)"
                  >&nbsp;&nbsp;下线</el-button
                >
              </li>
              <li>
                <el-button type="text" icon="font-16 el-icon-delete"
                  @click.stop="delTableCol(scope.row, scope.$index)"
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
import {del, offLine} from '@/api/rd/atom'
import {types} from '@/config/rd-config'
import rdTableMixin from '@/mixins/rd-table'
import {mapGetters} from 'vuex'
export default {
  name: 'AtomObjectTable',
  mixins: [rdTableMixin],
  data() {
    return {
      offLineFetch: offLine,
      delTableColFetch: del,
      visibleCreatePopper: false
    }
  },
  inject: ['tabStore'],
  computed: {
    ...mapGetters(['project'])
  },
  methods: {
    showAttr(data) {
      const attr = {
        title: '原子指标',
        attrType: this.types.ATOM,
        name: data.id + '',
        label: data.code,
        data
      }
      this.attrStore.commit('add', attr)
      this.attrStore.commit('setActiveToFirst', attr)
    },
    handleCreate(type) {
      if (type === 'atom') {
        this.tabStore.commit('add', {
          label: '新建原子指标',
          name: `new_atom`,
          tabType: types.ATOM,
          component: 'AtomEdit',
          data: {}
        })
      } else {
        this.setActiveRdEditDialog({
          component: 'DeriveAtomEdit'
        })
      }
      this.visibleCreatePopper = false
    },
    handleCreateDerive(row) {
      this.tabStore.commit('add', {
        label: '新建派生指标',
        name: `new_derive`,
        tabType: types.DERIVE,
        component: 'DeriveEdit',
        data: {
          ...row
        }
      })
    },
    // 编辑
    handleEdit(row, title) {
      this.setActiveRdEditDialog({
        title: `${title}原子指标`,
        component: 'AtomEditDialog',
        data: {...row}
      })
    },
    // 查看同源业务限定
    handleSameSource(row) {
      this.tabStore.commit('add', {
        label: '同源原子指标' + row.name,
        tabType: types.ATOM,
        name: '同源原子指标' + row.id,
        component: 'AtomEdit',
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
            key: 'atomic_name',
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
