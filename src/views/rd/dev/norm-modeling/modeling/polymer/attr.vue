<template>
  <section class="side-attr" v-loading="!!loading">
    <div class="subtitle">
      <div>
        <span class="mr-10">{{viewInfo.derivative_code}}</span>
        <span class="status-tag-right">{{getDicsValue('status_tag', viewInfo.status)}}</span>
      </div>
      <div class="attr-name">{{viewInfo.derivative_name}}</div>
    </div>
    <div class="operate-btn">
      <el-button type="primary" icon="el-icon-edit-outline" @click="handleEdit('编辑')">编辑</el-button>
      <!-- <el-button type="primary" plain icon="el-icon-view" @click="handleSameSourceLimit">查看同源</el-button> -->
      <el-button plain type="primary" icon="icon iconfont icon-gengduo" v-popover:morepopover>
        <el-popover
          popper-class="more-popover"
          placement="bottom"
          trigger="hover"
          ref="morepopover"
        >
          <ul class="popper-list">
            <li>
              <el-button
                @click="handleOffLine"
                type="text"
                icon="iconfont icon-xiaxian2"
                :disabled="!['0', '6'].includes(viewInfo.status)"
              >&nbsp;下线</el-button>
            </li>
            <li>
              <el-button @click="handleDelete" type="text" icon="el-icon-delete">删除</el-button>
            </li>
          </ul>
        </el-popover>
      </el-button>
    </div>
    <el-form class="view-form" label-width="110px" label-position="right" label-suffix="：">
      <el-form-item label="业务板块">
        <div>{{viewInfo.business_field_name}}</div>
      </el-form-item>
      <el-form-item label="所属项目">
        <div>{{viewInfo.project_name}}</div>
      </el-form-item>
      <el-form-item label="项目空间类型">
        <div>{{viewInfo.space_type_name}}</div>
      </el-form-item>
      <el-form-item label="原子指标">
        <div>{{viewInfo.atomic_name}}</div>
      </el-form-item>
      <el-form-item label="统计粒度">
        <div>{{viewInfo.dim_name}}</div>
      </el-form-item>
      <el-form-item label="统计周期">
        <div>{{viewInfo.cycle_name}}</div>
      </el-form-item>
      <el-form-item label="业务限定">
        <div>{{viewInfo.condition_name}}</div>
      </el-form-item>
      <el-form-item label="数据类型">
        <div>{{viewInfo.data_type}}</div>
      </el-form-item>
      <el-form-item label="描述">
        <div>{{viewInfo.desc}}</div>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import {delLimit, offLine, queryLimit} from '@/api/rd/limit'
import rdAttrMixin from '@/mixins/rd-attr'
import {types} from '@/config/rd-config'
export default {
  name: 'LimitAttr',
  mixins: [rdAttrMixin],
  data() {
    return {
      offLineFetch: offLine,
      delFetch: delLimit
    }
  },
  created() {
  },
  methods: {
    async getData() {
      Object.assign(this.viewInfo, this.data)
      // this.loading++
      // const res = await this.$simpleAsyncTo(
      //   queryLimit({
      //     id: this.data.data.id
      //   }),
      //   '查询业务限定失败'
      // )
      // if (res) {
      //   this.viewInfo = res.data
      // }
      // this.loading--
    },
    // 编辑
    handleEdit(title) {
      this.setActiveRdEditDialog({
        title: `${title}业务限定`,
        component: 'LimitEditDialog',
        data: this.viewInfo
      })
    }
  }
}
</script>
