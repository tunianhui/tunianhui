// import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader'
// import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import FlyLine from '@/libs/three-flyline'
import mixins from './mixins'
import { setStyles } from '@/libs/dom'
import { capitalize } from '@/libs/util'
import { createCanvas, drawText } from '@/libs/canvas'
// eslint-disable-next-line
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
// eslint-disable-next-line
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
// eslint-disable-next-line
import { Line2 } from 'three/examples/jsm/lines/Line2'

const fragmentShader = `
uniform sampler2D texture;
varying vec3 vColor;
void main() {
  gl_FragColor = vec4( vColor, 1.0 );
  gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
}
`
const vertexShader = `
attribute float size;
varying vec3 vColor;
void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_PointSize = size * ( 300.0 / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}
`

export default {
  mixins: [mixins],
  data() {
    return {
      // 场景基础颜色
      baseColor: 0x2e3342,
      // 鼠标悬浮在物体上，物体颜色改变
      activeColor: 0x3f475a,
      floorColor: 0x393d44,
      // 地上box的随机颜色色
      // randomColor: 0x7932FD,
      randomColor: 0x2253d4,
      // 运动的box的颜色
      runningBoxColor: 0x866fff,
      // 运动的粒子的颜色
      particleColor: 0x75eacc,
      modelRotationy: (-Math.PI * 6) / 11,
      modelScale: 2.5,
      labelColor: '#555555',
      flowings: [],
      visibleLeftTip: false,
      visibleCenterTip: false,
      visibleRightTip: false
    }
  },
  methods: {
    async mousemove(e) {
      const intersects = e.intersects
      this.visibleCenterTip = false
      this.visibleLeftTip = false
      this.visibleRightTip = false
      const models = ['left', 'right', 'center']
      if (intersects && intersects.length) {
        const mesh = intersects[0].object,
          group = mesh.parent

        if (group.name.indexOf('Model') > -1) {
          const names = models.filter(name => `${name}Model` !== group.name)
          names.forEach(name => {
            const g = this.scene.getObjectByName(`${name}Model`)
            this.setModelColor(g, this.baseColor)
          })
          this.setModelColor(group, this.activeColor)
          let dom = null
          models.forEach(m => {
            if (group.name.indexOf(m) > -1) {
              if (m === 'left' || m === 'center') {
                dom = this.$refs[m]
                this[`visible${capitalize(m)}Tip`] = true
              }
              if (
                m === 'right' &&
                ['盒子1', '盒子2', '盒子3'].includes(mesh.name)
              ) {
                const index = Number(mesh.name.substr(2))
                this.activeRightData = this.rightData.brief[index - 1]
                dom = this.$refs[m]
                this[`visible${capitalize(m)}Tip`] = true
              }
            }
          })
          if (dom) {
            this.$sleep(30)
            this.setPopperPos(e, dom, {
              placement: 'top'
            })
            setStyles(dom, { opacity: 1 })
          }
          this.$el.style.cursor = 'pointer'
        } else {
          models.forEach(name => {
            const g = this.scene.getObjectByName(`${name}Model`)
            this.setModelColor(g, this.baseColor)
          })
          this.$el.style.cursor = 'default'
        }
        return
      }
      models.forEach(name => {
        const g = this.scene.getObjectByName(`${name}Model`)
        this.setModelColor(g, this.baseColor)
      })
      this.$el.style.cursor = 'default'
    },
    setModelColor(model, color) {
      model &&
        model.traverse(mesh => {
          if (mesh instanceof this.THREE.Mesh && mesh.name !== 'text') {
            mesh.material.color.set(color)
          }
        })
    },
    floorAnimation() {
      !this.floorTween && (this.floorTween = new this.TWEEN.Group())
      this.floorTween.removeAll()
      const duration = this.animationDuration,
        easing = this.tweenEasing.linear,
        min = 3,
        max = 12
      // let i = 0
      this.floor.traverse(mesh => {
        // i++
        // if (i !== 288) return
        if (mesh instanceof this.THREE.Mesh) {
          const { x, y, z } = mesh.position,
            offset =
              (Math.random() > 0.5 ? 1 : -1) * this.tu.randomInRange(min, max),
            origin = { x, y, z },
            upPos = { x, y: y + offset, z },
            downPos = { x, y: y - offset, z },
            // 参数 from 会实时变动，在onComplete的时值等于to
            move = (from, to) =>
              new this.TWEEN.Tween(from, this.floorTween)
                .to(to, duration)
                .easing(easing)
                .onUpdate(_pos => {
                  mesh.position.copy(_pos)
                }),
            up = move(mesh.position, upPos),
            down = move(mesh.position, downPos),
            recover = move(mesh.position, origin)
          up.delay(duration)
          up.chain(down)
          down.chain(recover)
          recover.chain(up)
          up.start()
        }
      })
      new this.TWEEN.Tween(this, this.floorTween).to({}, duration).start()
    },
    drawFloor() {
      const boxSize = 90,
        boxGeometry = new this.THREE.BoxBufferGeometry(
          boxSize,
          boxSize / 2,
          boxSize
        ),
        boxMaterial = new this.THREE.MeshLambertMaterial({
          color: this.floorColor
          // depthTest: false
        }),
        box = new this.THREE.Mesh(boxGeometry, boxMaterial),
        floorSize = this.rendererSize.width * 1.4,
        k = boxSize + 1,
        length = floorSize / k,
        part = 10,
        group = new this.THREE.Group()
      for (let i = 0; i < length; i++) {
        if (i < length / part || i > (length / part) * (part - 1)) continue
        for (let j = 0; j < length; j++) {
          if (j < length / part || j > (length / part) * (part - 1)) continue
          let _box

          if (Math.random() > 0.98) {
            const material = boxMaterial.clone()
            material.color.setHex(this.randomColor)
            _box = new this.THREE.Mesh(boxGeometry, material)
          } else {
            _box = box.clone()
          }
          _box.position.x = -floorSize / 2 + j * k - 120
          _box.position.y = 0
          _box.position.z = -floorSize / 2 + i * k + 160
          group.add(_box)
        }
      }
      group.position.set(0, -110, -250)
      // group.renderOrder = 10
      group.receiveShadow = true
      group.castShadow = true
      this.floor = group
      // this.spotLight.target = group
      this.scene.add(group)
      this.addGuiFolder('Floor', group)
    },
    drawFloor1() {
      const boxSize = 90,
        geometry = new this.THREE.BoxBufferGeometry(
          boxSize,
          boxSize / 2,
          boxSize
        ),
        floorSize = this.rendererSize.width * 1.4,
        k = boxSize + 1,
        length = floorSize / k,
        part = 10,
        randomColor = this.getColorArray(this.randomColor),
        floorColor = this.getColorArray(this.floorColor),
        colors = [],
        positions = []
      for (let i = 0; i < length; i++) {
        if (i < length / part || i > (length / part) * (part - 1)) continue
        for (let j = 0; j < length; j++) {
          if (j < length / part || j > (length / part) * (part - 1)) continue
          if (Math.random() > 0.98) {
            colors.push(...randomColor)
          } else {
            colors.push(...floorColor)
          }
          const x = -floorSize / 2 + j * k - 120,
            y = 0,
            z = -floorSize / 2 + i * k + 160
          positions.push(x, y, z)
        }
      }
      // geometry.addAttribute('position', new this.THREE.Float32BufferAttribute(positions, 3))
      // geometry.addAttribute('color', new this.THREE.Float32BufferAttribute(colors, 3))
      console.log(geometry, colors, positions)
    },
    getColorArray(color) {
      const { r, g, b } = new this.THREE.Color(color)
      return [r, g, b]
    },
    drawPipeParticle() {
      const texture = this.drawPipeParticleTexture(),
        material = new this.THREE.PointsMaterial({
          color: 0xffffff,
          size: 24, // 24
          transparent: true,
          blending: this.THREE.AdditiveBlending, // Blending is the stage of OpenGL rendering pipeline that takes the fragment color outputs from the Fragment Shader and combines them with the colors in the color buffers that these outputs map to.
          depthTest: false, // 深度测试关闭，不消去场景的不可见面
          map: texture
        }),
        geometry = new this.THREE.Geometry()
      geometry.vertices.push(new this.THREE.Vector3(0, 0, 0))
      const flowingParticle = new this.THREE.Points(geometry, material)
      // flowingParticle.position.set(-80, -30, 0)
      flowingParticle.name = 'particle'
      flowingParticle.renderOrder = 1000
      // this.scene.add(flowingParticle)
      // this.addGuiFolder('FlowingParticle', flowingParticle)
      this.flowingParticle = flowingParticle
      return flowingParticle
    },
    drawPipeParticleTexture() {
      const width = 16,
        height = 16,
        { canvas, context: ctx } = createCanvas(width, height),
        gradient = ctx.createRadialGradient(
          width / 2,
          height / 2,
          0,
          width / 2,
          height / 2,
          width / 2
        )
      gradient.addColorStop(0, this.getHexString(this.particleColor))
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      const texture = new this.THREE.Texture(canvas)
      texture.needsUpdate = true
      return texture
    },
    // 画管道
    drawPipeGroup() {
      const group = new this.THREE.Group(),
        curve = new this.THREE.CatmullRomCurve3(
          [
            // curve = new this.THREE.QuadraticBezierCurve3([
            new this.THREE.Vector3(-60, -20, -6),
            new this.THREE.Vector3(-54, 33.2, -6),
            // new this.THREE.Vector3(-4, 39.4, -6)
            new this.THREE.Vector3(0, 39.4, -6)
          ],
          false /* 是否闭合 */
        ),
        tubeGeometry = new this.THREE.TubeBufferGeometry(
          curve,
          100,
          2.4,
          50,
          false
        ),
        // tubeMaterial = new this.THREE.MeshLambertMaterial({
        tubeMaterial = new this.THREE.MeshPhongMaterial({
          color: this.baseColor,
          transparent: true,
          depthTest: false
        }),
        tube = new this.THREE.Mesh(tubeGeometry, tubeMaterial),
        flowingParticle = this.drawPipeParticle()
      flowingParticle.position.set(-60, -20, -6)
      group.add(tube)
      group.add(flowingParticle)
      group.rotation.y = Math.PI

      group.name = 'pipeGroup'
      this.pipeCurve = curve
      // this.pipeGroup = group
      return group
    },
    drawParticles() {
      const start = [-150, 40, 250],
        center = [-150, 40, 50],
        end = [-130, 40, -80],
        // scolor = 0x52F8FB,
        scolor = this.particleColor,
        // ecolor = 0x0066ff,
        ecolor = this.runningBoxColor,
        // tubeMaterial = new this.THREE.MeshPhongMaterial({
        //   color: this.baseColor,
        //   transparent: true,
        //   // depthTest: false,
        //   opacity: 1
        // }),
        group = new this.THREE.Group(),
        sphereGeometry = new this.THREE.SphereBufferGeometry(6),
        sphereMaterial = new this.THREE.MeshLambertMaterial({
          color: scolor,
          transparent: true
        }),
        // sphere = new this.THREE.Mesh(sphereGeometry, sphereMaterial),
        sx = [-20, 20],
        sy = [-20, 40],
        sz = [-50, 30],
        ez = [-60, 20],
        speed = 0.015

      Array.from({ length: 25 }, _ => {
        const srx = this.tu.randomInRange(...sx),
          sry = this.tu.randomInRange(...sy),
          srz = this.tu.randomInRange(...sz),
          erz = this.tu.randomInRange(...ez),
          scale = this.tu.randomInRange(0.1, 1.4),
          curve = new this.THREE.CatmullRomCurve3(
            [
              new this.THREE.Vector3(
                start[0] + srx,
                start[1] + sry,
                start[2] + srz
              ),
              new this.THREE.Vector3(
                center[0] + srx,
                center[1] + sry,
                center[2] + srz
              ),
              new this.THREE.Vector3(
                end[0] + srx,
                end[1] + sry,
                end[2] + srz + erz
              )
              // new this.THREE.Vector3(end[0] + 5, end[1] + sry, end[2] + srz + erz)
            ],
            false /* 是否闭合 */
          ),
          // tubeGeometry = new this.THREE.TubeBufferGeometry(curve, 100, 6, 50, false),
          // tube = new this.THREE.Mesh(tubeGeometry, tubeMaterial),
          // _sphere = sphere.clone(),
          _sphere = new this.THREE.Mesh(
            sphereGeometry.clone(),
            sphereMaterial.clone()
          )
        // group.add(tube)
        _sphere.scale.set(scale, scale, scale)

        const _sphere1 = new this.THREE.Mesh(
          sphereGeometry.clone(),
          sphereMaterial.clone()
        )
        this.flowings.push(
          {
            curve,
            speed,
            scolor,
            ecolor,
            mesh: _sphere,
            delta: 1,
            progress: 0
          },
          {
            curve,
            speed,
            scolor,
            ecolor,
            mesh: _sphere1,
            delta: 1,
            progress: 0.5
          }
        )
        group.add(_sphere)
        group.add(_sphere1)
      })
      group.visible = false
      this.particles = group
      this.scene.add(group)
      this.addGuiFolder('pipeGroup1', group)
    },
    drawRunningBox() {
      const size = 50,
        boxGeometry = new this.THREE.BoxBufferGeometry(size, size, size),
        boxMaterial = new this.THREE.MeshLambertMaterial({
          color: this.runningBoxColor
        }),
        runningBox = new this.THREE.Mesh(boxGeometry, boxMaterial),
        curve = new this.THREE.CatmullRomCurve3(
          [
            // new this.THREE.Vector3(-130, 40, -100),
            new this.THREE.Vector3(-125, 45, -140),
            new this.THREE.Vector3(240, 20, -215)
          ],
          false /* 是否闭合 */
        )
      this.flowings.push({
        curve,
        speed: 0.015,
        mesh: runningBox,
        delta: 1,
        progress: 0
      })
      // end 240, 15, -200
      runningBox.position.set(-15, 45, -210)
      // runningBox.position.set(180, 15, -200)
      runningBox.visible = false
      this.runningBox = runningBox
      this.scene.add(runningBox)
      this.addGuiFolder('RunningBox', runningBox)
    },
    async drawParticleBox() {
      const texture = await this.textureLoader('/t-sources/images/disc.png'),
        vertices = [],
        // rx = 40,
        // ry = 20,
        // rz = 20,
        rx = 30,
        ry = 30,
        rz = 30,
        per = 0.6,
        rxInner = rx * per,
        ryInner = ry * per,
        rzInner = rz * per
      Array.from({ length: 60 }, item => {
        const vertex = new this.THREE.Vector3()
        vertex.x = (Math.random() * 2 - 1) * rx
        vertex.y = (Math.random() * 2 - 1) * ry
        vertex.z = (Math.random() * 2 - 1) * rz

        if (
          Math.abs(vertex.x) > rxInner ||
          Math.abs(vertex.y) > ryInner ||
          Math.abs(vertex.z) > rzInner
        ) {
          vertices.push(vertex)
        }
      })

      texture.wrapS = this.THREE.RepeatWrapping
      texture.wrapT = this.THREE.RepeatWrapping

      const length = vertices.length,
        color = new this.THREE.Color(this.particleColor),
        colors = new Float32Array(length * 3),
        sizes = new Float32Array(length),
        positions = new Float32Array(length * 3),
        geometry = new this.THREE.BufferGeometry(),
        material = new this.THREE.ShaderMaterial({
          uniforms: {
            texture: {
              amplitude: { value: 1.0 },
              color: { value: new this.THREE.Color(0xffffff) },
              value: texture
            }
          },
          vertexShader,
          fragmentShader,
          blending: this.THREE.AdditiveBlending,
          // depthTest: false,
          transparent: true,
          vertexColors: true
        })
      vertices.forEach((vertex, i) => {
        vertex.toArray(positions, i * 3)
        color.toArray(colors, i * 3)
        sizes[i] = this.tu.randomInRange(10, 60)
      })
      geometry.addAttribute(
        'position',
        new this.THREE.BufferAttribute(positions, 3)
      )
      geometry.addAttribute('color', new this.THREE.BufferAttribute(colors, 3))
      geometry.addAttribute(
        'size',
        new this.THREE.BufferAttribute(sizes, 1).setDynamic(true)
      )
      const particles = new this.THREE.Points(geometry, material)
      particles.position.set(-150, 40, 250)
      this.particles = particles
      this.scene.add(particles)
      this.addGuiFolder('ParticlesBox', particles)
    },
    async drawText(content, options = {}) {
      this.tfont = this.tfont || (await this.fontLoader(this.fontUrl))
      const textMaterial = new this.THREE.MeshBasicMaterial({
        color: options.color || 0xbfbfbf,
        side: this.THREE.DoubleSide
        // transparent: true,
        // depthTest: false
      })
      const textGeometry = new this.THREE.TextGeometry(content, {
        font: this.tfont,
        size: options.size || 4,
        height: 1,
        curveSegments: 1
      })
      const text = new this.THREE.Mesh(textGeometry, textMaterial)
      // options.position && text.position.set(options.position)
      text.renderOrder = 2
      text.name = 'text'
      textGeometry.center()
      text.lookAt(this.camera.position)
      return text
    },
    drawPlane(canvas, width = 71.5, height = 38) {
      const texture = new this.THREE.Texture(canvas)
      texture.needsUpdate = true
      const planeGeometry = new this.THREE.PlaneBufferGeometry(
        width,
        height,
        1,
        1
      )
      // MeshLambertMaterial
      const planeMaterial = new this.THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: this.THREE.DoubleSide,
        blending: this.THREE.AdditiveBlending
      })
      const plane = new this.THREE.Mesh(planeGeometry, planeMaterial)
      plane.name = 'text'
      return plane
    },
    drawCenterPlaneInfo() {
      const width = 128,
        height = 64,
        { canvas, context: ctx } = createCanvas(width, height),
        { label, value } = this.centerData

      drawText(ctx, {
        color: this.labelColor,
        fontSize: 12,
        text: label,
        x: width / 2,
        y: 14
      })
      drawText(ctx, {
        fontSize: 16,
        text: value + '',
        x: width / 2,
        y: 34
      })

      // 添加到模型上
      const planeInfo = this.drawPlane(canvas)
      planeInfo.lookAt(this.camera.position)
      planeInfo.position.set(-146, 52, 30)
      this.centerModel.add(planeInfo)
      this.addGuiFolder('CenterPlaneInfo', planeInfo)
    },
    async drawCenterModel() {
      const filename = '/t-sources/models/center2',
        centerModel = await this.loadModel(filename),
        // position = [342, -60, -100]
        position = [-356, -60, -800]
      // console.log(centerModel)
      centerModel.position.set(...position)
      centerModel.endPosition = { x: 342, y: -60, z: -100 }
      centerModel.scale.set(this.modelScale, this.modelScale, this.modelScale)
      // centerModel.renderOrder = 1000
      centerModel.name = 'centerModel'
      centerModel.transparent = true
      // centerModel.castShadow = true
      // centerModel.receiveShadow = true
      // this.spotLight.target = centerModel

      this.centerModel = centerModel
      const pointLightLeft = new this.THREE.PointLight(0x0066ff)
      pointLightLeft.distance = 120
      pointLightLeft.intensity = 5
      pointLightLeft.position.set(-210, 40, -10)

      const pointLightRight = pointLightLeft.clone()
      pointLightRight.color.setHex(0x00ffaa)
      pointLightRight.position.set(-200, 40, -30)

      // this.pointLight = pointLightRight
      // this.addPointLightGui('CenterPointLightRight', pointLightRight)
      // const pointLightHelper = new this.THREE.PointLightHelper(pointLightRight, 6)
      // this.scene.add(pointLightHelper)
      centerModel.add(pointLightLeft)
      centerModel.add(pointLightRight)
      // const {label, value} = this.centerData
      // const labelMesh = await this.drawText(label)
      // labelMesh.position.set(-157, 56, 20)
      // centerModel.add(labelMesh)
      // this.addGuiFolder('CenterLabel', labelMesh)
      // const valueMesh = await this.drawText(value + '', {
      //   color: 0xffffff,
      //   size: 5
      // })
      // valueMesh.position.set(-155, 46, 22)
      // centerModel.add(valueMesh)
      // this.addGuiFolder('CenterValue', valueMesh)

      // this.rightSpotLight.target = centerModel
      this.setModelColor(centerModel, this.baseColor)
      this.drawCenterPlaneInfo()
      this.scene.add(centerModel)
      this.addGuiFolder('CenterModel', centerModel)
    },
    drawLeftPlaneInfo() {
      const width = 128,
        height = 64,
        { canvas, context: ctx } = createCanvas(width, height),
        { label, value, percent } = this.leftData

      drawText(ctx, {
        color: this.labelColor,
        fontSize: 12,
        text: label,
        x: width / 2,
        y: 14
      })
      drawText(ctx, {
        fontSize: 16,
        text: percent,
        x: width / 2,
        y: 34
      })
      // 画矩形
      const x = 10,
        y = 47,
        w = width - x * 2
      ctx.fillStyle = '#1F242E'
      ctx.fillRect(x, y, w, 10)
      ctx.fillStyle = this.getHexString(this.randomColor)
      ctx.fillRect(x, y, w * value, 10)

      // 添加到模型上
      const planeInfo = this.drawPlane(canvas)
      planeInfo.rotation.y = Math.PI / 2
      planeInfo.position.set(5, 38, -34)
      this.leftModel.add(planeInfo)
      // this.addGuiFolder('LeftPlaneInfo', planeInfo)
    },
    async drawLeftModel() {
      const filename = '/t-sources/models/left',
        leftModel = await this.loadModel(filename)
      // leftModel.rotation.y = -Math.PI / 2
      leftModel.scale.set(this.modelScale, this.modelScale, this.modelScale)
      // leftModel.position.set(-180, -60, 350)
      leftModel.position.set(-100, -60, 1200)
      leftModel.endPosition = { x: -100, y: -60, z: 400 }
      Array.from([0, 1]).forEach(item => {
        const pipeGroup = this.pipeGroup
          ? this.pipeGroup.clone()
          : this.drawPipeGroup()
        pipeGroup.rotation.y = Math.PI / 2
        pipeGroup.position.z = 4
        pipeGroup.position.x = -0.2
        if (item === 1) {
          pipeGroup.position.x = -24.8
          this.pipeGroup2 = pipeGroup
          this.addGuiFolder('PipeGroup2', pipeGroup)
        }
        leftModel.add(pipeGroup)
        this.flowings.push({
          mesh: pipeGroup.getObjectByName('particle'),
          curve: this.pipeCurve,
          progress: item === 1 ? 0 : 0.3,
          speed: 0.015,
          delta: 1,
          attached: 'leftModel'
        })
      })

      leftModel.name = 'leftModel'
      this.setModelColor(leftModel, this.baseColor)
      this.leftModel = leftModel
      // this.leftSpotLight.target = leftModel
      // const text = await this.drawText(this.leftData.label)
      // text.rotation.set(0, Math.PI / 2, 0)
      // text.position.set(5, 48, -30)
      // leftModel.add(text)
      // console.log(leftModel, text)
      // this.addGuiFolder('LeftText', text)

      this.drawLeftPlaneInfo()
      this.scene.add(leftModel)
      this.addGuiFolder('LeftModel', leftModel)
    },
    drawPlaneText(options) {
      const {
        canvasWidth = 64,
        canvasHeight = 64,
        planeWidth,
        planeHeight,
        fontSize = 12,
        label = ''
      } = options
      const { canvas, context: ctx } = createCanvas(canvasWidth, canvasHeight)

      drawText(ctx, {
        color: this.labelColor,
        fontSize: fontSize,
        text: label,
        x: canvasWidth / 2,
        y: 10
      })
      return this.drawPlane(canvas, planeWidth, planeHeight)
    },
    drawRightPlaneInfo() {
      const { label, brief = [] } = this.rightData
      const positions = [
        [117, 37, -199],
        [161, 37, -199],
        [161, 35, -140]
      ]
      brief.forEach((item, index) => {
        const plane = this.drawPlaneText({
          canvasWidth: 64,
          canvasHeight: 64,
          planeWidth: 32,
          planeHeight: 32,
          label: item.label
        })
        plane.position.set(...positions[index])
        // this.addGuiFolder(item.label, plane)
        this.rightModel.add(plane)
      })
      const modelPlaneText = this.drawPlaneText({
        canvasWidth: 128,
        canvasHeight: 64,
        label
      })
      modelPlaneText.rotation.y = Math.PI / 2
      modelPlaneText.position.set(178, 16, -210)
      this.rightModel.add(modelPlaneText)
      this.addGuiFolder('RightModelPlaneText', modelPlaneText)
    },
    async drawRightModel() {
      const filename = '/t-sources/models/right',
        rightModel = await this.loadModel(filename)

      // rightModel.rotation.y = -Math.PI / 2
      rightModel.scale.set(this.modelScale, this.modelScale, this.modelScale)
      // rightModel.position.set(-30, -60, 340)
      rightModel.position.set(800, -60, 340)
      rightModel.endPosition = { x: -30, y: -60, z: 340 }
      Array.from([0, 1]).forEach(item => {
        const pipeGroup = this.pipeGroup
          ? this.pipeGroup.clone()
          : this.drawPipeGroup()
        pipeGroup.position.set(178.5, -12, -156)
        pipeGroup.rotation.y = Math.PI
        if (item === 1) {
          pipeGroup.position.z = -178.5
          // this.pipeGroup = pipeGroup
          // this.addGuiFolder('PipeGroup', pipeGroup)
        }
        rightModel.add(pipeGroup)
        this.flowings.push({
          mesh: pipeGroup.getObjectByName('particle'),
          curve: this.pipeCurve,
          progress: item === 1 ? 1 : 0.7,
          speed: 0.03,
          delta: -1,
          attached: 'rightModel'
        })
      })

      const pointLight = new this.THREE.PointLight(0x00ffff)
      pointLight.distance = 60
      pointLight.intensity = 3
      pointLight.position.set(96, 50, -220)
      rightModel.add(pointLight)

      // this.addPointLightGui('rightPointLight', pointLight)
      // const pointLightHelper = new this.THREE.PointLightHelper(pointLight, 6)
      // this.scene.add(pointLightHelper)

      this.setModelColor(rightModel, this.baseColor)
      rightModel.name = 'rightModel'
      this.rightModel = rightModel

      this.drawRightPlaneInfo()
      this.scene.add(rightModel)
      this.addGuiFolder('RightModel', rightModel)
    },
    centerModelLineAnimate() {
      const mesh = this.centerModel.getObjectByName('主体中间'),
        geometry = mesh.geometry.clone(),
        wireframe = new FlyLine(geometry, {
          color: 0x0099ff,
          segFlag: true,
          alphaTest: false,
          dir: 'y'
        })
      wireframe.scale.set(this.modelScale, this.modelScale, this.modelScale)
      // wireframe.position.set(this.centerModel.position)
      wireframe.position.set(342, -60, -100)
      this.wireframe = wireframe
      this.scene.add(wireframe)
      // const mesh1 = this.centerModel.getObjectByName('主体下')
      // mesh1.rotation.y = -0.28
    },
    modelEnter(modelName, callback) {
      const model = this[modelName]
      if (!model) return
      // console.log(model, model.position, 'model')
      !this[`${modelName}Tween`] &&
        (this[`${modelName}Tween`] = new this.TWEEN.Group())
      const group = this[`${modelName}Tween`]

      group && group.removeAll()

      this[`${modelName}In`] = !!model

      new this.TWEEN.Tween(model.position, group)
        .to(model.endPosition, this.animationDuration)
        .easing(this.animationEasing)
        .start()
      new this.TWEEN.Tween(this, group)
        .to({}, this.animationDuration)
        .onComplete(async _ => {
          await this.$sleep(10)
          this[`${modelName}Entered`] = true
          callback && callback()
        })
        .start()
    },
    flowingsAnimate() {
      if (
        !this.leftModelEntered ||
        !this.centerModelEntered ||
        !this.rightModelEntered
      ) {
        return
      }
      this.particles.visible = true
      this.runningBox.visible = true
      this.flowings.forEach(item => {
        item.delta === 1
          ? item.progress > 1.0 && (item.progress = 0)
          : item.progress <= 0 && (item.progress = 1)
        item.progress += item.speed * item.delta
        // 解决小于item.progress小于0时，获取point报错
        item.progress < 0 && (item.progress = 0)

        const point = item.curve.getPoint(item.progress)

        if (item.scolor && item.ecolor) {
          // const color = item.progress > 0.6 ? item.ecolor : item.scolor,
          const color = point.z < 100 ? item.ecolor : item.scolor,
            matColor = item.mesh.material.color
          color !== matColor.getHex() && matColor.setHex(color)
        }
        point && point.x && item.mesh.position.set(point.x, point.y, point.z)
      })
    },
    async drawLeftModelHasPipe() {
      const filename = '/t-sources/models/left-pipe',
        leftModel = await this.loadModel(filename)
      leftModel.rotation.y = -Math.PI / 2
      leftModel.scale.set(this.modelScale, this.modelScale, this.modelScale)
      // leftModel.position.set(-180, -60, 350)
      leftModel.position.set(-45, -60, 400)
      this.scene.add(leftModel)
      leftModel.traverse(mesh => {
        if (
          mesh instanceof this.THREE.Mesh &&
          ['管道.1', '管道.2', '管道.3', '管道.4'].includes(mesh.name)
        ) {
          const flowingParticle = this.flowingParticle
            ? this.flowingParticle.clone()
            : this.drawPipeParticle()
          const positions = mesh.geometry.attributes.position.array
          const [x, y, z] = positions.slice(positions.length - 3)

          flowingParticle.position.set(x - 4, y, z)
          leftModel.add(flowingParticle)
          let _pos = []
          for (let i = 0; i < positions.length; i += 3) {
            _pos.push(positions.slice(i, i + 3))
          }
          const length = _pos.length
          this.flowings.push({
            positions: _pos.reverse(),
            mesh: flowingParticle,
            length: length,
            cur: 0,
            speed: Math.floor(length / 100)
          })
        }
      })
      this.leftModel = leftModel
      this.addGuiFolder('LeftModel', leftModel)
    },
    flowingParticleAnimateHasPipe() {
      this.flowings.forEach(item => {
        item.cur += item.speed
        item.cur > item.length && (item.cur = 0)
        // console.log(item.positions[item.cur])
        item.mesh.position.set(...item.positions[item.cur])
      })
    },
    addDirLight() {
      const dirLight = new this.THREE.DirectionalLight(0xffffff, 1.5)
      dirLight.position.set(350, 600, 500)
      dirLight.castShadow = true
      // spotLight.shadow.camera.near = 0
      // spotLight.shadow.camera.far = 3000
      dirLight.shadow.camera.left = -1000
      dirLight.shadow.camera.right = 1000
      dirLight.shadow.camera.top = 1000
      dirLight.shadow.camera.bottom = -1000
      dirLight.shadow.mapSize.width = dirLight.shadow.mapSize.height = 2048
      this.dirLight = dirLight
      this.scene.add(dirLight)
      // const ambient = new this.THREE.AmbientLight(0xffffff, 0.3)
      // ambient.castShadow = true
      // this.scene.add(ambient)
    },
    addSpotLight() {
      const spotLight = new this.THREE.SpotLight(0xffffff, 1)
      // const spotLight = new this.THREE.SpotLight(0x00aaff, 1)
      // spotLight.intensity = 1
      spotLight.angle = 0.65
      spotLight.penumbra = 1.0
      spotLight.decay = 2
      spotLight.castShadow = true
      spotLight.shadow.camera.near = 0
      spotLight.shadow.camera.far = 1000
      spotLight.shadow.camera.left = -1000
      spotLight.shadow.camera.right = 1000
      spotLight.shadow.camera.top = 1000
      spotLight.shadow.camera.bottom = -1000
      spotLight.shadow.mapSize.width = spotLight.shadow.mapSize.height = 2048
      this.spotLight = spotLight

      // spotLight.position.set(880, 600, 720)
      // spotLight.position.set(860, 600, 740)
      spotLight.position.set(800, 800, 800)
      this.scene.add(spotLight)
      this.addSpotLightGui('SpotLight', spotLight)
      if (process.env.NODE_ENV === 'development') {
        // const spotLightHelper = new this.THREE.SpotLightHelper(this.spotLight)
        // this.scene.add(spotLightHelper)
      }
    },
    addSpotLightGui(name, spotLight) {
      if (!this.gui) return
      const folder = this.gui.addFolder(name)
      const controls = {
        positionx: spotLight.position.x,
        positiony: spotLight.position.y,
        positionz: spotLight.position.z,
        visible: spotLight.visible,
        color: 0xffffff,
        rotationx: spotLight.rotation.x || 0.01,
        rotationy: spotLight.rotation.y || 0.01,
        rotationz: spotLight.rotation.z || 0.01,
        intensity: spotLight.intensity,
        distance: spotLight.distance,
        angle: spotLight.angle,
        penumbra: spotLight.penumbra,
        decay: spotLight.decay
      }
      const self = this
      folder.add(controls, 'visible', 1, 2).onChange(e => {
        spotLight.visible = e
      })
      folder.add(controls, 'positionx', -3000, 3000).onChange(e => {
        spotLight.position.x = e
      })
      folder.add(controls, 'positiony', -3000, 3000).onChange(e => {
        spotLight.position.y = e
      })
      folder.add(controls, 'positionz', -3000, 3000).onChange(e => {
        spotLight.position.z = e
      })

      folder.add(controls, 'rotationx', -2, 2).onChange(e => {
        spotLight.rotation.x = e
      })
      folder.add(controls, 'rotationy', -2, 2).onChange(e => {
        spotLight.rotation.y = e
      })
      folder.add(controls, 'rotationz', -2, 2).onChange(e => {
        spotLight.rotation.z = e
      })

      folder.add(controls, 'intensity', 0, 2).onChange(e => {
        spotLight.intensity = e
      })
      folder.add(controls, 'distance', 0, 300.0).onChange(e => {
        spotLight.distance = e
      })
      folder.add(controls, 'angle', 0, 1).onChange(e => {
        spotLight.angle = e
      })
      folder.add(controls, 'penumbra', 0, 1).onChange(e => {
        spotLight.penumbra = e
      })
      folder.add(controls, 'decay', 1, 2).onChange(e => {
        spotLight.decay = e
      })
      folder.addColor(controls, 'color').onChange(e => {
        console.log(e, new self.THREE.Color(e.r, e.g, e.b))
        spotLight.color = new self.THREE.Color(e.r, e.g, e.b)
      })
    },
    addPointLightGui(name, pointLight) {
      const self = this
      // const pointLight = this.pointLight
      const folder = this.gui.addFolder(name)
      const controls = {
        positionx: pointLight.position.x,
        positiony: pointLight.position.y,
        positionz: pointLight.position.z,

        rotationx: pointLight.rotation.x || 0.01,
        rotationy: pointLight.rotation.y || 0.01,
        rotationz: pointLight.rotation.z || 0.01,

        intensity: pointLight.intensity,
        distance: pointLight.distance,
        pointColor: 0x0066ff,
        visible: pointLight.visible
      }
      folder.add(controls, 'visible').onChange(e => {
        pointLight.visible = e
      })
      folder.add(controls, 'positionx', -3000, 3000).onChange(e => {
        pointLight.position.x = e
        // sphereLight.position.copy(pointLight.position)
      })
      folder.add(controls, 'positiony', -3000, 3000).onChange(e => {
        pointLight.position.y = e
        // sphereLight.position.copy(pointLight.position)
      })
      folder.add(controls, 'positionz', -3000, 3000).onChange(e => {
        pointLight.position.z = e
        // sphereLight.position.copy(pointLight.position)
      })

      folder.add(controls, 'rotationx', -2, 2).onChange(e => {
        pointLight.rotation.x = e
        // sphereLight.rotation.copy(pointLight.rotation)
      })
      folder.add(controls, 'rotationy', -2, 2).onChange(e => {
        pointLight.rotation.y = e
        // sphereLight.rotation.copy(pointLight.rotation)
      })
      folder.add(controls, 'rotationz', -2, 2).onChange(e => {
        pointLight.rotation.z = e
        // sphereLight.rotation.copy(pointLight.rotation)
      })

      folder.add(controls, 'intensity', 0, 10).onChange(e => {
        pointLight.intensity = e
      })
      folder.add(controls, 'distance', 1, 300).onChange(e => {
        pointLight.distance = e
      })
      folder.addColor(controls, 'pointColor').onChange(e => {
        pointLight.color = new self.THREE.Color(e)
      })
    }
  }
}
