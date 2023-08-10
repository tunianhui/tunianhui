<template>
  <div class="category-attr side-attr">
    <div class="subtitle">
      <div>
        <span class="mr-10">{{ data.data.catalog_name }}</span>
      </div>
      <div class="attr-name">{{ data.data.code }}</div>
    </div>
    <div class="operate-btn">
      <el-button
        type="primary"
        icon="el-icon-edit-outline"
        @click.stop="handleEdit('编辑')"
        :disabled="!data.data.parentId"
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
              <el-button @click="handleDelete" type="text" icon="el-icon-delete"
              :disabled="!data.data.parentId"
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
      <div class="third-title">基本信息</div>
      <el-form-item label="编码">
        <div>{{ data.data.catalog_code }}</div>
      </el-form-item>
      <el-form-item label="名称">
        <div>{{ data.data.catalog_name }}</div>
      </el-form-item>
      <el-form-item label="描述">
        <div>{{ data.data.catalog_desc }}</div>
      </el-form-item>
      <el-form-item label="涉密属性">
        <div>{{ data.data.secret_level }}</div>
      </el-form-item>
      <el-form-item label="共享属性">
        <div>{{ data.data.share_attr }}</div>
      </el-form-item>
    </el-form>
    <div class="third-title">关联数据标准</div>
    <el-table
      :data="data.data.elementRelation"
      style="width: 100%">
      <el-table-column
        prop="std_code"
        label="标准编码">
          <template slot-scope="scope">
            <OverflowTooltip class="my-width">{{scope.row.std_code}}</OverflowTooltip>
          </template>
      </el-table-column>
      <el-table-column
        prop="std_name"
        label="标准名称">
        <template slot-scope="scope">
          <OverflowTooltip class="my-width">{{scope.row.std_name}}</OverflowTooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import standardAttrMixin from '@/mixins/standard-attr'
import {delCatalog} from '@/api/asset/standard/category.js'
export default {
  name: 'CategoryAttr',
  mixins: [standardAttrMixin],
  data() {
    return {
      delFetch: delCatalog,
      paramsKey: 'catalog_id'
    }
  },
  methods: {
    handleEdit(text) {
      console.log(this.data)
      this.setActiveRdEditDialog({
        title: '编辑类目',
        component: 'CategoryEditDialog',
        data: this.data.data
      })
    }
  }
}
</script>
