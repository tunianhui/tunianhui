<template>
  <section class="side-attr" v-loading="!!loading">
    <div class="subtitle">
      <div>
        <span class="mr-10">{{ viewInfo.atomic_alias }}</span>
        <span class="status-tag-right">{{
          getDicsValue('status_tag', viewInfo.status)
        }}</span>
      </div>
      <div class="attr-name">{{ viewInfo.atomic_name }}</div>
    </div>
    <div class="operate-btn">
      <el-button
        type="primary"
        icon="el-icon-edit-outline"
        @click.stop="handleEdit('编辑')"
        >编辑</el-button
      >
      <el-button
        type="primary"
        plain
        icon="el-icon-view"
        @click="handleSameSource"
        >查看同源</el-button
      >
      <el-button
        plain
        type="primary"
        icon="icon iconfont icon-gengduo"
        v-popover:morepopover
      >
        <el-popover
          popper-class="more-popover"
          placement="bottom"
          trigger="hover"
          ref="morepopover"
        >
          <ul class="popper-list">
            <li>
              <el-button
                type="text"
                icon="icon el-icon-copy-document"
                @click="handleEdit('克隆')"
                disabled
                >克隆</el-button
              >
            </li>
            <li>
              <el-button
                type="text"
                :disabled="!['0', '6', '7'].includes(viewInfo.status)"
                icon="icon iconfont icon-guanlianweiduluojibiao"
                @click="handleRelatedDerive"
              >
                相关派生指标
              </el-button>
            </li>
            <li>
              <el-button
                type="text"
                icon="icon iconfont icon-chuangjianpaishengzhibiao"
                @click="handleCreateDerive"
                >创建派生指标</el-button
              >
            </li>
            <li>
              <el-button
                @click="handleOffLine"
                type="text"
                icon="iconfont icon-xiaxian2"
                :disabled="!['0', '6', '7'].includes(viewInfo.status)"
              >
                &nbsp;下线
              </el-button>
            </li>
            <li>
              <el-button @click="handleDelete" type="text" icon="el-icon-delete"
                >删除</el-button
              >
            </li>
          </ul>
        </el-popover>
      </el-button>
    </div>
    <el-form
      class="view-form"
      label-width="110px"
      label-position="right"
      label-suffix="："
    >
      <el-form-item label="业务板块">
        <div>{{ viewInfo.business_field_name }}</div>
      </el-form-item>
      <el-form-item label="所属项目">
        <div>{{ viewInfo.project_name }}</div>
      </el-form-item>
      <el-form-item label="项目空间类型">
        <div>{{ viewInfo.space_type_name }}</div>
      </el-form-item>
      <el-form-item label="数据域">
        <div>{{ viewInfo.data_field_name }}</div>
      </el-form-item>
      <el-form-item label="英文名">
        <div>{{ viewInfo.atomic_alias }}</div>
      </el-form-item>
      <el-form-item label="名称">
        <div>{{ viewInfo.atomic_name }}</div>
      </el-form-item>
      <el-form-item label="计算逻辑">
        <MonacoEditor readonly :code="viewInfo.sql_content" />
      </el-form-item>
      <el-form-item label="描述">
        <div>{{ viewInfo.atomic_desc }}</div>
      </el-form-item>
      <el-form-item label="数据类型">
        <div>{{ viewInfo.data_type }}</div>
      </el-form-item>
      <el-form-item label="数据叠加">
        <div>{{ cumulTag }}</div>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import {del, offLine, queryById} from '@/api/rd/atom'
import rdAttrMixin from '@/mixins/rd-attr'
import {types, cumulTags} from '@/config/rd-config'
export default {
  name: 'AtomAttr',
  mixins: [rdAttrMixin],
  data() {
    return {
      offLineFetch: offLine,
      delFetch: del
    }
  },
  computed: {
    cumulTag() {
      return cumulTags[this.viewInfo.cumul_tag]
    }
  },
  methods: {
    async getData() {
      this.loading++
      const res = await this.$simpleAsyncTo(
        queryById({
          id: this.data.data.id
        }),
        '查询业务限定失败'
      )
      if (res) {
        this.viewInfo = res.data
        this.viewInfo.sql_content = this.viewInfo.sql_content ? this.decrypt(this.viewInfo.sql_content) : ''
      }
      this.loading--
    },
    // 编辑
    handleEdit(title) {
      this.setActiveRdEditDialog({
        title: `${title}原子指标`,
        component: 'AtomEditDialog',
        data: this.viewInfo
      })
    },
    handleSameSource() {
      this.tabStore.commit('add', {
        label: `同源原子指标${this.viewInfo.atomic_alias}`,
        tabType: types.DERIVE,
        name: this.viewInfo.id + '同源原子指标',
        component: 'AtomEdit',
        data: this.viewInfo
      })
    },
    handleRelatedDerive() {
      this.$store.commit(`dev/SET_ACTIVE`, types.DERIVE)
      this.tabStore.commit('add', {
        label: '对象页表页',
        tabType: types.OBJECTTABLE,
        name: `dev_${types.OBJECTTABLE}`, // tab页的标识
        component: `DevObjectTable`,
        data: {
          atomic_id: this.viewInfo.atomic_id,
          atomic_alias: this.viewInfo.atomic_alias
        }
      })
    },
    handleCreateDerive() {
      this.tabStore.commit('add', {
        label: '新建派生指标',
        name: `new_derive`,
        tabType: types.DERIVE,
        component: 'DeriveEdit',
        data: {
          params: {
            id: this.viewInfo.atomic_id,
            value: this.viewInfo.atomic_name,
            key: 'atomic_name'
          }
        }
      })
    }
  }
}
</script>
