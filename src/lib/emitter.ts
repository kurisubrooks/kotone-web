import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter()

export type Event = 'play' | 'pause' | 'seek'

const emitter = {
  on: (event: Event, fn: (event: Event) => void) => eventEmitter.on(event, fn),
  onp: (event: Event, fn: (payload: any) => void) => eventEmitter.on(event, fn),
  once: (event: Event, fn: (event: Event) => void) =>
    eventEmitter.once(event, fn),
  oncep: (event: Event, fn: (payload: any) => void) =>
    eventEmitter.once(event, fn),
  off: (event: Event, fn: (payload: any) => void) =>
    eventEmitter.off(event, fn),
  emit: (event: Event) => eventEmitter.emit(event, event),
  emitp: (event: Event, payload: any) => eventEmitter.emit(event, payload),
}
Object.freeze(emitter)

export default emitter
