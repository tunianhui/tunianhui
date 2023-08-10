import PageBottomTips from '../component/bottom-tips'
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  components: {
    PageBottomTips,
    OverflowTooltip
  },
  data() {
    return {
      height: 0,
    }
  },
  methods: {
    resizeDom(data) {
      this.$nextTick(_ => {
        const { height } = data
        const pageHeaderHeight = 40
        const pageHeaderMarginBottom = 5
        const pageHeight = this.$refs.pageWrapper.clientHeight
        const pagePaddingTop = 10
        this.height = pageHeight - (parseInt(height) + pageHeaderHeight + pageHeaderMarginBottom + pagePaddingTop)
        console.log(this.height)
      })
    },
  }
}