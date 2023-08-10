<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-08-10 15:32:15
 * @LastEditTime: 2021-08-15 15:20:41
 * @Description:
-->
<template>
  <ul class="sl-aside-menus edition">
    <li
      v-for="menu in menus"
      :key="menu.name"
      :class="['menu-item', menu.meta.jump === false && 'no-jump']"
    >
      <div v-if="menu.meta.jump === false" class="title">
        <i class="icon" :class="menu.meta.icon" v-if="menu.meta.icon"></i>
        {{ menu.meta.name }}
      </div>
      <div class="title" v-else>
        <touch-ripple>
          <i class="icon" :class="menu.meta.icon" v-if="menu.meta.icon"></i>
          {{ menu.meta.name }}
        </touch-ripple>
      </div>
      <ul class="submenu" v-if="menu.children">
        <li
          v-for="submenu in menu.children.filter(
            item => !item.meta.hideInMenu
          )"
          :key="submenu.name"
          :class="['submenu-item', active === submenu.name ? 'router-link-exact-active' : '']"
          @click="nodeClick(submenu)"
        >
          <touch-ripple v-if="submenu.meta.name">
            <i class="icon" :class="submenu.meta.icon" v-if="submenu.meta.icon"></i>
            {{ submenu.meta.name }}
          </touch-ripple>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Edition',
  inject: ['tabStore'],
  props: {},
  components: {},
  data() {
    return {
      menus: [{
        meta: {
          name: '标准发布',
          jump: false
        },
        name: 'release',
        children: [{
          name: 'waiting',
          meta: {
            name: '待发布对象',
            icon: 'iconfont icon-dengdaishangchuan_Linear'
          },
          component: 'ReleaseWaiting'
        }, {
          name: 'publish',
          meta: {
            name: '发布记录',
            icon: 'iconfont icon-fabu1'
          },
          component: 'ReleasePublish'
        }]
      }, {
        name: 'manage',
        meta: {
          name: '版本管理',
          jump: false
        },
        children: [{
          name: 'curr',
          meta: {
            name: '当前版本',
            icon: 'iconfont icon-banben'
          },
          component: 'ManageCurrent'
        }, {
          name: 'his',
          meta: {
            name: '历史版本',
            icon: 'iconfont icon-lishibanben'
          },
          component: 'ManageHistory'
        }]
      }]
    }
  },
  watch: {},
  computed: {
    active() {
      if (this.tabStore.states.active && this.tabStore.states.active.name) {
        return this.tabStore.states.active.name
      } else {
        return ''
      }
    }
  },
  created() {},
  mounted() {
  },
  methods: {
    nodeClick(data) {
      const opt = {
        label: data.meta.name,
        icon: data.meta.icon,
        data: data,
        tabType: data.name,
        name: data.name,
        visibleFileQuote: true,
        component: data.component
      }
      this.tabStore.commit('add', opt)
    }
  }
}
</script>

<style lang="scss">
.edition {
  &.sl-aside-menus {
    font-size: 12px;
    margin-top: 5px;

    .menu-item {
      &.no-jump {
        padding: 3px 0;

        .title {
          color: $grey5;
          font-size: 14px;
          padding: 0 20px;
        }
      }
      .title {
        color: $grey9;
        line-height: 36px;
      }
    }

    .v-touch-ripple {
      width: 100%;
      padding: 0 20px;
      line-height: 36px;
      box-sizing: border-box;
      cursor: pointer;

      .iconfont {
        font-size: 14px;
        padding-right: 10px;
      }
    }
    .submenu {
      .submenu-item {
        color: $grey9;
      }
    }
    .router-link-exact-active,
    .router-link-exact-active:hover {
      background-color: $sideMenuActive;
    }

    .v-touch-ripple:hover {
      background-color: $sideMenuHover;
    }
  }
}
</style>
