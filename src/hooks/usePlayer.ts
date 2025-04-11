import { create } from 'zustand'
import emitter from '../lib/events'

interface PlayerStore {
  autoplay: boolean
  isPlaying: boolean
  isBuffering: boolean
  progress: number

  setAutoplay: (state: boolean) => void
  setIsPlaying: (state: boolean) => void
  setIsBuffering: (state: boolean) => void
  setProgress: (value: number) => void

  play: () => void
  pause: () => void
  playpause: () => void
}

const usePlayer = create<PlayerStore>()((set, get) => ({
  autoplay: false,
  isPlaying: false,
  isBuffering: false,
  progress: 0,

  setAutoplay: (state) => set(() => ({ autoplay: state })),
  setIsPlaying: (state) => set(() => ({ isPlaying: state })),
  setIsBuffering: (state) => set(() => ({ isBuffering: state })),
  setProgress: (value) => set(() => ({ progress: value })),

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
