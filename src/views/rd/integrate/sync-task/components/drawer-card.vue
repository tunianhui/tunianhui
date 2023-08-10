<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-30 15:50:19
 * @LastEditTime: 2023-02-20 15:42:25
 * @Description:
-->
<template>
  <div class="drawer-card">
    <div class="header-card">
      <span>运行日志</span>
      <div class="filter-arrow">
        <i :class="{'iconfont icon-shousuoxiajiantou': true, 'active': isToggle}" @click="hidden"></i>
      </div>
    </div>
    <MonacoEditor readonly :code.sync="rawScript" style="height: 320px" />
  </div>
</template>

<script>
export default {
  name: 'DrawerCard',
  props: {
    isArrow: {
      type: Boolean,
      default: true
    }
  },
  watch: {},
  data () {
    return {
      rawScript: null,
      // style: { height: '44px', overflow: 'hidden' },
      isToggle: false
    }
  },
  created () { },
  methods: {
    hidden () {
      this.$emit('hidden')
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-card {
  position: absolute;
  bottom: 30px;
  width: 100%;
  .header-card {
    background-color: #292f40;
    padding: 5px 20px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .filter-arrow {
      display: flex;
      height: 26px;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      i {
        // color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        transition: all 0.3s;
        display: inline-block;
        &.active {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
