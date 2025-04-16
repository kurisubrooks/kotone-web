import { create } from 'zustand'

interface ProgressStore {
  progress: number
  setProgress: (value: number) => void
}

const useProgress = create<ProgressStore>()((set) => ({
  progress: 0,
  setProgress: (value) => set(() => ({ progress: value })),
}))

export default useProgress
