<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-03-22 10:04:37
 * @LastEditTime: 2023-03-22 10:05:59
 * @Description:
-->
<template>
  <div class="modal">
    <div class="modal-content">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: String,
    message: String
  },
  methods: {
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #007aff;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
