<template>
  <section class="wholescene">
    <ul class="ws-tabs">
      <li v-for="tab in tabs" :key="tab.label" :class="{'is-actived': tab.label === activeTab.label}" @click="tabClick(tab)">{{tab.label}}</li>
    </ul>
    <transition name="el-zoom-in-top" mode="out-in">
      <component :is="activeTab.component" @changeTab="changeTab"></component>
    </transition>
  </section>
</template>

<script>
import Flow from './flow'
import Global from './global/index.vue'
import Structure from './structure'
import storage from '@/libs/storage'
import store from '@/store'

export default {
  name: 'Wholescene',
  data () {
    const active = { label: '全局', value: '1', component: Global }
    return {
      tabs: [
        active,
        { label: '流动', value: '2', component: Flow },
        { label: '结构', value: '3', component: Structure }
      ],
      activeTab: active
    }
  },
  created () {
    const active = storage.get('wholesceneTab')
    if (active) {
      this.activeTab = this.tabs.find(t => t.label === active)
    }
    const listBtn = store.getters.menuAuths['wholescene'].btns.split('|') || []
    this.tabs = this.tabs.filter(d => {
      if (listBtn.includes(d.value)) return d
    })
  },
  beforeRouteLeave (to, from, next) {
    storage.set('wholesceneTab', null)
    next()
  },
  methods: {
    tabClick (tab) {
      this.activeTab = tab
      storage.set('wholesceneTab', tab.label)
    },
    changeTab (data) {
      const tab = this.tabs.find(t => t.label === data.tab)
      tab && this.tabClick(tab)
    }
  }
}
</script>

<style lang="scss">
.wholescene {
  width: 100%;
  height: 100%;
  position: relative;
  background: $grey1;
  overflow: hidden;
  color: $grey8;

  .ws-tabs {
    @include clearfix;
    position: absolute;
    top: 20px;
    right: 20px;
    border-bottom: 1px solid $grey2;
    z-index: 10;

    li {
      float: left;
      padding: 5px 8px;
      margin-right: 15px;
      color: $grey5;
      cursor: pointer;
      position: relative;

      &:after {
        content: '';
        width: 100%;
        height: 1px;
        background-color: $grey9;
        position: absolute;
        // left: -100%;
        bottom: -1px;
        opacity: 0;
        z-index: 1;
      }
      &.is-actived,
      &.is-actived:hover {
        color: $grey9;
        &:after {
          left: 0;
          opacity: 1;
          transition: all 0.3s;
        }
      }
      &:hover {
        color: $grey7;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
