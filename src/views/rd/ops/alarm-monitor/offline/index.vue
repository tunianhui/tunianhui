<template>
  <ul class="sl-aside-menus realtime-layout">
    <li
      v-for="menu in menus" :key="menu.name" :class="['menu-item', 'no-jump']"
    >
      <div class="title">
        <touch-ripple>
          <i class="icon" :class="menu.icon" v-if="menu.icon"></i>
          {{ menu.name }}
        </touch-ripple>
      </div>
      <ul class="submenu" v-if="menu.children">
        <li
          v-for="submenu in menu.children" :key="submenu.name"
          :class="['submenu-item', active === submenu.path ? 'router-link-exact-active' : '']"
          @click="nodeClick(submenu)"
        >
          <touch-ripple>
            <i class="icon" :class="submenu.icon"></i>
            {{ submenu.name }}
          </touch-ripple>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'OfflineLayout',
  data() {
    return {
      menus: [
        {
          name: '报警记录',
          children: [
            {
              name: '任务报警记录',
              path: 'OfflineAlarm',
              icon: 'iconfont icon-baojingjiluguanli'
            }
          ]
        },
        {
          name: '监控配置',
          children: [
            {
              name: '任务监控配置',
              path: 'OfflineMonitor',
              icon: 'iconfont icon-jiankong1'
            }
          ]
        }
      ],
      active: 'OfflineAlarm'
    }
  },
  computed: {
    ...mapGetters(['side_menu'])
  },
  watch: {},
  created() {
    this.setActiveComp({
      name: this.active
    })
  },
  methods: {
    ...mapMutations({
      setActiveComp: 'ops/SET_ACTIVE_COMP'
    }),
    nodeClick(item) {
      this.active = item.path
      this.setActiveComp({
        name: item.path
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
