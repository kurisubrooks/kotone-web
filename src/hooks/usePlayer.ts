import { create } from 'zustand'
import emitter from '../lib/emitter'

interface PlayerStore {
  isPlaying: boolean
  isBuffering: boolean
  progress: number
  duration: number

  setIsPlaying: (state: boolean) => void
  setIsBuffering: (state: boolean) => void
  setProgress: (value: number) => void
  setDuration: (value: number) => void

  play: () => void
  pause: () => void
  playpause: () => void
}

const usePlayer = create<PlayerStore>()((set, get) => ({
  isPlaying: false,
  isBuffering: false,
  progress: 0,
  duration: 0,

  setIsPlaying: (state) => set(() => ({ isPlaying: state })),
  setIsBuffering: (state) => set(() => ({ isBuffering: state })),
  setProgress: (value) => set(() => ({ progress: value })),
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
