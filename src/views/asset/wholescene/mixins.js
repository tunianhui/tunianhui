/*
 * @Author: 大炸鹅
 * @Date: 2023-06-07 15:48:11
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-20 11:10:20
 * @FilePath: \dataphin\src\views\asset\wholescene\mixins.js
 */
// import {setStyles} from '@/libs/dom'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import setPopperPos from '@/libs/popper-pos'

export default {
  data() {
    return {
      modelScale: 2.5,
      threeLoading: false,
      dataLoading: false,
      fontUrl: '/t-sources/fonts/MicrosoftYaHei_Regular.json'
    }
  },
  methods: {
    setPopperPos,
    // 加载模型
    async loadModel(filename) {
      const material = await this.mtlLoader(`${filename}.mtl`)
      material.side = this.THREE.DoubleSide
      material.preload()
      // material.depthTest = false
      const objLoader = new OBJLoader()
      const objLoaderLoadFn = this.tu.promisify(objLoader.load, objLoader)
      objLoader.setMaterials(material)

      const modelMesh = await objLoaderLoadFn(`${filename}.obj`)
      // console.timeEnd(filename)
      return modelMesh
    }
  }
}
