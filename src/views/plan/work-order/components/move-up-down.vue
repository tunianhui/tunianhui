<template>
  <span class="move-up-dow">
    <el-button
      :disabled="s_scope.$index == 0 ? true : false"
      type="text"
      size="small"
      @click="moveUp(s_scope, s_tableData)"
    >
      <span v-if="showText">上移</span>
      <i v-else class="el-icon-top"></i>
    </el-button>
    <el-button
      :disabled="s_scope.$index == s_tableData.length - 1 ? true : false"
      type="text"
      size="small"
      @click="moveDown(s_scope, s_tableData)"
    >
      <span v-if="showText">下移</span>
      <i v-else class="el-icon-bottom"></i>
    </el-button>
  </span>
</template>

<script>
export default {
  name: 'MoveUpDown',
  components: {},
  props: {
    s_scope: {
      type: Object,
      default: () => {},
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    showText: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      s_tableData: this.tableData,
    }
  },
  computed: {},
  watch: {},
  methods: {
    moveUp(scope, array) {
      array[scope.$index] = array.splice(
        scope.$index - 1,
        1,
        array[scope.$index]
      )[0]
      this.$emit('moveUp', array)
    },
    moveDown(scope, array) {
      array[scope.$index] = array.splice(
        scope.$index + 1,
        1,
        array[scope.$index]
      )[0]
      this.$emit('moveDown', array)
    },
  },
}
</script>
<style lang="scss" scoped>
.move-up-dow {
  margin-left: 10px;
}
</style>
