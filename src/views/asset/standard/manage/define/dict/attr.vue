<template>
  <div class="dict-attr side-attr">
    <div class="subtitle">
      <div>
        <span class="mr-10">{{ data.data.range_name }}</span>
      </div>
      <div class="attr-name">{{ data.data.range_code }}</div>
    </div>
    <div class="operate-btn">
      <el-button
        type="primary"
        icon="el-icon-edit-outline"
        @click.stop="handleEdit"
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
      <div class="third-title">基本信息</div>
      <el-form-item label="编码">
        <div>{{ data.data.range_code }}</div>
      </el-form-item>
      <el-form-item label="别名">
        <div>{{ data.data.range_alias }}</div>
      </el-form-item>
      <el-form-item label="所属类目">
        <div>{{ data.data.catalog_name }}</div>
      </el-form-item>
      <el-form-item label="描述">
        <div>{{ data.data.range_desc }}</div>
      </el-form-item>
    </el-form>
    <div class="third-title">数据字典</div>
    <el-table
      :data="data.data.params"
      style="width: 100%"
      max-height="200px">
      <el-table-column
        prop="param_key"
        label="值编码">
          <template slot-scope="scope">
            <OverflowTooltip class="my-width">{{scope.row.param_key}}</OverflowTooltip>
          </template>
      </el-table-column>
      <el-table-column
        prop="param_value"
        label="值名称">
        <template slot-scope="scope">
          <OverflowTooltip class="my-width">{{scope.row.param_value}}</OverflowTooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="third-title">关联数据标准</div>
    <el-table
      :data="data.data.elementRelation"
      style="width: 100%"
      max-height="200px">
      <el-table-column
        prop="std_code"
        label="标准编号">
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
import {
  deleteDict
} from '@/api/asset/standard/dict.js'
export default {
  name: 'DictAttr',
  mixins: [standardAttrMixin],
  data() {
    return {
      delFetch: deleteDict,
      paramsKey: 'range_id'
    }
  },
  methods: {
    handleSameSource() {},
    handleEdit() {
      this.setActiveRdEditDialog({
        title: '编辑数据字典',
        component: 'DictEditDialig',
        data: this.data.data
      })
    }
  }
}
</script>
