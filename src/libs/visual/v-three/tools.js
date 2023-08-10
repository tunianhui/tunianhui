/**
 * threejs loader promise化
 * const objLoader = new THREE.OBJLoader()
 * const objLoaderLoadFn = tu.promisify(objLoader.load, objLoader)
 * objLoaderLoadFn('./path/obj.obj').then(obj => todo)
 */
export function promisify(fn, context = null) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn.apply(context, [
        ...args,
        // onLoad callback
        data => resolve(data, context),
        // onProgress callback
        xhr => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded', xhr)
        },
        // onError callback
        err => reject(err)
      ])
    })
  }
}

/** threejs loader promise化， 简写
 *  const fontLoader = loaderPromisify(new THREE.FontLoader())
 *  fontLoader('./fonts/MicrosoftYaHei_Regular.json').then(font => todo)
 **/
export function loaderPromisify(loader) {
  return promisify(loader.load, loader)
}

// 获取中间值
export function getMiddleValue(max, min, value) {
  return value > max ? max : value < min ? min : value
}

// 随机生成在一个区间内的值
export function randomInRange(min, max) {
  return Math.random() * (max - min) + min
}
