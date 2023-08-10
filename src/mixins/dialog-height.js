import {
  on,
  off
} from '@/libs/dom'

export default {
  data () {
    return {
      dialogBodyHeight: 0,
      dialogOtherHeight: 150
    }
  },
  mounted () {
    this.setDialogBodyHeight()
    on(window, 'resize', this.setDialogBodyHeight)
  },
  beforeDestory () {
    off(window, 'resize', this.setDialogBodyHeight)
  },
  methods: {
    setDialogBodyHeight () {
      const gap = this.gap ? this.gap : 0
      this.dialogBodyHeight = window.innerHeight * 0.75 - this.dialogOtherHeight - gap
    }
  }
}
