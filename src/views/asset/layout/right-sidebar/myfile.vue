<template>
  <section class="side-panel-view">
    <div class="empty" v-show="visibleEmpty">
      <img class="empty" src="@/assets/images/empty.png" alt />
    </div>
    <div class="spv-histories" v-show="!visibleEmpty">
      <h4>文件查看</h4>
      <p>最近打开</p>
      <ul class="spv-histories-list">
        <li v-for="item in histories" :key="item.name" @click="setActiveTab(item)">
          <i :class="getIcon(item.tabType)" :style="{color: getColor(item.tabType)}"></i>
          &nbsp; {{item.label}}
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import mixin from '../mixin'
import './common.scss'

export default {
  name: 'WMyfile',
  mixins: [mixin],
  inject: ['fileStore', 'tabStore'],
  data() {
    return {}
  },
  computed: {
    histories() {
      return (this.fileStore && this.fileStore.states.list.slice(0, 25)) || []
    },
    visibleEmpty() {
      return this.fileStore && !this.histories.length
    }
  },
  methods: {
    setActiveTab(item) {
      this.fileStore.commit('setActiveToFirst', item)
      this.tabStore.commit('add', item)
    }
  }
}
</script>
