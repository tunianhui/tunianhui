// icon-kaifazhe 开发中 #a185ff
// icon-shangxian1 上线  0
// icon-xiaxian2 下线  1
// icon-weishenhe 未审核  2
// icon-shenhezhong 审核中  3
// icon-shenhezhong 审核未通过  4
// icon-state-draft 草稿  5
// icon-yifabu 已发布  6
export default {
  name: 'Status',
  props: {
    state: [String, Number]
  },
  data() {
    return {
      icons: {
        0: ['iconfont icon-shangxian1', '#0de8da'],
        1: ['iconfont icon-xiaxian2', '#ff7a45'],
        2: ['iconfont icon-weishenhe', '#d9d9d9'],
        3: ['iconfont icon-shenhezhong', '#69c0ff'],
        4: ['el-icon-error', '#d8d8d8'],
        5: ['iconfont icon-caogao', '#eaba19'],
        6: ['iconfont icon-yifabu', '#2bc048']
      }
    }
  },
  render(h) {
    const [iconClass, color] = this.icons[this.state] || [],
      icon = `font-16 ${iconClass}`,
      label = this.getDicsValue('status_tag', this.state)
    return (
      <span>
        <i class={icon} style={{color}} />
        &nbsp;{label}
      </span>
    )
  }
}
