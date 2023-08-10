<!--
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-05-28 10:00:04
 * @LastEditTime: 2020-08-06 16:31:41
 * @Description:
-->
<template>
  <section class="side-panel-view" :style="active.style || {}">
    <div class="empty" v-show="visibleEmpty">
      <img class="empty" src="@/assets/images/empty.png" alt />
    </div>
    <div class="spv-main" v-show="active.name">
      <div class="title" v-if="!active.hideTitle">
        <el-button type="text" @click="setActiveAttr(null)">属性查看</el-button>&nbsp; <i class="el-icon-arrow-right"></i>&nbsp;
        <span class="name">{{ active.title }}属性</span>
      </div>
      <component :is="components[component]" :data="active"></component>
    </div>
    <div class="spv-histories" v-show="!active.name && !visibleEmpty">
      <h4>属性查看</h4>
      <p>最近打开</p>

      <ul class="spv-histories-list">
        <li v-for="item in histories" :key="item.name" @click="setActiveToFirst(item)">
          <i :class="getIcon(item.attrType)" :style="{color: getColor(item.attrType)}"></i>
          <OverflowTooltip :width="300">
            &nbsp; {{ item.label }}
          </OverflowTooltip>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import mixin from '../mixin'
import { capitalize } from '@/libs/util'
import OverflowTooltip from '@c/overflow-tooltip'
import './common.scss'

export default {
  name: 'AttrView',
  mixins: [mixin],
  inject: ['attrStore', 'components'],
  components: {
    OverflowTooltip
  },
  data () {
    return {}
  },
  computed: {
    active () {
      return (this.attrStore && this.attrStore.states.active) || {}
    },
    histories () {
      return (this.attrStore && this.attrStore.states.list.slice(0, 25)) || []
    },
    visibleEmpty () {
      return this.attrStore && !this.histories.length
    },
    component () {
      return this.active.attrType === 'objectAttr'
        ? 'ObjectAttrSideAttr'
        : capitalize(this.active.attrType) + 'Attr'
    }
  },
  methods: {
    setActiveAttr (attr) {
      this.attrStore.commit('setActive', attr)
    },
    setActiveToFirst (attr) {
      this.attrStore.commit('setActiveToFirst', attr)
    }
  }
}
</script>
