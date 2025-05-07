import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Item from 'jellyfin-api/lib/types/media/Item'
import { Track } from '../types/ItemTypes'
import itemToType from '../lib/itemToType'
import storage from '../lib/storage'
import usePlayer from './usePlayer'
import useProgress from './useProgress'
import emitter from '../lib/emitter'

interface QueueStore {
  track: number
  trackID?: string
  queue: Track[]
  repeat: 'off' | 'track' | 'queue'

  setTrack: (index: number, stealth?: boolean) => void
  prevTrack: () => void
  nextTrack: () => void
  setRepeat: (mode: 'off' | 'track' | 'queue') => void
  cycleRepeat: () => void

  setQueue: (items: Item[] | Track[], index?: number) => void
  moveQueue: (fromIndex: number, toIndex: number) => void
  clearQueue: () => void
  addQueue: (items: Item[] | Track[]) => void
  nextQueue: (items: Item[] | Track[]) => void
  removeQueue: (index: number) => void

  like: (ID: string, like: boolean) => void

  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

const useQueue = create<QueueStore>()(
  persist(
    (set, get) => ({
      track: 0,
      trackID: undefined,
      queue: [],
      repeat: 'off',

      setTrack: (index) => {
        set((state) => ({ track: index, trackID: state.queue[index].Id }))
      },
      prevTrack: async () => {
        const current = get().track
        const progress = useProgress.getState().progress
        if (progress < 1.0 && current !== 0) {
          set((state) => ({
            track: state.track - 1,
            trackID: state.queue[state.track - 1].Id,
          }))
        } else {
          emitter.emitp('seek', 0)
        }
      },
      nextTrack: () => {
        const current = get().track
        const length = get().queue.length
        const repeat = get().repeat
        if (current === length - 1) {
          if (repeat === 'queue') {
            set((state) => ({ track: 0, trackId: state.queue[0].Id }))
            emitter.emit('play')
          } else if (repeat == 'track') {
            console.log('repeat track?')
          } else {
            emitter.emitp('seek', usePlayer.getState().duration)
            usePlayer.getState().pause()
          }
        } else {
          set((state) => ({
            track: state.track + 1,
            trackID: state.queue[state.track + 1].Id,
          }))
        }
      },
      setRepeat: (mode) => {
        set(() => ({ repeat: mode }))
      },
      cycleRepeat: () => {
        const current = get().repeat
        get().setRepeat(
          current === 'off' ? 'queue' : current === 'queue' ? 'track' : 'off',
        )
      },

      setQueue: async (items, index = 0) => {
        const tracks = items.map((item) => itemToType(item) as Track)
        set(() => ({ queue: tracks, track: index, trackID: items[index].Id }))
        // await TrackPlayer.setQueue(items.map((item) => itemToRNTPTrack(item)))
        // await TrackPlayer.skip(index)
      },
      moveQueue: async (fromIndex, toIndex) => {
        const newQueue = [...get().queue]
        const removed = newQueue.splice(fromIndex, 1)
        newQueue.splice(toIndex, 0, removed[0]!)
        let newIndex = get().track
        if (fromIndex === newIndex) {
          newIndex = toIndex
        } else if (fromIndex < newIndex && toIndex >= newIndex) {
          newIndex--
        } else if (fromIndex > newIndex && toIndex <= newIndex) {
          newIndex++
        }
        set(() => ({
          queue: newQueue,
          track: newIndex,
          trackID: newQueue[newIndex].Id,
        }))
      },
      clearQueue: () => {
        set(() => ({ queue: [], track: 0, trackID: undefined }))
        emitter.emit('pause')
      },
      addQueue: (items) => {
        const oldLength = get().queue.length
        const tracks = items.map((item) => itemToType(item) as Track)
        set((state) => ({ queue: [...state.queue, ...tracks] }))
        if (oldLength === 0) set(() => ({ trackID: tracks[0].Id }))
      },
      nextQueue: (items) => {
        const oldLength = get().queue.length
        const tracks = items.map((item) => itemToType(item) as Track)
        set((state) => ({
          queue: [
            ...state.queue.slice(0, state.track + 1),
            ...tracks,
            ...state.queue.slice(state.track + 1),
          ],
        }))
        if (oldLength === 0) set(() => ({ trackID: tracks[0].Id }))
      },
      removeQueue: (index) => {
        const track = get().track
        const newQueue = [...get().queue]
        newQueue.splice(index, 1)
        set(() => ({ queue: newQueue }))
        if (track >= newQueue.length - 1 && newQueue.length > 0) {
          set(() => ({
            track: 0,
            trackID: newQueue[0].Id,
          }))
        } else if (index < track) {
          set(() => ({
            track: track - 1,
            trackID: newQueue[track - 1].Id,
          }))
        }
      },

      like: (ID, like) => {
        const queue = get().queue
        const indexes = queue
          .map((track, index) => (track.Id === ID ? index : -1))
          .filter((index) => index !== -1)
        for (let i = 0; i < indexes.length; i++) {
          if ('UserData' in queue[indexes[i]] && queue[indexes[i]].UserData) {
            queue[indexes[i]].UserData!.IsFavorite = like
          }
        }
      },

      hasHydrated: false,
      setHasHydrated: (state) => set(() => ({ hasHydrated: state })),
    }),
    {
      name: 'queue',
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

export default useQueue
