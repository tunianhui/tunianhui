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
        beforeRender: this.initThree,
        render: this.threeRender
      },
      fontUrl: '/t-sources/fonts/MicrosoftYaHei_Regular.json',
      trackColor: 0x222222, // 轨道颜色
      // 装饰圆数量
      decorateCount: 250,
      // 装饰圆的间距
      decorateGap: 80,
      decorateMinSize: 2,
      decorateMaxSize: 8,
      animationDuration: 1500,
      speed: 0.01,
      isRotate: true,
      data: [
        {name: 'IDC', value: 640, unit: 'PB'},
        {name: 'CDN', value: 460, unit: 'PB'},
        {name: 'DNS', value: 380, unit: 'PB'},
        {name: '备案', value: 360, unit: 'PB'},
        {name: '云', value: 180, unit: 'PB'}
      ]
    }
  },
  mounted() {
    // this.initThree()
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
      // this.drawTowerAsync()
      this.drawTowerPromise()
      // this.drawGraphicsAsync()
      this.drawGraphicsPromise()
      console.timeEnd('beforeRender')
      this._t_utils.registerMouseEvent('mousemove', this.mousemove, true)

      // this.addHelper()
    },
    threeRender() {
      this.camera.lookAt(this.scene.position)
      this.animation()
      this.rotateAll()
      this.rotateGraphicsImage()
      this.enterAnimateGroup && this.enterAnimateGroup.update()
      this.towerCircleGroup && this.towerCircleGroup.update()
    },
    mousemove(e) {
      const intersects = e.intersects
      this.isRotate = true
      if (intersects.length) {
        intersects.some(item => {
          const m = item.object
          if (m.parent instanceof this.THREE.Group && this.graphics.find(g => g.name === m.parent.name)) {
            this.isRotate = false
            return true
          }
        })
      }
    },
    drawTracks() {
      const size = 40,
        tracks = []
      Array.from({length: 30}, (t, i) => {
        if (i === 1) return
        tracks.push(this.drawTrack(size * i, -450 + i * 30))
      })
      tracks.push(this.drawTrack(size * 1.5, -375))
      this.tracks = Object.freeze(tracks)
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
      // this.tracks.push(track)
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
    async drawGraphicsAsync() {
      console.log('drawGraphics-async-start')
      console.time('drawGraphics-async')
      const font = await this.fontLoader(this.fontUrl),
        graphics = []
      let i = 0
      // eslint-disable-next-line
      for (const d of this.data) {
        const material = await this.textureLoader(`/t-sources/images/global/${(i % 13) + 1}.png`)
        const graphic = this.drawGraphic(material, font, i)
        graphics.push(graphic)
        i++
      }
      this.graphics = Object.freeze(graphics)
      console.timeEnd('drawGraphics-async')
    },
    drawGraphicsPromise() {
      console.log('drawGraphicsPromise-start')
      console.time('drawGraphicsPromise')
      this.fontLoader(this.fontUrl).then(font => {
        const promiseArr = this.data.map((d, i) => this.textureLoader(`/t-sources/images/global/${(i % 13) + 1}.png`))

        Promise.all(promiseArr).then(materials => {
          const graphics = []
          materials.forEach((material, i) => {
            graphics.push(this.drawGraphic(material, font, i))
          })
          this.graphics = Object.freeze(graphics)
          console.timeEnd('drawGraphicsPromise')
        })
      })
    },
    drawGraphic(material, font, i) {
      console.time('drawGraphic')
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
      group.add(nameText)
      group.add(valueText)
      group.add(obj)
      this.scene.add(group)
      console.timeEnd('drawGraphic')
      return group
    },
    setGraphicSize(value) {
      const s = value / 6,
        max = 100,
        min = 40
      return this._t_utils.getMiddleValue(max, min, s)
    },
    drawText(str, font, y) {
      // console.time('text')
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
      // console.timeEnd('text')
      return text
    },
    async drawTowerAsync() {
      console.time('drawTowerAsync')
      const fileName = '/t-sources/models/proc-head',
        materials = await this.mtlLoader(`${fileName}.mtl`)
      materials.side = this.THREE.DoubleSide
      materials.preload()
      materials.depthTest = false
      const objLoader = new OBJLoader()
      const objLoaderLoadFn = this._t_utils.promisify(objLoader.load, objLoader)
      objLoader.setMaterials(materials)

      const tower = await objLoaderLoadFn(`${fileName}.obj`)
      this.drawTower(tower)
      console.timeEnd('drawTowerAsync')
    },
    drawTowerPromise() {
      console.time('drawTowerPromise')
      const fileName = '/t-sources/models/proc-head'
      this.mtlLoader(`${fileName}.mtl`).then(materials => {
        materials.side = this.THREE.DoubleSide
        materials.preload()
        materials.depthTest = false
        const objLoader = new OBJLoader()
        const objLoaderLoadFn = this._t_utils.promisify(objLoader.load, objLoader)
        objLoader.setMaterials(materials)
        objLoaderLoadFn(`${fileName}.obj`).then(tower => {
          this.drawTower(tower)
          console.timeEnd('drawTowerPromise')
        })
      })
    },
    drawTower(tower) {
      tower.position.set(500, -2000, 60)
      tower.rotation.z = -0.3
      tower.scale.set(0.1, 0.1, 0.1)
      tower.renderOrder = 1000
      this.towerLight.taregt = tower
      this.drawTowerCircle(tower)
      this.tower = tower
      this.scene.add(tower)

      if (this.gui) {
        this.addGuiFolder('Tower', this.tower)
      }
    },
    drawTowerCircle(tower) {
      // let towerCircle
      const towerCircles = [0xD4A863, 0x46D3E9, 0x708FE4].map((color, i) => {
        const track = this.drawTrack(20 + i * 4, 275, 0.3, color)
        track.position.x = -248 + i * 6
        track.position.z = -15
        track.rotation.y = 0
        track.renderOrder = 1000
        track.originy = track.position.y
        tower.add(track)
        // this.towerCircle = track
        return track
      })
      this.towerCircles = Object.freeze(towerCircles)
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
    },
    drawDecorates() {
      // const decorates = []
      const materials = new this.THREE.MeshLambertMaterial({
        color: Math.random() * 0x999999,
        depthTest: false
      })
      const geometry = new this.THREE.SphereBufferGeometry(4, 100, 100)
      const group = new this.THREE.Group()
      for (let i = 0; i < this.decorateCount; i++) {
        // const x = this.randomPos(this.decorateGap)
        const radius = this.randomInRange(750, 200)
        const angle = this.randomInRange(-20, 10)
        const x = radius * Math.sin(angle)
        const y = this.randomPos(this.decorateGap)
        const z = radius * Math.cos(angle)
        // const z = this.randomPos(this.decorateGap)

        const scale = this.randomInRange(0.5, 2)
        const m = materials.clone()
        m.color.setStyle(this.randomHexColor())
        const s = new this.THREE.Mesh(geometry, m)
        s.position.set(x, y, z)
        s.scale.set(scale, scale, scale)
        group.add(s)
      }
      group.angle = 0
      group.position.y = -200
      this.gui && this.addGuiFolder('decorates', group)
      this.scene.add(group)
      this.decorates = group
    },
    // 随机生成十六进制颜色
    randomHexColor() {
      return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6)
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

      // sphere.traverse(e => {
      //   e.castShadow = true
      // })
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

        this.loaded = this.graphics && this.graphics.length === this.data.length && this.tower
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
      this.speed = this.isRotate ? 0.0015 : 0.0004
      this.isRotate && this.graphics && this.graphics.forEach(g => {
        this.rotate(g)
      })
      if (this.decorates) {
        this.decorates.angle += this.speed
        this.decorates.rotation.y = this.decorates.angle
      }
    },
    rotateGraphicsImage() {
      this.graphics && this.graphics.forEach(g => {
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
