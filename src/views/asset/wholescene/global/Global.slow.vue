<template>
  <section class="global">
    <div class="chart" v-three.tween.gui.stats="threeOpt"></div>
  </section>
</template>

<script>
// import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'

export default {
  name: 'Global',
  components: {},
  data() {
    return {
      threeOpt: {
        background: 0x020109,
        // beforeRender: this.initThree,
        render: this.threeRender
      },
      fontUrl: '/t-sources/fonts/MicrosoftYaHei_Regular.json',
      trackColor: 0x222222, // 轨道颜色
      // 装饰圆数量
      decorateCount: 200,
      // 装饰圆的间距
      decorateGap: 72,
      decorateMinSize: 2,
      decorateMaxSize: 8,
      animationDuration: 1500,
      tracks: [],
      decorates: [],
      graphics: [],
      graphicNames: [],
      towerCircles: [],
      speed: 0.01,
      isRotate: true,
      data: [
        {name: 'IDC', value: 640, unit: 'PB', size: 220, position: [18, 0, 80]},
        {name: 'CDN', value: 460, unit: 'PB', size: 120, position: [-60, 0, 40]},
        {name: 'DNS', value: 380, unit: 'PB', size: 160, position: [-60, 0, -40]},
        {name: '备案', value: 360, unit: 'PB', size: 90, position: [18, 0, -80]},
        {name: '云', value: 180, unit: 'PB', size: 120, position: [80, 0, 0]}
      ]
    }
  },
  mounted() {
    this.initThree()
  },
  methods: {
    initThree() {
      console.time('beforeRender')
      this.animationEasing = this.tweenEasing.exponentialInOut
      this.fontLoader = this._t_utils.loaderPromisify(new this.THREE.FontLoader())
      this.textureLoader = this._t_utils.loaderPromisify(new this.THREE.TextureLoader())
      this.mtlLoader = this._t_utils.loaderPromisify(new MTLLoader())

      this.camera.position.set(-500, 750, 0)
      this.camera.lookAt(this.scene.position)
      this.addLight()
      this.drawTracks()
      this.drawDecorates()
      // this.drawTower()
      // this.drawGraphics()
      console.timeEnd('beforeRender')
      // this.addHelper()
    },
    threeRender() {
      // console.log('renderer')
      this.camera.lookAt(this.scene.position)
      this.animation()
      this.rotateAll()
      this.rotateGraphicsImage()
      this.enterAnimateGroup && this.enterAnimateGroup.update()
      this.towerCircleGroup && this.towerCircleGroup.update()
    },
    drawTracks() {
      const size = 40
      Array.from({length: 30}, (t, i) => {
        if (i === 1) return
        this.drawTrack(size * i, -450 + i * 30)
      })
      this.drawTrack(size * 1.5, -375)
    },
    // y y轴的偏移
    // w  w * 2线宽
    drawTrack(size, y, w = 0.2, color) {
      const material = new this.THREE.MeshBasicMaterial({
        color: color || this.trackColor
      })
      // material.side = this.THREE.DounbleSide
      const track = new this.THREE.Mesh(
        new this.THREE.RingGeometry(size - w, size + w, 64, 1),
        material
      )
      track.rotation.x = -Math.PI / 2
      track.rotation.y = 0.3
      track.position.y = y
      this.scene.add(track)
      this.tracks.push(track)
      return track
    },
    updateData() {
      this.graphics = this.graphics.map(g => {
        const gd = this.data.find(d => d.name === g.name)
        if (!gd) return
        const {value, unit} = gd,
          valueText = g.getObjectByName('value'),
          nameText = g.getObjectByName('name'),
          obj = g.getObjectByName('image'),
          size = this.setGraphicSize(value),
          _obj = new this.THREE.Mesh(
            new this.THREE.SphereBufferGeometry(size, 50, 50),
            obj.material
          ),
          _valueText = this.drawText(value + unit, valueText.geometry.parameters.parameters.font, -15),
          ng = new this.THREE.Group()

        _valueText.name = 'value'
        _obj.name = 'image'
        ng.renderOrder = g.renderOrder
        ng.angle = g.angle
        ng.radius = g.radius
        ng.name = g.name
        ng.size = size
        ng.position.copy(g.position)
        ng.add(nameText)
        ng.add(_valueText)
        ng.add(_obj)
        // console.log(g.position, 'position')
        // Object.assign(g, ng)

        // g.traverse(item => {
        //   if (item instanceof THREE.Mesh) {
        //     item.geometry.dispose()
        //     item.material.dispose()
        //   }
        // })
        // this.scene.remove(g)
        this._t_utils.deleteGroup(g)
        this.scene.add(ng)
        return ng
      })
    },
    /*
    async drawGraphics() {
      const font = await this.fontLoader(this.fontUrl)
      let i = 0

      for (const d of this.data) {
        const {value, name, unit} = d,
          size = this.setGraphicSize(value),
          material = await this.textureLoader(`/t-sources/images/global/${i + 1}.png`)

        material.side = this.THREE.DoubleSide

        const obj = new this.THREE.Mesh(
            new this.THREE.SphereBufferGeometry(size, 50, 50),
            new this.THREE.MeshBasicMaterial({
              map: material,
              depthTest: false
            })
            // material
          ),

          nameText = this.drawText(name, font, 15),
          valueText = this.drawText(value + unit, font, -15),
          group = new this.THREE.Group()

        nameText.name = 'name'
        valueText.name = 'value'
        obj.name = 'image'
        group.scale.set(0.01, 0.01, 0.01)
        group.add(nameText)
        group.add(valueText)
        group.add(obj)
        group.renderOrder = 1000
        group.angle = Math.PI + Math.PI * 2 / this.data.length * i++
        group.radius = 300
        group.size = size
        group.name = name
        group.renderOrder = 1001
        this.scene.add(group)
        this.graphics.push(group)
        this.graphicNames.push(name)
      }
    },
    async drawTower() {
      const fileName = '/t-sources/models/proc-head',
        materials = await this.mtlLoader(`${fileName}.mtl`)
      materials.side = this.THREE.DoubleSide
      materials.preload()
      materials.depthTest = false
      const objLoader = new OBJLoader()
      const objLoaderLoadFn = this._t_utils.promisify(objLoader.load, objLoader)
      objLoader.setMaterials(materials)

      const tower = await objLoaderLoadFn(`${fileName}.obj`)
      if (tower) {
        tower.position.set(500, -2000, 60)
        tower.rotation.z = -0.3
        tower.scale.set(0.1, 0.1, 0.1)
        this.scene.add(tower)
        this.tower = tower
        tower.renderOrder = 1000
        this.towerLight.taregt = tower

        if (this.gui) {
          this.addGuiFolder('Tower', this.tower)
        }
        setTimeout(_ => this.drawTowerCircle(), this.animationDuration * 1.5)
      }
    },
    */
    drawGraphics() {
      this.fontLoader(this.fontUrl).then(font => {
        const promiseArr = this.data.map((d, i) => this.textureLoader(`/t-sources/images/global/${(i % 13) + 1}.png`)),
          graphics = [],
          graphicNames = []

        Promise.all(promiseArr).then(materials => {
          console.time('each')
          materials.forEach((material, i) => {
            console.time('item')
            const {value, name, unit} = this.data[i],
              size = this.setGraphicSize(value),
              obj = new this.THREE.Mesh(
                new this.THREE.SphereBufferGeometry(size, 50, 50),
                new this.THREE.MeshBasicMaterial({
                  map: material,
                  depthTest: false
                })
              ),
              nameText = this.drawText(name, font, 15),
              valueText = this.drawText(value + unit, font, -15),
              group = new this.THREE.Group()

            nameText.name = 'name'
            valueText.name = 'value'
            obj.name = 'image'
            group.scale.set(0.01, 0.01, 0.01)
            group.renderOrder = 1000
            group.angle = Math.PI + Math.PI * 2 / this.data.length * i
            group.radius = 300
            group.size = size
            group.name = name
            group.renderOrder = 1001
            console.time('add')
            group.add(nameText)
            group.add(valueText)
            group.add(obj)
            this.scene.add(group)
            graphics.push(group)
            graphicNames.push(name)
            console.timeEnd('add')
            console.timeEnd('item')
          })
          this.graphics = Object.freeze(graphics)
          this.graphicNames = Object.freeze(graphicNames)
          console.timeEnd('each')
        })
      })
    },
    drawTower() {
      const fileName = '/t-sources/models/proc-head'
      this.mtlLoader(`${fileName}.mtl`).then(materials => {
        materials.side = this.THREE.DoubleSide
        materials.preload()
        materials.depthTest = false
        const objLoader = new OBJLoader()
        const objLoaderLoadFn = this._t_utils.promisify(objLoader.load, objLoader)
        objLoader.setMaterials(materials)
        objLoaderLoadFn(`${fileName}.obj`).then(tower => {
          if (tower) {
            // this.tower = new this.THREE.Group()
            // tower.add(tower)
            tower.position.set(500, -2000, 60)
            tower.rotation.z = -0.3
            tower.scale.set(0.1, 0.1, 0.1)
            tower.renderOrder = 1000
            this.towerLight.taregt = tower
            this.tower = tower
            this.drawTowerCircle()

            this.scene.add(tower)
            if (this.gui) {
              this.addGuiFolder('Tower', this.tower)
            }
          }
        })
      })
    },
    drawTowerCircle() {
      // let towerCircle
      [0xD4A863, 0x46D3E9, 0x708FE4].forEach((color, i) => {
        const track = this.drawTrack(20 + i * 4, 275, 0.3, color)
        track.position.x = -248 + i * 6
        track.position.z = -15
        track.rotation.y = 0
        track.renderOrder = 1000
        track.originy = track.position.y
        this.towerCircles.push(track)
        this.tower && this.tower.add(track)
        this.towerCircle = track
      })

      // const controls = new function() {
      //   this.positionx = this.towerCircle.position.x
      //   this.positiony = this.towerCircle.position.y
      //   this.positionz = this.towerCircle.position.z
      //   this.rotationx = this.towerCircle.rotation.x
      //   this.rotationy = this.towerCircle.rotation.y
      //   this.rotationz = this.towerCircle.rotation.z
      // }
      // this.gui.add(controls, 'positionx', -1000, 1000).onChange(e => {
      //   this.towerCircle.position.x = e
      // })
      // this.gui.add(controls, 'positiony', -1000, 1000).onChange(e => {
      //   this.towerCircle.position.y = e
      // })
      // this.gui.add(controls, 'positionz', -1000, 1000).onChange(e => {
      //   this.towerCircle.position.z = e
      // })
      // this.gui.add(controls, 'rotationx', -3, 3).onChange(e => {
      //   this.towerCircle.rotation.x = e
      // })
      // this.gui.add(controls, 'rotationy', -3, 3).onChange(e => {
      //   this.towerCircle.rotation.y = e
      // })
      // this.gui.add(controls, 'rotationz', -3, 3).onChange(e => {
      //   this.towerCircle.rotation.z = e
      // })
      // this.animateTowerCircle()
    },
    setGraphicSize(value) {
      const s = value / 6,
        max = 100,
        min = 40
      return this._t_utils.getMiddleValue(max, min, s)
    },
    drawText(str, font, y) {
      console.time('text')
      const material = new this.THREE.MeshBasicMaterial({
        color: 0xffffff
      })
      // material.side = this.THREE.DounbleSide
      const text = new this.THREE.Mesh(
        new this.THREE.TextGeometry(str, {
          font,
          size: 10,
          height: 4,
          style: 'normal',
          bevelThickness: 1,
          bevelSize: 1,
          bevelSegments: 1,
          curveSegments: 50,
          steps: 1
        }),
        material
      )

      text.renderOrder = 2
      text.position.y = y
      /* 文字居中 */
      text.geometry.center()
      /* 面向相机 */
      text.lookAt(this.camera.position)
      console.timeEnd('text')
      return text
    },
    drawDecorates() {
      for (let i = 0; i < this.decorateCount; i++) {
        const x = this.randomPos(this.decorateGap)
        const y = this.randomPos(this.decorateGap)
        const z = this.randomPos(this.decorateGap)
        const size = this.randomInRange(this.decorateMinSize, this.decorateMaxSize)
        const pos = [x, y, z]

        // 找出绝对值最大的数
        const biggest = pos.reduce((prev, cur) => {
          return Math.abs(prev) > Math.abs(cur) ? prev : cur
        })

        // 如果绝对值最大值比间距小，则取间距的值
        if (Math.abs(biggest) < this.decorateGap) {
          const biggestIndex = pos.findIndex(i => i === biggest)
          pos[biggestIndex] = biggest < 0 ? -this.decorateGap : this.decorateGap
        }
        // pos[1] = Math.abs(pos[1])
        const decorate = this.createSphere(pos, size)
        this.decorates.push(decorate)
      }
    },
    createSphere(position, size, color) {
      const materials = new this.THREE.MeshLambertMaterial({
        color: Math.random() * 0x999999,
        depthTest: false
      })
      const sphere = new this.THREE.Mesh(
        new this.THREE.SphereBufferGeometry(size, 100, 100),
        materials
      )

      sphere.traverse(e => {
        e.castShadow = true
      })
      sphere.angle = Math.random() * 50
      // 最大距离700，最小距离180
      sphere.radius = Math.random() * (750 - 180) + 180
      sphere.position.set(...position)
      this.scene.add(sphere)
      return sphere
    },
    randomInRange(min, max) {
      return Math.ceil(Math.random() * (max - min) + min)
    },
    randomPos(gap) {
      return (Math.random() * gap * 2) * (Math.random() < 0.5 ? -1 : 1)
    },
    randomColor() {
      return (Math.random() + 1) / 2
    },
    animateTowerCircle() {
      this.towerCircleGroup = new this.TWEEN.Group()
      const easing = this.tweenEasing.linear,
        duration = 1500,
        gutter = 4
      this.towerCircles.forEach((c, i) => {
        const {x, y, z} = c.position,
          upOrigin = { x, y, z },
          downOrigin = { x, y: y + gutter, z },
          up = new this.TWEEN.Tween(upOrigin, this.towerCircleGroup)
            .to(downOrigin, duration)
            .delay(200 * i)
            .easing(easing)
            .onUpdate(position => {
              c.position.copy(position)
            })
            .onComplete(_ => {
              upOrigin.y = y
            }),
          down = new this.TWEEN.Tween(downOrigin, this.towerCircleGroup)
            .to(upOrigin, duration)
            .delay(200 * i)
            .easing(easing)
            .onUpdate(position => {
              c.position.copy(position)
            })
            .onComplete(_ => {
              downOrigin.y = y + gutter
            })

        up.chain(down)
        down.chain(up)
        up.start()
      })
      new this.TWEEN.Tween(this, this.towerCircleGroup)
        .to({}, duration)
        // .delay(this.animationDuration)
        .start()
    },
    animation() {
      if (!this.loaded) {
        if (!this.enterAnimateGroup) {
          this.enterAnimateGroup = new this.TWEEN.Group()
        }
        this.enterAnimateGroup && this.enterAnimateGroup.removeAll()

        this.loaded = this.graphics.length === this.data.length && this.tower
        if (!this.loaded) return
        this.graphics.forEach((g, index) => {
          new this.TWEEN.Tween(g.scale, this.enterAnimateGroup)
            .to({
              x: 1,
              y: 1,
              z: 1
            }, this.animationDuration)
            .easing(this.animationEasing)
            .delay(index * 50)
            .start()
        })
        if (this.tower) {
          new this.TWEEN.Tween(this.tower.position, this.enterAnimateGroup)
            .to({ x: 550, y: -1450, z: 60 }, this.animationDuration)
            .easing(this.animationEasing)
            .start()
          new this.TWEEN.Tween(this.tower.scale, this.enterAnimateGroup)
            .to({ x: 4, y: 4, z: 4 }, this.animationDuration)
            .easing(this.animationEasing)
            .start()
        }

        new this.TWEEN.Tween(this, this.enterAnimateGroup)
          .to({}, this.animationDuration)
          .onComplete(_ => {
            this.animateTowerCircle()
          })
          // .onUpdate(_ => {
          //   console.log(this.graphics)
          // })
          .start()
      }
    },
    rotate(g) {
      const x = g.radius
      // g.angle += g.speed
      g.angle += this.speed
      g.angle > Math.PI * x && (g.angel -= Math.PI * x)
      g.position.x = x * Math.sin(g.angle)
      g.position.z = x * Math.cos(g.angle)
    },
    rotateAll() {
      this.speed = this.isRotate ? 0.0015 : 0.00015
      this.isRotate && this.graphics.forEach(g => {
        this.rotate(g)
      })
      this.decorates.forEach(g => {
        this.rotate(g)
      })
    },
    rotateGraphicsImage() {
      this.graphics.forEach(g => {
        const obj = g.getObjectByName('image')
        obj.rotation.y += 0.005
        if (obj.rotation.y > Math.PI * 2) {
          obj.rotation.y -= Math.PI * 2
        }
      })
    },
    addLight() {
      const {width} = this.rendererSize
      const dirLight = new this.THREE.DirectionalLight(0xffffff, 1.1)
      // dirLight.position.set(200, -200, 100)
      dirLight.position.set(1, 0, 0)
      dirLight.castShadow = true
      dirLight.shadow.mapSize.width = dirLight.shadow.mapSize.height = width * 2.5
      this.dirLight = dirLight
      this.scene.add(dirLight)

      const towerLight = new this.THREE.SpotLight(0xffffff, 0.5)
      towerLight.castShadow = true
      towerLight.shadow.camera.near = 5
      towerLight.shadow.camera.far = 1000
      towerLight.shadow.camera.left = -250
      towerLight.shadow.camera.right = 250
      towerLight.shadow.camera.top = 250
      towerLight.shadow.camera.bottom = -250
      towerLight.shadow.mapSize.width = towerLight.shadow.mapSize.height = width * 2.5
      this.towerLight = towerLight

      // towerLight.position.set(0, 25, 0)
      towerLight.position.set(80, 100, 0)
      this.scene.add(towerLight)

      const ambient = new this.THREE.AmbientLight(0xffffff, 0.3)
      this.scene.add(ambient)
    },
    addHelper() {
      const axisHelper = new this.THREE.AxesHelper(1200)
      const dirLightHelper = new this.THREE.CameraHelper(this.dirLight.shadow.camera)
      const ctowerLightHelper = new this.THREE.CameraHelper(this.towerLight.shadow.camera)
      this.scene.add(axisHelper)
      this.scene.add(dirLightHelper)
      this.scene.add(ctowerLightHelper)
      this.gui && this.addGui()
    },
    addGui() {
      this.addGuiFolder('Camera', this.camera)
      this.addGuiFolder('dirLight', this.dirLight)
      this.addGuiFolder('CenterObjectLight', this.towerLight)
      this.addGuiFolder('Tracks', this.tracks)
    },
    addGuiFolder(name, object) {
      const folder = this.gui.addFolder(name)
      const trackControls = new function() {
        const o = Array.isArray(object) ? object[0] : object
        this.rotationx = o.rotation.x
        this.rotationy = o.rotation.y
        this.rotationz = o.rotation.z
        this.positionx = o.position.x
        this.positiony = o.position.y
        this.positionz = o.position.z
      }
      folder.add(trackControls, 'rotationx', -1, 1).onChange(e => {
        Array.isArray(object) ? object.forEach(o => {
          o.rotation.x = e
        }) : (object.rotation.x = e)
      })
      folder.add(trackControls, 'rotationy', -1, 1).onChange(e => {
        Array.isArray(object) ? object.forEach(o => {
          o.rotation.y = e
        }) : (object.rotation.y = e)
      })
      folder.add(trackControls, 'rotationz', -1, 1).onChange(e => {
        Array.isArray(object) ? object.forEach(o => {
          o.rotation.z = e
        }) : (object.rotation.z = e)
      })
      folder.add(trackControls, 'positionx', -3000, 3000).onChange(e => {
        Array.isArray(object) ? object.forEach(o => {
          o.position.x = e
        }) : (object.position.x = e)
      })
      folder.add(trackControls, 'positiony', -3000, 3000).onChange(e => {
        Array.isArray(object) ? object.forEach((o, i) => {
          o.position.y = e
          o.position.y = -75 + i * 5
        }) : (object.position.y = e)
      })
      folder.add(trackControls, 'positionz', -3000, 3000).onChange(e => {
        Array.isArray(object) ? object.forEach(o => {
          o.position.z = e
        }) : (object.position.z = e)
      })
    }
  }
}
</script>

<style lang="scss">
.global {
  width: 100%;
  height: 100%;
}
</style>
