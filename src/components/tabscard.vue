<template>
  <section class="card-tabs">
    <div :class="['card-tabs-head', headBorder && 'card-tabs-head-border']">
      <div class="card-tabs-head-left">
        <div class="card-tabs-title">{{title}}</div>
        <!-- <ul class="card-tabs-tabs" v-if="tabs && tabs.length && tabs[0].children"> -->
          <!-- <li v-for="tab in tabs" :key="tab.key" :class="value === tab.key && 'is-active'" @click="tabClick(tab)" @mouseleave="mouseclick(tab)"> -->
          <!-- <li v-for="tab in tabs" :key="tab.key" :class="value === tab.key && 'is-active'" @mouseenter="onclice(tab)" @mouseleave="mouseclick(tab)" >
            {{tab.label}}
          <el-dropdown split-button type="text"  placement="bottom" @command="commandhandle" trigger="click">
          <el-dropdown-menu slot="dropdown" class="dropdownMenu">
            <el-dropdown-item  :icon="item.icon" :command="item.key" v-for="item in submenuList" :key="item.key" :label="item.label" :value="item.key">{{ item.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </li>
        </ul> -->
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
              <el-submenu index="1" >
                <template slot="title">存储</template>
                <el-menu-item :index="item.key" v-for="item in submenuList" :key="item.key" :label="item.label" :value="item.key"><i :class="item.icon"></i>{{ item.label }}</el-menu-item>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">计算</template>
                <el-menu-item :index="item.key" v-for="item in submenuList1" :key="item.key" :label="item.label" :value="item.key">
                  <i :class="item.icon"></i>
                  {{ item.label }}</el-menu-item>
              </el-submenu>
          </el-menu>
      </div>
      <div class="card-tabs-head-right">
        <slot name="right"></slot>
      </div>
    </div>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'TabsCard',
  props: {
    title: String,
    tabs: Array,
    value: String,
    headBorder: Boolean,
    // activeIndex: String
  },
  data() {
    return {
      submenuList: [],
      selectTab: '',
      activeIndex: 'store',
      submenuList:[{label: '健康分', key: 'store', icon: 'el-icon-s-help'},{label: '存储量',key: 'storageSapacity', icon: 'el-icon-attract'}],
      submenuList1: [{label: '健康分', key: 'compute', icon: 'el-icon-help'},{label: '内存', key: 'internalStorage', icon: 'el-icon-document-add'}, {label: 'CPU', key: 'cpu', icon: 'el-icon-cpu'}]
    }
  },
  methods: {
    handleSelect(val) {
      this.$emit('comm-click', val)
    },
    onclice(tab) {
      this.submenuList = tab.children
      if (tab.key !== this.selectTab) {
        this.$emit('input', tab.key)
        this.$emit('tab-click', tab)
        this.$emit('comm-click', tab.key)
      }
    },
    mouseclick(tab) {
      this.selectTab = tab.key
    },
    tabClick(tab) {
      this.submenuList = tab.children
      // if (tab.key !== this.selectTab) {
        this.$emit('input', tab.key)
        this.$emit('tab-click', tab)
        this.$emit('comm-click', tab.key)
      // }
      // this.$emit('input', tab.key)
      // this.$emit('tab-click', tab)
      // this.$emit('comm-click', tab.key)
    },
    commandhandle(val) {
      this.$emit('comm-click', val)
    }
  }
}
</script>

<!-- <style lang="scss" scoped>
.card-tabs {
  &-head {
    /* padding-bottom: 6px; */
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    &-border {
      border-bottom: 1px solid $grey6;
    }

    &-left {
      display: flex;

      height: 32px;
      line-height: 32px;
    }
  }

  &-tabs {
    display: flex;
    font-size: 12px;
    margin-left: 15px;
    margin-top: 2px;
    li {
      // border: 1px solid black;
      .el-dropdown{
        .el-dropdown-link{
          cursor: pointer;
          color: black;
        }
    }
      padding: 0 4px;
      color: $grey3;
      margin-right: 30px;
      position: relative;
      cursor: pointer;

      &::before {
        content: '';
        display: block;
        width: 0;
        height: 2px;
        background: $--color-primary;
        position: absolute;
        bottom: 0;
        left: 50%;
        transition: $transition;
      }

      &.is-active {
        color: $grey1;
        &::before {
          width: 100%;
          left: 0;
        }
      }
    }
  }
}
.dropdownMenu{
      width: 130px;
      .el-dropdown-menu__item{
        font-size: 14px;
        line-height: 30px;
      }
    }
</style> -->

<style lang="scss" scoped>
.card-tabs {
  &-head {
    /* padding-bottom: 6px; */
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    &-border {
      border-bottom: 1px solid $grey6;
    }

    &-left {
      display: flex;

      height: 32px;
      line-height: 32px;
    }
  }

  &-tabs {
    display: flex;
    font-size: 12px;
    margin-left: 15px;
    margin-top: 2px;
    li {
      background-color: black;
      border: 1px solid black;
      // border: 1px solid black;
      padding: 0 4px;
      color: $grey3;
      margin-right: 30px;
      position: relative;
      cursor: pointer;

      &::before {
        content: '';
        display: block;
        width: 0;
        height: 2px;
        background: $--color-primary;
        position: absolute;
        bottom: 0;
        left: 50%;
        transition: $transition;
      }

      &.is-active {
        color: $grey1;
        &::before {
          width: 100%;
          left: 0;
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
.el-menu-demo{
  background-color: #F5F5F5;
  /deep/ .el-submenu__title {
    height: 30px;
    line-height: 30px;
  }
}

</style>

