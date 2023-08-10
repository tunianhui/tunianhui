<template>
  <section class="govern" ref="govern">
    <!-- <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
  <el-tab-pane
    :key="item.name"
    v-for="(item, index) in editableTabs"
    :label="item.title"
    :name="item.name"
  >
    {{item.content}}
  </el-tab-pane>
</el-tabs> -->
  </section>
</template>

<script>
export default {
  name: 'Govern',
  components: {},
  data() {
    return {
      // editableTabs: [{
      //     title: 'Tab 1',
      //     name: '1',
      //     content: 'Tab 1 content'
      //   }, {
      //     title: 'Tab 2',
      //     name: '2',
      //     content: 'Tab 2 content'
      //   }],
      //   tabIndex: 2
    }
  },
  mounted() {
    // this.render()
  },
  destroyed() {},
  methods: {}
}
</script>

<style lang="scss">
.govern {
}
</style>
