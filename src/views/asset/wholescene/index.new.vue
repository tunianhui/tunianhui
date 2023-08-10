<template>
  <section class="wholescene" v-loading="threeLoading || dataLoading">
    <ul class="ws-tabs">
      <li v-for="tab in tabs" :key="tab.name" :class="{'is-actived': tab.name === activeTab}" @click="tabClick(tab)">
        {{tab.label}}
      </li>
    </ul>

    <transition name="el-fade-in" mode="out-in">
      <div ref="chart" v-three.tween.gui.stats="threeOpt" v-show="visibleThreeChart"></div>
    </transition>
    <transition name="el-fade-in" mode="out-in">
      <Structure v-show="visibleStructure"></Structure>
    </transition>
    <div class="chart-tip global-tip">
      <div class="chart-tip-wrapper">
        <p>总数据量：<span>{{data.dataCount}}</span></p>
        <div v-if="data.list">
          <p class="progress-item" v-for="item in data.list" :key="item.name">
            <span class="name">{{item.name}}：</span>
            <el-progress :percentage="Number(item.percent)" :show-text="false" color="#288AC2"></el-progress>
            <span class="value">
              {{item.value}}{{item.unit}}&nbsp;&nbsp;
              <span class="per">{{item.percent}}%</span>
            </span>
          </p>
        </div>
        <p>总任务数：<span>{{data.taskCount}}</span></p>
        <p>总数据表数：<span>{{data.tableCount}}</span></p>
        <p>总项目数：<span>{{data.projectCount}}</span></p>
      </div>
    </div>
    <div class="chart-tip graphic-tip" ref="graphicTip" v-if="activeGraphic && activeGraphic.info">
      <div class="chart-tip-wrapper">
        <p>
          <span class="name">业务板块：</span>
          <span class="value">{{activeGraphic.info.board}}</span>
        </p>
        <p>
          <span class="name">计算消耗：</span>
          <span class="value">{{activeGraphic.info.consume}}{{activeGraphic.unit}}</span>
        </p>
        <p>
          <span class="name">存储量：</span>
          <span class="value">{{activeGraphic.info.storeCount}}</span>
        </p>
        <p>
          <span class="name">项目数：</span>
          <span class="value">{{activeGraphic.info.projectCount}}</span>
        </p>
        <p>
          <span class="name">总表数：</span>
          <span class="value">{{activeGraphic.info.tableCount}}</span>
        </p>
        <p>
          <span class="name">维度模型数：</span>
          <span class="value">{{activeGraphic.info.dmCount}}</span>
        </p>
        <p>
          <span class="name">事实模型数：</span>
          <span class="value">{{activeGraphic.info.fmCount}}</span>
        </p>
        <p>
          <span class="name">主题模型数：</span>
          <span class="value">{{activeGraphic.info.themeCount}}</span>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
// import storage from '@/libs/storage'
import { getData } from '@/api/asset/wholescene'
// import {MTLLoader} from 'three-obj-mtl-loader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { setStyles } from '@/libs/dom'
import Structure from './structure'
import globalMixin from './global-mixin'
import flowMixin from './flow-mixin'

export default {
  name: 'Wholescene',
  mixins: [globalMixin, flowMixin],
  components: {
    Structure
  },
  data () {
    return {
      tabs: [
        { label: '全局', name: 'global' },
        { label: '流动', name: 'flow' },
        { label: '结构', name: 'structure' }
      ],
      activeTab: 'global',
      visibleStructure: false,
      visibleThreeChart: true
    }
  },
  created () {
  },
  mounted () {
    this.threelLoading = true
    this._getData()
    this.readyHandle()
  },
  methods: {
    readyHandle () {
      this.threelLoading = true
      this.eventEmitter.on('ready', async _ => {
        !this.dataLoading && await this.drawGraphicsAsync()
        this.threelLoading = false
      })
    },
    tabClick (name) {
      this.activeTab = name
      this.visibleThreeChart = name === 'global' || 'flow'
      // this.toStructureAnimate(this.graphics[0])
    },
    async _getData () {
      this.dataLoading = true
      const res = await this.$simpleAsyncTo(getData(), '获取数据失败')
      if (res) {
        this.data = res.data
        !this.threelLoading && this.drawGraphicsAsync()
      }
      this.dataLoading = false
    },
    async beforeTrender () {
      this.animationEasing = this.tweenEasing.exponentialInOut
      this.fontLoader = this.tu.loaderPromisify(new this.THREE.FontLoader())
      this.textureLoader = this.tu.loaderPromisify(new this.THREE.TextureLoader())
      this.mtlLoader = this.tu.loaderPromisify(new MTLLoader())

      // const sphere = new this.THREE.Mesh(
      //   new this.THREE.SphereBufferGeometry(60, 60, 60),
      //   new this.THREE.MeshBasicMaterial({
      //     color: 0x0000ff
      //   })
      // )
      // this.scene.add(sphere)
      // const folder = this.gui.addFolder('Sphere')
      // const controls = new function() {
      //   this.positionx = 0
      //   this.positionz = 0
      // }
      // folder.add(controls, 'positionx', -500, 500).onChange(e => {
      //   sphere.position.x = e
      // })
      // folder.add(controls, 'positionz', -500, 500).onChange(e => {
      //   sphere.position.z = e
      // })

      this.camera.position.set(600, 600, 900)
      this.camera.lookAt(this.scene.position)
      this.addDirLight()
      this.drawTracks()
      this.drawDecorates()
      await this.drawTowerAsync()
      this.registerMouseEvent('mousemove', this.mousemove)
      this.registerMouseEvent('click', this.changeTab)
      this.addHelper()
      console.timeEnd('beforeTrender')
    },
    trender () {
      // this.animation()
      if (this.activeTab === 'global') {
        this.graphicsEnter()
        this.towerEnter()
        this.rotateAll()
        this.rotateGraphicsImage()
        this.graphicsEnterGroup && this.graphicsEnterGroup.update()
        this.towerEnterGroup && this.towerEnterGroup.update()
        this.towerCircleGroup && this.towerCircleGroup.update()
      } else if (this.activeTab === 'flow') {
        // this.camera.lookAt(this.tower)
      } else if (this.activeTab === 'structure') {
        // const mesh = this.activeGraphicObj
        // mesh && this.camera.lookAt(mesh.position)
        this.toStructureTween && this.toStructureTween.update()
      }
    },
    toStructureAnimate (mesh) {
      if (!mesh) return
      const target = {
        x: 325,
        y: 0,
        z: 500
      },
        originPos = mesh.position,
        otherGraphics = this.graphics.filter(g => g.name !== mesh.name),
        globalMesh = [this.tracks, this.tower, this.decorates, ...otherGraphics]

      this.toStructureTween = new this.TWEEN.Group()
      new this.TWEEN.Tween(mesh.position, this.toStructureTween)
        .to(target, this.animationDuration)
        .easing(this.animationEasing)
        .start()
        .onComplete(_ => {
          setTimeout(() => {
            mesh.position.copy(originPos)
          }, 500)
        })
      // globalMesh.forEach(obj => {
      //   obj.traverse(mesh => {
      //     if (mesh instanceof this.THREE.Mesh) {
      //       new this.TWEEN.Tween(mesh.material, this.toStructureTween)
      //         .to({opacity: 0}, this.animationDuration)
      //         .easing(this.animationEasing)
      //         .start()
      //         .onComplete(_ => {
      //           setTimeout(_ => {
      //             mesh.material.opacity = 1
      //           }, 500)
      //         })
      //     }
      //   })
      //   const {x, y, z} = obj.position
      //   new this.TWEEN.Tween(obj.position, this.toStructureTween)
      //     .to({x, y: y - this.rendererSize.height, z}, this.animationDuration)
      //     .easing(this.animationEasing)
      //     .start()
      //     .onComplete(_ => {
      //       setTimeout(_ => {
      //         obj.position = {x, y, z}
      //       }, 500)
      //     })
      // })

      new this.TWEEN.Tween(this, this.toStructureTween)
        .to({}, this.animationDuration)
        .onComplete(_ => {
          this.showStructure()
        })
        .start()
    },
    toFlowAnimate () {
      this.scene.remove(this.dirLight)
      this.scene.add(this.spotLight)
      this.toFlowTween = new this.TWEEN.Group()
    },
    showStructure () {
      this.visibleStructure = true
      this.visibleThreeChart = false
    },
    async mousemove (e) {
      // console.log(e)
      const intersects = e.intersects,
        graphic = this.isGraphics(intersects)
      this.isRotate = !graphic
      this.activeGraphic = null
      if (graphic) {
        this.activeGraphic = this.data.list.find(item => item.name === graphic.object.parent.name)
        if (!this.activeGraphic) return

        await this.$sleep(30)
        const dom = this.$refs.graphicTip
        if (dom) {
          this.setPopperPos(e, dom)
          setStyles(dom, { opacity: 1 })
        }
      }
    },
    changeTab (e) {
      const graphic = this.isGraphics(e.intersects)
      if (graphic) {
        // this.showStructure(e)
        this.activeTab = 'structure'
        // this.activeGraphicObj = graphic.object.parent
        this.toStructureAnimate(graphic.object.parent)
        return
      }
      if (this.isTower(e.intersects)) {
        this.activeTab = 'flow'
      }
    }
    // fadeOutBottom(mesh) {
    //   const pos = mesh.position,
    //     [x, y, z] = pos,
    //     duration = 1000
    //   this.TWEEN.Tween(pos, mesh)
    //     .to({x, y: y + this.rendererSize.height, z}, 1000)
    //     .easing(easing)
    //     .onUpdate(position => {
    //       c.position.copy(position)
    //     })
    // },
    // fadeInBottom(mesh) {
    //   const pos = mesh.position,
    //     [x, y, z] = pos,
    //     duration = 1000
    //   this.TWEEN.Tween(pos, mesh)
    //     .to({x, y: y + this.rendererSize.height, z}, 1000)
    //     .easing(easing)
    //     .onUpdate(position => {
    //       c.position.copy(position)
    //     })
    // }
  }
}
</script>

<style lang="scss">
.wholescene {
  @import '@/assets/css/chart-tip.scss';
  width: 100%;
  height: 100%;
  position: relative;
  background: $grey1;
  color: $grey8;
  overflow: hidden;

  .ws-tabs {
    @include clearfix;
    position: absolute;
    top: 20px;
    right: 20px;
    border-bottom: 1px solid $grey2;
    z-index: 10;

    li {
      float: left;
      padding: 5px 8px;
      margin-right: 15px;
      color: $grey5;
      cursor: pointer;
      position: relative;

      &:after {
        content: '';
        width: 100%;
        height: 1px;
        background-color: $grey9;
        position: absolute;
        // left: -100%;
        bottom: -1px;
        opacity: 0;
        z-index: 1;
      }
      &.is-actived,
      &.is-actived:hover {
        color: $grey9;
        &:after {
          left: 0;
          opacity: 1;
          transition: all 0.3s;
        }
      }
      &:hover {
        color: $grey7;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }

  .el-loading-mask {
    background-color: rgba(255, 255, 255, 0.15);
  }
}
</style>
