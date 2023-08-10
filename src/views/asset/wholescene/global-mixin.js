import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import {setStyles} from '@/libs/dom'
import mixins from './mixins'
import {createCanvas, drawText, getTextWidth} from '@/libs/canvas'

export default {
  mixins: [mixins],
  data() {
    return {
      ballMin: 40,
      ballMax: 100,
      threeOpt: {
        background: 0x020109,
        beforeTrender: this.beforeTrender,
        trender: this.trender
      },
      trackColor: 0xffffff, // 轨道颜色
      trackInnerSize: 40,
      // 装饰圆数量
      decorateCount: 250,
      // 装饰圆的间距
      decorateGap: 80,
      decorateMinSize: 2,
      decorateMaxSize: 8,
      animationDuration: 1500,
      speed: 0.01,
      isRotate: true,
      data: {},
      activeGraphic: null,
      threeLoading: false,
      dataLoading: false
    }
  },
  methods: {
    async beforeTrender() {
      this.animationEasing = this.tweenEasing.exponentialInOut
      this.fontLoader = this.tu.loaderPromisify(new this.THREE.FontLoader())
      this.textureLoader = this.tu.loaderPromisify(
        new this.THREE.TextureLoader()
      )
      this.mtlLoader = this.tu.loaderPromisify(new MTLLoader())

      this.camera.position.set(600, 500, 600)
      this.camera.lookAt(this.scene.position)
      this.addDirLight()
      this.drawTracks()
      this.drawDecorates()
      // await this.drawTowerAsync()
      await this.drawCenterTower()
      this.registerMouseEvent('mousemove', this.mousemove)
      this.registerMouseEvent('click', this.changeTab)
      // this.addHelper()
    },
    trender() {
      this.graphicsEnter()
      this.towerEnter()
      this.rotateAll()
      this.rotateGraphicsImage()
      this.graphicsEnterGroup && this.graphicsEnterGroup.update()
      this.towerEnterGroup && this.towerEnterGroup.update()
      this.towerCircleGroup && this.towerCircleGroup.update()
    },
    changeTab(e) {
      const intersects = e.intersects,
        graphic = this.isGraphics(intersects)
      if (graphic) {
        this.$emit('changeTab', {
          tab: '结构',
          name: graphic.name
        })
        return
      }
      if (this.isTower(intersects)) {
        this.$emit('changeTab', {
          tab: '流动'
        })
      }
    },
    async mousemove(e) {
      const intersects = e.intersects,
        graphic = this.isGraphics(intersects)
      this.isRotate = !graphic
      this.activeGraphic = null
      if (graphic) {
        this.activeGraphic = this.graphicData.find(
          item => item.name === graphic.name
        )
        if (!this.activeGraphic) return

        await this.$sleep(30)
        const dom = this.$refs.graphicTip
        if (dom) {
          this.setPopperPos(e, dom)
          setStyles(dom, {opacity: 1})
        }
      }

      if (graphic || this.isTower(intersects)) {
        this.$refs.graph.style.cursor = 'pointer'
        return
      }
      this.$refs.graph.style.cursor = 'default'
    },
    isGraphics(intersects) {
      let graphic
      intersects.length &&
        intersects.some(item => {
          const m = item.object
          if (
            m.parent instanceof this.THREE.Group &&
            this.graphics &&
            this.graphics.find(g => g.name === m.parent.name)
          ) {
            graphic = item.object.parent
            return true
          }
        })
      return graphic
    },
    isTower(intersects) {
      let group
      intersects.length &&
        intersects.some(item => {
          const g = item.object.parent
          if (g instanceof this.THREE.Group && g.name === 'tower') {
            group = g
            return true
          }
        })
      return group
    },
    drawTracks() {
      const size = this.trackInnerSize,
        trackGroup = new this.THREE.Group()
      trackGroup.name = 'trackGroup'
      Array.from({length: 30}, (t, i) => {
        if (i === 1) return
        const track = this.drawTrack(size * i, -150 + i * 10)
        trackGroup.add(track)
      })
      const track = this.drawTrack(size * 1.4, -110)
      trackGroup.add(track)
      trackGroup.transparent = true
      this.scene.add(trackGroup)
      trackGroup.position.set(-104, -200, -100)
      this.tracks = trackGroup
    },
    // y y轴的偏移
    // w  w * 2线宽
    drawTrack(size, y, w = 0.4, color) {
      const material = new this.THREE.MeshBasicMaterial({
          color: color || this.trackColor
        }),
        geometry = new this.THREE.RingBufferGeometry(size - w, size + w, 100, 1)

      geometry.rotateX(-Math.PI / 2)
      // geometry.rotateY(-0.06)
      // geometry.lookAt(this.camera.position)
      const track = new this.THREE.Mesh(geometry, material)
      track.position.y = y
      return track
    },
    setSizeScale() {
      let min = Number.MAX_SAFE_INTEGER, max = Number.MIN_SAFE_INTEGER
      this.graphicData.forEach(item => {
        if (item.value < min) {
          min = item.value
        }
        if (item.value > max) {
          max = item.value
        }
      })
      this.sizeScale = this.$d3.scaleLinear()
        .domain([min, max])
        .range([this.ballMin, this.ballMax])
    },
    async drawGraphicsAsync() {
      const graphics = []
      let i = 0
      this.setSizeScale()
      // eslint-disable-next-line
      for (const d of this.graphicData) {
        const material = await this.textureLoader(
          `/t-sources/images/global/${(i % 13) + 1}.png`
        )
        const graphic = this.drawGraphic(material, i)
        graphics.push(graphic)
        i++
      }
      this.graphics = Object.freeze(graphics)
    },
    drawGraphicsPromise() {
      this.setSizeScale()
      const promiseArr = this.graphicData.map((d, i) =>
        this.textureLoader(`/t-sources/images/global/${(i % 13) + 1}.png`)
      )
      Promise.all(promiseArr).then(materials => {
        const graphics = []
        materials.forEach((material, i) => {
          graphics.push(this.drawGraphic(material, i))
        })
        this.graphics = Object.freeze(graphics)
      })
    },
    drawGraphic(material, i) {
      const {value, name, storage_unit} = this.graphicData[i],
        size = this.sizeScale(value),
        obj = new this.THREE.Mesh(
          new this.THREE.SphereBufferGeometry(size, 50, 50),
          new this.THREE.MeshLambertMaterial({
            map: material,
            depthTest: false
          })
        ),
        text = this.drawText(name, value + storage_unit),
        group = new this.THREE.Group()

      text.name = 'text'
      obj.name = 'image'
      group.scale.set(0.01, 0.01, 0.01)
      group.renderOrder = 1000
      group.angle = Math.PI + ((Math.PI * 2) / this.graphicData.length) * i
      group.radius = this.rendererSize.width / 3
      group.size = size
      group.name = name
      group.renderOrder = 1001
      group.add(text)
      group.add(obj)
      this.scene.add(group)
      return group
    },
    drawText(name, value) {
      const fontSize = 14,
        color = '#fff',
        textGap = 3,
        height = fontSize * 2 + textGap + 1,
        {canvas, context: ctx} = createCanvas(200, height),
        nameWidth = getTextWidth(ctx, name, {fontSize}),
        valueWidth = getTextWidth(ctx, value, {fontSize}),
        width = Math.max(nameWidth, valueWidth)
      canvas.width = width + 1
      drawText(ctx, {
        fontSize,
        color,
        textBaseline: 'top',
        text: name,
        x: width / 2,
        y: 1
      })
      drawText(ctx, {
        fontSize,
        color,
        textBaseline: 'top',
        text: value,
        x: width / 2,
        y: 1 + fontSize + textGap
      })
      const mesh = this.drawTextPlane(canvas, width, height)
      mesh.renderOrder = 2
      mesh.geometry.center()
      mesh.lookAt(this.camera.position)
      return mesh
    },
    drawTextPlane(canvas, width, height) {
      const texture = new this.THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      texture.minFilter = this.THREE.LinearFilter
      const planeGeometry = new this.THREE.PlaneBufferGeometry(
          width,
          height,
          1,
          1
        ),
        planeMaterial = new this.THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: this.THREE.DoubleSide,
          blending: this.THREE.AdditiveBlending
        })
      return new this.THREE.Mesh(planeGeometry, planeMaterial)
    },
    async drawCenterTower() {
      const filename = '/t-sources/models/center',
        centerModel = await this.loadModel(filename),
        position = [342, -1400, -100]
      centerModel.position.set(...position)
      centerModel.scale.set(this.modelScale, this.modelScale, this.modelScale)
      centerModel.name = 'tower'
      centerModel.transparent = true

      this.drawTowerCircle(centerModel)
      this.tower = centerModel
      this.scene.add(centerModel)

      this.addGuiFolder('Tower', centerModel)
    },
    async drawTowerAsync() {
      const fileName = '/t-sources/models/center',
        materials = await this.mtlLoader(`${fileName}.mtl`)
      materials.side = this.THREE.DoubleSide
      materials.preload()
      materials.depthTest = false
      const objLoader = new OBJLoader()
      const objLoaderLoadFn = this.tu.promisify(objLoader.load, objLoader)
      objLoader.setMaterials(materials)

      const tower = await objLoaderLoadFn(`${fileName}.obj`)
      this.drawTower(tower)
    },
    drawTowerPromise() {
      const fileName = '/t-sources/models/center'
      this.mtlLoader(`${fileName}.mtl`).then(materials => {
        materials.side = this.THREE.DoubleSide
        materials.preload()
        materials.depthTest = false
        const objLoader = new OBJLoader()
        const objLoaderLoadFn = this.tu.promisify(objLoader.load, objLoader)
        objLoader.setMaterials(materials)
        objLoaderLoadFn(`${fileName}.obj`).then(tower => {
          this.drawTower(tower)
        })
      })
    },
    drawTower(tower) {
      this.drawTowerCircle(tower)
      // tower.position.set(200, -1100, 250)
      // tower.position.set(342, -60, -100)
      tower.position.set(342, -1400, -100)
      // tower.scale.set(0.1, 0.1, 0.1)
      tower.scale.set(2.5, 2.5, 2.5)
      tower.name = 'tower'
      tower.transparent = true
      this.tower = tower
      this.scene.add(tower)

      this.addGuiFolder('Tower', this.tower)
    },
    drawTowerCircle(tower) {
      // let towerCircle
      const towerCircles = [0xd4a863, 0x46d3e9, 0x708fe4].map((color, i) => {
        const track = this.drawTrack(22 + i * 5, 258 + i * 5, 0.5, color)
        track.position.x = -189
        track.position.z = -12
        // track.position.z = -15
        track.rotation.x = 0.01
        track.rotation.y = 0.01
        track.rotation.z = 0.01
        track.renderOrder = 1000
        track.originy = track.position.y
        tower.add(track)
        !this.towerCircle && (this.towerCircle = track)
        return track
      })
      this.towerCircles = Object.freeze(towerCircles)
      // this.towerCircles = towerCircles

      if (!this.gui) return
      const slef = this
      const folder = this.gui.addFolder('towerCircle')
      const controls = new function() {
        this.positionx = slef.towerCircle.position.x
        this.positiony = slef.towerCircle.position.y
        this.positionz = slef.towerCircle.position.z
        this.rotationx = slef.towerCircle.rotation.x
        this.rotationy = slef.towerCircle.rotation.y
        this.rotationz = slef.towerCircle.rotation.z
      }()
      folder.add(controls, 'positionx', -1000, 1000).onChange(e => {
        slef.towerCircle.position.x = e
      })
      folder.add(controls, 'positiony', -1000, 1000).onChange(e => {
        slef.towerCircle.position.y = e
      })
      folder.add(controls, 'positionz', -1000, 1000).onChange(e => {
        slef.towerCircle.position.z = e
      })
      folder.add(controls, 'rotationx', -3, 3).onChange(e => {
        slef.towerCircle.rotation.x = e
      })
      folder.add(controls, 'rotationy', -3, 3).onChange(e => {
        slef.towerCircle.rotation.y = e
      })
      folder.add(controls, 'rotationz', -3, 3).onChange(e => {
        slef.towerCircle.rotation.z = e
      })
    },
    drawDecorates() {
      const geometry = new this.THREE.SphereBufferGeometry(4, 100, 100)
      const group = new this.THREE.Group()
      for (let i = 0; i < this.decorateCount; i++) {
        const radius = this.tu.randomInRange(
            this.rendererSize.width / 1.5,
            300
          ),
          angle = this.tu.randomInRange(-20, 10),
          x = radius * Math.sin(angle),
          // y = this.randomPos(this.decorateGap),
          y =
            Math.random() *
            this.decorateGap *
            2 *
            (Math.random() < 0.5 ? -1 : 1),
          z = radius * Math.cos(angle),
          scale = this.tu.randomInRange(0.1, 2),
          h = Math.ceil(this.tu.randomInRange(0, 360)),
          l = Math.ceil(this.tu.randomInRange(5, 15)),
          // MeshLambertMaterial
          materials = new this.THREE.MeshBasicMaterial({
            // color: new this.THREE.Color(rnd, rnd, rnd),
            color: new this.THREE.Color(`hsl(${h}, 50%, ${l}%)`),
            depthTest: false
          }),
          s = new this.THREE.Mesh(geometry, materials)
        s.position.set(x, y, z)
        s.scale.set(scale, scale, scale)
        group.add(s)
      }
      group.angle = 0
      group.tansparent = true
      group.position.y = -200
      this.addGuiFolder('decorates', group)
      this.scene.add(group)
      this.decorates = group
    },
    animateTowerCircle() {
      this.towerCircleGroup = new this.TWEEN.Group()
      const easing = this.tweenEasing.linear,
        duration = 1500,
        gutter = 3
      this.towerCircles.forEach((c, i) => {
        const {x, y, z} = c.position,
          upOrigin = {x, y, z},
          downOrigin = {x, y: y + gutter, z},
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
      new this.TWEEN.Tween(this, this.towerCircleGroup).to({}, duration).start()
    },
    graphicsEnter() {
      if (this.graphicsEnterIn) return
      if (!this.graphicsEnterGroup) {
        this.graphicsEnterGroup = new this.TWEEN.Group()
      }
      this.graphicsEnterGroup && this.graphicsEnterGroup.removeAll()

      this.graphicsEnterIn =
        this.graphics && this.graphics.length === this.graphicData.length

      if (!this.graphicsEnterIn) return
      this.graphics &&
        this.graphics.forEach((g, index) => {
          new this.TWEEN.Tween(g.scale, this.graphicsEnterGroup)
            .to({x: 1, y: 1, z: 1}, this.animationDuration)
            .easing(this.animationEasing)
            .delay(index * 50)
            .start()
        })

      new this.TWEEN.Tween(this, this.graphicsEnterGroup)
        .to({}, this.animationDuration)
        .start()
    },
    towerEnter() {
      if (this.towerEnterIn) return
      if (!this.towerEnterGroup) {
        this.towerEnterGroup = new this.TWEEN.Group()
      }
      this.towerEnterGroup && this.towerEnterGroup.removeAll()
      this.towerEnterIn = !!this.tower
      new this.TWEEN.Tween(this.tower.position, this.towerEnterGroup)
        // .to({ x: 624, y: -560, z: 250 }, this.animationDuration)
        .to({x: 342, y: -900, z: -100}, this.animationDuration)
        // .to({ x: 624, y: -this.rendererSize.height * 12 / 13, z: 250 }, this.animationDuration)
        .easing(this.animationEasing)
        .start()
      // new this.TWEEN.Tween(this.tower.scale, this.towerEnterGroup)
      //   .to({ x: 2.5, y: 2.5, z: 2.5 }, this.animationDuration)
      //   .easing(this.animationEasing)
      //   .start()
      new this.TWEEN.Tween(this, this.towerEnterGroup)
        .to({}, this.animationDuration)
        .onComplete(_ => {
          this.animateTowerCircle()
        })
        .start()
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
      this.isRotate &&
        this.graphics &&
        this.graphics.forEach(g => {
          this.rotate(g)
        })
      if (this.decorates) {
        this.decorates.angle += this.speed
        this.decorates.rotation.y = this.decorates.angle
      }
    },
    rotateGraphicsImage() {
      this.graphics &&
        this.graphics.forEach(g => {
          const obj = g.getObjectByName('image')
          obj.rotation.y += 0.002
          if (obj.rotation.y > Math.PI * 2) {
            obj.rotation.y -= Math.PI * 2
          }
        })
    },
    addDirLight() {
      // const { width } = this.rendererSize
      const dirLight = new this.THREE.DirectionalLight(0xffffff, 1.5)
      // dirLight.position.set(350, 600, 500)
      dirLight.position.set(300, 500, 300)
      dirLight.castShadow = true
      dirLight.shadow.mapSize.width = dirLight.shadow.mapSize.height = 2048
      this.dirLight = dirLight
      this.scene.add(dirLight)
    },
    addHelper() {
      if (process.env.NODE_ENV !== 'development') return
      const axisHelper = new this.THREE.AxesHelper(1200)
      const dirLightHelper = new this.THREE.CameraHelper(
        this.dirLight.shadow.camera
      )
      this.scene.add(axisHelper)
      this.scene.add(dirLightHelper)
      this.addGui()
    },
    addGui() {
      if (!this.gui) return
      this.addGuiFolder('Camera', this.camera)
      this.addGuiFolder('DirLight', this.dirLight)
      this.addGuiFolder('Tracks', this.tracks)
    },
    addGuiFolder(name, object) {
      if (!this.gui) return
      const folder = this.gui.addFolder(name)
      const controls = new function() {
        const o = Array.isArray(object) ? object[0] : object
        this.rotationx = o.rotation.x
        this.rotationy = o.rotation.y
        this.rotationz = o.rotation.z
        this.positionx = o.position.x
        this.positiony = o.position.y
        this.positionz = o.position.z
      }()
      folder.add(controls, 'rotationx', -3, 3).onChange(e => {
        Array.isArray(object)
          ? object.forEach(o => {
            o.rotation.x = e
          })
          : (object.rotation.x = e)
      })
      folder.add(controls, 'rotationy', -3, 3).onChange(e => {
        Array.isArray(object)
          ? object.forEach(o => {
            o.rotation.y = e
          })
          : (object.rotation.y = e)
      })
      folder.add(controls, 'rotationz', -3, 3).onChange(e => {
        Array.isArray(object)
          ? object.forEach(o => {
            o.rotation.z = e
          })
          : (object.rotation.z = e)
      })
      folder.add(controls, 'positionx', -2000, 2000).onChange(e => {
        Array.isArray(object)
          ? object.forEach(o => {
            o.position.x = e
          })
          : (object.position.x = e)
      })
      folder.add(controls, 'positiony', -2000, 2000).onChange(e => {
        Array.isArray(object)
          ? object.forEach((o, i) => {
            o.position.y = e
            o.position.y = -75 + i * 5
          })
          : (object.position.y = e)
      })
      folder.add(controls, 'positionz', -2000, 2000).onChange(e => {
        Array.isArray(object)
          ? object.forEach(o => {
            o.position.z = e
          })
          : (object.position.z = e)
      })
    },
    updateData() {
      this.graphics = this.graphics.map(g => {
        const gd = this.graphicData.find(d => d.name === g.name)
        if (!gd) return
        const {value, storage_unit} = gd,
          valueText = g.getObjectByName('value'),
          nameText = g.getObjectByName('name'),
          obj = g.getObjectByName('image'),
          size = this.sizeScale(value),
          _obj = new this.THREE.Mesh(
            new this.THREE.SphereBufferGeometry(size, 50, 50),
            obj.material
          ),
          _valueText = this.drawText(
            value + storage_unit,
            valueText.geometry.parameters.parameters.font,
            -15
          ),
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
        this.deleteGroup(g)
        this.scene.add(ng)
        return ng
      })
    }
  }
}
