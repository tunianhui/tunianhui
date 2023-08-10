<!--
 * @Author: xuyong
 * @LastEditors: YONG
 * @Date: 2022-07-29 09:11:23
 * @LastEditTime: 2023-07-04 14:47:48
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

// 快捷操作
const menuList = [
  { name: '属性配置', value: 'edit' },
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
  border-radius: 4px;
  background-color: #fff;
  :deep(.el-menu) {
    background-color: #fff;
  }
  :deep(.el-menu-item) {
    height: 40px;
    line-height: 40px;
  }
}
</style>
