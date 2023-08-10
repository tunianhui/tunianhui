export function decodePolygon(coordinate, encodeOffsets, encodeScale) {
  const result = []
  let [prevX, prevY] = encodeOffsets
  for (let i = 0; i < coordinate.length; i += 2) {
    let x = coordinate.charCodeAt(i) - 64,
      y = coordinate.charCodeAt(i + 1) - 64
    // ZigZag decoding
    x = (x >> 1) ^ -(x & 1)
    y = (y >> 1) ^ -(y & 1)
    // Delta decoding
    x += prevX
    y += prevY

    prevX = x
    prevY = y
    // Dequantize
    result.push([x / encodeScale, y / encodeScale])
  }
  return result
}

// 地图json解码
export function decode(json) {
  if (!json.UTF8Encoding) return json
  let encodeScale = json.UTF8Scale
  if (!encodeScale) {
    encodeScale = 1024
  }
  json.features.forEach(feature => {
    const geometry = feature.geometry,
      { coordinates, encodeOffsets } = geometry
    coordinates.forEach((coordinate, c) => {
      if (geometry.type === 'Polygon') {
        coordinates[c] = decodePolygon(
          coordinate,
          encodeOffsets[c],
          encodeScale
        )
      } else if (geometry.type === 'MultiPolygon') {
        coordinate.forEach((polygon, c2) => {
          coordinate[c2] = decodePolygon(
            polygon,
            encodeOffsets[c][c2],
            encodeScale
          )
        })
      }
    })
  })
  // has been decoded
  json.UTF8Encoding = false
  return json
}

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

const class2type = {
  '[object Boolean]': 'boolean',
  '[object Number]': 'number',
  '[object String]': 'string',
  '[object Function]': 'function',
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object RegExp]': 'regexp',
  '[object Object]': 'object',
  '[object Error]': 'error',
  '[object Symbol]': 'symbol'
}

export function getType(data) {
  if (data === null) return data + ''
  return typeof object === 'object' || typeof object === 'function'
    ? Object.prototype.toString.call(class2type[data]) || 'object'
    : typeof data
}
