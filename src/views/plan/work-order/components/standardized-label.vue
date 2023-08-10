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
        v-model="s_selectedValue"
        :options="s_options"
        :placeholder="s_placeholder"
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
    selectedCode: {
      type: String,
      default: '',
    },
    selectedValue: {
      type: Array,
      default: () => [],
    },
    levelList: {
      type: Array,
      default: () => [
        {
          code: 'dimensionality',
          codeValue: '维度',
          placeholder: '请选择维度',
          options: [
            {
              value: 'weidu-1',
              label: '维度1',
              children: [
                {
                  value: 'weidu-1-1',
                  label: '维度1-1',
                  children: [
                    {
                      value: 'weidu-1-1-1',
                      label: '维度1-1-1',
                    },
                  ],
                },
                {
                  value: 'weidu-1-2',
                  label: '维度1-2',
                  children: [
                    {
                      value: 'weidu-1-2-1',
                      label: '维度1-2-1',
                    },
                    {
                      value: 'weidu-1-2-2',
                      label: '维度1-2-2',
                    },
                  ],
                },
              ],
            },
            {
              value: 'weidu-2',
              label: '维度2',
              children: [
                {
                  value: 'weidu-2-1',
                  label: '维度2-1',
                  children: [
                    {
                      value: 'weidu-2-1-1',
                      label: '维度2-1-1',
                    },
                  ],
                },
                {
                  value: 'weidu-2-2',
                  label: '维度2-2',
                  children: [
                    {
                      value: '2-2-1',
                      label: '维度2-2-1',
                    },
                    {
                      value: '2-2-2',
                      label: '维度2-2-2',
                    },
                  ],
                },
                {
                  value: 'weidu-2-3',
                  label: '维度2-3',
                  children: [
                    {
                      value: 'weidu-2-3-1',
                      label: '维度2-3-1',
                    },
                    {
                      value: 'weidu-2-3-2',
                      label: '维度2-3-2',
                    },
                    {
                      value: 'weidu-2-3-3',
                      label: '维度2-3-3',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          code: 'measure',
          codeValue: '度量',
          placeholder: '请选择度量，表内不可重复',
          options: [
            {
              value: 'duliang-1',
              label: '度量1',
              children: [
                {
                  value: 'duliang-1-1',
                  label: '度量1-1',
                  children: [
                    {
                      value: 'duliang-1-1-1',
                      label: '度量1-1-1',
                    },
                  ],
                },
                {
                  value: 'duliang-1-2',
                  label: '度量1-2',
                  children: [
                    {
                      value: 'duliang-1-2-1',
                      label: '度量1-2-1',
                    },
                    {
                      value: 'duliang-1-2-2',
                      label: '度量1-2-2',
                    },
                  ],
                },
              ],
            },
            {
              value: 'duliang-2',
              label: '度量2',
              children: [
                {
                  value: 'duliang-2-1',
                  label: '度量2-1',
                  children: [
                    {
                      value: 'duliang-2-1-1',
                      label: '度量2-1-1',
                    },
                  ],
                },
                {
                  value: 'duliang-2-2',
                  label: '度量2-2',
                  children: [
                    {
                      value: '2-2-1',
                      label: '度量2-2-1',
                    },
                    {
                      value: '2-2-2',
                      label: '度量2-2-2',
                    },
                  ],
                },
                {
                  value: 'duliang-2-3',
                  label: '度量2-3',
                  children: [
                    {
                      value: 'duliang-2-3-1',
                      label: '度量2-3-1',
                    },
                    {
                      value: 'duliang-2-3-2',
                      label: '度量2-3-2',
                    },
                    {
                      value: 'duliang-2-3-3',
                      label: '度量2-3-3',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  data() {
    return {
      itemIndex: this.levelList.findIndex(
        (item) => item.code == this.selectedCode
      ),
      s_selectedValue: this.selectedValue,
      s_options:
        typeof this.levelList.find((item) => item.code == this.selectedCode) !=
        'undefined'
          ? this.levelList.find((item) => item.code == this.selectedCode)
              .options
          : [],
      s_placeholder:
        typeof this.levelList.find((item) => item.code == this.selectedCode) !=
        'undefined'
          ? this.levelList.find((item) => item.code == this.selectedCode)
              .placeholder
          : '',
      showCascader: this.selectedCode == '' ? false : true,
    }
  },
  computed: {},
  watch: {
    s_selectedValue(n, o) {
      this.s_selectedValue = n
      this.changeVal()
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
      }
    },
    changeVal() {
      this.$emit('changeVal', this.s_selectedValue)
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
