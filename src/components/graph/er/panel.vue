<template>
  <section :class="['flow-panel', {'is-dragable': !data.readOnly}]" ref="panel" @dblclick.stop>
    <div class="pk-title" v-if="data.isPrimarykey">主表</div>
    <div :class="['flow-panel-head', {'is-top': !data.isPrimarykey}]">
      <div class="fph-left">
        <div class="icon el-icon-tickets"></div>
        <div class="info">
          <p>{{data.code}}</p>
          <p>{{data.name}}</p>
        </div>
      </div>
      <div class="fph-right">
        <el-link
          :underline="false"
          icon="el-icon-search"
          title="搜索"
          @click="visibleSearch = true"
          v-if="!!fieldList.length && data.collapse"
        ></el-link>
        <el-link
          :underline="false"
          :title="data.collapse ? '展开' : '收起'"
          :class="['iconfont font-14', data.collapse ? 'icon-shousuoshangjiantou' : 'icon-shousuoxiajiantou']"
          @click="collapse"
        ></el-link>
        <el-popover
          placement="bottom-end"
          popper-class="more-popover"
          trigger="click"
          width="120px"
          v-model="visiblePopover"
        >
          <el-link
            v-if="!readonly || !fullscreen"
            :underline="false"
            slot="reference"
            icon="iconfont icon-diandian"
          ></el-link>
          <ul class="popper-list" @click.stop="visiblePopover = false">
            <li v-if="data.isPrimarykey || isShowCubeMode" @click="$emit('showTableInfo')">
              <el-button type="text">主表详情</el-button>
            </li>
            <li v-if="isShowCubeMode" @click="$emit('showCubeRelMode')">
              <el-button type="text">主表来源关系模型</el-button>
            </li>
            <li @click="showDimInfo" v-if="!data.isPrimarykey">
              <el-button type="text">维度详情</el-button>
            </li>
          </ul>
        </el-popover>
      </div>
      <transition name="el-zoom-in-center">
        <div class="fph-search" v-show="visibleSearch">
          <el-input
            placeholder="请输入关键字"
            v-model="keyword"
            @input="filterList"
            autofocus
            @blur="hideSearchInput"
          >
            <!-- <i slot="prepend" class="el-icon-search"></i> -->
            <i slot="append" class="el-icon-close" @click="hideSearchInput"></i>
          </el-input>
        </div>
      </transition>
    </div>
    <div class="flow-panel-body">
      <div class="pk-container">
        <div class="fpb-item" v-for="item in pkData" :key="item.element_id">
          <b class="el-icon-key"></b>
          <p v-html="$highlightKeyword(item.element_code, keyword)"></p>
          <p>{{item.element_name}}</p>
          <div class="tool" v-if="!readonly">
            <el-link
              :underline="false"
              icon="el-icon-view"
              title="查看"
              @click="$emit('viewField', {data, item})"
            ></el-link>
          </div>
        </div>
      </div>
      <div class="relation-container">
        <template v-if="!!relationData.length">
          <div class="fpb-item" v-for="item in relationData" :key="item.element_id">
            <span v-if="data.isPrimarykey">
              <span v-if="item.expand">
                <i
                  :class="`edge edge-${item.dir} is-visible`"
                  @click="$emit(`expand`, {
                    data: item,
                    dir: item.dir
                  })"
                >
                  <em>—</em>
                </i>
              </span>
              <span v-else>
                <i
                  v-for="dir in ['left', 'right']"
                  :key="dir"
                  :class="`edge edge-${dir}`"
                  @click="$emit('expand', {data: item, dir})"
                >+</i>
              </span>
            </span>
            <b></b>
            <p v-html="$highlightKeyword(item.element_code, keyword)"></p>
            <p>{{item.element_name}}</p>
            <div class="tool" v-if="!readonly">
              <template v-if="data.isPrimarykey">
                <el-link
                  title="编辑关联维度"
                  :underline="false"
                  @click="$emit('editField', item)"
                  icon="el-icon-edit-outline"
                ></el-link>
                <el-link
                  title="新增关联维度"
                  :underline="false"
                  @click="$emit('create', 'relation')"
                  icon="el-icon-document-add"
                ></el-link>
                <SimpleConfirm @confirm="$emit('remove', item)">
                  <el-link title="删除关联维度" :underline="false">
                    <i class="el-icon-delete font-16"></i>
                  </el-link>
                </SimpleConfirm>
              </template>
              <template v-else>
                <el-link
                  :underline="false"
                  icon="el-icon-view"
                  title="查看关联维度"
                  @click="$emit('viewField', {data, item})"
                ></el-link>
              </template>
            </div>
          </div>
        </template>
        <template v-if="!relationData.length && data.isPrimarykey && !readonly">
          <div class="fpb-item">
            <b></b>
            <el-button icon="el-icon-plus" @click="$emit('create', 'relation')">添加关系维度</el-button>
          </div>
        </template>
      </div>

      <el-collapse-transition>
        <div v-show="data.collapse">
          <div class="attr-container">
            <template v-if="!!attrData.length">
              <div class="fpb-item" v-for="item in attrData" :key="item.element_id">
                <b></b>
                <p v-html="$highlightKeyword(item.element_code, keyword)"></p>
                <p>{{item.element_name}}</p>
                <div class="tool" v-if="!readonly">
                  <template v-if="data.isPrimarykey">
                    <el-link
                      title="编辑属性"
                      :underline="false"
                      @click="$emit('editField', item)"
                      icon="el-icon-edit-outline"
                    ></el-link>
                    <el-link
                      title="新增属性"
                      :underline="false"
                      @click="$emit('create', 'attr')"
                      icon="el-icon-document-add"
                    ></el-link>
                    <SimpleConfirm @confirm="$emit('remove', item)">
                      <el-link title="删除属性" :underline="false">
                        <i class="el-icon-delete font-16"></i>
                      </el-link>
                    </SimpleConfirm>
                  </template>
                  <template v-else>
                    <el-link
                      :underline="false"
                      icon="el-icon-view"
                      title="查看属性"
                      @click="$emit('viewField', {data, item})"
                    ></el-link>
                  </template>
                </div>
              </div>
            </template>
            <template v-if="!attrData.length && data.isPrimarykey && !readonly">
              <div class="fpb-item">
                <b></b>
                <el-button icon="el-icon-plus" @click="$emit('create', 'attr')">添加属性</el-button>
              </div>
            </template>
          </div>
          <div class="measure-container" v-if="visibleMeasure">
            <template v-if="!!measureData.length">
              <div class="fpb-item" v-for="item in measureData" :key="item.element_id">
                <b></b>
                <p v-html="$highlightKeyword(item.element_code, keyword)"></p>
                <p>{{item.element_name}}</p>
                <div class="tool" v-if="!readonly">
                  <template v-if="data.isPrimarykey">
                    <el-link
                      title="编辑度量"
                      :underline="false"
                      @click="$emit('editField', item)"
                      icon="el-icon-edit-outline"
                    ></el-link>
                    <el-link
                      title="新增度量"
                      :underline="false"
                      @click="$emit('create', 'measure')"
                      icon="el-icon-document-add"
                    ></el-link>
                    <SimpleConfirm @confirm="$emit('remove', item)">
                      <el-link title="删除度量" :underline="false">
                        <i class="el-icon-delete font-16"></i>
                      </el-link>
                    </SimpleConfirm>
                  </template>
                  <template v-else>
                    <el-link
                      :underline="false"
                      icon="el-icon-view"
                      title="查看度量"
                      @click="$emit('viewField', {data, item})"
                    ></el-link>
                  </template>
                </div>
              </div>
            </template>
            <template v-if="!measureData.length && data.isPrimarykey && !readonly">
              <div class="fpb-item">
                <b></b>
                <el-button icon="el-icon-plus" @click="$emit('create', 'measure')">添加度量</el-button>
              </div>
            </template>
          </div>
          <div class="system-container">
            <div class="fpb-item" v-for="item in systemData" :key="item.element_id">
              <b></b>
              <p v-html="$highlightKeyword(item.element_code, keyword)"></p>
              <p>{{item.element_name}}</p>
              <div class="tool" v-if="!readonly">
                <el-link
                  :underline="false"
                  icon="el-icon-view"
                  title="查看"
                  @click="$emit('viewField', {data, item})"
                ></el-link>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="flow-panel-foot" :title="data.collapse ? '展开' : '收起'" @click="collapse">
      <i
        :class="['iconfont', data.collapse ? 'icon-shousuoshangjiantou' : 'icon-shousuoxiajiantou']"
      ></i>
    </div>
  </section>
</template>

<script>
import {types} from '@/config/rd-config'

export default {
  name: 'FlowPanel',
  props: {
    data: Object,
    fullscreen: Boolean,
    readonly: Boolean,
    isShowCubeMode: {
      type: Boolean,
      default: () => false
    },
    flag: String
  },
  inject: ['attrStore'],
  data() {
    return {
      pkData: [],
      relationData: [],
      attrData: [],
      measureData: [],
      systemData: [],
      keyword: '',
      visiblePopover: false,
      visibleSearch: false
    }
  },
  computed: {
    fieldList() {
      return [this.relationData, this.measureData, this.attrData]
    },
    visibleMeasure() {
      return this.data.type === types.FACTTABLE || !this.data.isPrimarykey
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        this.processData(val)
      }
    }
  },
  methods: {
    processData(data) {
      const {
        primarykeyData = [],
        relationData = [],
        attrData = [],
        measureData = [],
        systemData = []
      } = data
      this.pkData = primarykeyData
      this.relationData = relationData
      this.attrData = attrData
      this.measureData = measureData
      this.systemData = systemData
    },
    hideSearchInput() {
      this.visibleSearch = false
      this.keyword = ''
    },
    collapse() {
      this.hideSearchInput()
      this.$emit('collapse')
    },
    filterList(value) {
      // const reg = new RegExp(value, 'i')
      // this.
    },
    showDimInfo() {
      const attr = {
        data: this.data,
        title: '维度',
        label: this.data.code,
        attrType: types.DIMENSION,
        name: this.data.id + ''
      }
      this.attrStore.commit('add', attr)
      this.attrStore.commit('setActiveToFirst', attr)
      this.$root.eventEmitter.emit('closeRelDialod')
    }
  }
}
</script>

<style lang="scss">
.flow-panel {
  border-radius: 10px;
  width: 376px;
  position: absolute;
  cursor: grab;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.15);
  transition: top 0.2s linear;

  @mixin grabbing {
    &:active,
    &:focus {
      cursor: grabbing !important;
    }
  }

  &.is-dragable {
    @include grabbing;

    .flow-panel-foot,
    .fpb-item {
      @include grabbing;
    }
  }

  $borderWidth: 8px;
  .pk-title {
    background: #0f1834;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-left: $borderWidth solid #212e4b;
    border-right: $borderWidth solid #212e4b;
    color: $grey8;
    font-size: 12px;
    line-height: 24px;
    padding-left: 15px;
  }

  $headBg: #242f4a;
  $headBorder: #454e67;
  .flow-panel-head {
    position: relative;
    background: $headBg;
    border-left: $borderWidth solid $headBorder;
    border-right: $borderWidth solid $headBorder;
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
    padding: 6px 10px;

    &.is-top {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    .fph-left {
      display: flex;
      line-height: 24px;
      color: $grey8;
      .el-icon-tickets {
        color: $--color-primary;
        margin-right: 6px;
        line-height: 24px;
      }
      .info {
        p {
          width: 120px;
          @include textEllipsis();
          font-size: 13px;
        }
      }
    }
    .fph-right {
      .el-link {
        color: $grey4;
        padding-right: 10px;

        &:hover {
          color: $grey8;
        }
      }
    }
    .fph-search {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      display: flex;
      padding: 0 15px;
      background: $headBg;
      .el-input {
        margin: auto;
        .el-input-group__prepend,
        .el-input-group__append {
          padding: 0 5px;
          background: $headBorder;
          border-color: $headBorder;
          cursor: pointer;
        }
        .el-input__inner {
          border-color: $headBorder;
          background: $headBorder;
          color: $grey8;
        }
      }
    }
  }
  .flow-panel-body {
    .fpb-item {
      display: flex;
      align-items: center;
      height: 36px;
      line-height: 36px;
      padding: 8px;
      background-color: $grey8;
      border-left-width: 8px;
      border-right-width: 8px;
      border-style: solid;
      position: relative;
      cursor: default;

      /* @include grabbing; */
      &:hover {
        background-color: $grey10;
        box-shadow: 0 0 2px 0px rgba(0, 0, 0, 0.1);
        z-index: 1;
      }

      b {
        width: 16px;
        margin-right: 4px;
      }
      p {
        flex: 1;
        font-size: 12px;
        @include textEllipsis;
      }

      &:hover {
        .tool {
          z-index: 1;
          opacity: 1;
        }
      }
      .tool {
        $height: 24px;
        position: absolute;
        top: -$height;
        right: 0;
        height: $height;
        line-height: $height;
        padding: 0 5px;
        background-color: $grey10;
        /* 这里的过渡会影响怎么组件的展示 */
        /* transition: opacity 0.2s linear; */
        opacity: 0;
        z-index: -1;

        .el-link {
          padding: 0 5px;
        }
      }
    }
    .edge {
      $size: $borderWidth * 2;
      position: absolute;
      top: 50%;
      margin-top: -$size / 2;
      color: #699bed;
      width: $size;
      height: $size;
      border-radius: 50%;
      color: $grey10;
      font-weight: bold;
      font-style: normal;
      font-size: 14px;
      background-color: #699bed;
      opacity: 0;
      transition: $transition;
      display: flex;
      align-items: center;
      justify-content: center;

      em {
        margin-top: -3px;
      }

      /* z-index: 2; */
      &:hover,
      &.is-visible {
        cursor: pointer;
        opacity: 1;
      }
      &.edge-left {
        left: -$size;
      }
      &.edge-right {
        right: -$size;
      }
    }
    .relation-container .fpb-item {
      border-color: #699bed;
    }
    .attr-container .fpb-item {
      border-color: #e5b41b;
    }
    .measure-container .fpb-item {
      border-color: #62b2ab;
    }
    .pk-container {
      border-bottom: 1px solid #caced6;
    }
    .pk-container .fpb-item,
    .system-container .fpb-item {
      border-color: #caced6;
    }
  }
  .flow-panel-foot {
    border-left: $borderWidth solid #b5bcc8;
    border-right: $borderWidth solid #b5bcc8;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    height: 20px;
    line-height: 20px;
    background-color: #d0d2dd;
    text-align: center;
    font-size: 12px;
    color: $grey4;

    &:hover {
      cursor: pointer;
      color: $grey1;
    }

    /* .el-link {
      vertical-align: top;
    } */
  }
  .el-icon-key {
    color: $warning;
  }
}
</style>
