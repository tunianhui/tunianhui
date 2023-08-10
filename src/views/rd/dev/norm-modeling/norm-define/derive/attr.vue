<template>
  <section class="side-attr">
    <div class="subtitle">
      <div>
        <span class="mr-10">{{ viewInfo.code }}</span>
        <span class="status-tag-right">{{
          getDicsValue('status_tag', viewInfo.status)
        }}</span>
      </div>
      <div class="attr-name">{{ viewInfo.name }}</div>
    </div>
    <div class="operate-btn">
      <el-button type="primary" icon="el-icon-edit-outline" @click="edit"
        >编辑</el-button
      >
      <el-button
        type="primary"
        class="mr-10"
        icon="el-icon-view"
        @click="showRelation"
        >查看相关</el-button
      >
      <el-popover
        popper-class="more-popover"
        placement="bottom"
        trigger="hover"
        ref="morepopover"
      >
        <ul class="popper-list">
          <!-- <li>
            <el-button type="text" icon="icon iconfont icon-tongbujichengshuxing" disabled>继承</el-button>
          </li>-->
          <!-- <li>
            <el-button
              type="text"
              icon="icon iconfont icon-weiduluojibiao1"
              :disabled="viewInfo.status=='0'"
            >维度逻辑表</el-button>
          </li>-->
          <li>
            <el-button
              @click="handleOffLine(viewInfo)"
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
        <el-button
          plain
          type="primary"
          icon="icon iconfont icon-gengduo"
          slot="reference"
        ></el-button>
      </el-popover>
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
      <el-form-item label="原子指标">
        <div>{{ viewInfo.atomic_name }}</div>
      </el-form-item>
      <el-form-item label="统计粒度">
        <div>{{ viewInfo.dim_name }}</div>
      </el-form-item>
      <el-form-item label="统计周期">
        <div>{{ viewInfo.cycle_name }}</div>
      </el-form-item>
      <el-form-item label="业务限定">
        <div>{{ viewInfo.condition_name }}</div>
      </el-form-item>
      <el-form-item label="数据类型">
        <div>{{ viewInfo.data_type }}</div>
      </el-form-item>
      <el-form-item label="描述">
        <div>{{ viewInfo.desc }}</div>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import rdAttrMixin from '@/mixins/rd-attr'
import {del, offLine} from '@/api/rd/derive'
import {types} from '@/config/rd-config'
export default {
  name: 'DeriveAttr',
  mixins: [rdAttrMixin],
  inject: ['fileStore'],
  data() {
    return {
      viewInfo: {},
      offLineFetch: offLine,
      delFetch: del
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        this.viewInfo = {...(val || {}).data}
      }
    }
  },
  methods: {
    edit() {
      this.setActiveRdEditDialog({
        // title: '编辑派生指标',
        component: 'DeriveEditDialog',
        data: this.viewInfo
      })
    },
    showRelation() {
      const {data} = this.data
      const opt = {
        label: data.label,
        data: data,
        tabType: types.POLYMERTABLE,
        name: data.id,
        component: 'PolymerTableEdit'
      }
      this.tabStore.commit('add', opt)
      this.fileStore.commit('add', opt)
      this.fileStore.commit('setActiveToFirst', opt)
    }
  }
}
</script>

<style lang="scss"></style>
