<template>
  <section
    class="flow dark-loading"
    v-loading="threeLoading || leftLoading || rightLoading || centerLoading"
  >
    <video src="/bricks.mp4" autoplay loop></video>
    <!-- <div class="chart" v-three.tween.stats.gui.orbit="threeOpt"></div> -->
    <div class="chart" v-three.tween.orbit="threeOpt"></div>
    <div
      class="chart-tip tip-left graphic-tip"
      ref="left"
      v-if="visibleLeftTip"
    >
      <div class="chart-tip-wrapper">
        <h4>
          {{ leftData.briefHead }}:
          <strong>{{ leftData.headValue }}</strong>
        </h4>
        <div class="flex-layout dl-group">
          <dl v-for="item in leftData.brief" :key="item.label" class="flex-1">
            <dt>{{ item.title }}</dt>
            <dd v-for="d in item.data" :key="d.label" class="progress-item">
              <span class="label">{{ d.busin_name }}：</span>
              <span class="value">{{ d.access_ratio }}</span>
              <!-- <el-progress :percentage="Number((d.value * 100).toFixed())" color="#288AC2"></el-progress> -->
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <div
      class="chart-tip tip-center graphic-tip"
      ref="center"
      v-if="visibleCenterTip"
    >
      <div class="chart-tip-wrapper flex-layout dl-group">
        <dl v-for="item in centerData.brief" :key="item.label" class="flex-1">
          <dt>{{ item.title }}</dt>
          <dd v-for="d in item.data" :key="d.label" class="flex-layout">
            <span class="label flex-1">{{ d.label }}：</span>
            <span class="value flex-1">{{ d.value }}</span>
          </dd>
        </dl>
      </div>
    </div>
    <div
      class="chart-tip tip-right graphic-tip"
      ref="right"
      v-if="visibleRightTip"
    >
      <div class="chart-tip-wrapper dl-group">
        <dl class="flex-1">
          <dt>{{ activeRightData.label }}</dt>
          <dd
            v-for="item in activeRightData.data"
            :key="item.label"
            class="flex-layout"
          >
            <span class="label flex-1">{{ item.label }}：</span>
            <span class="value flex-1">{{ item.value }}</span>
          </dd>
        </dl>
        <!-- <p v-for="item in activeRightData.data" :key="item.label">
          <span class="label">{{item.label}}：</span>
          <span class="value">{{item.value}}</span>
        </p> -->
      </div>
    </div>
  </section>
</template>

<script>
import {
  getFlowTablesNumber,
  getDataAccess,
  getDataAccessTop5,
  getDataAccessLeast5,
  getAssetServiceInfo
} from '@/api/asset/wholescene'
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader'
import flowMixin from './flow-mixin'
// import FlyLine from '@/libs/three-flyline'

export default {
  name: 'Flow',
  mixins: [flowMixin],
  data() {
    return {
      threeOpt: {
        background: 0x020109,
        // background: 0x888888,
        // opacity: 0.1,
        beforeTrender: this.beforeTrender,
        trender: this.trender
      },
      animationDuration: 1500,
      leftLoading: false,
      centerLoading: false,
      rightLoading: false,
      leftData: {
        label: '数据接入进度',
        value: 0,
        percent: '0%',
        briefHead: 'Data Source',
        headValue: 10,
        brief: [
          {
            title: '数据接入 Top 5',
            data: []
          },
          {
            title: '数据接入 Least 5',
            data: []
          }
        ]
      },
      centerData: {
        label: '总表数',
        value: 0,
        key: 'cube_num',
        brief: [
          {
            title: '规范定义',
            data: [
              {label: '维度', key: 'dim_sum', value: 0},
              {label: '业务过程', key: 'busi_proc_num', value: 0},
              {label: '原子指数', key: 'atomic_num', value: 0},
              {label: '业务限定', key: 'cond_num', value: 0},
              {label: '派生指标', key: 'deri_num', value: 0}
            ]
          },
          {
            title: '数据模型',
            data: [
              {label: '维度逻辑表', key: 'dim_logic_num', value: 0},
              {label: '事实逻辑表', key: 'fact_logic_num', value: 0},
              {label: '主题模型数', key: 'sum_num', value: 0}
            ]
          }
        ]
      },
      rightData: {
        label: '数据应用',
        brief: [
          {
            label: '数据存储',
            data: [
              {label: '总存储', value: '143TB'},
              {label: '使用率', value: '143TB'},
              {label: '剩余空间', value: '49TB'}
            ]
          },
          {
            label: '数据萃取',
            data: [
              {label: '实体类目', value: 43},
              {label: '标签权重总值', value: 0.66}
            ]
          },
          {
            label: '数据服务',
            data: [
              {label: '服务次数', value: 4232},
              {label: '服务率', value: '77%'}
            ]
          }
        ]
      },
      activeRightData: []
    }
  },
  mounted() {
    // this._getFlowData()
    this.getLeftData()
    this.getCenterData()
    this.getRightData()
    this.readyHandle()
  },
  methods: {
    readyHandle() {
      this.threeLoading = true
      this.eventEmitter.on('ready', _ => {
        !this.leftLoading && this.drawLeftModel()
        !this.centerLoading && this.drawCenterModel()
        !this.rightLoading && this.drawRightModel()
        this.threeLoading = false
      })
    },
    // loadedRender() {
    //   this.drawLeftModel()
    //   this.drawCenterModel()
    //   this.drawRightModel()
    // },
    async getCenterData() {
      this.centerLoading = true
      const res = await this.$simpleAsyncTo(
        getFlowTablesNumber(),
        '获取总表树失败'
      )
      if (res) {
        const data = res.data[0]
        this.centerData.value = data[this.centerData.key]
        this.centerData.brief.forEach(item => {
          item.data.forEach(d => {
            d.value = data[d.key]
          })
        })
      }
      !this.threeLoading && this.drawCenterModel()
      this.centerLoading = false
    },
    async getLeftData() {
      this.leftLoading = true
      let res = await this.$simpleAsyncTo(
        getDataAccessTop5(),
        '获取数据接入Top5失败'
      )
      if (res) {
        this.leftData.brief[0].data = res.data
      }
      res = await this.$simpleAsyncTo(
        getDataAccessLeast5(),
        '获取数据接入Least5失败'
      )
      if (res) {
        this.leftData.brief[1].data = res.data
      }
      res = await this.$simpleAsyncTo(getDataAccess(), '获取数据接入进度')
      if (res) {
        const value = res.data.total_ratio
        this.leftData.value = (parseFloat(value) || 0) / 100
        this.leftData.percent = value
      }
      !this.threeLoading && this.drawLeftModel()
      this.leftLoading = false
    },
    async getRightData() {
      this.rightLoading = true
      let res = await this.$simpleAsyncTo(
        getAssetServiceInfo(),
        '获取数据服务失败'
      )
      if (res) {
        const {call_count, serv_rate} = res.data
        this.rightData.brief[2].data = [
          {label: '服务次数', value: call_count},
          {label: '服务率', value: serv_rate}
        ]
      }
      !this.threeLoading && this.drawRightModel()
      this.rightLoading = false
    },
    // async _getFlowData() {
    //   this.dataLoading = true
    //   const res = await this.$simpleAsyncTo(getFlowData(), '获取数据失败')
    //   if (res) {
    //     const {left, center, right} = res.data
    //     this.leftData = left
    //     this.centerData = center
    //     this.rightData = right
    //     !this.threeLoading && this.loadedRender()
    //   }
    //   this.dataLoading = false
    // },
    async beforeTrender() {
      this.animationEasing = this.tweenEasing.exponentialInOut
      this.textureLoader = this.tu.loaderPromisify(
        new this.THREE.TextureLoader()
      )
      this.fontLoader = this.tu.loaderPromisify(new this.THREE.FontLoader())
      this.mtlLoader = this.tu.loaderPromisify(new MTLLoader())

      this.camera.position.set(600, 500, 600)
      this.camera.lookAt(this.scene.position)
      this.addSpotLight()
      // this.addDirLight()
      this.drawFloor()
      // this.drawPipeGroup()
      // this.drawFlowingParticle()
      // await this.drawParticleBox()
      this.drawParticles()
      this.drawRunningBox()
      this.registerMouseEvent('mousemove', this.mousemove)
      // this.addHelper()
      this.floorAnimation()
    },
    trender() {
      this.floorTween && this.floorTween.update()
      this.wireframe && this.wireframe.update()
      !this.leftModelIn && this.modelEnter('leftModel')
      !this.centerModelIn &&
        this.modelEnter('centerModel', this.centerModelLineAnimate)
      // !this.centerModelIn && this.modelEnter('centerModel')
      !this.rightModelIn && this.modelEnter('rightModel')
      !this.leftModelEntered &&
        this.leftModelTween &&
        this.leftModelTween.update()
      !this.centerModelEntered &&
        this.centerModelTween &&
        this.centerModelTween.update()
      !this.rightModelEntered &&
        this.rightModelTween &&
        this.rightModelTween.update()
      this.flowingsAnimate()
      // this.flowingParticleAnimateHasPipe()
    },
    addHelper() {
      if (process.env.NODE_ENV !== 'development') return
      const axisHelper = new this.THREE.AxesHelper(1200)
      this.scene.add(axisHelper)

      // const pointLightHelper = new this.THREE.PointLightHelper(this.pointLight, 6)
      // this.scene.add(pointLightHelper)
      if (this.dirLight) {
        const dirLightHelper = new this.THREE.CameraHelper(
          this.dirLight.shadow.camera
        )
        this.scene.add(dirLightHelper)
      }
      this.gui && this.addGui()
    },
    addGui() {
      if (!this.gui) return
      this.addGuiFolder('Camera', this.camera)
      this.dirLight && this.addGuiFolder('DirLight', this.dirLight)
    },
    addGuiFolder(name, object) {
      if (!this.gui) return
      const folder = this.gui.addFolder(name)
      // const controls = new function() {
      //   const o = Array.isArray(object) ? object[0] : object
      //   this.rotationx = o.rotation.x || 0.01
      //   this.rotationy = o.rotation.y || 0.01
      //   this.rotationz = o.rotation.z || 0.01
      //   this.positionx = o.position.x
      //   this.positiony = o.position.y
      //   this.positionz = o.position.z
      //   this.visible = o.visible
      // }
      const o = Array.isArray(object) ? object[0] : object
      const controls = {
        visible: o.visible,
        rotationx: o.rotation.x || 0.01,
        rotationy: o.rotation.y || 0.01,
        rotationz: o.rotation.z || 0.01,
        positionx: o.position.x,
        positiony: o.position.y,
        positionz: o.position.z
      }
      /* eslint-disable */
      folder.add(controls, 'visible', -3000, 3000).onChange(e => {
        // console.log(object.position)
        Array.isArray(object)
          ? object.forEach(o => {
              o.visible = e
            })
          : (object.visible = e)
        // console.log(object.position)
      })
      folder.add(controls, 'rotationx', -5.0, 5.0).onChange(e => {
        Array.isArray(object)
          ? object.forEach(o => {
              o.rotation.x = e
            })
          : (object.rotation.x = e)
      })
      folder.add(controls, 'rotationy', -5.0, 5.0).onChange(e => {
        Array.isArray(object)
          ? object.forEach(o => {
              o.rotation.y = e
            })
          : (object.rotation.y = e)
      })
      folder.add(controls, 'rotationz', -5.0, 5.0).onChange(e => {
        Array.isArray(object)
          ? object.forEach(o => {
              o.rotation.z = e
            })
          : (object.rotation.z = e)
      })
      folder.add(controls, 'positionx', -3000, 3000).onChange(e => {
        Array.isArray(object)
          ? object.forEach(o => {
              o.position.x = e
            })
          : (object.position.x = e)
      })
      folder.add(controls, 'positiony', -3000, 3000).onChange(e => {
        Array.isArray(object)
          ? object.forEach((o, i) => {
              o.position.y = e
              o.position.y = -75 + i * 5
            })
          : (object.position.y = e)
      })
      folder.add(controls, 'positionz', -3000, 3000).onChange(e => {
        // console.log(object.position)
        Array.isArray(object)
          ? object.forEach(o => {
              o.position.z = e
            })
          : (object.position.z = e)
        // console.log(object.position)
      })
    }
  }
}
</script>

<style lang="scss">
.flow {
  @import '@/assets/css/chart-tip.scss';
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    // height: 100%;
  }
  .chart-tip-wrapper {
    h4 strong {
      color: $--color-primary;
    }
  }
  .tip-left {
    width: 480px !important;
    .progress-item {
      .label {
        width: 80px;
      }
      .el-progress {
        width: calc(100% - 80px);
      }
    }
  }
  .tip-center {
    width: 360px !important;
  }
}
</style>
