<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-08-07 17:00:01
 * @LastEditTime: 2021-08-07 17:00:20
 * @Description:
-->
<template>
  <div class='criterion-attr side-attr'>
    <div class="subtitle">
      <div>
        <span class="mr-10">{{ data.data.std_name }}</span>
      </div>
      <div class="attr-name">{{ data.data.std_code }}</div>
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
      <el-form-item label="业务板块">
        <div>{{ data.data.busin_name }}</div>
      </el-form-item>
      <el-form-item label="一级分类">
        <div>{{ data.data.one_catalog_name }}</div>
      </el-form-item>
      <el-form-item label="二级分类">
        <div>{{ data.data.two_catalog_name }}</div>
      </el-form-item>
      <el-form-item label="三级分类">
        <div>{{ data.data.three_catalog_name }}</div>
      </el-form-item>
      <div class="third-title">业务属性</div>
      <el-form-item label="业务规则">
        <div>{{ data.data.busin_rule }}</div>
      </el-form-item>
      <el-form-item label="值域">
        <div>{{ data.data.range_name }}</div>
      </el-form-item>
      <el-form-item label="标准依据">
        <div>{{ data.data.busin_quote }}</div>
      </el-form-item>
      <el-form-item label="业务定义">
        <div>{{ data.data.busin_desc }}</div>
      </el-form-item>
      <div class="third-title">技术属性</div>
      <el-form-item label="数据类型">
        <div>{{ data.data.std_type }}</div>
      </el-form-item>
      <el-form-item label="数据格式">
        <div>{{ data.data.std_accuracy }}</div>
      </el-form-item>
      <el-form-item label="代码编码规则">
        <div>{{ data.data.code_rule }}</div>
      </el-form-item>
      <el-form-item label="代码引用">
        <div>{{ data.data.code_quote }}</div>
      </el-form-item>
      <div class="third-title">管理属性</div>
      <el-form-item label="标准归属部门">
        <div>{{ data.data.department_name }}</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import standardAttrMixin from '@/mixins/standard-attr'
import {deleteStandard} from '@/api/asset/standard/criterion.js'
export default {
  name: 'CriterionAttr',
  mixins: [standardAttrMixin],
  props: {},
  components: {},
  data() {
    return {
      delFetch: deleteStandard,
      paramsKey: 'std_id'
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    handleSameSource() {},
    handleEdit() {
      this.tabStore.commit('add', {
        label: '编辑标准',
        tabType: this.types.CRITERION,
        name: this.data.data.id,
        component: 'CriterionEdit',
        data: this.data.data
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>
