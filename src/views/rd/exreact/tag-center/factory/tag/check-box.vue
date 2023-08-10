<template>
  <div class="checked-box">
    <div class="label-filter-group">
      <div class="label-filter-group-list" style="max-height:76px">
        <div :class="['filter-group-option-item', item.is_select ? 'filter-group-checked-option-item' : '']"
          v-for="item in list" :key="item.id"
          @click="selectClickHandle(item)">
          <OverflowTooltip class="width">{{item.name}}</OverflowTooltip>
          <div class="filter-group-checked-option-close" v-if="item.is_select">
            <i class="el-icon-close" @click.stop="closeSelectHandle(item)"></i>
          </div>
        </div>
      </div>
      <!-- <div class="filter-group-arrow">
        <i :class="{'iconfont icon-shousuoxiajiantou': true, 'active': isToggle}"></i>
      </div> -->
    </div>
  </div>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'CheckedBox',
  props: {
    data: Array,
    max: Number,
    isRadio: Boolean
  },
  components: {
    OverflowTooltip
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        this.list = val
      }
    }
  },
  data() {
    return {
      isToggle: false,
      list: []
    }
  },
  methods: {
    selectClickHandle(item) {
      if (this.isRadio) {
        this.list.forEach(item => {
          item.is_select = false
        })
        item.is_select = true
      } else {
        const selectItem = this.list.filter(item => item.is_select === true)
        if (this.max && this.max === selectItem.length) return
        item.is_select = true
      }
      this.$emit('select', this.list)
    },
    closeSelectHandle(item) {
      item.is_select = false
      this.$emit('select', this.list, 'close')
    }
  }
}
</script>
<style lang="scss">
.checked-box {
  .label-filter-group {
    &-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      color: #333;
      overflow: hidden;
      .filter-group-option-item {
        display: inline-block;
        padding: 0 12px;
        border: 1px solid transparent;
        margin: 4px 10px 4px 0;
        background-color: #e2e5f0;
        color: rgba(0,0,0,.5);
        line-height: 26px;
        white-space: nowrap;
        &:hover {
          cursor: pointer;
          background: #D2D6E4;
        }
        &.filter-group-checked-option-item {
          display: inline-flex;
          overflow: hidden;
          height: 28px;
          flex-shrink: 0;
          align-items: center;
          padding: 0 12px;
          border: 1px solid rgba(33,83,212,.3);
          margin-right: 10px;
          background-color: rgba(33,83,212,.05);
          color: #2153d4;
        }
        .width {
          max-width: 130px;
        }
        .filter-group-checked-option-close {
          position: relative;
          width: 14px;
          height: 14px;
          align-self: flex-end;
          margin-right: -20px;
          margin-left: 6px;
          background: #2153d4;
          cursor: pointer;
          transform: skewX(-45deg);
          i {
            position: absolute;
            top: 3.5px;
            right: 3.5px;
            color: hsla(0,0%,100%,.7);
            font-weight: bolder;
            transform: skewX(45deg) scale(.45);
            transition: transform .2s ease;
          }
        }
      }
    }
    .filter-group-arrow {
      height: 28px;
      line-height: 28px;
      text-align: center;
      > i {
        color: rgba(0,0,0,.5);
        cursor: pointer;
        transition: all .3s;
        display: inline-block;
        &.active {
          transform: rotate(-180deg);
        }
      }
    }
  }
}
</style>
