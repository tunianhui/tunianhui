<template>
  <div class="error-page">
    <div class="content-con">
      <img :src="src" :alt="code">
      <div class="text-con">
        <h4>{{ code }}</h4>
        <h5>{{ desc }}</h5>
      </div>
      <BackBtnGroup></BackBtnGroup>
    </div>
  </div>
</template>

<script>
import './error.less'
import BackBtnGroup from './back-btn-group.vue'
export default {
  name: 'ErrorContent',
  components: {
    BackBtnGroup
  },
  props: {
    code: String,
    desc: String,
    src: String
  }
}
</script>
