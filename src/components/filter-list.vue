<template>
  <section class="filter-list">
    <el-input
      prefix-icon="el-icon-search"
      size="medium"
      @input="filterData"
      clearable
      placeholder="请输入关键字搜索"
      v-model="keyword"
    ></el-input>
    <ul>
      <li
        v-for="item in list.filter(item => item.visible)"
        :key="item.element_id"
        @click="changeActive(item)"
        :class="{'is-active': value === item.element_id, 'is-disabled': item.disabled}"
        v-html="$highlightKeyword(item.element_code, keyword)"
      ></li>
    </ul>
  </section>
</template>

<script>
// import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'FilterList',
  props: {
    data: Array,
    value: [String, Number]
  },
  data() {
    return {
      keyword: '',
      list: []
    }
  },
  created() {
    // this.list = cloneDeep(this.data)
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.list = val.map(item => {
          return {
            ...item,
            visible: true
          }
        })
      }
    }
  },
  methods: {
    changeActive(item) {
      if (item.disabled) return
      this.$emit('update:value', item.element_id)
      this.$emit('change', item)
    },
    filterData(value) {
      this.$debounce(_ => {
        this.list.forEach(item => {
          const reg = new RegExp(this.keyword, 'i')
          item.visible = reg.test(item.element_code)
        })
      }, 200)()
    }
  }
}
</script>

<style lang="scss">
.filter-list {
  height: 100%;
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $grey7;
    border-radius: 0;
  }
  ul {
    height: calc(100% - 44px);
    overflow: auto;
    margin-top: 8px;

    li {
      color: $grey2;
      height: 33px;
      line-height: 33px;
      padding: 0 10px;
      &.is-active,
      &:hover {
        // color: $grer2;
        background: $grey6;
        cursor: pointer;
      }
      &.is-disabled {
        color: $grey4;
        background: $grey7;
        cursor: not-allowed;
      }
    }
  }
}
</style>
