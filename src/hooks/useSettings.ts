import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SettingsStore {
  dark: boolean
  gain: boolean
  useLibrary: boolean

  RPC: boolean
  RPCImage: boolean
  RPCProxy: boolean
  RPCProxyURL: string

  setDark: (state: boolean) => void
  setGain: (state: boolean) => void
  setUseLibrary: (state: boolean) => void

  setRPC: (state: boolean) => void
  setRPCProxy: (state: boolean) => void
  setRPCProxyURL: (url: string) => void

  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      dark: true,
      gain: true,
      useLibrary: true,

      RPC: true,
      RPCImage: true,
      RPCProxy: false,
      RPCProxyURL: '',

      setDark: (state) => set(() => ({ dark: state })),
      setGain: (state) => set(() => ({ gain: state })),
      setUseLibrary: (state) => set(() => ({ useLibrary: state })),

      setRPC: (state) => set(() => ({ RPC: state })),
      setRPCProxy: (state) => set(() => ({ RPCProxy: state })),
      setRPCProxyURL: (url) => set(() => ({ RPCProxyURL: url })),

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
