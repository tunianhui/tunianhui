<template>
  <div class="d3-map">
    <div class="map" ref="map"></div>
  </div>
</template>

<script>
import Map from './components/index.js'
// import * as _ from 'lodash'
export default {
  name: 'D3Map',
  props: {
    mapData: {
      type: Array,
      default: []
    },
    mapType: {
      type: String,
      default: 'guangdong'
    }
  },
  data() {
    return {
      materialList: [
        { label: '蓝色气流', value: 'airflow' },
        { label: '星空', value: 'starry-sky' }
      ],
      curMaterial: 'airflow',
      // curMap: 'guangdong',
      areaList: [],
      map: null
    }
  },
  watch: {
    mapData(val) {
      this.initMap(this.mapType)
    },
    mapType(val) {
      this.initMap(this.mapType)
    }
  },
  created() {
    this.mapOption = {
      // material: `static/material/${this.curMaterial}.jpg`,
      Shape: {},
      Text: {},
      Bar: {},
      Line: {},
      Point: {},
      Icon: {},
      select(areaname) {
        this.map.setPoints([areaname])
      }
    }
  },
  // mounted() {
  //   this.initMap(this.curMap)
  // },
  methods: {
    initMap(name) {
      this.map && this.map.destroyed()
      this.areaList = []
      const json = require(`static/maps/${name}.json`)
      // this.$d3.json(`static/maps/${name}.json`).then(json => {
      this.map = new Map(this.$refs.map, json, {
        ...this.mapOption,
        map: name
      })
      json.features.map(item => {
        this.areaList.push(item.properties.name)
      })
      this.setPoints()
      // })
    },
    setPoints() {
      // const arr = _.sampleSize(
      //   this.areaList,
      //   _.random(1, this.areaList.length - 1)
      // )
      // this.map.setPoints(arr)
      this.map.setPoints(this.mapData)
    }
  }
}
</script>
<style lang="less" src="./components/style.less"></style>
<style lang='less' scoped>
.d3-map {
  height: 100%;
  width: 100%;
  .map {
    height: 100%;
    overflow: hidden;
  }
}
</style>