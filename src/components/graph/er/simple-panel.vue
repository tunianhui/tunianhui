<template>
  <div class="simple-panel flow-simple-panel">
    <div class="simple-panel-head">
      <transition name="el-zoom-in-center">
        <div class="head-info" v-show="!visibleInput">
          <span>
            <i class="el-icon-tickets"></i>
            {{data.code}}
          </span>
          <span>
            <i class="el-icon-search" @click="showInput"></i>
          </span>
        </div>
      </transition>
      <transition name="el-zoom-in-center">
        <div class="head-search" v-show="visibleInput">
          <el-input
            v-model="keyword"
            placeholder="请输入关键字搜索"
            prefix-icon="el-icon-search"
            autofocus
            @blur="hideInput"
          >
            <i slot="suffix" class="el-input__icon el-icon-close" @click="hideInput"></i>
          </el-input>
        </div>
      </transition>
    </div>
    <div class="simple-panel-body" :style="{'max-height': `${maxHeight - 52}px`}">
      <!-- , {'is-active': activeItem.element_id === item.element_id} -->
      <div
        v-for="item in list"
        :class="['simple-panel-item']"
        :key="item.element_id"
        @click="handleClick(item)"
      >
        <span :title="item.element_code" v-html="$highlightKeyword(item.element_code, keyword)"></span>
        <span :title="item.element_name" v-html="$highlightKeyword(item.element_name, keyword)"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimplePanel',
  props: {
    data: Object,
    maxHeight: Number
  },
  data() {
    return {
      keyword: '',
      visibleInput: false,
      activeItem: {}
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.activeItem = {}
      }
    }
  },
  computed: {
    list() {
      return this.filter()
    }
  },
  methods: {
    filter() {
      const reg = new RegExp(this.keyword, 'i')
      return this.data.list.filter(
        item =>
          (reg.test(item.element_name) || reg.test(item.element_code)) &&
          !item.head
      )
    },
    showInput() {
      this.visibleInput = true
    },
    hideInput() {
      this.visibleInput = false
      this.keyword = ''
    },
    handleClick(item) {
      this.activeItem = item
      this.$emit('item-click', item)
    }
  }
}
</script>

<style lang="scss">
.flow-simple-panel {
  margin: 0 30px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.18);

  &:hover {
    box-shadow: 0 0 10px 0 #87c1ce;
  }

  $headerHeight: 52px;
  .simple-panel-head {
    padding: 10px;
    height: $headerHeight;
    background-color: $sideMenuDeep;
    position: relative;

    .head-info {
      display: flex;
      justify-content: space-between;
      color: $grey8;

      .el-icon-tickets {
        color: $--color-primary;
        margin-right: 5px;
        font-size: 16px;
      }
      .el-icon-search {
        color: $grey4;
        font-size: 16px;
        margin-top: 8px;
        margin-right: 3px;
        &:hover {
          color: $grey6;
          cursor: pointer;
        }
      }
    }
    .head-search {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      padding: 10px;

      .el-icon-close {
        cursor: pointer;
        &:hover {
          color: $grey3;
        }
      }
    }
  }
  .simple-panel-body {
    overflow: auto;
    background-color: $grey10;
  }
  .simple-panel-item {
    height: 40px;
    line-height: 40px;
    display: flex;
    padding: 0 15px;
    cursor: pointer;

    &:hover,
    &.is-active {
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.18);
    }
    span {
      flex: 1;
      @include textEllipsis;

      &:first-child {
        margin-right: 15px;
      }
    }
  }
}
</style>
