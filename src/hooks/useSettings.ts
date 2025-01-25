import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SettingsStore {
  dark: boolean

  setDark: (value: boolean) => void

  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

const useSettings = create<SettingsStore>()(
  persist(
    (set, get) => ({
      dark: true,

      setDark: (value) => set(() => ({ dark: value })),

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
