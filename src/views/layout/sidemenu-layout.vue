<template>
  <section class="sidemenu-layout">
    <aside class="sl-aside" :style="{width: `${visibleSelectProject ? 220 : 160}px`}">
      <div class="sl-aside-head" v-if="visibleSelectProject">
        <el-select class="dark-input" popper-class="dark-popper no-arrow no-gutter" v-model="activeProject" @change="_setProject">
          <el-option v-for="(item, index) in projectList" :key="index" :label="item.project_name" :value="item.project_id"></el-option>
        </el-select>
      </div>
      <div class="sl-aside-body">
        <ul class="sl-aside-menus">
          <li v-for="menus in side_menu.filter(menu => !menu.meta.hideInMenu)" :key="menus.name" :class="['menu-item', menus.meta.jump === false && 'no-jump']">
            <div v-if="menus.meta.jump === false" class="title">
              <i class="icon" :class="menus.meta.icon" v-if="menus.meta.icon"></i>
              {{ menus.meta.name }}
            </div>
            <router-link tag="div" class="title" v-else :to="menus.path">
              <touch-ripple>
                <i class="icon" :class="menus.meta.icon" v-if="menus.meta.icon"></i>
                {{ menus.meta.name }}
              </touch-ripple>
            </router-link>
            <ul class="submenu" v-if="menus.children">
              <router-link v-for="menu in menus.children.filter(
                  item => !item.meta.hideInMenu
                )" :key="menu.name" tag="li" :to="menu.path" class="submenu-item">
                <touch-ripple v-if="menu.meta.name">
                  <i class="icon" :class="menu.meta.icon" v-if="menu.meta.icon"></i>
                  {{ menu.meta.name }}
                </touch-ripple>
              </router-link>
            </ul>
          </li>
        </ul>
      </div>
    </aside>
    <div :class="['sl-main', isActive ? 'active' : '']" ref="slMain" :style="{background: mainBackground}">
      <transition name="fadeinleft" mode="out-in">
        <router-view :key="Date.now()"></router-view>
      </transition>
    </div>

    <el-dialog custom-class="form-dialog" title="选择项目" width="500px" :visible.sync="visibleDialog" :close-on-click-modal="false" :close-on-press-escape="false" @close="selectProject" v-if="visibleSelectProject">
      <el-form label-position="right" label-width="100px" ref="projectForm" :model="projectForm" :rules="rules">
        <el-form-item label="项目名称" prop="project">
          <el-select v-model="projectForm.project" placeholder="请选择项目">
            <el-option v-for="(item, index) in projectList" :key="index" :label="item.project_name" :value="item.project_id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="selectProject">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import sidemenu from '@/mixins/sidemenu'

// const selectProjectPaths = ['/server/']

export default {
  name: 'Plan',
  mixins: [sidemenu],
  data () {
    return {
      visibleSelectProject: false,
      isActive: false,
      mainBackground: ''
    }
  },
  created () {
    // this.visibleSelectProject = !!selectProjectPaths.find(
    //   path => this.$route.path.indexOf(path) > -1
    // )
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler (val) {
        if (val === '/server/api-dev/dev') {
          this.visibleSelectProject = true
        } else {
          this.visibleSelectProject = false
        }
        if (val === '/asset/quality/quality-manage/data-table' || val === '/asset/quality/quality-manage/data-source' ||
          val === '/asset/quality/survey/overview' ||
          val === '/asset/quality/quality-manage/real-time' ||
          val === '/asset/quality/quality-manage/record' ||
          val.indexOf('/notice-center') > -1
        ) {
          this.isActive = true
        } else {
          this.isActive = false
        }
      }
    }
  }
}
</script>

<style lang="scss">
.sidemenu-layout {
  display: flex;
  height: 100%;
  .sl-aside {
    width: 160px;
    height: 100%;
    background-color: $sideMenu;
    overflow: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    z-index: 1;

    &-head {
      padding: 10px;
      /* margin-bottom: 5px; */
      background-color: $sideMenuStress;
    }

    &-body {
      flex: 1;
    }

    &-menus {
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
          white-space: nowrap;
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
  .sl-main {
    width: calc(100% - 160px);
    padding: 10px 15px 0;
    background-color: $grey7; //#EEEEEE;//$containerBg;
    box-sizing: border-box;
    overflow: auto;
    &.active {
      padding: 0;
      overflow: initial;
    }
  }
}
</style>
