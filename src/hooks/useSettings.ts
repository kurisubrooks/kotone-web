import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SettingsStore {
  dark: boolean
  gain: boolean
  useLibrary: boolean

  setDark: (state: boolean) => void
  setGain: (state: boolean) => void
  setUseLibrary: (state: boolean) => void

  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      dark: true,
      gain: true,
      useLibrary: true,

      setDark: (state) => set(() => ({ dark: state })),
      setGain: (state) => set(() => ({ gain: state })),
      setUseLibrary: (state) => set(() => ({ useLibrary: state })),

      hasHydrated: false,
      setHasHydrated: (state) => set(() => ({ hasHydrated: state })),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

export default useSettings
