/*
 * @Author: 大炸鹅
 * @Date: 2023-02-06 09:30:56
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-02-06 09:31:33
 * @FilePath: \数据智能构建\src\views\tag\asset-market\cell.js
 */
export default {
  name: 'Cell',
  props: {
    iconColor: {
      type: String,
      default: () => '#57b4b6'
    },
    icon: {
      type: String,
      default: () => 'icon-xiangmuquanxianguanli'
    },
    iconFontSize: {
      type: String,
      default: () => '24px'
    },
    data: Object,
    nameKey: String,
    codeKey: String
  },
  render(h) {
    return (
      <div class="cell-wrapper-box">
        <div class="cell-icon">
          <i class={`iconfont ${this.icon} mr-5`} style={{color: this.iconColor, 'font-size': this.iconFontSize}}></i>
        </div>
        <div class="cell-wrapper" style={{width: `calc(100% - 20px)`}}>
          {
            this.data[this.nameKey] ?
            <div class="cell-name">
              <OverflowTooltip style={{width: `calc(100% - 1px)`}}>{this.data[this.nameKey]}</OverflowTooltip>
            </div> : null
          }
          {
            this.data[this.codeKey] ?
            <div class="cell-desc">
              <OverflowTooltip style={{width: `calc(100% - 1px)`}}>{this.data[this.codeKey]}</OverflowTooltip>
            </div> : null
          }
        </div>
      </div>
    )
  }
}