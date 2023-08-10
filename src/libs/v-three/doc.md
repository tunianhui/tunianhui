## threejs

### 优化

- 多实用 copy，或 clone
- 循环创建多个 Mesh 时，可以先创建一个 Mesh，循环中 clone，使用时通过 scale 改变 Mesh 大小
- 跳帧
- 纹理图片尺寸一定得是 2 的幂次方，并尽可能的小
- 模型的面越少越好，模型过于细致会增加渲染开销 three 场景导入模型时，可以在保证最低清晰度的时候，降低模型的复杂度，面越多，模型越大，加载所需开销就越大
- 多实用 BufferGeometry
- 多个相同类型的 Mesh 考虑使用组（THREE.Group）
- 预加载，正在加载时，最好有提示
- 清除 Group 时，需要将 Group 中的 mesh 都删掉

```js
group.traverse(item => {
  if (item instanceof THREE.Mesh) {
    item.geometry.dispose()
    item.material.dispose()
  }
})
scene.remove(group)
```

### 问题

- 创建 WebGLRenderer 时不要先定义变量，在挂载到 this 上，这样会导致渲染问题
- camera.lookAt() 与 camera.position.set() 上下顺序会导致渲染结果的不同，
  - 推荐先写 camera.position.set()，再写 camera.lookAt(scene.postion)
- **作图之前一定要提前确定好 camera 的位置** [关于 camera 位置属性设置详解](https://www.cnblogs.com/v-weiwang/p/6072235.html)
- Material 的 depthTest 使用时需要设置 transparent 为 true
- Material 中 color 为 THREE.VertexColors 时，需要设置 Geometry 的 color

## gui 使用总结

gui 设置的数据显示小数点，初始值保留 n 小数，显示的值则保留 n 位小数，初始值没有小数，显示值则不会保留小数

## tween 使用总结

tween chain 使用时注意开始属性，会变成 to 中设置的属性，所以如果用 chain 时，开始属性直接使用物体的属性，to 属性使用自定义的值。示例：

```js
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
      const {x, y, z} = mesh.position,
        offset = (Math.random() > 0.5 ? 1 : -1) * this.tu.randomInRange(min, max),
        origin = { x, y, z },
        upPos = { x, y: y + offset, z },
        downPos = { x, y: y - offset, z },
        // 参数 from 会实时变动，在onComplete的时值等于to
        move = (from, to) => new this.TWEEN.Tween(from, this.floorTween)
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
  new this.TWEEN.Tween(this, this.floorTween)
    .to({}, duration)
    .start()
}
```

`repeat(Infinity).yoyo(true)` 来回重复运动
