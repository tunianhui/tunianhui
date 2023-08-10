const EVENTS = ['click', 'dblclick', 'mouseout', 'mouseover']

export const getType = data => Object.prototype.toString.call(data)

export function eventBinder(options, selector, selfEvent) {
  EVENTS.forEach(item => {
    const evt = options[item]
    if (evt && getType(evt) === '[object Function]') {
      selector.on(item, function (...d) {
        selfEvent[item] && selfEvent[item].call(this, ...d)
        evt.call(this, ...d)
      })
    }
  })
}
