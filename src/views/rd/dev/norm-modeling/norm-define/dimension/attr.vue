<template>
  <section class="side-attr" v-loading="!!loading">
    <div class="subtitle">
      <div>
        <span class="mr-10">{{ viewInfo.dim_code }}</span>
        <span class="status-tag-right">{{
          getDicsValue('status_tag', viewInfo.status)
        }}</span>
      </div>
      <div class="attr-name">{{ viewInfo.dim_name }}</div>
    </div>
    <div class="operate-btn">
      <el-button type="primary" icon="el-icon-edit-outline" @click="handleEdit"
        >编辑</el-button
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
                icon="icon iconfont icon-tongbujichengshuxing"
                @click="extendsHandle"
                disabled
                >继承</el-button
              >
            </li>
            <!-- <li>
              <el-button
                type="text"
                icon="icon iconfont icon-weiduluojibiao1"
                :disabled="viewInfo.status=='0'"
              >维度逻辑表</el-button>
            </li>-->
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
      <div class="third-title">维度基本信息</div>
      <el-form-item label="业务板块">
        <div>{{ viewInfo.business_field_name }}</div>
      </el-form-item>
      <el-form-item label="所属项目">
        <div>{{ viewInfo.project_name }}</div>
      </el-form-item>
      <el-form-item label="数据域">
        <div>{{ viewInfo.data_field_name }}</div>
      </el-form-item>
      <el-form-item label="维度英文名">
        <div>{{ viewInfo.dim_code }}</div>
      </el-form-item>
      <el-form-item label="维度名称">
        <div>{{ viewInfo.dim_name }}</div>
      </el-form-item>
      <el-form-item label="维度类型">
        <div>{{ getDicsValue('dim_type', viewInfo.dim_type) }}</div>
      </el-form-item>
      <el-form-item label="维度描述">
        <div>{{ viewInfo.dim_desc }}</div>
      </el-form-item>
      <div class="third-title">维度主键信息</div>
      <div v-if="viewInfo.dim_type === 'general'">
        <el-form-item label="主键英文名">
          <div>{{ viewInfo.pk_code }}</div>
        </el-form-item>
        <el-form-item label="主键名称">
          <div>{{ viewInfo.pk_name }}</div>
        </el-form-item>
        <el-form-item label="主键类型">
          <div>{{ viewInfo.pk_type }}</div>
        </el-form-item>
        <el-form-item label="主键计算逻辑">
          <MonacoEditor readonly :code.sync="viewInfo.sql_content" />
        </el-form-item>
      </div>
      <div v-if="viewInfo.dim_type === 'enum'">
        <el-table :data="viewInfo.enum_dim_table_list">
          <el-table-column
            prop="param_key"
            label="code(编码)"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="param_value"
            label="value(取值)"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
    </el-form>
  </section>
</template>

<script>
import {types} from '@/config/rd-config' //eslint-disable-line
import {delDim, offLine, queryGeneral, queryEnum} from '@/api/rd/dimension'
import rdAttrMixin from '@/mixins/rd-attr'

export default {
  name: 'DimensionAttr',
  mixins: [rdAttrMixin],
  inject: ['tabStore'],
  data() {
    return {
      viewInfo: {},
      offLineFetch: offLine,
      delFetch: delDim,
      interfaces: {
        general: queryGeneral,
        enum: queryEnum
      },
      loading: 0
    }
  },
  methods: {
    async getData() {
      const {dim_type, id} = this.data.data
      const queryInterface = this.interfaces[dim_type]
      if (!queryInterface) {
        const {dimensionDatas, dimAttrDatas} = this.data.data
        this.viewInfo = {
          ...dimensionDatas,
          ...dimAttrDatas
        }
        this.viewInfo.sql_content = this.viewInfo.sql_content ? this.decrypt(this.viewInfo.sql_content) : ''
      } else {
        this.loading++
        const res = await this.$simpleAsyncTo(
          queryInterface({dim_id: id}),
          '查询维度失败'
        )
        if (res) {
          const {dimensionDatas, dimAttrDatas} = res.data
          this.viewInfo = {
            ...dimensionDatas,
            ...dimAttrDatas
          }
          this.viewInfo.sql_content = this.viewInfo.sql_content ? this.decrypt(this.viewInfo.sql_content) : ''
        }
        this.loading--
      }
    },
    extendsHandle() {}
  }
}
</script>

<style lang="scss">
.dimension-attr {
  .dim-name {
    color: $grey4;
    font-size: 14px;
    padding-bottom: 10px;
  }
  .view-form {
    .el-form-item {
      margin-bottom: 5px;
    }
    .el-form-item__label {
      color: $grey4;
    }
  }
}
</style>
