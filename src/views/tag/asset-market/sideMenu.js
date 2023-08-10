/*
 * @Author: 大炸鹅
 * @Date: 2023-02-06 09:40:59
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-02-06 10:27:06
 * @FilePath: \数据智能构建\src\views\tag\asset-market\sideMenu.js
 */
export default {
  name: 'SideMenu',
  props: {
    categoryList: Array
  },
  data() {
    return {
      padding: 15
    }
  },
  render(h) {
    return (
      <el-menu
        class="el-menu-vertical-demo">
        {this.renderMenu(h, this.categoryList)}
      </el-menu>
    )
  },
  methods: {
    renderMenu(h, data) {
      if (data) {
        return data.map(item => {
          return item.children
            ? this.renderMenuSubItem(h, item)
            : this.renderMenuItem(h, item)
        })
      }
      return null
    },
    renderMenuSubItem(h, data) {
      return data ? (
        <el-submenu index={data.name} style={{'padding-left': `${this.padding}px`}}>
          <template slot="title">
            <span>{data.name}</span>
            {data.count ? <span>({data.count})</span> : null}
          </template>
          {this.renderMenu(h, data.children)}
        </el-submenu>
      ) : null
    },
    renderMenuItem(h, data) {
      return data ? (
        <el-menu-item index={data.name} style={{'padding-left': `${this.padding}px`}}>
          <template slot="title">
            <span>{data.name}</span>
            {data.count ? <span>({data.count})</span> : null}
          </template>
        </el-menu-item>
      ) : null
    }
  }
}