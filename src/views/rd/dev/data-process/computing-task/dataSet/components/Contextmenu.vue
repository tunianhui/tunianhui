<!--
 * @Author: xuyong
 * @LastEditors: YONG
 * @Date: 2022-07-29 09:11:23
 * @LastEditTime: 2023-07-15 16:06:39
 * @Description:
-->
<template>
  <div class="contextmenu-container" :style="{ top: `${position.top - 140}px`, left: `${position.left - 200}px` }">
    <el-menu>
      <el-menu-Item v-for="item in menuList" :key="item.value" :index="item.value" @click="menuClick(item.value)">{{ item.name }}</el-menu-Item>
    </el-menu>
  </div>
</template>

<script setup>
const props = defineProps({
  position: {
    type: Object,
    default: () => ({ top: 0, left: 0 })
  }
})

const emits = defineEmits(['menuClick'])

const menuList = [
  { name: '编辑', value: 'edit' },
  { name: '复制', value: 'copy' },
  { name: '删除', value: 'delete' }
]

// 鼠标右键事件
function menuClick (action) {
  emits('menuClick', action)
}
</script>

<style lang="scss" scoped>
.contextmenu-container {
  position: absolute;
  width: 150px;
  background-color: #fff;
  :deep(.el-menu) {
    background-color: #fff;
  }
  :deep(.el-menu-item) {
    height: 30px;
    line-height: 30px;
  }
}
</style>
