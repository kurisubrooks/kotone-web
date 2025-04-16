import { create } from 'zustand'
import emitter from '../lib/emitter'

interface PlayerStore {
  isPlaying: boolean
  isBuffering: boolean
  duration: number

  setIsPlaying: (state: boolean) => void
  setIsBuffering: (state: boolean) => void
  setDuration: (value: number) => void

  play: () => void
  pause: () => void
  playpause: () => void
}

const usePlayer = create<PlayerStore>()((set, get) => ({
  isPlaying: false,
  isBuffering: false,
  duration: 0,

  setIsPlaying: (state) => set(() => ({ isPlaying: state })),
  setIsBuffering: (state) => set(() => ({ isBuffering: state })),
  setDuration: (value) => set(() => ({ duration: value })),

  play: () => {
    emitter.emit('play')
  },
  pause: () => {
    emitter.emit('pause')
  },
  playpause: () => {
    if (get().isPlaying) emitter.emit('pause')
    else emitter.emit('play')
  },
}))

export default usePlayer
