function promisify (fn, context = null) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn.apply(context, [
        ...args,
        // onLoad callback
        data => resolve(data, context),
        // onProgress callback
        xhr => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        // onError callback
        err => reject(err)
      ])
    })
  }
}

function loaderPromisify (loader) {
  return promisify(loader.load, loader)
}

// function getIntersects (e, scene, camera) {
//   const width = e.target.width
//   const height = e.target.height
//   const vector = new THREE.Vector2(
//     (e.clientX / width) * 2 - 1,
//     -(e.clientY / height) * 2 + 1
//   )
//   const raycaster = new THREE.Raycaster()
//   raycaster.setFromCamera(vector, camera)

//   return raycaster.intersectObjects(scene.children, true)
// }

function getMiddleValue (max, min, value) {
  return value > max ? max : value < min ? min : value
}

const tu = {
  promisify,
  // getIntersects,
  loaderPromisify,
  getMiddleValue
}

export default tu
