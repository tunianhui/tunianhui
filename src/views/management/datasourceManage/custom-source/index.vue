<template>
  <div class="custom-srouce">
    <TabsHeader
      title="数据源"
      :tabs="[]"
      active=""
      height="40px"
      :borderBottomWrapper="false"
    >
      <div slot="right" style="display: flex;align-items: center;">
        <span class="mr-10 ml-10">
          <el-input v-model="searchVal" placeholder="请输入搜索关键字" @input="inputSearch">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </span>
        <el-button @click="showFileterItem = !showFileterItem">
          <i class="iconfont icon-filter"></i>
          {{showFileterItem ? '收起' : '筛选'}}
        </el-button>
        <el-button type="primary" @click="addCustomSource">
          <i class="el-icon-plus"></i>
          新建自定义源类型
        </el-button>
      </div>
    </TabsHeader>
  </div>
</template>

<script>
import TabsHeader from '@c/tabs-header'
export default {
  name: 'CustomSource',
  components: {
    TabsHeader
  },
  data() {
    return {
      showFileterItem: false,
    }
  },
  methods: {
    addCustomSource() {},
    inputSearch() {}
  }
}
</script>

<style lang="scss" scoped>
.custom-srouce {
  padding: 10px 15px 0 15px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgb(229, 228, 233);
}
</style>
