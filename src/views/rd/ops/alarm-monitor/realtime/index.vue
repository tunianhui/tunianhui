<template>
  <ul class="sl-aside-menus realtime-layout">
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
import {mapGetters, mapMutations} from 'vuex'

const map = {
  '/rd/ops/alarm-monitor/realtime-record': 'Blank'
}

export default {
  name: 'RealtimeLayout',
  data() {
    return {
      menus: [
        {
          path: '/rd/ops/alarm-monitor/realtime/alarm',
          name: 'realtime-alarm',
          meta: {
            name: '报警记录',
            hideInMenu: true
          },
          children: [
            {
              path: '/rd/ops/alarm-monitor/realtime-record',
              name: 'Blank',
              meta: {
                name: '任务报警记录',
                icon: 'iconfont icon-baojingjiluguanli'
              }
            }
          ]
        },
        {
          path: '/rd/ops/alarm-monitor/realtime/monitor',
          name: 'realtime-monitor',
          meta: {
            name: '监控配置',
            hideInMenu: true
          },
          children: [
            {
              path: '/rd/ops/alarm-monitor/realtime-record',
              name: 'Monitor',
              meta: {
                name: '任务监控配置',
                icon: 'iconfont icon-jiankong1'
              }
            }
          ]
        }
      ],
      active: 'Blank'
    }
  },
  computed: {
    ...mapGetters(['side_menu'])
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler(val) {
        this.setActiveComp({
          name: map[val]
        })
      }
    }
  },
  created() {
  },
  methods: {
    ...mapMutations({
      setActiveComp: 'ops/SET_ACTIVE_COMP'
    }),
    nodeClick(item) {
      this.active = item.name
      this.setActiveComp({
        name: map[item.path]
      })
    }
  }
}
</script>

<style lang="scss">
.realtime-layout {
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
