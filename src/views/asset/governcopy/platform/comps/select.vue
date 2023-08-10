<template>
  <div class="wrapper">
    <ul>
      <li v-for="(item, index) in list" :key="index" @click="handleClick(item,index)" :class="{'item-select': selectIndex === index }">
        <span class="text">{{ item.name }}({{item.value}})</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ActStep',
  props: {
    list: {
      type: Array,
      default: () => {
        return [
          { name: '物理表', value: 379 },
          { name: '逻辑表', value: 341 }
        ]
      }
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    activeIndex: {
      handler (val) {
        this.selectIndex = val
      }
    }
  },
  data () {
    return {
      selectIndex: 0
    }
  },
  methods: {
    handleClick (item, index) {
      this.selectIndex = index
      this.$emit('select', item, index)
    }
  }
}

</script>

<style lang="scss" scoped>
.wrapper {
  display: inline-block;
  ul {
    display: flex;
    list-style: none;
    li {
      margin: 0 5px;
      cursor: pointer;
      .text {
        padding: 5px 10px;
        display: inline-block;
        text-align: center;
        color: #666;
        font-size: 12px;
        background-color: #e0e1ee;
        border: 1px solid transparent;
      }
      &:hover {
        .text {
          color: #000e7f;
          background-color: #eaedf8;
          border: 1px solid #000e7f;
        }
      }
    }
    .item-select {
      .text {
        color: #000e7f;
        background-color: #eaedf8;
        border: 1px solid #000e7f;
      }
    }
  }
}
</style>
