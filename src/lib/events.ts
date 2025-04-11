import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter()

export type Event = 'play' | 'pause'

const emitter = {
  on: (event: Event, fn: (event: Event) => void) => eventEmitter.on(event, fn),
  once: (event: Event, fn: (event: Event) => void) =>
    eventEmitter.once(event, fn),
  off: (event: Event, fn: (event: Event) => void) =>
    eventEmitter.off(event, fn),
  emit: (event: Event) => eventEmitter.emit(event, event),
}
Object.freeze(emitter)

export default emitter
