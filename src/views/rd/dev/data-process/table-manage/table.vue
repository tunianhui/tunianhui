<template>
  <section class="pr-15 pb-10 pl-10" v-loading="!!loading">
    <div class="subtitle">
      <span>维度列表</span>
      <div class="fr">
        <el-button icon="el-icon-plus" type="primary" plain @click="handleAddDim">
          新建维度
        </el-button>
        <el-button type="primary" plain @click="goToAsset">资产全景</el-button>
        <el-button icon="el-icon-refresh" plain type="primary" @click="handleRefresh"></el-button>
      </div>
    </div>
    <el-card class="mt-15 mb-10">
      <el-input style="width:200px;" v-model="keyword" placeholder="请输入关键字" prefix-icon="el-icon-search"></el-input>
    </el-card>
    <el-table :data="filterData(['name', 'code'])" class="object-table-list" :max-height="tableHeight">
      <el-table-column prop="name" label="维度" show-overflow-tooltip>
        <template #default="scope">
          <CellContent @click="showAttr" :data="getCellContentData(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="pk_code" label="主键" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ scope.row.pk_code }} &nbsp;&nbsp;</span>
          <el-popover popper-class="dark-popper" placement="right-start" trigger="click" ref="logicpopover" width="400">
            <el-link slot="reference" :underline="false" class="icon iconfont icon-wangluoxitong font-16" title="计算逻辑"></el-link>
            <MonacoEditor style="height:300px;" has-bottom-tools readonly :code="scope.row.sql_content" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="dim_type" label="维度类型" show-overflow-tooltip>
        <template #default="scope">
          <Status :state="scope.row.status"></Status>
        </template>
      </el-table-column>
      <el-table-column prop="data_field" label="所属数据域" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="开发状态" show-overflow-tooltip>
        <template #default="scope">
          <div>{{ getDicsValue('status_tag', scope.row.status) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip>
        <template #default="scope">
          <el-button title="编辑" type="text" icon="el-icon-edit-outline font-16" @click="handleEdit(scope.row)"></el-button>
          <el-button type="text" title="继承" icon="el-icon-copy-document font-16" :disabled="!['0', '6'].includes(scope.row.status)" @click="handleExtends(scope.row)"></el-button>
          <el-button type="text" title="维度逻辑表" icon="iconfont icon-weiduluojibiao1 font-16" :disabled="!['0', '6'].includes(scope.row.status)" @click="handleToDimLogic(scope.row)"></el-button>
          <el-tooltip popper-class="more-popover">
            <ul class="popper-list" slot="content">
              <li @click.stop="handleOffLine(scope.row)">
                <el-button type="text" icon="font-16 iconfont icon-xiaxian2" :disabled="!['0', '6'].includes(scope.row.status)">&nbsp;下线</el-button>
              </li>
              <li @click.stop="delTableCol(scope.row, scope.$index)">
                <el-button type="text" icon="font-16 el-icon-delete">&nbsp;删除</el-button>
              </li>
            </ul>
            <el-button type="text" icon="font-16 icon iconfont icon-diandian" title="更多"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { delDim, offLine } from '@/api/rd/dimension' //eslint-disable-line
import { mapGetters } from 'vuex'
import rdTableMixin from '@/mixins/rd-table'

export default {
  name: 'DimensionObjectTable',
  mixins: [rdTableMixin],
  inject: ['fileStore'],
  data () {
    return {
      delTableColFetch: delDim,
      offLineFetch: offLine
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  methods: {
    goToAsset () {
      window.open('/asset/wholescene')
    },
    showAttr (data) {
      const attr = {
        title: '维度',
        attrType: this.types.DIMENSION,
        name: data.id + '',
        label: data.code,
        data
      }
      this.attrStore.commit('add', attr)
      this.attrStore.commit('setActiveToFirst', attr)
    },
    handleAddDim () {
      this.tabStore.commit('add', {
        label: '新建维度',
        tabType: this.types.DIMENSION,
        name: Date.now() + '',
        component: 'DimensionEdit',
        data: {}
      })
    },
    handleEdit (data) {
      this.tabStore.commit('add', {
        label: '编辑维度：' + data.code,
        tabType: this.types.DIMENSION,
        name: '编辑' + data.id,
        component: 'DimensionEdit',
        data
      })
    },
    handleToDimLogic (row) {
      const opt = {
        label: row.code,
        data: row,
        tabType: this.types.DIMENSIONTABLE,
        name: row.id,
        component: 'DimensionTableEdit'
      }
      this.tabStore.commit('add', opt)
      this.fileStore.commit('add', opt)
      this.fileStore.commit('setActiveToFirst', opt)
    },
    handleExtends (data) {
      this.tabStore.commit('add', {
        label: '继承维度：' + data.code,
        tabType: this.types.DIMENSION,
        name: '继承维度：' + data.id,
        component: 'DimensionEdit',
        data: {
          isExtends: true,
          ...data
        }
      })
    }
  }
}
</script>
