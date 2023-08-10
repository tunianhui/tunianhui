/*
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-05-28 10:00:03
 * @LastEditTime: 2020-08-19 09:56:34
 * @Description:
 */
import dialogHeight from '@/mixins/dialog-height'
import { mapGetters } from 'vuex'

export default {
  mixins: [dialogHeight],
  props: {
    visible: Boolean,
    title: String,
    data: [Object, null]
  },
  data() {
    return {
      isVisible: false,
      filter: {},
      rules: {},
      formRef: 'form',
      loading: 0
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.isVisible = val
      }
    },
    data: {
      immediate: true,
      handler(val) {
        // 编辑时使用
        Object.assign(this.filter, this.data)
        if (!this.data || !this.data.project_name) {
          Object.assign(this.filter, this.project)
        }
        // console.log(this.filter, 'this', this.data)
      }
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  created() {},
  methods: {
    close() {
      const form = this.$refs[this.formRef]
      form && form.resetFields()
      // console.log(form, 'formRef')
      this.$emit('update:visible', false)
      this.$emit('close')
    }
  }
}
