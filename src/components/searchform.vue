<template>
    <!-- <div class="search-form-wrapper" :class="{'has-rule': hasRule}">
    <div class="search-form clearfix" :class="{'has-more-filter': !allFilterVisible, 'more': moreBtnVisible}" ref="searchForm" @keyup.enter="searchHandle"> -->
    <div class="search-form-wrapper">
     <div class="search-form clearfix" ref="searchForm" @keyup.enter="searchHandle">
      <div class="form-wrapper" ref="formWrapper">
        <slot></slot>
        <el-button type="primary" size="mini" @click="searchHandle">查询</el-button>
        <el-button type="default" size="mini" @click="resetForm">重置</el-button>
      </div>
      <!-- <div class="search-btns">
        <el-button type="primary" size="mini" @click="searchHandle">查询</el-button>
        <el-button type="default" size="mini" @click="resetForm">重置</el-button>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
    name: 'SearchForm',
    props: {
        formRef: {
        type: Object,
        default() {
          return {}
        }
      },
    },
    methods: {
        searchHandle() {
          this.$debounce(_ => {
            this.$emit('search')
          }, 1000)()
        },
        resetForm() {
          this.formRef.resetFields()
          this.$emit('reset')
        }
    }
}
</script>
<style lang="less">
.search-form-wrapper {
  // width: 1700px;
  .search-form {
    .form-wrapper {
      display: flex;
      // float: left;
      margin-top: 20px;
      .el-button {
        height: 29px;
        margin-right: 10px;
        // float: left;
      }
    }

    // .search-btns {
    //   // width: 150px;
    //   float: left;
    //   margin-top: 20px;
    // }
  }
}
</style>