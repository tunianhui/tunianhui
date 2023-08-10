## Map

### Example

```js
this.loading++
this.map3d = new Map3D(el, mapJson, {})
this.map3d.on('ready', _ => {
  this.loading--
})
```

### Options

- `depth: -15` 地图的厚度
- `layers: 15` 地图边界线的数量
- `background: '#000000'` canvas 背景颜色
- `opacity: 0` 背景透明度
- `font: '/t-sources/fonts/FZNewShuSong-Z10S__filterd.json'` 字体，传入字体的路径
- `rotate: Math.PI / 4` 地图旋转的角度
- `offset: [0, 0]` 地图的偏移值
- `roam: true` 控制地图的缩放与旋转
- `autoReisze: true` 窗口大小变化时，改变地图尺寸
- `light:` 地图的光照
  - `color: '#ffffff'` 光照颜色
  - `intensity: 0.5` 光照强度
- `selected: []` 默认选中的区域，**暂未实现**
- `regions: {[areaName]: {}}`
  - `center: [coordx, coordy]` 文字显示位置，经纬度
  - `selected: false` **暂未实现**
  - `areaStyle: {}` 参看下面的 areaStyle
  - `borderStyle: {}` 参看下面的 borderStyle
  - `textStyle: {}` 参看下面的 textStyle
- `tooltip: {}` 提示框 **暂未实现**
  - `triggle: [hover|click]` 显示时机
  - `el: dom`
- `stopDefaultMousemove: false` 默认开启鼠标 mousemove 事件，高亮选中的区域
- `stopDefaultClick: true` 默认不开启鼠标点击事件
- `areaStyle: {}` 默认区域样式配置
  - `normal: {}`
    - `show: true`
    - `color: '#006de0'`
    - `opacity: 1`
    - `texture: ''`, **暂未实现**
    - `depth` **暂未实现**
  - `emphasis: {}` 选中
    - `show: true`
    - `color: '#ffff00'`
    - `opacity: 1`
    - `texture: ''`
    - `depth`
- `borderStyle: {}` 默认边界线样式配置
  - `normal: {}`
    - `show: true`
    - `color: '#999999'`
    - `opacity: 1`
  - `emphasis: {}`
    - `show: true`
    - `color: '#66ffff'`
    - `opacity: 1`
- `textStyle: {}` 默认字体样式配置
  - `normal: {}`
    - `show: true`,
    - `fontSize: 12,`
    - `color: '#cccccc'`
    - `opacity: 1`
    - `texture: ''` **暂未实现**
    - `rotation: {x: 0, y: Math.PI / 2, z: Math.PI / 2}`
    - `height: 2`
    - `bevelThickness: 1` 查看 threejs TextBufferGeometry 配置
    - `bevelSize: 1` 查看 threejs TextBufferGeometry 配置
    - `bevelSegments: 1` 查看 threejs TextBufferGeometry 配置
    - `curveSegments: 10` 查看 threejs TextBufferGeometry 配置
    - `steps: 1` 查看 threejs TextBufferGeometry 配置
  - `emphasis: {}`
    - `show: true`
    - `fontSize: 12,`
    - `color: '#66ffff'`
    - `opacity: 1`
    - `texture: ''` **暂未实现**
    - `rotation: {x: 0, y: Math.PI / 4, z: Math.PI / 2}`
    - `height: 2`
    - `bevelThickness: 1`
    - `bevelSize: 1`
    - `bevelSegments: 1`
    - `curveSegments: 10`
    - `steps: 1`
- `scatters: {}` 参看 Scatter Options
- `flylines: {}` 参看 Flylines Options
- `nameMap: {北京市: '北京', '内蒙古自治区': '内蒙古'}` 修改地图显示在区域上的文字

## Scatter

### Example

```js
```

### Options
