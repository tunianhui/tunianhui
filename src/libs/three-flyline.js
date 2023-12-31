import * as THREE from 'three'
class FlyLine extends THREE.Object3D {
  /**
   * curveOrObject 路径 THREE.Curve实例或者bufferGeo/geo实例
   *
   * color 颜色
   * segFlag 设置分段标记 （周期）
   * alphaTest 启用透明测试
   * radius 半径只有首参数为curve可用
   */
  constructor(curveOrObject, options) {
    super()

    const color = (options && options.color) || 0xffffff
    const segFlag = (options && options.segFlag) || false
    const alphaTest = (options && options.alphaTest) || true
    const radius = (options && options.radius) || 1
    const dir = (options && options.dir) || 'x'

    this.mesh = null
    const v_shader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_Position = projectionMatrix * mvPosition;
    }`

    const define = segFlag ? '#define SEGFLAG' : ''
    const alpha = alphaTest ? '#define ALPHATEST' : ''
    const f_shader = `
    ${define}
    ${alpha}
    #define PI 3.141592
    uniform float time;
    varying vec2 vUv;
    uniform vec3 color;
    void main() {
      float alpha;
      if (vUv.${dir} > PI * 0.5 ){
        alpha = 0.0;
      } else {
        #ifdef SEGFLAG
        alpha = sin(3.0 *(vUv.${dir} * 14.0 + time - PI * 0.5));
        #else
        alpha = sin(1.0 * (vUv.${dir} + time - PI * 0.5));
        #endif
      }
      gl_FragColor = vec4(color, alpha);
      #ifdef ALPHATEST
      if(gl_FragColor.a < 0.3){
        discard;
      }
      #endif
    }`
    // if (vUv.x > PI * 0.5 ){
    //   alpha = 0.0;
    // } else {
    //   #ifdef SEGFLAG
    //   alpha = sin(3.0 *(vUv.x * 30.0 + time - PI * 0.5));
    //   #else
    //   alpha = sin(1.0 * (vUv.x + time - PI * 0.5));
    //   #endif
    // }
    let geo

    if (curveOrObject instanceof THREE.Curve) {
      geo = new THREE.TubeBufferGeometry(curveOrObject, 10, 0.15 * radius, 4)
    } else if (
      curveOrObject instanceof THREE.Geometry ||
      curveOrObject instanceof THREE.BufferGeometry
    ) {
      geo = curveOrObject
    } else {
      throw new Error('please ensure first argument correct')
    }
    const shaderMat = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0.0
        },
        color: {
          type: 'v3',
          value: new THREE.Color(color)
        }
      },
      vertexShader: v_shader,
      fragmentShader: f_shader,
      transparent: true,
      blending: THREE.AdditiveBlending
    })
    this.mesh = new THREE.Mesh(geo, shaderMat)
    this.add(this.mesh)
  }
  get time() {
    return this.mesh.material.uniforms.time.value
  }
  set time(time) {
    this.mesh.material.uniforms.time.value = time
  }
  update() {
    // const time = this.time + 0.01
    this.time -= 0.02
  }
  dispose() {
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
    this.remove(this.mesh)
  }
}

export default FlyLine
