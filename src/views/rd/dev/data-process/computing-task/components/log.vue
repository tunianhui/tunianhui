<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-30 15:50:19
 * @LastEditTime: 2023-05-22 10:29:23
 * @Description:
-->
<template>
  <div class="drawer-card">
    <div class="header-card">
      <div class="type-wrapper">
        <span :class="{'is-active': type === 1 }" @click="type = 1">日志</span>
        <span :class="{'is-active': type === 2 }" @click="type = 2" class="ml-10">结果</span>
        <!-- <i class="icon el-icon-refresh" title="刷新" @click="getLogs"></i> -->
      </div>
      <div class="filter-arrow">
        <i :class="{'iconfont icon-shousuoxiajiantou': true, 'active': isToggle}" @click="hidden"></i>
      </div>
    </div>
    <!-- 日志 -->
    <MonacoEditor v-show="type === 1" readonly :code.sync="logData" class="editor" />
    <!-- 运行结果 -->
    <div v-show="type === 2" class="editor">
    </div>
  </div>
</template>

<script>
export default {
  name: 'DrawerCard',
  props: {
    isArrow: {
      type: Boolean,
      default: true
    },
    logData: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      type: 1,
      isToggle: false
    }
  },
  created () { },
  methods: {
    handleClick (val) {

    },
    hidden () {
      this.$emit('hidden')
    },
    getLogs () {
      this.$emit('refresh')
    }
  }
}
</script>

<style lang="scss" scoped>
.type-wrapper {
  span {
    line-height: 1.5;
    padding-bottom: 5px;
    border-bottom: 2px solid none;
    cursor: pointer;
  }
  .is-active {
    // text-decoration: underline;
    // text-decoration-color: white;
    border-bottom: 2px solid #fff;
  }
}

.icon {
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
}
.editor {
  height: 320px;
  background-color: #292f40;
  padding: 0 20px;
}
.drawer-card {
  position: absolute;
  bottom: 30px;
  width: 100%;
  font-size: 12px;
  .header-card {
    background-color: #292f40;
    padding: 5px 20px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    > ul {
      li {
        &.is-disabled {
          span {
            color: $grey4;
            cursor: default;
          }
        }
        span {
          padding: 10px 0px 5px 0px;
          margin-right: 20px;
          color: $grey6;
          font-size: 12px;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          &.active {
            border-bottom: 2px solid currentColor;
          }
        }
      }
    }

    .filter-arrow {
      display: flex;
      height: 26px;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      i {
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
