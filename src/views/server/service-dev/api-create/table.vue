<template>
  <section class="pr-15 pb-10 pl-10" v-loading="!!loading">
    <div class="subtitle">
      <span>api666</span>
    </div>
  </section>
</template>

<script>
import { delDim, offLine } from '@/api/rd/dimension' //eslint-disable-line
import { mapGetters } from 'vuex'
import rdTableMixin from '@/mixins/rd-table'

export default {
  name: 'DimensionObjectTable',
  mixins: [rdTableMixin],
  inject: ['fileStore'],
  data () {
    return {
      delTableColFetch: delDim,
      offLineFetch: offLine
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  methods: {

  }
}
</script>
