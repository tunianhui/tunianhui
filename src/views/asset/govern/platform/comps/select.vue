<template>
  <div class="wrapper">
    <ul v-if="visible">
      <li  v-for="(item, index) in list" :key="index" @click="handleClick(item,index)" :class="{'item-select': selectIndex === index }">
        <span class="text">{{ item.name ? item.name : item.objectName ? item.objectName : item.itemName }}</span>
      </li>
    </ul>
    <ul v-if="visible1">
      <li  v-for="(item, index) in list" :key="index" @click="handleClickItem(item,index)" :class="{'item-select': selectIndex1 === index }">
        <span class="text">{{ item.name ? item.name : item.objectName ? item.objectName : item.itemName }}</span>
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
      // default: () => {
      //   return [
      //     { name: '计算' },
      //     { name: '存储'}
      //   ]
      // }
    },
    activeIndex: {
      type: Number,
      default: 0
    },
    activeIndex1: Number
  },
  watch: {
    activeIndex: {
      handler (val) {
        this.selectIndex = val
      }
    },
    activeIndex1: {
      handler(val) {
        this.selectIndex1 = ''
      }
    },
    list: {
      handler(val) {
        if (val[0].code || val[0].ObjectCode) {
          this.visible = true
          this.visible1 = false
        } else if (val[0].itemCode) {
          this.visible = false
          this.visible1 = true
        }
      }
    },
  },
  data () {
    return {
      selectIndex: 0,
      selectIndex1: '',
      visible: true,
      visible1: false,
    }
  },
  mounted() {
  },
  methods: {
    handleClick (item, index) {
      this.selectIndex = index
      this.selectIndex1= 0
      this.$emit('select', item, index)
    },
    handleClickItem(item, index) {
      this.selectIndex1 = index
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
