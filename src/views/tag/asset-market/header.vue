<template>
  <div class="center-header">
    <div class="title">资产总数：20</div>
    <div>
      <el-checkbox v-model="checked1" @change="val => change(val, 'current')">当前层级标签</el-checkbox>
      <el-checkbox v-model="checked2" @change="val => change(val, 'me')">只看我的</el-checkbox>
      <el-button icon="el-icon-shopping-cart-2" class="ml-10" @click="applyBlue">申请蓝</el-button>
      <el-button icon="iconfont icon-filter" class="ml-10" @click="filter">
        <span class="ml-5">筛选</span>
      </el-button>
      <el-button class="ml-10" @click="goCreate">
        <span class="ml-5">前往新建标签</span>
        <i class="el-icon-arrow-right ml-5"></i>
      </el-button>
      <el-button class="ml-10" @click="refresh">
        <i class="el-icon-refresh-right"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AssetMarketHeader',
  data() {
    return {
      checked1: false,
      checked2: false
    }
  },
  methods: {
    change(val, type) {
      this.$emit('change', val, type)
    },
    // 申请蓝
    applyBlue() {
      this.$emit('applyBlue')
    },
    // 筛选
    filter() {
      this.$emit('filter')
    },
    // 前往新建标签
    goCreate() {
      this.$emit('goCreate')
    },
    // 刷新
    refresh() {
      this.$emit('refresh')
    }
  }
}
</script>

<style lang="scss" scoped>
.center-header {
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding: 0px 20px 0 20px;
  .title {
    font-size: 14px;
    color: #333333;
    font-weight: 600;
  }
}
</style>