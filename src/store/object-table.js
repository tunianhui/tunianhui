import storage from '@/libs/storage'

export default function (module) {
  return {
    namespaced: true,
    state() {
      return {
        active: storage.get(`${module}ObjectTableType`) || ''
      }
    },
    getters: {
      active(state, getters) {
        return state.active
      }
    },
    mutations: {
      SET_ACTIVE(state, payload) {
        state.active = payload
        storage.set(`${module}ObjectTableType`, payload)
      }
    }
  }
}
