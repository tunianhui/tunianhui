<template>
  <span class="standardized-label">
    <span class="level-screening">
      <span
        class="degree-btn"
        :class="index == itemIndex ? 'highlight' : ''"
        v-for="(item, index) in levelList"
        :key="index"
        @click.prevent="itemClick(index, item)"
      >
        {{ item.codeValue }}</span
      >
    </span>
    <span class="choose-result">
      <span v-if="!showCascader">请先选择左侧类型</span>
      <el-cascader
        v-else
        ref="refID"
        style="width: 200px"
        v-model="s_selectedValue"
        :options="s_options"
        :placeholder="s_placeholder"
        @change="valChange"
        filterable
      >
      </el-cascader>
    </span>
  </span>
</template>

<script>
export default {
  name: 'StandardizedLabel',
  components: {},
  props: {
    refID: {type: String},
    balu: {
      type: String,
    },
    selectedType: {
      type: String,
      default: '2',
    },
    selectedValue: {
      type: Array,
      default: () => [],
    },
    levelList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      itemIndex: this.levelList.findIndex(
        (item) => item.code == this.selectedType
      ),
      s_selectedValue: this.selectedValue,
      s_options: [],
      s_placeholder: '',
      showCascader:
        this.selectedType == '2' || this.selectedType === null ? false : true,
    }
  },
  computed: {},
  watch: {
    s_selectedValue(n, o) {
      this.s_selectedValue = n
      this.changeVal()
    },
    levelList: {
      handler: function (n, o) {
        this.s_options =
          typeof n.find((item) => item.code == this.selectedType) != 'undefined'
            ? n.find((item) => item.code == this.selectedType).options
            : []
        this.s_placeholder =
          typeof n.find((item) => item.code == this.selectedType) != 'undefined'
            ? n.find((item) => item.code == this.selectedType).placeholder
            : ''
      },
      deep: true,
    },
  },
  methods: {
    itemClick(index, item) {
      if (this.itemIndex != index) {
        this.itemIndex = index
        this.s_selectedValue = []
        this.s_placeholder = item.placeholder
        this.s_options = item.options
        if (!this.showCascader) {
          this.showCascader = true
        }
        this.changeType(item.code)
      } else {
        this.itemIndex = -1
        this.s_selectedValue = []
        this.s_placeholder = ''
        this.s_options = []
        this.showCascader = false
        this.changeType('')
      }
    },
    changeType(code) {
      this.$emit('changeType', code)
    },
    changeVal() {
      this.$emit('changeVal', this.s_selectedValue)
    },
    valChange(val) {
      const res = this.$refs['refID']
        ? this.$refs['refID'].getCheckedNodes(false)
        : undefined
      if (res) {
        this.$emit('valChange', res)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.standardized-label {
  .level-screening {
    .degree-btn {
      padding: 5px;
      cursor: pointer;
    }
    .degree-btn.highlight {
      padding: 5px;
      cursor: pointer;
      color: white;
      background-color: #409eff;
      border-radius: 2px;
    }
  }
  .choose-result {
    margin-left: 10px;
    .el-cascader {
      width: 70%;
    }
  }
}
</style>
